/* GCHE2 · Resúmenes ilustrados e interactivos de Estudio.
   Cada tema ilustrado se registra en window.SXILU con la misma clave que window.SXTEMAS
   (slug de la materia y número de capítulo). estudio-libros.js lo muestra en la pestaña Resumen
   y deja el resumen en texto completo debajo, plegado.
   Ilustraciones dibujadas para la app (sin imágenes con derechos de autor). */
(function(){
document.head.insertAdjacentHTML('beforeend',`<style>.sxi{--blue:#0071e3;--blue2:color-mix(in srgb,#0071e3 11%,transparent);--card:var(--solid);--ok:#0a9f4a;--okb:color-mix(in srgb,#0a9f4a 12%,transparent);--no:#d93a3f;--nob:color-mix(in srgb,#d93a3f 11%,transparent);--mid:#c77a00;--midb:color-mix(in srgb,#e39500 14%,transparent);--rosa:#d65a68;--rosab:color-mix(in srgb,#d65a68 10%,transparent);--vio:#7a5af5;--viob:color-mix(in srgb,#7a5af5 12%,transparent);--teal:#00879a;--tealb:color-mix(in srgb,#00a1b3 12%,transparent);--piel:#f2cdb2;--pielL:#e2b394;--aire:#dfeaf5;--sombra:0 1px 2px rgba(0,0,0,.05);display:grid;gap:14px}
:root.dark .sxi{--piel:#c99b7d;--pielL:#ab7f62;--aire:#22323f;--sombra:none}
.sxi .scard{scroll-margin-top:90px}
.sxi .snav{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.sxi .snav button{flex:none;font-size:14px;padding:8px 13px;min-height:40px;border-radius:999px;border:1px solid var(--line);background:var(--ctrl);cursor:pointer}
.sxi a.ir,.sxi button.ir{color:var(--blue);font-weight:600;background:none;border:0;padding:8px 0;cursor:pointer;font-size:16px}
.sxi details.texto{border-radius:20px;padding:12px 16px}.sxi details.texto summary{cursor:pointer;font-weight:600;min-height:32px}
@keyframes sxiresp{0%,100%{transform:scale(.92)}50%{transform:scale(1.04)}}
.sxi .scard{background:var(--card);border-radius:22px;padding:clamp(16px,3vw,26px);box-shadow:var(--sombra);border:1px solid var(--line);scroll-margin-top:150px}.sxi h2{font-size:clamp(21px,3vw,26px);line-height:1.15;margin:6px 0 8px;letter-spacing:-.01em;text-wrap:balance}.sxi h3{font-size:17px;margin:14px 0 6px}.sxi p{margin:6px 0}.sxi .muted{color:var(--ink2);font-size:14px}.sxi .tag{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:600;padding:3px 9px;border-radius:999px;margin:0 4px 4px 0}.sxi .t-dia{background:var(--blue2);color:var(--blue)}.sxi .t-tar{background:var(--tealb);color:var(--teal)}.sxi .t-foto{background:var(--midb);color:var(--mid)}.sxi .t-lib{background:var(--viob);color:var(--vio)}.sxi .t-int{background:var(--okb);color:var(--ok)}.sxi .leyenda{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.sxi .duo{display:grid;gap:16px;grid-template-columns:minmax(0,1fr)}@media(min-width:760px){.sxi .duo{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:start}}.sxi .ilu{background:var(--rosab);border-radius:18px;padding:10px;position:relative}.sxi .ilu svg{display:block;width:100%;height:auto}.sxi .seg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.sxi .seg button{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--ctrl);font-size:15px;font-weight:500;cursor:pointer}.sxi .seg button[aria-pressed=true]{background:var(--blue);border-color:var(--blue);color:#fff}.sxi .spanel{border-radius:16px;padding:14px 16px;background:var(--ctrl)}.sxi .spanel b{font-weight:650}.sxi .sgrid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))}.sxi .sem{border-radius:16px;padding:14px;border:1px solid var(--line);cursor:pointer;text-align:left;background:var(--card);min-height:44px}.sxi .sem .st{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:3px 9px;border-radius:999px}.sxi .sem h4{margin:8px 0 2px;font-size:16px}.sxi .sem p{font-size:14px;color:var(--ink2)}.sxi .sem .mas{display:none;font-size:14px;margin-top:8px;color:var(--ink)}.sxi .sem[aria-expanded=true] .mas{display:block}.sxi .si{background:var(--okb);color:var(--ok)}.sxi .no{background:var(--nob);color:var(--no)}.sxi .dep{background:var(--midb);color:var(--mid)}.sxi .ico{width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sxi .lista{list-style:none;padding:0;margin:8px 0;display:grid;gap:8px}.sxi .lista li{display:flex;gap:10px;align-items:flex-start}.sxi .lista .sic{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;flex:none}.sxi .crit{display:grid;gap:8px}.sxi .crit label{display:flex;align-items:center;gap:12px;min-height:52px;padding:8px 14px;border-radius:14px;background:var(--ctrl);cursor:pointer;font-weight:500}.sxi .crit input{width:22px;height:22px;accent-color:var(--blue);flex:none}.sxi .crit .ico{flex:none}.sxi .crit .pt{margin-left:auto;font-size:14px;color:var(--ink2);white-space:nowrap}.sxi .res{display:flex;gap:14px;align-items:center;border-radius:18px;padding:14px 16px;margin-top:10px}.sxi .res .sn{font-size:clamp(44px,8vw,60px);font-weight:800;line-height:1;letter-spacing:-.03em;min-width:1.2em;text-align:center}.sxi .barra{display:flex;gap:3px;margin:10px 0 0}.sxi .barra i{flex:1;height:8px;border-radius:4px;background:var(--line)}.sxi .dosis{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));margin-top:12px}.sxi .dc{border-radius:16px;padding:14px;border:1px solid var(--line);background:var(--card)}.sxi .dc h4{margin:0 0 2px;font-size:16px;display:flex;gap:8px;align-items:center}.sxi .dc .sbig{font-size:24px;font-weight:750;letter-spacing:-.02em;margin:4px 0;white-space:nowrap}.sxi .dc .sub{font-size:14px;color:var(--ink2)}.sxi .campos{display:flex;flex-wrap:wrap;gap:10px;align-items:end}.sxi .campos label{display:grid;gap:4px;font-size:14px;color:var(--ink2);font-weight:500}.sxi input[type=number],.sxi select{font:inherit;font-size:17px;min-height:46px;padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--ctrl);color:var(--ink);width:150px}.sxi select{width:auto}.sxi .foto{margin:0;border-radius:16px;overflow:hidden;background:var(--ctrl);border:1px solid var(--line)}.sxi .foto img{display:block;width:100%;height:auto;background:#222}.sxi .foto figcaption{padding:10px 14px 12px;font-size:15px}.sxi .foto small{display:block;font-size:12.5px;color:var(--ink2);margin-top:6px}.sxi .foto a{color:var(--blue)}.sxi .slot{border:2px dashed var(--line);border-radius:18px;padding:14px;display:flex;gap:14px;align-items:center}.sxi .slot .marco{width:96px;height:96px;border-radius:14px;display:grid;place-items:center;flex:none}.sxi .slot.foto .marco{background:var(--midb);color:var(--mid)}.sxi .slot.lib .marco{background:var(--viob);color:var(--vio)}.sxi .slot .marco .ico{width:40px;height:40px;stroke-width:1.6}.sxi .slot b{display:block}.sxi .slot small{display:block;color:var(--ink2);font-size:13px;margin-top:4px}.sxi .linea{margin:10px 0 4px;display:grid;gap:10px}.sxi .linea .fil small{display:block;font-size:14px;font-weight:600;margin-bottom:4px}.sxi .linea .pista{position:relative;height:12px;border-radius:6px;background:var(--ctrl)}.sxi .linea .pista i{position:absolute;top:0;bottom:0;border-radius:6px}.sxi .linea .ej{position:relative;height:20px;border-top:2px solid var(--line);margin-top:2px}.sxi .linea .mk{position:absolute;top:2px;font-size:13px;color:var(--ink2);transform:translateX(-50%);white-space:nowrap}.sxi .linea .mk:first-child{transform:none}.sxi .linea .mk:last-child{transform:translateX(-100%)}.sxi .flip{perspective:900px;min-height:150px;cursor:pointer;border:0;background:none;padding:0;text-align:left}.sxi .flip .in{position:relative;width:100%;height:100%;min-height:150px;transition:transform .5s var(--e,ease);transform-style:preserve-3d}.sxi .flip[aria-pressed=true] .in{transform:rotateY(180deg)}.sxi .flip .cara{position:absolute;inset:0;border-radius:16px;padding:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--line)}.sxi .flip .frente{background:var(--blue2)}.sxi .flip .bk{background:var(--card);transform:rotateY(180deg)}.sxi .flip .frente b{font-size:18px;line-height:1.25}.sxi .flip small{color:var(--ink2);font-size:13px}.sxi .algo{display:grid;gap:6px;margin-top:10px}.sxi .algo .nodo{border-radius:14px;padding:10px 14px;background:var(--ctrl);display:flex;justify-content:space-between;gap:10px;font-size:15px}.sxi .algo .nodo.on{background:var(--blue2);color:var(--ink)}.sxi .algo .flecha{height:16px;width:2px;background:var(--line);margin-left:24px}.sxi .fin{border-radius:16px;padding:14px 16px;margin-top:6px}.sxi .scmp{display:grid;gap:10px}.sxi .scmp .fila{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}@media(min-width:640px){.sxi .scmp .fila{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}.sxi .scmp .c{border-radius:14px;padding:12px 14px;font-size:15px}.sxi .scmp .c small{display:block;font-weight:700;font-size:13px;margin-bottom:4px}.sxi .pulso{transform-origin:center;transform-box:fill-box;animation:sxipul 2.2s ease-in-out infinite}@keyframes sxipul{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.05;transform:scale(1.7)}}.sxi .resp{transform-origin:center;transform-box:fill-box}@media(prefers-reduced-motion:reduce){.sxi .pulso,.sxi .resp{animation:none!important}.sxi .flip .in{transition:none}}.sxi .hs{cursor:pointer}.sxi .nota{font-size:13px;color:var(--ink2);margin-top:8px}.sxi strong{font-weight:650}</style>`);
const ILU=window.SXILU=window.SXILU||{};
ILU['enfermedades-infecciosas-6']={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol>
<symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol>
<symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol>
<symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol>
<symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol>
<symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol>
<symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
<symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol>
<symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
<symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol>
<symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol>
<symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol>
<symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol>
<symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol>
<symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol>
<symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol>
<symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol>
<symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol>
<symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol>
<symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol>
<symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol>
<symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol>
</svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="mapa">Mapa</button><button type="button" data-ir="antibiotico">¿Antibiótico?</button><button type="button" data-ir="resfriado">Resfriado</button><button type="button" data-ir="faringe">Faringe</button><button type="button" data-ir="centor">Centor</button><button type="button" data-ir="dosis">Dosis</button><button type="button" data-ir="complicaciones">Complicaciones</button><button type="button" data-ir="oido">Oído</button><button type="button" data-ir="senos">Senos</button><button type="button" data-ir="influenza">Influenza</button><button type="button" data-ir="alarma">Alarma</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav>
<section class="scard glass" id="sxi-mapa">

<h2>Toca dónde está la infección</h2>
<div class="duo">
<div class="ilu" style="background:var(--aire)"><svg id="sxi-cabeza" viewBox="0 0 380 300" role="img" aria-label="Corte de cabeza con nariz, senos paranasales, oído medio y amígdalas"></svg></div>
<div><div class="seg" id="sxi-segMapa"></div><div class="spanel" id="sxi-infoMapa"></div></div>
</div>
</section>

<section class="scard glass" id="sxi-antibiotico">

<h2>¿Lleva antibiótico?</h2>
<p class="muted">La mayoría son virales. Toca cada tarjeta para ver el criterio.</p>
<div class="sgrid" id="sxi-semaforo"></div>
</section>

<section class="scard glass" id="sxi-resfriado">

<h2>Resfriado común: sintomático y sin antibiótico</h2>
<p>Causa más frecuente: <strong>rinovirus</strong>. El moco verde o amarillo <strong>no</strong> indica bacteria.</p>
<h3>Cuánto dura</h3>
<div class="linea" id="sxi-lineaResf"></div>
<div class="duo" style="margin-top:6px">
<div><h3>Sí</h3><ul class="lista" id="sxi-resfSi"></ul></div>
<div><h3>No</h3><ul class="lista" id="sxi-resfNo"></ul></div>
</div>
</section>

<section class="scard glass" id="sxi-faringe">

<h2>Faringoamigdalitis: ¿viral o estreptocócica?</h2>
<p class="muted">Viral en alrededor de 90% de los adultos y hasta dos terceras partes de los niños.</p>
<div class="seg" id="sxi-segFar"></div>
<div class="duo">
<div class="ilu"><svg id="sxi-garganta1" viewBox="0 0 300 210" role="img" aria-label="Vista de la garganta"></svg></div>
<div><ul class="lista" id="sxi-listaFar"></ul></div>
</div>
<div class="sgrid" style="margin-top:14px">
<figure class="foto"><img src="img/estudio/faringitis-estreptococica.jpg" width="720" height="623" loading="lazy" decoding="async" alt="Faringe enrojecida con petequias en el paladar blando"><figcaption><b>Faringitis estreptocócica:</b> faringe roja y edematosa con <b>petequias en el paladar blando</b>, poco frecuentes pero muy específicas.<small>Foto: Centros para el Control y la Prevención de Enfermedades de Estados Unidos, Dr. Heinz F. Eichenwald. Dominio público. <a href="https://commons.wikimedia.org/wiki/File:Streptococcal_pharyngitis.jpg" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons</a></small></figcaption></figure>
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 6.1: faringoamigdalitis pultácea</b><small>Ábrela en tu libro: Enfermedades infecciosas, página 51.</small></div></div>
</div>
</section>

<section class="scard glass" id="sxi-centor">

<h2>Criterios de Centor modificados por McIsaac</h2>
<div class="duo">
<div>
<div class="crit" id="sxi-crit"></div>
<div class="seg" id="sxi-segEdad" aria-label="Edad"></div>
</div>
<div>
<div class="ilu"><svg id="sxi-garganta2" viewBox="0 0 300 210" role="img" aria-label="Garganta que cambia según los criterios"></svg></div>
<div class="res" id="sxi-resCentor"></div>
</div>
</div>
<p class="nota">Prueba rápida de antígeno: sensibilidad cercana a 75% y especificidad de 95%. En niños, si sale negativa, se confirma con cultivo.</p>
</section>

<section class="scard glass" id="sxi-dosis">

<h2>Dosis por peso</h2>
<div class="campos">
<label>Peso en kilos<input type="number" id="sxi-peso" min="2" max="150" step="0.5" value="18" inputmode="decimal"></label>
<label>Edad<select id="sxi-edadD"><option value="0">Menor de 6 meses</option><option value="1">6 a 11 meses</option><option value="2" selected>1 a 5 años</option><option value="3">6 a 11 años</option><option value="4">12 años o más</option></select></label>
<label>Suspensión de amoxicilina<select id="sxi-conc"><option value="250">250 mg en 5 mililitros</option><option value="500" selected>500 mg en 5 mililitros</option></select></label>
</div>
<div class="dosis" id="sxi-cartasDosis"></div>
<p class="nota">Apoyo para estudiar: confirma siempre con la presentación que tengas a la mano y con la ficha del medicamento.</p>
</section>

<section class="scard glass" id="sxi-complicaciones">

<h2>Complicaciones de la faringoamigdalitis</h2>
<h3>Absceso periamigdalino</h3>
<div class="seg" id="sxi-segAbs"></div>
<div class="duo">
<div class="ilu"><svg id="sxi-garganta3" viewBox="0 0 300 210" role="img" aria-label="Garganta normal o con absceso periamigdalino"></svg></div>
<ul class="lista" id="sxi-listaAbs"></ul>
</div>
<h3>Cuándo aparecen las no supurativas</h3>
<div class="linea" id="sxi-lineaComp"></div>
<div class="sgrid" style="margin-top:10px">
<figure class="foto"><img src="img/estudio/absceso-periamigdalino.jpg" width="615" height="720" loading="lazy" decoding="async" alt="Absceso periamigdalino derecho con abombamiento del paladar"><figcaption><b>Absceso periamigdalino derecho</b> (flecha): abombamiento del paladar blando de un lado y úvula empujada al lado contrario.<small>Foto: James Heilman, MD. Licencia Creative Commons Atribución-CompartirIgual 3.0. <a href="https://commons.wikimedia.org/wiki/File:PeritonsilarAbsess.jpg" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons</a></small></figcaption></figure>
<div class="dc"><h4><svg class="ico" style="color:var(--rosa)"><use href="#sxi-i-bazo"/></svg>Mononucleosis infecciosa</h4><p class="sub">Adolescente con faringitis exudativa, <strong>adenopatía cervical posterior</strong>, esplenomegalia y fatiga. Con amoxicilina aparece <strong>exantema</strong>. Sin deportes de contacto: riesgo de rotura de bazo.</p></div>
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 6.2: síndrome de Lemierre</b><small>Ábrela en tu libro: Enfermedades infecciosas, página 52.</small></div></div>
</div>
</section>

<section class="scard glass" id="sxi-oido">

<h2>Otitis media aguda: mira el tímpano</h2>
<p class="muted">Pico entre los 6 meses y los 3 años. Gérmenes: neumococo, Haemophilus influenzae no tipificable, Moraxella catarrhalis y estreptococo del grupo A.</p>
<div class="seg" id="sxi-segTimp"></div>
<div class="duo">
<div class="ilu" style="background:#1b1b1f;text-align:center"><svg id="sxi-timpano" viewBox="0 0 200 200" style="max-width:340px;margin:auto" role="img" aria-label="Vista con otoscopio de la membrana timpánica derecha"></svg><div style="color:#bbb;font-size:13px;margin-top:4px">Oído derecho visto con otoscopio</div></div>
<div class="spanel" id="sxi-infoTimp"></div>
</div>
<div style="margin-top:12px;max-width:520px"><figure class="foto"><img src="img/estudio/otitis-media-abombada.jpg" width="720" height="714" loading="lazy" decoding="async" alt="Membrana timpánica abombada por exudado en el oído medio"><figcaption><b>Otitis media aguda:</b> exudado mucopurulento en el oído medio que <b>abomba la membrana</b>; los vasos radiales dilatados parecen rayos de rueda.<small>Foto: Michael Hawke, MD. Licencia Creative Commons Atribución 4.0. <a href="https://commons.wikimedia.org/wiki/File:Acute_Otitis_Media_Stage_of_Resolution.jpg" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons</a></small></figcaption></figure></div>
<h3 style="margin-top:20px">¿Antibiótico ya u observar?</h3>
<div class="duo">
<div id="sxi-pregOti"></div>
<div><div class="algo" id="sxi-algoOti"></div></div>
</div>
</section>

<section class="scard glass" id="sxi-senos">

<h2>Rinosinusitis: ¿cuándo pensar en bacteria?</h2>
<p class="muted">Casi siempre viral. Adultos: seno maxilar; niños: etmoidal. El dolor empeora al agachar la cabeza. Diagnóstico clínico: sin radiografías de rutina.</p>
<div class="seg" id="sxi-segSen"></div>
<div class="ilu" style="background:var(--aire)"><svg id="sxi-curvas" viewBox="0 0 340 190" role="img" aria-label="Curvas de síntomas por días"></svg></div>
<div class="spanel" id="sxi-infoSen" style="margin-top:10px"></div>
<div class="fin nob" style="background:var(--nob);margin-top:10px"><b style="color:var(--no)">Referencia urgente:</b> edema o eritema periorbitario, alteraciones visuales, cefalea intensa, signos meníngeos o alteración del estado de alerta.</div>
</section>

<section class="scard glass" id="sxi-influenza">

<h2>Influenza: oseltamivir solo a quien lo necesita</h2>
<p>Inicio brusco con fiebre alta, mialgias, cefalea y postración. Oseltamivir de preferencia en las primeras <strong>48 horas</strong>, por <strong>5 días</strong>; adulto 75 mg cada 12 horas.</p>
<div class="sgrid" id="sxi-riesgo" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr))"></div>
</section>

<section class="scard glass" id="sxi-alarma">

<h2>¿Respira rápido para su edad?</h2>
<div class="duo">
<div>
<div class="seg" id="sxi-segFR"></div>
<div class="campos"><label>Respiraciones por minuto<input type="number" id="sxi-fr" min="5" max="120" value="46" inputmode="numeric"></label></div>
<div class="res" id="sxi-resFR"></div>
</div>
<div class="ilu" style="background:var(--aire);display:grid;place-items:center;min-height:190px"><svg id="sxi-pulmon" viewBox="0 0 200 170" style="max-width:240px" role="img" aria-label="Pulmones que respiran a la frecuencia escrita"></svg></div>
</div>
<h3>Otros datos de alarma</h3>
<div class="sgrid" id="sxi-alarmas"></div>
</section>

<section class="scard glass" id="sxi-perlas">

<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">

<h2>Guía mexicana frente a lo actual</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Enfermedades infecciosas capítulo 6; Harrison 21.ª edición, capítulo 35; Guías de Práctica Clínica IMSS-062-08 (actualización 2016) e IMSS-073-08.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const fmt=n=>Math.round(n).toLocaleString('es-MX');

/* ---------- Mapa ---------- */
const ZON={
 senos:{t:'Senos paranasales',d:'Rinosinusitis aguda',x:106,y:92,lx:24,ly:46,txt:'Casi siempre viral. Pensar en bacteria con <b>10 días o más sin mejoría</b>, <b>inicio grave</b> o <b>doble empeoramiento</b>. Adultos: amoxicilina con ácido clavulánico 875/125 mg cada 12 horas por 5 a 7 días.',ir:'senos'},
 nariz:{t:'Nariz',d:'Resfriado común',x:104,y:150,lx:4,ly:96,txt:'Rinovirus. Dura de 5 a 10 días y hasta 14. Tratamiento <b>sintomático</b>; <b>sin antibiótico</b>.',ir:'resfriado'},
 amig:{t:'Amígdalas',d:'Faringoamigdalitis',x:150,y:196,lx:14,ly:252,txt:'Decide con <b>Centor modificado por McIsaac</b>. Si es estreptocócica: penicilina benzatínica dosis única, o penicilina V o amoxicilina por <b>10 días</b>.',ir:'centor'},
 oido:{t:'Oído medio',d:'Otitis media aguda',x:216,y:150,lx:270,ly:84,txt:'Hallazgo clave: <b>tímpano abombado</b>. Elección: amoxicilina a dosis alta, <b>80 a 90 mg por kilo al día</b>.',ir:'oido'}};
const cab=$('#sxi-cabeza');
function dibujaCabeza(sel){
 const on=k=>k===sel;
 const hl=k=>on(k)?'stroke="#0071e3" stroke-width="3"':'stroke="rgba(0,0,0,.18)" stroke-width="1.2"';
 cab.innerHTML=`
 <defs><linearGradient id="gp" x1="0" x2="1"><stop offset="0" stop-color="var(--piel)"/><stop offset="1" stop-color="var(--pielL)"/></linearGradient></defs>
 <path d="M196 16C140 14 96 44 88 92L86 108C84 116 78 122 74 130L56 160C52 167 56 172 64 172H74C76 178 72 182 70 186C74 190 76 194 72 198C70 204 74 210 76 214C78 226 86 234 100 236L128 238C136 240 140 250 142 262L144 300H232L230 250C262 226 292 196 296 140C300 70 256 18 196 16Z" fill="url(#gp)" stroke="rgba(0,0,0,.15)"/>
 <path d="M80 132C100 124 140 126 158 140V164C130 168 100 168 72 166Z" fill="#c86a74" ${hl('nariz')}/>
 <path d="M92 140C110 134 130 135 146 142M90 150C110 145 132 146 150 152M90 160C110 156 132 157 150 161" fill="none" stroke="#e9a3aa" stroke-width="4" stroke-linecap="round"/>
 <ellipse cx="106" cy="92" rx="13" ry="10" fill="${on('senos')?'#8ec1f0':'#cfe0ee'}" ${hl('senos')}/>
 <ellipse cx="120" cy="120" rx="17" ry="9" fill="${on('senos')?'#8ec1f0':'#cfe0ee'}" ${hl('senos')}/>
 <path d="M158 140C174 142 180 156 178 172L176 300H156V196C156 186 152 178 146 172Z" fill="#b8525e"/>
 <path d="M72 172H156" stroke="#f3e3d8" stroke-width="5" stroke-linecap="round"/>
 <path d="M84 190C100 178 136 176 150 190C154 206 148 222 138 228C120 232 100 226 88 214Z" fill="#e3868e"/>
 <ellipse cx="150" cy="196" rx="8" ry="13" fill="${on('amig')?'#ff4d5e':'#d65a68'}" ${hl('amig')}/>
 <path d="M208 154C194 162 180 162 166 150" fill="none" stroke="#b8525e" stroke-width="5" stroke-linecap="round"/>
 <circle cx="216" cy="150" r="10" fill="${on('oido')?'#8ec1f0':'#cfe0ee'}" ${hl('oido')}/>
 <path d="M238 118C262 114 270 140 264 160C259 176 246 184 236 178C247 168 250 150 244 140C240 134 233 130 238 118Z" fill="var(--pielL)" stroke="rgba(0,0,0,.18)"/>
 ${Object.entries(ZON).map(([k,z])=>{const w=z.t.length*7.2+22;const cx=z.lx+w/2;return `
 <g class="hs" data-k="${k}" tabindex="0" role="button" aria-label="${z.t}">
  <line x1="${cx}" y1="${z.ly+13}" x2="${z.x}" y2="${z.y}" stroke="${on(k)?'#0071e3':'rgba(0,0,0,.35)'}" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="${z.x}" cy="${z.y}" r="15" fill="#0071e3" class="pulso"/>
  <circle cx="${z.x}" cy="${z.y}" r="6" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="2.5"/>
  <rect x="${z.lx}" y="${z.ly}" width="${w}" height="26" rx="13" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="1.5"/>
  <text x="${cx}" y="${z.ly+17.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${on(k)?'#fff':'#0071e3'}">${z.t}</text>
 </g>`}).join('')}`;
}
let zonaSel='amig';
const segM=$('#sxi-segMapa');
function ponZona(k){zonaSel=k;dibujaCabeza(k);const z=ZON[k];$('#sxi-infoMapa').innerHTML=`<div class="muted">${z.t}</div><h3 style="margin:2px 0 6px">${z.d}</h3><p>${z.txt}</p><p><button type="button" class="ir" data-ir="${z.ir}">Ver la sección ›</button></p>`;
 segM.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k))}
