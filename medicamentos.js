/* GCHE2 · Medicamentos: buscador con similares, ficha, ficha flotante, comparación, calculadora de dosis, receta y esquemas */
(()=>{
'use strict';
const G=window.G,D=window.MXD;if(!G||!D)return;
const {$,icon,toast,store,vib,openSheet,closeSheet}=G;
const COL='#03aa49';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const M=D.M,F=D.FICHAS,BY={};M.forEach(m=>BY[m.id]=m);
const GRUPOS=[...new Set(M.map(m=>m.g))];
const fichaDe=id=>F[id]||null;
let fav=store.get('gche2-mfav',[]),rec=store.get('gche2-mrec',[]),esq=store.get('gche2-esq',[]),RX=store.get('gche2-rxtmp',{pac:'',items:[]});
const saveRx=()=>store.set('gche2-rxtmp',RX);
const SX={};
document.getElementById('sBody').addEventListener('click',e=>{const b=e.target.closest('[data-mx]');if(b&&SX[b.dataset.mx]){e.stopPropagation();SX[b.dataset.mx](b)}});

const owns=h=>h==='medicamentos'||h.startsWith('medicamentos-');
const head=(trail,title,lead,acts)=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a>${trail.map(([t,h])=>`<span>›</span>${h?`<a href="#${h}">${esc(t)}</a>`:`<b>${esc(t)}</b>`}`).join('')}</nav><div class="phead" id="phead"><div><h1 class="rise" style="--i:1">${esc(title)}</h1>${lead?`<p class="lead rise" style="--i:2">${lead}</p>`:''}</div>${acts?`<div class="hact">${acts}</div>`:''}</div>`;
const pinBtn=h=>{const on=G.isPinned&&G.isPinned(h);return `<button class="pin glass${on?' on':''}" id="pinB" aria-label="${on?'Quitar de fijados':'Fijar en inicio'}">${icon('<path d="M12 17v4M8 3h8l-1 6 3 4H6l3-4z"/>',20)}</button>`};
const kid=(t,s,ic,h,k)=>`<a class="card kid glass rise" style="--i:${Math.min(k,14)+3}" href="#${h}"><span class="glow"></span><span class="sheen"></span><span class="ic">${icon(ic,22)}</span><div><b>${esc(t)}</b><p>${esc(s)}</p></div><span class="go">${G.arrow}</span></a>`;
const hF=id=>'medicamentos-f-'+id;
const tag=m=>fichaDe(m.id)?'<span class="cx-tag ok">Ficha</span>':'<span class="cx-tag warn">En preparación</span>';
const fila=(m,extra='')=>`<a class="cx-item" href="#${hF(m.id)}"><span class="av" style="background:linear-gradient(135deg,#03aa49,#30b0c7)">${icon('medicamentos',16)}</span><span><b>${esc(m.n)}</b><small>${esc(m.g)} · ${esc(m.u)}${extra}</small></span>${tag(m)}</a>`;
const buscarM=q=>{q=norm(q.trim());if(!q)return[];const w=q.split(/\s+/);return M.filter(m=>{const f=fichaDe(m.id);const s=norm(m.n+' '+m.g+' '+m.u+' '+(f&&f.clase||'')+' '+(f&&f.comercial||''));return w.every(p=>s.includes(p))})};
const similares=m=>M.filter(x=>x.g===m.g&&x.id!==m.id);

const show=(h,el)=>{el.style.cssText='--c:'+COL;const p=h.split('-');
  try{
    if(p[1]==='f')return vFicha(el,BY[p[2]]);
    if(p[1]==='g')return vGrupo(el,+p[2]);
    if(p[1]==='calc')return vCalc(el,p[2],p[3]);
    if(p[1]==='cmp')return vCmp(el,p.slice(2));
    if(p[1]==='rx')return vRx(el);
    if(p[1]==='rxdoc')return vRxDoc(el);
    if(p[1]===undefined||p[1]==='0'||p[1]==='6')return vHome(el,p[1]==='0');
    if(p[1]==='1')return vCmp(el,[]);
    if(p[1]==='2')return p[2]!==undefined?vGrupo(el,+p[2]):vGrupos(el);
    if(p[1]==='3')return p[2]==='0'?vCalc(el,'omeprazol'):p[2]==='1'?vCmp(el,['omeprazol']):vFicha(el,BY.omeprazol);
    if(p[1]==='4')return vRx(el);
    if(p[1]==='5')return vEsq(el);
    vHome(el);
  }catch(e){console.error(e);el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos']],'Algo salió mal',esc(e.message))}</div>`}};

