const fs = require('fs');
const path = require('path');

const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || '/';
const hasSrc = fs.existsSync(path.join(__dirname, 'src'));
const inputDir = hasSrc ? 'src' : '.';
const assetsDir = hasSrc ? 'src/assets' : 'assets';
const dataDir = hasSrc ? 'src/_data' : '_data';
const samlingarDataPath = fs.existsSync(path.join(__dirname, '_data', 'samlingar.json'))
  ? './_data/samlingar.json'
  : './src/_data/samlingar.json';
const samlingarData = require(samlingarDataPath);
const { generateContentIndex } = require('./scripts/generate-content-index');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy(assetsDir);
  eleventyConfig.addPassthroughCopy({ [dataDir]: 'data' });
  eleventyConfig.addPassthroughCopy({ '.chatdata': 'chatdata' });

  eleventyConfig.addFilter('json', (value) => JSON.stringify(value));

  // Make baseUrl available in templates
  eleventyConfig.addGlobalData('baseUrl', pathPrefix === '/' ? '' : pathPrefix);

  eleventyConfig.addFilter('formatDate', (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    try {
      return new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' }).format(date);
    } catch (err) {
      return date.toISOString().split('T')[0];
    }
  });

  eleventyConfig.addFilter('isoDate', (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  });

  eleventyConfig.addFilter('readingTime', (content) => {
    if (!content) return 1;
    const words = content.toString().trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  });

  eleventyConfig.addFilter('getSamling', (slug) =>
    samlingarData.find((item) => item.slug === slug)
  );

  eleventyConfig.addCollection('articles', (collectionApi) =>
    collectionApi
      .getFilteredByTag('artikel')
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection('samlingar', (collectionApi) => {
    const metaBySlug = samlingarData.reduce((acc, item) => {
      acc[item.slug] = item;
      return acc;
    }, {});

    const grouped = new Map();

    collectionApi.getFilteredByTag('artikel').forEach((post) => {
      if (post.data.draft) return;
      const slug = post.data.samling;
      if (!slug) return;

      if (!grouped.has(slug)) {
        grouped.set(slug, {
          slug,
          items: [],
          ...(metaBySlug[slug] || { title: slug, summary: '' })
        });
      }

      grouped.get(slug).items.push(post);
    });

    return Array.from(grouped.values())
      .map((entry) => ({
        ...entry,
        items: entry.items.sort((a, b) => b.date - a.date)
      }))
      .sort((a, b) => a.title.localeCompare(b.title, 'sv'));
  });

  eleventyConfig.on('eleventy.before', async () => {
    await generateContentIndex();
  });

  return {
    pathPrefix,
    dir: {
      input: inputDir,
      output: 'site',
      includes: '_includes',
      data: '_data'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html']
  };
};