segM.innerHTML=Object.entries(ZON).map(([k,z])=>`<button type="button" data-k="${k}">${z.t}</button>`).join('')+`<button type="button" data-k="flu">Todo el cuerpo: influenza</button>`;
segM.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.k==='flu'){ir('influenza');return}ponZona(b.dataset.k)};
cab.addEventListener('click',e=>{const g=e.target.closest('.hs');if(g)ponZona(g.dataset.k)});
cab.addEventListener('keydown',e=>{const g=e.target.closest('.hs');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ponZona(g.dataset.k)}});
ponZona('amig');

/* ---------- Semáforo ---------- */
const SEM=[
 ['no','No','Resfriado y bronquitis aguda','No acorta el cuadro ni previene complicaciones.','Tratamiento sintomático. La tos puede durar más que el resto de los síntomas.'],
 ['dep','Solo si es estreptocócica','Faringoamigdalitis','Decide con Centor y prueba rápida.','Centor de 0 a 1: ni prueba ni antibiótico. De 2 a 3: prueba. De 4 a 5: prueba o tratamiento empírico donde no hay prueba.'],
 ['dep','Según edad y gravedad','Otitis media aguda','Inmediato o tras observar 48 a 72 horas.','Inmediato: otorrea, síntomas graves, menores de 6 meses y menores de 2 años con otitis bilateral.'],
 ['dep','Solo con criterios','Rinosinusitis','Diez días, inicio grave o doble empeoramiento.','Cualquiera de los tres patrones sugiere bacteria; sin ellos, lavados salinos, analgésico y esteroide intranasal.'],
 ['si','Antiviral en alto riesgo','Influenza','Oseltamivir en las primeras 48 horas.','Menores de 2 años, mayores de 65, embarazadas, enfermedades crónicas o cuadro grave.']];
