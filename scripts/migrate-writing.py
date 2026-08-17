#!/usr/bin/env python3
"""
One-off migration: Squarespace WXR export -> src/content/writing/*.md

Run once from the site/ directory:
    python3 scripts/migrate-writing.py <path-to-export.xml>

Skips "all-under-one-roof-raving" (already migrated by hand via the CMS).
Downloads referenced images into public/images/writing/<slug>/ and rewrites
the body to reference the local copy.

Not meant to be re-run blindly — it will overwrite existing files for the
same slug. Safe to re-run for a clean import since it's idempotent per file.
"""
import html
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}

SITE_ROOT = Path(__file__).resolve().parent.parent
WRITING_DIR = SITE_ROOT / "src/content/writing"
IMAGES_DIR = SITE_ROOT / "public/images/writing"

SKIP_SLUGS = {"all-under-one-roof-raving"}

# Categories that map cleanly onto the schema's `type` enum.
# Everything else defaults to "journalism" except the dissertation, which
# reads as reflective/academic and fits "essay" better.
TYPE_OVERRIDES = {
    "my-dissertation": "essay",
}


def clean_title(raw: str) -> str:
    t = html.unescape(raw).replace("\xa0", " ")
    return re.sub(r"\s+", " ", t).strip()


def html_to_markdown(body_html: str) -> str:
    """Good-enough HTML -> markdown for Squarespace's block markup.
    Not a general-purpose converter — tuned to what this export contains:
    <p>, <br>, <em>, <strong>, <blockquote><h1> pull-quotes, <img>.
    """
    s = body_html

    # Pull-quotes: <blockquote><h1>text</h1></blockquote> -> "> text"
    def pullquote(m):
        text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        text = html.unescape(text)
        return f"\n\n> {text}\n\n"

    s = re.sub(r"<blockquote>\s*<h1[^>]*>(.*?)</h1>\s*</blockquote>", pullquote, s, flags=re.DOTALL)

    # Bold / italic
    s = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", s, flags=re.DOTALL)
    s = re.sub(r"<em[^>]*>(.*?)</em>", r"_\1_", s, flags=re.DOTALL)

    # Links
    s = re.sub(r'<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", s, flags=re.DOTALL)

    # Line breaks inside a paragraph -> keep as line break
    s = s.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")

    # Paragraphs: unwrap <p ...>...</p> -> text + blank line
    s = re.sub(r"<p[^>]*>(.*?)</p>", lambda m: m.group(1).strip() + "\n\n", s, flags=re.DOTALL)

    # Strip remaining container tags (divs, spans, headings we didn't handle explicitly)
    s = re.sub(r"</?div[^>]*>", "", s)
    s = re.sub(r"</?span[^>]*>", "", s)
    s = re.sub(r"<h[1-6][^>]*>(.*?)</h[1-6]>", r"\n\n## \1\n\n", s, flags=re.DOTALL)

    s = html.unescape(s)
    s = s.replace("\xa0", " ")

    # Collapse excess blank lines
    s = re.sub(r"\n{3,}", "\n\n", s).strip()
    return s


def extract_images(body_html: str) -> list[str]:
    return re.findall(r'<img[^>]+src="([^"]+)"', body_html)


def strip_images(body_html: str) -> str:
    return re.sub(r"<img[^>]*/?>", "", body_html)


def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp, open(dest, "wb") as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"  ! image download failed: {url} ({e})")
        return False


def yaml_escape(s: str) -> str:
    s = s.replace('"', '\\"')
    return f'"{s}"'


def main(xml_path: str):
    tree = ET.parse(xml_path)
    channel = tree.getroot().find("channel")
    items = channel.findall("item")

    WRITING_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    migrated = 0
    for item in items:
        link = item.findtext("link") or ""
        if not re.match(r"^/?writing/", link):
            continue

        post_name = item.findtext("wp:post_name", namespaces=NS)
        slug = post_name or link.strip("/").split("/")[-1]
        if slug in SKIP_SLUGS:
            continue

        title = clean_title(item.findtext("title") or slug)
        post_date = item.findtext("wp:post_date", namespaces=NS) or ""
        date = post_date.split(" ")[0] if post_date else "2020-01-01"

        categories = [c.text for c in item.findall("category") if c.get("domain") == "category"]
        cat_lower = [c.lower() if c else "" for c in categories]
        entry_type = TYPE_OVERRIDES.get(slug, "journalism")

        excerpt_raw = item.findtext("excerpt:encoded", namespaces=NS) or ""
        excerpt_text = re.sub(r"<[^>]+>", "", excerpt_raw)
        excerpt_text = html.unescape(excerpt_text).replace("\xa0", " ")
        excerpt_text = re.sub(r"\s+", " ", excerpt_text).strip()
        if not excerpt_text:
            excerpt_text = f"{title} — migrated from the old site, summary to be written."
        # Keep summary short; truncate on a word boundary.
        if len(excerpt_text) > 220:
            excerpt_text = excerpt_text[:220].rsplit(" ", 1)[0] + "…"

        body_raw = item.findtext("content:encoded", namespaces=NS) or ""
        image_urls = extract_images(body_raw)
        body_no_img = strip_images(body_raw)
        body_md = html_to_markdown(body_no_img)

        # Download images into a per-article folder, build markdown image refs.
        # Falls back to the original Squarespace URL if the download fails
        # (e.g. sandboxed network can't reach squarespace-cdn.com) so the
        # reference isn't lost — flagged with a comment for follow-up.
        image_lines = []
        if image_urls:
            article_img_dir = IMAGES_DIR / slug
            article_img_dir.mkdir(parents=True, exist_ok=True)
            for i, url in enumerate(image_urls, start=1):
                clean_url = url.split("?")[0]
                ext = Path(clean_url).suffix or ".jpg"
                filename = f"{slug}-{i}{ext}" if len(image_urls) > 1 else f"{slug}{ext}"
                dest = article_img_dir / filename
                ok = download_image(url, dest)
                if ok:
                    web_path = f"/images/writing/{slug}/{filename}"
                    image_lines.append(f"![]({web_path})")
                else:
                    image_lines.append(
                        f"<!-- TODO: image failed to download, still on Squarespace -->\n![]({url})"
                    )

        body_full = "\n\n".join(image_lines + ([body_md] if body_md else [])).strip()
        if not body_full:
            body_full = "<!-- Body to be written. -->"

        frontmatter = "\n".join([
            "---",
            f"title: {yaml_escape(title)}",
            f"date: {date}",
            f"type: {entry_type}",
            "draft: true",
            f"summary: {yaml_escape(excerpt_text)}",
            "---",
            "",
        ])

        out_path = WRITING_DIR / f"{slug}.md"
        out_path.write_text(frontmatter + body_full + "\n", encoding="utf-8")
        migrated += 1
        print(f"wrote {out_path.relative_to(SITE_ROOT)}  ({len(image_urls)} image(s))")

    print(f"\nMigrated {migrated} articles.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: migrate-writing.py <path-to-export.xml>")
        sys.exit(1)
    main(sys.argv[1])
