/* GCHE2 · Lectura de temas en Estudio
   1) Al deslizar hacia abajo dentro de un tema, la barra de arriba cambia: queda el nombre del tema,
      sus pestañas (Resumen, Preguntas, Mis notas, Audio, Profundizar), el botón de notas y una lupa.
   2) Notas flotantes: ventana movible con dos páginas, pluma (S Pen, colores, borrador) y teclado.
      El texto es el mismo de la pestaña «Mis notas»; el dibujo se guarda por tema.
   Solo lee la vista de temas (estudio-libros.js) mediante window.SX.cur; no la modifica. */
(()=>{
const G=()=>window.G||{},$=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const st={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){G().toast&&G().toast('No hay espacio para guardar el dibujo en este dispositivo')}}};
const vib=()=>{try{G().vib&&G().vib()}catch(e){}};
const enCuenta=()=>window.CX&&(CX.modo==='nube'||CX.modo==='local');
const I={
  nota:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  lupa:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  goma:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4-4 11-11 7 7-8 8Z"/><path d="M7 21h13M10 10l7 7"/></svg>',
  undo:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  min:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  x:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};
document.head.insertAdjacentHTML('beforeend',`<style>
.lee-box{display:none;flex:1;min-width:0;align-items:center;gap:6px}
.bar.lee .lee-box{display:flex;animation:leein .25s var(--ease,ease)}
.bar.lee .search,.bar.lee .tools{display:none}
.bar.lee .logo{font-size:0;gap:0}
@media(max-width:600px){.bar.lee .logo,.bar.lee .narrow-menu{display:none}}
@keyframes leein{from{opacity:0;transform:translateY(-6px)}}
.lee-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.lee-t b{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}
.lee-tabs{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
.lee-tabs::-webkit-scrollbar{display:none}
.lee-tabs button{flex:none;padding:4px 10px;border-radius:9px;font-size:13px;color:var(--ink2);background:var(--ctrl)}
.lee-tabs button.on{background:var(--blue);color:#fff;font-weight:600}
.lee-ib{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;color:var(--ink)}
.lee-ib:hover{background:var(--ctrl)}.lee-ib.on{color:var(--blue)}
.sx-notab{display:inline-flex;align-items:center;gap:8px;margin:0 0 6px;padding:9px 16px;border-radius:12px;background:var(--ctrl);font-size:15px;font-weight:500;color:var(--blue)}
.fln{position:fixed;z-index:80;width:min(560px,94vw);height:min(470px,70vh);min-width:280px;min-height:240px;display:flex;flex-direction:column;border-radius:18px;background:var(--solid);box-shadow:0 18px 50px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.06);resize:both;overflow:hidden;animation:flin .22s var(--ease,ease)}
.fln.min{height:auto!important;min-height:0;resize:none}.fln.min .fl-body,.fln.min .fl-tools{display:none}
@keyframes flin{from{opacity:0;transform:scale(.96)}}
.fl-h{display:flex;align-items:center;gap:6px;padding:8px 8px 8px 14px;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;border-bottom:1px solid var(--line,rgba(0,0,0,.08))}
.fl-h:active{cursor:grabbing}
.fl-h b{flex:1;min-width:0;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fl-pg{display:flex;padding:3px;border-radius:10px;background:var(--ctrl)}
.fl-pg button{padding:5px 11px;border-radius:8px;font-size:13px;color:var(--ink2)}
.fl-pg button.on{background:var(--solid);color:var(--ink);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.fl-hb{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:var(--ink2)}
.fl-hb:hover{background:var(--ctrl)}
.fl-tools{display:flex;align-items:center;gap:6px;padding:8px 10px;flex-wrap:wrap;border-bottom:1px solid var(--line,rgba(0,0,0,.08))}
.fl-c{width:26px;height:26px;border-radius:50%;border:2px solid transparent;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.fl-c.on{border-color:var(--blue);transform:scale(1.12)}
.fl-g{width:1px;height:22px;background:var(--line,rgba(0,0,0,.12));margin:0 2px}
.fl-w{width:30px;height:30px;border-radius:8px;display:grid;place-items:center}
.fl-w i{display:block;border-radius:50%;background:var(--ink)}
.fl-w.on,.fl-tb.on{background:color-mix(in srgb,var(--blue) 16%,transparent);color:var(--blue)}
.fl-tb{height:30px;padding:0 8px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--ink2)}
.fl-body{flex:1;min-height:0;position:relative}
.fl-body canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;background:var(--solid);cursor:crosshair}
.fl-body textarea{position:absolute;inset:0;width:100%;height:100%;border:0;resize:none;padding:14px;font:inherit;font-size:16px;line-height:1.5;background:transparent;color:var(--ink);outline:none}
.fl-pie{font-size:12px;color:var(--ink2);padding:4px 12px 8px}
@media print{.fln{display:none!important}}
</style>`);

