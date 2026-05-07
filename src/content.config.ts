import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const links = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/links" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    url: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/prompts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, links, prompts };

