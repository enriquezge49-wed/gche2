/* GCHE2 · Estudio: Mis materias (áreas, materias y temas) y Mis cursos (material comprado, guardado solo en el dispositivo).
   Hashes: estudio-1 materias · estudio-1-a-m materia · estudio-1-a-m-t tema · estudio-2 cursos · estudio-2-0 curso de Farmacología.
   El material de los cursos nunca va al código público: los documentos y su índice se guardan en IndexedDB del dispositivo. */
(()=>{
'use strict';
const G=window.G,A=window.SXDATA;if(!G||!A)return;
const {$,icon,toast,store,vib}=G;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const COL='#8668ff',LIB='Manual CTO de Medicina y Cirugía, 14.ª edición';
const nT=A.reduce((s,a)=>s+a[1].reduce((x,m)=>x+m[2].length,0),0),nM=A.reduce((s,a)=>s+a[1].length,0);

/* estilos del módulo */
document.head.insertAdjacentHTML('beforeend',`<style>
.sx-area{border-radius:22px;padding:6px 18px 16px;margin-bottom:14px}
.sx-area h3{display:flex;justify-content:space-between;gap:10px;font-weight:600;font-size:18px;letter-spacing:-.015em;margin:12px 0 10px}.sx-area h3 small{color:var(--ink2);font-weight:400;font-size:14px}
.sx-chips{display:flex;flex-wrap:wrap;gap:8px}
.sx-chip{min-height:44px;padding:9px 15px;border-radius:14px;background:var(--ctrl);font-size:15px;display:inline-flex;align-items:center;gap:8px;transition:background .2s}.sx-chip i{font-style:normal;color:var(--ink2);font-size:13px}.sx-chip:hover{background:color-mix(in srgb,var(--c) 16%,var(--ctrl))}
.sx-list{border-radius:22px;overflow:hidden}
.sx-row{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:14px 18px;min-height:56px;border-top:1px solid color-mix(in srgb,var(--line) 70%,transparent)}.sx-row:first-child{border-top:0}.sx-row:hover{background:color-mix(in srgb,var(--c) 6%,transparent)}
.sx-row .n{flex:none;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--ctrl);font-size:13px;font-weight:600;color:var(--ink2)}
.sx-row .tx{flex:1}.sx-row .tx b{font-weight:600}.sx-row .tx small{display:block;color:var(--ink2);font-size:13px}.sx-row .mx{flex:none;font-size:12px;font-weight:600;color:#c76b00}
.sx-tabs{display:flex;gap:6px;overflow-x:auto;padding:4px;border-radius:14px;background:var(--ctrl);margin:18px 0 16px;scrollbar-width:none}
.sx-tabs button{flex:none;min-height:40px;padding:8px 14px;border-radius:11px;font-size:15px;color:var(--ink2)}.sx-tabs button.on{background:var(--solid);color:var(--ink);font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.sx-ph{border:1.5px dashed var(--line);border-radius:16px;padding:16px;color:var(--ink2);margin-bottom:10px;font-size:15px}
.sx-src{font-size:14px;color:var(--ink2);margin:10px 0 0}
.cx textarea.sx-note,.sx-note{width:100%;min-height:220px;border-radius:16px;border:1px solid var(--line);background:var(--solid);color:var(--ink);padding:14px;font:inherit;font-size:16px;line-height:1.5;resize:vertical}
.sx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:14px}
.sx-tile{display:flex;flex-direction:column;gap:6px;text-align:left;padding:18px;border-radius:22px;min-height:140px}.sx-tile b{font-weight:600;font-size:17px}.sx-tile small{color:var(--ink2);font-size:14px}
.sx-tile .ic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--k) 14%,transparent);color:var(--k);margin-bottom:4px}
.sx-tag{align-self:flex-start;margin-top:auto;font-size:12px;font-weight:600;padding:3px 9px;border-radius:99px;background:var(--ctrl);color:var(--ink2)}.sx-tag.ok{background:color-mix(in srgb,var(--ok) 15%,transparent);color:var(--ok)}
.sx-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:18px 0}
.sx-search{flex:1 1 280px;display:flex;align-items:center;gap:10px;padding:0 14px;min-height:48px;border-radius:14px;background:var(--solid);border:1px solid var(--line)}.sx-search input{flex:1;border:0;outline:0;background:none;font-size:16px;min-height:46px}
.sx-doc{display:flex;gap:14px;align-items:center;text-align:left;padding:14px;width:100%;border-radius:20px}
.sx-cover{flex:none;width:58px;height:76px;border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:12px;text-align:center;line-height:1.1;padding:4px;overflow-wrap:anywhere;background:linear-gradient(150deg,var(--k),color-mix(in srgb,var(--k) 60%,#000));box-shadow:0 6px 16px color-mix(in srgb,var(--k) 35%,transparent)}
.sx-doc .tx{flex:1}.sx-doc b{font-weight:600}.sx-doc small{display:block;color:var(--ink2);font-size:13px}
.sx-prog{height:4px;border-radius:4px;background:var(--ctrl);margin-top:8px;overflow:hidden}.sx-prog i{display:block;height:100%;background:var(--c);border-radius:4px}
.sx-res{margin-bottom:18px}.sx-empty{padding:24px;text-align:center;color:var(--ink2);border-radius:20px}
.sx-hint{font-size:14px;color:var(--ink2);margin:12px 0}
.sx-vw{position:fixed;inset:0;z-index:95;background:var(--bg);display:none;flex-direction:column}.sx-vw.on{display:flex}
.sx-vh{display:flex;align-items:center;gap:6px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:var(--card);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-bottom:1px solid var(--line)}
.sx-vh .t{flex:1;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sx-ib{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:none}.sx-ib:hover{background:var(--ctrl)}
.sx-vs{flex:1;overflow:auto;display:flex;justify-content:center;align-items:flex-start;padding:14px;touch-action:pan-x pan-y pinch-zoom}
.sx-vs canvas{background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.18);max-width:none}
.sx-vf{display:flex;align-items:center;gap:8px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:var(--card);border-top:1px solid var(--line)}
.sx-vf input{flex:1;accent-color:var(--c);height:44px}.sx-pg{flex:none;font-size:14px;color:var(--ink2);min-width:92px;text-align:center}
.sx-secs{position:absolute;right:10px;top:calc(62px + env(safe-area-inset-top));width:min(320px,calc(100vw - 20px));max-height:65vh;overflow:auto;padding:6px 0;border-radius:18px;display:none;z-index:2}.sx-secs.on{display:block}
.sx-secs button{display:flex;justify-content:space-between;gap:10px;width:100%;padding:12px 16px;min-height:44px;text-align:left;font-size:15px}.sx-secs button:hover{background:var(--ctrl)}.sx-secs small{color:var(--ink2)}
@media(max-width:600px){.sx-row{padding:13px 14px}.sx-vs{padding:6px}}
</style>`);

/* vista común */
let EL=null,H='';
const crumbs=a=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a><span>›</span><a href="#estudio">Estudio</a>${a.map(([t,h],i)=>`<span>›</span>${i===a.length-1?`<b>${esc(t)}</b>`:`<a href="#${h}">${esc(t)}</a>`}`).join('')}</nav>`;
const head=(t,s)=>`<div class="phead"><div><h1 class="rise" style="--i:1">${esc(t)}</h1><p class="lead rise" style="--i:2">${s}</p></div></div>`;
const owns=h=>/^estudio-[125](-|$)/.test(h);
const show=(h,el)=>{EL=el;H=h;el.style.cssText='--c:'+COL;const p=h.split('-').slice(1).map(Number);
  if(p[0]===1){if(p.length===1)materias();else if(p.length===3)materia(p[1],p[2]);else tema(p[1],p[2],p[3])}
  else if(p[0]===5)guias();
  else{if(p.length===1)cursos();else curso(p[1])}};

/* Mis materias */
const materias=()=>{EL.innerHTML=`<div class="cx">${crumbs([['Mis materias']])}${head('Mis materias',`${nM} materias y ${nT} temas del ${LIB}, por áreas del ENARM (Examen Nacional de Aspirantes a Residencias Médicas).`)}
${A.map(([a,ms],i)=>`<section class="sx-area glass rise" style="--i:${i+3}"><h3>${esc(a)}<small>${ms.reduce((s,m)=>s+m[2].length,0)} temas</small></h3><div class="sx-chips">${ms.map((m,j)=>`<a class="sx-chip" href="#estudio-1-${i}-${j}">${esc(m[0])}<i>${m[2].length}</i></a>`).join('')}</div></section>`).join('')}</div>`};
const nota=(m,t)=>`nota-${slug(m[0])}-${t+1}`;
const enCuenta=()=>window.CX&&(CX.modo==='nube'||CX.modo==='local');
const leeNota=id=>{if(enCuenta()){const o=CX.col('estudio').find(x=>x.id===id);return o?o.texto:''}return (store.get('gche2-notas',{})[id]||{}).texto||''};
const guardaNota=(id,meta,texto)=>{const o={id,nota:1,...meta,texto,fecha:new Date().toISOString()};if(enCuenta())CX.guarda('estudio',o);else{const n=store.get('gche2-notas',{});n[id]=o;store.set('gche2-notas',n)}};
const conNota=m=>{const ids=m[2].map((_,t)=>nota(m,t));return new Set(ids.filter(id=>leeNota(id).trim()))};
const materia=(a,j)=>{const m=A[a]&&A[a][1][j];if(!m){G.go('estudio-1');return}const cn=conNota(m);
  EL.innerHTML=`<div class="cx">${crumbs([['Mis materias','estudio-1'],[m[0]]])}${head(m[0],`${m[2].length} temas. Cada uno se va armando conforme lo estudias.`)}
  <div class="sx-list glass rise" style="--i:3">${m[2].map((t,i)=>`<a class="sx-row" href="#estudio-1-${a}-${j}-${i}"><span class="n">${i+1}</span><span class="tx"><b>${esc(t[0])}</b><small>Páginas ${t[1]} a ${t[2]} del archivo · ${cn.has(nota(m,i))?'Con notas':'Resumen pendiente'}</small></span>${t[3]?'<span class="mx">Adaptar a México</span>':''}</a>`).join('')}</div></div>`};
let tab={};
const TABS=['Resumen','Preguntas','Mis notas','Audio','Profundizar'];
const tema=(a,j,i)=>{const m=A[a]&&A[a][1][j],t=m&&m[2][i];if(!t){G.go('estudio-1');return}const k=H,tb=tab[k]||0,id=nota(m,i);
  const PH=[['El resumen con lo más preguntado se arma cuando estudies este tema: definición, epidemiología, fisiopatología, cuadro clínico, diagnóstico, tratamiento y perlas para el examen.','Aquí irá la diferencia con la Guía de Práctica Clínica mexicana vigente, si la hay.'+(t[3]?' Este tema está hecho para España: se rehace con la normativa mexicana.':'')],['Aquí irán las 30 preguntas tipo ENARM del tema, con caso clínico, explicación de cada opción y su fuente.'],null,['Aquí irá el repaso en audio, en bloques cortos de pregunta y respuesta.'],['Aquí irán los capítulos del Harrison, Principios de Medicina Interna, 21.ª edición, que corresponden a este tema.','Aquí irá el enlace a la Guía de Práctica Clínica vigente.']];
  EL.innerHTML=`<div class="cx">${crumbs([['Mis materias','estudio-1'],[m[0],`estudio-1-${a}-${j}`],['Tema '+(i+1)]])}<div class="phead"><div><h1 class="rise" style="--i:1">${esc(t[0])}</h1><p class="sx-src rise" style="--i:2">Fuente: ${LIB}, ${esc(m[0])}, capítulo ${i+1}, páginas ${t[1]} a ${t[2]} del archivo.</p></div></div>
  <div class="sx-tabs rise" style="--i:3" role="tablist">${TABS.map((x,n)=>`<button role="tab" aria-selected="${n===tb}" class="${n===tb?'on':''}" data-tb="${n}">${x}</button>`).join('')}</div>
  <div class="rise" style="--i:4">${tb===2?`<textarea class="sx-note" id="sxNota" placeholder="Escribe aquí tus notas de este tema. Se guardan solas.">${esc(leeNota(id))}</textarea><p class="sx-hint">${enCuenta()?'Se guardan en tu cuenta.':'Se guardan en este dispositivo. Al iniciar sesión se pasan a tu cuenta.'}</p>`:PH[tb].map(x=>`<div class="sx-ph">${x}</div>`).join('')}</div></div>`;
  EL.querySelector('.sx-tabs').onclick=e=>{const b=e.target.closest('[data-tb]');if(!b)return;tab[k]=+b.dataset.tb;vib();tema(a,j,i)};
  const ta=$('#sxNota');if(ta){let tt;ta.oninput=()=>{clearTimeout(tt);tt=setTimeout(()=>guardaNota(id,{materia:m[0],tema:t[0]},ta.value),600)};ta.onblur=()=>{clearTimeout(tt);guardaNota(id,{materia:m[0],tema:t[0]},ta.value)}}};
/* al iniciar sesión, las notas del dispositivo pasan a la cuenta */
const migra=()=>{const n=store.get('gche2-notas',{});const v=Object.values(n);if(enCuenta()&&v.length){v.forEach(o=>CX.guarda('estudio',o));store.set('gche2-notas',{})}};

/* Mis cursos: cada curso con sus documentos; los documentos y su índice viven solo en el dispositivo */
const CURSOS=[
 {id:'farmacologia',t:'Farmacología',k:'#8668ff',idx:'indice',sub:'5 documentos · 544 páginas',ic:'<path d="M10.5 3.5a4.95 4.95 0 0 1 7 7l-7 7a4.95 4.95 0 0 1-7-7z"/><path d="M7 7l7 7"/>',
  docs:[['350_mapas_de_farmacologia','350 mapas de farmacología',374,'#8668ff','350 mapas',['350']],['Flashcards_farmacologia_cardiovascular','Flashcards de farmacología cardiovascular',60,'#e5484d','Flash cards',['flashcard']],['60_mapas_dosificacion_dilucion_administracion','60 mapas de dosificación, dilución y administración',63,'#0071e3','60 mapas',['60_mapas','dosificacion']],['Casos_clinicos_farmacos','Casos clínicos de fármacos',26,'#03aa49','Casos',['casos']],['Plantillas_de_verificacion_clinica','Plantillas de verificación clínica',21,'#c76b00','Plantillas clínicas',['plantilla']]]},
 {id:'madera',t:'Flashcards Madera',k:'#e5484d',idx:'indice-madera',sub:'4 partes · 1095 páginas · basadas en Guías de Práctica Clínica mexicanas',ic:'<rect x="4" y="6" width="14" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/>',
  docs:[['madera_1','Parte 1, páginas 1 a 276',276,'#e5484d','Parte 1',['madera_parte_1']],['madera_2','Parte 2, páginas 277 a 548',272,'#c2410c','Parte 2',['madera_parte_2']],['madera_3','Parte 3, páginas 549 a 821',273,'#b45309','Parte 3',['madera_parte_3']],['madera_4','Parte 4, páginas 822 a 1095',274,'#9f1239','Parte 4',['madera_parte_4']]]}];
let dbp=null;const db=()=>dbp||(dbp=new Promise((ok,no)=>{try{const r=indexedDB.open('gche2-cursos',1);r.onupgradeneeded=()=>{r.result.createObjectStore('docs');r.result.createObjectStore('meta')};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}}));
const tx=(st,md,f)=>db().then(d=>new Promise((ok,no)=>{const t=d.transaction(st,md),q=f(t.objectStore(st));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)}));
const put=(st,k,v)=>tx(st,'readwrite',s=>s.put(v,k)),get=(st,k)=>tx(st,'readonly',s=>s.get(k)),keys=st=>tx(st,'readonly',s=>s.getAllKeys());
let have={},IDX={},listo=false,ult=store.get('gche2-curso-ult',{}),Q={},CC=CURSOS[0];
const docDe=id=>{for(const c of CURSOS){const d=c.docs.find(x=>x[0]===id);if(d)return [c,d]}return [null,null]};
const carga=async()=>{try{have={};(await keys('docs')).forEach(k=>have[k]=1);for(const c of CURSOS)IDX[c.id]=await get('meta',c.idx)||null;if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}listo=true;if(EL&&owns(location.hash.slice(1)))show(location.hash.slice(1),EL)};
const cuantos=c=>c.docs.filter(d=>have[d[0]]).length;
const cursos=()=>{EL.innerHTML=`<div class="cx">${crumbs([['Mis cursos']])}${head('Mis cursos','Material de cursos que compraste. Se guarda solo en este dispositivo y no se mezcla con tus materias.')}
<div class="sx-grid">${CURSOS.map((c,i)=>`<a class="sx-tile glass rise" style="--i:${i+3};--k:${c.k}" href="#estudio-2-${i}"><span class="ic">${icon(c.ic,22)}</span><b>${c.t}</b><small>${c.sub}</small><span class="sx-tag${cuantos(c)?' ok':''}">${listo?`${cuantos(c)} de ${c.docs.length} en este dispositivo`:'Revisando…'}</span></a>`).join('')}</div></div>`};
const secDe=(S,p)=>{let s='';(S||[]).forEach(x=>{if(p>=x.p)s=x.t});return s};
const resultados=(c,q)=>{const I=IDX[c.id],ws=norm(q).split(/\s+/).filter(w=>w.length>=3);if(!ws.length)return '';if(!I)return `<p class="sx-hint">Para buscar, agrega también el archivo del índice de este curso.</p>`;
  const r=[];I.docs.forEach(d=>d.paginas.forEach((p,i)=>{const pw=p.w.split(' ');if(ws.every(w=>pw.some(x=>x.startsWith(w)))){const g=(d.inicio||1)+i;r.push({d,i:i+1,g,t:p.t,s:d.inicio?'':secDe(d.secciones||I.secciones,i+1)})}}));
  if(!r.length)return `<div class="sx-empty glass">No encontré "${esc(q)}". Prueba con otra forma del nombre o con menos palabras.</div>`;
  return `<div class="sx-list sx-res glass">${r.slice(0,40).map(x=>`<button class="sx-row" data-doc="${x.d.id}" data-p="${x.i}"><span class="n">${x.g}</span><span class="tx"><b>${esc(x.t||x.s||'Página '+x.g)}</b><small>${esc((docDe(x.d.id)[1]||[0,x.d.titulo])[1])}${x.s?' · '+esc(x.s):''} · página ${x.g}</small></span></button>`).join('')}</div>${r.length>40?`<p class="sx-hint">Hay ${r.length} páginas; agrega otra palabra para afinar.</p>`:''}`};
const temasDe=c=>{const I=IDX[c.id];if(!I||!I.temas)return '';const S=I.secciones||[];
  return `<h2 class="rise" style="--i:4;margin:26px 0 12px;font-size:22px;font-weight:600;letter-spacing:-.02em">Temas</h2>${S.map((s,k)=>{const fin=k+1<S.length?S[k+1].p:1e9,ts=I.temas.filter(t=>t.p>=s.p&&t.p<fin);if(!ts.length)return '';
  return `<details class="sx-area glass"><summary style="cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:10px;padding:12px 0;min-height:44px;font-weight:600;font-size:17px">${esc(s.t)}<small style="color:var(--ink2);font-weight:400;font-size:14px">${ts.length} tema${ts.length>1?'s':''}</small></summary><div class="sx-list">${ts.map(t=>{const d=I.docs.find(d=>t.p>=d.inicio&&t.p<d.inicio+d.paginas.length);return d?`<button class="sx-row" data-doc="${d.id}" data-p="${t.p-d.inicio+1}"><span class="n">${t.p}</span><span class="tx">${esc(t.t)}</span></button>`:''}).join('')}</div></details>`}).join('')}`};
const curso=n=>{const c=CURSOS[n]||CURSOS[0];CC=c;const q=Q[c.id]||'',falta=cuantos(c)<c.docs.length||!IDX[c.id];
  EL.innerHTML=`<div class="cx">${crumbs([['Mis cursos','estudio-2'],[c.t]])}${head(c.t,'Toca un documento o un tema para abrirlo; retoma en la última página que viste.')}
<div class="sx-bar rise" style="--i:3"><label class="sx-search">${icon('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',20)}<input id="sxQ" type="search" placeholder="${c.id==='madera'?'Buscar un tema, por ejemplo dislipidemias':'Buscar un fármaco, por ejemplo amiodarona'}" value="${esc(q)}" autocomplete="off" aria-label="Buscar en el curso"></label><button class="cxb" id="sxAdd">${icon('<path d="M12 5v14M5 12h14"/>',18)}Agregar documentos</button></div>
<div id="sxRes">${resultados(c,q)}</div>
<div class="sx-grid rise" style="--i:4">${c.docs.map(([id,t,n,k,cv])=>{const u=ult[id]||0;return `<button class="sx-doc glass" data-doc="${id}" style="--k:${k}"><span class="sx-cover">${cv}</span><span class="tx"><b>${t}</b><small>${n} páginas · ${!listo?'Revisando…':have[id]?(u?`Vas en la página ${u}`:'Sin abrir'):'Falta agregarlo'}</small>${have[id]?`<span class="sx-prog"><i style="width:${Math.round(100*u/n)}%"></i></span>`:''}</span></button>`}).join('')}</div>
${temasDe(c)}
<p class="sx-hint">${!listo?'':falta?`Toca Agregar documentos y elige los ${c.docs.length} documentos del curso junto con su índice (${c.id==='madera'?'indice_madera.json':'indice_farmacologia.json'}); puedes elegirlos todos a la vez. Abre la app desde el ícono instalado para que el dispositivo no los borre.`:'Los documentos y el buscador están listos en este dispositivo.'}</p></div>`;
  const qi=$('#sxQ');qi.oninput=()=>{Q[c.id]=qi.value;$('#sxRes').innerHTML=resultados(c,qi.value)};
  $('#sxAdd').onclick=()=>fi.click();
  EL.querySelector('.cx').onclick=e=>{const d=e.target.closest('[data-doc]');if(d)abre(d.dataset.doc,+d.dataset.p||0)}};
const fi=Object.assign(document.createElement('input'),{type:'file',multiple:true,accept:'application/pdf,.pdf,application/json,.json',hidden:true});document.body.appendChild(fi);
const quien=n=>{const x=norm(n),cs=x.includes('madera')?[CURSOS[1]]:[CURSOS[0]];for(const c of cs){const d=c.docs.find(d=>x.includes(norm(d[0])))||c.docs.find(d=>d[5].some(w=>x.includes(w)));if(d)return d[0]}return null};
fi.onchange=async()=>{let ok=0;const no=[];for(const f of fi.files){try{if(/\.json$/i.test(f.name)){const j=JSON.parse(await f.text());if(!j.docs)throw 0;const c=/madera/i.test(j.curso||'')?CURSOS[1]:CURSOS[0];await put('meta',c.idx,j);IDX[c.id]=j;ok++;continue}const id=quien(f.name);if(!id){no.push(f.name);continue}await put('docs',id,f);have[id]=1;ok++}catch(e){no.push(f.name)}}
  fi.value='';vib();toast(ok?`Se guardaron ${ok} archivo${ok>1?'s':''} en este dispositivo`:'No se pudo guardar');if(no.length)setTimeout(()=>toast('No reconocí: '+no.join(', ')),2800);if(EL&&owns(location.hash.slice(1)))show(location.hash.slice(1),EL)};

/* Guías de Práctica Clínica de las rotaciones del internado (documentos públicos) */
let QG='';
const guias=()=>{const R=window.SXGPC||[],nG=new Set(R.flatMap(r=>r[1].flatMap(t=>t[1].map(g=>g[2]||g[0])))).size,nTm=R.reduce((s,r)=>s+r[1].length,0);
  EL.innerHTML=`<div class="cx">${crumbs([['Guías de Práctica Clínica']])}${head('Guías de Práctica Clínica',`${nG} guías de ${nTm} temas, por rotación, del Programa de Internado Rotatorio de Pregrado del IESIT (diciembre de 2023).`)}
  <div class="sx-bar rise" style="--i:3"><label class="sx-search">${icon('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',20)}<input id="sxQG" type="search" placeholder="Buscar, por ejemplo apendicitis" value="${esc(QG)}" autocomplete="off" aria-label="Buscar guía"></label></div>
  <div id="sxG"></div><p class="sx-hint">Algunas guías son de 2008 a 2017; antes de usar una en el consultorio, confirma que siga vigente. Las guías sin enlace estaban en el catálogo del Centro Nacional de Excelencia Tecnológica en Salud, que se retiró de internet; su dirección antigua ya no es del gobierno, así que no la abras. Puedes buscarlas por su clave en el portal del Instituto Mexicano del Seguro Social o de la Secretaría de Salud.</p></div>`;
  const pinta=()=>{const ws=norm(QG).split(/\s+/).filter(Boolean);
    const html=R.map(([rot,ts],i)=>{const f=ts.filter(([t,gs])=>!ws.length||ws.every(w=>norm(t+' '+gs.map(g=>g[0]).join(' ')).includes(w)));if(!f.length)return '';
      return `<section class="sx-area glass"><h3>${esc(rot)}<small>${f.length} tema${f.length>1?'s':''}</small></h3><div class="sx-list">${f.map(([t,gs])=>`<div class="sx-row" style="align-items:flex-start;flex-direction:column;gap:6px"><b style="font-weight:600">${esc(t)}</b>${gs.map(([g,a,u,k,nt])=>/^https:\/\/(www\.)?(imss\.gob\.mx|gob\.mx)\//.test(u||'')?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" style="display:flex;gap:10px;align-items:center;color:var(--blue);font-size:15px;min-height:40px">${icon('<path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',16)}<span>${esc(g)}${a?` · actualización ${a}`:''}</span></a>`:`<div style="display:flex;gap:10px;align-items:flex-start;font-size:15px;min-height:40px;color:var(--ink2)">${icon('<path d="M4 4h12l4 4v12H4z"/><path d="M8 12h8M8 16h5"/>',16)}<span>${esc(g)}${a?` · actualización ${a}`:''}<br><small>${k?`Clave ${esc(k)} · `:''}${nt?esc(nt):'sin enlace oficial por ahora'}</small></span></div>`).join('')}</div>`).join('')}</div></section>`}).join('');
    $('#sxG').innerHTML=html||`<div class="sx-empty glass">No encontré "${esc(QG)}".</div>`};
  pinta();const qi=$('#sxQG');qi.oninput=()=>{QG=qi.value;pinta()}};

