import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    years: z.string(),
    order: z.number(),
    summary: z.string(),
    coverImage: z.string().optional(),
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
