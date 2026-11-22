/* GCHE2 · Consultas: pacientes, expediente, historia clínica, notas, referencia, agenda y documentos.
   Guarda en Firebase (con sesión de Google) o, si no hay configuración, en el dispositivo como modo de prueba. */
(()=>{
'use strict';
const G=window.G,X=window.CXS;if(!G||!X)return;
const {$,icon,toast,openSheet,closeSheet,vib,store}=G;
const {fISO,pDate,fLarga,num,edadP,aniosP,sexoP,sdgDe,sdgTxt,fppDe,imcDe}=X.util;
const COL='#0071e3';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const hoy=()=>fISO(new Date());
const fHora=ts=>ts?new Date(ts).toLocaleString('es-MX',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
const fCorta=ts=>ts?new Date(ts).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'}):'';
const TIPOS={h:['Adulto hombre','person'],m:['Adulto mujer','person'],e:['Embarazada','preg'],p:['Pediátrico','baby'],g:['Adulto mayor','elder']};
const ORDEN_T=['h','m','e','p','g'];
const RAP=[['Adulto','person','a'],['Embarazada','preg','e'],['Pediátrico','baby','p'],['Adulto mayor','elder','g']];
const SX={};
document.getElementById('sBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-x]');if(b&&SX[b.dataset.x]){e.stopPropagation();SX[b.dataset.x](b);return}
  const h=e.target.closest('[data-cxh]');if(h){closeSheet();G.go(h.dataset.cxh)}
});

/* datos */
const COLS=['pacientes','consultas','citas','referencias','perfil','estudio'];
const S={};COLS.forEach(c=>S[c]={});
let MODO=window.GCHE2_FIREBASE?'cargando':'local',PEND=false,NERR='';
const cargados=new Set();
if(MODO==='local'){const d=store.get('gche2-db',null);if(d)COLS.forEach(c=>S[c]=d[c]||{})}
const persist=()=>store.set('gche2-db',S);
const put=(col,o)=>{
  o.act=Date.now();S[col][o.id]=o;
  if(MODO==='nube'){PEND=true;window.NUBE.put(col,o).then(()=>{}).catch(e=>toast(errTxt(e)))}
  else if(MODO==='local')persist();
  saveInd();
};
const del=(col,id)=>{delete S[col][id];if(MODO==='nube')window.NUBE.del(col,id).catch(e=>toast(errTxt(e)));else if(MODO==='local')persist()};
const L=col=>Object.values(S[col]||{});
const med=()=>Object.assign({titulo:'Dr.',nombre:'Genaro Chicatti Enríquez'},(S.perfil||{}).medico||{});
const medTxt=()=>{const m=med();return `${m.titulo} ${m.nombre}`.trim()+(m.cedula?`, cédula profesional ${m.cedula}`:'')};
const errTxt=e=>{const c=(e&&e.code)||'';return({
  'auth/unauthorized-domain':'Falta autorizar el dominio en Firebase (Authentication, Configuración).',
  'auth/popup-closed-by-user':'Cerraste la ventana de inicio de sesión.',
  'auth/cancelled-popup-request':'Se canceló el inicio de sesión.',
  'auth/network-request-failed':'Sin conexión a internet.',
  'auth/operation-not-allowed':'Falta habilitar Google en Authentication, Método de acceso.',
  'permission-denied':'La nube rechazó el acceso: revisa las reglas de Firestore.',
  'unavailable':'Sin conexión: se guarda en el dispositivo y se sube al conectar.'
})[c]||('No se pudo completar: '+(c||(e&&e.message)||e))};

addEventListener('nube',()=>{
  const N=window.NUBE;if(!N||!N.on)return;
  const antes=MODO;
  if(N.user){
    MODO='nube';cargados.clear();
    N.watch(COLS,(col,m,p,cache,err)=>{
      if(err){NERR=errTxt(err);toast(NERR);return}
      S[col]=m;cargados.add(col);PEND=p;saveInd();if(col==='estudio')dispatchEvent(new Event('cx-estudio'));else suave(false);
    });
  }else if(N.error==='sin-conexion'){MODO='error';NERR='Sin conexión. Abre la app con internet una vez para conectar con tu cuenta.'}
  else if(N.ready){MODO='login';COLS.forEach(c=>S[c]={});if(N.error){toast(errTxt({code:N.error}));N.error=null}}
  if(antes!==MODO){suave(true);G.renderPanel&&G.renderPanel()}
});
const listo=()=>MODO==='local'||(MODO==='nube'&&cargados.has('pacientes'));

/* indicador de guardado */
const saveInd=(busy)=>{const e=document.getElementById('cxSave');if(!e)return;
  e.classList.toggle('busy',!!busy);e.classList.toggle('local',!busy&&(MODO==='local'||PEND));
  e.textContent=busy?'Guardando':MODO==='local'?'Guardado en este dispositivo':PEND||!navigator.onLine?'Guardado, se sube al conectar':'Guardado en la nube'};
addEventListener('online',()=>saveInd());addEventListener('offline',()=>saveInd());

/* pacientes */
const nombreP=p=>((p&&p.hc&&p.hc.nombre)||'Sin nombre').trim();
const ini=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const consultasDe=pid=>L('consultas').filter(c=>c.pid===pid).sort((a,b)=>b.fecha-a.fecha);
const refsDe=pid=>L('referencias').filter(c=>c.pid===pid).sort((a,b)=>b.fecha-a.fecha);
const alergias=p=>{const h=p.hc||{};const t=[h.alerg_t,h.alerg_rap].filter(x=>x&&norm(x)!=='negadas').join('; ');
  const tipos=(h.alerg||[]).filter(x=>x!=='Negadas');
  if(t||tipos.length)return{txt:t||tipos.join(', '),neg:false};
  if((h.alerg||[]).includes('Negadas')||norm(h.alerg_rap)==='negadas')return{txt:'Alergias negadas',neg:true};
  return{txt:'Alergias no registradas',neg:true,nada:true}};
const STOP=new Set(['medicamentos','medicamento','alimentos','alergia','alergias','reaccion','negadas','otros','picaduras','urticaria','ronchas','comezon','prurito','edema','anafilaxia','choque','rash','exantema','todos','todas']);
const choqueAlergia=(p,nombre)=>{if(!p||!nombre)return'';const a=alergias(p);if(a.neg)return'';const n=norm(nombre);
  const ws=norm(a.txt).split(/[^a-zñ]+/).filter(w=>w.length>=4&&!STOP.has(w));return ws.find(w=>n.includes(w)||(n.split(/[^a-zñ]+/)[0]||'').length>=4&&w.includes(n.split(/[^a-zñ]+/)[0]))||''};
const hcAvance=p=>{const M=modeloHC(p);const c=M.ctx();let t=0,f=0;M.schema.forEach(s=>{if(!s.f||!vis(s,c))return;s.f.forEach(x=>{if(CNT.has(x.t)&&vis(x,c)){t++;if(filled(x,M.src(x)[x.id]))f++}})});return t?Math.round(f/t*100):0};
const ultimaConsulta=pid=>consultasDe(pid)[0];

/* motor de formularios */
const CNT=new Set(['ln','tx','nm','dt','hr','se','ck','sy','rg','rw','tm','gr','sl']);
const WIDE=new Set(['tx','sy','rg','gr','rw','tm','ck','nt','hd','bt']);
const vis=(f,c)=>(!f.v||f.v.includes(c.tipo))&&(!f.if||!!f.if(c));
const filled=(f,v)=>{switch(f.t){
  case 'ck':return Array.isArray(v)&&v.length>0;
  case 'sy':return !!v&&(!!v.n||!!(v.s&&v.s.length)||!!v.t);
  case 'rg':return !!v&&(!!v.n||!!v.t);
  case 'rw':return Array.isArray(v)&&v.some(r=>r&&r.n);
  case 'tm':return !!v&&(!!v.f||!!v.r);
  case 'gr':return !!v&&(!!v.neg||Object.values(v.m||{}).some(a=>a&&a.length));
  case 'bo':return v===true;
  default:return v!==undefined&&v!==null&&String(v).trim()!==''}};
const fr=(f,c)=>{const l=typeof f.fr==='function'?f.fr(c):f.fr;if(!l||!l.length)return'';return `<div class="fr">${l.map(t=>`<button type="button" data-fr="${f.id}" data-t="${esc(t)}">${esc(t.length>44?t.slice(0,42)+'…':t)}</button>`).join('')}</div>`};
const lab=f=>`<label for="f_${f.id}" class="${f.req?'req':''}">${esc(f.l)}</label>`;
const fh=(f,k,c,M)=>{
  const v=f.id?M.src(f)[f.id]:undefined,id='f_'+f.id;let x='',full=f.full||WIDE.has(f.t)||(f.t==='se'&&(f.op.length>3||f.op.join('').length>34));
  switch(f.t){
    case 'hd':return `<div class="fw hd" data-k="${k}"${vis(f,c)?'':' hidden'}>${esc(f.l)}</div>`;
    case 'nt':return `<div class="fw nt${f.red?' red':''}" data-k="${k}"${vis(f,c)?'':' hidden'}>${esc(f.l)}</div>`;
    case 'bt':return `<div class="fw full" data-k="${k}"${vis(f,c)?'':' hidden'}><button type="button" class="cxb gris sm" data-bt="${f.act}">${icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',16)}${esc(f.l)}</button></div>`;
    case 'ln':x=lab(f)+`<input id="${id}" data-f="${f.id}" type="${f.tel?'tel':'text'}" value="${esc(v)}" autocomplete="off"${f.ph?` placeholder="${esc(f.ph)}"`:''}>`;break;
    case 'nm':x=lab(f)+`<input id="${id}" data-f="${f.id}" type="text" inputmode="decimal" value="${esc(v)}" autocomplete="off">`;break;
    case 'dt':x=lab(f)+`<input id="${id}" data-f="${f.id}" type="date" value="${esc(v)}">`;break;
    case 'hr':x=lab(f)+`<input id="${id}" data-f="${f.id}" type="time" value="${esc(v)}">`;break;
    case 'tx':x=lab(f)+`<textarea id="${id}" data-f="${f.id}" rows="3" placeholder="${esc(typeof f.ph==='function'?f.ph(c):(f.ph||''))}">${esc(v)}</textarea>`+fr(f,c);break;
    case 'sl':x=lab(f)+`<div style="display:flex;gap:14px;align-items:center"><input id="${id}" data-f="${f.id}" type="range" min="0" max="10" step="1" value="${v===undefined||v===''?0:esc(v)}"><b data-slv style="min-width:30px;font-size:19px;text-align:center">${v===undefined||v===''?'—':esc(v)}</b></div>`;break;
    case 'se':x=`<span class="lab ${f.req?'req':''}">${esc(f.l)}</span><div class="opts">${f.op.map(o=>`<button type="button" class="chip${v===o?' on':''}" data-se="${f.id}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;break;
    case 'ck':{const a=v||[];x=`<span class="lab ${f.req?'req':''}">${esc(f.l)}</span><div class="opts">${f.op.map(o=>`<button type="button" class="chip${a.includes(o)?' on':''}${f.red&&o!==f.ex?' red':''}${o===f.ex?' ok':''}" data-ck="${f.id}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;break}
    case 'bo':x=`<div class="opts"><button type="button" class="chip${v?' on':''}${f.red?' red':''}" data-bo="${f.id}">${v?'✓ ':''}${esc(f.l)}${f.req?' *':''}</button></div>`;break;
    case 'au':{const r=f.fn(c);x=`<span class="lab">${esc(f.l)}</span><div class="auto${r?'':' na'}" data-auto>${r?esc(r):'Se calcula al llenar los datos'}</div>`;break}
    case 'sy':{const o=v||{};x=`<div class="box"><div class="bh"><b class="${f.req?'req':''}">${esc(f.l)}</b><button type="button" class="cx-mini${o.n?' on':''}" data-syn="${f.id}">Negado</button></div><div class="opts">${f.op.map(s=>`<button type="button" class="chip${(o.s||[]).includes(s)?' on red':''}" data-syc="${f.id}" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>${(o.s||[]).length||o.t?`<textarea data-syt="${f.id}" placeholder="Describe cada síntoma: tiempo de evolución, frecuencia e intensidad">${esc(o.t)}</textarea>`:''}</div>`;break}
    case 'rg':{const o=v||{};x=`<div class="box"><div class="bh"><b class="${f.req?'req':''}">${esc(f.l)}</b>${f.def?`<button type="button" class="cx-mini${o.n?' on':''}" data-rgn="${f.id}">Normal</button>`:''}<button type="button" class="cx-mini alt${o.a?' on':''}" data-rga="${f.id}">Alterado</button></div><textarea data-rgt="${f.id}" placeholder="${f.def?'Toca Normal o describe los hallazgos':'Describe los hallazgos'}">${esc(o.t)}</textarea>${o.a&&f.det?`<p class="det">Revisa: ${esc(f.det)}</p>`:''}</div>`;break}
    case 'gr':{const o=v||{},m=o.m||{};x=`<div class="bh" style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><b style="font-size:15px;font-weight:600;margin-right:auto">${esc(f.l)}</b><button type="button" class="cx-mini${o.neg?' on':''}" data-grn="${f.id}">Negados</button></div><div class="grid"><table><thead><tr><th>Enfermedad</th>${X.FAM.map(n=>`<th>${esc(n)}</th>`).join('')}</tr></thead><tbody>${X.HF.map((d,i)=>`<tr><td>${esc(d)}</td>${X.FAM.map((n,j)=>`<td><button type="button" class="${(m[i]||[]).includes(j)?'on':''}" data-gr="${f.id}" data-i="${i}" data-j="${j}" aria-label="${esc(d+', '+n)}">${(m[i]||[]).includes(j)?'✓':''}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;break}
    case 'rw':{const rows=Array.isArray(v)&&v.length?v:[{}];x=`<span class="lab ${f.req?'req':''}">${esc(f.l)}</span><div class="rws">${rows.map((r,i)=>`<div class="rw">${f.cols.map(([ck,cl,co])=>co&&co.op?`<select data-rw="${f.id}" data-r="${i}" data-c="${ck}" aria-label="${esc(cl)}"><option value="">${esc(cl)}</option>${co.op.map(o=>`<option${r[ck]===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input data-rw="${f.id}" data-r="${i}" data-c="${ck}" class="${co&&co.w?'wide':''}" placeholder="${esc(cl)}" aria-label="${esc(cl)}" value="${esc(r[ck])}" autocomplete="off">`).join('')}<button type="button" class="x" data-rwd="${f.id}" data-r="${i}" aria-label="Quitar">×</button>${f.alg?`<div class="al" data-al="${i}">${alTxt(M.P,r.n)}</div>`:''}</div>`).join('')}</div><div class="cx-row" style="margin-top:8px"><button type="button" class="cxb gris sm cx-mini" data-rwa="${f.id}">+ Agregar</button></div>`;break}
    case 'tm':{const o=v||{};x=`<div class="tm"><span>${esc(f.l)}</span><input type="date" data-tm="${f.id}" data-p="f" value="${esc(o.f)}" aria-label="Fecha"><input data-tm="${f.id}" data-p="r" value="${esc(o.r)}" placeholder="Resultado" aria-label="Resultado"></div>`;break}
  }
  return `<div class="fw${full?' full':''}" data-k="${k}"${vis(f,c)?'':' hidden'}>${x}</div>`;
};
const alTxt=(P,n)=>{const w=choqueAlergia(P,n);return w?`Atención: coincide con una alergia registrada (${esc(w)}).`:''};
const secAv=(s,c,M)=>{let t=0,f=0;s.f.forEach(x=>{if(CNT.has(x.t)&&vis(x,c)){t++;if(filled(x,M.src(x)[x.id]))f++}});return t?f/t:0};

/* modelos: historia clínica, nota y referencia */
const ctxBase=(P,d,doc,extra={})=>{const tipo=P.tipo==='a'?((P.hc||{}).sexo==='Mujer'?'m':'h'):P.tipo;return Object.assign({d,p:P,tipo,sexo:P.tipo==='a'?((P.hc||{}).sexo||''):sexoP(P),doc,medico:medTxt(),fechaDoc:doc&&doc.creado?fHora(doc.creado):''},extra)};
const modeloHC=P=>{P.hc=P.hc||{};const M={kind:'hc',schema:X.HC,P,doc:P,src:()=>P.hc,firmaK:'hcFirma',aclK:'hcAcl'};
  M.ctx=()=>ctxBase(P,P.hc,{creado:P.creado});
  M.ro=()=>!!P.hcFirma;
  M.save=()=>{put('pacientes',P);syncCita('h'+P.id,P,P.hc.prox_f,P.hc.prox_h,'Seguimiento')};
  M.extra=(c,out)=>{const d=P.hc;(d.rx||[]).forEach(r=>{if(r&&r.n&&!(r.d&&r.v&&r.f))out.push({l:`${r.n}: falta dosis, vía o frecuencia`,id:'rx'})});if(!filled({t:'rw'},d.rx)&&!d.medidas)out.push({l:'Plan: tratamiento o medidas generales',id:'medidas'})};
  return M};
const modeloNota=(P,C,rapida)=>{C.datos=C.datos||{};const schema=rapida?[...X.IDENT,...X.NOTA]:X.NOTA;
  const M={kind:'nota',schema,P,doc:C,rapida,src:f=>f.to==='p'?(P.hc=P.hc||{}):C.datos,firmaK:'firma',aclK:'acl'};
  M.ctx=()=>ctxBase(P,C.datos,{creado:C.fecha});
  M.ro=()=>!!C.firma;
  M.save=()=>{
    if(rapida&&!M.guardadoP){if(!(P.hc||{}).nombre){const e=document.getElementById('cxSave');if(e){e.classList.add('local');e.textContent='Escribe el nombre para guardar'}return}
      if(P.tipo==='a')P.tipo=P.hc.sexo==='Mujer'?'m':'h';P.rapido=true;P.creado=P.creado||Date.now();M.guardadoP=true;
      const h='consultas-p-'+P.id+'-n-'+C.id;history.replaceState(null,'','#'+h);if(CUR)CUR.h=h}
    if(rapida||M.tocoP)put('pacientes',P);
    put('consultas',C);syncCita('c'+C.id,P,C.datos.prox_f,C.datos.prox_h,'Consulta subsecuente')};
  M.extra=(c,out)=>{const d=C.datos;(d.rx||[]).forEach(r=>{if(r&&r.n&&!(r.d&&r.v&&r.f))out.push({l:`${r.n}: falta dosis, vía o frecuencia`,id:'rx'})});if(!filled({t:'rw'},d.rx)&&!d.medidas&&!d.ind_pac)out.push({l:'Plan: tratamiento, medidas generales o indicaciones',id:'medidas'})};
  return M};
const modeloRef=(P,R)=>{R.datos=R.datos||{};const M={kind:'ref',schema:X.REF,P,doc:R,src:()=>R.datos,firmaK:'firma',aclK:'acl'};
  M.ctx=()=>ctxBase(P,R.datos,{creado:R.fecha});M.ro=()=>!!R.firma;M.save=()=>put('referencias',R);M.extra=()=>{};return M};
const revisar=M=>{const c=M.ctx(),out=[];
  M.schema.forEach((s,i)=>{if(!s.f||!vis(s,c))return;
    s.f.forEach(f=>{if(f.req&&vis(f,c)&&!filled(f,M.src(f)[f.id]))out.push({l:(s.t!==f.l?s.t+': ':'')+f.l,i,id:f.id})});
    if(s.reqAny&&!s.f.some(f=>CNT.has(f.t)&&vis(f,c)&&filled(f,M.src(f)[f.id])))out.push({l:s.t+': sin datos',i})});
  M.extra(c,out);return out};

/* sincroniza la próxima cita con la agenda */
const syncCita=(id,P,f,h,motivo)=>{const ex=S.citas[id];
  if(!f){if(ex&&ex.estado==='pendiente')del('citas',id);return}
  if(ex&&ex.fecha===f&&(ex.hora||'')===(h||'')&&ex.nombre===nombreP(P))return;
  put('citas',{id,fecha:f,hora:h||'',pid:P.id,nombre:nombreP(P),motivo:ex?ex.motivo:motivo,estado:ex?ex.estado:'pendiente'})};

/* vista de formulario */
let F=null;
const pintar=()=>{if(!F)return;const c=F.M.ctx(),ro=F.M.ro(),y=scrollY;
  const secs=F.M.schema.map((s,i)=>[s,i]).filter(([s])=>vis(s,c));
  if(F.paso&&!secs.some(([,i])=>i===F.cur))F.cur=secs[0][1];
  const lista=F.paso?secs.filter(([,i])=>i===F.cur):secs;
  const nav=F.paso?`<div class="cx-steps" id="cxSteps">${secs.map(([s,i])=>{const a=s.cierre?null:secAv(s,c,F.M);return `<button type="button" class="${i===F.cur?'on':''}" data-step="${i}"><i class="${a===null?'':a>=.999?'f':a>0?'h':''}"></i>${esc(s.t)}</button>`}).join('')}</div>`:'';
  const body=lista.filter(([s])=>!s.cierre).map(([s,i])=>`<section class="cx-sec glass" data-s="${i}" id="sec_${s.id}"><h2>${esc(s.t)}</h2>${s.s?`<p class="hint">${esc(s.s)}</p>`:''}${s.neg&&!ro?`<div class="cx-row" style="margin-top:10px"><button type="button" class="cxb gris sm" data-secneg="${i}">${esc(s.neg)}</button></div>`:''}<div class="fx">${s.f.map((f,k)=>fh(f,k,c,F.M)).join('')}</div></section>`).join('');
  const pos=secs.findIndex(([,i])=>i===F.cur);
  const pie=F.paso?`<div class="cx-nav">${pos>0?`<button type="button" class="cxb gris" data-mov="-1">‹ ${esc(secs[pos-1][0].t)}</button>`:'<span></span>'}${pos<secs.length-1?`<button type="button" class="cxb" data-mov="1">${esc(secs[pos+1][0].t)} ›</button>`:''}</div>`:'';
  const cierre=lista.some(([s])=>s.cierre)?cierreHTML(F.M):'';
  F.el.querySelector('#cxForm').innerHTML=nav+`<fieldset ${ro?'disabled':''}>${body}</fieldset>`+cierre+pie;
  avance();
  if(F.keep)scrollTo({top:y,behavior:'auto'});F.keep=false;
  const st=document.querySelector('#cxSteps .on');if(st)st.scrollIntoView({block:'nearest',inline:'center'});
};
const avance=()=>{if(!F||!F.el)return;const c=F.M.ctx();let t=0,f=0;F.M.schema.forEach(s=>{if(!s.f||!vis(s,c))return;s.f.forEach(x=>{if(CNT.has(x.t)&&vis(x,c)){t++;if(filled(x,F.M.src(x)[x.id]))f++}})});
  const p=t?Math.round(f/t*100):0,b=document.getElementById('cxBar');if(b){b.style.width=p+'%';document.getElementById('cxPct').textContent=p+'% capturado'}};
const refrescar=()=>{if(!F)return;const c=F.M.ctx();
  F.el.querySelectorAll('[data-s]').forEach(se=>{const s=F.M.schema[+se.dataset.s];se.querySelectorAll(':scope .fx>[data-k]').forEach(w=>{const f=s.f[+w.dataset.k];if(!f)return;const v=vis(f,c);if(w.hidden===v)w.hidden=!v;
    if(f.t==='au'){const a=w.querySelector('[data-auto]'),r=f.fn(c);a.textContent=r||'Se calcula al llenar los datos';a.classList.toggle('na',!r)}})});
  F.el.querySelectorAll('#cxSteps [data-step]').forEach(b=>{const s=F.M.schema[+b.dataset.step];if(s.cierre)return;const a=secAv(s,c,F.M);b.querySelector('i').className=a>=.999?'f':a>0?'h':''});
  avance()};
const tocar=()=>{if(!F||F.M.ro())return;saveInd(true);clearTimeout(F.t);F.t=setTimeout(guardar,650)};
const guardar=()=>{if(!F)return;clearTimeout(F.t);F.t=null;F.M.save();saveInd()};
const flush=()=>{if(F&&F.t)guardar()};
addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
addEventListener('pagehide',flush);
const fieldBy=id=>{for(const s of F.M.schema)for(const f of (s.f||[]))if(f.id===id)return f;return null};
const montarForm=(el,M,paso,cur)=>{
  F={el,M,paso,cur:cur??0,t:null};
  {const g=el.querySelector('#cxGuardar');if(g)g.hidden=M.ro()}
  el.querySelector('#cxForm').addEventListener('input',e=>{const t=e.target;if(F.M.ro())return;
    if(t.dataset.f){const f=fieldBy(t.dataset.f);const o=F.M.src(f);o[t.dataset.f]=t.value;if(f.to==='p')F.M.tocoP=true;if(f.t==='sl'){const b=t.parentNode.querySelector('[data-slv]');if(b)b.textContent=t.value}}
    else if(t.dataset.rw){const id=t.dataset.rw,o=F.M.src(fieldBy(id));o[id]=Array.isArray(o[id])?o[id]:[];const i=+t.dataset.r;o[id][i]=o[id][i]||{};o[id][i][t.dataset.c]=t.value;
      if(t.dataset.c==='n'){const a=t.closest('.rw').querySelector('[data-al]');if(a)a.innerHTML=alTxt(F.M.P,t.value)}}
    else if(t.dataset.syt){const o=F.M.src(fieldBy(t.dataset.syt));o[t.dataset.syt]=Object.assign({},o[t.dataset.syt],{t:t.value})}
    else if(t.dataset.rgt){const o=F.M.src(fieldBy(t.dataset.rgt));const v=Object.assign({},o[t.dataset.rgt],{t:t.value});const f=fieldBy(t.dataset.rgt);if(v.n&&t.value!==f.def){v.n=false;v.a=true;const b=t.closest('.box');b.querySelector('[data-rgn]')?.classList.remove('on');b.querySelector('[data-rga]').classList.add('on')}o[t.dataset.rgt]=v}
    else if(t.dataset.tm){const o=F.M.src(fieldBy(t.dataset.tm));o[t.dataset.tm]=Object.assign({},o[t.dataset.tm],{[t.dataset.p]:t.value})}
    else return;
    tocar();refrescar()});
  el.querySelector('#cxForm').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const D=b.dataset;
    if(D.step!==undefined){flush();F.cur=+D.step;pintar();scrollTo({top:Math.max(0,el.querySelector('#cxForm').offsetTop-90),behavior:'smooth'});return}
    if(D.mov){flush();const c=F.M.ctx(),secs=F.M.schema.map((s,i)=>[s,i]).filter(([s])=>vis(s,c)),p=secs.findIndex(([,i])=>i===F.cur);F.cur=secs[Math.max(0,Math.min(secs.length-1,p+ +D.mov))][1];pintar();scrollTo({top:Math.max(0,el.querySelector('#cxForm').offsetTop-90),behavior:'smooth'});return}
    if(D.rev!==undefined){mostrarRevision();return}
    if(D.firmar!==undefined){firmar();return}
    if(D.mej!==undefined){mejorar();return}
    if(D.acl!==undefined){aclarar();return}
    if(D.doc){G.go(D.doc);return}
    if(D.bt){(ACC[D.bt]||(()=>{}))();return}
    if(F.M.ro())return;
    let mod=true;const fld=id=>fieldBy(id),O=id=>F.M.src(fld(id));
    if(D.se){const o=O(D.se);o[D.se]=o[D.se]===D.v?'':D.v;if(fld(D.se).to==='p')F.M.tocoP=true}
    else if(D.ck){const f=fld(D.ck),o=O(D.ck);let a=Array.isArray(o[D.ck])?o[D.ck].slice():[];if(a.includes(D.v))a=a.filter(x=>x!==D.v);else{if(f.ex&&D.v===f.ex)a=[D.v];else{a=a.filter(x=>x!==f.ex);a.push(D.v)}}o[D.ck]=a}
    else if(D.bo){const o=O(D.bo);o[D.bo]=!o[D.bo];if(fld(D.bo).to==='p')F.M.tocoP=true}
    else if(D.syn){const o=O(D.syn),v=o[D.syn]||{};o[D.syn]=v.n?{}:{n:true,s:[],t:''}}
    else if(D.syc){const o=O(D.syc),v=Object.assign({s:[]},o[D.syc]);v.n=false;v.s=(v.s||[]).includes(D.v)?v.s.filter(x=>x!==D.v):[...(v.s||[]),D.v];o[D.syc]=v}
    else if(D.rgn){const f=fld(D.rgn),o=O(D.rgn),v=o[D.rgn]||{};o[D.rgn]=v.n?{}:{n:true,a:false,t:f.def}}
    else if(D.rga){const o=O(D.rga),v=Object.assign({},o[D.rga]);v.a=!v.a;if(v.a){v.n=false;const f=fld(D.rga);if(v.t===f.def)v.t=''}o[D.rga]=v}
    else if(D.grn){const o=O(D.grn),v=o[D.grn]||{};o[D.grn]=v.neg?{m:{}}:{neg:true,m:{}}}
    else if(D.gr){const o=O(D.gr),v=Object.assign({m:{}},o[D.gr]);v.neg=false;v.m=Object.assign({},v.m);const i=D.i,j=+D.j;const a=(v.m[i]||[]).slice();v.m[i]=a.includes(j)?a.filter(x=>x!==j):[...a,j];o[D.gr]=v}
    else if(D.rwa){const o=O(D.rwa);o[D.rwa]=Array.isArray(o[D.rwa])&&o[D.rwa].length?o[D.rwa]:[{}];o[D.rwa].push({})}
    else if(D.rwd){const o=O(D.rwd);const a=Array.isArray(o[D.rwd])?o[D.rwd]:[];a.splice(+D.r,1);o[D.rwd]=a}
    else if(D.fr){const ta=el.querySelector(`[data-f="${D.fr}"]`),o=O(D.fr),cur=(o[D.fr]||'').trimEnd();o[D.fr]=cur+(cur?(D.t.endsWith(' ')?' ':' '):'')+D.t;if(ta){ta.value=o[D.fr];ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length)}tocar();refrescar();return}
    else if(D.secneg){const s=F.M.schema[+D.secneg],c=F.M.ctx();s.f.forEach(f=>{if(!vis(f,c))return;const o=F.M.src(f);if(f.t==='sy'&&!filled(f,o[f.id]))o[f.id]={n:true,s:[],t:''};if(f.t==='rg'&&f.def&&!filled(f,o[f.id])&&f.req)o[f.id]={n:true,a:false,t:f.def}});toast(s.neg==='Todo negado'?'Los sistemas sin datos quedaron como negados':'Las regiones sin datos quedaron como normales')}
    else mod=false;
    if(mod){vib();tocar();F.keep=true;pintar()}
  });
  pintar();
};

/* cierre: revisar, mejorar, firmar, aclaraciones */
const cierreHTML=M=>{const d=M.doc,fz=d[M.firmaK],ac=d[M.aclK]||[];
  const docs=M.kind==='hc'?[['Ver documento','consultas-doc-hc-'+M.P.id+'-x']]:M.kind==='nota'?[['Nota','consultas-doc-nota-'+M.P.id+'-'+d.id],['Receta','consultas-doc-receta-'+M.P.id+'-'+d.id],['Indicaciones','consultas-doc-ind-'+M.P.id+'-'+d.id]]:[['Hoja de referencia','consultas-doc-ref-'+M.P.id+'-'+d.id]];
  return `<section class="cx-sec glass" id="sec_cierre"><h2>Cierre y firma</h2><p class="hint">${fz?'Documento firmado: ya no se edita. Las correcciones se agregan como nota aclaratoria con su fecha y hora.':'Antes de firmar, revisa lo que falta. Una vez firmado ya no se puede editar.'}</p>
  <div class="cx-row">${fz?'':`<button type="button" class="cxb gris" data-rev>Revisar lo que falta</button><button type="button" class="cxb gris" data-mej>Mejorar con ChatGPT</button><button type="button" class="cxb" data-firmar>Firmar</button>`}${docs.map(([t,h])=>`<button type="button" class="cxb gris" data-doc="${h}">${icon('doc',16)}${t}</button>`).join('')}</div>
  <div id="cxRev"></div>
  ${fz?`<div class="cx-sign">Firmado por ${esc(fz.nombre)}${fz.cedula?`, cédula profesional ${esc(fz.cedula)}`:''}, el ${esc(fHora(fz.ts))}</div>`:''}
  ${ac.map(a=>`<div class="acl"><b>Nota aclaratoria, ${esc(fHora(a.ts))}:</b> ${esc(a.t)}</div>`).join('')}
  ${fz?`<div class="cx-row"><button type="button" class="cxb gris" data-acl>Agregar nota aclaratoria</button></div>`:''}</section>`};
const mostrarRevision=()=>{const r=revisar(F.M),box=F.el.querySelector('#cxRev');if(!box)return;
  box.innerHTML=r.length?`<div class="cx-check">${r.map(x=>`<button type="button" data-ir="${x.i??''}" data-id="${esc(x.id||'')}">${esc(x.l)}</button>`).join('')}</div>`:`<div class="cx-ok">Está completo lo que pide la Norma Oficial Mexicana NOM-004-SSA3-2012 del expediente clínico.</div>`;
  box.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>irCampo(b.dataset.ir,b.dataset.id))};
const irCampo=(i,id)=>{if(i===''&&id){for(let k=0;k<F.M.schema.length;k++)if((F.M.schema[k].f||[]).some(f=>f.id===id)){i=k;break}}
  if(F.paso&&i!==''){F.cur=+i;pintar()}
  setTimeout(()=>{const el=(id&&(F.el.querySelector(`[data-f="${id}"],[data-rw="${id}"],[data-se="${id}"],[data-ck="${id}"],[data-bo="${id}"],[data-syn="${id}"],[data-rgt="${id}"],[data-grn="${id}"]`)))||F.el.querySelector(`[data-s="${i}"]`);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});if(el.focus)el.focus({preventScroll:true})}},60)};
const firmar=()=>{flush();const r=revisar(F.M);const m=med();
  const hacer=()=>{F.M.doc[F.M.firmaK]={ts:Date.now(),nombre:`${m.titulo} ${m.nombre}`.trim(),cedula:m.cedula||''};F.M.save();closeSheet();toast('Firmado');vib();F.keep=true;pintar()};
  SX.firmar=hacer;SX.rev=()=>{closeSheet();mostrarRevision();setTimeout(()=>F.el.querySelector('#cxRev')?.scrollIntoView({behavior:'smooth',block:'center'}),80)};
  openSheet('Firmar',r.length?`<p>Faltan ${r.length} apartados que pide la Norma Oficial Mexicana del expediente clínico. Una vez firmado ya no se puede editar.</p><div class="cx-row cx"><button class="cxb gris" data-x="rev">Ver lo que falta</button><button class="cxb" data-x="firmar">Firmar así</button></div>`:`<p>Se firmará a nombre de ${esc(`${m.titulo} ${m.nombre}`)}${m.cedula?`, cédula profesional ${esc(m.cedula)}`:''}. Una vez firmado ya no se puede editar; las correcciones se hacen como nota aclaratoria.</p>${m.cedula?'':'<p>Tu cédula profesional todavía no está registrada. Agrégala en Perfil y ajustes, Datos del médico.</p>'}<div class="cx-row cx"><button class="cxb" data-x="firmar">Firmar</button></div>`)};
/* mejorar con ChatGPT: copiar y pegar, sin datos que identifiquen al paciente */
const GPT_FIELDS=M=>{const c=M.ctx(),out=[];M.schema.forEach(s=>{if(!s.f||s.cierre||!vis(s,c)||s.id==='ficha'||s.id==='consulta'&&M.kind==='hc')return;s.f.forEach(f=>{if(!f.id||!vis(f,c)||PROPIO.test(f.id))return;const v=M.src(f)[f.id];if((f.t==='tx'||f.t==='ln')&&typeof v==='string'&&v.trim().length>=12)out.push({f,id:f.id,l:etq(f.l),v:v.trim(),sec:s.t})})});return out};
const anonimiza=(t,P)=>{const h=P.hc||{};let x=String(t);const tok=new Set([...nombreP(P).split(/\s+/),...String(h.nombre||'').split(/\s+/)].filter(w=>w.length>=3));
  tok.forEach(w=>{x=x.replace(new RegExp(`\\b${w.normalize('NFC').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi'),'[paciente]')});
  [h.curp,h.tel,h.domic,h.emerg,h.cuid].filter(v=>v&&String(v).length>4).forEach(v=>{x=x.split(String(v)).join('[dato]')});
  return x.replace(/\b\d{10}\b/g,'[teléfono]')};
const PROMPT_GPT=(M,campos)=>{const P=M.P,ed=edadP(P),sx=sexoP(P);
  return `Actúa como médico redactor de notas clínicas en México. Reescribe cada apartado de la siguiente ${M.kind==='hc'?'historia clínica':'nota de consulta'} en lenguaje técnico-médico formal, en español y sin abreviaturas ni siglas; si una es indispensable, escribe su significado entre paréntesis.

Reglas:
1. No inventes datos. Si falta información, escribe [falta: lo que falta].
2. No cambies cifras, dosis ni diagnósticos.
3. Conserva exactamente las marcas entre dobles corchetes, como [[motivo]], una por apartado y en el mismo orden.
4. Al final agrega [[OBSERVACIONES]] con las inconsistencias clínicas que encuentres y lo que pide la NOM-004-SSA3-2012 que no está, en frases cortas.

Paciente: ${[sx,ed].filter(Boolean).join(', ')||'sin datos de edad y sexo'}.

${campos.map(c=>`[[${c.id}]] ${c.l}\n${anonimiza(c.v,P)}`).join('\n\n')}`};
const parseGPT=t=>{const o={},re=/\[\[\s*([a-z0-9_]+|OBSERVACIONES)\s*\]\]/gi,m=[...String(t).matchAll(re)];m.forEach((x,i)=>{const k=/^observaciones$/i.test(x[1])?'OBS':x[1];o[k]=String(t).slice(x.index+x[0].length,i+1<m.length?m[i+1].index:undefined).trim()});return o};
const mejorar=()=>{if(!F||!F.M)return;flush();const M=F.M,campos=GPT_FIELDS(M);
  if(!campos.length){openSheet('Mejorar con ChatGPT','<p>Todavía no hay textos que mejorar. Escribe la nota y vuelve a intentarlo.</p>');return}
  const prompt=PROMPT_GPT(M,campos);
  SX.gptCopy=async()=>{try{await navigator.clipboard.writeText(prompt);toast('Copiado. Pégalo en ChatGPT')}catch(e){toast('No se pudo copiar; selecciona el texto y cópialo')}window.open('https://chatgpt.com/','_blank','noopener')};
  SX.gptCmp=()=>{const r=parseGPT(document.getElementById('gptIn').value);campos.forEach(c=>{if(!r[c.id])return;const L=r[c.id].split('\n');if(norm(L[0]).replace(/[^a-z0-9 ]/g,'').trim()===norm(c.l).replace(/[^a-z0-9 ]/g,'').trim())r[c.id]=L.slice(1).join('\n').trim()});const hay=campos.filter(c=>r[c.id]);
    if(!hay.length){toast('No encontré los apartados. Pega la respuesta completa de ChatGPT');return}
    const hl=x=>esc(x).replace(/\[falta:[^\]]*\]/g,m=>`<mark>${m}</mark>`);
    document.getElementById('gptRes').innerHTML=`<h3 style="margin:18px 0 6px">Compara y acepta</h3>${hay.map(c=>`<div class="gpt-c"><b>${esc(c.l)}</b><div class="gpt-o">${esc(c.v)}</div><div class="gpt-m">${hl(r[c.id])}</div><button type="button" class="cxb sm" data-x="gptOk" data-k="${c.id}">Aceptar</button></div>`).join('')}
    ${r.OBS?`<div class="gpt-obs"><b>Observaciones para ti</b><ul>${r.OBS.split(/\n+|(?<=\.)\s+(?=\p{Lu})/u).map(x=>x.replace(/^[-•*\d.)\s]+/,'').trim()).filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
    <div class="cx-row"><button type="button" class="cxb" data-x="gptAll">Aceptar todo</button></div>`;
    const put1=k=>{const c=campos.find(z=>z.id===k);if(!c||!r[k])return;M.src(c.f)[k]=r[k].replace(/\[paciente\]/g,'el paciente').replace(/(^|[.!?]\s+)el paciente/g,(m,a)=>a+'El paciente')};
    SX.gptOk=b=>{put1(b.dataset.k);M.save();b.textContent='Aceptado';b.disabled=true;F.keep=true;pintar()};
    SX.gptAll=()=>{hay.forEach(c=>put1(c.id));M.save();closeSheet();F.keep=true;pintar();toast('Nota actualizada')};
    document.getElementById('gptRes').scrollIntoView({behavior:'smooth',block:'start'})};
  openSheet('Mejorar con ChatGPT',`<div class="cx"><p class="hint" style="margin-top:0">Gratis, con tu propia cuenta. Se quitan el nombre y los datos que identifican al paciente; solo van edad y sexo. El texto sí pasa por OpenAI. Nada se guarda sin tu Aceptar.</p>
  <p style="font-weight:600;margin:14px 0 6px">1. Copia y abre ChatGPT</p><div class="gpt-p">${esc(prompt)}</div><div class="cx-row"><button type="button" class="cxb" data-x="gptCopy">Copiar y abrir ChatGPT</button></div>
  <p style="font-weight:600;margin:18px 0 6px">2. Pega aquí la respuesta</p><textarea id="gptIn" rows="7" placeholder="Pega la respuesta completa de ChatGPT"></textarea><div class="cx-row"><button type="button" class="cxb gris" data-x="gptCmp">Comparar</button></div><div id="gptRes"></div></div>`)};
const aclarar=()=>{SX.acl=()=>{const t=document.getElementById('aclT').value.trim();if(!t)return;const d=F.M.doc;d[F.M.aclK]=[...(d[F.M.aclK]||[]),{ts:Date.now(),t}];F.M.save();closeSheet();F.keep=true;pintar();toast('Nota aclaratoria agregada')};
  openSheet('Nota aclaratoria',`<div class="cx"><p>Queda con su fecha y hora, y el texto original no se modifica.</p><textarea id="aclT" rows="5" style="margin-top:12px" placeholder="Escribe la aclaración"></textarea><div class="cx-row"><button class="cxb" data-x="acl">Agregar</button></div></div>`)};

/* acciones de botones dentro de formularios */
const ACC={
  refgen:()=>{const P=F.M.P,d=F.M.doc.datos,h=P.hc||{},u=ultimaConsulta(P.id),ud=(u&&u.datos)||{},m=med();
    const dx=(ud.dx||h.dx||[]).filter(r=>r&&r.n).map(r=>r.n+(r.c?` (${r.c})`:'')+(r.e?`, ${r.e.toLowerCase()}`:'')).join('; ');
    const sust=[h.tab?`Tabaco: ${h.tab.toLowerCase()}${X.A.it({d:h})?`, índice tabáquico ${X.A.it({d:h})}`:''}`:'',h.alc?`Alcohol: ${h.alc.toLowerCase()}${h.alc_t?`, ${h.alc_t}`:''}`:'',(h.drog||[]).length?`Otras sustancias: ${(h.drog||[]).join(', ').toLowerCase()}${h.drog_t?`, ${h.drog_t}`:''}`:''].filter(Boolean).join('. ');
    const trat=[(ud.rx||h.rx||[]).filter(r=>r&&r.n).map(r=>[r.n,r.d,r.v,r.f,r.t].filter(Boolean).join(', ')).join('; '),(h.meds||[]).filter(r=>r&&r.n).length?'Medicamentos habituales: '+(h.meds||[]).filter(r=>r&&r.n).map(r=>[r.n,r.d,r.v,r.f].filter(Boolean).join(' ')).join('; '):''].filter(Boolean).join('. ');
    const res=[`${nombreP(P)}, ${edadP(P)}${sexoP(P)?', '+sexoP(P).toLowerCase():''}.`,alergias(P).txt+'.',(h.cron||[]).length?'Enfermedades crónicas: '+h.cron.join(', ').toLowerCase()+'.':'',h.pa_desc||ud.evol||'',ud.ta_s?'Signos vitales: '+svTxt(ud)+'.':''].filter(Boolean).join(' ');
    const set=(k,v)=>{if(v&&!d[k])d[k]=v};
    set('ref_envia',[m.consultorio,m.domicilio].filter(Boolean).join(', '));set('ref_resumen',res);set('ref_dx',dx);set('ref_sust',sust||'Sin registro en el expediente.');set('ref_trat',trat);set('ref_motivo',ud.analisis||'');set('ref_est',ud.resultados||h.estudios||'');
    tocar();F.keep=true;pintar();toast('Se llenaron los campos vacíos con el expediente')}
};

/* signos vitales en texto */
const svTxt=d=>{const p=[];if(d.ta_s&&d.ta_d)p.push(`presión arterial ${d.ta_s}/${d.ta_d} milímetros de mercurio`);if(d.fc)p.push(`frecuencia cardiaca ${d.fc} latidos por minuto`);if(d.fr)p.push(`frecuencia respiratoria ${d.fr} respiraciones por minuto`);if(d.temp)p.push(`temperatura ${d.temp} grados Celsius`);if(d.sat)p.push(`saturación de oxígeno ${d.sat} por ciento`);if(d.gluc)p.push(`glucosa capilar ${d.gluc} miligramos por decilitro`);const t=p.join(', ');return t?t.charAt(0).toUpperCase()+t.slice(1):''};

/* encabezados y piezas comunes */
const head=(trail,title,lead,acts)=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a>${trail.map(([t,h])=>`<span>›</span>${h?`<a href="#${h}">${esc(t)}</a>`:`<b>${esc(t)}</b>`}`).join('')}</nav><div class="phead" id="phead"><div><h1 class="rise" style="--i:1">${esc(title)}</h1>${lead?`<p class="lead rise" style="--i:2">${lead}</p>`:''}</div>${acts?`<div class="hact">${acts}</div>`:''}</div>`;
const pinBtn=h=>{const on=G.isPinned&&G.isPinned(h);return `<button class="pin glass${on?' on':''}" id="pinB" aria-label="${on?'Quitar de fijados':'Fijar en inicio'}">${icon('<path d="M12 17v4M8 3h8l-1 6 3 4H6l3-4z"/>',20)}</button>`};
const modoHTML=(inicio)=>MODO==='local'?`<div class="cx-mode rise" style="--i:3"><i></i><span><b>Modo de prueba.</b> Los datos se guardan solo en este dispositivo. No captures pacientes reales hasta conectar Firebase.</span></div>`
  :MODO==='nube'&&inicio?`<div class="cx-mode ok rise" style="--i:3"><i></i><span><b>Sesión iniciada</b> como ${esc((window.NUBE.user||{}).correo||'')}. Tus pacientes se guardan en tu cuenta, solo tú puedes verlos y funcionan sin internet.</span></div>`:'';
const avatar=p=>`<span class="av" style="${p.tipo==='e'?'background:linear-gradient(135deg,#ff6482,#8668ff)':p.tipo==='p'?'background:linear-gradient(135deg,#30b0c7,#03aa49)':p.tipo==='g'?'background:linear-gradient(135deg,#ed6300,#ffb829)':''}">${esc(ini(nombreP(p)))}</span>`;
const itemP=(p,sub)=>{const a=alergias(p),u=ultimaConsulta(p.id);return `<a class="cx-item" href="#consultas-p-${p.id}">${avatar(p)}<span><b>${esc(nombreP(p))}</b><small>${esc([edadP(p),TIPOS[p.tipo]?TIPOS[p.tipo][0]:'',sub||(u?'Última consulta '+fCorta(u.fecha):'Sin consultas')].filter(Boolean).join(' · '))}</small></span>${!a.neg?'<span class="cx-tag red">Alergias</span>':''}</a>`};
const kid=(t,s,ic,h,k)=>`<a class="card kid glass rise" style="--i:${k+3}" href="#${h}" data-peek="${h}"><span class="glow"></span><span class="sheen"></span><span class="ic">${icon(ic,22)}</span><div><b>${t}</b><p>${s}</p></div><span class="go">${G.arrow}</span></a>`;
const wrap=html=>`<div class="cx">${html}</div>`;

/* vistas */
let CUR=null;
const owns=h=>h==='consultas'||h.startsWith('consultas-');
const show=(h,el)=>{pagina(false);
  flush();F=null;CUR={h,ed:false};el.style.cssText='--c:'+COL;
  if(MODO==='cargando'){el.innerHTML=wrap(head([['Consultas']],'Consultas','Conectando con tu cuenta…'));return}
  if(MODO==='login'){el.innerHTML=wrap(vLogin());return}
  if(MODO==='error'){el.innerHTML=wrap(head([['Consultas']],'Consultas','')+`<div class="cx-card glass" style="margin-top:18px"><h3>No se pudo conectar</h3><p class="cx-empty">${esc(NERR)}</p><div class="cx-row"><button class="cxb" onclick="location.reload()">Reintentar</button></div></div>`);return}
  const p=h.split('-');
  if(!listo()&&p[1]==='p'){el.innerHTML=wrap(head([['Consultas','consultas']],'Cargando','Trayendo el expediente de tu cuenta…'));CUR.esperando=true;return}
  try{
    if(!p[1])return vHome(el);
    if(p[1]==='0')return vAgenda(el);
    if(p[1]==='1')return vNuevo(el,p[2]);
    if(p[1]==='2')return vBuscar(el);
    if(p[1]==='3')return p[2]!==undefined?vRapida(el,+p[2]):vRapidaElegir(el);
    if(p[1]==='4')return vPend(el);
    if(p[1]==='doc')return vDoc(el,p[2],p[3],p[4]);
    if(p[1]==='p'){const P=S.pacientes[p[2]];if(!P){el.innerHTML=wrap(head([['Consultas','consultas']],'Expediente no encontrado','Puede que se haya eliminado o que pertenezca a otra cuenta.'));return}
      store.set('gche2-ultp',P.id);
      if(p[3]==='hc')return vHC(el,P);
      if(p[3]==='n'&&p[4])return vNota(el,P,p[4]);
      if(p[3]==='r'&&p[4])return vRef(el,P,p[4]);
      return vExp(el,P)}
    vHome(el);
  }catch(err){console.error(err);el.innerHTML=wrap(head([['Consultas','consultas']],'Algo salió mal',esc(err.message)))}
};
let suT;const suave=force=>{clearTimeout(suT);suT=setTimeout(()=>{const h=location.hash.slice(1);if(!CUR||!owns(h))return;if(CUR.ed&&!force&&!CUR.esperando)return;const y=scrollY;show(h,$('#v-page'));if(!force)scrollTo({top:y,behavior:'auto'})},140)};

const vLogin=()=>head([['Consultas']],'Consultas','Pacientes, historia clínica, notas y agenda')+`<div class="cx-card glass rise" style="--i:3;margin-top:22px;max-width:560px"><h3>${icon('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',20)}Entra con tu cuenta de Google</h3><p class="cx-empty">Tus pacientes se guardan en tu cuenta y solo tú puedes verlos. Solo se pide una vez en cada dispositivo.</p><div class="cx-row"><button class="cxb" id="cxLogin">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',18)}Iniciar sesión con Google</button></div></div>`;
document.addEventListener('click',e=>{if(e.target.closest('#cxLogin'))entrar()});
const entrar=async()=>{if(!window.NUBE||!window.NUBE.signIn){toast('Firebase todavía se está cargando');return}try{await window.NUBE.signIn()}catch(e){toast(errTxt(e))}};

const vHome=el=>{
  const d=hoy(),citas=L('citas').filter(x=>x.fecha===d&&x.estado!=='cancelada').sort((a,b)=>(a.hora||'99').localeCompare(b.hora||'99'));
  const rec=L('pacientes').sort((a,b)=>(b.act||0)-(a.act||0)).slice(0,6);
  const cs=L('consultas'),t0=new Date();t0.setHours(0,0,0,0);const lun=new Date(t0);lun.setDate(lun.getDate()-((lun.getDay()+6)%7));const mes=new Date(t0.getFullYear(),t0.getMonth(),1);
  const n=a=>cs.filter(c=>c.fecha>=a.getTime()).length;
  el.innerHTML=wrap(head([['Consultas']],'Consultas','Pacientes, historia clínica, notas y agenda',(G.ILL?G.ILL.consultas:'')+`<a class="cal glass" href="#consultas-0" aria-label="Calendario">${icon('cal',22)}</a>`+pinBtn('consultas'))+modoHTML(true)+
  `${(()=>{if(MODO==='login')return'';const ps=pendientes();return ps.length?`<div class="cx-card glass rise cx-pend" style="--i:7;margin:14px 0"><h3>Por terminar <small>${ps.length}</small></h3><div class="cx-list">${ps.slice(0,4).map(itemPend).join('')}</div>${ps.length>4?`<div class="cx-row"><a class="cxb gris sm" href="#consultas-4">Ver todo (${ps.length})</a></div>`:''}</div>`:''})()}<div class="kids">${kid('Nuevo paciente','Elige el tipo de expediente','personplus','consultas-1',0)}${kid('Buscar paciente','Por nombre, teléfono o diagnóstico','search','consultas-2',1)}${kid('Consulta rápida','Solo nota en formato SOAP','bolt','consultas-3',2)}${kid('Calendario y agenda','Atendidos y citas por día','cal','consultas-0',3)}</div>
  <div class="cx-grid2"><div class="cx-card glass rise" style="--i:8"><h3>Citas de hoy <small>${citas.length}</small></h3>${citas.length?`<div class="cx-list">${citas.map(itemCita).join('')}</div>`:'<p class="cx-empty">Sin citas para hoy.</p>'}<div class="cx-row"><a class="cxb gris sm" href="#consultas-0">Abrir agenda</a></div></div>
  <div class="cx-card glass rise" style="--i:9"><h3>Pacientes recientes <small>${L('pacientes').length} en total</small></h3>${rec.length?`<div class="cx-list">${rec.map(p=>itemP(p)).join('')}</div>`:'<p class="cx-empty">Todavía no tienes pacientes. Empieza con Nuevo paciente o Consulta rápida.</p>'}</div></div>
  <div class="cx-card glass rise" style="--i:10;margin-top:14px"><h3>Resumen del consultorio</h3><div class="cx-row" style="gap:22px">${[['Hoy',n(t0)],['Esta semana',n(lun)],['Este mes',n(mes)]].map(([t,v])=>`<div><b style="font-size:30px;font-weight:700;letter-spacing:-.02em">${v}</b><div class="hint" style="margin:0">${t}</div></div>`).join('')}</div></div>`)};
const itemCita=c=>{const P=c.pid&&S.pacientes[c.pid];return `<div class="cx-item">${P?avatar(P):`<span class="av">${esc(ini(c.nombre||'?'))}</span>`}<span><b>${esc(c.hora||'Sin hora')} · ${esc(c.nombre||'Sin nombre')}</b><small>${esc(c.motivo||'')}${c.estado!=='pendiente'?' · '+esc(c.estado):''}</small></span>${P?`<a class="cxb gris sm" href="#consultas-p-${P.id}">Abrir</a>`:''}</div>`};

const vNuevo=(el,k)=>{const sel=k!==undefined?ORDEN_T[+k]:null;
  el.innerHTML=wrap(head([['Consultas','consultas'],['Nuevo paciente']],'Nuevo paciente','Elige el tipo de expediente. Cada uno trae sus apartados propios.',pinBtn('consultas-1'))+modoHTML()+
  `<div class="cx-acts" style="margin-top:20px">${ORDEN_T.map((t,i)=>`<a class="glass${sel===t?' on':''}" href="#consultas-1-${i}" style="${sel===t?'outline:2.5px solid var(--blue);outline-offset:-2px':''}"><span class="ic2">${icon(TIPOS[t][1],20)}</span><span>${TIPOS[t][0]}<small>${({h:'Con antecedentes andrológicos',m:'Con antecedentes ginecoobstétricos',e:'Control prenatal y obstétrico',p:'Perinatales, desarrollo y crecimiento',g:'Con valoración geriátrica integral'})[t]}</small></span></a>`).join('')}</div>
  ${sel?`<div class="cx-card glass rise" style="margin-top:16px"><h3>${TIPOS[sel][0]}: datos para crear el expediente</h3><div class="fx">
    <div class="fw full"><label class="req" for="nNom">Nombre completo</label><input id="nNom" autocomplete="off"></div>
    <div class="fw"><label for="nFn" class="req">Fecha de nacimiento</label><input id="nFn" type="date"></div>
    ${sel==='p'||sel==='g'?`<div class="fw"><span class="lab req">Sexo</span><div class="opts"><button type="button" class="chip" data-nsx="Hombre">Hombre</button><button type="button" class="chip" data-nsx="Mujer">Mujer</button></div></div>`:''}
    <div class="fw"><label for="nTel">Teléfono</label><input id="nTel" type="tel" autocomplete="off"></div>
    <div class="fw full"><div class="opts"><button type="button" class="chip" id="nAv">El paciente aceptó el aviso de privacidad *</button></div></div>
    <div class="fw nt" id="nWarn" hidden></div></div>
    <div class="cx-row"><button class="cxb" id="nCrear">Crear y abrir la historia clínica</button><button class="cxb gris" id="nCrearN">Crear y hacer una nota de consulta</button></div></div>`:''}`);
  if(!sel)return;CUR.ed=true;
  let sx='',av=false;const w=$('#nWarn');
  const chk=()=>{const e=X.util.edadDe($('#nFn').value);let m='';if(e){if(sel==='g'&&e.y<60)m='En México se considera persona adulta mayor a partir de los 60 años.';else if(sel==='p'&&e.y>=18)m='La fecha corresponde a un adulto; revisa si conviene otro tipo de expediente.';else if('hme'.includes(sel)&&e.y<18)m='La fecha corresponde a un menor de edad; revisa si conviene el expediente pediátrico.'}w.hidden=!m;w.textContent=m};
  $('#nFn').addEventListener('input',chk);
  el.querySelectorAll('[data-nsx]').forEach(b=>b.onclick=()=>{sx=b.dataset.nsx;el.querySelectorAll('[data-nsx]').forEach(x=>x.classList.toggle('on',x===b));vib()});
  $('#nAv').onclick=()=>{av=!av;$('#nAv').classList.toggle('on',av);$('#nAv').textContent=(av?'✓ ':'')+'El paciente aceptó el aviso de privacidad *';vib()};
  const crear=nota=>{const nom=$('#nNom').value.trim();if(!nom){toast('Escribe el nombre del paciente');$('#nNom').focus();return}
    if((sel==='p'||sel==='g')&&!sx){toast('Elige el sexo');return}if(!av){toast('Falta el aviso de privacidad, que la app pide para guardar');return}
    const P={id:nid(),tipo:sel,creado:Date.now(),hc:{nombre:nom,fnac:$('#nFn').value,tel:$('#nTel').value.trim(),aviso:true}};if(sx)P.hc.sexo=sx;
    put('pacientes',P);toast('Paciente creado');G.go(nota?`consultas-p-${P.id}-n-${nid()}`:`consultas-p-${P.id}-hc`)};
  $('#nCrear').onclick=()=>crear(false);$('#nCrearN').onclick=()=>crear(true);
  setTimeout(()=>$('#nNom')&&$('#nNom').focus({preventScroll:true}),350)};

let FILTRO='',QB='';
const indiceP=p=>norm([nombreP(p),(p.hc||{}).tel,(p.hc||{}).curp,...consultasDe(p.id).flatMap(c=>((c.datos||{}).dx||[]).map(r=>r&&r.n)),...(((p.hc||{}).dx)||[]).map(r=>r&&r.n),...((p.hc||{}).cron||[])].filter(Boolean).join(' '));
const vBuscar=el=>{
  el.innerHTML=wrap(head([['Consultas','consultas'],['Buscar paciente']],'Buscar paciente','Por nombre, teléfono, Clave Única de Registro de Población o diagnóstico',pinBtn('consultas-2'))+modoHTML()+
  `<label class="sinput cx-search glass">${icon('search',18)}<input id="bq" type="search" placeholder="Escribe para buscar" autocomplete="off" value="${esc(QB)}" aria-label="Buscar paciente"></label>
  <div class="cx-filters">${[['','Todos'],...ORDEN_T.map(t=>[t,TIPOS[t][0]])].map(([t,l])=>`<button class="chip${FILTRO===t?' on':''}" data-ft="${t}">${l}</button>`).join('')}</div><div id="bres" class="cx-list" style="margin-top:14px"></div>`);
  const pinta=()=>{const q=norm(QB.trim());let r=L('pacientes').filter(p=>!FILTRO||p.tipo===FILTRO);if(q)r=r.filter(p=>indiceP(p).includes(q));r.sort((a,b)=>(b.act||0)-(a.act||0));
    $('#bres').innerHTML=r.length?r.slice(0,80).map(p=>itemP(p)).join(''):`<p class="cx-empty">${L('pacientes').length?'Sin resultados.':'Todavía no tienes pacientes.'}</p><div class="cx-row"><a class="cxb" href="#consultas-1">Nuevo paciente</a></div>`};
  $('#bq').addEventListener('input',e=>{QB=e.target.value;pinta()});
  el.querySelectorAll('[data-ft]').forEach(b=>b.onclick=()=>{FILTRO=b.dataset.ft;el.querySelectorAll('[data-ft]').forEach(x=>x.classList.toggle('on',x===b));pinta()});
  pinta();if(matchMedia('(min-width:720px)').matches)setTimeout(()=>$('#bq')&&$('#bq').focus({preventScroll:true}),300)};

const vRapidaElegir=el=>{
  el.innerHTML=wrap(head([['Consultas','consultas'],['Consulta rápida']],'Consulta rápida','Para cuando no hace falta una historia clínica completa: solo la nota en formato subjetivo, objetivo, análisis y plan.',pinBtn('consultas-3'))+modoHTML()+
  `<div class="kids">${RAP.map(([t,ic],i)=>kid(t,'Nota rápida con identificación mínima',ic,'consultas-3-'+i,i)).join('')}</div>
  <div class="cx-card glass rise" style="--i:8;margin-top:16px"><h3>¿Ya es tu paciente?</h3><p class="cx-empty">Búscalo para hacer la nota en su expediente.</p><label class="sinput" style="background:var(--ctrl)">${icon('search',18)}<input id="rq" type="search" placeholder="Nombre del paciente" autocomplete="off" aria-label="Buscar paciente"></label><div id="rres" class="cx-list"></div></div>`);
  const pinta=q=>{q=norm(q.trim());$('#rres').innerHTML=q?L('pacientes').filter(p=>indiceP(p).includes(q)).slice(0,8).map(p=>`<button class="cx-item" data-np="${p.id}">${avatar(p)}<span><b>${esc(nombreP(p))}</b><small>${esc(edadP(p))} · Nueva nota</small></span></button>`).join('')||'<p class="cx-empty">Sin resultados.</p>':''};
  $('#rq').addEventListener('input',e=>pinta(e.target.value));
  $('#rres').addEventListener('click',e=>{const b=e.target.closest('[data-np]');if(b)G.go(`consultas-p-${b.dataset.np}-n-${nid()}`)})};

const vRapida=(el,k)=>{const r=RAP[k]||RAP[0];CUR.ed=true;
  const P={id:nid(),tipo:r[2],hc:{}},C={id:nid(),pid:P.id,tipo:'rapida',fecha:Date.now(),datos:{}};
  if(r[2]==='e')P.hc.sexo='Mujer';
  el.innerHTML=wrap(head([['Consultas','consultas'],['Consulta rápida','consultas-3'],[r[0]]],'Consulta rápida · '+r[0],'')+modoHTML()+formTop('Escribe el nombre para guardar')+`<div id="cxForm"></div>`);
  montarForm(el,modeloNota(P,C,true),false)};
const formTop=(sv='')=>`<div class="cx-prog"><div class="tr"><i id="cxBar" style="width:0"></i></div><span id="cxPct">0% capturado</span></div><div class="cx-savebar"><span class="cx-save${sv?' local':''}" id="cxSave">${sv}</span><button type="button" class="cxb sm" id="cxGuardar">Guardar</button></div>`;
/* botón Guardar: guarda ya y avisa dónde continuar */
document.addEventListener('click',e=>{if(!e.target.closest('#cxGuardar')||!F)return;if(F.M.ro()){toast('Documento firmado: ya no se edita');return}
  if(F.M.rapida&&!F.M.guardadoP&&!((F.M.P.hc||{}).nombre||'').trim()){toast('Escribe el nombre del paciente para poder guardar');return}
  guardar();const sv=document.getElementById('cxSave');
  const h=new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});if(sv)sv.textContent+=' a las '+h;
  toast('Guardado. Si cierras la app, la encuentras en Consultas, Por terminar')});
/* pendientes: lo que no se ha firmado */
const IDS_ID=new Set((X.IDENT||[]).flatMap(sx=>(sx.f||[]).map(f=>f.id)));
const hcEmpezada=P=>{const h=P.hc||{};return Object.keys(h).some(k=>!IDS_ID.has(k)&&h[k]!==''&&h[k]!=null&&!(Array.isArray(h[k])&&!h[k].length)&&!(typeof h[k]==='object'&&!Array.isArray(h[k])&&!Object.keys(h[k]).length))};
const pendientes=()=>{const out=[];
  L('pacientes').forEach(P=>{if(!P.hcFirma&&hcEmpezada(P))out.push({t:'Historia clínica',P,act:P.act||P.creado||0,h:`consultas-p-${P.id}-hc`})});
  L('consultas').forEach(C=>{const P=S.pacientes[C.pid];if(P&&!C.firma&&C.tipo!=='respaldo')out.push({t:C.tipo==='rapida'?'Consulta rápida':'Nota de consulta',P,act:C.act||C.fecha||0,h:`consultas-p-${P.id}-n-${C.id}`})});
  L('referencias').forEach(R=>{const P=S.pacientes[R.pid];if(P&&!R.firma)out.push({t:'Hoja de referencia',P,act:R.act||R.fecha||0,h:`consultas-p-${P.id}-r-${R.id}`})});
  return out.sort((a,b)=>b.act-a.act)};
const itemPend=x=>`<a class="cx-item" href="#${x.h}">${avatar(x.P)}<span><b>${esc(x.t)} · ${esc(nombreP(x.P))}</b><small>Sin firmar · ${esc(fHora(x.act))}</small></span><span class="cxb gris sm">Continuar</span></a>`;
const vPend=el=>{const ps=pendientes();el.innerHTML=wrap(head([['Consultas','consultas'],['Por terminar']],'Por terminar','Historias clínicas, notas, consultas rápidas y referencias que todavía no firmas. Todo se guarda solo; aquí continúas donde te quedaste.')+modoHTML()+
  `<div class="cx-card glass rise" style="--i:2">${ps.length?`<div class="cx-list">${ps.map(itemPend).join('')}</div>`:'<p class="cx-empty">No tienes nada por terminar.</p>'}</div>`)};

const resumenHTML=P=>{const h=P.hc||{},a=alergias(P),meds=(h.meds||[]).filter(r=>r&&r.n),cron=(h.cron||[]).filter(x=>x!=='Otra');
  const items=[['Edad',edadP(P)||'Sin fecha de nacimiento'],['Sexo',sexoP(P)||'Sin registrar'],['Enfermedades crónicas',cron.length?cron.join(', '):'Sin registro'],['Medicamentos actuales',meds.length?meds.map(r=>r.n).join(', '):'Sin registro']];
  if(P.tipo==='e'&&h.fum)items.push(['Embarazo',`${sdgTxt(sdgDe(h.fum))||'Fecha de última menstruación fuera de rango'}${fppDe(h.fum)?'; fecha probable de parto '+fppDe(h.fum):''}`]);
  if(P.tipo==='g'&&meds.length>=5)items.push(['Polifarmacia',meds.length+' medicamentos']);
  if(h.tel)items.push(['Teléfono',h.tel]);
  return `<div class="cx-sum glass rise" style="--i:3"><div class="al${a.neg?' neg':''}">${icon(a.neg?'<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>':'<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h.01"/>',18)}${a.neg?'':'Alergias: '}${esc(a.txt)}</div><dl>${items.map(([t,v])=>`<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>`};

const vExp=(el,P)=>{const cs=consultasDe(P.id),rs=refsDe(P.id),av=hcAvance(P),h=P.hc||{};
  const firmados=!!P.hcFirma||cs.some(c=>c.firma)||rs.some(r=>r.firma);
  const tl=[{ts:P.creado||0,html:`<a class="cx-item" href="#consultas-p-${P.id}-hc" style="--c:${COL}"><span><b>Historia clínica</b><small>${P.hcFirma?'Firmada el '+fCorta(P.hcFirma.ts):av+'% capturado'}</small></span>${P.hcFirma?'<span class="cx-tag ok">Firmada</span>':'<span class="cx-tag warn">Borrador</span>'}</a>`},
    ...cs.map(c=>({ts:c.fecha,html:`<a class="cx-item" href="#consultas-p-${P.id}-n-${c.id}" style="--c:#8668ff"><span><b>${c.tipo==='rapida'?'Consulta rápida':'Nota de consulta'} · ${esc(fCorta(c.fecha))}</b><small>${esc(((c.datos||{}).dx||[]).filter(r=>r&&r.n).map(r=>r.n).join(', ')||((c.datos||{}).evol||'').slice(0,80)||'Sin diagnóstico')}</small></span>${c.firma?'<span class="cx-tag ok">Firmada</span>':'<span class="cx-tag warn">Borrador</span>'}</a>`})),
    ...rs.map(r=>({ts:r.fecha,html:`<a class="cx-item" href="#consultas-p-${P.id}-r-${r.id}" style="--c:#ed6300"><span><b>${esc((r.datos||{}).ref_tipo||'Referencia')} · ${esc(fCorta(r.fecha))}</b><small>${esc((r.datos||{}).ref_recibe||'Sin destino')} · Contrarreferencia ${esc(((r.datos||{}).cr_estado||'pendiente').toLowerCase())}</small></span>${r.firma?'<span class="cx-tag ok">Firmada</span>':'<span class="cx-tag warn">Borrador</span>'}</a>`}))].sort((a,b)=>b.ts-a.ts);
  const serie=k=>[...(h[k]?[{t:P.creado||0,v:num(h[k])}]:[]),...cs.slice().reverse().map(c=>({t:c.fecha,v:num((c.datos||{})[k])}))].filter(x=>x.v);
  const graf=[['peso','Peso (kilogramos)','#0071e3'],['ta_s','Presión arterial sistólica','#ff3b30'],['gluc','Glucosa capilar','#8668ff']].map(([k,t,c])=>{const s=serie(k);return s.length>=2?spark(s,t,c):''}).join('');
  el.innerHTML=wrap(head([['Consultas','consultas'],['Pacientes','consultas-2'],[nombreP(P)]],nombreP(P),esc([TIPOS[P.tipo]?TIPOS[P.tipo][0]:'',P.rapido&&!av?'Expediente creado desde consulta rápida':''].filter(Boolean).join(' · ')))+resumenHTML(P)+
  `<div class="cx-acts">
    <a class="glass" href="#consultas-p-${P.id}-hc"><span class="ic2">${icon('consultas',20)}</span><span>Historia clínica<small>${P.hcFirma?'Firmada':av+'% capturado'}</small></span></a>
    <a class="glass" href="#consultas-p-${P.id}-n-${nid()}"><span class="ic2">${icon('note',20)}</span><span>Nueva consulta<small>Nota en formato SOAP</small></span></a>
    <a class="glass" href="#consultas-p-${P.id}-r-${nid()}"><span class="ic2">${icon('send',20)}</span><span>Referencia<small>Con resumen clínico</small></span></a>
    <button class="glass" id="eCita"><span class="ic2">${icon('cal',20)}</span><span>Agendar cita<small>Se agrega a la agenda</small></span></button>
    <button class="glass" id="eDocs"><span class="ic2">${icon('doc',20)}</span><span>Documentos<small>Para imprimir o guardar en PDF</small></span></button>
    <button class="glass" id="eMas"><span class="ic2">${icon('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',20)}</span><span>Más opciones<small>Tipo de expediente</small></span></button></div>
  ${graf?`<div class="cx-card glass" style="margin-top:14px"><h3>Evolución</h3><div class="cx-grid2" style="margin-top:6px">${graf}</div></div>`:''}
  ${window.VX?VX.expHTML(P):''}
  <div class="cx-card glass" style="margin-top:14px"><h3>Línea del tiempo <small>${cs.length} ${cs.length===1?'consulta':'consultas'}</small></h3><div class="cx-tl">${tl.map(x=>x.html).join('')}</div></div>`);
  $('#eCita').onclick=()=>citaSheet({pid:P.id,nombre:nombreP(P),fecha:hoy()});
  if(window.VX)VX.bindExp(P,el,put,()=>vExp(el,P),openSheet,closeSheet);
  $('#eDocs').onclick=()=>{const u=cs[0];openSheet('Documentos',`<div class="nlist">${[['Historia clínica',`consultas-doc-hc-${P.id}-x`],...(u?[['Última nota de consulta',`consultas-doc-nota-${P.id}-${u.id}`],['Receta de la última consulta',`consultas-doc-receta-${P.id}-${u.id}`],['Indicaciones para el paciente',`consultas-doc-ind-${P.id}-${u.id}`]]:[]),...rs.map(r=>['Hoja de referencia del '+fCorta(r.fecha),`consultas-doc-ref-${P.id}-${r.id}`])].map(([t,h])=>`<button data-cxh="${h}"><i></i><span><b style="font-size:15px">${esc(t)}</b></span>${icon('doc',18)}</button>`).join('')}</div><p>Cada documento se abre listo para imprimir o guardar como PDF.</p>`)};
  $('#eMas').onclick=()=>{SX.tipo=b=>{P.tipo=b.dataset.t;put('pacientes',P);closeSheet();toast('Expediente cambiado a '+TIPOS[P.tipo][0].toLowerCase());suave(true)};
    SX.borrar=()=>{SX.borrar2=()=>{cs.forEach(c=>del('consultas',c.id));rs.forEach(r=>del('referencias',r.id));L('citas').filter(c=>c.pid===P.id).forEach(c=>del('citas',c.id));del('pacientes',P.id);closeSheet();toast('Paciente eliminado');G.go('consultas-2')};
      openSheet('Eliminar paciente',`<p>Se borrará ${esc(nombreP(P))} con sus notas, referencias y citas. Esta acción no se puede deshacer.</p><div class="cx-row cx"><button class="cxb red" data-x="borrar2">Eliminar definitivamente</button></div>`)};
    openSheet('Más opciones',`<div class="cx"><p>Cambiar el tipo de expediente. Los datos capturados se conservan; solo cambian los apartados que se muestran.</p><div class="opts" style="margin-top:12px">${ORDEN_T.map(t=>`<button class="chip${P.tipo===t?' on':''}" data-x="tipo" data-t="${t}">${TIPOS[t][0]}</button>`).join('')}</div>
    ${firmados?'<p style="margin-top:18px">Este expediente tiene documentos firmados. La norma pide conservar el expediente al menos 5 años desde el último acto médico, así que no se puede eliminar.</p>':'<div class="cx-row" style="margin-top:18px"><button class="cxb red sm" data-x="borrar">Eliminar paciente</button></div><p>Solo se puede eliminar mientras no tenga documentos firmados.</p>'}</div>`)}};
const spark=(s,t,c)=>{const W=300,H=70,vs=s.map(x=>x.v),mn=Math.min(...vs),mx=Math.max(...vs),r=mx-mn||1;const pts=s.map((x,i)=>[(i/(s.length-1))*(W-12)+6,H-8-((x.v-mn)/r)*(H-20)]);
  return `<div><div class="hint" style="margin:0;font-weight:600">${esc(t)}: ${vs[vs.length-1]} <span style="font-weight:400">(antes ${vs[vs.length-2]})</span></div><svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${c}"/>`).join('')}</svg></div>`};

const HCPOS={};
const vHC=(el,P)=>{CUR.ed=true;const M=modeloHC(P);
  el.innerHTML=wrap(head([['Consultas','consultas'],[nombreP(P),'consultas-p-'+P.id],['Historia clínica']],'Historia clínica',esc(`${nombreP(P)} · ${TIPOS[P.tipo][0]}`))+formTop()+`<div id="cxForm"></div>`);
  saveInd();
  montarForm(el,M,true,HCPOS[P.id]??(P.hc&&P.hc.interrog?1:0));
  const o=F.cur;Object.defineProperty(F,'cur',{get(){return this._c},set(v){this._c=v;HCPOS[P.id]=v},configurable:true});F.cur=o};

const vNota=(el,P,cid)=>{CUR.ed=true;let C=S.consultas[cid];
  if(!C){const u=ultimaConsulta(P.id),h=P.hc||{},ud=(u&&u.datos)||{};C={id:cid,pid:P.id,tipo:'evol',fecha:Date.now(),datos:{}};
    if(P.tipo!=='p'&&(ud.talla||h.talla))C.datos.talla=ud.talla||h.talla;if(P.tipo==='e'&&(ud.fum||h.fum))C.datos.fum=ud.fum||h.fum}
  el.innerHTML=wrap(head([['Consultas','consultas'],[nombreP(P),'consultas-p-'+P.id],[C.tipo==='rapida'?'Consulta rápida':'Nota de consulta']],C.tipo==='rapida'?'Consulta rápida':'Nota de consulta',esc(`${nombreP(P)} · ${fHora(C.fecha)}`))+resumenHTML(P)+formTop(S.consultas[cid]?'':'Se guarda al escribir')+`<div id="cxForm"></div>`);
  if(S.consultas[cid])saveInd();
  montarForm(el,modeloNota(P,C,false),false)};

const prellenaRef=(P,C)=>{const d=C.datos||{},dx=(d.dx||[]).filter(r=>r&&r.n).map(r=>r.n),rx=(d.rx||[]).filter(r=>r&&r.n).map(r=>[r.n,r.pr,r.d,r.v?'vía '+r.v.toLowerCase():'',r.f,r.t?'durante '+r.t:''].filter(Boolean).join(' ')),ex=d.expl&&(d.expl.t||(d.expl.n?'Sin alteraciones':'')),sv=svTxt(d),o={};
  const sinp=x=>String(x).trim().replace(/\.+$/,'');if(dx.length)o.ref_motivo=`Para valoración y manejo de ${dx.map(x=>sinp(x.charAt(0).toLowerCase()+x.slice(1))).join('; ')}.`;
  const res=[[sexoP(P),edadP(P)].filter(Boolean).join(' de '),d.motivo,d.evol,sv,ex?'Exploración física: '+ex:'',d.analisis].filter(Boolean).map(x=>String(x).trim().replace(/\.$/,'')).join('. ');if(res)o.ref_resumen=res+'.';
  if(dx.length)o.ref_dx=dx.map(sinp).join('. ')+'.';
  const tr=[...rx,d.medidas].filter(Boolean).map(sinp);if(tr.length)o.ref_trat=tr.join('. ')+'.';
  const es=[d.resultados,d.est_sol?'Solicitados: '+d.est_sol:''].filter(Boolean).map(sinp);if(es.length)o.ref_est=es.join('. ')+'.';
  if(sv)o.ref_estado=sv+'.';return o};
const referir=()=>{const h=location.hash.slice(1).split('-');let pid=null,cid=null;if(h[0]==='consultas'&&h[1]==='p'){pid=h[2];if(h[3]==='n')cid=h[4]}
  pid=pid||store.get('gche2-ultp','');const P=S.pacientes[pid];
  if(MODO==='login'){toast('Inicia sesión para referir pacientes');return}
  if(!P){toast('Abre primero el expediente del paciente que quieres referir');G.go('consultas-2');return}
  flush();if(cid)store.set('gche2-refsrc',{pid,cid});G.go(`consultas-p-${pid}-r-${nid()}`);setTimeout(()=>toast('Hoja de referencia llenada con la nota; revisa y elige el destino'),400)};
const vRef=(el,P,rid)=>{CUR.ed=true;let R=S.referencias[rid];
  if(!R){const m=med();R={id:rid,pid:P.id,fecha:Date.now(),datos:{ref_tipo:'Referencia',ref_urg:'Ordinaria',cr_estado:'Pendiente'}};const env=[m.consultorio,m.domicilio].filter(Boolean).join(', ');if(env)R.datos.ref_envia=env;
    const src=store.get('gche2-refsrc',null);store.set('gche2-refsrc',null);const C=(src&&src.pid===P.id&&S.consultas[src.cid])||ultimaConsulta(P.id);if(C)Object.assign(R.datos,prellenaRef(P,C))}
  el.innerHTML=wrap(head([['Consultas','consultas'],[nombreP(P),'consultas-p-'+P.id],['Referencia']],'Hoja de referencia',esc(`${nombreP(P)} · ${fHora(R.fecha)}`))+formTop(S.referencias[rid]?'':'Se guarda al escribir')+`<div id="cxForm"></div>`);
  if(S.referencias[rid])saveInd();
  montarForm(el,modeloRef(P,R),false)};

/* agenda */
const CAL={y:new Date().getFullYear(),m:new Date().getMonth(),sel:hoy()};
const vAgenda=el=>{const {y,m,sel}=CAL,first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),td=hoy();
  const cs=L('consultas'),ct=L('citas').filter(c=>c.estado!=='cancelada');
  const porDia={};cs.forEach(c=>{const k=fISO(new Date(c.fecha));(porDia[k]=porDia[k]||{a:0,c:0}).a++});ct.forEach(c=>{(porDia[c.fecha]=porDia[c.fecha]||{a:0,c:0}).c++});
  let g=['L','M','M','J','V','S','D'].map(d=>`<span class="wd">${d}</span>`).join('')+'<span class="mt"></span>'.repeat(first);
  for(let i=1;i<=days;i++){const k=fISO(new Date(y,m,i)),pd=porDia[k];g+=`<button class="${k===td?'td':''}${k===sel?' sel':''}" data-day="${k}" aria-label="${fLarga(k)}">${i}${pd?`<span class="dots">${pd.a?'<i></i>':''}${pd.c?'<i class="c"></i>':''}</span>`:''}</button>`}
  const at=cs.filter(c=>fISO(new Date(c.fecha))===sel).sort((a,b)=>a.fecha-b.fecha),ci=L('citas').filter(c=>c.fecha===sel).sort((a,b)=>(a.hora||'99').localeCompare(b.hora||'99'));
  const prox=L('citas').filter(c=>c.fecha>=td&&c.estado==='pendiente').sort((a,b)=>(a.fecha+(a.hora||'')).localeCompare(b.fecha+(b.hora||''))).slice(0,6);
  el.innerHTML=wrap(head([['Consultas','consultas'],['Calendario y agenda']],'Calendario y agenda','Pacientes atendidos y citas por día',pinBtn('consultas-0'))+modoHTML()+
  `<div class="cx-grid2"><div class="cx-card glass rise" style="--i:3"><div class="cx-calh"><button class="cxb gris sm" data-mes="-1" aria-label="Mes anterior">‹</button><b>${(t=>t.charAt(0).toUpperCase()+t.slice(1))(new Date(y,m,1).toLocaleDateString('es-MX',{month:'long',year:'numeric'}))}</b><button class="cxb gris sm" data-mes="1" aria-label="Mes siguiente">›</button></div><div class="cx-cal">${g}</div><p class="hint"><span style="color:var(--blue)">●</span> atendidos <span style="color:#ff9f0a;margin-left:10px">●</span> citas</p></div>
  <div class="cx-card glass rise" style="--i:4"><h3>${esc(fLarga(sel))}</h3>
   <p class="hint" style="font-weight:600;margin-top:12px">Citas</p>${ci.length?`<div class="cx-list">${ci.map(c=>`<div class="cx-item" style="flex-wrap:wrap"><span><b>${esc(c.hora||'Sin hora')} · ${esc(c.nombre)}</b><small>${esc(c.motivo||'')}</small></span><div class="opts" style="width:100%">${['pendiente','atendida','cancelada'].map(e=>`<button class="chip${c.estado===e?' on':''}" style="min-height:30px;padding:0 10px;font-size:12px" data-est="${c.id}" data-v="${e}">${e.charAt(0).toUpperCase()+e.slice(1)}</button>`).join('')}${c.pid&&S.pacientes[c.pid]?`<a class="chip" style="min-height:30px;padding:0 10px;font-size:12px" href="#consultas-p-${c.pid}">Abrir</a>`:''}<button class="chip" style="min-height:30px;padding:0 10px;font-size:12px" data-edc="${c.id}">Editar</button>${c.estado==='pendiente'?`<button class="chip" style="min-height:30px;padding:0 10px;font-size:12px" data-alc="${c.id}">Alarma</button>`:''}</div></div>`).join('')}</div>`:'<p class="cx-empty">Sin citas.</p>'}
   <div class="cx-row"><button class="cxb sm" id="aNueva">+ Agregar cita</button><button class="cxb gris sm" id="aAlarmas">Alarmas y avisos</button></div>
   <p class="hint" style="font-weight:600;margin-top:18px">Atendidos</p>${at.length?`<div class="cx-list">${at.map(c=>{const P=S.pacientes[c.pid];return P?`<a class="cx-item" href="#consultas-p-${P.id}-n-${c.id}">${avatar(P)}<span><b>${esc(nombreP(P))}</b><small>${esc(new Date(c.fecha).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}))} · ${esc(((c.datos||{}).dx||[]).filter(r=>r&&r.n).map(r=>r.n).join(', ')||'Sin diagnóstico')}</small></span></a>`:''}).join('')}</div>`:'<p class="cx-empty">Nadie atendido este día.</p>'}</div></div>
  <div class="cx-card glass rise" style="--i:5;margin-top:14px"><h3>Próximas citas</h3>${prox.length?`<div class="cx-list">${prox.map(c=>`<button class="cx-item" data-day="${c.fecha}"><span><b>${esc(fLarga(c.fecha))}${c.hora?' · '+esc(c.hora):''}</b><small>${esc(c.nombre)}${c.motivo?' · '+esc(c.motivo):''}</small></span></button>`).join('')}</div>`:'<p class="cx-empty">No hay citas pendientes.</p>'}</div>`);
  el.querySelector('.cx').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.mes){CAL.m+=+b.dataset.mes;if(CAL.m<0){CAL.m=11;CAL.y--}if(CAL.m>11){CAL.m=0;CAL.y++}vib();vAgenda(el);return}
    if(b.dataset.day){CAL.sel=b.dataset.day;const d=pDate(CAL.sel);CAL.y=d.getFullYear();CAL.m=d.getMonth();vib();vAgenda(el);return}
    if(b.dataset.est){const c=S.citas[b.dataset.est];if(c){c.estado=b.dataset.v;put('citas',c);vAgenda(el)}return}
    if(b.dataset.edc){citaSheet(S.citas[b.dataset.edc]);return}
    if(b.dataset.alc){alarmaSheet(S.citas[b.dataset.alc]);return}
    if(b.id==='aAlarmas'){alarmasConfig();return}
    if(b.id==='aNueva')citaSheet({fecha:CAL.sel})})};
const citaSheet=c=>{const ed=!!c.id;
  SX.cita=()=>{const f=$('#ciF').value,h=$('#ciH').value,n=$('#ciN').value.trim(),mo=$('#ciM').value.trim();if(!f||!n){toast('Falta la fecha o el nombre');return}
    const P=L('pacientes').find(p=>norm(nombreP(p))===norm(n));const o=Object.assign({},c,{id:c.id||nid(),fecha:f,hora:h,nombre:n,motivo:mo,pid:P?P.id:(c.pid||null),estado:c.estado||'pendiente'});put('citas',o);closeSheet();toast(ed?'Cita actualizada':'Cita agregada');CAL.sel=f;const d=pDate(f);CAL.y=d.getFullYear();CAL.m=d.getMonth();suave(true)};
  SX.citaAlm=()=>alarmaSheet(S.citas[c.id]||c);
  SX.citaDel=()=>{del('citas',c.id);closeSheet();toast('Cita eliminada');suave(true)};
  openSheet(ed?'Editar cita':'Nueva cita',`<div class="cx"><div class="fx"><div class="fw"><label for="ciF">Fecha</label><input id="ciF" type="date" value="${esc(c.fecha||hoy())}"></div><div class="fw"><label for="ciH">Hora</label><input id="ciH" type="time" value="${esc(c.hora||'')}"></div>
  <div class="fw full"><label for="ciN">Paciente</label><input id="ciN" list="ciL" value="${esc(c.nombre||'')}" autocomplete="off" placeholder="Nombre del paciente"><datalist id="ciL">${L('pacientes').map(p=>`<option value="${esc(nombreP(p))}">`).join('')}</datalist></div>
  <div class="fw full"><label for="ciM">Motivo</label><input id="ciM" value="${esc(c.motivo||'')}" autocomplete="off"></div></div>
  <div class="cx-row"><button class="cxb" data-x="cita">${ed?'Guardar':'Agregar'}</button>${ed&&c.estado==='pendiente'?'<button class="cxb gris" data-x="citaAlm">Alarma en el celular</button>':''}${ed?'<button class="cxb gris" data-x="citaDel">Eliminar</button>':''}</div></div>`)};

/* documentos para imprimir */
const valTxt=(f,v,c)=>{switch(f.t){
  case 'ck':return(v||[]).join(', ');case 'bo':return v?'Sí':'';case 'dt':return fLarga(v);case 'sl':return v!==undefined&&v!==''?v+' de 10':'';
  case 'au':return f.fn(c);case 'sy':return !v?'':v.n?'Negado':[(v.s||[]).join(', '),v.t].filter(Boolean).join('. ');
  case 'rg':return !v?'':v.t||(v.n?'Normal':'');
  case 'gr':return !v?'':v.neg?'Negados':X.HF.map((d,i)=>(v.m&&v.m[i]||[]).length?`${d}: ${v.m[i].map(j=>X.FAM[j].toLowerCase()).join(', ')}`:'').filter(Boolean).join('; ');
  case 'tm':return !v?'':[fLarga(v.f),v.r].filter(Boolean).join(': ');
  case 'rw':return '';default:return v===undefined||v===null?'':String(v)}};
const rowsTxt=(f,v)=>(v||[]).filter(r=>r&&r.n).map(r=>f.cols.map(([k,l])=>r[k]?(k==='n'?`<b>${esc(r[k])}</b>`:esc(r[k])):'').filter(Boolean).join(', '));
/* acomodo de mayúsculas sostenidas y agrupación de negados */
const PEQ=new Set(['de','del','la','las','los','y','e','en','con','por','a','el','al','o','u','para','sin']);
const PROPIO=/lugar|resid|domic|origen|contacto|cuid|nombre|nom$|emerg|ciudad|calle|recibe|unidad|hospital/i;
const acomoda=(t,propio)=>{t=String(t);const le=t.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g,'');if(le.length<4)return t;
  const up=le.replace(/[^A-ZÁÉÍÓÚÑÜ]/g,'').length;if(up/le.length<.8)return t;const w=t.trim().split(/\s+/);if(w.length===1&&le.length<=4)return t;
  const lo=t.toLocaleLowerCase('es-MX'),U=x=>x.charAt(0).toLocaleUpperCase('es-MX')+x.slice(1);
  if(propio)return lo.split(/(\s+)/).map((x,i)=>/^\s+$/.test(x)||(i>0&&PEQ.has(x))?x:U(x)).join('');
  return lo.replace(/(^\s*|[.!?]\s+)(\p{Ll})/gu,(m,a,b)=>a+b.toLocaleUpperCase('es-MX'))};
const etq=l=>String(l).split(/[:(]/)[0].trim();
const esNeg=t=>/^(negad[oa]s?|ningun[oa]|no|sin datos)\.?$/i.test(String(t).trim());
const esNorm=t=>/^(sin alteraciones|normal|sin lesiones)\.?$/i.test(String(t).trim());
const lista=a=>{const x=a.map(v=>esc(v.charAt(0).toLowerCase()+v.slice(1)));return x.length<2?x.join(''):x.slice(0,-1).join(', ')+' y '+x[x.length-1]};
const VIT=[['Presión arterial',d=>d.ta_s&&d.ta_d?`${d.ta_s}/${d.ta_d}`:'','milímetros de mercurio'],['Frecuencia cardiaca',d=>d.fc,'latidos por minuto'],['Frecuencia respiratoria',d=>d.fr,'respiraciones por minuto'],['Temperatura',d=>d.temp,'grados Celsius'],['Saturación de oxígeno',d=>d.sat,'por ciento'],['Glucosa capilar',d=>d.gluc,'miligramos por decilitro']];
const vitHTML=(d,extra=[])=>{const v=[...extra,...VIT].map(([k,f,u])=>[k,f(d),u]).filter(x=>x[1]!==undefined&&x[1]!==null&&x[1]!=='');
  return v.length?`<div class="pv">${v.map(([k,x,u])=>`<div><span class="k">${k}</span><b>${esc(x)}</b><span class="u">${u}</span></div>`).join('')}</div>`:''};
const cuerpo=M=>{const c=M.ctx();let html='';
  M.schema.forEach(s=>{if(!s.f||s.cierre||!vis(s,c))return;let sv=null,cells=[],largos=[],negs=[],nor=[],listas='';
    s.f.forEach(f=>{if(!f.id||!vis(f,c)||f.t==='bt')return;const src=M.src(f),v=src[f.id];
      if(f.sv){if(!sv)sv=src;return}
      if(f.t==='rw'){const r=rowsTxt(f,v);if(r.length)listas+=`<div class="pl"><span class="k">${esc(etq(f.l))}</span><ol>${r.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;return}
      if(f.t!=='au'&&!filled(f,v))return;let t=valTxt(f,v,c);if(!t)return;const L=etq(f.l);
      if(f.t==='bo'){largos.push(`<p class="pl">${esc(f.l)}.</p>`);return}
      if((f.t==='sy'&&v&&v.n)||((f.t==='se'||f.t==='ln')&&esNeg(t))){negs.push(L);return}
      if(f.t==='rg'&&esNorm(t)){nor.push(L);return}
      t=acomoda(t,PROPIO.test(f.id));
      if(f.t==='tx'||t.length>90)largos.push(`<p class="pl"><span class="k">${esc(L)}</span>${esc(t)}</p>`);
      else cells.push(`<div><span class="k">${esc(L)}</span>${esc(t)}</div>`)});
    let b=sv?vitHTML(sv):'';
    if(cells.length)b+=`<div class="pg">${cells.join('')}</div>`;b+=largos.join('')+listas;
    if(nor.length)b+=`<p class="neg">Sin alteraciones en ${lista(nor)}.</p>`;
    if(negs.length)b+=`<p class="neg">${negs.length===1?esc(negs[0])+': negado':'Negado en '+lista(negs)}.</p>`;
    if(b)html+=`<section class="ps${cells.length+largos.length*2+(sv?3:0)<=9?' keep':''}"><h3>${esc(s.t)}</h3>${b}</section>`});return html};
const mono=n=>String(n).split(/\s+/).filter(w=>/^\p{Lu}/u.test(w)).slice(0,2).map(w=>w[0]).join('')||'G';
const encabezado=(titulo,P,ts)=>{const m=med(),sub=[m.especialidad,`Cédula profesional: ${m.cedula||'pendiente'}`,m.titulo_inst].filter(Boolean).map(esc).join(' · '),dir=[m.consultorio,m.domicilio,m.telefono?'Teléfono '+m.telefono:''].filter(Boolean).map(esc).join(' · ');
  return `<div class="dhe"><div class="dhl"><span class="mono">${esc(mono(m.nombre))}</span><div><b>${esc(`${m.titulo} ${m.nombre}`)}</b><small>${sub}</small>${dir?`<small>${dir}</small>`:''}</div></div><div class="dhr"><b>${esc(titulo)}</b>${P?`<small>${esc(nombreP(P))} · Expediente ${esc(P.id.slice(-6).toUpperCase())}</small>`:''}${ts?`<small>${esc(fHora(ts))}</small>`:''}</div></div>`};
const pidHTML=(P,extra=[])=>{const h=P.hc||{},a=alergias(P);
  return `<div class="pb"><div class="w2"><span class="k">Paciente</span><b>${esc(nombreP(P))}</b></div><div><span class="k">Edad</span>${esc(edadP(P)||'Sin registro')}</div><div><span class="k">Sexo</span>${esc(sexoP(P)||'Sin registro')}</div>${h.fnac?`<div><span class="k">Nacimiento</span>${esc(fLarga(h.fnac))}</div>`:''}${extra.join('')}<div class="${a.neg?'':'alg'}"><span class="k">Alergias</span>${esc(a.neg?'Negadas':a.txt)}</div></div>`};
const firmaHTML=fz=>{const m=med();return `<div class="pf"><div><b>${esc(fz?fz.nombre:`${m.titulo} ${m.nombre}`)}</b><span>Cédula profesional: ${esc((fz&&fz.cedula)||m.cedula||'pendiente')}</span><span class="small">${fz?`Firmado electrónicamente el ${esc(fHora(fz.ts))}`:'Documento sin firmar'}</span></div></div>`};
const aclHTML=a=>(a||[]).length?`<section class="ps"><h3>Notas aclaratorias</h3>${a.map(x=>`<p class="pl"><span class="k">${esc(fHora(x.ts))}</span>${esc(x.t)}</p>`).join('')}</section>`:'';
const hoja=(cab,cuerpoH)=>`<table class="pt"><thead><tr><td>${cab}</td></tr></thead><tbody><tr><td>${cuerpoH}</td></tr></tbody></table>`;
const vDoc=(el,kind,pid,id)=>{const P=S.pacientes[pid];if(!P){el.innerHTML=wrap(head([['Consultas','consultas']],'Documento no encontrado',''));return}
  let titulo='',doc='',vuelta='consultas-p-'+pid,cls='';
  if(kind==='hc'){const M=modeloHC(P);titulo='Historia clínica';vuelta+='-hc';doc=hoja(encabezado(titulo,P,P.creado),pidHTML(P)+cuerpo(M)+aclHTML(P.hcAcl)+firmaHTML(P.hcFirma))}
  else if(kind==='ref'){const R=S.referencias[id];if(!R)return vNoDoc(el,vuelta);const M=modeloRef(P,R);const d=R.datos;titulo=d.ref_tipo==='Interconsulta'?'Solicitud de interconsulta':'Hoja de referencia';vuelta+='-r-'+id;doc=hoja(encabezado(titulo,P,R.fecha),pidHTML(P)+cuerpo(M)+aclHTML(R.acl)+firmaHTML(R.firma))}
  else{const C=S.consultas[id];if(!C)return vNoDoc(el,vuelta);const d=C.datos||{};vuelta+='-n-'+id;
    if(kind==='nota'){const M=modeloNota(P,C,false);titulo=C.tipo==='rapida'?'Nota de consulta rápida':'Nota de evolución';doc=hoja(encabezado(titulo,P,C.fecha),pidHTML(P)+cuerpo(M)+aclHTML(C.acl)+firmaHTML(C.firma))}
    else if(kind==='receta'){titulo='Receta';cls=' rx';const rx=(d.rx||[]).filter(r=>r&&r.n),dx=(d.dx||[]).filter(r=>r&&r.n).map(r=>acomoda(r.n)).join('; '),A=x=>esc(acomoda(x||''));
      const ext=[['Peso',x=>x.peso,'kilogramos'],['Talla',x=>x.talla,'centímetros']];
      doc=hoja(encabezado('Receta',null,C.fecha),`<div class="pb rxp"><div class="w2"><span class="k">Paciente</span><b>${esc(nombreP(P))}</b></div><div><span class="k">Edad</span>${esc(edadP(P)||'Sin registro')}</div><div><span class="k">Expediente</span>${esc(P.id.slice(-6).toUpperCase())}</div></div>`+vitHTML(d,ext)+
      (dx?`<p class="pl"><span class="k">Diagnóstico</span>${esc(dx)}</p>`:'')+`<div class="rxs">Rx</div>`+
      (rx.length?`<ol class="rxl">${rx.map(r=>`<li><b>${A(r.n)}${r.pr?`, ${A(r.pr)}`:''}</b><span>${esc([r.d,r.v?'por vía '+r.v.toLowerCase():'',r.f,r.t?'durante '+r.t:''].filter(Boolean).map(x=>acomoda(x)).join(', '))}.</span></li>`).join('')}</ol>`:'<p class="pl">Sin medicamentos en esta consulta.</p>')+
      (d.medidas||d.ind_pac?`<section class="ps"><h3>Indicaciones generales</h3><p class="pl">${A([d.ind_pac,d.medidas].filter(Boolean).join(' '))}</p></section>`:'')+
      (d.alarma?`<section class="ps"><h3>Acuda a urgencias si</h3><p class="pl">${A(d.alarma)}</p></section>`:'')+
      (d.prox_f?`<p class="pl"><span class="k">Próxima cita</span><b>${esc(fLarga(d.prox_f))}${d.prox_h?', '+esc(d.prox_h):''}</b></p>`:'')+firmaHTML(C.firma))}
    else{titulo='Indicaciones para el paciente';cls=' big';const rx=(d.rx||[]).filter(r=>r&&r.n),A=x=>esc(acomoda(x||''));
      doc=hoja(encabezado('Indicaciones',P,C.fecha),`<h2 class="pt2">Indicaciones para ${esc(nombreP(P))}</h2>`+
      (rx.length?`<section class="ps"><h3>Sus medicamentos</h3><ol class="rxl">${rx.map(r=>`<li><b>${A(r.n)}</b><span>${esc([r.d,r.v?'por vía '+r.v.toLowerCase():'',r.f,r.t?'durante '+r.t:''].filter(Boolean).map(x=>acomoda(x)).join(', '))}.</span></li>`).join('')}</ol></section>`:'')+
      (d.ind_pac||d.medidas?`<section class="ps"><h3>Cuidados en casa</h3>${d.ind_pac?`<p class="pl">${A(d.ind_pac)}</p>`:''}${d.medidas?`<p class="pl">${A(d.medidas)}</p>`:''}</section>`:'')+
      (d.alarma?`<section class="ps"><h3>Acuda a urgencias si</h3><p class="pl">${A(d.alarma)}</p></section>`:'')+(d.prox_f?`<section class="ps"><h3>Su próxima cita</h3><p class="pl">${esc(fLarga(d.prox_f))}${d.prox_h?' a las '+esc(d.prox_h):''}</p></section>`:'')+firmaHTML(C.firma))}}
  el.innerHTML=wrap(head([['Consultas','consultas'],[nombreP(P),'consultas-p-'+pid],[titulo]],titulo,cls===' rx'?'Media carta. Revisa el documento y guárdalo como PDF o imprímelo.':'Revisa el documento y guárdalo como PDF o imprímelo.')+
  `<div class="cx-doctools"><button class="cxb" id="dPrint">${icon('<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',18)}Imprimir o guardar como PDF</button><a class="cxb gris" href="#${vuelta}">Regresar</a></div><p class="hint">En la ventana de impresión elige Guardar como PDF para tener el archivo.${cls===' rx'?' Si tu impresora pide tamaño, elige media carta.':''}</p><div class="doc${cls}">${doc}</div>`);
  $('#dPrint').onclick=()=>window.print();pagina(cls===' rx')};
const pagina=media=>{let st=document.getElementById('cxPage');if(!st){st=document.createElement('style');st.id='cxPage';document.head.appendChild(st)}st.textContent=media?'@media print{@page{size:5.5in 8.5in;margin:8mm 9mm 8mm;@bottom-right{content:none}@bottom-left{content:none}}}':''};
const vNoDoc=(el,vuelta)=>{el.innerHTML=wrap(head([['Consultas','consultas']],'Documento no encontrado','Guarda primero la nota.')+`<div class="cx-row"><a class="cxb" href="#${vuelta}">Regresar</a></div>`)};

/* datos del médico y cuenta */
const perfil=()=>{const m=med();const C=[['titulo','Título (por ejemplo Dr.)'],['nombre','Nombre completo'],['cedula','Cédula profesional'],['titulo_inst','Institución que expidió el título'],['especialidad','Especialidad o leyenda'],['consultorio','Nombre del consultorio'],['domicilio','Domicilio del consultorio'],['telefono','Teléfono']];
  SX.perf=()=>{const o=Object.assign({id:'medico'},m);C.forEach(([k])=>o[k]=$('#pm_'+k).value.trim());put('perfil',o);closeSheet();toast('Datos del médico guardados')};
  openSheet('Datos del médico',`<div class="cx"><p>Aparecen en el encabezado de la receta, las notas y los documentos, y en la firma.</p><div class="fx">${C.map(([k,l])=>`<div class="fw${k==='domicilio'||k==='nombre'?' full':''}"><label for="pm_${k}">${l}</label><input id="pm_${k}" value="${esc(m[k]||'')}" autocomplete="off"></div>`).join('')}</div><div class="cx-row"><button class="cxb" data-x="perf">Guardar</button></div></div>`)};
const cuentaRow=()=>{const u=window.NUBE&&window.NUBE.user;const t=MODO==='local'?'Modo de prueba: datos en este dispositivo':MODO==='nube'&&u?'Sesión: '+u.correo:MODO==='login'?'Iniciar sesión con Google':'Cuenta: conectando';
  return `<button class="srow" style="width:100%" data-sw="cuenta"><span style="text-align:left;overflow:hidden;text-overflow:ellipsis">${esc(t)}</span>${icon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',18)}</button>`};
const cuenta=()=>{if(MODO==='login'){closeSheet();entrar();return}
  if(MODO==='nube'){SX.salir=async()=>{flush();try{await window.NUBE.signOut();closeSheet();toast('Sesión cerrada')}catch(e){toast(errTxt(e))}};openSheet('Cuenta',`<div class="cx"><p>Sesión iniciada como ${esc(window.NUBE.user.correo)}. Si cierras la sesión, los pacientes dejan de verse en este dispositivo hasta que vuelvas a entrar.</p><div class="cx-row"><button class="cxb red" data-x="salir">Cerrar sesión</button></div></div>`);return}
  toast(MODO==='local'?'Firebase no está configurado: modo de prueba':'Conectando con Firebase')};


/* respaldo de pacientes: descargar y restaurar un archivo */
const b64=u=>{let t='';for(let i=0;i<u.length;i+=32768)t+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(t)};
const unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
const llave=async(pw,salt)=>{const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])};
const cifrar=async(txt,pw)=>{const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await llave(pw,salt),new TextEncoder().encode(txt));
  return{app:'GCHE2',tipo:'respaldo-cifrado',v:1,fecha:new Date().toISOString(),salt:b64(salt),iv:b64(iv),datos:b64(new Uint8Array(ct))}};
const descifrar=async(o,pw)=>{const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(o.iv)},await llave(pw,unb64(o.salt)),unb64(o.datos));return JSON.parse(new TextDecoder().decode(pt))};
const bajar=(nombre,txt,tipo)=>{const u=URL.createObjectURL(new Blob([txt],{type:tipo}));const a=document.createElement('a');a.href=u;a.download=nombre;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)};
const pl=(n,a,b)=>n+' '+(n===1?a:b);
const conteo=d=>`${pl(L2(d,'pacientes'),'paciente','pacientes')}, ${pl(L2(d,'consultas'),'nota','notas')}, ${pl(L2(d,'citas'),'cita','citas')}, ${pl(L2(d,'referencias'),'referencia','referencias')} y ${pl(L2(d,'estudio'),'bloque de estudio','bloques de estudio')}`;
const L2=(d,c)=>Object.keys((d&&d[c])||{}).length;
const respaldo=()=>{
  if(MODO==='login'){toast('Inicia sesión para respaldar tus pacientes');return}
  if(MODO==='cargando'){toast('Espera a que terminen de cargar tus pacientes');return}
  const u=store.get('gche2-ultresp',0),dias=u?Math.floor((Date.now()-u)/864e5):null;
  SX.rpBaj=async b=>{const pw=$('#rpPw').value,pw2=$('#rpPw2').value;if(pw&&pw!==pw2){toast('Las contraseñas no coinciden');return}
    b.disabled=true;try{const o={app:'GCHE2',tipo:'respaldo',v:1,fecha:new Date().toISOString(),medico:medTxt(),datos:S,extras:{esquemas:store.get('gche2-esq',null),favoritos:store.get('gche2-hfav',null)}};
      const txt=JSON.stringify(pw?await cifrar(JSON.stringify(o),pw):o);
      bajar(`gche2-respaldo-${hoy()}${pw?'-protegido':''}.json`,txt,'application/json');store.set('gche2-ultresp',Date.now());toast('Respaldo descargado');closeSheet()}
    catch(e){toast('No se pudo crear el respaldo')}finally{b.disabled=false}};
  openSheet('Respaldo de pacientes',`<div class="cx"><p>Descarga un archivo con ${conteo(S)}, además de los datos del médico. Guárdalo en tu computadora o en tu Drive.</p>
  <p class="hint">${u?`Último respaldo: ${esc(fCorta(u))}${dias>=7?' · ya pasó más de una semana':''}.`:'Todavía no has hecho ningún respaldo en este dispositivo.'}</p>
  <div class="fx" style="margin-top:12px"><div class="fw"><label for="rpPw">Contraseña del archivo (recomendada)</label><input id="rpPw" type="password" autocomplete="new-password" placeholder="Opcional"></div><div class="fw"><label for="rpPw2">Repite la contraseña</label><input id="rpPw2" type="password" autocomplete="new-password"></div></div>
  <p class="hint">El archivo tiene datos de pacientes. Con contraseña queda cifrado y nadie puede leerlo sin ella. Si la olvidas, no se puede recuperar.</p>
  <div class="cx-row"><button class="cxb" data-x="rpBaj">Descargar respaldo</button></div>
  <p class="hint" style="font-weight:600;margin-top:22px;color:var(--ink)">Restaurar desde un archivo</p>
  <p class="hint">Agrega lo que no tengas y actualiza lo que sea más reciente en el archivo. No borra nada de lo que ya está en la app.</p>
  <div class="cx-row"><label class="cxb gris" for="rpFile" style="cursor:pointer">Elegir archivo de respaldo</label><input id="rpFile" type="file" accept=".json,application/json" hidden></div><div id="rpRes"></div></div>`);
  $('#rpFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;let o;try{o=JSON.parse(await f.text())}catch(_){$('#rpRes').innerHTML='<p class="hint" style="color:#ff3b30">El archivo no es un respaldo de GCHE2.</p>';return}
    if(!o||o.app!=='GCHE2'){$('#rpRes').innerHTML='<p class="hint" style="color:#ff3b30">El archivo no es un respaldo de GCHE2.</p>';return}
    if(o.tipo==='respaldo-cifrado'){$('#rpRes').innerHTML=`<div class="fx" style="margin-top:12px"><div class="fw full"><label for="rpPwR">Este respaldo está protegido. Escribe su contraseña</label><input id="rpPwR" type="password" autocomplete="current-password"></div></div><div class="cx-row"><button class="cxb" data-x="rpAbrir">Abrir respaldo</button></div>`;
      SX.rpAbrir=async()=>{try{previa(await descifrar(o,$('#rpPwR').value))}catch(_){toast('Contraseña incorrecta')}};return}
    previa(o)})};
const previa=o=>{if(!o||!o.datos){toast('El respaldo está vacío');return}
  $('#rpRes').innerHTML=`<div class="cx-card" style="margin-top:12px;padding:14px"><p style="margin:0"><b>Respaldo del ${esc(fCorta(Date.parse(o.fecha)))}</b></p><p class="hint">${conteo(o.datos)}${o.medico?' · '+esc(o.medico):''}</p><div class="cx-row"><button class="cxb" data-x="rpOk">Restaurar</button></div></div>`;
  SX.rpOk=()=>{const r=restaurar(o);closeSheet();toast(`Listo: ${r.n} registros nuevos y ${r.a} actualizados`);suave(true);G.renderPanel&&G.renderPanel()}};
const restaurar=o=>{let n=0,a=0;
  COLS.forEach(col=>Object.values(o.datos[col]||{}).forEach(r=>{if(!r||!r.id)return;const ex=S[col][r.id];
    if(ex&&(r.act||0)<=(ex.act||0))return;ex?a++:n++;S[col][r.id]=r;
    if(MODO==='nube')window.NUBE.put(col,r).catch(e=>toast(errTxt(e)))}));
  if(MODO==='local')persist();
  const x=o.extras||{};if(x.esquemas&&!store.get('gche2-esq',null))store.set('gche2-esq',x.esquemas);if(x.favoritos&&!store.get('gche2-hfav',null))store.set('gche2-hfav',x.favoritos);
  return{n,a}};

/* alarmas de citas: calendario del celular y avisos dentro de la app */
const ALM=()=>Object.assign({min:30,ini:true,avisar:false},store.get('gche2-alarma',{}));
const almSet=o=>store.set('gche2-alarma',Object.assign(ALM(),o));
const citaTs=c=>c&&c.fecha?new Date(c.fecha+'T'+(c.hora||'09:00')).getTime():0;
const inic=n=>String(n||'').trim().split(/\s+/).filter(Boolean).map(w=>w[0].toUpperCase()+'.').join(' ');
const tituloCita=(c,a)=>'Consulta: '+(a.ini?inic(c.nombre):c.nombre)+(c.motivo&&!a.ini?' · '+c.motivo:'');
const icsTxt=t=>String(t||'').replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
const utc=ts=>new Date(ts).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const lugar=()=>{const m=med();return [m.consultorio,m.domicilio].filter(Boolean).join(', ')};
const evento=(c,a)=>{const t=citaTs(c),L1=['BEGIN:VEVENT','UID:'+c.id+'@gche2','DTSTAMP:'+utc(Date.now())];
  if(c.hora)L1.push('DTSTART:'+utc(t),'DTEND:'+utc(t+30*60000));else L1.push('DTSTART;VALUE=DATE:'+c.fecha.replace(/-/g,''));
  L1.push('SUMMARY:'+icsTxt(tituloCita(c,a)));if(lugar())L1.push('LOCATION:'+icsTxt(lugar()));L1.push('DESCRIPTION:'+icsTxt('Cita registrada en GCHE2'));
  L1.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsTxt(tituloCita(c,a)),'TRIGGER:'+(c.hora?'-PT'+a.min+'M':'PT8H'),'END:VALARM','END:VEVENT');return L1};
const ics=(cs,a)=>['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GCHE2//Consultas//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH'].concat(...cs.map(c=>evento(c,a)),['END:VCALENDAR']).join('\r\n');
const esIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const alCalendario=(cs,nombre)=>{const t=ics(cs,ALM());
  if(esIOS()){location.href='data:text/calendar;charset=utf-8,'+encodeURIComponent(t);return}
  bajar(nombre,t,'text/calendar');toast('Abre el archivo descargado para agregarlo a tu calendario')};
const gcal=(c,a)=>{const t=citaTs(c);const d=c.hora?utc(t)+'/'+utc(t+30*60000):c.fecha.replace(/-/g,'')+'/'+fISO(new Date(t+864e5)).replace(/-/g,'');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(tituloCita(c,a))+'&dates='+d+'&details='+encodeURIComponent('Cita registrada en GCHE2')+(lugar()?'&location='+encodeURIComponent(lugar()):'')};
const MINS=[[10,'10 minutos'],[30,'30 minutos'],[60,'1 hora'],[120,'2 horas'],[1440,'1 día']];
const almOpts=()=>{const a=ALM();return `<div class="fw full"><label>Avisar antes de la cita</label><div class="opts">${MINS.map(([m,t])=>`<button class="chip${a.min===m?' on':''}" data-x="almMin" data-m="${m}">${t}</button>`).join('')}</div></div>
  <div class="fw full"><label class="cx-ck"><input type="checkbox" id="almIni" ${a.ini?'checked':''}> En el calendario, mostrar solo las iniciales del paciente</label></div>`};
const almBind=()=>{SX.almMin=b=>{almSet({min:+b.dataset.m});b.parentNode.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b))};
  const k=$('#almIni');if(k)k.addEventListener('change',()=>almSet({ini:k.checked}))};
const alarmaSheet=c=>{if(!c)return;
  SX.almIcs=()=>alCalendario([c],'cita-'+c.fecha+'.ics');
  SX.almG=()=>window.open(gcal(c,ALM()),'_blank','noopener');
  openSheet('Alarma de la cita',`<div class="cx"><p><b>${esc(fLarga(c.fecha))}${c.hora?' · '+esc(c.hora):' · sin hora'}</b><br>${esc(c.nombre)}${c.motivo?' · '+esc(c.motivo):''}</p>
  <div class="fx">${almOpts()}</div>
  <div class="cx-row"><button class="cxb" data-x="almIcs">Agregar al calendario del celular</button><button class="cxb gris" data-x="almG">Abrir en Google Calendar</button></div>
  <p class="hint">La alarma del calendario suena aunque la app esté cerrada. Con el archivo, la alarma queda con el tiempo que elegiste. En Google Calendar se usa el aviso que tengas configurado en ese calendario.${c.hora?'':' Como la cita no tiene hora, el aviso sale a las 8 de la mañana de ese día.'}</p></div>`);almBind()};
const alarmasConfig=()=>{const a=ALM(),soporte='Notification' in window,perm=soporte?Notification.permission:'no';
  const prox=L('citas').filter(c=>c.estado==='pendiente'&&citaTs(c)>=Date.now()-36e5).sort((x,y)=>citaTs(x)-citaTs(y));
  SX.almTodas=()=>{if(!prox.length){toast('No hay citas pendientes');return}alCalendario(prox,'citas-gche2-'+hoy()+'.ics')};
  SX.almApp=async b=>{if(!soporte){toast('Este navegador no permite avisos');return}
    if(ALM().avisar){almSet({avisar:false});toast('Avisos de la app apagados');alarmasConfig();return}
    const r=Notification.permission==='granted'?'granted':await Notification.requestPermission();
    if(r==='granted'){almSet({avisar:true});toast('Avisos de la app encendidos');revisarCitas()}else toast('No diste permiso de notificaciones');alarmasConfig()};
  openSheet('Alarmas y avisos de citas',`<div class="cx"><div class="fx">${almOpts()}</div>
  <p class="hint" style="font-weight:600;margin-top:18px;color:var(--ink)">Calendario del celular (la opción más segura)</p>
  <p class="hint">Agrega de una vez tus ${prox.length} citas pendientes al calendario, cada una con su alarma. Si después cambias una cita, vuelve a agregarla: se actualiza la misma en lugar de duplicarse en la mayoría de los calendarios.</p>
  <div class="cx-row"><button class="cxb" data-x="almTodas">Agregar todas las citas pendientes</button></div>
  <p class="hint" style="font-weight:600;margin-top:18px;color:var(--ink)">Avisos dentro de la app</p>
  <p class="hint">Una notificación antes de cada cita mientras la app esté abierta o en segundo plano. Si cierras la app por completo, no llegan; para eso usa el calendario.${perm==='denied'?' Bloqueaste las notificaciones: actívalas en los ajustes del navegador para esta página.':''}</p>
  <div class="cx-row"><button class="cxb ${a.avisar?'red':'gris'}" data-x="almApp">${a.avisar?'Apagar avisos de la app':'Encender avisos de la app'}</button></div></div>`);almBind()};
const avisar=async(t,body,tag)=>{try{const r=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();
  const o={body,tag,icon:'icons/icon-192.png',badge:'icons/favicon-48.png',data:{url:'#consultas-0'},vibrate:[200,100,200]};
  if(r&&r.showNotification)await r.showNotification(t,o);else new Notification(t,o)}catch(_){}};
const revisarCitas=()=>{const a=ALM();if(!a.avisar||MODO==='login'||!('Notification' in window)||Notification.permission!=='granted')return;
  const ya=store.get('gche2-avisadas',{}),now=Date.now();let cambio=false;
  L('citas').forEach(c=>{if(c.estado!=='pendiente'||!c.hora)return;const t=citaTs(c),k=c.id+'@'+t;if(ya[k])return;const d=t-now;
    if(d<=a.min*60000&&d>-10*60000){ya[k]=now;cambio=true;const m=Math.round(d/60000);avisar('Cita '+(m>0?'en '+(m>=60?Math.round(m/60)+' h':m+' min'):'ahora'),`${c.hora} · ${a.ini?inic(c.nombre):c.nombre}${c.motivo&&!a.ini?' · '+c.motivo:''}`,'cita-'+c.id);if(!document.hidden){toast('Cita a las '+c.hora+' con '+c.nombre);vib&&vib()}}});
  if(cambio){Object.keys(ya).forEach(k=>{if(now-ya[k]>3*864e5)delete ya[k]});store.set('gche2-avisadas',ya)}};
setInterval(revisarCitas,30000);setTimeout(revisarCitas,4000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)revisarCitas()});
const avisos=()=>{if(MODO==='login')return '<p>Inicia sesión para ver los avisos de tus citas.</p>';
  const now=Date.now(),cs=L('citas').filter(c=>c.estado==='pendiente'&&citaTs(c)>=now-36e5&&citaTs(c)<=now+48*36e5).sort((x,y)=>citaTs(x)-citaTs(y));
  const u=store.get('gche2-ultresp',0),np=L('pacientes').length,viejo=np&&(!u||now-u>7*864e5);
  return `<p class="slabel" style="margin:4px 0 0">Citas de las próximas 48 horas</p>${cs.length?`<div class="nlist">${cs.map(c=>`<button data-cxh="consultas-0"><i></i><span><b style="font-size:15px">${esc(c.fecha===hoy()?'Hoy':fLarga(c.fecha))}${c.hora?' · '+esc(c.hora):''}</b><small>${esc(c.nombre)}${c.motivo?' · '+esc(c.motivo):''}</small></span></button>`).join('')}</div>`:'<p class="hint">Sin citas pendientes.</p>'}
  ${(()=>{const P=S.pacientes[store.get('gche2-ultp','')];if(!P||!window.VX)return'';const pe=VX.pendP(P).filter(x=>x.est==='hoy');return pe.length?`<p class="slabel" style="margin:16px 0 0">Vacunas pendientes de ${esc(nombreP(P))}</p><div class="nlist">${pe.slice(0,5).map(x=>`<button data-cxh="consultas-p-${P.id}"><i style="background:#03aa49"></i><span><b style="font-size:15px">${esc(x.v?x.v.n:x.n)}${x.t?' · '+esc(x.t):''}</b><small>${esc(x.txt||'Toca hoy')}</small></span></button>`).join('')}</div>`:''})()}
  ${viejo?`<p class="slabel" style="margin:16px 0 0">Respaldo</p><div class="nlist"><button data-cxr="1"><i style="background:#ff9f0a"></i><span><b style="font-size:15px">${u?'Tu último respaldo tiene más de una semana':'Aún no respaldas tus pacientes'}</b><small>Toca para descargar el archivo</small></span></button></div>`:''}`};