/* visor con pdf.js (librería guardada en la propia app) */
document.body.insertAdjacentHTML('beforeend',`<section class="sx-vw" id="sxVw" aria-label="Visor de documentos" style="--c:${COL}"><div class="sx-vh"><button class="sx-ib" id="sxB" aria-label="Cerrar visor">${icon('<path d="M15 6l-6 6 6 6"/>',22)}</button><div class="t" id="sxT"></div><button class="sx-ib" id="sxZo" aria-label="Alejar">${icon('<path d="M5 12h14"/>',20)}</button><button class="sx-ib" id="sxZi" aria-label="Acercar">${icon('<path d="M12 5v14M5 12h14"/>',20)}</button><button class="sx-ib" id="sxS" aria-label="Secciones">${icon('<path d="M4 6h16M4 12h16M4 18h10"/>',20)}</button></div><div class="sx-secs glass" id="sxSecs"></div><div class="sx-vs" id="sxVs"><canvas id="sxCv"></canvas></div><div class="sx-vf"><button class="sx-ib" id="sxP" aria-label="Página anterior">${icon('<path d="M15 6l-6 6 6 6"/>',20)}</button><input type="range" id="sxR" min="1" value="1" aria-label="Ir a página"><div class="sx-pg" id="sxPg"></div><button class="sx-ib" id="sxN" aria-label="Página siguiente">${icon('<path d="M9 6l6 6-6 6"/>',20)}</button></div></section>`);
let libp=null;const pdfjs=()=>libp||(libp=new Promise((ok,no)=>{if(window.pdfjsLib)return ok(pdfjsLib);const s=document.createElement('script');s.src='lib/pdf.min.js';s.onload=()=>{pdfjsLib.GlobalWorkerOptions.workerSrc='lib/pdf.worker.min.js';ok(pdfjsLib)};s.onerror=()=>{libp=null;no()};document.head.appendChild(s)}));
let P=null,pg=1,zoom=1,cur=null,rend=null;const vw=$('#sxVw');
const abre=async(id,p)=>{if(!have[id]){toast('Primero agrega este documento con Agregar documentos');return}
  try{const lib=await pdfjs(),f=await get('docs',id);cur=id;const [cc,dd]=docDe(id);$('#sxT').textContent=cc.id==='madera'?'Madera, '+dd[1].toLowerCase():dd[1];vw.classList.add('on');document.documentElement.style.overflow='hidden';
    P=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;pg=p||ult[id]||1;zoom=1;$('#sxR').max=P.numPages;
    const [c]=docDe(id),I=IDX[c.id],d=I&&I.docs.find(x=>x.id===id);let S=[];
    if(d&&d.inicio)S=(I.temas||[]).filter(t=>t.p>=d.inicio&&t.p<d.inicio+d.paginas.length).map(t=>({t:t.t,p:t.p-d.inicio+1,g:t.p}));else if(d)S=(I.secciones||d.secciones||[]).map(x=>({t:x.t,p:x.p,g:x.p}));
    $('#sxS').style.display=S.length?'':'none';$('#sxSecs').innerHTML=S.map(s=>`<button data-sp="${s.p}">${esc(s.t)}<small>${s.g}</small></button>`).join('');render()}
  catch(e){cierra();toast('No se pudo abrir el documento')}};
