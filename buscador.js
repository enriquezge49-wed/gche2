/* GCHE2 · Buscador en internet dentro de la app
   Fuentes: PubMed (Biblioteca Nacional de Medicina de Estados Unidos, servicio E-utilities)
   y etiquetas oficiales de medicamentos de la Administración de Alimentos y Medicamentos
   de Estados Unidos (FDA, servicio openFDA). Atajo a Google. Sin Wikipedia. */
(()=>{
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const EU='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const FILTROS=[['todo','Todo',''],['rev','Revisiones sistemáticas y metaanálisis',' AND (systematic review[pt] OR meta-analysis[pt])'],['guia','Guías de práctica clínica',' AND (guideline[pt] OR practice guideline[pt])'],['ens','Ensayos clínicos',' AND randomized controlled trial[pt]']];
let F='todo',Q='',seq=0;
const sinAcento=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const css=`<style id="bxcss">
.bx{margin-top:16px}.bx-go{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.bx-go .cxb{display:inline-flex;align-items:center;gap:8px}
.bx-f{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:12px 0 4px}
.bx-f button{flex:none;padding:7px 12px;border-radius:999px;background:var(--ctrl);font-size:14px;color:var(--ink2)}
.bx-f button.on{background:var(--blue);color:#fff}
.bx h4{margin:16px 0 6px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink2);font-weight:600}
.bx-it{border-radius:14px;background:var(--ctrl);margin:8px 0;overflow:hidden}
.bx-it>button{display:block;width:100%;text-align:left;padding:12px 14px;font-size:15px;line-height:1.35}
.bx-it>button b{font-weight:600;display:block}.bx-it>button small{display:block;color:var(--ink2);font-size:13px;margin-top:4px}
.bx-tag{display:inline-block;font-size:11px;padding:2px 7px;border-radius:6px;background:color-mix(in srgb,var(--blue) 14%,transparent);color:var(--blue);margin:6px 6px 0 0;font-weight:600}
.bx-det{padding:0 14px 14px;font-size:15px;line-height:1.5}
.bx-det p{margin:8px 0}.bx-det .lbl{font-weight:600;margin-top:12px}
.bx-det a{display:inline-flex;align-items:center;gap:6px;margin:8px 10px 0 0;color:var(--blue);font-weight:500}
.bx-det details{margin:8px 0;border-radius:10px;background:var(--solid);padding:8px 12px}
.bx-det summary{cursor:pointer;font-weight:600}
.bx-det details div{white-space:pre-wrap;font-size:14px;margin-top:6px;max-height:340px;overflow:auto}
.bx-n{font-size:13px;color:var(--ink2);margin:6px 0}
.bx-sp{display:inline-block;width:16px;height:16px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:bxsp .7s linear infinite;vertical-align:-3px;margin-right:6px}
@keyframes bxsp{to{transform:rotate(360deg)}}
</style>`;
const ext='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>';
const globo='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>';
document.head.insertAdjacentHTML('beforeend',css);
const j=async u=>{const r=await fetch(u);if(!r.ok)throw new Error(r.status);return r.json()};

/* barra con el botón y el atajo a Google; se muestra debajo de los resultados de la app */
const barra=q=>{q=(q||'').trim();if(q.length<3)return'';
  return `<div class="bx"><p class="slabel" style="margin:0 0 8px">En internet</p><div class="bx-go"><button class="cxb sm" data-bx="go">${globo}Buscar en internet</button><a class="cxb gris sm" href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" rel="noopener noreferrer">${ext}Abrir en Google</a></div><div id="bxR"></div></div>`};

/* candidatos de nombre en inglés para medicamentos escritos en español (metformina → metformin) */
const nombres=q=>{const b=sinAcento(q);const c=new Set([b]);
  [[/ilina$/,'illin'],[/ina$/,'ine'],[/ina$/,'in'],[/ona$/,'one'],[/ol$/,'ole'],[/a$/,''],[/o$/,'e'],[/ato$/,'ate'],[/ico$/,'ic'],[/an$/,'an']].forEach(([r,s])=>{if(r.test(b))c.add(b.replace(r,s))});
  return [...c].filter(Boolean).slice(0,6)};

const pubmed=async(q,f)=>{const t=q+(FILTROS.find(x=>x[0]===f)||FILTROS[0])[2];
  const s=await j(`${EU}esearch.fcgi?db=pubmed&retmode=json&retmax=10&sort=relevance&term=${encodeURIComponent(t)}`);
  const ids=(s.esearchresult&&s.esearchresult.idlist)||[],n=+((s.esearchresult||{}).count||0);if(!ids.length)return{n,items:[]};
  const m=await j(`${EU}esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
  return{n,items:ids.map(id=>m.result&&m.result[id]).filter(Boolean)}};
const fda=async q=>{if(q.trim().split(/\s+/).length>3)return[];const ns=nombres(q).map(x=>`"${x}"`);
  const t=['openfda.generic_name','openfda.brand_name','openfda.substance_name'].map(k=>ns.map(x=>`${k}:${x}`).join('+')).join('+');
  try{const r=await fetch(`https://api.fda.gov/drug/label.json?limit=15&search=${encodeURIComponent(t).replace(/%2B/g,'+')}`);if(r.status===404)return[];if(!r.ok)throw 0;const d=await r.json();
    /* primero los de un solo principio activo; sin repetir el mismo nombre y vía */
    const vis=new Set();return (d.results||[]).map(x=>{const o=x.openfda||{};return{x,k:((o.generic_name||[''])[0]+'|'+(o.route||[''])[0]).toLowerCase(),m:/ and |,/i.test((o.generic_name||[''])[0])?1:0}}).sort((a,b)=>a.m-b.m).filter(o=>!vis.has(o.k)&&vis.add(o.k)).slice(0,4).map(o=>o.x)}catch(e){return[]}};

const itemPM=a=>{const au=(a.authors||[]).map(x=>x.name);const pmc=((a.articleids||[]).find(x=>x.idtype==='pmc')||{}).value;
  const tipos=(a.pubtype||[]).filter(x=>/Review|Meta-Analysis|Guideline|Randomized|Systematic/.test(x)).slice(0,2);
  return `<div class="bx-it" data-pm="${esc(a.uid)}" data-pmc="${esc(pmc||'')}"><button data-bx="pm"><b>${esc(a.title)}</b><small>${esc(au.slice(0,3).join(', '))}${au.length>3?' y otros':''} · ${esc(a.source)} · ${esc((a.pubdate||'').slice(0,4))}</small>${tipos.map(x=>`<span class="bx-tag">${esc(TIPO[x]||x)}</span>`).join('')}${pmc?'<span class="bx-tag">Texto completo gratuito</span>':''}</button></div>`};
const TIPO={'Review':'Revisión','Systematic Review':'Revisión sistemática','Meta-Analysis':'Metaanálisis','Guideline':'Guía','Practice Guideline':'Guía de práctica clínica','Randomized Controlled Trial':'Ensayo clínico aleatorizado'};
const SEC=[['indications_and_usage','Indicaciones'],['dosage_and_administration','Dosis y administración'],['dosage_forms_and_strengths','Presentaciones'],['contraindications','Contraindicaciones'],['warnings_and_cautions','Advertencias y precauciones'],['boxed_warning','Advertencia en recuadro'],['adverse_reactions','Reacciones adversas'],['drug_interactions','Interacciones'],['use_in_specific_populations','Poblaciones especiales'],['pregnancy','Embarazo']];
const itemFDA=(d,i)=>{const o=d.openfda||{};const nom=(o.brand_name||[])[0]||(o.generic_name||[])[0]||'Etiqueta';
  return `<div class="bx-it" data-fd="${i}"><button data-bx="fd"><b>${esc(nom)}</b><small>${esc((o.generic_name||[]).join(', '))}${o.route?' · '+esc(o.route.join(', ').toLowerCase()):''}${o.manufacturer_name?' · '+esc(o.manufacturer_name[0]):''}</small></button></div>`};
let FD=[];

const buscar=async(el,q)=>{const R=el.querySelector('#bxR');if(!R)return;Q=q.trim();const my=++seq;
  if(!navigator.onLine){R.innerHTML='<p class="bx-n">Sin conexión a internet. Los resultados de la app sí funcionan sin conexión.</p>';return}
  R.innerHTML=`<div class="bx-f" role="tablist">${FILTROS.map(([k,t])=>`<button data-bxf="${k}" class="${k===F?'on':''}">${t}</button>`).join('')}</div><p class="bx-n"><span class="bx-sp"></span>Buscando en PubMed y en las etiquetas oficiales de medicamentos…</p>`;
  let pm,fd;try{[pm,fd]=await Promise.all([pubmed(Q,F),F==='todo'?fda(Q):Promise.resolve([])])}catch(e){if(my!==seq)return;R.querySelector('.bx-n').textContent='No se pudo consultar PubMed. Revisa tu conexión e inténtalo otra vez.';return}
  if(my!==seq)return;FD=fd;
  const es=/[áéíóúñ]/i.test(Q)||/\b(de|la|el|en|y|del|los|las|por|con)\b/i.test(Q);
  R.innerHTML=`<div class="bx-f" role="tablist">${FILTROS.map(([k,t])=>`<button data-bxf="${k}" class="${k===F?'on':''}">${t}</button>`).join('')}</div>
  ${fd.length?`<h4>Etiqueta oficial del medicamento · FDA (Administración de Alimentos y Medicamentos de Estados Unidos)</h4><p class="bx-n">Texto original en inglés. Las presentaciones y dosis pueden diferir de las registradas en México.</p>${fd.map(itemFDA).join('')}`:''}
  <h4>Artículos en PubMed</h4>${pm.items.length?`<p class="bx-n">${pm.n.toLocaleString('es-MX')} resultados; se muestran los 10 más relevantes.${es?' PubMed responde mejor con términos en inglés.':''}</p>${pm.items.map(itemPM).join('')}<a class="cxb gris sm" style="margin-top:8px" href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(Q+(FILTROS.find(x=>x[0]===F)[2]))}" target="_blank" rel="noopener noreferrer">${ext}Ver todos en PubMed</a>`:`<p class="bx-n">Sin artículos para esta búsqueda.${es?' Prueba en inglés, por ejemplo «heart failure» en lugar de «insuficiencia cardiaca».':''}</p>`}`};

const resumen=async it=>{const id=it.dataset.pm,pmc=it.dataset.pmc;let d=it.querySelector('.bx-det');if(d){d.remove();return}
  d=document.createElement('div');d.className='bx-det';d.innerHTML='<p class="bx-n"><span class="bx-sp"></span>Cargando resumen…</p>';it.appendChild(d);
  try{const r=await fetch(`${EU}efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=${id}`);const x=new DOMParser().parseFromString(await r.text(),'text/xml');
    const ab=[...x.querySelectorAll('Abstract AbstractText')].map(n=>`${n.getAttribute('Label')?`<p class="lbl">${esc(n.getAttribute('Label'))}</p>`:''}<p>${esc(n.textContent)}</p>`).join('');
    d.innerHTML=`${ab||'<p class="bx-n">Este artículo no tiene resumen en PubMed.</p>'}<p class="bx-n">Resumen original en inglés.</p><a href="https://pubmed.ncbi.nlm.nih.gov/${id}/" target="_blank" rel="noopener noreferrer">${ext}Abrir en PubMed</a>${pmc?`<a href="https://pmc.ncbi.nlm.nih.gov/articles/${esc(pmc)}/" target="_blank" rel="noopener noreferrer">${ext}Texto completo gratuito</a>`:''}`}
  catch(e){d.innerHTML='<p class="bx-n">No se pudo cargar el resumen.</p>'}};
const etiqueta=it=>{let d=it.querySelector('.bx-det');if(d){d.remove();return}const L=FD[+it.dataset.fd];if(!L)return;
  d=document.createElement('div');d.className='bx-det';
  d.innerHTML=`<p class="bx-n">Texto original en inglés de la etiqueta aprobada.${L.effective_time?` Versión del ${esc(L.effective_time.replace(/(\d{4})(\d\d)(\d\d)/,'$3/$2/$1'))}.`:''}</p>${SEC.filter(([k])=>L[k]&&L[k].length).map(([k,t])=>`<details><summary>${t}</summary><div>${esc(L[k].join('\n\n'))}</div></details>`).join('')}${L.set_id?`<a href="https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=${esc(L.set_id)}" target="_blank" rel="noopener noreferrer">${ext}Ver etiqueta completa en DailyMed</a>`:''}`;
  it.appendChild(d)};

/* conecta la barra dentro del contenedor de la búsqueda */
const bind=(el,getQ)=>{el.addEventListener('click',e=>{const b=e.target.closest('[data-bx]'),f=e.target.closest('[data-bxf]');
  if(f){F=f.dataset.bxf;buscar(el,Q||getQ());return}
  if(!b)return;const v=b.dataset.bx;
  if(v==='go')buscar(el,getQ());else if(v==='pm')resumen(b.parentElement);else if(v==='fd')etiqueta(b.parentElement)})};
window.BX={barra,bind,buscar,nombres};
})();
