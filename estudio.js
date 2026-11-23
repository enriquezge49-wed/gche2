/* GCHE2 · Estudio: calendario semanal de lunes a domingo, de 7:00 a 22:00.
   Tipos: clase, estudio personal, guardia o turno y consulta privada. Bloques fijos que se repiten cada semana y bloques de una sola semana. */
(()=>{
'use strict';
const G=window.G;if(!G)return;
const {$,$$,icon,toast,store,vib,openSheet,closeSheet}=G;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL='#8668ff';
const TIP={clase:['Clase','#0071e3'],estudio:['Estudio personal','#8668ff'],guardia:['Guardia o turno','#ff3b30'],consulta:['Consulta privada','#03aa49']};
const DN=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],DC=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const H0=7,H1=22,fh=h=>`${h}:00`;
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const lunes=d=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const fISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const wkey=o=>{const x=lunes(new Date());x.setDate(x.getDate()+o*7);return fISO(x)};
let wk=0,dSel=(new Date().getDay()+6)%7,EL=null;

/* datos: en la cuenta (igual que los pacientes) o en el dispositivo mientras no hay sesión */
const enCuenta=()=>window.CX&&(CX.modo==='nube'||CX.modo==='local');
const lista=()=>{const l=enCuenta()?CX.col('estudio'):store.get('gche2-estcal',[]);return l.filter(b=>b&&b.tipo)};
const guarda=o=>{if(enCuenta())CX.guarda('estudio',o);else store.set('gche2-estcal',store.get('gche2-estcal',[]).filter(x=>x.id!==o.id).concat(o))};
const borra=id=>{if(enCuenta())CX.borra('estudio',id);else store.set('gche2-estcal',store.get('gche2-estcal',[]).filter(x=>x.id!==id))};
const migra=()=>{const loc=store.get('gche2-estcal',[]);if(enCuenta()&&loc.length){loc.forEach(o=>CX.guarda('estudio',o));store.set('gche2-estcal',[]);toast('Tu calendario de estudio quedó guardado en tu cuenta')}};
const visibles=()=>lista().filter(b=>b.rep||b.wk===wkey(wk));

/* vista */
const owns=h=>h==='estudio-0'||h.startsWith('estudio-0-');
const show=(h,el)=>{EL=el;el.style.cssText='--c:'+COL;migra();pinta();if(h==='estudio-0-0')setTimeout(()=>editor(null,dSel,Math.max(H0,Math.min(H1-1,new Date().getHours()+1))),250)};
const head=()=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a><span>›</span><a href="#estudio">Estudio</a><span>›</span><b>Calendario semanal</b></nav><div class="phead"><div><h1 class="rise" style="--i:1">Calendario semanal</h1><p class="lead rise" style="--i:2">De lunes a domingo, de 7:00 a 22:00. Toca un espacio vacío para agregar un bloque.</p></div></div>`;
const pinta=()=>{if(!EL)return;const ancho=innerWidth<760,H=ancho?64:52,L0=lunes(new Date());L0.setDate(L0.getDate()+wk*7);
  const D=Array.from({length:7},(_,i)=>{const x=new Date(L0);x.setDate(x.getDate()+i);return x}),hoyI=(new Date().getDay()+6)%7,esHoy=i=>wk===0&&i===hoyI;
  const fin=D[6],rango=L0.getMonth()===fin.getMonth()?`${L0.getDate()} al ${fin.getDate()} de ${MES[fin.getMonth()]}`:`${L0.getDate()} de ${MES[L0.getMonth()]} al ${fin.getDate()} de ${MES[fin.getMonth()]}`;
  const V=visibles();
  const cols=D.map((x,i)=>{
    const bl=V.filter(b=>b.d===i).map(b=>{const f=b.nx?H1:b.f,ov=!!b.nx;return `<button class="ec-b${ov?' over':''}" style="--k:${TIP[b.tipo][1]};top:${(b.i-H0)*H+1}px;height:${(f-b.i)*H-3}px" data-id="${b.id}"><b>${esc(b.mat||TIP[b.tipo][0])}</b><small>${ov?`${fh(b.i)} · hasta ${fh(b.nx)} del ${DN[(i+1)%7].toLowerCase()}`:`${fh(b.i)} a ${fh(b.f)}`}${b.tema?' · '+esc(b.tema):''}</small>${b.lug&&(f-b.i)>1?`<small>${esc(b.lug)}</small>`:''}${b.rep?`<span class="ec-rep">${icon('<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',12)}</span>`:''}</button>`}).join('');
    const prev=V.filter(b=>b.nx&&b.d+1===i).map(b=>`<button class="ec-b tail" style="--k:${TIP[b.tipo][1]};top:0;height:${Math.max(26,(b.nx-H0)*H-3)}px" data-id="${b.id}"><b>Sale de guardia · ${fh(b.nx)}</b></button>`).join('');
    let now='';if(esHoy(i)){const d=new Date(),h=d.getHours()+d.getMinutes()/60;if(h>=H0&&h<=H1)now=`<div class="ec-now" style="top:${(h-H0)*H}px"></div>`}
    return `<div class="ec-col${esHoy(i)?' hoy':''}${i===dSel?' sel':''}" data-d="${i}" style="grid-column:${i+2};height:${(H1-H0)*H}px">${prev}${bl}${now}</div>`}).join('');
  EL.innerHTML=`<div class="cx">${head()}<div class="ec glass">
  <div class="ec-h"><div><h2>Semana del ${rango}</h2><span>${wk===0?'Esta semana':wk>0?`Dentro de ${wk} semana${wk>1?'s':''}`:`Hace ${-wk} semana${wk<-1?'s':''}`}</span></div>
   <div class="ec-nav"><button class="ec-ib" data-w="-1" aria-label="Semana anterior">${icon('<path d="M15 6l-6 6 6 6"/>',18)}</button><button class="cxb gris sm" data-w="0">Hoy</button><button class="ec-ib" data-w="1" aria-label="Semana siguiente">${icon('<path d="M9 6l6 6-6 6"/>',18)}</button><button class="cxb sm" id="ecAdd">${icon('<path d="M12 5v14M5 12h14"/>',16)}Agregar</button></div></div>
  <div class="ec-leg">${Object.values(TIP).map(([t,c])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}<span>${icon('<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15"/>',13)} Se repite cada semana</span></div>
  <div class="ec-days">${D.map((x,i)=>`<button class="${i===dSel?'on':''}${esHoy(i)?' hoy':''}" data-ds="${i}">${DC[i]}<b>${x.getDate()}</b></button>`).join('')}</div>
  <div class="ec-g" style="--H:${H}px"><div class="ec-gh" style="grid-column:1;border-left:0"></div>${D.map((x,i)=>`<div class="ec-gh${esHoy(i)?' hoy':''}" style="grid-column:${i+2}">${DC[i]}<b>${x.getDate()}</b></div>`).join('')}
  <div class="ec-hrs">${Array.from({length:H1-H0},(_,k)=>`<div>${k?fh(H0+k):''}</div>`).join('')}</div>${cols}</div></div>
  ${V.length?'':`<p class="hint" style="margin-top:14px">Todavía no tienes bloques. Empieza con tus guardias y tus clases fijas, y marca "Cada semana" para que se repitan.</p>`}
  ${enCuenta()?'':'<p class="hint" style="margin-top:10px">Se guarda en este dispositivo. Al iniciar sesión se pasa a tu cuenta.</p>'}</div>`;
  const c=EL.querySelector('.ec');
  c.addEventListener('click',e=>{const w=e.target.closest('[data-w]');if(w){if(w.dataset.w==='0'){wk=0;dSel=hoyI}else wk+=+w.dataset.w;vib();pinta();return}
    const ds=e.target.closest('[data-ds]');if(ds){dSel=+ds.dataset.ds;pinta();return}
    if(e.target.closest('#ecAdd')){editor(null,dSel,9);return}
    const b=e.target.closest('.ec-b');if(b){editor(lista().find(x=>x.id===b.dataset.id));return}
    const col=e.target.closest('.ec-col');if(col){const r=col.getBoundingClientRect(),h=Math.min(H1-1,H0+Math.floor((e.clientY-r.top)/H));editor(null,+col.dataset.d,h)}});
  let sx=null;c.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  c.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)<60||innerWidth>=760)return;dSel+=dx<0?1:-1;if(dSel>6){dSel=0;wk++}if(dSel<0){dSel=6;wk--}pinta()})};

/* editor de bloque */
const opts=(a,b,s)=>Array.from({length:b-a+1},(_,k)=>a+k).map(h=>`<option value="${h}"${h===s?' selected':''}>${fh(h)}</option>`).join('');
const editor=(b,d,h)=>{const n=!b;b=b||{id:nid(),d,i:h,f:Math.min(h+1,H1),tipo:'estudio',mat:'',tema:'',lug:'',not:'',rec:10,rep:true};let tipo=b.tipo;
  openSheet(n?'Nuevo bloque':'Editar bloque',`<div class="cx ec-ed">
  <div class="ec-t" id="ecT">${Object.entries(TIP).map(([k,[t,c]])=>`<button type="button" class="${k===tipo?'on':''}" data-t="${k}" style="--k:${c}"><i></i>${t}</button>`).join('')}</div>
  <div class="fx" style="margin-top:12px"><div class="fw"><label for="ecMat">Materia o actividad</label><input id="ecMat" value="${esc(b.mat)}" placeholder="Cardiología" autocomplete="off"></div><div class="fw"><label for="ecTema">Tema</label><input id="ecTema" value="${esc(b.tema)}" placeholder="Insuficiencia cardiaca" autocomplete="off"></div>
  <div class="fw"><label for="ecDia">Día</label><select id="ecDia">${DN.map((x,i)=>`<option value="${i}"${i===b.d?' selected':''}>${x}</option>`).join('')}</select></div><div class="fw"><label for="ecLug">Lugar o salón</label><input id="ecLug" value="${esc(b.lug)}" placeholder="Biblioteca" autocomplete="off"></div>
  <div class="fw"><label for="ecIni">Empieza</label><select id="ecIni">${opts(H0,H1-1,b.i)}</select></div><div class="fw"><label for="ecFin">Termina</label><select id="ecFin">${opts(H0+1,H1,b.nx?H1:b.f)}</select></div>
  <div class="fw full"><label class="cx-ck"><input type="checkbox" id="ecNx"${b.nx?' checked':''}> Termina al día siguiente (guardia nocturna)</label></div>
  <div class="fw full" id="ecNxB"${b.nx?'':' hidden'}><label for="ecNxH">Sale al día siguiente a las</label><select id="ecNxH">${opts(5,14,b.nx||8)}</select></div>
  <div class="fw full"><label for="ecNot">Anotaciones</label><textarea id="ecNot" rows="3" placeholder="Páginas a leer, tareas, pendientes">${esc(b.not)}</textarea></div>
  <div class="fw"><label for="ecRec">Recordatorio</label><select id="ecRec">${[[0,'Sin recordatorio'],[10,'10 minutos antes'],[30,'30 minutos antes'],[60,'1 hora antes']].map(([v,t])=>`<option value="${v}"${v===b.rec?' selected':''}>${t}</option>`).join('')}</select></div>
  <div class="fw"><span class="lab">Repetición</span><div class="opts" id="ecRep"><button type="button" class="chip${b.rep?' on':''}" data-r="1">Cada semana</button><button type="button" class="chip${b.rep?'':' on'}" data-r="0">Solo esta semana</button></div></div></div>
  ${b.mat&&b.tipo!=='guardia'&&b.tipo!=='consulta'?`<p class="hint">Cuando esté el módulo de Estudio, al tocar la materia se abrirán sus temas.</p>`:''}
  <div class="cx-row"><button type="button" class="cxb" id="ecOk">Guardar</button>${n?'':'<button type="button" class="cxb gris" id="ecDel">Eliminar</button>'}</div></div>`);
  const q=id=>document.getElementById(id);
  q('ecT').onclick=e=>{const x=e.target.closest('button');if(!x)return;tipo=x.dataset.t;q('ecT').querySelectorAll('button').forEach(y=>y.classList.toggle('on',y===x));if(tipo==='guardia'&&!q('ecMat').value)q('ecMat').value='Guardia';if(tipo==='consulta'&&!q('ecMat').value)q('ecMat').value='Consulta privada'};
  q('ecNx').onchange=()=>{q('ecNxB').hidden=!q('ecNx').checked};
  q('ecRep').onclick=e=>{const x=e.target.closest('button');if(x)q('ecRep').querySelectorAll('button').forEach(y=>y.classList.toggle('on',y===x))};
  if(q('ecDel'))q('ecDel').onclick=()=>{borra(b.id);closeSheet();toast('Bloque eliminado');pinta()};
  q('ecOk').onclick=()=>{const i=+q('ecIni').value,f=+q('ecFin').value,nx=q('ecNx').checked;if(!nx&&f<=i){toast('La hora de término debe ser después del inicio');return}
    const rep=q('ecRep').querySelector('.on').dataset.r==='1';const o={id:b.id,d:+q('ecDia').value,i,f:nx?H1:f,tipo,mat:q('ecMat').value.trim()||TIP[tipo][0],tema:q('ecTema').value.trim(),lug:q('ecLug').value.trim(),not:q('ecNot').value.trim(),rec:+q('ecRec').value,rep};
    if(!rep)o.wk=wkey(wk);if(nx)o.nx=+q('ecNxH').value;guarda(o);closeSheet();dSel=o.d;vib();pinta();toast(o.rec?'Guardado, con recordatorio':'Guardado')}};

/* siguiente bloque y recordatorios */
const inicioDe=(b,base)=>{const x=new Date(base);x.setDate(x.getDate()+b.d);x.setHours(b.i,0,0,0);return x.getTime()};
const proximos=(n=3)=>{const out=[],now=Date.now();[0,1].forEach(o=>{const L=lunes(new Date());L.setDate(L.getDate()+o*7);const k=fISO(L);lista().filter(b=>b.rep||b.wk===k).forEach(b=>{const t=inicioDe(b,L),f=t+((b.nx?24+b.nx:b.f)-b.i)*36e5;if(f>now)out.push({b,t,f})})});return out.sort((a,b)=>a.t-b.t).slice(0,n)};
const revisa=()=>{const a=Object.assign({avisar:false},store.get('gche2-alarma',{}));if(!a.avisar||!('Notification' in window)||Notification.permission!=='granted')return;
  const ya=store.get('gche2-avisadas',{}),now=Date.now();let cambio=false;
  proximos(6).forEach(({b,t})=>{if(!b.rec)return;const k='e'+b.id+'@'+t,d=t-now;if(ya[k]||d>b.rec*60000||d<-5*60000)return;ya[k]=now;cambio=true;
    const txt=`${fh(b.i)} · ${b.mat}${b.tema?' · '+b.tema:''}${b.lug?' · '+b.lug:''}`;
    navigator.serviceWorker&&navigator.serviceWorker.getRegistration().then(r=>r&&r.showNotification(TIP[b.tipo][0]+' en '+Math.max(1,Math.round(d/60000))+' minutos',{body:txt,tag:'est-'+b.id,icon:'icons/icon-192.png',data:{url:'#estudio-0'}})).catch(()=>{});
    if(!document.hidden)toast(TIP[b.tipo][0]+': '+txt)});
  if(cambio)store.set('gche2-avisadas',ya)};
setInterval(revisa,30000);setTimeout(revisa,5000);
const siguiente=()=>{const p=proximos(1)[0];if(!p)return null;const d=new Date(p.t),hoy=new Date();const dia=d.toDateString()===hoy.toDateString()?'Hoy':DN[(d.getDay()+6)%7];return{titulo:esc(p.b.mat),tipo:TIP[p.b.tipo][0],color:TIP[p.b.tipo][1],cuando:`${dia}, ${fh(p.b.i)}`,tema:esc(p.b.tema),lug:esc(p.b.lug)}};

addEventListener('cx-estudio',()=>{if(EL&&owns(location.hash.slice(1)))pinta();G.renderPanel&&G.renderPanel()});
addEventListener('nube',()=>setTimeout(()=>{if(EL&&owns(location.hash.slice(1))){migra();pinta()}},800));
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(EL&&owns(location.hash.slice(1)))pinta()},150)});
/* bloques de un día (para el calendario del panel) */
const deDia=f=>{const L=lunes(f),k=fISO(L),d=(f.getDay()+6)%7;return lista().filter(b=>(b.rep||b.wk===k)&&b.d===d).sort((a,b)=>a.i-b.i).map(b=>({titulo:esc(b.mat),tipo:TIP[b.tipo][0],k:b.tipo,color:TIP[b.tipo][1],hora:fh(b.i),i:b.i,dur:(b.nx?24+b.nx:b.f)-b.i,tema:esc(b.tema||'')}))};
window.EX={owns,show,siguiente,deDia};
})();
