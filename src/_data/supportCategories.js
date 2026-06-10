// Single source of truth for the support-line category taxonomy shown on the
// start page. The labels/colors/priority come straight from supportData.new.json
// (the canonical data file); here we only map each category's source icon name
// (lucide-style) to a symbol that exists in the project's sprite sheets and sort
// by priority so the filter buttons render in a sensible order.
//
// Consumed by:
//   - src/_includes/partials/sections/search-filters.njk  (filter buttons)
//   - src/_includes/layouts/base.njk                       (embedded JSON for app.js card icons)
//   - src/index.njk                                        (category count stat)

const source = require('./supportData.new.json');

// Map each category id to a sprite symbol. The .new.json icons use lucide names
// (e.g. "triangle-alert", "hand-heart") that don't all exist in our sprite, and
// several categories reuse the same source icon, so we map per id to keep every
// category visually distinct using symbols known to be in st-line/st-solid.svg.
const ICON_BY_ID = {
  acute_emergency: 'warning-triangle',
  mental_health: 'brain',
  violence_abuse: 'shield',
  children_youth: 'users',
  family_parenting: 'group',
  substance_use: 'wine-glass-2',
  gambling: 'coins',
  eating_disorders: 'heart-1',
  grief_loss: 'candle',
  identity_inclusion: 'rainbow',
  care_guidance: 'headset-1',
  rights_public_authority: 'scale',
  community_social_support: 'handshake'
};

const categories = (source.categories || [])
  .slice()
  .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
  .map((category) => ({
    id: category.id,
    label: category.label,
    description: category.description || '',
    color: category.color || '',
    icon: ICON_BY_ID[category.id] || 'life-ring-2'
  }));

module.exports = categories;
