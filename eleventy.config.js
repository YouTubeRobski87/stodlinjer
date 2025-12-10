const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || '/';
const samlingarData = require('./src/_data/samlingar.json');
const { generateContentIndex } = require('./scripts/generate-content-index');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy({ 'src/_data': 'data' });
  eleventyConfig.addPassthroughCopy({ '.chatdata': 'chatdata' });

  eleventyConfig.addFilter('json', (value) => JSON.stringify(value));

  // Make baseUrl available in templates
  eleventyConfig.addGlobalData('baseUrl', pathPrefix === '/' ? '' : pathPrefix);

  // ISO 8601 date for Schema.org
  eleventyConfig.addFilter('isoDate', (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toISOString().split('T')[0];
  });

  eleventyConfig.addFilter('formatDate', (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    try {
      return new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' }).format(date);
    } catch (err) {
      return date.toISOString().split('T')[0];
    }
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
      input: 'src',
      output: 'site'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html']
  };
};
