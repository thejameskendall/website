import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      years: z.string(),
      order: z.number(),
      summary: z.string(),
      coverImage: z.string().optional(), // legacy placeholder path, used only if `images` is absent
      images: z
        .array(
          z.object({
            src: image(),
            caption: z.string().optional(),
            focus: z.string().optional(), // CSS object-position, e.g. "center top" or "50% 20%" — nudges the crop when centre-cropping cuts off the subject
          })
        )
        .optional(), // real plate sequence, sharp-optimised via astro:assets
      exhibitionViews: z
        .array(
          z.object({
            src: image(),
            caption: z.string().optional(),
            focus: z.string().optional(),
          })
        )
        .optional(),
      videoUrl: z.string().optional(), // to be added once the book video is ready
      documents: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          })
        )
        .optional(), // supplementary PDFs (research dossiers etc.), listed alongside Related Writing, open in a new tab
      relatedWriting: z.array(z.string()).optional(), // slugs of writing pieces
      companionProject: z.string().optional(), // slug of a paired/companion project, e.g. Made Beds <-> Unmade Beds
      draft: z.boolean().default(false),
    }),
});

const commercial = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/commercial' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      summary: z.string(),
      coverImage: z.string().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            caption: z.string().optional(),
            focus: z.string().optional(),
          })
        )
        .optional(), // gallery, sharp-optimised via astro:assets — same pattern as projects
      draft: z.boolean().default(false),
    }),
});

// Sveltia CMS writes an empty string for a blank optional text field rather
// than omitting the key. z.string().url() rejects '' outright, which crashed
// the build the first time the CMS saved an entry with External URL left
// blank. This treats '' the same as "not set" before validating.
const blankToUndefined = (v: unknown) => (v === '' ? undefined : v);

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['journalism', 'essay', 'project-writing']),
    publication: z.string().optional(),
    externalUrl: z.preprocess(blankToUndefined, z.string().url().optional()), // if outbound-only
    relatedProject: z.string().optional(), // slug of related project
    summary: z.string(),
    coverImage: z.string().optional(), // shown on the Writing index; plain path/URL, not sharp-processed
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, commercial, writing };