document.getElementById('sBody').addEventListener('click',e=>{if(e.target.closest('[data-cxr]')){e.stopPropagation();respaldo()}});

/* panel derecho */
const panel=id=>{
  if(MODO==='login')return '<p class="cx-ph">Inicia sesión para ver tus pacientes.</p>';
  if(id==='citas'){const c=L('citas').filter(x=>x.fecha===hoy()&&x.estado!=='cancelada').sort((a,b)=>(a.hora||'99').localeCompare(b.hora||'99'));return c.length?c.slice(0,4).map(x=>`<p class="cx-ph"><b style="color:var(--ink)">${esc(x.hora||'--:--')}</b> ${esc(x.nombre)}</p>`).join('')+(c.length>4?`<p class="cx-ph">y ${c.length-4} más</p>`:''):'<p class="cx-ph">Sin citas para hoy.</p>'}
  if(id==='paciente'){const P=S.pacientes[store.get('gche2-ultp','')];if(!P)return '<p class="cx-ph">Abre un expediente y aparecerá aquí.</p>';const a=alergias(P);return `<div style="display:flex;align-items:center;gap:10px;margin-top:10px">${avatar(P)}<div><b style="font-size:15px">${esc(nombreP(P))}</b><div class="cx-ph" style="margin:0">${esc(edadP(P))}</div></div></div><p class="cx-ph" style="${a.neg?'':'color:#ff3b30;font-weight:600'}">${esc(a.txt)}</p>`}
  if(id==='consultorio'){const cs=L('consultas'),t0=new Date();t0.setHours(0,0,0,0);const lun=new Date(t0);lun.setDate(lun.getDate()-((lun.getDay()+6)%7));const mes=new Date(t0.getFullYear(),t0.getMonth(),1);return `<div class="count"><b>${cs.filter(c=>c.fecha>=lun.getTime()).length}<small>Semana</small></b><b>${cs.filter(c=>c.fecha>=mes.getTime()).length}<small>Mes</small></b></div>`}
  return ''};