const render=async()=>{if(!P)return;pg=Math.max(1,Math.min(P.numPages,pg));$('#sxR').value=pg;$('#sxPg').textContent=`${pg} de ${P.numPages}`;ult[cur]=pg;store.set('gche2-curso-ult',ult);
  const page=await P.getPage(pg),vs=$('#sxVs'),b=page.getViewport({scale:1}),fit=Math.min((vs.clientWidth-16)/b.width,(vs.clientHeight-16)/b.height),dpr=Math.min(devicePixelRatio||1,2.5),vp=page.getViewport({scale:fit*zoom*dpr}),cv=$('#sxCv');
  if(rend)try{rend.cancel()}catch(e){}cv.width=vp.width;cv.height=vp.height;cv.style.width=vp.width/dpr+'px';cv.style.height=vp.height/dpr+'px';rend=page.render({canvasContext:cv.getContext('2d'),viewport:vp});try{await rend.promise}catch(e){}};
const cierra=()=>{vw.classList.remove('on');$('#sxSecs').classList.remove('on');document.documentElement.style.overflow='';if(P)P.destroy();P=null;if(EL&&/^#estudio-2-\d$/.test(location.hash))curso(+location.hash.slice(-1))};
$('#sxB').onclick=cierra;$('#sxP').onclick=()=>{pg--;render()};$('#sxN').onclick=()=>{pg++;render()};$('#sxR').oninput=e=>{pg=+e.target.value;render()};
$('#sxZi').onclick=()=>{zoom=Math.min(4,zoom*1.4);render()};$('#sxZo').onclick=()=>{zoom=Math.max(1,zoom/1.4);render()};
$('#sxS').onclick=()=>$('#sxSecs').classList.toggle('on');$('#sxSecs').onclick=e=>{const b=e.target.closest('[data-sp]');if(b){pg=+b.dataset.sp;$('#sxSecs').classList.remove('on');render()}};
$('#sxVs').ondblclick=()=>{zoom=zoom>1?1:2;render()};
let sx=null;$('#sxVs').addEventListener('touchstart',e=>{sx=e.touches.length===1&&zoom===1?e.touches[0].clientX:null},{passive:true});
$('#sxVs').addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60){pg+=dx<0?1:-1;render()}});
addEventListener('keydown',e=>{if(!vw.classList.contains('on'))return;if(e.key==='ArrowRight'){pg++;render()}else if(e.key==='ArrowLeft'){pg--;render()}else if(e.key==='Escape')cierra()});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(P)render()},150)});
addEventListener('hashchange',()=>{if(vw.classList.contains('on'))cierra()});
addEventListener('nube',()=>setTimeout(migra,900));
carga();
window.SX={owns,show};
})();
