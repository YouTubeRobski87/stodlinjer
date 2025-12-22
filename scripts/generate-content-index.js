const fs = require('fs/promises');
const path = require('path');
const fg = require('fast-glob');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', '_data');
const ARTICLES_DIR = path.join(ROOT_DIR, 'src', 'artiklar');
const OUTPUT_DIR = path.join(ROOT_DIR, '.chatdata');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'content-index.json');

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

const ENTITY_MAP = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>'
};

const blockBreakPattern = /<\/(p|div|h[1-6]|li|ul|ol|br|section|article|blockquote)>/gi;

function slugify(value) {
  return value
    ? value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';
}

function decodeEntities(text) {
  return text.replace(/&([a-z]+);/gi, (match, entity) => ENTITY_MAP[entity] ?? match);
}

function cleanText(html) {
  const withBreaks = html.replace(blockBreakPattern, '\n');
  const noTags = withBreaks.replace(/<[^>]+>/g, ' ');
  const decoded = decodeEntities(noTags);
  const collapsed = decoded
    .replace(/\r?\n\s*\n+/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .trim();
  return collapsed;
}

function markdownToText(markdown = '') {
  const html = md.render(markdown);
  return cleanText(html);
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return undefined;
  const unique = Array.from(new Set(tags.filter(Boolean)));
  return unique.length ? unique : undefined;
}

function mapSupportData(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item && item.active !== false)
    .map((item, index) => {
      const title = item.title || item.name || `Supportline ${item.id ?? index + 1}`;
      const fallbackId = item.id ?? (slugify(title) || index + 1);
      const availabilityLabel = item.availability?.label;
      const parts = [];
      if (item.description) parts.push(item.description);
      if (availabilityLabel) parts.push(`Tillgänglighet: ${availabilityLabel}`);
      if (item.phone) parts.push(`Telefon: ${item.phone}`);
      if (item.resource?.url) parts.push(`Mer info: ${item.resource.url}`);

      return {
        id: `supportline-${fallbackId}`,
        title,
        type: 'supportline',
        samling: null,
        content: parts.join('\n'),
        tags: normalizeTags([
          'supportline',
          item.category,
          ...(Array.isArray(item.tags) ? item.tags : [])
        ])
      };
    });
}

function mapQuotes(data) {
  if (!Array.isArray(data)) return [];
  return data.map((item, index) => ({
    id: `quote-${index + 1}`,
    title: item.author ? `Citat av ${item.author}` : 'Citat',
    type: 'quote',
    samling: null,
    content: [item.text, item.author ? `— ${item.author}` : ''].filter(Boolean).join('\n'),
    tags: normalizeTags(['quote'])
  }));
}

function mapSamlingar(data) {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.slug || slugify(item.title) || 'samling',
    title: item.title || item.slug || 'Samling',
    type: 'samling',
    samling: null,
    content: [item.summary, item.description].filter(Boolean).join('\n\n'),
    tags: normalizeTags(['samling', item.slug])
  }));
}

function mapGenericDataset(name, data) {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const title = item.title || item.name || `${name} ${index + 1}`;
      const fallbackId = item.id ?? (slugify(title) || index + 1);
      const contentPieces = [
        item.description,
        item.text,
        item.content,
        item.summary,
        item.number ? `Telefon: ${item.number}` : null,
        item.url ? `Länk: ${item.url}` : null
      ].filter(Boolean);

      return {
        id: `${slugify(name) || 'data'}-${fallbackId}`,
        title,
        type: name,
        samling: item.samling || null,
        content: contentPieces.join('\n'),
        tags: normalizeTags(item.tags)
      };
    });
  }

  if (data && typeof data === 'object') {
    const contentPieces = Object.entries(data).map(([key, value]) => `${key}: ${value}`);
    return [
      {
        id: slugify(name) || name,
        title: data.title || data.name || name,
        type: name,
        samling: null,
        content: contentPieces.join('\n'),
        tags: undefined
      }
    ];
  }

  return [];
}

function mapJsonDataset(name, data) {
  if (name === 'supportData') return mapSupportData(data);
  if (name === 'support-lines') return [];
  if (name === 'quotes') return mapQuotes(data);
  if (name === 'samlingar') return mapSamlingar(data);
  return mapGenericDataset(name, data);
}

async function readJsonData() {
  const files = await fg('**/*.json', { cwd: DATA_DIR });
  const entries = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const datasetName = path.basename(file, '.json');
    entries.push(...mapJsonDataset(datasetName, parsed));
  }

  return entries;
}

/**
 * Strip date prefix from filename to match Eleventy's URL generation.
 * Eleventy removes YYYY-MM-DD- prefixes from filenames when generating URLs.
 * e.g., "2025-11-12-my-article" becomes "my-article"
 */
function stripDatePrefix(filename) {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

async function readArticles() {
  const files = await fg('**/*.md', { cwd: ARTICLES_DIR });
  const entries = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);
    
    // Build the URL path matching Eleventy's output structure:
    // - Add /artiklar/ prefix
    // - Strip date prefix from filename
    // e.g., "samtalsstod/2025-11-12-my-article.md" -> "artiklar/samtalsstod/my-article"
    const parts = file.replace(/\.md$/, '').split(path.sep);
    const lastPart = parts[parts.length - 1];
    parts[parts.length - 1] = stripDatePrefix(lastPart);
    const relativeId = 'artiklar/' + parts.join('/');

    const textBody = markdownToText(parsed.content || '');
    const description = parsed.data.description ? parsed.data.description.trim() : '';
    const combinedContent = [description, textBody].filter(Boolean).join('\n\n');

    const tags = normalizeTags([
      'artikel',
      parsed.data.samling,
      ...(Array.isArray(parsed.data.tags) ? parsed.data.tags : [])
    ]);

    entries.push({
      id: relativeId,
      title: parsed.data.title || path.basename(file, '.md'),
      type: 'artikel',
      samling: parsed.data.samling || null,
      content: combinedContent,
      tags
    });
  }

  return entries;
}

async function generateContentIndex() {
  const dataEntries = await readJsonData();
  const articleEntries = await readArticles();
  const allEntries = [...dataEntries, ...articleEntries];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(allEntries, null, 2), 'utf8');

  return { count: allEntries.length, output: OUTPUT_FILE };
}

module.exports = { generateContentIndex };

if (require.main === module) {
  generateContentIndex()
    .then(({ count, output }) => {
      console.log(`✅ Generated ${count} index entries -> ${output}`);
    })
    .catch((error) => {
      console.error('Failed to generate content index:', error);
      process.exit(1);
    });
}