/* inicio */
const vHome=(el,foco)=>{const nf=Object.keys(F).length,favs=fav.map(i=>BY[i]).filter(Boolean),recs=rec.map(i=>BY[i]).filter(Boolean).slice(0,6);
  el.innerHTML=`<div class="cx">${head([['Medicamentos']],'Medicamentos',`${M.length} medicamentos de primer nivel; ${nf} con ficha verificada en fuente oficial`,(G.ILL?G.ILL.medicamentos:'')+pinBtn('medicamentos'))}
  <label class="sinput cx-search glass">${icon('search',18)}<input id="mq" type="search" placeholder="Nombre, grupo o uso: amoxicilina, otitis, reflujo…" autocomplete="off" aria-label="Buscar medicamento"></label><div id="mres" class="cx-list"></div>
  <div class="kids">${kid('Comparar medicamentos','Dos o tres lado a lado','swap','medicamentos-cmp',0)}${kid('Calculadora de dosis','Paso a paso: medicamento, peso y presentación','calc','medicamentos-calc',1)}${kid('Receta','Armar, revisar alergias e imprimir','doc','medicamentos-rx',2)}${kid('Mis esquemas','Combinaciones que usas seguido','star','medicamentos-5',3)}</div>
  ${favs.length?`<div class="cx-card glass rise" style="--i:7;margin-top:16px"><h3>Favoritos</h3><div class="cx-list">${favs.map(m=>fila(m)).join('')}</div></div>`:''}
  ${recs.length?`<div class="cx-card glass rise" style="--i:8;margin-top:14px"><h3>Recientes</h3><div class="cx-list">${recs.map(m=>fila(m)).join('')}</div></div>`:''}
  <p class="lbl rise" style="--i:9">Grupos terapéuticos</p><div class="kids" style="margin-top:12px">${GRUPOS.map((g,i)=>{const n=M.filter(m=>m.g===g).length,v=M.filter(m=>m.g===g&&fichaDe(m.id)).length;return kid(g,`${n} medicamentos${v?`, ${v} con ficha`:''}`,'medicamentos','medicamentos-g-'+i,i)}).join('')}</div></div>`;
  const q=$('#mq'),res=$('#mres');
  q.addEventListener('input',()=>{const r=buscarM(q.value);if(!q.value.trim()){res.innerHTML='';return}
    if(!r.length){res.innerHTML='<p class="cx-empty">Sin resultados en la lista de primer nivel.</p>';return}
    const top=r[0],sim=similares(top).slice(0,5);res.innerHTML=r.slice(0,10).map(m=>fila(m)).join('')+(sim.length?`<p class="hint" style="margin-top:10px;font-weight:600">Similares a ${esc(top.n)} (mismo grupo)</p>`+sim.map(m=>fila(m)).join(''):'')});
  if(foco||matchMedia('(min-width:720px)').matches)setTimeout(()=>q.focus({preventScroll:true}),300)};
