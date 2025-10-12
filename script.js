const resources = [
  {icon: '24', title: 'Mind — Självmordslinjen', tel: '90101', link: 'https://mind.se/', description: 'Stöd dygnet runt för psykisk hälsa.'},
  {icon: 'KJ', title: 'Kvinnofridslinjen', tel: '020505050', link: 'https://kvinnofridslinjen.se/', description: 'Stöd vid hot och våld, öppet 24/7.'},
  {icon: 'MJ', title: 'Mansjouren', tel: '020500000', link: 'https://mansjouren.se/', description: 'Stöd för män som utsätts för våld eller hot.'},
  {icon: 'BU', title: 'Barnens Rätt i Samhället (BRIS)', tel: '116111', link: 'https://www.bris.se/', description: 'Stöd och råd för barn och unga, öppet varje dag.'},
  {icon: 'MA', title: 'Missbrukslinjen', tel: '020-801 801', link: 'https://www.missbrukslinjen.se/', description: 'Hjälp och stöd vid alkohol- och narkotikaproblem.'},
  {icon: 'SO', title: 'Sorglinjen', tel: '020-800 100', link: 'https://sorglinjen.se/', description: 'Stöd till den som sörjer, öppet varje dag.'},
];

const container = document.getElementById('resources');
resources.forEach(r => {
  const div = document.createElement('div');
  div.className = 'card resource fade-up';
  div.innerHTML = `
    <div class="icon" aria-hidden>${r.icon}</div>
    <div>
      <h4>${r.title}</h4>
      <p class="small">
        Telefon: ${r.tel ? `<a href='tel:${r.tel}'>${r.tel}</a>` : 'Ej tillgängligt'} — 
        <a href='${r.link}' target='_blank' rel='noopener'>Mer info</a>
      </p>
      <p class="small">${r.description}</p>
    </div>
  `;
  container.appendChild(div);
});
