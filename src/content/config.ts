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
          })
        )
        .optional(), // real plate sequence, sharp-optimised via astro:assets
      exhibitionViews: z
        .array(
          z.object({
            src: image(),
            caption: z.string().optional(),
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
      draft: z.boolean().default(false),
    }),
});

const commercial = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/commercial' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['journalism', 'essay', 'project-writing']),
    publication: z.string().optional(),
    externalUrl: z.string().url().optional(), // if outbound-only
    relatedProject: z.string().optional(), // slug of related project
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, commercial, writing };