const vGrupos=el=>{el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Grupos terapéuticos']],'Grupos terapéuticos','')}<div class="kids">${GRUPOS.map((g,i)=>kid(g,M.filter(m=>m.g===g).length+' medicamentos','medicamentos','medicamentos-g-'+i,i)).join('')}</div></div>`};
const vGrupo=(el,i)=>{const g=GRUPOS[i];if(!g)return vGrupos(el);const L=M.filter(m=>m.g===g);el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Grupos','medicamentos-2'],[g]],g,L.length+' medicamentos')}<div class="cx-list" style="margin-top:18px">${L.map(m=>fila(m)).join('')}</div></div>`};

/* ficha */
const SECS=[['indic','Indicaciones aprobadas'],['adulto','Dosis en adultos'],['ped','Dosis pediátrica'],['renal','Ajuste en función renal o hepática'],['emb','Embarazo'],['lac','Lactancia'],['ci','Contraindicaciones'],['prec','Precauciones y advertencias'],['ea','Efectos adversos frecuentes'],['int','Interacciones importantes'],['pres','Presentaciones de la etiqueta de referencia'],['notas','Notas para el consultorio']];
const lista=v=>Array.isArray(v)?`<ul class="mx-ul">${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(v)}</p>`;
const fichaHTML=(m,f,compacta)=>!f?`<div class="cx-card glass" style="margin-top:16px"><h3>Ficha en preparación</h3><p class="cx-empty">Esta ficha todavía no se ha verificado contra una fuente oficial, así que no muestra dosis. Uso principal en consultorio: ${esc(m.u)}.</p></div>`
  :`${f.alerta?`<div class="cx-mode" style="margin-top:16px;background:color-mix(in srgb,#ff3b30 12%,var(--card));border-color:color-mix(in srgb,#ff3b30 40%,transparent)"><i style="background:#ff3b30"></i><span><b>Alerta:</b> ${esc(f.alerta)}</span></div>`:''}
  <div class="mx-sum glass"><div><span>Clase</span><b>${esc(f.clase||'')}</b></div>${f.comercial?`<div><span>Nombres comerciales de referencia</span><b>${esc(f.comercial)}</b></div>`:''}<div><span>Uso principal</span><b>${esc(m.u)}</b></div></div>
  ${SECS.filter(([k])=>f[k]&&(!compacta||['adulto','ped','renal','emb','ci','int'].includes(k))).map(([k,t])=>`<section class="mx-sec glass"><h3>${t}</h3>${lista(f[k])}</section>`).join('')}
  <div class="cx-card glass" style="margin-top:12px"><h3>Fuente</h3><ol class="hx-ref">${f.fuente.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="hint">Revisada el ${esc(f.rev)}. Verifica siempre la ficha del producto que vas a recetar: las presentaciones y concentraciones en México pueden variar.</p></div>`;
const vFicha=(el,m)=>{if(!m){el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos']],'Medicamento no encontrado','')}</div>`;return}
  rec=[m.id,...rec.filter(i=>i!==m.id)].slice(0,12);store.set('gche2-mrec',rec);const f=fichaDe(m.id),sim=similares(m);
  el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],[m.g,'medicamentos-g-'+GRUPOS.indexOf(m.g)],[m.n]],m.n,esc(m.g))}
  <div class="cx-row"><button class="cxb gris sm" id="mFav">${fav.includes(m.id)?'★ En favoritos':'☆ Agregar a favoritos'}</button><a class="cxb gris sm" href="#medicamentos-cmp-${m.id}">${icon('swap',16)}Comparar</a>${f&&f.calc?`<a class="cxb gris sm" href="#medicamentos-calc-${m.id}">${icon('calc',16)}Calcular dosis</a>`:''}<button class="cxb gris sm" id="mRx">${icon('doc',16)}Agregar a receta</button></div>
  ${fichaHTML(m,f)}
  ${sim.length?`<div class="cx-card glass" style="margin-top:12px"><h3>Similares del mismo grupo</h3><div class="cx-list">${sim.map(x=>fila(x)).join('')}</div></div>`:''}</div>`;
  $('#mFav').onclick=()=>{fav=fav.includes(m.id)?fav.filter(i=>i!==m.id):[m.id,...fav];store.set('gche2-mfav',fav);$('#mFav').textContent=fav.includes(m.id)?'★ En favoritos':'☆ Agregar a favoritos';vib()};
  $('#mRx').onclick=()=>{RX.items.push({n:m.n,id:m.id,d:'',v:(f&&f.via)||'',f:'',t:''});saveRx();toast(m.n+' agregado a la receta');G.go('medicamentos-rx')}};

/* ficha flotante desde la pastilla de la barra */
const sheet=()=>{openSheet('Medicamentos rápidos',`<div class="cx"><label class="sinput">${icon('search',18)}<input id="sq2" type="search" placeholder="Busca un medicamento" autocomplete="off" aria-label="Buscar medicamento"></label><div id="sres2" class="cx-list"></div><div class="cx-row"><button class="cxb gris sm" data-cxh="medicamentos-cmp">Comparar</button><button class="cxb gris sm" data-cxh="medicamentos-calc">Calculadora de dosis</button><button class="cxb gris sm" data-cxh="medicamentos-rx">Receta</button></div></div>`);
  const q=$('#sq2'),r=$('#sres2');q.addEventListener('input',()=>{const L=buscarM(q.value).slice(0,8);r.innerHTML=L.map(m=>`<button class="cx-item" data-mx="ver" data-id="${m.id}"><span><b>${esc(m.n)}</b><small>${esc(m.g)}</small></span>${tag(m)}</button>`).join('')});
  SX.ver=b=>{const m=BY[b.dataset.id],f=fichaDe(m.id);$('#sTitle').textContent=m.n;$('#sBody').innerHTML=`<div class="cx" style="max-height:70vh;overflow:auto">${fichaHTML(m,f,true)}<div class="cx-row"><button class="cxb" data-cxh="${hF(m.id)}">Abrir ficha completa</button><button class="cxb gris" data-mx="volver">Buscar otro</button></div></div>`};
  SX.volver=()=>sheet()};

/* comparación */
const FILAS=[['clase','Clase'],['adulto','Dosis en adultos'],['ped','Dosis pediátrica'],['renal','Ajuste renal o hepático'],['emb','Embarazo'],['lac','Lactancia'],['ea','Efectos adversos'],['int','Interacciones'],['ci','Contraindicaciones']];
const vCmp=(el,ids)=>{ids=ids.filter(i=>BY[i]).slice(0,3);
  const col=i=>{const m=BY[ids[i]];return m?`<div class="h"><b>${esc(m.n)}</b><button class="cx-mini" data-q="${i}">Cambiar</button></div>`:`<div class="h"><button class="pick" data-p="${i}">${icon('<path d="M12 5v14M5 12h14"/>',16)}Medicamento ${i+1}</button></div>`};
  const val=(m,k)=>{if(!m)return'';const f=fichaDe(m.id);if(k==='clase')return esc(f?f.clase:m.g);if(!f)return'<span class="hint">Ficha en preparación</span>';const v=f[k];return v?(Array.isArray(v)?v.map(esc).join('<br>'):esc(v)):'<span class="hint">Sin dato</span>'};
  const n=Math.max(2,Math.min(3,ids.length+1));
  el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Comparar']],'Comparar medicamentos','Elige dos o tres. Solo los que tienen ficha verificada muestran dosis.',pinBtn('medicamentos-1'))}
  <div class="cmpwrap glass" style="margin-top:18px"><div class="cmp" style="grid-template-columns:150px repeat(${n},minmax(200px,1fr))"><div class="h">Característica</div>${Array.from({length:n},(_,i)=>col(i)).join('')}
  ${FILAS.map(([k,t])=>`<div class="rl">${t}</div>${Array.from({length:n},(_,i)=>`<div class="mx-cell">${val(BY[ids[i]],k)}</div>`).join('')}`).join('')}</div></div></div>`;
  const elegir=i=>{openSheet('Elegir medicamento',`<div class="cx"><label class="sinput">${icon('search',18)}<input id="cq" type="search" placeholder="Busca un medicamento" autocomplete="off" aria-label="Buscar"></label><div id="cres" class="cx-list"></div></div>`);
    const base=BY[ids[0]];const pinta=q=>{const L=q?buscarM(q):(base?similares(base):M.filter(m=>fichaDe(m.id)));$('#cres').innerHTML=L.slice(0,12).map(m=>`<button class="cx-item" data-mx="cmp" data-id="${m.id}"><span><b>${esc(m.n)}</b><small>${esc(m.g)}</small></span>${tag(m)}</button>`).join('')};pinta('');$('#cq').addEventListener('input',e=>pinta(e.target.value));
    SX.cmp=b=>{const nx=ids.slice();nx[i]=b.dataset.id;closeSheet();G.go('medicamentos-cmp-'+nx.filter(Boolean).join('-'))}};
  el.querySelectorAll('[data-p],[data-q]').forEach(b=>b.onclick=()=>elegir(+(b.dataset.p??b.dataset.q)))};


