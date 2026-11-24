/* GCHE2 · Panel: tarjeta de hoy (reloj, clima real y calendario), recientes, notas rápidas, temporizador,
   cuenta regresiva al ENARM, tu semana, perla y pregunta del día. Clima: Open-Meteo (gratuito, sin cuenta) con la ubicación del dispositivo. */
(()=>{
'use strict';
const g=()=>window.G;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={get:(k,d)=>g().store.get(k,d),set:(k,v)=>g().store.set(k,v)};
const iso=f=>`${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,'0')}-${String(f.getDate()).padStart(2,'0')}`;
const D0=s=>{const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d)};
const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const fLarga=f=>cap(f.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'}));
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const refresh=()=>{const G=g();G&&G.renderPanel&&G.renderPanel()};

/* ---------- clima ---------- */
const WMO=c=>c===0?['Despejado','sol']:c<=2?['Parcialmente nublado','parcial']:c===3?['Nublado','nube']:c<=48?['Niebla','niebla']:c<=57?['Llovizna','llovizna']:c<=67?['Lluvia','lluvia']:c<=77?['Nieve','nieve']:c<=82?['Chubascos','lluvia']:c<=86?['Nevadas','nieve']:['Tormenta eléctrica','tormenta'];
const ico=(k,noche,s=44)=>{const sol=`<g><circle cx="22" cy="20" r="8" fill="#ffb829"/><g stroke="#ffb829" stroke-width="2.4" stroke-linecap="round"><path d="M22 4v4M22 32v4M6 20h4M34 20h4M10.7 8.7l2.8 2.8M30.5 28.5l2.8 2.8M10.7 31.3l2.8-2.8M30.5 11.5l2.8-2.8"/></g></g>`;
  const luna=`<path d="M27 8a12 12 0 1 0 9 17 10 10 0 0 1-9-17z" fill="#ffd76a"/>`;
  const nube=(o=1)=>`<path d="M16 40h22a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-1 13z" fill="#c7d3e3" opacity="${o}"/>`;
  const gotas=`<g stroke="#2997ff" stroke-width="2.4" stroke-linecap="round"><path d="M20 44l-2 4M28 44l-2 4M36 44l-2 4"/></g>`;
  const ray=`<path d="M28 41l-4 7h5l-3 6" fill="none" stroke="#ffb829" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const nieve=`<g fill="#fff" stroke="#9fb3c8" stroke-width="1"><circle cx="20" cy="47" r="2"/><circle cx="28" cy="49" r="2"/><circle cx="36" cy="47" r="2"/></g>`;
  const astro=noche?luna:sol;
  const b={sol:astro,parcial:astro+nube(.95),nube:nube(),niebla:nube(.8)+'<g stroke="#9fb3c8" stroke-width="2.4" stroke-linecap="round"><path d="M10 46h30M14 51h26"/></g>',llovizna:nube()+gotas,lluvia:nube()+gotas,nieve:nube()+nieve,tormenta:nube()+ray}[k]||astro;
  return `<svg width="${s}" height="${s}" viewBox="0 0 52 56" aria-hidden="true">${b}</svg>`};
let wxBusy=false,wxErr='';
const wx=()=>st.get('gche2-wx',null);
const wxPedir=force=>{if(!st.get('gche2-wxok',false)||wxBusy)return;const d=wx();if(!force&&d&&Date.now()-d.t<30*60e3)return;
  if(!navigator.geolocation){if(force)g().toast('Este dispositivo no da ubicación');return}
  wxBusy=true;
  navigator.geolocation.getCurrentPosition(async p=>{try{const la=+p.coords.latitude.toFixed(3),lo=+p.coords.longitude.toFixed(3);
      const u=`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;
      const j=await (await fetch(u)).json();if(!j||!j.current)throw new Error('sin datos');
      let city=d&&d.city&&Math.abs(d.la-la)<.05&&Math.abs(d.lo-lo)<.05?d.city:'';
      if(!city){try{const c=await (await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${la}&longitude=${lo}&localityLanguage=es`)).json();city=c.city||c.locality||c.principalSubdivision||''}catch(e){}}
      st.set('gche2-wx',{t:Date.now(),la,lo,city,j});wxBusy=false;wxErr='';refresh();if(document.getElementById('wxS'))wxSheet();return}catch(e){wxErr='No se pudo cargar el clima; revisa tu conexión a internet.';if(force)g().toast(wxErr)}
    wxBusy=false;const w=document.getElementById('wxS');if(w&&!wx())w.textContent=wxErr},
  err=>{wxBusy=false;if(err&&err.code===1){st.set('gche2-wxok',false);g().toast('Sin permiso de ubicación. Actívalo en los permisos del navegador para ver el clima');refresh()}else{wxErr='No se pudo obtener tu ubicación.';if(force)g().toast(wxErr)}const w=document.getElementById('wxS');if(w&&!wx())w.textContent=wxErr},
  {maximumAge:30*60e3,timeout:20000,enableHighAccuracy:false})};
const wxActivar=()=>{st.set('gche2-wxok',true);g().toast('Buscando tu ubicación…');wxPedir(true)};
setInterval(()=>wxPedir(false),10*60e3);document.addEventListener('visibilitychange',()=>{if(!document.hidden)wxPedir(false)});
const wxMini=()=>{const d=wx();
  if(!st.get('gche2-wxok',false))return `<span class="hoy-wx off" data-wxon role="button" tabindex="0">${ico('parcial',false,34)}<span><b>Clima</b><small>Toca para activar</small></span></span>`;
  if(!d)return wxErr?`<span class="hoy-wx off" data-wx role="button" tabindex="0">${ico('nube',false,34)}<span><b>Clima</b><small>Sin conexión</small></span></span>`:`<span class="hoy-wx" data-wx><span class="sk" style="width:90px;height:34px"></span></span>`;
  const c=d.j.current,[t,k]=WMO(c.weather_code),dl=d.j.daily;
  return `<span class="hoy-wx" data-wx role="button" tabindex="0" aria-label="Clima: ${Math.round(c.temperature_2m)} grados, ${t}">${ico(k,!c.is_day,40)}<span><b>${Math.round(c.temperature_2m)}°</b><small>Máx ${Math.round(dl.temperature_2m_max[0])}° · Mín ${Math.round(dl.temperature_2m_min[0])}°</small></span></span>`};
const wxSheet=()=>{const d=wx(),G=g();
  if(!st.get('gche2-wxok',false)){G.openSheet('Clima',`<p>El clima usa la ubicación de este dispositivo y el servicio gratuito Open-Meteo. La ubicación no se guarda en ningún servidor de GCHE2.</p><div class="cx-row"><button class="cxb" id="wxOn">Activar clima</button></div>`);document.getElementById('wxOn').onclick=()=>{G.closeSheet();wxActivar()};return}
  if(!d){G.openSheet('Clima',`<p id="wxS">${wxBusy?'Cargando el clima…':esc(wxErr||'Cargando el clima…')}</p><div class="cx-row"><button class="cxb gris sm" id="wxUp">Reintentar</button></div>`);document.getElementById('wxUp').onclick=()=>{document.getElementById('wxS').textContent='Cargando el clima…';wxPedir(true)};if(!wxBusy&&!wxErr)wxPedir(true);return}
  const c=d.j.current,[t,k]=WMO(c.weather_code),h=d.j.hourly,dl=d.j.daily,now=Date.now();
  const i0=Math.max(0,h.time.findIndex(x=>new Date(x).getTime()>=now-36e5));
  const horas=h.time.slice(i0,i0+24).map((x,n)=>{const i=i0+n,[,kk]=WMO(h.weather_code[i]);return `<div class="wx-h"><small>${n?new Date(x).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false}):'Ahora'}</small>${ico(kk,!h.is_day[i],30)}<b>${Math.round(h.temperature_2m[i])}°</b><small class="pp">${h.precipitation_probability[i]!=null&&h.precipitation_probability[i]>=20?h.precipitation_probability[i]+'%':''}</small></div>`}).join('');
  const lo=Math.min(...dl.temperature_2m_min),hi=Math.max(...dl.temperature_2m_max);
  const dias=dl.time.map((x,i)=>{const [tt,kk]=WMO(dl.weather_code[i]),a=dl.temperature_2m_min[i],b=dl.temperature_2m_max[i];return `<div class="wx-d"><b>${i?cap(DIAS[D0(x).getDay()]):'Hoy'}</b>${ico(kk,false,28)}<small class="pp">${dl.precipitation_probability_max[i]>=20?dl.precipitation_probability_max[i]+'%':''}</small><span>${Math.round(a)}°</span><i class="wx-bar"><i style="left:${(a-lo)/(hi-lo||1)*100}%;right:${100-(b-lo)/(hi-lo||1)*100}%"></i></i><span>${Math.round(b)}°</span></div>`}).join('');
  G.openSheet(d.city?`Clima en ${d.city}`:'Clima',`<div id="wxS" class="wx-now">${ico(k,!c.is_day,64)}<div><b>${Math.round(c.temperature_2m)}°</b><span>${esc(t)}</span><small>Se siente como ${Math.round(c.apparent_temperature)}° · humedad ${c.relative_humidity_2m}% · viento ${Math.round(c.wind_speed_10m)} kilómetros por hora</small></div></div>
   <p class="lbl" style="margin:14px 0 6px">Por hora</p><div class="wx-hs">${horas}</div>
   <p class="lbl" style="margin:16px 0 6px">Próximos días</p><div class="wx-ds">${dias}</div>
   <p class="hint" style="margin-top:12px">Datos de Open-Meteo · actualizado a las ${new Date(d.t).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false})}</p>
   <div class="cx-row"><button class="cxb gris sm" id="wxUp">Actualizar</button></div>`);
  document.getElementById('wxUp').onclick=()=>{g().toast('Actualizando…');wxPedir(true)}};

/* ---------- tarjeta de hoy: reloj, clima y calendario ---------- */
let mesOf=0;
const citasDe=isoD=>{try{return window.CX&&CX.col?CX.col('citas').filter(c=>c.fecha===isoD&&c.estado!=='cancelada').sort((a,b)=>(a.hora||'').localeCompare(b.hora||'')):[]}catch(e){return[]}};
const bloquesDe=f=>{try{return window.EX&&EX.deDia?EX.deDia(f):[]}catch(e){return[]}};
const calHTML=()=>{const now=new Date(),base=new Date(now.getFullYear(),now.getMonth()+mesOf,1),y=base.getFullYear(),m=base.getMonth(),first=(base.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),hoyI=iso(now);
  let c=['L','M','M','J','V','S','D'].map(x=>`<span class="wd">${x}</span>`).join('');for(let i=0;i<first;i++)c+='<span></span>';
  for(let d=1;d<=days;d++){const f=new Date(y,m,d),k=iso(f),ci=citasDe(k).length,bl=bloquesDe(f).length;
    c+=`<span class="dd${k===hoyI?' hoy':''}" data-day="${k}" role="button" tabindex="0" aria-label="${d}${ci?`, ${ci} citas`:''}${bl?`, ${bl} bloques`:''}">${d}${ci||bl?`<i>${ci?'<em class="c"></em>':''}${bl?'<em class="b"></em>':''}</i>`:''}</span>`}
  const mes=cap(base.toLocaleDateString('es-MX',{month:'long',year:'numeric'}));
  return `<div class="hoy-mh"><span data-mes="-1" role="button" tabindex="0" aria-label="Mes anterior">‹</span><b>${esc(mes)}</b><span data-mes="1" role="button" tabindex="0" aria-label="Mes siguiente">›</span></div><div class="hoy-g">${c}</div>
  <small class="hoy-ley"><em class="c"></em>Citas <em class="b"></em>Estudio o guardia</small>`};
const hoyCard=()=>{const now=new Date();
  return `<div class="hoy"><div class="hoy-top"><span class="hoy-clk"><b id="hoyH">${now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false})}</b><small>${esc(fLarga(now))}</small></span>${wxMini()}</div>
  <div class="hoy-cal" id="hoyCal">${calHTML()}</div></div>`};
/* cambiar de mes: solo se reemplaza el calendario, el resto del panel queda quieto */
const cambiaMes=d=>{mesOf+=d;const el=document.getElementById('hoyCal');if(!el){refresh();return}
  el.innerHTML=calHTML();const gr=el.querySelector('.hoy-g');if(gr&&!document.documentElement.classList.contains('reduce')){gr.classList.remove('mv-l','mv-r');void gr.offsetWidth;gr.classList.add(d>0?'mv-r':'mv-l')}};
const diaSheet=k=>{const f=D0(k),ci=citasDe(k),bl=bloquesDe(f),G=g();
  const dn=n=>{try{return st.get('gche2-disc',false)?String(n||'').trim().split(/\s+/).map(w=>w[0]?w[0].toUpperCase()+'.':'').join(' '):n}catch(e){return n}};
  G.openSheet(fLarga(f),`<p class="lbl" style="margin:4px 0 6px">Citas</p>${ci.length?`<div class="nlist">${ci.map(c=>`<button data-cxh="consultas-0"><i style="background:#0071e3"></i><span><b style="font-size:15px">${esc(c.hora||'Sin hora')} · ${esc(dn(c.nombre||'Sin nombre'))}</b><small>${esc(c.motivo||'')}</small></span></button>`).join('')}</div>`:'<p class="hint">Sin citas.</p>'}
  <p class="lbl" style="margin:14px 0 6px">Estudio, clases y guardias</p>${bl.length?`<div class="nlist">${bl.map(b=>`<button data-cxh="estudio-0"><i style="background:${b.color}"></i><span><b style="font-size:15px">${esc(b.hora)} · ${b.titulo}</b><small>${esc(b.tipo)}${b.tema?' · '+b.tema:''}</small></span></button>`).join('')}</div>`:'<p class="hint">Sin bloques.</p>'}
  <div class="cx-row"><button class="cxb sm" data-cxh="consultas-0">Abrir agenda</button><button class="cxb gris sm" data-cxh="estudio-0">Calendario de estudio</button></div>`)};
const tickHoy=()=>{const e=document.getElementById('hoyH');if(e)e.textContent=new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false})};

/* ---------- recientes ---------- */
const visto=(h,t)=>{if(!h||h==='inicio'||!t)return;let L=st.get('gche2-vistos',[]).filter(x=>x.h!==h);L.unshift({h,t:String(t).slice(0,80),ts:Date.now()});st.set('gche2-vistos',L.slice(0,12))};
const recientes=()=>{const L=st.get('gche2-vistos',[]).filter(x=>!/^consultas-p-/.test(x.h)||!st.get('gche2-disc',false)).slice(0,4);
  return L.length?`<div class="px-list">${L.map(x=>`<span class="px-row" data-go="${esc(x.h)}" role="button" tabindex="0"><b>${esc(x.t)}</b><small>${esc(hace(x.ts))}</small></span>`).join('')}</div>`:'<p class="px-vacio">Aquí aparece lo último que abras.</p>'};
const hace=ts=>{const m=Math.round((Date.now()-ts)/6e4);return m<1?'Ahora':m<60?`Hace ${m} min`:m<1440?`Hace ${Math.round(m/60)} h`:`Hace ${Math.round(m/1440)} d`};

/* ---------- notas rápidas ---------- */
const notas=()=>st.get('gche2-qnotas',[]);
const notasCard=()=>{const L=notas();return L.length?`<div class="px-list">${L.slice(0,3).map(n=>`<span class="px-row"><b>${esc(n.t.split('\n')[0])}</b><small>${esc(hace(n.ts))}</small></span>`).join('')}</div>${L.length>3?`<small class="px-mas">${L.length-3} más</small>`:''}`:'<p class="px-vacio">Toca para escribir una nota.</p>'};
const notasSheet=()=>{const G=g(),draw=()=>{const L=notas();document.getElementById('nqL').innerHTML=L.length?L.map(n=>`<div class="nq"><p>${esc(n.t).replace(/\n/g,'<br>')}</p><small>${esc(new Date(n.ts).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))}</small><button class="vx-del" data-nqd="${n.id}" aria-label="Borrar nota">✕</button></div>`).join(''):'<p class="hint">Sin notas.</p>'};
  G.openSheet('Notas rápidas',`<div class="cx"><textarea id="nqT" rows="3" placeholder="Escribe una nota…"></textarea><div class="cx-row"><button class="cxb" id="nqG">Guardar nota</button></div><div id="nqL" style="margin-top:12px"></div><p class="hint">Se guardan solo en este dispositivo. No escribas datos de pacientes aquí.</p></div>`);
  draw();const t=document.getElementById('nqT');
  document.getElementById('nqG').onclick=()=>{const v=t.value.trim();if(!v){t.focus();return}st.set('gche2-qnotas',[{id:Date.now().toString(36),t:v,ts:Date.now()},...notas()].slice(0,100));t.value='';draw();refresh();g().vib&&g().vib()};
  document.getElementById('nqL').onclick=e=>{const b=e.target.closest('[data-nqd]');if(!b)return;st.set('gche2-qnotas',notas().filter(n=>n.id!==b.dataset.nqd));draw();refresh()}};

/* ---------- temporizador ---------- */
const TM=()=>st.get('gche2-timer',{dur:25*60,end:0,rem:25*60});
const restante=t=>t.end?Math.max(0,Math.round((t.end-Date.now())/1000)):t.rem;
const mmss=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const ring=(t,sz=120)=>{const r=restante(t),C=2*Math.PI*52,f=t.dur?r/t.dur:0;return `<div class="tring" style="width:${sz}px;height:${sz}px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" stroke="var(--ctrl)"/><circle class="tg" cx="60" cy="60" r="52" style="stroke-dasharray:${C};stroke-dashoffset:${C*(1-f)}"/></svg><b class="tmT">${mmss(r)}</b></div>`};
const timerCard=()=>{const t=TM();return `${ring(t,104)}<small class="px-mas" style="text-align:center;display:block">${t.end?'En marcha':restante(t)<t.dur?'En pausa':'Toca para empezar'}</small>`};
let aud=null;const beep=()=>{try{aud=aud||new (window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(d=>{const o=aud.createOscillator(),v=aud.createGain();o.frequency.value=880;v.gain.setValueAtTime(.0001,aud.currentTime+d);v.gain.exponentialRampToValueAtTime(.3,aud.currentTime+d+.02);v.gain.exponentialRampToValueAtTime(.0001,aud.currentTime+d+.28);o.connect(v).connect(aud.destination);o.start(aud.currentTime+d);o.stop(aud.currentTime+d+.3)})}catch(e){}};
const fin=()=>{const t=TM();st.set('gche2-timer',{dur:t.dur,end:0,rem:t.dur});beep();try{navigator.vibrate&&navigator.vibrate([300,150,300,150,300])}catch(e){}g().toast('Terminó el temporizador');
  try{if(window.Notification&&Notification.permission==='granted')navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.showNotification('GCHE2',{body:'Terminó el temporizador',tag:'gche2-timer'}))}catch(e){}refresh();if(document.getElementById('tmS'))timerSheet()};
setInterval(()=>{const t=TM();if(t.end&&Date.now()>=t.end)fin();const r=restante(t);document.querySelectorAll('.tmT').forEach(e=>e.textContent=mmss(r));
  const C=2*Math.PI*52;document.querySelectorAll('.tring .tg').forEach(c=>c.style.strokeDashoffset=C*(1-(t.dur?r/t.dur:0)));
  const tb=document.querySelector('#bTimer span');if(tb)tb.textContent=mmss(r);tickHoy()},1000);
const timerSheet=()=>{const t=TM(),G=g(),corre=!!t.end;
  G.openSheet('Temporizador',`<div id="tmS" style="display:grid;place-items:center">${ring(t,180)}</div>
   <div class="chips" style="justify-content:center;margin-top:14px">${[5,10,15,25,45,60].map(m=>`<button class="chip${t.dur===m*60?' on':''}" data-tm="${m}">${m} min</button>`).join('')}</div>
   <div class="cx-row" style="justify-content:center"><button class="cxb" id="tmGo">${corre?'Pausar':restante(t)<t.dur?'Continuar':'Empezar'}</button><button class="cxb gris" id="tmR">Reiniciar</button></div>
   <p class="hint" style="text-align:center">Al terminar suena, vibra y avisa aunque cambies de pantalla.</p>`);
  document.querySelectorAll('[data-tm]').forEach(b=>b.onclick=()=>{const d=+b.dataset.tm*60;st.set('gche2-timer',{dur:d,end:0,rem:d});timerSheet();refresh()});
  document.getElementById('tmGo').onclick=()=>{const t=TM();if(t.end)st.set('gche2-timer',{dur:t.dur,end:0,rem:restante(t)});else{st.set('gche2-timer',{dur:t.dur,end:Date.now()+restante(t)*1000,rem:0});try{aud=aud||new (window.AudioContext||window.webkitAudioContext)();if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}}timerSheet();refresh()};
  document.getElementById('tmR').onclick=()=>{const t=TM();st.set('gche2-timer',{dur:t.dur,end:0,rem:t.dur});timerSheet();refresh()}};

/* ---------- cuenta regresiva al ENARM ---------- */
const enarmCard=()=>{const v=st.get('gche2-enarm','');if(!v)return '<p class="px-vacio">Toca para poner la fecha del examen.</p>';
  const ms=new Date(v).getTime()-Date.now();if(ms<=0)return '<p class="px-vacio">La fecha ya pasó. Toca para cambiarla.</p>';
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);
  return `<div class="count"><b>${d}<small>Días</small></b><b>${h}<small>Horas</small></b><b>${m}<small>Min</small></b></div><small class="px-mas">${esc(cap(new Date(v).toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'})))}</small>`};
const enarmSheet=()=>{const G=g(),v=st.get('gche2-enarm','');const [f,h]=v?v.split('T'):['','08:00'];
  G.openSheet('Fecha del ENARM',`<div class="cx"><div class="fx"><div class="fw"><label for="enF">Fecha</label><input type="date" id="enF" value="${esc(f)}"></div><div class="fw"><label for="enH">Hora</label><input type="time" id="enH" value="${esc(h||'08:00')}"></div></div>
   <p class="hint">Examen Nacional de Aspirantes a Residencias Médicas. Consulta la fecha oficial en la convocatoria de la Comisión Interinstitucional para la Formación de Recursos Humanos para la Salud.</p>
   <div class="cx-row"><button class="cxb" id="enG">Guardar</button>${v?'<button class="cxb gris" id="enB">Quitar fecha</button>':''}</div></div>`);
  document.getElementById('enG').onclick=()=>{const a=document.getElementById('enF').value;if(!a){g().toast('Escribe la fecha');return}st.set('gche2-enarm',`${a}T${document.getElementById('enH').value||'08:00'}`);G.closeSheet();refresh();g().toast('Fecha guardada')};
  const b=document.getElementById('enB');if(b)b.onclick=()=>{st.set('gche2-enarm','');G.closeSheet();refresh()}};

/* ---------- tu semana ---------- */
const semanaCard=()=>{const now=new Date(),L=new Date(now);L.setHours(0,0,0,0);L.setDate(L.getDate()-((L.getDay()+6)%7));
  let tot=0,hecho=0,cit=0;
  for(let i=0;i<7;i++){const f=new Date(L);f.setDate(L.getDate()+i);bloquesDe(f).filter(b=>b.k==='estudio'||b.k==='clase').forEach(b=>{tot+=b.dur;const ini=new Date(f);ini.setHours(b.i,0,0,0);const fn=ini.getTime()+b.dur*36e5;hecho+=Math.max(0,Math.min(b.dur,(Date.now()-ini.getTime())/36e5))*(Date.now()>ini.getTime()?1:0);void fn});cit+=citasDe(iso(f)).length}
  let con=0;try{const a=L.getTime();con=window.CX&&CX.col?CX.col('consultas').filter(c=>{const t=new Date(c.fecha||0).getTime();return t>=a&&t<a+7*864e5}).length:0}catch(e){}
  const pct=tot?hecho/tot:0,C=2*Math.PI*36;
  return `<div class="px-sem"><div class="tring" style="width:88px;height:88px"><svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="36" stroke="var(--ctrl)"/><circle class="tg" cx="44" cy="44" r="36" style="stroke:#8668ff;stroke-dasharray:${C};stroke-dashoffset:${C*(1-pct)}"/></svg><b style="font-size:17px">${Math.round(pct*100)}%</b></div>
   <div><span><b>${Math.round(hecho)} de ${Math.round(tot)} h</b><small>Estudio y clases de la semana</small></span><span><b>${con}</b><small>Consultas esta semana</small></span><span><b>${cit}</b><small>Citas en la semana</small></span></div></div>`};

/* ---------- perla y pregunta del día (de tus temas de Estudio) ---------- */
const diaN=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const temas=()=>{const T=window.SXTEMAS||{};return Object.keys(T).map(k=>[k,T[k]])};
const perla=()=>{const all=temas().flatMap(([k,t])=>(t.perlas||[]).map(p=>[t.titulo,p]));if(!all.length)return null;return all[diaN()%all.length]};
const perlaCard=()=>{const p=perla();return p?`<p class="px-txt">${md(p[1])}</p><small class="px-mas">${esc(p[0])}</small>`:'<p class="px-vacio">Aparece cuando tengas temas armados en Estudio.</p>'};
const pregunta=()=>{const all=temas().flatMap(([k,t])=>(t.preguntas||[]).map(q=>[t.titulo,q]));if(!all.length)return null;return all[(diaN()*7)%all.length]};
const preguntaCard=()=>{const p=pregunta();return p?`<p class="px-txt">${esc(p[1].p)}</p><small class="px-mas">${esc(p[0])} · toca para responder</small>`:'<p class="px-vacio">Aparece cuando tengas temas armados en Estudio.</p>'};
const preguntaSheet=()=>{const p=pregunta(),G=g();if(!p){G.openSheet('Pregunta del día','<p>Aún no hay preguntas. Se llenan conforme armas temas en Estudio.</p>');return}
  const q=p[1];G.openSheet('Pregunta del día',`<p class="hint" style="margin-top:0">${esc(p[0])}</p>${q.c?`<p>${esc(q.c)}</p>`:''}<p><b>${esc(q.p)}</b></p><div class="pq">${q.o.map((o,i)=>`<button class="pq-o" data-o="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}</div><div id="pqR"></div>`);
  document.querySelectorAll('.pq-o').forEach(b=>b.onclick=()=>{const i=+b.dataset.o;document.querySelectorAll('.pq-o').forEach(x=>{x.disabled=true;const j=+x.dataset.o;x.classList.toggle('ok',j===q.r);x.classList.toggle('no',j===i&&i!==q.r)});
    document.getElementById('pqR').innerHTML=`<p class="pq-r ${i===q.r?'ok':'no'}"><b>${i===q.r?'Correcto.':'Incorrecto.'}</b> ${esc(q.e||'')}</p>${q.f?`<p class="hint">Fuente: ${esc(q.f)}</p>`:''}`;g().vib&&g().vib()})};

/* ---------- avisos (resumen) ---------- */
const avisosCard=()=>{let ci=0,pe=0;try{ci=citasDe(iso(new Date())).length}catch(e){}
  try{const d=document.createElement('div');d.innerHTML=window.CX?CX.avisos():'';pe=d.querySelectorAll('.nlist button').length}catch(e){}
  return `<div class="count"><b>${ci}<small>Citas hoy</small></b><b>${pe}<small>Avisos</small></b></div>`};

window.PX={hoyCard,wxSheet,wxActivar,diaSheet,mes:cambiaMes,visto,recientes,notasCard,notasSheet,timerCard,timerSheet,enarmCard,enarmSheet,semanaCard,perlaCard,preguntaCard,preguntaSheet,avisosCard,wxPedir};
setTimeout(()=>wxPedir(false),3000);
})();
