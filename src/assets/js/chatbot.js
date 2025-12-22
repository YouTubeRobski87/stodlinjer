const BASE_URL = window.BASE_URL || '';
const CHATBOT_CONFIG = window.CHATBOT_CONFIG || { apiUrl: '', externalSources: [] };
const configuredSources = Array.isArray(CHATBOT_CONFIG.externalSources)
  ? CHATBOT_CONFIG.externalSources.slice()
  : [];

// Auto-detect API URL based on hosting platform
function getApiUrl() {
  // If explicitly configured (and not the default Netlify path), use that
  if (CHATBOT_CONFIG.apiUrl && CHATBOT_CONFIG.apiUrl !== '/.netlify/functions/chat') {
    return CHATBOT_CONFIG.apiUrl;
  }

  const hostname = window.location.hostname;

  // Vercel deployments: *.vercel.app or custom domains on Vercel
  const vercelDomains = [
    'vercel.app',
    'stodlinjer.jfageras.se',
    'jfageras.se'
  ];

  const isVercel = vercelDomains.some((domain) => hostname.includes(domain));
  if (isVercel) {
    return '/api/chat';
  }

  // Default to Netlify
  return '/.netlify/functions/chat';
}

const chatbotState = {
  isOpen: false,
  isSending: false,
  messages: [],
  contentIndex: [],
  sources: configuredSources.slice()
};