const sm=$('#sxi-semaforo');
sm.innerHTML=SEM.map(([c,s,t,p,m])=>`<button type="button" class="sem" aria-expanded="false"><span class="st ${c}">${ico(c==='no'?'x':c==='si'?'ok':'alerta')}${s}</span><h4>${t}</h4><p>${p}</p><div class="mas">${m}</div></button>`).join('');
sm.onclick=e=>{const b=e.target.closest('.sem');if(b)b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!=='true')};

/* ---------- Línea de tiempo genérica ---------- */
function linea(el,total,marcas,barras){
 el.innerHTML=barras.map(([a,b,fila,t,bg,c])=>`<div class="fil"><small style="color:${c}">${t}</small><div class="pista"><i style="left:${a/total*100}%;width:${(b-a)/total*100}%;background:${c}"></i></div></div>`).join('')+`<div class="ej">${marcas.map(([d,t])=>`<span class="mk" style="left:${d/total*100}%">${t}</span>`).join('')}</div>`;
}
linea($('#sxi-lineaResf'),14,[[0,'Día 0'],[7,'7'],[14,'14 días']],[[0,10,0,'Lo habitual: 5 a 10 días','var(--blue2)','var(--blue)'],[0,14,1,'Puede llegar a 14 días; la tos dura más','var(--ctrl)','var(--ink2)']]);
const li=(arr)=>arr.map(([i,c,b,t])=>`<li><span class="sic" style="background:${b};color:${c}">${ico(i)}</span><span>${t}</span></li>`).join('');
$('#sxi-resfSi').innerHTML=li([['term','var(--ok)','var(--okb)','<b>Paracetamol</b> 10 a 15 mg por kilo cada 4 a 6 horas (máximo 75 mg por kilo al día) o ibuprofeno'],['vaso','var(--ok)','var(--okb)','Líquidos'],['spray','var(--ok)','var(--okb)','Lavados nasales con solución salina'],['miel','var(--ok)','var(--okb)','<b>Miel</b> para la tos, solo en <b>mayores de 1 año</b>']]);
$('#sxi-resfNo').innerHTML=li([['pild','var(--no)','var(--nob)','<b>Antibiótico</b>'],['tos','var(--no)','var(--nob)','Antitusivos y antigripales en <b>menores de 6 años</b>'],['gota','var(--no)','var(--nob)','Descongestionantes y bromuro de ipratropio'],['x','var(--no)','var(--nob)','Vitamina C y zinc']]);