/* ficha breve para la calculadora */
const arr=x=>Array.isArray(x)?x:x?[x]:[];
const breve=(m,f)=>{const li=a=>arr(a).map(x=>`<li>${esc(x)}</li>`).join(''),txt=a=>arr(a).map(esc).join('. ').replace(/\.\./g,'.');
  const facts=[['Contraindicaciones',txt(f.ci)],['Ajuste renal y hepático',txt(f.renal)],['Embarazo',esc(f.emb||'')],['Lactancia',esc(f.lac||'')],['Interacciones importantes',txt(arr(f.int).slice(0,3))],['Presentaciones',txt(f.pres)]].filter(x=>x[1]);
  return `<article class="cx-card glass mx-b"><span class="mx-ok">Ficha verificada${f.rev?' · revisión '+esc(f.rev):''}</span>
  <p class="mx-q">${esc(f.clase||'')}${f.comercial?` · nombres comerciales: ${esc(f.comercial)}`:''}${f.via?` · vía ${esc(f.via)}`:''}</p>
  <span class="lab">Para qué se usa</span><div class="mx-pills">${arr(f.indic).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
  ${f.alerta?`<div class="mx-al">${esc(f.alerta)}</div>`:''}
  <div class="mx-doses"><div><h3>Adultos</h3><ul>${li(f.adulto)||'<li>Sin dosis de adulto en la ficha</li>'}</ul></div><div><h3>Pediátrico</h3><ul>${li(f.ped)||'<li>Sin dosis pediátrica en la ficha</li>'}</ul></div></div>
  <div class="mx-facts">${facts.map(([k,v])=>`<div><b>${k}</b>${v}</div>`).join('')}</div>
  <p class="hint mx-src">Fuente: ${arr(f.fuente).map(esc).join(' ')} <a href="#medicamentos-f-${m.id}">Ver la ficha completa</a></p></article>`};
