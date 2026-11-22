/* GCHE2 · Vacunas: esquema mexicano del Programa de Vacunación Universal, calculadora con esquemas atrasados (Herramientas)
   y registro de dosis en el expediente.
   Fuentes: Secretaría de Salud, Centro Nacional para la Salud de la Infancia y la Adolescencia. Programa de Vacunación Universal,
   Lineamientos Generales 2026. Consejo de Salubridad General. Protocolo Nacional de Atención Médica: Vacunación a lo largo de la vida, 2026.
   Solo se usan edades, intervalos y edades máximas que vienen en esas fuentes; lo que no viene se marca "consulta los Lineamientos". */
(()=>{
'use strict';
const G=window.G;if(!G)return;
const {$,icon,toast,store,vib}=G;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FUENTE=['Secretaría de Salud, Centro Nacional para la Salud de la Infancia y la Adolescencia. Programa de Vacunación Universal: Lineamientos Generales 2026 y su enmienda del 18 de febrero de 2026.','Consejo de Salubridad General. Protocolo Nacional de Atención Médica: Vacunación a lo largo de la vida, 2026 (Diario Oficial de la Federación).'];

/* fechas */
const D0=s=>{if(!s)return null;const [y,m,d]=String(s).split('-').map(Number);return y?new Date(y,(m||1)-1,d||1):null};
const hoyD=()=>{const t=new Date();return new Date(t.getFullYear(),t.getMonth(),t.getDate())};
const add=(f,o)=>{const r=new Date(f);if(o.y)r.setFullYear(r.getFullYear()+o.y);if(o.m)r.setMonth(r.getMonth()+o.m);if(o.w)r.setDate(r.getDate()+7*o.w);if(o.d)r.setDate(r.getDate()+o.d);return r};
const iso=f=>`${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,'0')}-${String(f.getDate()).padStart(2,'0')}`;
const fL=f=>f.toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
const meses=(a,b)=>{let m=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth();if(b.getDate()<a.getDate())m--;return m};
const edadTxt=(fn,h)=>{const m=meses(fn,h);if(m<1){const d=Math.round((h-fn)/864e5);return `${d} ${d===1?'día':'días'}`}if(m<24)return `${m} ${m===1?'mes':'meses'}`;const y=Math.floor(m/12),r=m%12;return `${y} años${r?` ${r} ${r===1?'mes':'meses'}`:''}`};
const mx=(...a)=>new Date(Math.max(...a.filter(Boolean).map(Number)));
const enTemporada=f=>{const m=f.getMonth();return m>=9||m<=2};/* temporada invernal: octubre a marzo */
const proxTemporada=f=>{const y=f.getMonth()>=9?f.getFullYear()+1:f.getFullYear();return enTemporada(f)?f:new Date(y,9,1)};

/* esquema de 0 a 9 años */
const NINOS=[
 {id:'bcg',n:'BCG',prev:'Formas graves de tuberculosis',via:'Intradérmica, 0.1 mililitros, región deltoidea derecha',max:{m:60},dosis:[{t:'Dosis única',rec:{d:0}}],nota:'Requiere peso de 2,000 gramos o más. En niños no vacunados se aplica hasta antes de los 5 años.'},
 {id:'hbrn',n:'Hepatitis B del recién nacido',prev:'Hepatitis B',via:'Intramuscular, 10 microgramos, muslo',max:{d:8},dosis:[{t:'Dosis única',rec:{d:0}}],nota:'En las primeras 24 horas de vida o hasta los 7 días. No se aplica después; la hexavalente incluye hepatitis B. Menores de 2,000 gramos: según los Lineamientos.'},
 {id:'hexa',n:'Hexavalente acelular',prev:'Difteria, tos ferina, tétanos, poliomielitis, hepatitis B y Haemophilus influenzae tipo b',via:'Intramuscular, muslo derecho',max:{m:60},dosis:[{t:'1.ª dosis',rec:{m:2},min:{w:6}},{t:'2.ª dosis',rec:{m:4},int:{w:4}},{t:'3.ª dosis',rec:{m:6},int:{w:4}},{t:'Refuerzo',rec:{m:18},intF:(prev,fn)=>prev&&meses(fn,prev)>=12?{w:6}:null}],nota:'Edad mínima 6 semanas; intervalo mínimo de 4 semanas entre dosis; si la 3.ª dosis fue después del año, el refuerzo va al menos 6 semanas después. Edad máxima: 59 meses 29 días.'},
 {id:'rota',n:'Rotavirus',prev:'Diarrea grave por rotavirus',via:'Oral',max:{m:8},dosis:[{t:'1.ª dosis',rec:{m:2},min:{w:6}},{t:'2.ª dosis',rec:{m:4},min:{w:10},int:{w:4}}],nota:'Edad máxima para cualquier dosis: 7 meses 29 días.'},
 {id:'neumo',n:'Neumocócica conjugada 20 valente',prev:'Neumonía, meningitis y otitis por neumococo',via:'Intramuscular, muslo derecho',max:{m:60},tarde:12,dosis:[{t:'1.ª dosis',rec:{m:2}},{t:'2.ª dosis',rec:{m:4},int:{w:4}},{t:'3.ª dosis',rec:{m:12},int:{w:8}}],nota:'Intervalo mínimo de 4 semanas antes del año y de 8 semanas después. Edad máxima: 59 meses 29 días.'},
 {id:'srp',n:'Triple viral (SRP)',prev:'Sarampión, rubéola y parotiditis',via:'Subcutánea, región deltoidea',max:{y:10},dosis:[{t:'1.ª dosis',rec:{m:12},min:{m:12}},{t:'2.ª dosis',rec:{m:18},int:{w:4}}],nota:'Menores de 10 años sin dosis: 2 dosis con 4 semanas de intervalo; con una dosis previa: una dosis.'},
 {id:'hepa',n:'Hepatitis A',prev:'Hepatitis A',via:'Intramuscular',dosis:[{t:'Dosis única',rec:{m:18},min:{m:18}}],nota:'Los Lineamientos la indican a los 18 meses y no fijan edad máxima.'},
 {id:'dpt',n:'DPT',prev:'Difteria, tos ferina y tétanos',via:'Intramuscular',max:{y:7},dosis:[{t:'Refuerzo',rec:{y:4},min:{y:4}}],nota:'Edad mínima 4 años; máxima 6 años 11 meses 29 días.'},
 {id:'flu',n:'Influenza estacional',prev:'Influenza',via:'Intramuscular, 0.5 mililitros',esp:'flu',dosis:[{t:'Dosis'}],nota:'De 6 a 59 meses, en la temporada invernal (octubre a marzo): sin vacunación previa, 2 dosis con 4 semanas de intervalo; después, una dosis cada año.'}];
const POR_ID={};NINOS.forEach(v=>POR_ID[v.id]=v);

/* calcula lo que sigue de una vacuna en serie */
const serie=(v,fn,h,ap)=>{const out=[],k=ap.length,tope=v.max?add(fn,v.max):null;
  if(v.esp==='flu'){const m=meses(fn,h);if(m>=60)return out;
    const desde=add(fn,{m:6}),primera=!ap.length;let f=mx(desde,proxTemporada(h));
    if(primera){out.push({v,t:'1.ª dosis',f,est:f<=h?'hoy':'prox'});const f2=add(f,{w:4});if(f2<tope59(fn))out.push({v,t:'2.ª dosis',f:f2,est:'prox'})}
    else{const ult=ap[ap.length-1].f;const yaEsta=ult&&enTemporada(h)&&(h-ult)<200*864e5;if(!yaEsta)out.push({v,t:'Dosis anual',f,est:f<=h?'hoy':'prox'})}
    return out}
  if(k>=v.dosis.length)return[{v,est:'ok'}];
  if(v.tarde&&!k&&meses(fn,h)>=v.tarde)return[{v,t:'Inicio tardío',est:'consulta',f:h,txt:'Empieza después del año: el número de dosis depende de la edad. Consulta el anexo de intervalos de los Lineamientos Generales 2026.'}];
  let prev=k?(ap[k-1].f||null):null;
  for(let i=k;i<v.dosis.length;i++){const d=v.dosis[i];
    const intO=d.intF?d.intF(prev,fn):d.int;
    let f=mx(add(fn,d.rec),d.min&&add(fn,d.min),prev&&intO&&add(prev,intO));
    if(i===k&&f<h)f=h;
    if(tope&&f>=tope){out.push({v,t:d.t,est:'no',f,txt:`Pasó la edad máxima (${edadTxt(fn,tope)})`});break}
    out.push({v,t:d.t,f,est:f<=h?'hoy':'prox'});prev=f}
  return out};
const tope59=fn=>add(fn,{m:60});
const planNinos=(fn,h,ap)=>NINOS.flatMap(v=>serie(v,fn,h,(ap[v.id]||[]).map(x=>({f:x?D0(x):null}))));

/* adolescentes, adultos y adultos mayores: reglas de los Lineamientos */
const planMayores=(edad,o,h)=>{const L=[],add2=(n,est,txt,f)=>L.push({n,est,txt,f});
  if(edad>=11&&edad<=19){if(!o.vph){if(edad===11||(edad<12))add2('Virus del papiloma humano','hoy','Dosis única en 5.º de primaria o a los 11 años si no va a la escuela.');
      else if(o.sexo==='Mujer'&&edad>=12&&edad<=16)add2('Virus del papiloma humano','hoy','Rescate: dosis única en niñas de 12 a 16 años no vacunadas.');}
    if(o.vih&&edad>=11)add2('Virus del papiloma humano (personas que viven con VIH)','hoy','3 dosis: 0, 2 y 6 meses, de 11 a 49 años.')}
  if(edad>=11&&!o.hepb&&(edad<=19||o.riesgoHB))add2('Hepatitis B','hoy','Sin vacunación previa: 3 dosis de 10 microgramos (0, 1 y 6 meses) o 2 dosis de 20 microgramos (0 y 1 mes).'+(o.dialisis?' En diálisis: 40 microgramos a los 0, 1 y 6 meses.':''));
  if(edad>=15){if(o.td==='completo'){const u=D0(o.tdF);if(!u)add2('Td (tétanos y difteria)','consulta','Esquema completo: refuerzo cada 10 años. Anota la fecha de la última dosis para calcularlo.');
      else{const f=add(u,{y:10});add2('Td (tétanos y difteria): refuerzo',f<=h?'hoy':'prox','Cada 10 años.',f)}}
    else add2('Td (tétanos y difteria)','hoy','Esquema incompleto o sin comprobante: 3 dosis a los 0, 1 y 12 meses; después un refuerzo cada 10 años.')}
  if(edad>=10&&edad<=49){const n=+o.srp||0;if(n<2)add2('Doble viral (SR) o triple viral (SRP)','hoy',n===0?'Sin dosis comprobadas: 2 dosis con 4 semanas de intervalo.':'Con una dosis previa: una dosis.')}
  if(o.comorb&&edad<60){add2('Influenza estacional',enTemporada(h)?'hoy':'prox','Con comorbilidad: una dosis cada año en la temporada invernal (octubre a marzo).',proxTemporada(h));
    add2('Neumocócica',edad<=59?'hoy':'prox',edad<20?'De 9 a 59 años con comorbilidad: 2 dosis; intervalo según los Lineamientos.':'Adultos con comorbilidad: esquema según los Lineamientos.')}
  if(edad>=60){if(!o.neumo60)add2('Neumocócica conjugada 20 valente','hoy','Dosis única a partir de los 60 años.');
    add2('Influenza estacional',enTemporada(h)?'hoy':'prox','Una dosis cada año en la temporada invernal (octubre a marzo).',proxTemporada(h))}
  if((o.comorb&&edad>=5)||edad>=60){const u=D0(o.covid);const f=u?add(u,{m:12}):h;add2('COVID-19',f<=h?'hoy':'prox',edad>=60?'Una dosis a los 12 meses de la última.':'Personas con riesgo: una dosis, 12 meses después de la última.',f)}
  return L};

/* embarazo */
const planEmb=(sdg,o,h)=>{const L=[],dia=w=>add(h,{d:Math.round((w-sdg)*7)}),fpp=dia(40),add2=(n,est,txt,f)=>L.push({n,est,txt,f});
  if(!o.tdpa){if(sdg<20)add2('Tdpa (tétanos, difteria y tos ferina acelular)','prox',`En cada embarazo, desde la semana 20; de preferencia entre la 27 y la 36 (del ${fL(dia(27))} al ${fL(dia(36))}).`,dia(20));
    else add2('Tdpa (tétanos, difteria y tos ferina acelular)','hoy',sdg<27?`Ya puede aplicarse (semana 20 o más); de preferencia entre la 27 y la 36, del ${fL(dia(27))} al ${fL(dia(36))}.`:sdg<=36?'Está en el periodo preferente (semanas 27 a 36).':'Desde la semana 20; el periodo preferente (27 a 36) ya pasó, pero aún puede aplicarse.')}
  if(o.td!=='completo')add2('Td (tétanos y difteria)','hoy','Esquema incompleto o sin comprobante: completa o inicia 3 dosis (0, 1 y 12 meses). La Tdpa puede sustituir o acompañar a una Td desde la semana 20.');
  if(!o.flu)add2('Influenza estacional',enTemporada(h)?'hoy':'prox','Una dosis intramuscular en la temporada invernal (octubre a marzo).',proxTemporada(h));
  const inv=enTemporada(fpp);
  if(inv){if(!o.vsr){const a=dia(32),b=dia(36);add2('Virus sincitial respiratorio',sdg<32?'prox':sdg<=36?'hoy':'no',sdg>36?'La ventana de 32 a 36 semanas ya pasó.':`Dosis única de la semana 32 a la 36 (del ${fL(a)} al ${fL(b)}) porque el parto cae en la temporada invernal.`,a)}}
  else add2('Virus sincitial respiratorio','info',`No indicada en este embarazo: la fecha probable de parto (${fL(fpp)}) no cae en la temporada invernal.`);
  {const u=D0(o.covid),f=u?add(u,{m:6}):h;add2('COVID-19',f<=h?'hoy':'prox','Una dosis en cualquier trimestre, de preferencia en el segundo o el tercero, al menos 6 meses después de la última.',mx(f,h))}
  add2('No aplicar en el embarazo','info','Vacunas de virus vivos: SRP, SR, BCG y varicela.');
  return {L,fpp}};

/* ---------- interfaz: calculadora guiada (Herramientas › Vacunas) ---------- */
const GR=[['ninos','Niñas y niños de 0 a 9 años','Con fecha de nacimiento; incluye esquemas atrasados','<path d="M9 12h.01M15 12h.01M10 16c1 .7 3 .7 4 0"/><circle cx="12" cy="12" r="9"/>'],
  ['adol','Adolescentes de 10 a 19 años','Virus del papiloma humano, hepatitis B, Td y SR','person'],
  ['adulto','Adultos de 20 a 59 años','Td, SR, hepatitis B y grupos de riesgo','person'],
  ['mayor','Adultos de 60 años o más','Neumococo, influenza y COVID-19','person'],
  ['emb','Embarazadas','Con semanas de gestación','<path d="M12 4a2 2 0 1 0 0 .01M10 8h4l1 5c2 1 2 5-1 6h-3l-1-5z"/>']];
const S={g:null,fn:'',sdg:'',ap:{},ck:{},o:{}};
const head=(t,lead)=>`<nav class="crumbs rise" aria-label="Ruta"><a href="#inicio">Inicio</a><span>›</span><a href="#herramientas">Herramientas</a><span>›</span>${t?`<a href="#herramientas-vacunas">Vacunas</a><span>›</span><b>${esc(t)}</b>`:'<b>Vacunas</b>'}</nav><div class="phead"><div><h1 class="rise" style="--i:1">${esc(t||'Vacunas')}</h1><p class="lead rise" style="--i:2">${lead}</p></div></div>`;
const fuenteHTML=`<p class="hint" style="margin-top:16px">Fuente: ${FUENTE.map(esc).join(' ')} No usa datos del expediente.</p>`;
const ESTT={hoy:['Toca hoy','#03aa49'],prox:['Próxima','#0071e3'],no:['Ya no aplica','#8e8e93'],consulta:['Revisar','#ff9f0a'],info:['Nota','#8e8e93'],ok:['Completa','#03aa49']};
const itemHTML=x=>{const [l,c]=ESTT[x.est]||ESTT.info;return `<div class="vx-it" style="--c:${c}"><i></i><span><b>${esc(x.v?x.v.n:x.n)}${x.t?' · '+esc(x.t):''}</b><small>${x.f&&!['info','ok','consulta'].includes(x.est)?esc(x.est==='hoy'?'Desde hoy':fL(x.f))+' · ':''}${esc(x.txt||(x.v?x.v.via:''))}</small></span><em>${l}</em></div>`};
const grupos=(L)=>{const g=k=>L.filter(x=>x.est===k);const sec=(t,a)=>a.length?`<p class="lbl" style="margin-top:18px">${t}</p><div class="cx-card glass vx-list">${a.map(itemHTML).join('')}</div>`:'';
  return sec('Toca hoy',g('hoy'))+sec('Revisar',g('consulta'))+sec('Próximas',g('prox').sort((a,b)=>(a.f||0)-(b.f||0)))+sec('Completas',g('ok'))+sec('Ya no aplican por edad',g('no'))+sec('Notas',g('info'))};
const tog=(k,t)=>`<label class="vx-tg"><input type="checkbox" data-o="${k}"${S.o[k]?' checked':''}><span>${t}</span></label>`;
const calc=(el,p)=>{const g=p[0],paso=p[1];
  if(!g||!GR.some(x=>x[0]===g)){el.innerHTML=`<div class="cx kz">${head('','Esquema del Programa de Vacunación Universal 2026. Elige para quién es; no usa datos del expediente.')}
    <p class="kz-q">¿Para quién es?</p><div class="kz-list">${GR.map(([k,t,s,ic])=>`<a class="kz-opt" href="#herramientas-vacunas-${k}"><i class="kz-ico vx-ic">${icon(ic,26)}</i><span><b>${esc(t)}</b><small>${esc(s)}</small></span></a>`).join('')}</div>${fuenteHTML}</div>`;return}
  if(S.g!==g){S.g=g;S.ap={};S.ck={};S.o={}}
  const tit=GR.find(x=>x[0]===g)[1],h=hoyD();
  if(g==='ninos'){const fn=D0(S.fn);
    if(paso!=='res'||!fn||fn>h){el.innerHTML=`<div class="cx kz">${head(tit,'Escribe la fecha de nacimiento y marca las vacunas que ya tiene, según su cartilla.')}
      <p class="kz-q">¿Cuándo nació?</p><input type="date" id="vxFn" class="vx-date" value="${esc(S.fn)}" max="${iso(h)}" aria-label="Fecha de nacimiento"><p class="hint" id="vxEd"></p>
      <p class="kz-q" style="font-size:24px">¿Qué vacunas ya tiene?</p><p class="hint">Marca las dosis de la cartilla. La fecha es opcional; si la escribes, se respetan los intervalos mínimos.</p>
      <div class="vx-ap">${NINOS.map(v=>`<div class="cx-card glass vx-v"><b>${esc(v.n)}</b><small>${esc(v.prev)}</small>${(v.esp==='flu'?[{t:'Alguna dosis previa'}]:v.dosis).map((d,i)=>`<div class="vx-d"><label class="vx-tg"><input type="checkbox" data-v="${v.id}" data-i="${i}"${(S.ck||{})[v.id+'-'+i]!==undefined?' checked':''}><span>${esc(d.t)}</span></label><input type="date" data-vf="${v.id}" data-i="${i}" value="${esc((S.ck||{})[v.id+'-'+i]||'')}" max="${iso(h)}" aria-label="Fecha de ${esc(v.n)} ${esc(d.t)}"></div>`).join('')}</div>`).join('')}</div>
      <button class="cxb kz-next" id="vxGo">Ver qué le toca</button></div>`;
      const ed=()=>{const f=D0($('#vxFn').value);$('#vxEd').textContent=f&&f<=h?'Edad: '+edadTxt(f,h):''};$('#vxFn').oninput=()=>{S.fn=$('#vxFn').value;ed()};ed();
      const leer=()=>{const ck={},ap={};el.querySelectorAll('[data-v]').forEach(c=>{if(!c.checked)return;const f=el.querySelector(`[data-vf="${c.dataset.v}"][data-i="${c.dataset.i}"]`).value||'';ck[c.dataset.v+'-'+c.dataset.i]=f;(ap[c.dataset.v]=ap[c.dataset.v]||[]).push(f)});S.ck=ck;S.ap=ap};
      el.querySelectorAll('[data-vf]').forEach(i=>i.oninput=()=>{const c=el.querySelector(`[data-v="${i.dataset.vf}"][data-i="${i.dataset.i}"]`);if(i.value)c.checked=true;leer()});
      el.querySelectorAll('[data-v]').forEach(c=>c.onchange=leer);
      $('#vxGo').onclick=()=>{leer();const f=D0(S.fn);if(!f||f>h){toast('Escribe la fecha de nacimiento');$('#vxFn').focus();return}if(meses(f,h)>=120){toast('Tiene 10 años o más: usa Adolescentes');G.go('herramientas-vacunas-adol');return}G.go('herramientas-vacunas-ninos-res')};return}
    const L=planNinos(fn,h,S.ap);
    el.innerHTML=`<div class="cx kz">${head(tit,`Nació el ${esc(fL(fn))} · tiene ${esc(edadTxt(fn,h))}.`)}<div class="kz-sum"><a href="#herramientas-vacunas-ninos">Cambiar datos<i>Editar</i></a><a href="#herramientas-vacunas">Otro grupo<i>Cambiar</i></a></div>${grupos(L)}
      <p class="hint">Varicela: una dosis al año de edad en guarderías o estancias infantiles, según disponibilidad estatal; no es parte del esquema básico.</p>${fuenteHTML}</div>`;return}
  if(g==='emb'){const sdg=parseFloat(String(S.sdg).replace(',','.'));
    if(paso!=='res'||!(sdg>=4&&sdg<=42)){el.innerHTML=`<div class="cx kz">${head(tit,'Escribe las semanas de gestación de hoy y lo que ya tiene en este embarazo.')}
      <p class="kz-q">¿Cuántas semanas tiene?</p><div class="kz-kg"><button id="vxMn" aria-label="Una semana menos">−</button><div><input id="vxSdg" inputmode="decimal" placeholder="0" value="${esc(S.sdg)}" aria-label="Semanas de gestación"><span>semanas</span></div><button id="vxMs" aria-label="Una semana más">+</button></div>
      <p class="kz-q" style="font-size:24px">¿Qué ya tiene?</p><div class="cx-card glass vx-v">${tog('tdpa','Tdpa en este embarazo')}${tog('flu','Influenza en esta temporada')}${tog('vsr','Virus sincitial respiratorio en este embarazo')}
      <label class="vx-l">Esquema de Td antes del embarazo<select data-s="td"><option value="">Incompleto o sin comprobante</option><option value="completo"${S.o.td==='completo'?' selected':''}>Completo</option></select></label>
      <label class="vx-l">Última dosis de COVID-19 (opcional)<input type="date" data-s="covid" value="${esc(S.o.covid||'')}" max="${iso(h)}"></label></div>
      <button class="cxb kz-next" id="vxGo">Ver qué le toca</button></div>`;
      const set=v=>{v=Math.max(4,Math.min(42,Math.round(v)));S.sdg=String(v);$('#vxSdg').value=S.sdg};
      $('#vxMn').onclick=()=>set((parseFloat(S.sdg)||20)-1);$('#vxMs').onclick=()=>set((parseFloat(S.sdg)||19)+1);$('#vxSdg').oninput=e=>S.sdg=e.target.value;
      bindO(el);$('#vxGo').onclick=()=>{const v=parseFloat(String(S.sdg).replace(',','.'));if(!(v>=4&&v<=42)){toast('Escribe semanas entre 4 y 42');return}G.go('herramientas-vacunas-emb-res')};return}
    const r=planEmb(sdg,S.o,h);
    el.innerHTML=`<div class="cx kz">${head(tit,`${esc(String(sdg))} semanas hoy · fecha probable de parto ${esc(fL(r.fpp))}.`)}<div class="kz-sum"><a href="#herramientas-vacunas-emb">Cambiar datos<i>Editar</i></a><a href="#herramientas-vacunas">Otro grupo<i>Cambiar</i></a></div>${grupos(r.L)}<p class="hint">Temporada invernal: de octubre a marzo. La fecha probable de parto se calcula sumando las semanas que faltan para la 40.</p>${fuenteHTML}</div>`;return}
  /* adolescentes y adultos */
  const rango={adol:[10,19],adulto:[20,59],mayor:[60,120]}[g];
  if(paso!=='res'){el.innerHTML=`<div class="cx kz">${head(tit,'Escribe la edad y marca lo que ya tiene según su cartilla.')}
    <p class="kz-q">¿Qué edad tiene?</p><div class="kz-kg"><button id="vxMn" aria-label="Un año menos">−</button><div><input id="vxEdad" inputmode="numeric" placeholder="0" value="${esc(S.o.edad||'')}" aria-label="Edad en años"><span>años</span></div><button id="vxMs" aria-label="Un año más">+</button></div>
    <div class="cx-card glass vx-v"><label class="vx-l">Sexo<select data-s="sexo"><option value="">Sin especificar</option><option${S.o.sexo==='Mujer'?' selected':''}>Mujer</option><option${S.o.sexo==='Hombre'?' selected':''}>Hombre</option></select></label>
    <label class="vx-l">Esquema de Td<select data-s="td"><option value="">Incompleto o sin comprobante</option><option value="completo"${S.o.td==='completo'?' selected':''}>Completo</option></select></label>
    <label class="vx-l">Última dosis de Td (opcional)<input type="date" data-s="tdF" value="${esc(S.o.tdF||'')}" max="${iso(h)}"></label>
    ${g!=='mayor'?`<label class="vx-l">Dosis previas de SRP o SR<select data-s="srp"><option value="0">Ninguna o sin comprobante</option><option value="1"${S.o.srp==='1'?' selected':''}>Una</option><option value="2"${S.o.srp==='2'?' selected':''}>Dos</option></select></label>`:''}
    ${tog('hepb','Ya tiene esquema de hepatitis B')}${g==='adol'?tog('vph','Ya tiene virus del papiloma humano'):''}${tog('comorb','Tiene comorbilidad (diabetes, enfermedad cardiaca, pulmonar o renal crónica, inmunosupresión, obesidad)')}
    ${g!=='mayor'?tog('vih','Vive con VIH'):''}${g!=='adol'?tog('riesgoHB','Grupo de riesgo para hepatitis B (personal de salud, enfermedad hepática o renal crónica, conductas de riesgo)'):''}${g!=='adol'?tog('dialisis','En diálisis'):''}${g==='mayor'?tog('neumo60','Ya recibió neumocócica a partir de los 60 años'):''}
    <label class="vx-l">Última dosis de COVID-19 (opcional)<input type="date" data-s="covid" value="${esc(S.o.covid||'')}" max="${iso(h)}"></label></div>
    <button class="cxb kz-next" id="vxGo">Ver qué le toca</button></div>`;
    const set=v=>{v=Math.max(rango[0],Math.min(rango[1],Math.round(v)));S.o.edad=String(v);$('#vxEdad').value=S.o.edad};
    $('#vxMn').onclick=()=>set((+S.o.edad||rango[0]+1)-1);$('#vxMs').onclick=()=>set((+S.o.edad||rango[0]-1)+1);$('#vxEdad').oninput=e=>S.o.edad=e.target.value;
    bindO(el);$('#vxGo').onclick=()=>{const e=+S.o.edad;if(!(e>=rango[0]&&e<=rango[1])){toast(`Escribe una edad de ${rango[0]} a ${rango[1]===120?'más':rango[1]} años`);return}G.go(`herramientas-vacunas-${g}-res`)};return}
  const edad=+S.o.edad;if(!(edad>=rango[0]&&edad<=rango[1])){G.go('herramientas-vacunas-'+g);return}
  const L=planMayores(edad,S.o,h);
  el.innerHTML=`<div class="cx kz">${head(tit,`${edad} años.`)}<div class="kz-sum"><a href="#herramientas-vacunas-${g}">Cambiar datos<i>Editar</i></a><a href="#herramientas-vacunas">Otro grupo<i>Cambiar</i></a></div>${L.length?grupos(L):'<div class="cx-card glass"><p class="cx-empty">Con los datos marcados no le toca ninguna vacuna del esquema por ahora.</p></div>'}${fuenteHTML}</div>`};
const bindO=el=>{el.querySelectorAll('[data-o]').forEach(c=>c.onchange=()=>{S.o[c.dataset.o]=c.checked});el.querySelectorAll('[data-s]').forEach(c=>c.oninput=c.onchange=()=>{S.o[c.dataset.s]=c.value})};

/* ---------- expediente: registro y pendientes ---------- */
const TODAS=[...NINOS.map(v=>[v.id,v.n,v.esp==='flu'?['1.ª dosis','2.ª dosis','Dosis anual']:v.dosis.map(d=>d.t)]),['vph','Virus del papiloma humano',['Dosis única','1.ª dosis','2.ª dosis','3.ª dosis']],['hepb','Hepatitis B (adolescentes y adultos)',['1.ª dosis','2.ª dosis','3.ª dosis']],['td','Td (tétanos y difteria)',['1.ª dosis','2.ª dosis','3.ª dosis','Refuerzo']],['tdpa','Tdpa (embarazo)',['Dosis del embarazo']],['sr','Doble viral (SR)',['1.ª dosis','2.ª dosis']],['neumoad','Neumocócica (adultos)',['Dosis única','1.ª dosis','2.ª dosis']],['vsr','Virus sincitial respiratorio (embarazo)',['Dosis única']],['covid','COVID-19',['Dosis']],['varicela','Varicela',['Dosis única']],['otra','Otra vacuna',['Dosis']]];
const NOM={};TODAS.forEach(([k,n])=>NOM[k]=n);
const apDe=P=>{const ap={};(P.vac||[]).slice().sort((a,b)=>(a.f||'').localeCompare(b.f||'')).forEach(x=>{const v=POR_ID[x.v];if(!v)return;(ap[x.v]=ap[x.v]||[]).push(x.f||'')});return ap};
const pendP=P=>{const h=hoyD(),hc=P.hc||{},fn=D0(hc.fnac);const out=[];
  if(fn&&fn<=h&&meses(fn,h)<120)planNinos(fn,h,apDe(P)).filter(x=>x.est==='hoy'||x.est==='consulta').forEach(x=>out.push(x));
  const tds=(P.vac||[]).filter(x=>x.v==='td'||x.v==='tdpa').map(x=>D0(x.f)).filter(Boolean).sort((a,b)=>b-a);
  const edad=fn?Math.floor(meses(fn,h)/12):+hc.edad_txt||null;
  if(edad>=15&&tds.length&&add(tds[0],{y:10})<=h)out.push({n:'Td (tétanos y difteria): refuerzo',est:'hoy',txt:'Última dosis hace más de 10 años.'});
  if(P.tipo==='e'&&!(P.vac||[]).some(x=>x.v==='tdpa'&&D0(x.f)&&(h-D0(x.f))<280*864e5))out.push({n:'Tdpa en este embarazo',est:'hoy',txt:'Desde la semana 20; de preferencia entre la 27 y la 36.'});
  return out};
const expHTML=P=>{const reg=(P.vac||[]).slice().sort((a,b)=>(b.f||'').localeCompare(a.f||'')),pe=pendP(P),fn=D0((P.hc||{}).fnac);
  return `<div class="cx-card glass vx-exp" style="margin-top:14px"><h3>Vacunas <small>${reg.length} ${reg.length===1?'dosis registrada':'dosis registradas'}</small></h3>
  ${pe.length?`<p class="lbl" style="margin:6px 0 0">Pendientes</p><div class="vx-list">${pe.map(itemHTML).join('')}</div>`:fn||P.tipo==='e'?'':'<p class="hint">Anota la fecha de nacimiento en la historia clínica para calcular las pendientes de niñas y niños.</p>'}
  ${reg.length?`<p class="lbl" style="margin:12px 0 0">Aplicadas</p><div class="vx-list">${reg.map((x,i)=>`<div class="vx-it" style="--c:#03aa49"><i></i><span><b>${esc(NOM[x.v]||x.n||'Vacuna')}${x.d?' · '+esc(x.d):''}</b><small>${esc(x.f?fL(D0(x.f)):'Sin fecha')}${x.lote?' · lote '+esc(x.lote):''}${x.sitio?' · '+esc(x.sitio):''}</small></span><button class="vx-del" data-vxdel="${esc(x.id)}" aria-label="Borrar registro">✕</button></div>`).join('')}</div>`:''}
  <div class="cx-row"><button class="cxb sm" id="vxAdd">Registrar vacuna</button><a class="cxb gris sm" href="#herramientas-vacunas">Ver esquema completo</a></div></div>`};
const bindExp=(P,el,put,redraw,openSheet,closeSheet)=>{const b=el.querySelector('#vxAdd');if(!b)return;
  el.querySelectorAll('[data-vxdel]').forEach(x=>x.onclick=()=>{P.vac=(P.vac||[]).filter(v=>v.id!==x.dataset.vxdel);put('pacientes',P);toast('Registro borrado');redraw()});
  b.onclick=()=>{openSheet('Registrar vacuna',`<div class="cx"><div class="fx">
    <div class="fw full"><label for="vxV">Vacuna</label><select id="vxV">${TODAS.map(([k,n])=>`<option value="${k}">${esc(n)}</option>`).join('')}</select></div>
    <div class="fw"><label for="vxD">Dosis</label><select id="vxD"></select></div>
    <div class="fw"><label for="vxF">Fecha de aplicación</label><input type="date" id="vxF" value="${iso(hoyD())}" max="${iso(hoyD())}"></div>
    <div class="fw"><label for="vxL">Lote (opcional)</label><input id="vxL" autocomplete="off"></div>
    <div class="fw"><label for="vxS">Sitio de aplicación (opcional)</label><input id="vxS" placeholder="Por ejemplo, deltoides izquierdo" autocomplete="off"></div>
    <div class="fw full" id="vxOtraW" hidden><label for="vxOtra">Nombre de la vacuna</label><input id="vxOtra" autocomplete="off"></div></div>
    <div class="cx-row"><button class="cxb" id="vxSave">Guardar</button></div></div>`);
    const sv=document.getElementById('vxV'),sd=document.getElementById('vxD');
    const fill=()=>{const r=TODAS.find(x=>x[0]===sv.value);sd.innerHTML=r[2].map(t=>`<option>${esc(t)}</option>`).join('');document.getElementById('vxOtraW').hidden=sv.value!=='otra'};sv.onchange=fill;fill();
    document.getElementById('vxSave').onclick=()=>{const f=document.getElementById('vxF').value;if(!f){toast('Escribe la fecha');return}
      const o={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),v:sv.value,d:sd.value,f,lote:document.getElementById('vxL').value.trim(),sitio:document.getElementById('vxS').value.trim()};
      if(o.v==='otra')o.n=document.getElementById('vxOtra').value.trim()||'Otra vacuna';
      P.vac=[...(P.vac||[]),o];put('pacientes',P);closeSheet();vib&&vib();toast('Vacuna registrada');redraw()}}};

window.VX={calc,expHTML,bindExp,pendP,planNinos,planEmb,planMayores,FUENTE};
})();
