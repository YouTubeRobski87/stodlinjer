const SUPPORT_QUERY_PARAM = 'q';

function getPagePath() {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname || ''}${window.location.search || ''}`;
}

function sendGaEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', eventName, {
    ...params,
    page_path: params.page_path || getPagePath(),
    transport_type: 'beacon'
  });

  return true;
}

function normalizePhoneNumber(value = '') {
  return value.toString().replace(/^tel:/i, '').trim();
}

function normalizeUrl(url) {
  try {
    return new URL(url, window.location.origin);
  } catch {
    return null;
  }
}

function getVisibleText(element) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function getGuideTitle() {
  const articleTitle = document.querySelector('article h1, main h1');
  return getVisibleText(articleTitle) || document.title.replace(/\s+\|\s+Stödlinjer.*$/i, '').trim();
}

function getSupportLineFromTelLink(link, supportByPhone) {
  const phoneNumber = normalizePhoneNumber(link.getAttribute('href'));
  if (link.dataset.supportLine) return link.dataset.supportLine;
  if (supportByPhone.has(phoneNumber)) return supportByPhone.get(phoneNumber).title;

  const ariaLabel = link.getAttribute('aria-label') || '';
  const ariaMatch = ariaLabel.match(/Ring\s+(.+?)\s+(?:på|vid|$)/i);
  if (ariaMatch?.[1]) return ariaMatch[1].trim();

  const text = getVisibleText(link);
  return text.replace(phoneNumber, '').trim() || text || 'Okänd stödlinje';
}

function getSupportFromSearchLink(link, supportByTitle) {
  const url = normalizeUrl(link.href);
  const query = url?.searchParams.get(SUPPORT_QUERY_PARAM);
  if (!query) return null;

  const decoded = query.trim();
  return supportByTitle.get(decoded.toLowerCase()) || { title: decoded };
}

function isExternalUrl(url) {
  const parsed = normalizeUrl(url);
  return Boolean(parsed && parsed.origin !== window.location.origin && /^https?:$/.test(parsed.protocol));
}

export function createAnalyticsTracker({ supportLines = [] } = {}) {
  const supportByTitle = new Map();
  const supportByUrl = new Map();
  const supportByHost = new Map();
  const supportByPhone = new Map();

  supportLines.forEach((line) => {
    if (!line?.title) return;

    supportByTitle.set(line.title.toLowerCase(), line);

    if (line.phone) {
      supportByPhone.set(line.phone.toString().replace(/[^+\d]/g, ''), line);
      supportByPhone.set(line.phone.toString().trim(), line);
    }

    if (line.resource?.url) {
      const parsed = normalizeUrl(line.resource.url);
      if (parsed) {
        supportByUrl.set(parsed.href.replace(/\/$/, ''), line);
        supportByHost.set(parsed.hostname.replace(/^www\./, ''), line);
      }
    }
  });

  const trackSupportCall = ({ supportLine, phoneNumber }) =>
    sendGaEvent('support_call_click', {
      support_line: supportLine || 'Okänd stödlinje',
      phone_number: normalizePhoneNumber(phoneNumber)
    });

  const trackExternalSupportClick = ({ supportLine, destinationUrl }) =>
    sendGaEvent('external_support_click', {
      support_line: supportLine || 'Okänd stödlinje',
      destination_url: destinationUrl
    });

  const trackGuideCtaClick = ({ guideTitle, supportLine }) =>
    sendGaEvent('guide_cta_click', {
      guide_title: guideTitle || getGuideTitle(),
      support_line: supportLine || 'Okänd stödlinje'
    });

  const getSupportLineForExternalLink = (link) => {
    if (link.dataset.supportLine) return { title: link.dataset.supportLine };

    const parsed = normalizeUrl(link.href);
    if (!parsed) return null;

    const key = parsed.href.replace(/\/$/, '');
    const hostKey = parsed.hostname.replace(/^www\./, '');
    return supportByUrl.get(key) || supportByHost.get(hostKey) || null;
  };

  const handleClick = (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;

    const href = link.getAttribute('href') || '';

    if (href.toLowerCase().startsWith('tel:')) {
      const phoneNumber = normalizePhoneNumber(href);
      trackSupportCall({
        supportLine: getSupportLineFromTelLink(link, supportByPhone),
        phoneNumber
      });
      return;
    }

    const supportFromSearch = getSupportFromSearchLink(link, supportByTitle);
    if (supportFromSearch && link.closest('.post-content')) {
      trackGuideCtaClick({
        guideTitle: getGuideTitle(),
        supportLine: supportFromSearch.title
      });
    }

    if (isExternalUrl(link.href)) {
      const supportLine = getSupportLineForExternalLink(link);
      if (!supportLine) return;

      trackExternalSupportClick({
        supportLine: supportLine.title,
        destinationUrl: link.href
      });
    }
  };

  return {
    bind() {
      document.addEventListener('click', handleClick);
    },
    trackSupportCall,
    trackExternalSupportClick,
    trackGuideCtaClick
  };
}
