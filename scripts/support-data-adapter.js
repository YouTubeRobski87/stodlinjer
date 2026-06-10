const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_SOURCE = path.join(ROOT_DIR, 'src', '_data', 'supportData.new.json');
const DEFAULT_TARGET = path.join(ROOT_DIR, 'src', '_data', 'supportData.json');

const CATEGORY_MAP = {
  acute_emergency: 'ovrigt',
  mental_health: 'psykisk-halsa',
  violence_abuse: 'vald',
  children_youth: 'barn-unga',
  family_parenting: 'anhoriga',
  substance_use: 'missbruk',
  gambling: 'missbruk',
  eating_disorders: 'psykisk-halsa',
  grief_loss: 'sorg-forlust',
  identity_inclusion: 'ovrigt',
  care_guidance: 'ovrigt',
  rights_public_authority: 'ovrigt',
  community_social_support: 'ovrigt'
};

const CHANNEL_LABELS = {
  phone: 'telefon',
  chat: 'chatt',
  web: 'webb',
  email: 'e-post',
  sms: 'sms'
};

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

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

function normalizeTags(values) {
  return unique(
    values
      .flat()
      .filter(Boolean)
      .map((value) => slugify(value))
      .filter(Boolean)
  );
}

function getSupportLines(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.supportLines)) return data.supportLines;
  throw new Error('Expected support data to be an array or an object with supportLines[]');
}

function getFirstContactMethod(line, channel) {
  return (line.contactMethods || []).find((method) => method && method.channel === channel);
}

function getContactUrl(line) {
  const preferred =
    (line.contactMethods || []).find((method) => method && method.url && method.channel !== 'phone') ||
    (line.contactMethods || []).find((method) => method && method.url);

  return preferred?.url || line.source?.primaryUrl || line.source?.secondaryUrl || '';
}

function getAvailability(line, primaryPhoneMethod) {
  const methodWithHours =
    primaryPhoneMethod ||
    (line.contactMethods || []).find((method) => Array.isArray(method.openingHours));

  return {
    label: line.display?.availabilityLabel || '',
    timezone:
      methodWithHours?.openingHours?.find((entry) => entry && entry.timezone)?.timezone ||
      'Europe/Stockholm',
    openingHours: Array.isArray(methodWithHours?.openingHours) ? methodWithHours.openingHours : []
  };
}

function normalizeLine(line, index) {
  const title = line.title || line.name || `Stödlinje ${index + 1}`;
  const phoneMethod = getFirstContactMethod(line, 'phone');
  const phone = phoneMethod?.value || line.phone || '';
  const url = getContactUrl(line);
  const category = CATEGORY_MAP[line.category] || line.category || 'ovrigt';
  const contactTypes = unique(
    (line.contactMethods || []).map((method) => CHANNEL_LABELS[method?.channel] || method?.channel)
  );
  const tags = normalizeTags([
    category,
    line.type,
    line.organization,
    line.helpsWith || [],
    line.targetGroups || [],
    line.accessibility?.languages || []
  ]);

  return {
    id: line.id || slugify(title) || index + 1,
    slug: line.slug || slugify(title),
    title,
    resource: {
      url,
      type: 'link'
    },
    contactTypes,
    phone,
    description: line.shortDescription || line.longDescription || '',
    category,
    urgent: line.urgency?.level === 'urgent' || line.category === 'acute_emergency',
    tags,
    availability: getAvailability(line, phoneMethod),
    lastVerified: line.metadata?.lastVerified || line.source?.checkedAt || '',
    active: line.active !== false && line.status !== 'inactive',
    metadata: line.metadata || undefined
  };
}

function normalizeSupportData(data) {
  return getSupportLines(data).map(normalizeLine);
}

function adaptSupportData({ source = DEFAULT_SOURCE, target = DEFAULT_TARGET } = {}) {
  const raw = fs.readFileSync(source, 'utf8');
  const parsed = JSON.parse(raw);
  const normalized = normalizeSupportData(parsed);
  fs.writeFileSync(target, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return { source, target, count: normalized.length };
}

module.exports = {
  adaptSupportData,
  normalizeSupportData
};

if (require.main === module) {
  try {
    const result = adaptSupportData();
    console.log(`Adapterade ${result.count} stödlinjer -> ${path.relative(ROOT_DIR, result.target)}`);
  } catch (error) {
    console.error('Kunde inte adaptera supportdata:', error.message);
    process.exit(1);
  }
}