/* calculadora guiada: independiente del expediente; el peso se escribe cada vez */
const KZ={id:null,e:0,peso:'',p:null,hora:null,ov:null};
const kzF=x=>{const a=Math.abs(x);return(a<1?Math.round(x*100)/100:a<100?Math.round(x*10)/10:Math.round(x)).toLocaleString('es-MX')};
const TABX={trimetoprimaconsulfametoxazol:[],sulfatoferroso:[],amoxicilinaconacidoclavulanico:[500,875],dexametasona:[0.5,4]};
const tabsDe=(id,f)=>{if(TABX[id])return TABX[id];const t=new Set();for(const p of arr(f.pres)){if(!/^(Tabletas?|Cápsulas?|Comprimidos?)/i.test(p)||/liberación|prolongada|vaginal|sublingual/i.test(p))continue;const seg=p.split(/;|\(/)[0];
  for(const x of seg.matchAll(/(\d[\d,]*(?:\.\d+)?)/g)){const v=parseFloat(x[1].replace(/,(?=\d{3})/g,''));const af=seg.slice(x.index),u=(af.match(/\b(mg|g)\b/)||[])[1];if(!u||/mililitro/.test(af.split(/\b(mg|g)\b/)[0]))continue;const mg=u==='g'?v*1000:v;if(mg>=1)t.add(mg)}}
  return[...t].sort((a,b)=>a-b)};
const kzPres=(m,f)=>{const c=f.calc;if(c.u)return[];const P=arr(c.conc).map(([l,v])=>({k:'ml',l,c:v}));tabsDe(m.id,f).forEach(T=>P.push({k:'tab',l:`Tableta o cápsula de ${kzF(T)} mg`,c:T}));return P};
const kzPasos=(m,f)=>{const s=[];if(f.calc.esquemas.length>1)s.push('para');s.push('peso');if(kzPres(m,f).length)s.push('pres');s.push('res');return s};
const kzSimple=(m,e,i)=>{if(m.id==='paracetamol')return['Fiebre o dolor, cada 6 horas','Fiebre o dolor, cada 4 horas','Dosis baja, cada 4 a 6 horas'][i]||e.t;const k=e.t.indexOf(':');return k>0?e.t.slice(0,k):e.t};
const kzUni=c=>!c.u?'mg':c.u.startsWith('mililitros')?'mililitros':c.u;
const kzDet=(c,e)=>`${e.mgkg.toLocaleString('es-MX')} ${kzUni(c)} por kilo ${e.u1?'en una sola dosis':e.por==='dia'?'al día':'por toma'}${e.u1?'':` · cada ${e.h} horas`}`;
const kzCalc=(c,p,e)=>{const unica=!!e.u1,tomas=unica?1:24/e.h;let toma=e.por==='dia'?p*e.mgkg/tomas:p*e.mgkg,tope='';
  if(e.max&&toma>e.max){toma=e.max;tope='Se usó la dosis máxima por toma de la ficha.'}let dia=toma*tomas;
  if(!unica&&e.maxd&&dia>e.maxd){toma=e.maxd/tomas;dia=e.maxd;tope='Se usó la dosis máxima al día de la ficha.'}return{toma,dia,tomas,unica,tope}};
const kzTab=(toma,T,max)=>{for(const n of[0.5,1,1.5,2])if(n*T>=toma*.9&&n*T<=toma*1.1&&(!max||n*T<=max*1.0001))return n;return null};
const kzTabT=n=>n===0.5?'Media tableta':n===1?'1 tableta':n===1.5?'1 y media tabletas':n+' tabletas';
const KZI={gotas:'<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6h8v8h-8z"/><path d="M22 14h12l1 6H21z"/><rect x="17" y="20" width="22" height="30" rx="5"/><path d="M28 30c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8z"/></svg>',
  frasco:'<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="5" width="12" height="7" rx="1.5"/><path d="M23 12v5c-5 2-8 5-8 10v20a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V27c0-5-3-8-8-10v-5"/><path d="M15 30h26M15 42h26"/></svg>',
  tableta:'<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="28" cy="28" r="17"/><path d="M28 13v30"/></svg>'};
const kzIco=l=>/gota/i.test(l)?KZI.gotas:/tableta|cápsula/i.test(l)?KZI.tableta:KZI.frasco;
const kzJer=ml=>{const cap=[1,3,5,10,20,60].find(c=>ml<=c)||60,x0=40,L=200,f=Math.min(ml/cap,1)*L,n=cap<=1?10:cap<=5?cap*2:cap<=20?cap:12,tk=[];
  for(let i=0;i<=n;i++){const x=x0+L*i/n;tk.push(`<line x1="${x}" y1="30" x2="${x}" y2="${i%(cap<=5?2:5)===0?40:36}" stroke="currentColor" stroke-width="1.2"/>`)}
  return`<svg class="kz-draw" viewBox="0 0 300 92" role="img" aria-label="Jeringa de ${cap} mililitros llena hasta ${kzF(ml)}"><rect class="kz-fill" x="${x0}" y="31" width="${f}" height="28" rx="2"/><rect x="${x0}" y="30" width="${L}" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>${tk.join('')}<path d="M${x0} 38h-14v14h14M26 45H8M${x0+L} 36h10v18h-10M${x0+L+10} 45h36M${x0+L+46} 32v26" fill="none" stroke="currentColor" stroke-width="2"/><text x="${x0}" y="80" font-size="12" fill="currentColor" opacity=".6">0</text><text x="${x0+L}" y="80" font-size="12" fill="currentColor" opacity=".6" text-anchor="end">${cap} ml</text></svg><p class="kz-mg">Jeringa de ${cap} mililitros${ml>60?'; usa más de una jeringa o vaso dosificador':''}</p>`};
const kzPast=n=>{const o=(x,h)=>h?`<path d="M${x} 14a26 26 0 0 0 0 52z" class="kz-pill" stroke="currentColor" stroke-width="2"/><path d="M${x} 14a26 26 0 0 1 0 52" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 5" opacity=".45"/>`:`<circle cx="${x}" cy="40" r="26" class="kz-pill" stroke="currentColor" stroke-width="2"/><line x1="${x}" y1="16" x2="${x}" y2="64" stroke="currentColor" stroke-width="1.5"/>`;
  const p=n===0.5?[o(150,1)]:n===1?[o(150)]:n===1.5?[o(120),o(185,1)]:[o(115),o(185)];return`<svg class="kz-draw" viewBox="0 0 300 80" role="img" aria-label="${kzTabT(n)}">${p.join('')}</svg>`};
const KZFAV=['paracetamol','ibuprofeno','amoxicilina','amoxicilinaconacidoclavulanico','cefalexina','azitromicina','trimetoprimaconsulfametoxazol','metamizol'];
const vCalc=(el,id,paso)=>{const m=BY[id],f=m&&fichaDe(m.id);
  if(m&&!(f&&f.calc&&f.calc.esquemas)){G.go(hF(m.id));return}
  const con=M.filter(x=>{const y=fichaDe(x.id);return y&&y.calc&&y.calc.esquemas});
  if(!m){KZ.id=null;
    el.innerHTML=`<div class="cx kz">${head([['Medicamentos','medicamentos'],['Calculadora']],'Calculadora','Un paso a la vez. No usa datos del expediente: escribes el peso cada vez.')}
    <p class="kz-q rise">¿Qué medicamento?</p><label class="sinput">${icon('search',18)}<input id="kzS" type="search" placeholder="Buscar, por ejemplo cefalexina" autocomplete="off" aria-label="Buscar medicamento"></label><div class="kz-grid" id="kzG"></div></div>`;
    const draw=()=>{const w=norm($('#kzS').value.trim()).split(/\s+/).filter(Boolean),r=w.length?con.filter(x=>w.every(p=>norm(x.n+' '+x.u).includes(p))):KZFAV.map(i=>BY[i]).filter(Boolean);
      $('#kzG').innerHTML=r.map(x=>`<a class="kz-tile" href="#medicamentos-calc-${x.id}"><b>${esc(x.n)}</b><small>${esc(x.u)}</small></a>`).join('')||`<p class="cx-empty">Sin resultados. La calculadora tiene los ${con.length} medicamentos con dosis por kilo en su ficha.</p>`};
    $('#kzS').oninput=draw;draw();return}
  if(KZ.id!==m.id)Object.assign(KZ,{id:m.id,e:0,p:null,ov:null});
  const c=f.calc,P=kzPasos(m,f);let k=P.includes(paso)?paso:P[0];
  const pesoOk=()=>{const v=parseFloat(String(KZ.peso).replace(',','.'));return v>0.3&&v<250?v:0};
  if((k==='pres'||k==='res')&&!pesoOk())k='peso';
  const ir=s=>G.go(`medicamentos-calc-${m.id}-${s}`),sig=()=>ir(P[P.indexOf(k)+1]);
  const dots=`<div class="kz-dots" aria-label="Paso ${P.indexOf(k)+2} de ${P.length+1}"><a href="#medicamentos-calc" class="ok" aria-label="Elegir medicamento"></a>${P.map((s,i)=>`<a ${i<P.indexOf(k)?`href="#medicamentos-calc-${m.id}-${s}" class="ok"`:i===P.indexOf(k)?'class="on"':''} aria-label="Paso ${i+2}"></a>`).join('')}</div>`;
  const top=`<div class="cx kz">${head([['Medicamentos','medicamentos'],['Calculadora','medicamentos-calc'],[m.n]],m.n,esc(f.clase||m.u))}${dots}`;
  if(k==='para'){el.innerHTML=`${top}<p class="kz-q">¿Para qué es?</p><div class="kz-list">${c.esquemas.map((e,i)=>`<button class="kz-opt${i===KZ.e&&!KZ.ov?' on':''}" data-e="${i}"><span><b>${esc(kzSimple(m,e,i))}</b><small>${esc(kzDet(c,e))}</small></span>${i===0?'<em>Habitual</em>':''}</button>`).join('')}</div>
    <details class="kz-more"><summary>Qué es, contraindicaciones y dosis de la ficha</summary>${breve(m,f)}</details></div>`;
    el.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{KZ.e=+b.dataset.e;KZ.ov=null;sig()});return}
  if(k==='peso'){el.innerHTML=`${top}<p class="kz-q">¿Cuánto pesa?</p><p class="hint">Escríbelo o usa los botones. No se toma del expediente.</p>
    <div class="kz-kg"><button id="kzMn" aria-label="Medio kilo menos">−</button><div><input id="kzKv" inputmode="decimal" placeholder="0" value="${esc(KZ.peso)}" aria-label="Peso en kilos"><span>kilos</span></div><button id="kzMs" aria-label="Medio kilo más">+</button></div>
    <input type="range" id="kzKr" class="kz-rng" min="1" max="100" step="0.5" value="${pesoOk()||15}" aria-label="Peso en kilos"><div class="kz-rl"><span>1 kilo</span><span>100 kilos</span></div>
    <div class="kz-quick">${[5,10,15,20,30,40].map(v=>`<button data-k="${v}">${v} kilos</button>`).join('')}</div>
    <button class="cxb kz-next" id="kzNx">Siguiente</button></div>`;
    const nb=$('#kzNx'),upd=()=>{nb.disabled=!pesoOk()};
    const set=v=>{v=Math.max(0.5,Math.min(250,Math.round(v*2)/2));KZ.peso=String(v);$('#kzKv').value=KZ.peso;$('#kzKr').value=v;upd()};
    let tm;const hold=(b,d)=>{b.onpointerdown=()=>{set((pesoOk()||0)+d);tm=setTimeout(function r(){set((pesoOk()||0)+d);tm=setTimeout(r,90)},420)};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>clearTimeout(tm)};
    hold($('#kzMn'),-0.5);hold($('#kzMs'),0.5);$('#kzKr').oninput=e=>set(+e.target.value);
    $('#kzKv').oninput=e=>{KZ.peso=e.target.value.replace(',','.');const v=pesoOk();if(v)$('#kzKr').value=v;upd()};
    $('#kzKv').onkeydown=e=>{if(e.key==='Enter'&&pesoOk())sig()};
    el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>set(+b.dataset.k));nb.onclick=sig;upd();return}
  const ps=kzPres(m,f);
  if(k==='pres'){el.innerHTML=`${top}<p class="kz-q">¿Qué tienes en la mano?</p><p class="hint">Elige la presentación del producto.</p><div class="kz-list">${ps.map((x,i)=>`<button class="kz-opt${i===KZ.p?' on':''}" data-p="${i}"><i class="kz-ico">${kzIco(x.l)}</i><span><b>${esc(x.l)}</b></span></button>`).join('')}</div></div>`;
    el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{KZ.p=+b.dataset.p;sig()});return}
  /* resultado */
  const p=pesoOk(),e=Object.assign({},c.esquemas[KZ.e],KZ.ov||{}),r=kzCalc(c,p,e),x=ps[KZ.p],U=kzUni(c);let big,sub='',dib='';
  if(c.u){big=`${kzF(r.toma)}<small> ${esc(U)}</small>`;if(c.u.startsWith('mililitros de'))sub='De '+esc(c.u.replace('mililitros de ',''));if(U==='mililitros'&&r.toma<=60)dib=kzJer(r.toma)}
  else if(x&&x.k==='ml'){const ml=r.toma/x.c;big=`${kzF(ml)}<small> mililitros</small>`;sub=`${kzF(r.toma)} mg · ${esc(x.l)}`;dib=kzJer(ml)}
  else if(x&&x.k==='tab'){const n=kzTab(r.toma,x.c,e.max);if(n){big=kzTabT(n);sub=`De ${kzF(x.c)} mg · ${kzF(n*x.c)} mg por toma`;dib=kzPast(n)}else{big='<span class="kz-na">No aplica en tableta</span>';sub=`Le tocan ${kzF(r.toma)} mg y la tableta es de ${kzF(x.c)} mg. Usa suspensión o gotas.`}}
  else big=`${kzF(r.toma)}<small> mg</small>`;
  if(KZ.hora===null)KZ.hora=(new Date().getHours()+1)%24;
  const hh=h=>`${String(Math.floor(h)).padStart(2,'0')}:${h%1?'30':'00'}`,hs=r.unica?[]:Array.from({length:Math.round(r.tomas)},(_,i)=>(KZ.hora+i*24/r.tomas)%24);
  const uD=c.u?U:'mg';
  el.innerHTML=`${top}<div class="kz-sum">${P.includes('para')?`<a href="#medicamentos-calc-${m.id}-para">${esc(KZ.ov?'Ajustada a mano':kzSimple(m,c.esquemas[KZ.e],KZ.e))}<i>Cambiar</i></a>`:''}<a href="#medicamentos-calc-${m.id}-peso">${esc(kzF(p))} kilos<i>Cambiar</i></a>${x?`<a href="#medicamentos-calc-${m.id}-pres">${esc(x.l)}<i>Cambiar</i></a>`:''}<a href="#medicamentos-calc">Otro medicamento<i>Cambiar</i></a></div>
  <div class="kz-res glass"><p class="kz-lb">Dar en cada toma</p><p class="kz-big">${big}</p>${dib}${sub?`<p class="kz-mg">${sub}</p>`:''}</div>
  <div class="kz-freq glass">${r.unica?'<h3>Una sola dosis</h3><p>No se repite.</p>':`<h3>Cada ${kzF(24/r.tomas)} horas</h3><p>${Math.round(r.tomas)} ${Math.round(r.tomas)===1?'vez':'veces'} al día · ${kzF(r.dia)} ${esc(uD)} al día · ${kzF(r.dia/p)} ${esc(uD)} por kilo al día</p><div class="kz-times">${hs.map(h=>`<span>${hh(h)}</span>`).join('')}</div><label class="kz-hr">Primera toma a las <select id="kzHr">${Array.from({length:48},(_,i)=>i/2).map(h=>`<option value="${h}"${h===KZ.hora?' selected':''}>${hh(h)}</option>`).join('')}</select></label>`}</div>
  ${r.tope?`<div class="kz-warn"><b>Se aplicó el máximo</b>${r.tope}</div>`:''}
  ${p>=40?`<div class="kz-warn"><b>Pesa 40 kilos o más</b>Revisa la dosis de adulto de la ficha; la calculadora nunca pasa el máximo.<ul>${arr(f.adulto).slice(0,4).map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>`:''}
  ${c.nota?`<p class="hint">${esc(c.nota)}</p>`:''}<p class="hint">Confirma con la ficha y con el producto antes de indicarla. <a href="#${hF(m.id)}">Ver la ficha completa</a></p>
  <details class="kz-more"${KZ.ov?' open':''}><summary>Ajustar dosis a mano</summary><div class="kz-adj">
   <label>Dosis por kilo (${esc(uD)})<input id="kzA1" inputmode="decimal" value="${e.mgkg}"></label>
   <label>Cada cuántas horas<input id="kzA2" inputmode="decimal" value="${e.u1?24:e.h}"></label>
   <label>La dosis por kilo es<select id="kzA3"><option value="dosis"${e.por!=='dia'?' selected':''}>por toma</option><option value="dia"${e.por==='dia'?' selected':''}>al día</option></select></label>
   <label>Máximo por toma (${esc(uD)})<input id="kzA4" inputmode="decimal" value="${e.max||''}"></label>
   <label>Máximo al día (${esc(uD)})<input id="kzA5" inputmode="decimal" value="${e.maxd||''}"></label>
   <button class="cxb gris" id="kzA0">Volver a la dosis de la ficha</button></div></details></div>`;
  const hr=$('#kzHr');if(hr)hr.onchange=()=>{KZ.hora=+hr.value;vCalc(el,id,'res')};
  const num=i=>{const v=parseFloat(($('#'+i).value||'').replace(',','.'));return isFinite(v)&&v>0?v:undefined};
  const adj=()=>{const a=num('kzA1'),h=num('kzA2');if(!a||!h)return;KZ.ov={mgkg:a,h,u1:false,por:$('#kzA3').value,max:num('kzA4'),maxd:num('kzA5')};vCalc(el,id,'res')};
  ['kzA1','kzA2','kzA3','kzA4','kzA5'].forEach(i=>$('#'+i).onchange=adj);$('#kzA0').onclick=()=>{KZ.ov=null;vCalc(el,id,'res')}};

