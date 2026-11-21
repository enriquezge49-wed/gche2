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
    if(p[1]==='calc')return vCalc(el,p[2]);
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
  <div class="kids">${kid('Comparar medicamentos','Dos o tres lado a lado','swap','medicamentos-cmp',0)}${kid('Calculadora de dosis','Por kilo, con tope de dosis máxima','calc','medicamentos-calc',1)}${kid('Receta','Armar, revisar alergias e imprimir','doc','medicamentos-rx',2)}${kid('Mis esquemas','Combinaciones que usas seguido','star','medicamentos-5',3)}</div>
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

/* calculadora de dosis */
const vCalc=(el,id)=>{const m=BY[id],f=m&&fichaDe(m.id),c=f&&f.calc,pac=window.CX&&CX.pacienteActual&&CX.pacienteActual();
  const opciones=M.filter(x=>fichaDe(x.id)&&fichaDe(x.id).calc);
  el.innerHTML=`<div class="cx">${head([['Medicamentos','medicamentos'],['Calculadora de dosis']],'Calculadora de dosis','Dosis por kilo con tope de dosis máxima. Revisa siempre la ficha del producto.')}
  <div class="hx-lay"><div class="cx-sec glass"><div class="fx">
   <div class="fw full"><label for="kMed">Medicamento</label><select id="kMed"><option value="">Manual (sin medicamento)</option>${opciones.map(x=>`<option value="${x.id}"${x.id===id?' selected':''}>${esc(x.n)}</option>`).join('')}</select></div>
   ${c&&c.esquemas?`<div class="fw full"><span class="lab">Esquema de la ficha</span><div class="opts">${c.esquemas.map((e,i)=>`<button type="button" class="chip${i===0?' on':''}" data-es="${i}">${esc(e.t)}</button>`).join('')}</div></div>`:''}
   <div class="fw"><label for="kPeso">Peso (kilogramos)</label><input id="kPeso" inputmode="decimal" value="${pac&&pac.peso?esc(pac.peso):''}"></div>
   <div class="fw"><label for="kDosis">Dosis (miligramos por kilo)</label><input id="kDosis" inputmode="decimal"></div>
   <div class="fw"><span class="lab">La dosis es</span><div class="opts"><button type="button" class="chip on" data-por="dia">Por día</button><button type="button" class="chip" data-por="dosis">Por toma</button></div></div>
   <div class="fw"><label for="kInt">Cada cuántas horas</label><input id="kInt" inputmode="decimal"></div>
   <div class="fw"><label for="kMax">Dosis máxima por toma (miligramos)</label><input id="kMax" inputmode="decimal"></div>
   <div class="fw"><label for="kMaxD">Dosis máxima al día (miligramos)</label><input id="kMaxD" inputmode="decimal"></div>
   <div class="fw full"><label for="kConc">Concentración del producto (miligramos por mililitro, opcional)</label><input id="kConc" inputmode="decimal" placeholder="Por ejemplo 250 mg en 5 ml = 50">${c&&c.conc?`<div class="fr">${c.conc.map(x=>`<button type="button" data-conc="${x[1]}">${esc(x[0])}</button>`).join('')}</div>`:''}</div>
  </div>${pac&&pac.peso?`<p class="hint">Peso tomado del expediente de ${esc(pac.nombre)}.</p>`:''}</div><div class="hx-res glass" id="kRes"></div></div>
  ${f?`<div class="cx-card glass" style="margin-top:14px"><h3>Fuente del esquema</h3><ol class="hx-ref">${f.fuente.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${c&&c.nota?`<p class="hint">${esc(c.nota)}</p>`:''}</div>`:''}</div>`;
  let por='dia';
  const set=e=>{$('#kDosis').value=e.mgkg;por=e.por;el.querySelectorAll('[data-por]').forEach(b=>b.classList.toggle('on',b.dataset.por===por));$('#kInt').value=e.h;$('#kMax').value=e.max||'';$('#kMaxD').value=e.maxd||'';calcK()};
  const calcK=()=>{const n=x=>{const v=parseFloat(($('#'+x).value||'').replace(',','.'));return isFinite(v)?v:null};const p=n('kPeso'),d=n('kDosis'),h=n('kInt'),mx=n('kMax'),md=n('kMaxD'),cc=n('kConc'),box=$('#kRes');
    if(!p||!d||!h){box.className='hx-res glass';box.innerHTML='<p class="hint" style="margin:0">Resultado</p><b class="hx-n" style="font-size:22px;color:var(--ink2)">Escribe peso, dosis e intervalo</b>';return}
    const tomas=24/h;let toma=por==='dia'?p*d/tomas:p*d,tope='';if(mx&&toma>mx){toma=mx;tope='Se aplicó el tope de dosis máxima por toma.'}let dia=toma*tomas;if(md&&dia>md){toma=md/tomas;dia=md;tope='Se aplicó el tope de dosis máxima al día.'}
    const r=x=>Math.round(x*10)/10;box.className='hx-res glass '+(tope?'warn':'ok');
    box.innerHTML=`<p class="hint" style="margin:0">Cada ${r(h)} horas (${r(tomas)} tomas al día)</p><b class="hx-n">${r(toma)} miligramos</b>${cc?`<p class="hx-u">${r(toma/cc)} mililitros por toma</p>`:''}<p class="hx-i">${r(dia)} miligramos al día${p?` (${r(dia/p)} miligramos por kilo al día)`:''}</p>${tope?`<p class="hint" style="color:#c27c00;font-weight:600">${tope}</p>`:''}<p class="hint">Confirma la dosis con la ficha y el producto antes de indicarla.</p>`};
  el.querySelector('.cx').addEventListener('input',calcK);
  $('#kMed').onchange=e=>G.go('medicamentos-calc'+(e.target.value?'-'+e.target.value:''));
  el.querySelectorAll('[data-por]').forEach(b=>b.onclick=()=>{por=b.dataset.por;el.querySelectorAll('[data-por]').forEach(x=>x.classList.toggle('on',x===b));calcK()});
  el.querySelectorAll('[data-es]').forEach(b=>b.onclick=()=>{el.querySelectorAll('[data-es]').forEach(x=>x.classList.toggle('on',x===b));set(c.esquemas[+b.dataset.es])});
  el.querySelectorAll('[data-conc]').forEach(b=>b.onclick=()=>{$('#kConc').value=b.dataset.conc;calcK()});
  if(c&&c.esquemas)set(c.esquemas[0]);else calcK()};

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
