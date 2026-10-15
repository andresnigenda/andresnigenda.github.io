import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const entrySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  year: z.number().int(),
  summary: z.string().min(1),
  work_type: z.string().min(1),
  organization: z.string().min(1),
  tags: z.array(z.string()).default([]),
  external_url: z.url().optional(),
  internal_page: z.boolean().default(true),
  image: z.string().optional(),
  image_alt: z.string().optional(),
  draft: z.boolean().default(false),
});

const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.{md,mdx}" }),
  schema: entrySchema,
});

const publications = defineCollection({
  loader: glob({ base: "./src/content/publications", pattern: "**/*.{md,mdx}" }),
  schema: entrySchema.extend({
    authors: z.array(z.string()).min(1),
    citation: z.string().optional(),
  }),
});

const siteData = defineCollection({
  loader: glob({ base: "./src/data", pattern: "site.yaml" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    organization: z.string(),
    canonical_url: z.url(),
    description: z.string(),
    role_line: z.string(),
    headline: z.string(),
    email: z.email(),
    portrait: z.object({
      mode: z.enum(["monogram", "image"]),
      file: z.string(),
      alt: z.string(),
    }),
    resume: z.object({ enabled: z.boolean(), file: z.string() }),
  }),
});

const profileData = defineCollection({
  loader: glob({ base: "./src/data", pattern: "profile.yaml" }),
  schema: z.object({
    biography: z.array(z.string()).length(2),
    biography_source: z.url(),
    about: z.object({
      headline: z.string(),
      path: z.string(),
      personal: z.string(),
    }),
    key_areas: z.array(z.object({ title: z.string(), description: z.string() })).length(3),
    profiles: z.array(z.object({ label: z.string(), url: z.url() })),
  }),
});

const experienceData = defineCollection({
  loader: glob({ base: "./src/data", pattern: "experience.yaml" }),
  schema: z.array(z.object({
    role: z.string(),
    organization: z.string(),
    period: z.string(),
    teams: z.array(z.string()).optional(),
    summary: z.string(),
    details: z.array(z.string()),
  })),
});

export const collections = {
  experienceData,
  profileData,
  publications,
  siteData,
  work,
};
