// Per-artikel-data för Soro-sidorna (companion till soro.njk).
//
// Använder funktioner med guards i stället för Nunjucks-strängar. Skälet:
// sitemap.xml itererar collections.all och läser item.data.date / .lastUpdated
// för VARJE sida. Det tvingar fram en lat omberäkning av dessa fält även
// utanför pagination-kontexten. Med guards (data.artikel ? ... : ...) kan
// uppslaget aldrig kasta fel om aliaset saknas.
module.exports = {
	eleventyComputed: {
		title: (data) => (data.artikel ? data.artikel.title : data.title),
		description: (data) => (data.artikel ? data.artikel.excerpt : data.description),
		date: (data) => (data.artikel ? data.artikel.date : data.date),
		lastUpdated: (data) => (data.artikel ? data.artikel.date : data.lastUpdated),
		samling: (data) => (data.artikel ? data.artikel.samling : data.samling)
	}
};
