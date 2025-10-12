const resources = [
  {icon: '24', title: 'Mind — Självmordslinjen', tel: '90101', link: 'https://mind.se/', description: 'Stöd dygnet runt för psykisk hälsa.'},
  {icon: 'KJ', title: 'Kvinnofridslinjen', tel: '020505050', link: 'https://kvinnofridslinjen.se/', description: 'Stöd vid hot och våld, öppet 24/7.'},
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
    </div>
  `;
  container.appendChild(div);
});
