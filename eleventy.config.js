import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-relative URLs ("/about/") with pathPrefix (needed for GitHub Pages project sites).
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Posts with `draft: true` are skipped entirely (not built, not listed, not in RSS/sitemap).
  eleventyConfig.addPreprocessor("drafts", "md", (data) => (data.draft ? false : undefined));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date)
  );

  const d = (v) => (v instanceof Date ? v : new Date(v));
  eleventyConfig.addFilter("readableDate", (v) =>
    d(v).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (v) => d(v).toISOString().slice(0, 10));
  eleventyConfig.addFilter("rfc822", (v) => d(v).toUTCString());
  eleventyConfig.addFilter("absUrl", (path, base) => base.replace(/\/$/, "") + path);
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220)) + " min read";
  });
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // "/" for Cloudflare Pages and Netlify; "/<repo>/" for GitHub Pages project sites.
  pathPrefix: process.env.PATH_PREFIX || "/",
};