function getRandomGreeting() {
  const greetings = CHATBOT_CONFIG.greetings || ['Hej. Hur är det med dig?'];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

const CHATBOT_COPY = {
  unavailable:
    'Jag saknar AI-anslutning just nu, men här är innehåll jag hittade som matchar din fråga.'
};

function normalizeSupportLine(line) {
  if (!line) return null;
  const url = line.resource?.url;
  const openingHours = line.availability?.openingHours;
  return {
    title: line.title || line.name,
    url,
    type: line.resource?.type || (url ? 'link' : 'link'),
    contactTypes: Array.isArray(line.contactTypes) ? line.contactTypes : undefined,
    phone: line.phone,
    hoursLabel: line.availability?.label,
    hours: line.availability?.label,
    timezone: line.availability?.timezone,
    openingHours: Array.isArray(openingHours) ? openingHours : undefined
  };
}

async function loadSupportSources() {
  try {
    const res = await fetch(`${BASE_URL}/data/supportData.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Kunde inte ladda data (${res.status})`);
    const data = await res.json();
    if (!Array.isArray(data)) return;
    const supportSources = data
      .filter((line) => line && line.active !== false)
      .map(normalizeSupportLine)
      .filter((source) => source && (source.title || source.url || source.phone));
    chatbotState.sources = [...supportSources, ...configuredSources];
  } catch (err) {
    console.warn('Kunde inte ladda supportData.json för chatbotten:', err);
  }
}

function renderMessage(logEl, { role, content, sources = [] }) {
  const row = document.createElement('div');
  row.className = `chatbot-message-row ${role}`;

  const bubble = document.createElement('div');
  bubble.className = `chatbot-message ${role}`;
  const lines = (content || '').split('\n');
  lines.forEach((line, idx) => {
    bubble.appendChild(document.createTextNode(line));
    if (idx < lines.length - 1) bubble.appendChild(document.createElement('br'));
  });

  if (sources.length) {
    const wrap = document.createElement('div');
    wrap.className = 'chatbot-sources';
    sources.forEach((src) => {
      const tag = document.createElement('span');
      tag.className = 'chatbot-source';
      const icon = src.type === 'pdf' ? '📄' : src.type === 'link' ? '🔗' : '📌';
      const metaParts = [];
      if (Array.isArray(src.contactTypes) && src.contactTypes.length) {
        metaParts.push(src.contactTypes.join(', '));
      }
      if (src.phone) metaParts.push(`Tel: ${src.phone}`);
      if (src.hours) metaParts.push(src.hours);
      const meta = metaParts.length ? ` — ${metaParts.join(' · ')}` : '';
      const label = `${icon} ${src.title || 'Källa'}${meta}`;
      if (src.url) {
        const link = document.createElement('a');
        link.href = src.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = label;
        tag.appendChild(link);
      } else {
        tag.textContent = label;
      }
      wrap.appendChild(tag);
    });
    bubble.appendChild(wrap);
  }

  row.appendChild(bubble);
  logEl.appendChild(row);
  logEl.scrollTop = logEl.scrollHeight;
}

function tokenize(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function entryUrl(entry) {
  if (entry.type === 'artikel' && entry.id) {
    return `${BASE_URL}/${entry.id.replace(/^\/+/, '')}/`;
  }
  return null;
}

function rankEntries(query, limit = 5) {
  const tokens = tokenize(query);
  if (!tokens.length || !chatbotState.contentIndex.length) return [];

  return chatbotState.contentIndex
    .map((entry) => {
      const haystack = `${entry.title || ''} ${entry.content || ''} ${(entry.tags || []).join(
        ' '
      )}`.toLowerCase();
      let score = 0;
      tokens.forEach((token) => {
        if (!token) return;
        if (haystack.includes(token)) score += 1;
        if ((entry.title || '').toLowerCase().includes(token)) score += 3;
      });
      if (entry.type === 'supportline') score += 0.5;
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function buildContext(query) {
  const matches = rankEntries(query, 6);
  return matches.map(({ entry }) => ({
    id: entry.id,
    title: entry.title,
    type: entry.type,
    samling: entry.samling,
    content: (entry.content || '').slice(0, 1200),
    url: entryUrl(entry)
  }));
}

function formatFallback(context) {
  if (!context.length) {
    return {
      text: 'Jag hittade inget direkt i innehållet. Prova gärna med andra ord eller nämn ett tema som “suicid”, “våld” eller “ångest”.',
      sources: chatbotState.sources
    };
  }

  const bullets = context
    .slice(0, 3)
    .map((item) => {
      const excerpt = (item.content || '').replace(/\s+/g, ' ').slice(0, 180);
      return `• ${item.title} (${item.type}${
        item.samling ? ` · ${item.samling}` : ''
      }): ${excerpt}…`;
    })
    .join('\n');

  const sourceTags = context.map((item) => ({
    title: item.title,
    type: item.type,
    url: entryUrl(item)
  }));

  return {
    text: `${CHATBOT_COPY.unavailable}\n\n${bullets}`,
    sources: [...sourceTags.filter((s) => s.url), ...chatbotState.sources]
  };
}

async function fetchContentIndex() {
  try {
    const res = await fetch(`${BASE_URL}/chatdata/content-index.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    chatbotState.contentIndex = await res.json();
  } catch (err) {
    console.warn('Kunde inte ladda content-index.json', err);
  }
}

async function sendToApi(query, context) {
  const apiUrl = getApiUrl();
  if (!apiUrl) return null;

  const payload = {
    messages: chatbotState.messages.concat([{ role: 'user', content: query }]),
    context,
    externalSources: chatbotState.sources
  };

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`API svarade ${res.status}`);
  return res.json();
}

function initChatbot() {
  const root = document.querySelector('[data-chatbot]');
  if (!root) return;

  const toggle = root.querySelector('[data-chatbot-toggle]');
  const closeBtn = root.querySelector('[data-chatbot-close]');
  const panel = root.querySelector('[data-chatbot-panel]');
  const log = root.querySelector('[data-chatbot-log]');
  const form = root.querySelector('[data-chatbot-form]');
  const input = root.querySelector('[data-chatbot-input]');
  const sendBtn = root.querySelector('[data-chatbot-send]');
  const emptyState = root.querySelector('[data-chatbot-empty]');

  const setToggleVisibility = () => {
    toggle.classList.toggle('is-hidden', chatbotState.isOpen);
  };

  renderMessage(log, { role: 'bot', content: getRandomGreeting() });
  if (emptyState) emptyState.remove();

  toggle.addEventListener('click', () => {
    chatbotState.isOpen = !chatbotState.isOpen;
    panel.classList.toggle('is-open', chatbotState.isOpen);
    toggle.setAttribute('aria-expanded', chatbotState.isOpen ? 'true' : 'false');
    setToggleVisibility();
    if (chatbotState.isOpen) {
      input.focus();
      fetchContentIndex();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatbotState.isOpen = false;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    setToggleVisibility();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value || chatbotState.isSending) return;

    chatbotState.isSending = true;
    input.value = '';
    if (emptyState) emptyState.remove();

    renderMessage(log, { role: 'user', content: value });
    chatbotState.messages.push({ role: 'user', content: value });
    sendBtn.disabled = true;

    try {
      const context = buildContext(value);
      const apiResult = await sendToApi(value, context);

      if (apiResult && apiResult.answer) {
        const sourceTags = (apiResult.sources || []).map((src) => ({
          title: src.title || src.id || 'Källa',
          url: src.url || entryUrl(src),
          type: src.type || 'link',
          contactTypes: src.contactTypes,
          phone: src.phone,
          hours: src.hoursLabel || src.hours
        }));
        renderMessage(log, { role: 'bot', content: apiResult.answer, sources: sourceTags });
        chatbotState.messages.push({ role: 'assistant', content: apiResult.answer });
      } else {
        const fallback = formatFallback(context);
        renderMessage(log, { role: 'bot', content: fallback.text, sources: fallback.sources });
        chatbotState.messages.push({ role: 'assistant', content: fallback.text });
      }
    } catch (err) {
      console.error('Chatbot API error', err);
      const fallback = formatFallback(buildContext(value));
      renderMessage(log, {
        role: 'bot',
        content: `${CHATBOT_COPY.unavailable}\n\n${fallback.text}`,
        sources: fallback.sources
      });
      chatbotState.messages.push({ role: 'assistant', content: fallback.text });
    } finally {
      chatbotState.isSending = false;
      sendBtn.disabled = false;
      log.scrollTop = log.scrollHeight;
    }
  });
}

loadSupportSources();
document.addEventListener('DOMContentLoaded', initChatbot);