/* receta */
const vRx=el=>{const pac=window.CX&&CX.pacienteActual&&CX.pacienteActual();if(!RX.pac&&pac)RX.pac=pac.nombre;
  const alerg=window.CX&&CX.alergiaDe?CX.alergiaDe(RX.pac):null;
  el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Receta']],'Receta','Arma la receta, revisa alergias y guárdala como esquema o imprímela. Para que quede en el expediente, haz la receta dentro de la nota de consulta.',pinBtn('medicamentos-4'))}
  <div class="cx-sec glass"><div class="fx"><div class="fw full"><label for="rPac">Paciente</label><input id="rPac" value="${esc(RX.pac)}" autocomplete="off" list="rPacL"><datalist id="rPacL">${(window.CX&&CX.nombres?CX.nombres():[]).map(n=>`<option value="${esc(n)}">`).join('')}</datalist></div></div>
  ${alerg&&!alerg.neg?`<div class="cx-mode" style="background:color-mix(in srgb,#ff3b30 12%,var(--card));border-color:color-mix(in srgb,#ff3b30 40%,transparent)"><i style="background:#ff3b30"></i><span><b>Alergias:</b> ${esc(alerg.txt)}</span></div>`:''}
  <div class="rws" id="rItems" style="margin-top:14px">${RX.items.map((it,i)=>`<div class="rw"><input class="wide" data-ri="${i}" data-c="n" value="${esc(it.n)}" placeholder="Medicamento" list="rMedL"><input data-ri="${i}" data-c="d" value="${esc(it.d)}" placeholder="Dosis"><input data-ri="${i}" data-c="v" value="${esc(it.v)}" placeholder="Vía"><input data-ri="${i}" data-c="f" value="${esc(it.f)}" placeholder="Frecuencia"><input data-ri="${i}" data-c="t" value="${esc(it.t)}" placeholder="Duración"><button class="x" data-rd="${i}" aria-label="Quitar">×</button><div class="al" data-ral="${i}"></div></div>`).join('')}</div><datalist id="rMedL">${M.map(m=>`<option value="${esc(m.n)}">`).join('')}</datalist>
  <div class="cx-row"><button class="cxb gris sm" id="rAdd">+ Agregar medicamento</button><button class="cxb gris sm" id="rEsq">Guardar como esquema</button><button class="cxb gris sm" id="rLoad">Usar un esquema</button><button class="cxb gris sm" id="rClr">Vaciar</button></div>
  <div class="cx-row"><a class="cxb" href="#medicamentos-rxdoc">${icon('doc',16)}Ver para imprimir</a></div></div></div>`;
  const alertas=()=>el.querySelectorAll('[data-ral]').forEach(a=>{const it=RX.items[+a.dataset.ral];const w=window.CX&&CX.choque?CX.choque(RX.pac,it&&it.n):'';a.textContent=w?`Atención: coincide con una alergia registrada (${w}).`:''});
  el.querySelector('.cx').addEventListener('input',e=>{const t=e.target;if(t.id==='rPac'){RX.pac=t.value;saveRx();return}if(t.dataset.ri!==undefined){RX.items[+t.dataset.ri][t.dataset.c]=t.value;saveRx();if(t.dataset.c==='n')alertas()}});
  $('#rPac').addEventListener('change',()=>vRx(el));
  el.querySelectorAll('[data-rd]').forEach(b=>b.onclick=()=>{RX.items.splice(+b.dataset.rd,1);saveRx();vRx(el)});
  $('#rAdd').onclick=()=>{RX.items.push({n:'',d:'',v:'',f:'',t:''});saveRx();vRx(el)};
  $('#rClr').onclick=()=>{RX.items=[];saveRx();vRx(el)};
  $('#rEsq').onclick=()=>{if(!RX.items.length){toast('Agrega al menos un medicamento');return}SX.esq=()=>{const n=$('#esqN').value.trim();if(!n)return;esq=[{id:Date.now().toString(36),n,items:JSON.parse(JSON.stringify(RX.items))},...esq];store.set('gche2-esq',esq);closeSheet();toast('Esquema guardado')};
    openSheet('Guardar esquema',`<div class="cx"><div class="fw"><label for="esqN">Nombre del esquema</label><input id="esqN" placeholder="Por ejemplo, faringoamigdalitis en adulto"></div><div class="cx-row"><button class="cxb" data-mx="esq">Guardar</button></div></div>`)};
  $('#rLoad').onclick=()=>{if(!esq.length){toast('Todavía no tienes esquemas');return}SX.usar=b=>{const e=esq.find(x=>x.id===b.dataset.id);RX.items=[...RX.items,...JSON.parse(JSON.stringify(e.items))];saveRx();closeSheet();vRx(el)};
    openSheet('Mis esquemas',`<div class="cx-list">${esq.map(e=>`<button class="cx-item" data-mx="usar" data-id="${e.id}"><span><b>${esc(e.n)}</b><small>${esc(e.items.map(i=>i.n).join(', '))}</small></span></button>`).join('')}</div>`)};
  alertas()};
const vRxDoc=el=>{const m=window.CX&&CX.medicoDatos?CX.medicoDatos():{titulo:'Dr.',nombre:'Genaro Chicatti Enríquez'};const al=window.CX&&CX.alergiaDe?CX.alergiaDe(RX.pac):null;const hoy=new Date().toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
  const items=RX.items.filter(i=>i.n);
  el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Receta','medicamentos-rx'],['Para imprimir']],'Receta','Revisa y guárdala como PDF o imprímela.')}
  <div class="cx-doctools"><button class="cxb" id="dPrint">Imprimir o guardar como PDF</button><a class="cxb gris" href="#medicamentos-rx">Regresar</a></div>
  <div class="doc"><header><div><b>${esc(`${m.titulo} ${m.nombre}`)}</b><br>Cédula profesional: ${esc(m.cedula||'pendiente')}${m.titulo_inst?'<br>'+esc(m.titulo_inst):''}</div><div>${m.consultorio?esc(m.consultorio)+'<br>':''}${m.domicilio?esc(m.domicilio)+'<br>':''}${m.telefono?'Teléfono: '+esc(m.telefono):''}</div></header>
  <h2>Receta médica</h2><div class="pid"><span><b>Paciente:</b> ${esc(RX.pac||'')}</span><span><b>Fecha:</b> ${hoy}</span>${al&&!al.neg?`<span class="alg"><b>Alergias:</b> ${esc(al.txt)}</span>`:''}</div>
  ${items.length?`<ol>${items.map(r=>`<li><b>${esc(r.n)}</b><br>${esc([r.d,r.v?'vía '+r.v:'',r.f,r.t?'durante '+r.t:''].filter(Boolean).join(', '))}</li>`).join('')}</ol>`:'<p>Sin medicamentos.</p>'}
  <div class="firma"><i></i><b>${esc(`${m.titulo} ${m.nombre}`)}</b><span>Cédula profesional: ${esc(m.cedula||'pendiente')}</span></div></div></div>`;
  $('#dPrint').onclick=()=>window.print()};