/* ---------- barra de lectura ---------- */
let box=null,raf=0;
const enTema=()=>{const v=$('#v-page');return window.SX&&SX.cur&&v&&v.querySelector('.sx-tabs')};
const armaBox=()=>{const bar=$('#bar');if(!bar)return;if(!box){box=document.createElement('div');box.className='lee-box';const s=bar.querySelector('#bSearch');bar.insertBefore(box,s);
    box.addEventListener('click',e=>{const t=e.target.closest('[data-lt]'),b=e.target.closest('[data-le]');
      if(t){vib();const o=$(`#v-page .sx-tabs [data-tb="${t.dataset.lt}"]`);if(o){o.click();requestAnimationFrame(()=>{const tb=$('#v-page .sx-tabs');if(tb)scrollTo({top:Math.max(0,tb.getBoundingClientRect().top+scrollY-bar.offsetHeight-10),behavior:'smooth'})})}return}
      if(!b)return;vib();if(b.dataset.le==='busca')$('#bSearch').click();else abre()})}
  const tabs=[...document.querySelectorAll('#v-page .sx-tabs [data-tb]')];
  box.innerHTML=`<span class="lee-t"><b>${esc(SX.cur.titulo)}</b><span class="lee-tabs">${tabs.map(b=>`<button data-lt="${b.dataset.tb}" class="${b.classList.contains('on')?'on':''}">${esc(b.textContent)}</button>`).join('')}</span></span><button class="lee-ib${FL?' on':''}" data-le="nota" aria-label="Notas del tema">${I.nota}</button><button class="lee-ib" data-le="busca" aria-label="Buscar">${I.lupa}</button>`};
const revisa=()=>{raf=0;const bar=$('#bar');if(!bar)return;const tb=enTema();
  if(!tb){bar.classList.remove('lee');return}
  const on=tb.getBoundingClientRect().bottom<bar.offsetHeight;
  if(on&&!bar.classList.contains('lee')){armaBox();bar.classList.add('lee')}else if(!on)bar.classList.remove('lee')};
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(revisa)},{passive:true});
addEventListener('hashchange',()=>setTimeout(revisa,60));
/* al volver a pintarse la vista (cambio de pestaña), se rehace la barra y el botón de notas */
const mo=new MutationObserver(()=>{const tb=enTema();if(tb){ponBoton(tb);if(box&&$('#bar').classList.contains('lee'))armaBox()}requestAnimationFrame(revisa)});
const ini=()=>{const v=$('#v-page');if(v)mo.observe(v,{childList:true});else setTimeout(ini,300)};ini();
const ponBoton=tb=>{if(tb.previousElementSibling&&tb.previousElementSibling.classList.contains('sx-notab'))return;
  const b=document.createElement('button');b.className='sx-notab';b.innerHTML=I.nota+'Notas del tema';b.onclick=()=>{vib();abre()};tb.parentNode.insertBefore(b,tb)};

/* ---------- notas flotantes ---------- */
let FL=null;
const COLS=['ink','#0071e3','#d70015','#248a3d','#c93400','#8944ab','#f5c400'];
const ANCH=[2,4,8];
const T={pg:st.get('gche2-flpg','pluma'),col:0,an:1,goma:false};
const kTr=id=>'trazo-'+id;
const leeTr=id=>{if(enCuenta()){const o=CX.col('estudio').find(x=>x.id===kTr(id));if(o&&o.d)try{return JSON.parse(o.d)}catch(e){}}return (st.get('gche2-trazos',{})[id])||[]};
const guardaTr=(id,meta,tr)=>{const all=st.get('gche2-trazos',{});all[id]=tr;st.set('gche2-trazos',all);
  if(enCuenta()){const d=JSON.stringify(tr);if(d.length<800000)CX.guarda('estudio',{id:kTr(id),trazo:1,...meta,d,fecha:new Date().toISOString()})}};