const panelAct=id=>{if(id==='paciente'){const p=store.get('gche2-ultp','');return S.pacientes[p]?'consultas-p-'+p:'consultas-2'}return 'consultas-0'};

/* búsqueda global */
const buscar=q=>{if(!q||MODO==='login')return'';const r=L('pacientes').filter(p=>indiceP(p).includes(q)).slice(0,5);return r.length?`<p class="slabel" style="margin:14px 0 0">Pacientes</p><div class="nlist">${r.map(p=>`<button data-cxh="consultas-p-${p.id}" style="--c:${COL}"><i></i><span><b style="font-size:15px">${esc(nombreP(p))}</b><small>${esc([edadP(p),TIPOS[p.tipo][0]].filter(Boolean).join(' · '))}</small></span>${icon('person',18)}</button>`).join('')}</div>`:''};

const pacienteActual=()=>{const P=S.pacientes[store.get('gche2-ultp','')];if(!P)return null;const h=P.hc||{},u=ultimaConsulta(P.id),ud=(u&&u.datos)||{};const a=aniosP(P),sx=sexoP(P);
  return{nombre:nombreP(P),edad:a!=null?Math.floor(a):null,sexo:sx==='Hombre'?'H':sx==='Mujer'?'M':null,peso:num(ud.peso)||num(h.peso),talla:num(ud.talla)||num(h.talla),fum:ud.fum||h.fum||null}};
const pacPorNombre=n=>{n=norm(n).trim();return n?L('pacientes').find(p=>norm(nombreP(p))===n):null};
const alergiaDe=n=>{const P=pacPorNombre(n);return P?alergias(P):null};
const choque=(n,med)=>{const P=pacPorNombre(n);return P?choqueAlergia(P,med):''};
const nombres=()=>L('pacientes').map(nombreP);
window.CX={owns,show,flush,perfil,respaldo,referir,col:L,guarda:put,borra:del,alarmasConfig,avisos,cuentaRow,cuenta,panel,panelAct,buscar,pacienteActual,alergiaDe,choque,nombres,medicoDatos:med,get modo(){return MODO}};
const h0=location.hash.slice(1);if(owns(h0))G.route();
if(MODO==='local')G.renderPanel&&G.renderPanel();
})();
