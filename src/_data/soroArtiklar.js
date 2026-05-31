// Bygg-tidshämtning av Stödlinjers Soro-artiklar.
//
// Vid varje 11ty-bygge hämtas artikellistan från Soros embed-endpoint,
// varje artikels fulla innehåll hämtas, och resultatet returneras som data.
// En pagination-mall (src/artiklar/soro.njk) genererar sedan en statisk,
// indexerbar HTML-sida per artikel — precis som de handskrivna markdown-
// artiklarna. Sidorna hamnar automatiskt i collections.articles och i
// sitemap.xml eftersom de taggas "artikel".
//
// VIKTIGT: TOKEN måste vara Stödlinjers EGEN Soro-token (per webbplats),
// inte någon av MittPsykes tokens. Hämtas i Soro genom att välja
// stodlinjer.se-sajten → Connect Your Website → embed-koden.

// Stödlinjers egen Soro-token. Den är inte hemlig (syns publikt i embed-koden
// på sajten), så vi hårdkodar den som standard för att bygget alltid ska
// fungera. Kan överskridas med miljövariabeln SORO_STODLINJER_TOKEN.
const SORO_TOKEN = process.env.SORO_STODLINJER_TOKEN || '8ddf4490-ef9e-45aa-998d-adfb8114dd7f';

// Vilken samling Soro-artiklarna grupperas under. Måste vara en giltig slug
// från src/_data/samlingar.json (annars syns de inte i samlingsfiltret).
const DEFAULT_SAMLING = 'fordjupning';

const EMBED_BASE = 'https://app.trysoro.com/api/embed';

// Plockar ut artikellistan ur Soros embed-script (en JS-fil med
// "var SORO_ARTICLES = [ ... ];").
function extractArticles(embedScript) {
	const match = embedScript.match(/var SORO_ARTICLES = (\[[\s\S]*?\]);/);
	if (!match) return [];
	try {
		const parsed = JSON.parse(match[1]);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function asString(value) {
	return typeof value === 'string' ? value : value == null ? '' : String(value);
}

// Normaliserar en slug oavsett om Soro ger full URL, query eller ren slug.
function normalizeSlug(value) {
	const raw = asString(value);
	try {
		const decoded = decodeURIComponent(raw);
		const path = (decoded.startsWith('http') ? new URL(decoded).pathname : decoded).replace(
			/^\/+|\/+$/g,
			''
		);
		const last = path.split('/').pop() || path;
		return last.toLowerCase();
	} catch {
		return raw
			.replace(/^\/+|\/+$/g, '')
			.split('/')
			.pop()
			.toLowerCase();
	}
}

async function fetchText(url) {
	const res = await fetch(url, {
		headers: { accept: 'application/javascript,*/*', 'user-agent': 'Mozilla/5.0' }
	});
	if (!res.ok) throw new Error(`Soro svarade ${res.status} för ${url}`);
	return res.text();
}

async function fetchArticleContent(id) {
	const res = await fetch(`${EMBED_BASE}/${SORO_TOKEN}/article/${id}`, {
		headers: { accept: 'application/json,*/*', 'user-agent': 'Mozilla/5.0' }
	});
	if (!res.ok) throw new Error(`Soro-innehåll svarade ${res.status} för artikel ${id}`);
	const payload = await res.json();
	return asString(payload && payload.content);
}

module.exports = async function () {
	// Utan token gör vi ingenting — bygget fortsätter utan Soro-artiklar.
	if (!SORO_TOKEN) {
		console.warn('[soroArtiklar] Ingen SORO_STODLINJER_TOKEN satt – hoppar över Soro-artiklar.');
		return [];
	}

	if (typeof fetch !== 'function') {
		console.warn('[soroArtiklar] global fetch saknas (kräver Node 18+) – hoppar över.');
		return [];
	}

	try {
		const embedScript = await fetchText(`${EMBED_BASE}/${SORO_TOKEN}?theme=dark&cb=${Date.now()}`);
		const list = extractArticles(embedScript);

		if (list.length === 0) {
			console.warn('[soroArtiklar] Inga artiklar hittades i Soro-embedden.');
			return [];
		}

		const articles = [];
		for (const item of list) {
			const id = asString(item.id);
			if (!id) continue;
			try {
				const content = await fetchArticleContent(id);
				if (!content) continue;
				articles.push({
					id,
					title: asString(item.title),
					slug: normalizeSlug(item.slug),
					excerpt: asString(item.excerpt),
					date: asString(item.isoDate || item.date) || new Date().toISOString(),
					image: asString(item.image) || null,
					samling: DEFAULT_SAMLING,
					content
				});
			} catch (err) {
				console.warn(`[soroArtiklar] Kunde inte hämta artikel ${id}: ${err.message}`);
			}
		}

		console.log(`[soroArtiklar] Hämtade ${articles.length} Soro-artiklar.`);
		return articles;
	} catch (err) {
		console.warn(`[soroArtiklar] Misslyckades hämta Soro-artiklar: ${err.message}`);
		return [];
	}
};