const abre=()=>{if(!window.SX||!SX.cur)return;const cur=SX.cur;
  if(FL&&FL.id===cur.id){FL.el.classList.remove('min');return}
  if(FL)cierra();
  const el=document.createElement('div');el.className='fln';el.setAttribute('role','dialog');el.setAttribute('aria-label','Notas del tema');
  const pos=st.get('gche2-flpos',null);
  el.innerHTML=`<div class="fl-h"><b>${esc(cur.titulo)}</b><span class="fl-pg"><button data-pg="pluma">Pluma</button><button data-pg="texto">Teclado</button></span><button class="fl-hb" data-fh="min" aria-label="Minimizar">${I.min}</button><button class="fl-hb" data-fh="x" aria-label="Cerrar">${I.x}</button></div>
  <div class="fl-tools">${COLS.map((c,i)=>`<button class="fl-c" data-co="${i}" style="background:${c==='ink'?'var(--ink)':c}" aria-label="Color ${i+1}"></button>`).join('')}<span class="fl-g"></span>${ANCH.map((w,i)=>`<button class="fl-w" data-an="${i}" aria-label="Grosor ${i+1}"><i style="width:${w+3}px;height:${w+3}px"></i></button>`).join('')}<span class="fl-g"></span><button class="fl-tb" data-tl="goma">${I.goma}Borrador</button><button class="fl-tb" data-tl="undo" aria-label="Deshacer">${I.undo}</button><button class="fl-tb" data-tl="limpia">Borrar todo</button></div>
  <div class="fl-body"><canvas></canvas><textarea placeholder="Escribe aquí tus notas de este tema. Es el mismo texto de la pestaña Mis notas y se guarda solo." hidden></textarea></div><div class="fl-pie"></div>`;
  document.body.appendChild(el);
  const W=el.offsetWidth,H=el.offsetHeight;
  const x=pos?Math.min(Math.max(8,pos.x),innerWidth-W-8):innerWidth-W-16,y=pos?Math.min(Math.max(8,pos.y),innerHeight-60):Math.max(70,innerHeight-H-90);
  el.style.left=x+'px';el.style.top=y+'px';
  const cv=el.querySelector('canvas'),ta=el.querySelector('textarea'),pie=el.querySelector('.fl-pie'),ctx=cv.getContext('2d');
  let tr=leeTr(cur.id).slice(),act=null,pen=false,tt;
  ta.value=window.SX.leeNota?SX.leeNota(cur.id):'';
  FL={id:cur.id,el};
  const tam=()=>{const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;if(!r.width)return;cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);dib()};
  const linea=s=>{const p=s.p;if(!p.length)return;const c=s.c==='ink'?(getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#1d1d1f'):s.c;ctx.globalCompositeOperation='source-over';ctx.strokeStyle=c;ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=s.c==='#f5c400'?.45:1;
    if(p.length<6){ctx.beginPath();ctx.fillStyle=c;ctx.arc(p[0],p[1],s.w*(.5+(p[2]||.5))/2+.5,0,7);ctx.fill();ctx.globalAlpha=1;return}
    for(let i=3;i<p.length;i+=3){ctx.beginPath();ctx.lineWidth=s.w*(.5+(p[i+2]||.5));ctx.moveTo(p[i-3],p[i-2]);ctx.lineTo(p[i],p[i+1]);ctx.stroke()}ctx.globalAlpha=1};
  const dib=()=>{ctx.clearRect(0,0,cv.width,cv.height);tr.forEach(linea);if(act)linea(act)};
  const guarda=()=>{clearTimeout(tt);tt=setTimeout(()=>{guardaTr(cur.id,cur.meta,tr);pie.textContent=enCuenta()?'Dibujo guardado en tu cuenta.':'Dibujo guardado en este dispositivo.'},900)};
  const toca=(x,y)=>{const r=10;const n=tr.length;tr=tr.filter(s=>{for(let i=0;i<s.p.length;i+=3)if(Math.abs(s.p[i]-x)<r+s.w&&Math.abs(s.p[i+1]-y)<r+s.w)return false;return true});if(tr.length!==n){dib();guarda()}};
  const xy=e=>{const r=cv.getBoundingClientRect();return[Math.round((e.clientX-r.left)*10)/10,Math.round((e.clientY-r.top)*10)/10,e.pointerType==='pen'?Math.round((e.pressure||.5)*100)/100:.5]};
  const borra=e=>T.goma||(e.pointerType==='pen'&&(e.buttons&32||e.button===5));
  cv.addEventListener('pointerdown',e=>{if(e.pointerType==='pen')pen=true;else if(pen&&e.pointerType==='touch')return;/* con S Pen, la palma no dibuja */
    cv.setPointerCapture(e.pointerId);const [x,y,p]=xy(e);if(borra(e)){act={goma:1};toca(x,y);return}act={c:COLS[T.col],w:ANCH[T.an],p:[x,y,p]};dib()});
  cv.addEventListener('pointermove',e=>{if(!act)return;const ev=e.getCoalescedEvents?e.getCoalescedEvents():[e];
    if(act.goma){ev.forEach(k=>{const [x,y]=xy(k);toca(x,y)});return}ev.forEach(k=>act.p.push(...xy(k)));dib()});
  const fin=()=>{if(!act)return;if(!act.goma){tr.push(act);guarda()}act=null;dib()};
  cv.addEventListener('pointerup',fin);cv.addEventListener('pointercancel',fin);
  ta.addEventListener('input',()=>{clearTimeout(tt);tt=setTimeout(()=>{SX.guardaNota&&SX.guardaNota(cur.id,cur.meta,ta.value);const o=document.getElementById('sxNota');if(o&&o!==ta)o.value=ta.value;pie.textContent=enCuenta()?'Texto guardado en tu cuenta.':'Texto guardado en este dispositivo.'},600)});
  const pinta=()=>{el.querySelectorAll('[data-pg]').forEach(b=>b.classList.toggle('on',b.dataset.pg===T.pg));const pl=T.pg==='pluma';cv.hidden=!pl;ta.hidden=pl;el.querySelector('.fl-tools').style.display=pl?'':'none';
    el.querySelectorAll('[data-co]').forEach(b=>b.classList.toggle('on',!T.goma&&+b.dataset.co===T.col));el.querySelectorAll('[data-an]').forEach(b=>b.classList.toggle('on',+b.dataset.an===T.an));el.querySelector('[data-tl=goma]').classList.toggle('on',T.goma);
    pie.textContent=pl?(pen?'Pluma detectada: la palma de la mano no dibuja.':'Escribe con la S Pen o con el dedo. El botón lateral de la pluma borra.'):'';if(pl)requestAnimationFrame(tam);else ta.focus()};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-pg],[data-co],[data-an],[data-tl],[data-fh]');if(!b)return;vib();
    if(b.dataset.pg){T.pg=b.dataset.pg;st.set('gche2-flpg',T.pg)}
    else if(b.dataset.co){T.col=+b.dataset.co;T.goma=false}
    else if(b.dataset.an){T.an=+b.dataset.an}
    else if(b.dataset.tl==='goma')T.goma=!T.goma;
    else if(b.dataset.tl==='undo'){tr.pop();dib();guarda()}
    else if(b.dataset.tl==='limpia'){if(!tr.length)return;if(!b.dataset.ok){b.dataset.ok=1;b.textContent='¿Seguro? Toca otra vez';setTimeout(()=>{delete b.dataset.ok;b.textContent='Borrar todo'},2500);return}tr=[];dib();guarda()}
    else if(b.dataset.fh==='min'){el.classList.toggle('min');if(!el.classList.contains('min'))requestAnimationFrame(tam);return}
    else if(b.dataset.fh==='x'){cierra();return}
    pinta()});
  /* mover la ventana arrastrando la barra superior */
  const h=el.querySelector('.fl-h');let dr=null;
  h.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;h.setPointerCapture(e.pointerId);dr={dx:e.clientX-el.offsetLeft,dy:e.clientY-el.offsetTop}});
  h.addEventListener('pointermove',e=>{if(!dr)return;const nx=Math.min(Math.max(0,e.clientX-dr.dx),innerWidth-80),ny=Math.min(Math.max(0,e.clientY-dr.dy),innerHeight-50);el.style.left=nx+'px';el.style.top=ny+'px'});
  const suelta=()=>{if(!dr)return;dr=null;st.set('gche2-flpos',{x:el.offsetLeft,y:el.offsetTop})};h.addEventListener('pointerup',suelta);h.addEventListener('pointercancel',suelta);
  FL.ro=new ResizeObserver(()=>{if(!cv.hidden)tam()});FL.ro.observe(el.querySelector('.fl-body'));
  FL.save=()=>{clearTimeout(tt);guardaTr(cur.id,cur.meta,tr);if(SX.guardaNota&&ta.value!==(SX.leeNota?SX.leeNota(cur.id):''))SX.guardaNota(cur.id,cur.meta,ta.value)};
  pinta();armaBoxSiLee()};
const cierra=()=>{if(!FL)return;try{FL.save()}catch(e){}FL.ro&&FL.ro.disconnect();FL.el.remove();FL=null;armaBoxSiLee()};
const armaBoxSiLee=()=>{if(box&&$('#bar')&&$('#bar').classList.contains('lee')&&enTema())armaBox()};
/* si sales del tema, la ventana se guarda y se cierra */
const mismo=()=>FL&&enTema()&&SX.cur.id===FL.id;
addEventListener('hashchange',()=>setTimeout(()=>{if(FL&&!mismo())cierra()},150));
addEventListener('pagehide',()=>{if(FL)try{FL.save()}catch(e){}});
window.LX={abre,cierra,revisa};
})();