const vEsq=el=>{el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Mis esquemas']],'Mis esquemas','Combinaciones que guardaste desde la receta. Se guardan en este dispositivo.',pinBtn('medicamentos-5'))}${esq.length?`<div class="cx-list" style="margin-top:18px">${esq.map(e=>`<div class="cx-item"><span><b>${esc(e.n)}</b><small>${esc(e.items.map(i=>[i.n,i.d,i.f].filter(Boolean).join(' ')).join('; '))}</small></span><button class="cxb gris sm" data-use="${e.id}">Usar</button><button class="cxb gris sm" data-del="${e.id}">Borrar</button></div>`).join('')}</div>`:'<p class="cx-empty" style="margin-top:18px">Todavía no tienes esquemas. Arma una receta y toca Guardar como esquema.</p>'}<div class="cx-row"><a class="cxb" href="#medicamentos-rx">Ir a la receta</a></div></div>`;
  el.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{const e=esq.find(x=>x.id===b.dataset.use);RX.items=[...RX.items,...JSON.parse(JSON.stringify(e.items))];saveRx();G.go('medicamentos-rx')});
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{esq=esq.filter(x=>x.id!==b.dataset.del);store.set('gche2-esq',esq);vEsq(el)})};

const buscar=q=>{const r=buscarM(q).slice(0,5);return r.length?`<p class="slabel" style="margin:14px 0 0">Medicamentos</p><div class="nlist">${r.map(m=>`<button data-cxh="${hF(m.id)}" style="--c:${COL}"><i></i><span><b style="font-size:15px">${esc(m.n)}</b><small>${esc(m.g)}${fichaDe(m.id)?'':' · ficha en preparación'}</small></span>${icon('medicamentos',18)}</button>`).join('')}</div>`:''};
window.MX={owns,show,sheet,buscar,ficha:fichaDe,lista:M};
const h0=location.hash.slice(1);if(owns(h0))G.route();
})();
