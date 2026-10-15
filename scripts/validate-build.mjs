import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = join(root, "dist");
const checks = join(root, "checks");
const requiredRoutes = [
  "/",
  "/projects/",
  "/experience/",
  "/publication/",
  "/project/datacollection/",
  "/project/scrollytelling/",
  "/about/",
  "/contact/",
  "/work/federal-education-data/",
  "/work/skin-tone-mobility/",
  "/publication/wage-inequality-mexico/",
];
const sourceExtensions = new Set([".astro", ".css", ".json", ".md", ".mjs", ".ts", ".yaml", ".yml"]);
const ignoredDirectories = new Set([".astro", ".git", "checks", "dist", "node_modules"]);
const failures = [];
const log = [];

function filesIn(directory, filter = () => true) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      if (!ignoredDirectories.has(name)) files.push(...filesIn(path, filter));
    } else if (filter(path)) {
      files.push(path);
    }
  }
  return files;
}

function routeFile(route) {
  return route === "/" ? join(output, "index.html") : join(output, route, "index.html");
}

function internalTarget(href) {
  const path = href.split(/[?#]/, 1)[0];
  if (!path || !path.startsWith("/")) return null;
  if (extname(path)) return join(output, path);
  return routeFile(path.endsWith("/") ? path : `${path}/`);
}

if (!existsSync(output)) {
  throw new Error("Missing dist directory. Run npm run build first.");
}

for (const route of requiredRoutes) {
  const path = routeFile(route);
  const found = existsSync(path);
  log.push(`${found ? "PASS" : "FAIL"} route ${route}`);
  if (!found) failures.push(`Missing route: ${route}`);
}

const htmlFiles = filesIn(output, (path) => extname(path) === ".html");
let internalLinks = 0;
let inlineScripts = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const label = relative(root, file);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const isRedirect = html.includes("http-equiv=\"refresh\"");

  if (!canonical && !isRedirect) failures.push(`Missing canonical URL: ${label}`);
  if (canonical && !canonical.startsWith("https://andresnigenda.github.io/")) {
    failures.push(`Incorrect canonical URL: ${label}`);
  }

  const scripts = [...html.matchAll(/<script\b([^>]*)>/gi)];
  for (const [, attributes] of scripts) {
    if (!attributes.includes("application/ld+json")) inlineScripts += 1;
  }

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const target = internalTarget(match[1]);
    if (!target) continue;
    internalLinks += 1;
    if (!existsSync(target)) failures.push(`Broken internal link in ${label}: ${match[1]}`);
  }
}

const sourceFiles = filesIn(root, (path) => sourceExtensions.has(extname(path)));
const prohibitedSource = sourceFiles.filter((file) => readFileSync(file, "utf8").includes("\u2014"));
const generatedFiles = filesIn(output, (path) => [".css", ".html", ".js", ".txt", ".xml"].includes(extname(path)));
const prohibitedGenerated = generatedFiles.filter((file) => readFileSync(file, "utf8").includes("\u2014"));

for (const file of [...prohibitedSource, ...prohibitedGenerated]) {
  failures.push(`Prohibited character found: ${relative(root, file)}`);
}

if (inlineScripts > 0) failures.push(`Found ${inlineScripts} unexpected client script tags.`);

const metrics = {
  generated_html_files: htmlFiles.length,
  internal_links_checked: internalLinks,
  required_routes_checked: requiredRoutes.length,
  source_files_scanned: sourceFiles.length,
  generated_files_scanned: generatedFiles.length,
  unexpected_client_scripts: inlineScripts,
  failures: failures.length,
};

mkdirSync(checks, { recursive: true });
writeFileSync(join(checks, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
writeFileSync(join(checks, "log.txt"), `${[...log, ...failures].join("\n")}\n`);
writeFileSync(
  join(checks, "summary.md"),
  `# Build validation\n\n${failures.length === 0 ? "All automated build checks passed." : `${failures.length} checks failed.`}\n\n- Generated HTML files: ${htmlFiles.length}\n- Internal links checked: ${internalLinks}\n- Required routes checked: ${requiredRoutes.length}\n- Unexpected client scripts: ${inlineScripts}\n`,
);

console.log(JSON.stringify(metrics, null, 2));
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
