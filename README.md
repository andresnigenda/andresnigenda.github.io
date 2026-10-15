# Andrés Nigenda personal website

This repository contains the source for [andresnigenda.github.io](https://andresnigenda.github.io/). It is a static Astro site built with TypeScript, Astro components, content collections, YAML data, and plain CSS.

The site replaced a Hugo Blox installation. The migration retained the public work entries, publication, profile details, and important URLs. It intentionally retired the old theme, generated Hugo output, outdated résumé, decorative theme assets, and project card thumbnails. All retired material remains available in Git history.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

The dependency versions are recorded in `package-lock.json`.

## Install dependencies

From the repository root:

```sh
npm install
```

If Astro cannot write its optional telemetry preference in a restricted environment, prefix commands with `ASTRO_TELEMETRY_DISABLED=1`.

## Run the development server

```sh
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:4321/`.

## Run checks

```sh
npm run check
npm run build
npm run validate
```

These commands run Astro's TypeScript and content schema checks, create the production output, and validate required routes, internal links, canonical URLs, client scripts, and prohibited characters. A malformed Markdown front matter field or YAML value will identify the affected file and field. Validation artifacts are written to the ignored `checks/` directory.

## Build the production site

```sh
npm run build
```

The static site is written to `dist/`.

## Preview the production build

```sh
npm run preview
```

Open the local URL printed in the terminal. Previewing `dist/` is the closest local check of the GitHub Pages output.

## Project structure

```text
src/
  components/             Shared interface components
  content/
    work/                  Projects, reports, tools, and talks
    publications/          Publications and working papers
  data/
    site.yaml              Homepage, contact, portrait, and résumé settings
    profile.yaml           Homepage bio, About copy, key areas, and profile links
    experience.yaml        Career roles shown on the Work page
  layouts/                 Page shell and metadata
  pages/                   Routes and compatibility redirects
  styles/                  Global visual system
public/
  fonts/                   Locally hosted Source font files and licenses
  images/                  Portrait and other directly served images
  files/                   Optional résumé and other downloads
```

`src/content.config.ts` contains the validation schemas. Personal copy should not be added to components or styles.

## Updating content

All routine content edits happen in Markdown or YAML. YAML indentation matters: use spaces, not tabs.

### 1. Update the homepage text

Edit `src/data/site.yaml`:

```yaml
headline: I use data science to answer questions about education, technology, and policy
```

The `role_line` appears above the headline.

The homepage also reads the `resume` block. While `enabled` is `false`, it shows a disabled Download CV action. Add the file at the configured path and set `enabled: true` to activate the download.

### 2. Update the homepage bio and key areas

Edit `src/data/profile.yaml`. The two-item `biography` list supplies the short bio and `biography_source` links to its source. The `about` block supplies the more personal About-page copy. The `key_areas` list must contain exactly three entries, each with a title and concise description.

Edit `src/data/experience.yaml` to update the concise career chronology on the Work page.

### 3. Add a work entry

Copy an existing file in `src/content/work/` and give it a short lowercase filename, for example `ai-research-repository.md`.

```yaml
---
title: Example project title
slug: example-project
year: 2026
summary: One factual sentence describing the work.
work_type: Tool
organization: Stanford University
tags:
  - Natural language processing
  - Education
external_url: https://example.com/
internal_page: true
draft: false
---

Longer description for the internal page.
```

Required fields are `title`, `slug`, `year`, `summary`, `work_type`, and `organization`. Tags can be an empty list. The external URL and image fields are optional.

Set `internal_page: false` to link the index directly to `external_url`. Set `draft: true` to exclude the entry from production pages.

The Work page combines nondraft work entries and publications under “Selected projects,” ordered by year. Publications also remain available on the publication index.

### 4. Add a publication

Copy an existing file in `src/content/publications/`. Publication fields match work fields and also require an `authors` list.

```yaml
authors:
  - Andrés Nigenda
  - Collaborator Name
citation: Organization or journal, 2026.
```

Do not add a publication unless its title, authorship, year, and link are verified.

### 5. Add or replace an image

For the homepage portrait:

1. Add an image at `public/images/portrait-top-20.jpg`.
2. In `src/data/site.yaml`, change `portrait.mode` from `monogram` to `image`.
3. Update `portrait.alt` if needed.

The current portrait asset has the top 20% removed and uses a matching frame. Keep replacement images reasonably sized and compressed.

The browser-tab icon is `public/images/favicon.png`. It should be a small square image; browsers may cache an earlier version during local review.

The About page uses `public/images/about-hike.jpg` and `public/images/about-dog.jpg`.

For a work image, store it next to the Markdown entry when practical, then set the optional `image` and `image_alt` fields. Images are not displayed by the current index design, but the schema retains these fields for future detail-page use.

### 6. Replace and enable the résumé

The old résumé was intentionally removed because it was outdated.

1. Add the new file at `public/files/resume.pdf`.
2. In `src/data/site.yaml`, set `resume.enabled` to `true`.

The path is already configured as `/files/resume.pdf`. If the filename changes, update `resume.file` in the same YAML block. No component changes are required.

### 7. Update social links

Edit the `profiles` list in `src/data/profile.yaml`:

```yaml
profiles:
  - label: GitHub
    url: https://github.com/andresnigenda
```

Update the email address in `src/data/site.yaml`.

### 8. Preview changes locally

Run:

```sh
npm install
npm run check
npm run build
npm run preview
```

Review the Home, Work, Contact, publication, and 404 pages at desktop and mobile widths.

### 9. Submit an edit through GitHub

1. Open the file in GitHub.
2. Select the edit button.
3. Make the Markdown or YAML change.
4. Use the Preview tab for Markdown when available.
5. Commit the change to a new branch.
6. Open a pull request.
7. Wait for the checks and review the change before merging.

Do not edit generated files in `dist/`. They are rebuilt automatically.

## Routes retained from Hugo

- `/` remains the homepage.
- `/projects/` is the work index.
- `/contact/` is the contact page.
- `/about/` is the personal About page.
- `/experience/` redirects to the combined Work page for compatibility.
- `/publication/` is the publication index.
- `/project/datacollection/` redirects to the migrated report page.
- `/project/scrollytelling/` redirects to the original interactive visualization.

## Deployment to GitHub Pages

The workflow at `.github/workflows/deploy.yml` uses Astro's official GitHub Pages action. It runs automatically only after changes reach `main`, or when a maintainer starts it manually with `workflow_dispatch`.

Before deployment:

1. Run `npm run check`.
2. Run `npm run build`.
3. Run `npm run preview` and inspect the production build.
4. Confirm the canonical URL is `https://andresnigenda.github.io/`.
5. Obtain explicit approval to publish.
6. Merge or push the verified changes to `main` only after approval.

No deployment is performed by local development commands.
