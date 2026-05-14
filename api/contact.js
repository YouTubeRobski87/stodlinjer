const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

function readHeader(req, key) {
  const value = req.headers?.[key];
  return Array.isArray(value) ? value[0] : value || '';
}

function getRequestIp(req) {
  const forwarded = readHeader(req, 'x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = readHeader(req, 'x-real-ip');
  if (realIp) return realIp;

  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const previous = rateLimitStore.get(ip) || [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const requestIp = getRequestIp(req);

  if (isRateLimited(requestIp)) {
    return res.status(429).json({ success: false, error: 'För många försök. Vänta en stund.' });
  }

  const parsedBody = parseBody(req);
  if (parsedBody === null) {
    return res.status(400).json({ success: false, error: 'Ogiltig JSON-data.' });
  }

  const name = sanitizeText(parsedBody.name);
  const email = sanitizeText(parsedBody.email).toLowerCase();
  const phone = sanitizeText(parsedBody.phone);
  const contactMethod = sanitizeText(parsedBody.contactMethod);
  const reason = sanitizeText(parsedBody.reason);
  const message = sanitizeText(parsedBody.message);
  const company = sanitizeText(parsedBody.company);

  if (company) {
    return res.status(429).json({ success: false, error: 'Spam blockerat.' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'Ange en giltig e-postadress.' });
  }

  if (!message || message.length < 5) {
    return res.status(400).json({ success: false, error: 'Meddelandet måste vara minst 5 tecken.' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ success: false, error: 'Meddelandet får vara max 5000 tecken.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    console.error('Missing RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL');
    return res.status(500).json({ success: false, error: 'Server configuration error.' });
  }

  const userAgent = readHeader(req, 'user-agent') || 'unknown';
  const timestampIso = new Date().toISOString();
  const timestampLocal = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

  const emailBody = [
    'Nytt kontaktmeddelande från stodlinjer.se',
    '',
    `Tidpunkt (ISO): ${timestampIso}`,
    `Tidpunkt (Europe/Stockholm): ${timestampLocal}`,
    `IP: ${requestIp}`,
    `User-Agent: ${userAgent}`,
    '',
    `Namn: ${name || '-'}`,
    `E-post: ${email}`,
    `Telefon: ${phone || '-'}`,
    `Kontaktmetod: ${contactMethod || '-'}`,
    `Anledning: ${reason || '-'}`,
    '',
    'Meddelande:',
    message
  ].join('\n');

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: 'Kontakt från Stodlinjer.se',
        reply_to: email,
        text: emailBody
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend send failure:', resendResponse.status, errorText);
      return res.status(500).json({ success: false, error: 'Kunde inte skicka meddelandet.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact send error:', error);
    return res.status(500).json({ success: false, error: 'Kunde inte skicka meddelandet.' });
  }
}
