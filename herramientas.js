/* GCHE2 · Herramientas: buscador, categorías, ficha de cada herramienta, favoritas y calculadora de la barra */
(()=>{
'use strict';
const G=window.G,D=window.HXD;if(!G||!D)return;
const {$,icon,toast,store,vib}=G;
const COL='#ed6300';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const T=D.T,CATS=D.CATS,BY={};T.forEach(x=>BY[x.id]=x);
['news2','findrisc','phq9','gad7','auditc','capurro','yesavage'].forEach(k=>BY[k]&&(BY[k].pts=true));
const deCat=c=>T.filter(x=>x.c===c);
const VALS={};
let fav=store.get('gche2-hfav',[]),rec=store.get('gche2-hrec',[]);
const ICAT=['bolt','heart','lungs','<path d="M7 4c3 0 4 3 4 6s2 6 6 6M5 20c4 0 6-2 6-5"/>','drop','<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>','brain','<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>','<circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/>','bone','<path d="M12 3c4 0 7 3 7 7 0 6-7 11-7 11S5 16 5 10c0-4 3-7 7-7z"/>','baby','preg','elder','<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>','<path d="M4 20c2-6 6-9 12-9M8 6a4 4 0 1 0 8 0"/>','flask','swap','<path d="M4 6h16M4 12h10M4 18h6"/>','<path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6"/>'];

/* rutas */
const owns=h=>h==='herramientas'||h.startsWith('herramientas-');
const head=(trail,title,lead,acts)=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a>${trail.map(([t,h])=>`<span>›</span>${h?`<a href="#${h}">${esc(t)}</a>`:`<b>${esc(t)}</b>`}`).join('')}</nav><div class="phead" id="phead"><div><h1 class="rise" style="--i:1">${esc(title)}</h1>${lead?`<p class="lead rise" style="--i:2">${lead}</p>`:''}</div>${acts?`<div class="hact">${acts}</div>`:''}</div>`;
const pinBtn=h=>{const on=G.isPinned&&G.isPinned(h);return `<button class="pin glass${on?' on':''}" id="pinB" aria-label="${on?'Quitar de fijados':'Fijar en inicio'}">${icon('<path d="M12 17v4M8 3h8l-1 6 3 4H6l3-4z"/>',20)}</button>`};
const kid=(t,s,ic,h,k)=>`<a class="card kid glass rise" style="--i:${Math.min(k,14)+3}" href="#${h}"><span class="glow"></span><span class="sheen"></span><span class="ic">${icon(ic,22)}</span><div><b>${esc(t)}</b><p>${esc(s)}</p></div><span class="go">${G.arrow}</span></a>`;
const show=(h,el)=>{el.style.cssText='--c:'+COL;const p=h.split('-');
  try{
    if(p[1]==='t')return vTool(el,BY[p.slice(2).join('-')]);
    if(p[1]===undefined)return vHome(el);
    const k=+p[1];if(k===0)return vHome(el,true);
    const cat=CATS[k-1];if(!cat)return vHome(el);
    if(p[2]!==undefined){const x=deCat(cat)[+p[2]];return x?vTool(el,x):vCat(el,cat,k)}
    return vCat(el,cat,k);
  }catch(e){console.error(e);el.innerHTML=`<div class="cx">${head([['Herramientas','herramientas']],'Algo salió mal',esc(e.message))}</div>`}};
const hTool=x=>'herramientas-t-'+x.id;
const fila=x=>`<a class="cx-item" href="#${hTool(x)}"><span class="av" style="background:linear-gradient(135deg,#ed6300,#ffb829)">${icon(ICAT[CATS.indexOf(x.c)]||'gauge',16)}</span><span><b>${esc(x.t)}</b><small>${esc(x.c)}${x.s?' · '+esc(x.s):''}</small></span>${fav.includes(x.id)?'<span class="cx-tag" style="--c:#ed6300">★</span>':''}</a>`;

const vHome=(el,foco)=>{
  const favs=fav.map(i=>BY[i]).filter(Boolean),recs=rec.map(i=>BY[i]).filter(Boolean).slice(0,6);
  el.innerHTML=`<div class="cx">${head([['Herramientas']],'Herramientas',`${T.length} escalas, calculadoras e interpretadores, cada una con su referencia bibliográfica`,(G.ILL?G.ILL.herramientas:'')+pinBtn('herramientas'))}
  <label class="sinput cx-search glass">${icon('search',18)}<input id="hq" type="search" placeholder="Glasgow, CURB-65, filtración, Apgar…" autocomplete="off" aria-label="Buscar herramienta"></label><div id="hres" class="cx-list"></div>
  ${favs.length?`<div class="cx-card glass rise" style="--i:3;margin-top:16px"><h3>Favoritas</h3><div class="cx-list">${favs.map(fila).join('')}</div></div>`:''}
  ${recs.length?`<div class="cx-card glass rise" style="--i:4;margin-top:14px"><h3>Recientes</h3><div class="cx-list">${recs.map(fila).join('')}</div></div>`:''}
  <p class="lbl rise" style="--i:5">Categorías</p><div class="kids" style="margin-top:12px">${CATS.map((c,i)=>{const n=deCat(c).length;return kid(c,n?`${n} ${n===1?'herramienta':'herramientas'}`:'Pendiente',ICAT[i]||'gauge','herramientas-'+(i+1),i)}).join('')}</div></div>`;
  const q=$('#hq'),res=$('#hres');q.addEventListener('input',()=>{const r=buscarT(q.value);res.innerHTML=q.value.trim()?(r.length?r.slice(0,12).map(fila).join(''):'<p class="cx-empty">Sin resultados.</p>'):''});
  if(foco||matchMedia('(min-width:720px)').matches)setTimeout(()=>q.focus({preventScroll:true}),300)};
const buscarT=q=>{q=norm(q.trim());if(!q)return[];const w=q.split(/\s+/);return T.filter(x=>{const s=norm(x.t+' '+x.s+' '+x.c+' '+x.id);return w.every(p=>s.includes(p))})};

const vCat=(el,cat,k)=>{const L=deCat(cat);
  el.innerHTML=`<div class="cx">${head([['Herramientas','herramientas'],[cat]],cat,L.length?`${L.length} ${L.length===1?'herramienta':'herramientas'}`:'Información pendiente',pinBtn('herramientas-'+k))}<div class="kids">${L.map((x,i)=>kid(x.t,x.s||'',ICAT[k-1]||'gauge',hTool(x),i)).join('')}</div></div>`};

/* ficha de herramienta */
let CUR=null;
const vTool=(el,x)=>{if(!x){el.innerHTML=`<div class="cx">${head([['Herramientas','herramientas']],'Herramienta no encontrada','')}</div>`;return}
  CUR=x;rec=[x.id,...rec.filter(i=>i!==x.id)].slice(0,10);store.set('gche2-hrec',rec);
  const k=CATS.indexOf(x.c)+1,pac=window.CX&&CX.pacienteActual&&CX.pacienteActual();const usaPac=pac&&x.f.some(f=>f.pk&&pac[f.pk]!=null);
  el.innerHTML=`<div class="cx">${head([['Herramientas','herramientas'],[x.c,'herramientas-'+k],[x.t]],x.t,esc(x.s||''))}
  <div class="cx-row">${`<button class="cxb gris sm" id="hFav">${fav.includes(x.id)?'★ En favoritas':'☆ Agregar a favoritas'}</button>`}${usaPac?`<button class="cxb gris sm" id="hPac">${icon('person',16)}Usar datos de ${esc(pac.nombre.split(' ')[0])}</button>`:''}<button class="cxb gris sm" id="hClr">Limpiar</button></div>
  <div class="hx-lay"><div class="cx-sec glass" id="hForm"></div><div class="hx-res glass" id="hRes"></div></div><button class="hx-mini glass" id="hMini" hidden></button>
  <div class="cx-card glass" style="margin-top:14px"><h3>Bibliografía</h3><ol class="hx-ref">${x.ref.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></div></div>`;
  VALS[x.id]=VALS[x.id]||{};pintaForm();calc();
  $('#hFav').onclick=()=>{fav=fav.includes(x.id)?fav.filter(i=>i!==x.id):[x.id,...fav];store.set('gche2-hfav',fav);$('#hFav').textContent=fav.includes(x.id)?'★ En favoritas':'☆ Agregar a favoritas';vib();toast(fav.includes(x.id)?'Agregada a favoritas':'Quitada de favoritas')};
  $('#hClr').onclick=()=>{VALS[x.id]={};pintaForm();calc()};
  if(usaPac)$('#hPac').onclick=()=>{const v=VALS[x.id];x.f.forEach(f=>{if(f.pk&&pac[f.pk]!=null)v[f.k]=f.t==='s'?(f.op.find(o=>o[1]===pac[f.pk])||[])[1]:pac[f.pk]});pintaForm();calc();toast('Datos tomados del expediente')};
  const F=$('#hForm');
  F.addEventListener('input',e=>{const i=e.target.closest('[data-hk]');if(!i)return;VALS[x.id][i.dataset.hk]=i.value;calc()});
  F.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const v=VALS[x.id];
    if(b.dataset.hs){const f=x.f.find(q=>q.k===b.dataset.hs),val=f.op[+b.dataset.i][1];v[f.k]=v[f.k]===val?undefined:val;vib();pintaForm();calc()}
    else if(b.dataset.hc){v[b.dataset.hc]=!v[b.dataset.hc];vib();pintaForm();calc()}})};
const visF=(f,v)=>!f.if||f.if(v);
const valores=x=>{const raw=VALS[x.id]||{},v={};x.f.forEach(f=>{if(!f.k)return;const r=raw[f.k];if(f.t==='n'){if(f.tipo==='date')v[f.k]=r||null;else{const n=parseFloat(String(r??'').replace(',','.'));v[f.k]=isFinite(n)?n:null}}else if(f.t==='s')v[f.k]=r===undefined?null:r;else if(f.t==='c')v[f.k]=!!r});return v};
const pintaForm=()=>{const x=CUR,raw=VALS[x.id],v=valores(x),y=scrollY;
  $('#hForm').innerHTML=`<div class="fx">${x.f.map(f=>{if(!visF(f,v))return'';
    if(f.t==='h')return `<div class="fw hd">${esc(f.l)}</div>`;if(f.t==='t')return `<div class="fw nt">${esc(f.l)}</div>`;
    if(f.t==='n')return `<div class="fw"><label for="hk_${f.k}">${esc(f.l)}${f.u?` <span style="font-weight:500">(${esc(f.u)})</span>`:''}</label><input id="hk_${f.k}" data-hk="${f.k}" ${f.tipo==='date'?'type="date"':'type="text" inputmode="decimal"'} value="${esc(raw[f.k]??'')}" placeholder="${esc(f.ph||'')}" autocomplete="off"></div>`;
    if(f.t==='s'){const full=f.op.length>3||f.op.some(o=>o[0].length>22);return `<div class="fw${full?' full':''}"><span class="lab">${esc(f.l)}</span><div class="opts">${f.op.map((o,i)=>`<button type="button" class="chip${raw[f.k]===o[1]?' on':''}" data-hs="${f.k}" data-i="${i}">${esc(o[0])}${x.pts&&typeof o[1]==='number'?` <span style="opacity:.7;font-weight:500">${o[1]>0?'+':''}${o[1]}</span>`:''}</button>`).join('')}</div></div>`}
    if(f.t==='c')return `<div class="fw full"><div class="opts"><button type="button" class="chip${raw[f.k]?' on':''}" data-hc="${f.k}">${raw[f.k]?'✓ ':''}${esc(f.l)}${x.pts&&f.p?` <span style="opacity:.7;font-weight:500">${f.p>0?'+':''}${f.p}</span>`:''}</button></div></div>`;return''}).join('')}</div>`;
  scrollTo({top:y,behavior:'auto'})};
const mini=(txt,c)=>{const m=$('#hMini');if(!m)return;m.hidden=!txt;m.className='hx-mini glass '+(c||'');m.innerHTML=txt||'';m.onclick=()=>$('#hRes').scrollIntoView({behavior:'smooth',block:'center'})};
const calc=()=>{const x=CUR,v=valores(x),falta=x.f.filter(f=>f.k&&(f.t==='n'||f.t==='s')&&!f.opt&&visF(f,v)&&v[f.k]==null);const box=$('#hRes');
  if(falta.length){box.className='hx-res glass';box.innerHTML=`<p class="hint" style="margin:0">Resultado</p><b class="hx-n" style="color:var(--ink2);font-size:22px">Faltan ${falta.length} ${falta.length===1?'dato':'datos'}</b><p class="hint">${esc(falta.slice(0,4).map(f=>f.l).join(', '))}${falta.length>4?'…':''}</p>`;mini(`Faltan ${falta.length} ${falta.length===1?'dato':'datos'}`,'');return}
  let r;try{r=x.r(v)}catch(e){r=null}
  if(!r){box.className='hx-res glass';box.innerHTML='<p class="hint" style="margin:0">Completa los datos</p>';return}
  box.className='hx-res glass '+(r.c||'');mini(`<b>${esc(r.n)}</b> <span>${esc((r.i||'').split(':')[0].slice(0,48))}</span>`,r.c);
  box.innerHTML=`<p class="hint" style="margin:0">Resultado</p><b class="hx-n">${esc(r.n)}</b>${r.u?`<p class="hx-u">${esc(r.u)}</p>`:''}${r.i?`<p class="hx-i">${esc(r.i)}</p>`:''}${r.d?`<p class="hint">${esc(r.d)}</p>`:''}<div class="cx-row" style="margin-top:12px"><button class="cxb sm" id="hCopy">${icon('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',16)}Copiar para la nota</button></div>`;
  $('#hCopy').onclick=async()=>{const txt=`${x.t}: ${r.n}${r.u?' '+r.u:''}. ${r.i||''}`.replace(/\s+/g,' ').trim();try{await navigator.clipboard.writeText(txt);toast('Copiado: pégalo en la nota')}catch(e){toast(txt)}}};

/* búsqueda global */
const buscar=q=>{const r=buscarT(q).slice(0,5);return r.length?`<p class="slabel" style="margin:14px 0 0">Herramientas</p><div class="nlist">${r.map(x=>`<button data-cxh="${hTool(x)}" style="--c:${COL}"><i></i><span><b style="font-size:15px">${esc(x.t)}</b><small>${esc(x.c)}</small></span>${icon('gauge',18)}</button>`).join('')}</div>`:''};

/* calculadora de la barra superior */
let EXP='';
const tecla=b=>{if(!b)return;const k=b.textContent.trim(),d=document.querySelector('.calcd');vib();
  const ult=()=>{const m=EXP.match(/(-?\d*\.?\d+)$/);return m?m[1]:''};
  if(k==='C')EXP='';else if(k==='⌫')EXP=EXP.slice(0,-1);
  else if(k==='±'){const u=ult();if(u)EXP=EXP.slice(0,-u.length)+(u.startsWith('-')?u.slice(1):'-'+u)}
  else if(k==='%'){const u=ult();if(u)EXP=EXP.slice(0,-u.length)+String(parseFloat(u)/100)}
  else if('÷×−+'.includes(k)){if(!EXP)return;EXP=EXP.replace(/[÷×−+]$/,'')+k}
  else if(k==='='){try{const e=EXP.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');if(!/^[\d+\-*/. ]+$/.test(e))throw 0;const r=Function('"use strict";return ('+e+')')();EXP=isFinite(r)?String(Math.round(r*1e10)/1e10):''}catch(e){EXP=''}}
  else if(k==='.'){const u=ult();if(!u.includes('.'))EXP+=(u?'':'0')+'.'}
  else EXP+=k;
  if(d)d.textContent=EXP||'0'};
const chipsCalc=()=>`<div class="chips">${['imc','ckdepi','cockcroft','scmost','pideal','sdg','holliday','glasgow','qtc','gaso'].map(i=>BY[i]?`<button class="chip" data-h="${hTool(BY[i])}">${esc(BY[i].t.replace(/ \(.*\)/,''))}</button>`:'').join('')}<button class="chip" data-h="herramientas">Ver todas</button></div>`;

window.HX={owns,show,buscar,tecla,chipsCalc,total:T.length};
const h0=location.hash.slice(1);if(owns(h0))G.route();
})();