/* ---------- Garganta ---------- */
function garganta(svg,o){
 const s=o.cr||1,ex=o.ex,pet=o.pet,abs=o.abs,ph=o.ph||'#d9707a';
 const ux=abs?-16:0,rot=abs?12:0;
 const blotch=cx=>[[-8,-12,6,4],[6,-2,7,4.5],[-6,10,5,3.5],[8,14,4,3]].map(([dx,dy,rx,ry])=>`<ellipse cx="${cx+dx*s}" cy="${118+dy*s}" rx="${rx}" ry="${ry}" fill="#fff6dc" stroke="#efdca8" stroke-width=".8"/>`).join('');
 svg.innerHTML=`
 <defs><clipPath id="cp${svg.id}"><ellipse cx="150" cy="108" rx="118" ry="80"/></clipPath>
 <radialGradient id="rg${svg.id}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="${ph}"/><stop offset="1" stop-color="#7a2632"/></radialGradient></defs>
 <ellipse cx="150" cy="106" rx="132" ry="92" fill="#c25b66"/>
 <g clip-path="url(#cp${svg.id})">
  <rect x="0" y="0" width="300" height="210" fill="#4a1720"/>
  <ellipse cx="150" cy="118" rx="62" ry="58" fill="url(#rg${svg.id})"/>
  <path d="M86 70C76 100 76 140 92 176M214 70C224 100 224 140 208 176" stroke="#e39aa1" stroke-width="10" fill="none" stroke-linecap="round"/>
  <ellipse cx="${92-(s-1)*4}" cy="118" rx="${20*s}" ry="${28*s}" fill="#cf5262"/>
  <ellipse cx="${abs?214:208+(s-1)*4}" cy="${abs?112:118}" rx="${abs?34:20*s}" ry="${abs?40:28*s}" fill="${abs?'#d8414f':'#cf5262'}"/>
  ${abs?'<ellipse cx="206" cy="96" rx="14" ry="10" fill="#f08a90" opacity=".7"/>':''}
  <path d="M84 110c6-4 10 4 16 0M82 124c6-4 12 4 18 0M200 110c6-4 10 4 16 0M198 124c6-4 12 4 18 0" stroke="#a83444" stroke-width="2" fill="none" opacity=".7"/>
  ${ex?blotch(92-(s-1)*4)+blotch(208+(s-1)*4):''}
  <path d="M20 80C40 30 100 22 150 24C200 22 260 30 280 80C250 66 214 56 186 60C172 62 ${abs?176:166} 70 ${abs?182:164} 84H136C134 70 128 62 114 60C86 56 50 66 20 80Z" fill="#e79aa0"/>
  ${pet?[[116,46],[128,52],[140,44],[160,46],[172,52],[184,46],[150,54],[134,40],[168,40]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#9c1f2e"/>`).join(''):''}
  <g transform="rotate(${rot} 150 80) translate(${ux} 0)"><path d="M138 78C138 90 140 104 150 106C160 104 162 90 162 78Z" fill="#e48b93"/></g>
  <ellipse cx="150" cy="208" rx="112" ry="40" fill="#e3868e"/>
  <path d="M150 178V200" stroke="#c96c75" stroke-width="2"/>
 </g>
 ${o.labels?o.labels.map(([x,y,t,ax,ay])=>{const w=t.length*6.6+16;return `<line x1="${x+w/2}" y1="${y+20}" x2="${ax}" y2="${ay}" stroke="#fff" stroke-width="1.5"/><rect x="${x}" y="${y}" width="${w}" height="22" rx="11" fill="#fff"/><text x="${x+w/2}" y="${y+15}" text-anchor="middle" font-size="12" font-weight="600" fill="#1d1d1f">${t}</text>`}).join(''):''}`;
}
const FAR={
 vir:{g:{ph:'#d97a82',cr:1,ex:false,pet:false,labels:[[8,8,'Faringe roja, sin exudado',110,110]]},l:[['tos','Tos'],['gota','Rinorrea'],['ojo','Conjuntivitis'],['alerta','Disfonía, aftas o diarrea']],c:'var(--blue)',b:'var(--blue2)',t:'Sugiere virus'},
 est:{g:{ph:'#e2505e',cr:1.25,ex:true,pet:true,labels:[[150,6,'Petequias en paladar',150,46],[4,182,'Exudado amigdalino',86,140]]},l:[['term','Inicio brusco y fiebre alta'],['x','Ausencia de tos'],['gang','Adenopatía cervical anterior dolorosa'],['bebe','Edad típica de 5 a 15 años']],c:'var(--no)',b:'var(--nob)',t:'Sugiere estreptococo beta hemolítico del grupo A'}};
seg($('#sxi-segFar'),[['vir','Viral'],['est','Estreptocócica']],'est',k=>{const f=FAR[k];garganta($('#sxi-garganta1'),f.g);$('#sxi-listaFar').innerHTML=`<li><b style="color:${f.c}">${f.t}</b></li>`+li(f.l.map(([i,t])=>[i,f.c,f.b,t]))+(k==='est'?`<li><span class="muted">Escarlatina: además exantema áspero en papel de lija y lengua de fresa.</span></li>`:'')});

/* ---------- Centor ---------- */
const CR=[['fiebre','term','Fiebre mayor de 38 °C'],['tos','x','Sin tos'],['gang','gang','Adenopatía cervical anterior dolorosa'],['exu','gota','Exudado o crecimiento amigdalino']];
const crit=$('#sxi-crit');
crit.innerHTML=CR.map(([k,i,t])=>`<label>${ico(i,'var(--blue)')}<input type="checkbox" id="sxi-c-${k}">${t}<span class="pt">+1</span></label>`).join('');
let edadC='0';
function centor(){
 let n=CR.reduce((a,[k])=>a+($('#sxi-c-'+k).checked?1:0),0)+(+edadC);
 const exu=$('#sxi-c-exu').checked,fie=$('#sxi-c-fiebre').checked;
 garganta($('#sxi-garganta2'),{ph:fie?'#e2505e':'#d97a82',cr:exu?1.25:1,ex:exu,pet:false});
 let c,b,t;
 if(n<=1){c='var(--ok)';b='var(--okb)';t='<b>Probablemente viral.</b> Ni prueba ni antibiótico.'}
 else if(n<=3){c='var(--mid)';b='var(--midb)';t='<b>Prueba rápida de antígeno o cultivo.</b> Antibiótico solo si sale positiva.'}
 else{c='var(--no)';b='var(--nob)';t='<b>Alta probabilidad.</b> Prueba rápida si existe; si no hay, tratamiento empírico.'}
 $('#sxi-resCentor').style.background=b;
 $('#sxi-resCentor').innerHTML=`<div class="sn" style="color:${c}">${n}</div><div style="flex:1">${t}<div class="barra">${[-1,0,1,2,3,4,5].map(v=>`<i style="${v<=n?`background:${c}`:''}"></i>`).join('')}</div></div>`;
}
crit.onchange=centor;
seg($('#sxi-segEdad'),[['1','3 a 14 años: +1'],['0','15 a 44 años: 0'],['-1','45 años o más: −1']],'0',v=>{edadC=v;centor()});

/* ---------- Dosis ---------- */
function dosis(){
 const w=Math.max(0,parseFloat($('#sxi-peso').value)||0),e=+$('#sxi-edadD').value,cc=+$('#sxi-conc').value;
 const ml=mg=>(mg/cc*5).toFixed(1).replace('.0','');
 const C=[];
 if(w>=50) C.push(['term','Paracetamol','1,000 mg','cada 6 horas; máximo 4,000 mg al día']);
 else C.push(['term','Paracetamol',`${fmt(10*w)} a ${fmt(15*w)} mg`,`por toma cada 4 a 6 horas; máximo ${fmt(75*w)} mg al día`]);
 if(e>=1) C.push(['term','Ibuprofeno',`${fmt(Math.min(5*w,400))} a ${fmt(Math.min(10*w,400))} mg`,`por toma cada 6 a 8 horas; máximo ${fmt(40*w)} mg al día`]);
 else C.push(['x','Ibuprofeno','No','no se usa en menores de 6 meses']);
 const a1=Math.min(50*w,1000);
 C.push(['pild','Amoxicilina en faringitis',`${fmt(a1)} mg al día`,`en 1 o 2 tomas por 10 días${w<50?` · ${ml(a1/2)} mililitros cada 12 horas`:''} (máximo 1,000 mg al día)`]);
 const lo=Math.min(80*w,3000),hi=Math.min(90*w,3000);
 C.push(['pild','Amoxicilina en otitis media',`${fmt(lo/2)} a ${fmt(hi/2)} mg`,`cada 12 horas · ${ml(lo/2)} a ${ml(hi/2)} mililitros; máximo 3,000 mg al día`]);
 C.push(['jer','Penicilina G benzatínica',w<27?'600,000 unidades':'1,200,000 unidades',w<27?'intramuscular, dosis única (menos de 27 kilos)':'intramuscular, dosis única (27 kilos o más)']);
 C.push(['pild','Azitromicina si hay alergia grave',`${fmt(Math.min(12*w,500))} mg al día`,'por 5 días en faringitis (máximo 500 mg)']);
 let os;if(e<=1)os=[`${fmt(3*w)} mg`,'cada 12 horas por 5 días (3 mg por kilo por dosis, menores de 1 año)'];
 else os=[w<=15?'30 mg':w<=23?'45 mg':w<=40?'60 mg':'75 mg','cada 12 horas por 5 días'];
 C.push(['pulm','Oseltamivir',os[0],os[1]]);
 $('#sxi-cartasDosis').innerHTML=C.map(([i,t,b,s])=>`<div class="dc"><h4>${ico(i,'var(--blue)')}${t}</h4><div class="sbig">${b}</div><div class="sub">${s}</div></div>`).join('');
}
['peso','edadD','conc'].forEach(id=>$('#sxi-'+id).addEventListener('input',dosis));dosis();

/* ---------- Absceso ---------- */
seg($('#sxi-segAbs'),[['n','Garganta normal'],['a','Absceso periamigdalino']],'a',k=>{
 garganta($('#sxi-garganta3'),k==='a'?{ph:'#d9707a',abs:true,labels:[[118,180,'Abombamiento de un lado',210,128],[6,8,'Úvula desviada al lado contrario',134,90]]}:{ph:'#d97a82'});
 $('#sxi-listaAbs').innerHTML=k==='a'?li([['alerta','var(--no)','var(--nob)','Odinofagia intensa de <b>un solo lado</b>'],['x','var(--no)','var(--nob)','<b>Trismus</b> y sialorrea'],['tos','var(--no)','var(--nob)','Voz apagada, "de papa caliente"'],['jer','var(--no)','var(--nob)','<b>Referir para drenaje</b>']]):`<li class="muted">Úvula en la línea media y amígdalas simétricas. Cambia a "Absceso" para comparar.</li>`;
});
linea($('#sxi-lineaComp'),35,[[0,'Día 0'],[9,'9'],[21,'21'],[35,'35 días']],[[0,9,0,'Tratar antes del día 9 previene la fiebre reumática','var(--okb)','var(--ok)'],[7,21,1,'Glomerulonefritis: 1 a 3 semanas','var(--midb)','var(--mid)'],[14,28,2,'Fiebre reumática: 2 a 4 semanas','var(--nob)','var(--no)']]);
$('#sxi-lineaComp').insertAdjacentHTML('afterend','<p class="nota">El antibiótico <b>no</b> previene la glomerulonefritis posestreptocócica.</p>');

/* ---------- Tímpano ---------- */
const TIM={
 nor:{f:['#e1ddd6','#b8b2aa'],luz:true,mar:1,txt:'<b>Normal:</b> gris perla, translúcido. Se ven el mango del martillo y el <b>cono de luz</b> anteroinferior.'},
 abo:{f:['#f3cc78','#cf4b45'],luz:false,mar:.12,bulto:true,txt:'<b>Otitis media aguda:</b> membrana <b>abombada</b>, opaca, amarilla o roja. Se pierden el martillo y el cono de luz. Es el hallazgo clave.'},
 roj:{f:['#efb3ad','#d9807c'],luz:true,mar:1,vas:true,txt:'<b>Solo enrojecida:</b> puede deberse al llanto o a la fiebre. Si no está abombada, <b>no basta</b> para diagnosticar otitis.'},
 oto:{f:['#e7c27a','#b98a3a'],luz:false,mar:0,otorrea:true,txt:'<b>Otorrea de inicio reciente:</b> secreción en el conducto que tapa la membrana. También es criterio diagnóstico y amerita antibiótico de inmediato.'}};
function timpano(k){const t=TIM[k];$('#sxi-timpano').innerHTML=`
 <defs><radialGradient id="tg" cx="${t.bulto?.46:.55}" cy="${t.bulto?.42:.5}" r=".62"><stop offset="0" stop-color="${t.f[0]}"/><stop offset="1" stop-color="${t.f[1]}"/></radialGradient>
 <clipPath id="tc"><circle cx="100" cy="100" r="72"/></clipPath></defs>
 <circle cx="100" cy="100" r="96" fill="#0a0a0c"/><circle cx="100" cy="100" r="86" fill="#d7a183"/>
 <circle cx="100" cy="100" r="72" fill="url(#tg)" stroke="#c78c70" stroke-width="3"/>
 <g clip-path="url(#tc)">
 ${t.bulto?'<ellipse cx="88" cy="84" rx="34" ry="24" fill="#fff" opacity=".28"/><ellipse cx="132" cy="140" rx="30" ry="18" fill="#a5302c" opacity=".35"/>':''}
 <g opacity="${t.mar}"><path d="M98 34L106 98" stroke="#f6f1e6" stroke-width="6" stroke-linecap="round"/><circle cx="97" cy="36" r="5" fill="#f6f1e6"/><path d="M70 40Q100 22 128 40" stroke="#cfa99a" stroke-width="2" fill="none"/></g>
 ${t.vas?'<path d="M96 40C90 60 94 80 104 96M102 40C110 58 108 78 106 94" stroke="#c0393f" stroke-width="1.6" fill="none"/>':''}
 ${t.luz?'<path d="M108 102L150 146L132 158Z" fill="#fff" opacity=".85"/>':''}
 ${t.otorrea?'<path d="M28 120C50 100 70 130 96 118S150 120 172 132V190H28Z" fill="#f2d36b" opacity=".95"/><ellipse cx="70" cy="140" rx="16" ry="6" fill="#fff" opacity=".4"/>':''}
 </g>`;
 $('#sxi-infoTimp').innerHTML=t.txt}
seg($('#sxi-segTimp'),[['nor','Normal'],['abo','Abombada'],['roj','Solo enrojecida'],['oto','Otorrea']],'abo',timpano);

/* ---------- Algoritmo de otitis ---------- */
const PQ=[['edad','Edad',[['a','Menor de 6 meses'],['b','6 a 23 meses'],['c','2 a 5 años'],['d','6 años o más']]],['oto','¿Otorrea?',[['si','Sí'],['no','No']]],['gra','¿Síntomas graves? (otalgia de más de 48 horas o fiebre de 39 °C o más)',[['si','Sí'],['no','No']]],['lat','¿Un oído o los dos?',[['u','Unilateral'],['b','Bilateral']]]];
const R={edad:'b',oto:'no',gra:'no',lat:'u'};
function otitis(){
 $('#sxi-pregOti').innerHTML=PQ.map(([k,t,o])=>`<div style="margin-bottom:6px"><div class="muted" style="font-weight:600">${t}</div><div class="seg" data-q="${k}">${o.map(([v,l])=>`<button type="button" data-v="${v}" aria-pressed="${R[k]===v}">${l}</button>`).join('')}</div></div>`).join('');
 const menor2=R.edad==='a'||R.edad==='b';
 const motivo=R.oto==='si'?'Hay otorrea':R.gra==='si'?'Síntomas graves':R.edad==='a'?'Menor de 6 meses':(R.edad==='b'&&R.lat==='b')?'Menor de 2 años con otitis bilateral':'';
 const dur=(menor2||R.gra==='si')?'10 días':R.edad==='c'?'5 a 7 días':'5 días';
 const pasos=[['Otorrea',R.oto==='si'?'Sí':'No',R.oto==='si'],['Síntomas graves',R.gra==='si'?'Sí':'No',R.gra==='si'],['Menor de 6 meses',R.edad==='a'?'Sí':'No',R.edad==='a'],['Menor de 2 años y bilateral',(R.edad==='b'&&R.lat==='b')?'Sí':'No',R.edad==='b'&&R.lat==='b']];
 const fin=motivo?`<div class="fin" style="background:var(--nob)"><b style="color:var(--no)">Antibiótico de inmediato</b><br>${motivo}. Amoxicilina <b>80 a 90 mg por kilo al día</b> en 2 tomas, por <b>${dur}</b>.</div>`
 :`<div class="fin" style="background:var(--okb)"><b style="color:var(--ok)">Observación vigilada de 48 a 72 horas</b><br>Solo si se garantiza la revaloración. Analgésico desde ya. Si no mejora: amoxicilina por <b>${dur}</b>.</div>`;
 $('#sxi-algoOti').innerHTML=pasos.map(([t,v,on],i)=>`<div class="nodo ${on?'on':''}"><span>${t}</span><b>${v}</b></div>${i<3?'<div class="flecha"></div>':''}`).join('')+fin+`<p class="nota">Amoxicilina con ácido clavulánico si recibió amoxicilina en los últimos 30 días, si hay conjuntivitis purulenta o si no mejora en 48 a 72 horas. Alternativa: ceftriaxona intramuscular por 3 días. Referir si hay mastoiditis.</p>`;
}
$('#sxi-pregOti').onclick=e=>{const b=e.target.closest('button');if(!b)return;R[b.parentElement.dataset.q]=b.dataset.v;otitis()};otitis();

/* ---------- Curvas de sinusitis ---------- */
const X=d=>40+d*20,Y=v=>160-v*125;
const cur=pts=>{let d=`M${X(pts[0][0])} ${Y(pts[0][1])}`;for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];const c1=[X(p1[0])+(X(p2[0])-X(p0[0]))/6,Y(p1[1])+(Y(p2[1])-Y(p0[1]))/6],c2=[X(p2[0])-(X(p3[0])-X(p1[0]))/6,Y(p2[1])-(Y(p3[1])-Y(p1[1]))/6];d+=`C${c1} ${c2} ${X(p2[0])} ${Y(p2[1])}`}return d};
const VIR=[[0,.1],[1,.5],[3,.8],[5,.55],[7,.3],[9,.14],[11,.06],[14,.03]];
const SEN={
 per:{p:[[0,.1],[1,.5],[3,.75],[5,.68],[7,.66],[9,.66],[11,.67],[14,.66]],m:[10,'10 días sin mejoría'],txt:'<b>Persistente:</b> síntomas por <b>10 días o más sin mejoría</b>.'},
 gra:{p:[[0,.9],[1,.96],[2,.96],[3,.94],[4,.9],[6,.7],[9,.5],[14,.4]],m:[2,'Fiebre de 39 °C o más'],txt:'<b>Inicio grave:</b> fiebre de <b>39 °C o más</b> con rinorrea purulenta o dolor facial durante <b>3 a 4 días</b> seguidos.'},
 dob:{p:[[0,.1],[1,.5],[3,.75],[5,.4],[6,.34],[7,.55],[9,.86],[11,.82],[14,.7]],m:[7,'Vuelve a empeorar'],txt:'<b>Doble empeoramiento:</b> mejora al principio y después <b>empeora de nuevo</b>.'}};
seg($('#sxi-segSen'),[['per','10 días o más'],['gra','Inicio grave'],['dob','Doble empeoramiento']],'per',k=>{const s=SEN[k],[md,mt]=s.m,my=Y(s.p.reduce((a,p)=>Math.abs(p[0]-md)<Math.abs(a[0]-md)?p:a)[1]);
 $('#sxi-curvas').innerHTML=`<line x1="40" y1="160" x2="320" y2="160" stroke="currentColor" opacity=".3"/>
 ${[0,3,7,10,14].map(d=>`<line x1="${X(d)}" y1="160" x2="${X(d)}" y2="165" stroke="currentColor" opacity=".4"/><text x="${X(d)}" y="178" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${d===0?'Día 0':d}</text>`).join('')}
 <text x="14" y="40" font-size="11" fill="currentColor" opacity=".7" transform="rotate(-90 14 40)" text-anchor="end">Síntomas</text>
 <rect x="${X(10)}" y="26" width="${X(14)-X(10)}" height="134" fill="#0071e3" opacity=".07"/>
 <path d="${cur(VIR)}" fill="none" stroke="#8e8e93" stroke-width="3" stroke-dasharray="6 5"/>
 <text x="${X(9)}" y="${Y(.14)-8}" font-size="11" fill="#8e8e93">Viral habitual</text>
 <path d="${cur(s.p)}" fill="none" stroke="#d93a3f" stroke-width="4" stroke-linecap="round"/>
 <circle cx="${X(md)}" cy="${my}" r="6" fill="#d93a3f"/>
 <line x1="${X(md)}" y1="20" x2="${X(md)}" y2="${my-6}" stroke="#d93a3f" stroke-width="1.5" stroke-dasharray="3 3"/>
 <rect x="${Math.max(4,Math.min(X(md)-64,208))}" y="2" width="128" height="20" rx="10" fill="#d93a3f"/>
 <text x="${Math.max(4,Math.min(X(md)-64,208))+64}" y="16" text-anchor="middle" font-size="11.5" font-weight="600" fill="#fff">${mt}</text>`;
 $('#sxi-curvas').style.color='var(--ink)';
 $('#sxi-infoSen').innerHTML=s.txt+' Gérmenes: neumococo, Haemophilus influenzae y Moraxella catarrhalis, igual que la otitis.'});

/* ---------- Influenza ---------- */
$('#sxi-riesgo').innerHTML=[['bebe','Menores de 2 años'],['mayor','Mayores de 65 años'],['emb','Embarazadas'],['cron','Enfermedades crónicas'],['alerta','Cuadro grave']].map(([i,t])=>`<div class="dc" style="display:flex;gap:10px;align-items:center"><span class="sic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--tealb);color:var(--teal)">${ico(i)}</span><b>${t}</b></div>`).join('');

/* ---------- Frecuencia respiratoria ---------- */
let lim=50;
const pul=$('#sxi-pulmon');
function fr(){
 const v=parseFloat($('#sxi-fr').value)||0,r=v>=lim;
 $('#sxi-resFR').style.background=r?'var(--nob)':'var(--okb)';
 $('#sxi-resFR').innerHTML=`<div class="sn" style="color:${r?'var(--no)':'var(--ok)'}">${v||'–'}</div><div>${r?`<b style="color:var(--no)">Respiración rápida.</b> Con ${lim} o más por minuto, sospecha neumonía: busca tiraje, quejido, cianosis y saturación baja.`:`<b style="color:var(--ok)">Dentro de lo esperado</b> para la edad (respiración rápida desde ${lim} por minuto).`}</div>`;
 const per=v>0?60/v:4;
 pul.innerHTML=`<g class="resp" style="animation:sxiresp ${per}s ease-in-out infinite"><path d="M100 18V70M100 70C90 78 80 80 80 80M100 70C110 78 120 80 120 80" stroke="#b8525e" stroke-width="6" fill="none" stroke-linecap="round"/>
 <path d="M84 40C50 44 24 84 24 124C24 148 34 160 50 160C70 160 84 146 84 120Z" fill="${r?'#e9707a':'#f0a3aa'}"/><path d="M116 40C150 44 176 84 176 124C176 148 166 160 150 160C130 160 116 146 116 120Z" fill="${r?'#e9707a':'#f0a3aa'}"/></g>`;
}
seg($('#sxi-segFR'),[['60','Menor de 2 meses'],['50','2 a 11 meses'],['40','1 a 4 años']],'50',v=>{lim=+v;fr()});
$('#sxi-fr').addEventListener('input',fr);
$('#sxi-alarmas').innerHTML=[['pulm','Tiraje, quejido, cianosis o saturación baja'],['alerta','Estridor en reposo, sialorrea, dificultad para tragar o respirar'],['cor','Alteraciones neurológicas, vómito persistente o menos orina'],['piel','Exantema petequial o purpúrico'],['reloj','Fiebre más de 3 días, o no mejora en 7 a 10 días'],['term','Adultos: fiebre mayor de 39 °C, dolor torácico o más de 14 días']].map(([i,t])=>`<div class="dc" style="display:flex;gap:10px;align-items:center;border-color:transparent;background:var(--nob)"><span style="color:var(--no);flex:none;display:flex">${ico(i)}</span><span style="font-size:15px">${t}</span></div>`).join('');

/* ---------- Perlas ---------- */
const PER=[['¿Resfriado o bronquitis aguda?','Sin antibiótico.'],['¿Centor de 0 a 1 punto?','Ni prueba ni antibiótico.'],['¿Faringitis estreptocócica?','Penicilina benzatínica dosis única, o penicilina V o amoxicilina por 10 días.'],['¿Penicilina benzatínica en un niño de 20 kilos?','600,000 unidades (menos de 27 kilos); 1,200,000 si pesa 27 o más.'],['¿Adolescente con faringitis y exantema tras amoxicilina?','Mononucleosis infecciosa.'],['¿Hallazgo clave de otitis media?','Tímpano abombado. Amoxicilina 80 a 90 mg por kilo al día.'],['¿Cuándo es bacteriana la sinusitis?','10 días sin mejoría, inicio grave o doble empeoramiento.']];
const fl=$('#sxi-flips');
fl.innerHTML=PER.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:17px">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');
fl.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')};

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Faringoamigdalitis (guía IMSS-073-08 del Instituto Mexicano del Seguro Social, 2008)','Penicilina compuesta seguida de procaínica; erradicación con benzatínica cada 21 días por 3 meses.','Penicilina benzatínica dosis única, o penicilina V o amoxicilina por 10 días.'],['Alergia a penicilina','Eritromicina o trimetoprima con sulfametoxazol.','Cefalexina, clindamicina o macrólido. El trimetoprima con sulfametoxazol no sirve para el estreptococo del grupo A.'],['Niños de 3 meses a 18 años (IMSS-062-08, 2016)','Paracetamol; sin antitusivos, descongestionantes, ipratropio, vitamina C ni zinc.','Coincide con el CTO y el Harrison.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--midb)"><small style="color:var(--mid)">Guía mexicana</small>${g}</div><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">Usa esto</small>${a}</div></div></div>`).join('');
}};
})();
