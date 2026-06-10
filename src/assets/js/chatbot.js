const BASE_URL = window.BASE_URL || '';
const CHATBOT_CONFIG = window.CHATBOT_CONFIG || { apiUrl: '', externalSources: [] };
const configuredSources = Array.isArray(CHATBOT_CONFIG.externalSources)
  ? CHATBOT_CONFIG.externalSources.slice()
  : [];

function getApiUrl() {
  const apiEnabled = CHATBOT_CONFIG.apiEnabled === true;
  const apiUrl = typeof CHATBOT_CONFIG.apiUrl === 'string' ? CHATBOT_CONFIG.apiUrl.trim() : '';
  return apiEnabled && apiUrl ? apiUrl : null;
}

const chatbotState = {
  isOpen: false,
  isSending: false,
  messages: [],
  contentIndex: [],
  sources: configuredSources.slice()
};

function getRandomGreeting() {
  const greetings = CHATBOT_CONFIG.greetings || ['Hej, hur är det med dig?'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const safeGreeting = String(greeting || '').trim();
  if (!safeGreeting) return 'Hej, hur är det med dig?';
  return safeGreeting;
}

const CHATBOT_COPY = {
  inactive:
    'AI-chatten är inte aktiv just nu. Använd gärna sökningen på sidan för att hitta stödlinjer, telefonnummer och artiklar.',
  unavailable:
    'AI-chatten är inte aktiv just nu. Använd gärna sökningen på sidan för att hitta stödlinjer, telefonnummer och artiklar.'
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

function readEmbeddedSupportLines() {
  const dataEl = document.getElementById('supportLinesData');
  if (!dataEl) return [];

  try {
    const data = JSON.parse(dataEl.textContent || '[]');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Kunde inte läsa inbäddad stödlinjedata för chatbotten:', err);
    return [];
  }
}

function loadSupportSources() {
  const supportSources = readEmbeddedSupportLines()
    .filter((line) => line && line.active !== false)
    .map(normalizeSupportLine)
    .filter((source) => source && (source.title || source.url || source.phone));

  chatbotState.sources = [...supportSources, ...configuredSources];
}

function normalizeBotText(text) {
  const lines = text.split('\n');
  const outputLines = [];
  let pendingItems = [];
  let lastWasBlank = false;

  const flushItems = () => {
    if (!pendingItems.length) return;
    outputLines.push(pendingItems.join(' '));
    pendingItems = [];
    lastWasBlank = false;
  };

  lines.forEach((line) => {
    const withoutLinks = line
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, '$1')
      .replace(/\bhttps?:\/\/[^\s)]+/gi, '')
      .replace(/\bwww\.[^\s)]+/gi, '')
      .replace(/\b[^\s]+\.(se|com|net|org|nu|info|io|ai)(\/[^\s]*)?/gi, '')
      .replace(/[📌•\u2022]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const trimmed = withoutLinks.trim();
    if (!trimmed) {
      flushItems();
      if (!lastWasBlank) {
        outputLines.push('');
        lastWasBlank = true;
      }
      return;
    }

    const listMatch = trimmed.match(
      /^(\*|-|\u2013|\u2014|\u2022|\uD83D\uDCCC|\d+[.)\]])\s*(.*)$/
    );
    if (listMatch) {
      if (listMatch[2]) {
        pendingItems.push(listMatch[2]);
      }
      lastWasBlank = false;
      return;
    }

    flushItems();
    outputLines.push(withoutLinks);
    lastWasBlank = false;
  });

  flushItems();
  while (outputLines.length && outputLines[0] === '') outputLines.shift();
  while (outputLines.length && outputLines[outputLines.length - 1] === '') outputLines.pop();
  return outputLines.join('\n');
}

function renderMessage(logEl, { role, content, sources = [] }) {
  const row = document.createElement('div');
  row.className = `chatbot-message-row ${role}`;

  const bubble = document.createElement('div');
  bubble.className = `chatbot-message ${role}`;
  const rawText = content == null ? '' : String(content);
  const text = role === 'bot' ? normalizeBotText(rawText) : rawText;
  const paragraphs = text
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0);

  if (!paragraphs.length) {
    bubble.textContent = '';
  } else {
    paragraphs.forEach((paragraph) => {
      const p = document.createElement('p');
      const lines = paragraph.split('\n');
      lines.forEach((line, idx) => {
        p.appendChild(document.createTextNode(line));
        if (idx < lines.length - 1) p.appendChild(document.createElement('br'));
      });
      bubble.appendChild(p);
    });
  }

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
      text: CHATBOT_COPY.inactive,
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

function formatInactiveFallback() {
  return {
    text: CHATBOT_COPY.inactive,
    sources: chatbotState.sources
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

  if (!res.ok) return null;

  const text = await res.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
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
  const footer = document.querySelector('.footer-shell');
  let footerOffsetFrame = null;

  const updateFooterOffset = () => {
    footerOffsetFrame = null;

    if (!footer) {
      root.style.setProperty('--chatbot-footer-offset', '0px');
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const footerTop = footer.getBoundingClientRect().top;
    const footerGap = window.matchMedia('(max-width: 640px)').matches ? 16 : 24;
    const offset = Math.max(0, viewportHeight - footerTop + footerGap);
    root.style.setProperty('--chatbot-footer-offset', `${Math.ceil(offset)}px`);
  };

  const scheduleFooterOffsetUpdate = () => {
    if (footerOffsetFrame) return;
    footerOffsetFrame = window.requestAnimationFrame(updateFooterOffset);
  };

  const setToggleVisibility = () => {
    toggle.classList.toggle('is-hidden', chatbotState.isOpen);
  };

  scheduleFooterOffsetUpdate();
  window.addEventListener('scroll', scheduleFooterOffsetUpdate, { passive: true });
  window.addEventListener('resize', scheduleFooterOffsetUpdate);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleFooterOffsetUpdate);
  }

  renderMessage(log, { role: 'bot', content: getRandomGreeting() });
  if (emptyState) emptyState.remove();

  toggle.addEventListener('click', () => {
    chatbotState.isOpen = !chatbotState.isOpen;
    panel.classList.toggle('is-open', chatbotState.isOpen);
    toggle.setAttribute('aria-expanded', chatbotState.isOpen ? 'true' : 'false');
    setToggleVisibility();
    scheduleFooterOffsetUpdate();
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
    scheduleFooterOffsetUpdate();
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
      if (!getApiUrl()) {
        const fallback = formatInactiveFallback(context);
        renderMessage(log, { role: 'bot', content: fallback.text, sources: fallback.sources });
        chatbotState.messages.push({ role: 'assistant', content: fallback.text });
        return;
      }

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
      const fallback = formatFallback(buildContext(value));
      renderMessage(log, {
        role: 'bot',
        content: fallback.text,
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

