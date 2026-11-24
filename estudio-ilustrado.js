/* GCHE2 · Resúmenes ilustrados e interactivos de Estudio.
   Cada tema ilustrado se registra en window.SXILU con la misma clave que window.SXTEMAS
   (slug de la materia y número de capítulo). estudio-libros.js lo muestra en la pestaña Resumen
   y deja el resumen en texto completo debajo, plegado.
   Dibujos hechos para la app; fotos de Wikimedia Commons con su crédito (img/estudio/CREDITOS.md). */
(function(){
document.head.insertAdjacentHTML('beforeend',`<style>.sxi{--blue:#0071e3;--blue2:color-mix(in srgb,#0071e3 11%,transparent);--card:var(--solid);--ok:#0a9f4a;--okb:color-mix(in srgb,#0a9f4a 12%,transparent);--no:#d93a3f;--nob:color-mix(in srgb,#d93a3f 11%,transparent);--mid:#c77a00;--midb:color-mix(in srgb,#e39500 14%,transparent);--rosa:#d65a68;--rosab:color-mix(in srgb,#d65a68 10%,transparent);--vio:#7a5af5;--viob:color-mix(in srgb,#7a5af5 12%,transparent);--teal:#00879a;--tealb:color-mix(in srgb,#00a1b3 12%,transparent);--piel:#f2cdb2;--pielL:#e2b394;--aire:#dfeaf5;--sombra:0 1px 2px rgba(0,0,0,.05);display:grid;gap:14px}
:root.dark .sxi{--piel:#c99b7d;--pielL:#ab7f62;--aire:#22323f;--sombra:none}
.sxi .scard{scroll-margin-top:90px}
.sxi .snav{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.sxi .snav button{flex:none;font-size:14px;padding:8px 13px;min-height:40px;border-radius:999px;border:1px solid var(--line);background:var(--ctrl);cursor:pointer}
.sxi a.ir,.sxi button.ir{color:var(--blue);font-weight:600;background:none;border:0;padding:8px 0;cursor:pointer;font-size:16px}
@keyframes sxiresp{0%,100%{transform:scale(.92)}50%{transform:scale(1.04)}}
.sxi .scard{background:var(--card);border-radius:22px;padding:clamp(16px,3vw,26px);box-shadow:var(--sombra);border:1px solid var(--line);scroll-margin-top:150px}.sxi h2{font-size:clamp(21px,3vw,26px);line-height:1.15;margin:6px 0 8px;letter-spacing:-.01em;text-wrap:balance}.sxi h3{font-size:17px;margin:14px 0 6px}.sxi p{margin:6px 0}.sxi .muted{color:var(--ink2);font-size:14px}.sxi .tag{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:600;padding:3px 9px;border-radius:999px;margin:0 4px 4px 0}.sxi .t-dia{background:var(--blue2);color:var(--blue)}.sxi .t-tar{background:var(--tealb);color:var(--teal)}.sxi .t-foto{background:var(--midb);color:var(--mid)}.sxi .t-lib{background:var(--viob);color:var(--vio)}.sxi .t-int{background:var(--okb);color:var(--ok)}.sxi .leyenda{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.sxi .duo{display:grid;gap:16px;grid-template-columns:minmax(0,1fr)}@media(min-width:760px){.sxi .duo{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:start}}.sxi .ilu{background:var(--rosab);border-radius:18px;padding:10px;position:relative}.sxi .ilu svg{display:block;width:100%;height:auto}.sxi .seg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.sxi .seg button{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--ctrl);font-size:15px;font-weight:500;cursor:pointer}.sxi .seg button[aria-pressed=true]{background:var(--blue);border-color:var(--blue);color:#fff}.sxi .spanel{border-radius:16px;padding:14px 16px;background:var(--ctrl)}.sxi .spanel b{font-weight:650}.sxi .sgrid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))}.sxi .sem{border-radius:16px;padding:14px;border:1px solid var(--line);cursor:pointer;text-align:left;background:var(--card);min-height:44px}.sxi .sem .st{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:3px 9px;border-radius:999px}.sxi .sem h4{margin:8px 0 2px;font-size:16px}.sxi .sem p{font-size:14px;color:var(--ink2)}.sxi .sem .mas{display:none;font-size:14px;margin-top:8px;color:var(--ink)}.sxi .sem[aria-expanded=true] .mas{display:block}.sxi .si{background:var(--okb);color:var(--ok)}.sxi .no{background:var(--nob);color:var(--no)}.sxi .dep{background:var(--midb);color:var(--mid)}.sxi .ico{width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sxi .lista{list-style:none;padding:0;margin:8px 0;display:grid;gap:8px}.sxi .lista li{display:flex;gap:10px;align-items:flex-start}.sxi .lista .sic{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;flex:none}.sxi .crit{display:grid;gap:8px}.sxi .crit label{display:flex;align-items:center;gap:12px;min-height:52px;padding:8px 14px;border-radius:14px;background:var(--ctrl);cursor:pointer;font-weight:500;text-align:left;justify-content:flex-start}.sxi .crit input{width:22px;height:22px;accent-color:var(--blue);flex:none}.sxi .crit .ico{flex:none}.sxi .crit .pt{margin-left:auto;font-size:14px;color:var(--ink2);white-space:nowrap}.sxi .res{display:flex;gap:14px;align-items:center;flex-wrap:wrap;border-radius:18px;padding:14px 16px;margin-top:10px}.sxi .res .sn{font-size:clamp(44px,8vw,60px);font-weight:800;line-height:1;letter-spacing:-.03em;min-width:1.2em;text-align:center}.sxi .res>div:last-child{flex:1 1 190px}.sxi .barra{display:flex;gap:3px;margin:10px 0 0}.sxi .barra i{flex:1;height:8px;border-radius:4px;background:var(--line)}.sxi .dosis{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));margin-top:12px}.sxi .dc{border-radius:16px;padding:14px;border:1px solid var(--line);background:var(--card)}.sxi .dc h4{margin:0 0 2px;font-size:16px;display:flex;gap:8px;align-items:center}.sxi .dc .sbig{font-size:24px;font-weight:750;letter-spacing:-.02em;margin:4px 0;white-space:nowrap}.sxi .dc .sub{font-size:14px;color:var(--ink2)}.sxi .campos{display:flex;flex-wrap:wrap;gap:10px;align-items:end}.sxi .campos label{display:grid;gap:4px;font-size:14px;color:var(--ink2);font-weight:500}.sxi input[type=number],.sxi select{font:inherit;font-size:17px;min-height:46px;padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--ctrl);color:var(--ink);width:150px}.sxi select{width:auto}.sxi .foto{margin:0;border-radius:16px;overflow:hidden;background:var(--ctrl);border:1px solid var(--line)}.sxi .foto img{display:block;width:100%;height:auto;background:#222}.sxi .foto figcaption{padding:10px 14px 12px;font-size:15px}.sxi .foto small{display:block;font-size:12.5px;color:var(--ink2);margin-top:6px}.sxi .foto a{color:var(--blue)}.sxi .slot{border:2px dashed var(--line);border-radius:18px;padding:14px;display:flex;gap:14px;align-items:center}.sxi .slot .marco{width:96px;height:96px;border-radius:14px;display:grid;place-items:center;flex:none}.sxi .slot.foto .marco{background:var(--midb);color:var(--mid)}.sxi .slot.lib .marco{background:var(--viob);color:var(--vio)}.sxi .slot .marco .ico{width:40px;height:40px;stroke-width:1.6}.sxi .slot b{display:block}.sxi .slot small{display:block;color:var(--ink2);font-size:13px;margin-top:4px}.sxi .linea{margin:10px 0 4px;display:grid;gap:10px}.sxi .linea .fil small{display:block;font-size:14px;font-weight:600;margin-bottom:4px}.sxi .linea .pista{position:relative;height:12px;border-radius:6px;background:var(--ctrl)}.sxi .linea .pista i{position:absolute;top:0;bottom:0;border-radius:6px}.sxi .linea .ej{position:relative;height:20px;border-top:2px solid var(--line);margin-top:2px}.sxi .linea .mk{position:absolute;top:2px;font-size:13px;color:var(--ink2);transform:translateX(-50%);white-space:nowrap}.sxi .linea .mk:first-child{transform:none}.sxi .linea .mk:last-child{transform:translateX(-100%)}.sxi .flip{perspective:900px;min-height:150px;cursor:pointer;border:0;background:none;padding:0;text-align:left}.sxi .flip .in{position:relative;width:100%;height:100%;min-height:150px;transition:transform .5s var(--e,ease);transform-style:preserve-3d}.sxi .flip[aria-pressed=true] .in{transform:rotateY(180deg)}.sxi .flip .cara{position:absolute;inset:0;border-radius:16px;padding:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--line)}.sxi .flip .frente{background:var(--blue2)}.sxi .flip .bk{background:var(--card);transform:rotateY(180deg)}.sxi .flip .frente b{font-size:18px;line-height:1.25}.sxi .flip small{color:var(--ink2);font-size:13px}.sxi .algo{display:grid;gap:6px;margin-top:10px}.sxi .algo .nodo{border-radius:14px;padding:10px 14px;background:var(--ctrl);display:flex;justify-content:space-between;gap:10px;font-size:15px}.sxi .algo .nodo.on{background:var(--blue2);color:var(--ink)}.sxi .algo .flecha{height:16px;width:2px;background:var(--line);margin-left:24px}.sxi .fin{border-radius:16px;padding:14px 16px;margin-top:6px}.sxi .scmp{display:grid;gap:10px}.sxi .scmp .fila{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}@media(min-width:640px){.sxi .scmp .fila{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}.sxi .scmp .c{border-radius:14px;padding:12px 14px;font-size:15px}.sxi .scmp .c small{display:block;font-weight:700;font-size:13px;margin-bottom:4px}.sxi .pulso{transform-origin:center;transform-box:fill-box;animation:sxipul 2.2s ease-in-out infinite}@keyframes sxipul{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.05;transform:scale(1.7)}}.sxi .resp{transform-origin:center;transform-box:fill-box}@media(prefers-reduced-motion:reduce){.sxi .pulso,.sxi .resp{animation:none!important}.sxi .flip .in{transition:none}}.sxi .hs{cursor:pointer}.sxi .nota{font-size:13px;color:var(--ink2);margin-top:8px}.sxi strong{font-weight:650}.sxi .matriz{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1fr);gap:6px;align-items:stretch;font-size:14px}.sxi .matriz .h{font-weight:600;color:var(--ink2);display:flex;align-items:center;justify-content:center;text-align:center;padding:4px}.sxi .matriz button{min-height:72px;border-radius:14px;border:2px solid transparent;font-weight:650;font-size:14px;line-height:1.25;cursor:pointer;padding:8px 6px;white-space:normal;overflow-wrap:anywhere;hyphens:auto}.sxi .matriz .h{font-size:13px}.sxi .matriz button[aria-pressed=true]{border-color:var(--ink)}.sxi .pasos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;align-items:end;margin:12px 0}.sxi .pasos button{border:0;border-radius:14px 14px 8px 8px;color:#fff;font-weight:700;font-size:15px;cursor:pointer;padding:10px 8px;display:flex;flex-direction:column;justify-content:flex-end;text-align:left;gap:2px}.sxi .pasos button small{font-weight:500;font-size:12.5px;opacity:.95}.sxi .pasos button[aria-pressed=true]{outline:3px solid var(--ink);outline-offset:2px}.sxi .uso{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}@media(min-width:640px){.sxi .uso{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}.sxi .uso .c{border-radius:14px;padding:12px 14px}.sxi .uso .c small{display:block;font-weight:700;font-size:13px;margin-bottom:4px}.sxi .escala{position:relative;margin:14px 0 30px}.sxi .escala .zonas{display:flex;height:22px;border-radius:11px;overflow:hidden}.sxi .escala .zonas i{display:block;height:100%}.sxi .escala .marca{position:absolute;top:-8px;width:4px;height:38px;border-radius:2px;background:var(--ink);transform:translateX(-50%);transition:left .3s}.sxi .escala .et{position:absolute;top:28px;font-size:12.5px;color:var(--ink2);transform:translateX(-50%);white-space:nowrap}.sxi .escala .et:first-of-type{transform:none}.sxi .gauge{position:relative;height:16px;border-radius:8px;background:var(--ctrl);margin:10px 0 22px}.sxi .gauge i{position:absolute;top:0;bottom:0;border-radius:8px;background:var(--ok);transition:width .3s}.sxi .gauge span{position:absolute;top:20px;font-size:12.5px;color:var(--ink2);transform:translateX(-50%)}.sxi .gauge span:nth-of-type(1){transform:none}.sxi .gauge span:last-child{transform:translateX(-100%)}.sxi .chips2{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.sxi .chips2 span{font-size:14px;padding:6px 11px;border-radius:999px;background:var(--ctrl)}.sxi .clase{border-radius:16px;padding:14px;border:2px solid var(--line);background:var(--card);transition:border-color .2s,background .2s}.sxi .clase.elegida{border-color:var(--ok);background:var(--okb)}.sxi .clase.evitar{border-color:var(--no);background:var(--nob)}.sxi .clase h4{margin:0 0 4px;font-size:16px}.sxi .clase .muted{font-size:13.5px}.sxi .clase .sello{display:none;font-size:12.5px;font-weight:700;padding:2px 8px;border-radius:999px;margin-bottom:6px}.sxi .clase.elegida .sello{display:inline-block;background:var(--ok);color:#fff}.sxi .clase.evitar .sello{display:inline-block;background:var(--no);color:#fff}.sxi .escalera{display:grid;gap:6px;grid-template-columns:repeat(4,minmax(0,1fr));align-items:end;margin:12px 0}.sxi .escalera div{border-radius:12px 12px 6px 6px;background:var(--blue2);padding:8px;font-size:13px;text-align:center;display:flex;flex-direction:column;justify-content:flex-end}.sxi .escalera b{font-size:16px;display:block;color:var(--blue)}.sxi .scal{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))}.sxi .scal .col{border-radius:16px;padding:14px;background:var(--ctrl)}.sxi .scal .col h4{margin:0 0 8px;font-size:16px}.sxi .imcbar{position:relative;margin:14px 0 30px}.sxi .imcbar .zonas{display:flex;height:22px;border-radius:11px;overflow:hidden}.sxi .imcbar .zonas i{display:block;height:100%}.sxi .imcbar .marca{position:absolute;top:-8px;width:4px;height:38px;border-radius:2px;background:var(--ink);transform:translateX(-50%);transition:left .3s}.sxi .imcbar .et{position:absolute;top:28px;font-size:12.5px;color:var(--ink2);transform:translateX(-50%);white-space:nowrap}.sxi .escalon{display:grid;gap:8px;grid-template-columns:repeat(4,minmax(0,1fr));align-items:end;margin:12px 0}.sxi .escalon div{border-radius:12px 12px 6px 6px;padding:8px;font-size:13px;display:flex;flex-direction:column;justify-content:flex-end;background:var(--ctrl);color:var(--ink2);transition:background .2s,color .2s}.sxi .escalon div b{font-size:14.5px;color:var(--ink)}.sxi .escalon div.on{background:var(--blue);color:#fff}.sxi .escalon div.on b{color:#fff}@media(max-width:520px){.sxi .escalon{grid-template-columns:repeat(2,minmax(0,1fr))}}.sxi .reloj{position:relative;margin:10px 0 4px}.sxi .reloj .eje2{display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink2);margin-top:4px}.sxi .reloj button{position:relative;display:block;width:100%;text-align:left;border:0;border-radius:10px;padding:0;margin:6px 0;background:var(--ctrl);height:34px;cursor:pointer;overflow:hidden}.sxi .reloj button i{position:absolute;top:0;bottom:0;border-radius:10px}.sxi .reloj button span{position:relative;z-index:1;padding:0 10px;line-height:34px;font-size:13.5px;font-weight:600;white-space:nowrap}.sxi .reloj button[aria-pressed=true]{outline:3px solid var(--ink);outline-offset:1px}.sxi .cmp2{display:grid;gap:8px;grid-template-columns:minmax(0,1fr)}@media(min-width:640px){.sxi .cmp2{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}.sxi .cmp2 .c{border-radius:14px;padding:12px 14px}.sxi .cmp2 .c small{display:block;font-weight:700;font-size:13px;margin-bottom:4px}.sxi .sexo{display:inline-flex;margin-bottom:6px}.sxi .tira{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0}.sxi .tira .pad{width:46px;height:46px;border-radius:10px;border:2px solid var(--line);cursor:pointer;display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff;text-align:center;line-height:1.1}.sxi .tira .tirabase{height:16px;flex:1 1 120px;min-width:120px;border-radius:8px;background:repeating-linear-gradient(90deg,#eee,#eee 8px,#e4e4e4 8px,#e4e4e4 16px)}</style>`);
const ILU=window.SXILU=window.SXILU||{};
ILU["enfermedades-infecciosas-6"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="mapa">Mapa</button><button type="button" data-ir="antibiotico">¿Antibiótico?</button><button type="button" data-ir="resfriado">Resfriado</button><button type="button" data-ir="faringe">Faringe</button><button type="button" data-ir="centor">Centor</button><button type="button" data-ir="dosis">Dosis</button><button type="button" data-ir="complicaciones">Complicaciones</button><button type="button" data-ir="oido">Oído</button><button type="button" data-ir="senos">Senos</button><button type="button" data-ir="influenza">Influenza</button><button type="button" data-ir="alarma">Alarma</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav>
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
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 6.1: faringoamigdalitis pultácea</b><small>Ábrela en tu libro: Enfermedades infecciosas, página 51 del archivo.</small></div></div>
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
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 6.2: síndrome de Lemierre</b><small>Ábrela en tu libro: Enfermedades infecciosas, página 52 del archivo.</small></div></div>
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
 <defs><clipPath id="sxi-cp${svg.id}"><ellipse cx="150" cy="108" rx="118" ry="80"/></clipPath>
 <radialGradient id="sxi-rg${svg.id}" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="${ph}"/><stop offset="1" stop-color="#7a2632"/></radialGradient></defs>
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
ILU["cardiologia-14"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="clasifica">Clasificar</button><button type="button" data-ir="medir">Medir</button><button type="button" data-ir="fenomenos">Bata blanca</button><button type="button" data-ir="evaluacion">Evaluación</button><button type="button" data-ir="secundaria">Secundaria</button><button type="button" data-ir="estilo">Estilo de vida</button><button type="button" data-ir="iniciar">¿Iniciar?</button><button type="button" data-ir="pasos">Pasos</button><button type="button" data-ir="segun">Según paciente</button><button type="button" data-ir="dosis">Dosis</button><button type="button" data-ir="resistente">Resistente</button><button type="button" data-ir="crisis">Crisis</button><button type="button" data-ir="seguimiento">Seguimiento</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-clasifica">
<h2>Clasifica la presión de tu paciente</h2>
<div class="duo">
<div>
<div class="campos"><label>Sistólica (mmHg)<input type="number" id="sxi-sis" value="152" inputmode="numeric"></label><label>Diastólica (mmHg)<input type="number" id="sxi-dia" value="88" inputmode="numeric"></label></div>
<div class="res" id="sxi-resPA"></div>
<p class="nota">El diagnóstico se confirma en al menos <b>dos visitas</b> o con mediciones fuera del consultorio: en casa 135/85 o más; con monitoreo de 24 horas, 135/85 de día y 120/70 de noche.</p>
</div>
<div class="ilu" style="background:var(--aire)"><svg id="sxi-mapaPA" viewBox="0 0 340 262" role="img" aria-label="Gráfica de categorías de presión arterial"></svg></div>
</div>
</section>

<section class="scard glass" id="sxi-medir">
<h2>Cómo medir bien</h2>
<p class="muted">Toca cada número.</p>
<div class="duo">
<div class="ilu" style="background:var(--aire)"><svg id="sxi-sentado" viewBox="0 0 320 260" role="img" aria-label="Persona sentada con el brazo apoyado a la altura del corazón"></svg></div>
<div><div class="spanel" id="sxi-infoMedir"></div>
<ul class="lista" style="margin-top:10px"><li class="muted"><span>La primera vez, mide <b>ambos brazos</b> y usa el más alto. Toma 2 o 3 lecturas separadas 1 a 2 minutos y promedia.</span></li><li class="muted"><span>El protocolo del Instituto Mexicano del Seguro Social confirma con monitoreo en casa: dos mediciones al día por 10 días.</span></li></ul></div>
</div>
</section>

<section class="scard glass" id="sxi-fenomenos">
<h2>Bata blanca, enmascarada y patrón nocturno</h2>
<div class="duo">
<div>
<div class="matriz" id="sxi-matriz"></div>
<div class="spanel" id="sxi-infoMatriz" style="margin-top:10px"></div>
</div>
<div>
<div class="seg" id="sxi-segDip"></div>
<div class="ilu" style="background:var(--aire)"><svg id="sxi-curva24" viewBox="0 0 340 180" role="img" aria-label="Presión durante 24 horas"></svg></div>
<p class="nota" id="sxi-notaDip"></p>
</div>
</div>
<div class="sgrid" style="margin-top:12px">
<div class="dc"><h4>Seudohipertensión del anciano</h4><div class="sub">Arterias rígidas. <b>Signo de Osler:</b> la radial se sigue palpando con el brazalete inflado.</div></div>
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 14.1: monitoreo de 24 horas</b><small>Cardiología, página 142 del archivo.</small></div></div>
</div>
</section>

<section class="scard glass" id="sxi-evaluacion">
<h2>Evaluación inicial</h2>
<div class="sgrid" id="sxi-evalua"></div>
<div class="slot lib" style="margin-top:12px"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 14.3: electrocardiograma con hipertrofia ventricular izquierda</b><small>Cardiología, página 144 del archivo.</small></div></div>
</section>

<section class="scard glass" id="sxi-secundaria">
<h2>Pista clínica, ¿qué causa secundaria?</h2>
<div class="sgrid" id="sxi-flipsSec"></div>
</section>

<section class="scard glass" id="sxi-estilo">
<h2>Estilo de vida para todos</h2>
<div class="sgrid" id="sxi-estiloG"></div>
</section>

<section class="scard glass" id="sxi-iniciar">
<h2>¿Inicio fármaco ya?</h2>
<div class="seg" id="sxi-segGrado"></div>
<div class="crit"><label><input type="checkbox" id="sxi-altoR">Alto riesgo: diabetes, enfermedad renal, enfermedad cardiovascular o daño a órgano blanco</label></div>
<div class="res" id="sxi-resIni"></div>
</section>

<section class="scard glass" id="sxi-pasos">
<h2>Esquema por pasos</h2>
<p class="muted">Toca cada escalón.</p>
<div class="pasos" id="sxi-escPasos"></div>
<div class="spanel" id="sxi-infoPaso"></div>
<div class="sgrid" style="margin-top:10px">
<div class="dc" style="background:var(--nob);border-color:transparent"><h4 style="color:var(--no)">Nunca</h4><div class="sub" style="color:var(--ink)">Combinar un inhibidor de la enzima convertidora de angiotensina con un antagonista del receptor de angiotensina II.</div></div>
<div class="dc"><h4>Betabloqueadores</h4><div class="sub">En cualquier paso si hay indicación: cardiopatía isquémica, insuficiencia cardiaca o control de frecuencia en fibrilación auricular.</div></div>
<div class="slot lib"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 14.4: manejo farmacológico</b><small>Cardiología, página 145 del archivo.</small></div></div>
</div>
</section>

<section class="scard glass" id="sxi-segun">
<h2>¿Qué fármaco según el paciente?</h2>
<div class="seg" id="sxi-segPac"></div>
<div class="uso" id="sxi-usoPac"></div>
</section>

<section class="scard glass" id="sxi-dosis">
<h2>Dosis habituales en adultos</h2>
<div class="sgrid" id="sxi-dosisG"></div>
<p class="nota">Vigila creatinina y potasio a las 1 a 2 semanas de iniciar o subir un inhibidor de la enzima convertidora o un antagonista del receptor de angiotensina.</p>
</section>

<section class="scard glass" id="sxi-resistente">
<h2>Hipertensión resistente</h2>
<p>Fuera de meta con <b>tres fármacos a dosis óptimas, uno de ellos diurético</b>. Antes, descarta la seudorresistencia:</p>
<div class="crit" id="sxi-chkRes"></div>
<div class="res" id="sxi-resRes"></div>
</section>

<section class="scard glass" id="sxi-crisis">
<h2>Crisis hipertensiva: ¿urgencia o emergencia?</h2>
<div class="duo">
<div>
<div class="campos"><label>Sistólica<input type="number" id="sxi-cs" value="196" inputmode="numeric"></label><label>Diastólica<input type="number" id="sxi-cd" value="118" inputmode="numeric"></label></div>
<h3>¿Hay daño agudo?</h3>
<div class="crit" id="sxi-danos"></div>
</div>
<div><div class="res" id="sxi-resCri" style="margin-top:0"></div>
<div class="fin" style="background:var(--nob);margin-top:10px"><b style="color:var(--no)">No uses nifedipino sublingual:</b> la caída brusca puede causar isquemia cerebral o coronaria.</div></div>
</div>
</section>

<section class="scard glass" id="sxi-seguimiento">
<h2>Seguimiento</h2>
<div class="linea" id="sxi-lineaSeg"></div>
<p class="nota">Referir: emergencia hipertensiva, sospecha de hipertensión secundaria, hipertensión resistente, embarazo con hipertensión o daño renal que progresa.</p>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>Lo mexicano frente al CTO</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Cardiología capítulo 14; Guía de Práctica Clínica de hipertensión en el primer nivel (Centro Nacional de Excelencia Tecnológica en Salud, 2021); Protocolo de Atención Integral de hipertensión del Instituto Mexicano del Seguro Social (2022); Harrison 21.ª edición, capítulo 277.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const li=arr=>arr.map(([i,c,b,t])=>`<li><span class="sic" style="background:${b};color:${c}">${ico(i)}</span><span>${t}</span></li>`).join('');
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- Clasificación ---------- */
const X=d=>50+(Math.max(60,Math.min(130,d))-60)/70*280,Y=s=>230-(Math.max(90,Math.min(200,s))-90)/110*210;
const CAT=[['Grado 3',200,130,'#d93a3f'],['Grado 2',180,110,'#ee7a3a'],['Grado 1',160,100,'#f2b13b'],['Normal alta',140,90,'#c8d65a'],['Normal',130,85,'#7cc77a'],['Óptima',120,80,'#33a868']];
function clasif(s,d){if(s>=180||d>=110)return 0;if(s>=160||d>=100)return 1;if(s>=140||d>=90)return 2;if(s>=130||d>=85)return 3;if(s>=120||d>=80)return 4;return 5}
function pa(){const s=parseFloat($('#sxi-sis').value),d=parseFloat($('#sxi-dia').value),ok=!isNaN(s)&&!isNaN(d);
 const svg=$('#sxi-mapaPA');
 svg.innerHTML=CAT.map(([t,ms,md,c])=>`<rect x="${X(60)}" y="${Y(ms)}" width="${X(md)-X(60)}" height="${Y(90)-Y(ms)}" fill="${c}"/>`).join('')+
 CAT.map(([t,ms],i)=>{const lo=i<5?CAT[i+1][1]:90;return `<text x="${X(60)+8}" y="${(Y(ms)+Y(lo))/2+4}" font-size="11.5" font-weight="700" fill="#fff">${t}</text>`}).join('')+
 [80,85,90,100,110,120].map(v=>`<text x="${X(v)}" y="248" text-anchor="middle" font-size="10.5" fill="currentColor" opacity=".7">${v}</text>`).join('')+
 [120,130,140,160,180].map(v=>`<text x="44" y="${Y(v)+4}" text-anchor="end" font-size="10.5" fill="currentColor" opacity=".7">${v}</text>`).join('')+
 `<text x="190" y="261" text-anchor="middle" font-size="10.5" fill="currentColor" opacity=".7">Diastólica</text><text x="12" y="125" font-size="10.5" fill="currentColor" opacity=".7" transform="rotate(-90 12 125)" text-anchor="middle">Sistólica</text>`+
 (ok?`<circle cx="${X(d)}" cy="${Y(s)}" r="12" fill="#fff" opacity=".45" class="pulso"/><circle cx="${X(d)}" cy="${Y(s)}" r="7" fill="#1d1d1f" stroke="#fff" stroke-width="2.5"/>`:'');
 svg.style.color='var(--ink)';
 if(!ok){$('#sxi-resPA').innerHTML='Escribe las dos cifras.';return}
 const i=clasif(s,d),[t,,,c]=CAT[i];let x='';
 if(s>=140&&d<90)x+=' <b>Sistólica aislada</b>: típica del adulto mayor por rigidez arterial.';
 if(s>=180||d>=120)x+=' Cifras de <b>crisis hipertensiva</b>: busca daño agudo de órgano blanco (más abajo).';
 if(i<=2&&!x.includes('crisis'))x+=' Confírmala en otra visita o fuera del consultorio.';
 $('#sxi-resPA').style.background=`color-mix(in srgb,${c} 16%,transparent)`;
 $('#sxi-resPA').innerHTML=`<div class="sn" style="color:${c};font-size:clamp(26px,5vw,36px);min-width:auto">${s}/${d}</div><div><b>${t}.</b>${x}</div>`}
['sis','dia'].forEach(id=>$('#sxi-'+id).addEventListener('input',pa));pa();

/* ---------- Medir ---------- */
const MED=[[1,'Espalda apoyada y 5 minutos de reposo','Sentado, sin hablar. Sin café, tabaco ni ejercicio en los 30 minutos previos y con la vejiga vacía.',104,70],[2,'Brazo apoyado a la altura del corazón','Brazo descubierto y apoyado en la mesa.',196,118],[3,'Brazalete del tamaño correcto','Uno pequeño da cifras falsamente altas.',152,104],[4,'Piernas sin cruzar, pies en el piso','',150,232]];
const sen=$('#sxi-sentado');
function medir(n){sen.innerHTML=`<g fill="none" stroke-linecap="round" stroke-linejoin="round">
 <rect x="208" y="122" width="100" height="10" rx="3" fill="#b9a089" stroke="none"/><path d="M296 132V250M222 132V250" stroke="#b9a089" stroke-width="6"/>
 <path d="M70 60V200M70 160H150M76 200V250M144 166V250" stroke="#8d7a6a" stroke-width="7"/>
 <circle cx="104" cy="44" r="20" fill="var(--piel)" stroke="none"/>
 <path d="M100 66C96 100 96 130 100 160" stroke="var(--pielL)" stroke-width="26"/>
 <path d="M100 160H156" stroke="#3b5a8a" stroke-width="22"/><path d="M156 160V238" stroke="#3b5a8a" stroke-width="18"/><path d="M150 244H176" stroke="#2a2a2a" stroke-width="10"/>
 <path d="M104 84L150 112L210 120" stroke="var(--piel)" stroke-width="14"/>
 <rect x="128" y="94" width="30" height="20" rx="5" fill="#2e6fd1" stroke="none" transform="rotate(31 143 104)"/>
 <path d="M146 108C160 140 176 150 196 150" stroke="#2e6fd1" stroke-width="2.5"/>
 <path d="M60 118H300" stroke="#d93a3f" stroke-width="1.5" stroke-dasharray="5 5"/></g>
 <text x="300" y="112" text-anchor="end" font-size="11" fill="#d93a3f" font-weight="600">altura del corazón</text>
 <path d="M114 124c4-6 12-6 12 0 0 6-6 10-12 14-6-4-12-8-12-14 0-6 8-6 12 0Z" fill="#d93a3f"/>
 ${MED.map(([k,t,,x,y])=>`<g class="hs" data-k="${k}" tabindex="0" role="button" aria-label="${t}"><circle cx="${x}" cy="${y}" r="15" fill="#0071e3" class="pulso"/><circle cx="${x}" cy="${y}" r="12" fill="${k===n?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="2.5"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="800" fill="${k===n?'#fff':'#0071e3'}">${k}</text></g>`).join('')}`;
 const m=MED.find(z=>z[0]===n);$('#sxi-infoMedir').innerHTML=`<div class="muted">Punto ${n} de 4</div><h3 style="margin:2px 0 6px">${m[1]}</h3>${m[2]?`<p>${m[2]}</p>`:''}`}
sen.addEventListener('click',e=>{const g=e.target.closest('.hs');if(g)medir(+g.dataset.k)});
sen.addEventListener('keydown',e=>{const g=e.target.closest('.hs');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();medir(+g.dataset.k)}});
medir(2);

/* ---------- Matriz ---------- */
const MZ={aa:['Hipertensión sostenida','Alta en consultorio y fuera.','var(--no)','var(--nob)'],an:['Bata blanca','Alta en consultorio, normal fuera. Se descarta con monitoreo de 24 horas.','var(--mid)','var(--midb)'],na:['Hipertensión enmascarada','Normal en consultorio, alta fuera. <b>Se trata como hipertensión.</b>','var(--no)','var(--nob)'],nn:['Normotensión','Normal en ambos.','var(--ok)','var(--okb)']};
let mz='an';
function matriz(){$('#sxi-matriz').innerHTML=`<span></span><span class="h">Fuera: alta</span><span class="h">Fuera: normal</span><span class="h">Consultorio: alta</span>${['aa','an'].map(k=>`<button type="button" data-k="${k}" aria-pressed="${k===mz}" style="background:${MZ[k][3]};color:${MZ[k][2]}">${MZ[k][0]}</button>`).join('')}<span class="h">Consultorio: normal</span>${['na','nn'].map(k=>`<button type="button" data-k="${k}" aria-pressed="${k===mz}" style="background:${MZ[k][3]};color:${MZ[k][2]}">${MZ[k][0]}</button>`).join('')}`;
 $('#sxi-infoMatriz').innerHTML=`<b>${MZ[mz][0]}:</b> ${MZ[mz][1]}`}
$('#sxi-matriz').onclick=e=>{const b=e.target.closest('button');if(b){mz=b.dataset.k;matriz()}};matriz();
seg($('#sxi-segDip'),[['dip','Normal: baja de noche'],['non','Non-dipper']],'non',k=>{const H=h=>30+h/24*290,V=v=>150-(v-100)/60*120;
 const day=[[0,118],[6,122],[8,138],[12,142],[16,140],[20,134],[22,128],[24,120]];
 const pts=k==='dip'?[[0,112],[3,110],[6,118],[8,138],[12,142],[16,140],[20,134],[22,122],[24,112]]:[[0,138],[3,136],[6,138],[8,142],[12,144],[16,142],[20,140],[22,139],[24,138]];
 const p=pts.map(([h,v],i)=>(i?'L':'M')+H(h)+' '+V(v)).join('');
 $('#sxi-curva24').innerHTML=`<rect x="${H(22)}" y="20" width="${H(24)-H(22)}" height="130" fill="#0b2340" opacity=".18"/><rect x="${H(0)}" y="20" width="${H(6)-H(0)}" height="130" fill="#0b2340" opacity=".18"/>
 <text x="${H(3)}" y="34" text-anchor="middle" font-size="11" fill="currentColor" opacity=".75">noche</text><text x="${H(14)}" y="34" text-anchor="middle" font-size="11" fill="currentColor" opacity=".75">día</text>
 <line x1="30" y1="150" x2="320" y2="150" stroke="currentColor" opacity=".3"/>${[0,6,12,18,24].map(h=>`<text x="${H(h)}" y="166" text-anchor="middle" font-size="10.5" fill="currentColor" opacity=".7">${h} h</text>`).join('')}
 <path d="${p}" fill="none" stroke="${k==='dip'?'#0a9f4a':'#d93a3f'}" stroke-width="4" stroke-linejoin="round"/>`;
 $('#sxi-curva24').style.color='var(--ink)';
 $('#sxi-notaDip').innerHTML=k==='dip'?'Lo normal: la presión <b>baja de noche</b> (con monitoreo de 24 horas, menos de 120/70 de noche).':'<b>Non-dipper:</b> la presión no baja de noche. Obliga a buscar <b>apnea obstructiva del sueño</b>.'});

/* ---------- Evaluación ---------- */
$('#sxi-evalua').innerHTML=[['lab','Laboratorio','Glucosa, creatinina con filtración glomerular, sodio y potasio, perfil de lípidos, ácido úrico, biometría hemática y examen general de orina con albuminuria.'],['ecg','Electrocardiograma','Busca hipertrofia ventricular izquierda.'],['ojo','Fondo de ojo','Daño en retina.'],['cor','Riesgo cardiovascular global','Y daño a órgano blanco: corazón, riñón, cerebro, retina y arterias periféricas.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--blue)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Secundaria ---------- */
flips($('#sxi-flipsSec'),[['Hipertensión con hipopotasemia y alcalosis metabólica','Hiperaldosteronismo primario.'],['Crisis de cefalea, sudoración y palpitaciones','Feocromocitoma.'],['Creatinina sube más de 30% al iniciar enalapril o losartán','Estenosis de arteria renal.'],['Ronquido, somnolencia de día y obesidad','Apnea obstructiva del sueño.'],['Inicio antes de los 30 años o descontrol súbito','Sospecha de causa secundaria: búscala.'],['Toma antiinflamatorios, anticonceptivos o corticoides','Causa farmacológica. También descongestionantes y alcohol.']]);

/* ---------- Estilo ---------- */
$('#sxi-estiloG').innerHTML=[['sal','Sal','Menos de 5 g','al día: una cucharadita'],['correr','Ejercicio','30 minutos','al día, 5 a 7 días por semana'],['pesa','Peso','−5 kg = −5/−3','mmHg de sistólica y diastólica, aproximadamente'],['copa','Alcohol','Menos de 20 g','al día en hombres; menos de 10 g en mujeres'],['plato','Dieta','Frutas y verduras','dieta para detener la hipertensión'],['humo','Tabaco','Dejarlo','']].map(([i,t,b,s])=>`<div class="dc"><h4>${ico(i,'var(--teal)')}${t}</h4><div class="sbig" style="font-size:21px">${b}</div><div class="sub">${s}</div></div>`).join('');

/* ---------- Iniciar ---------- */
let gr='g1';
function ini(){const ar=$('#sxi-altoR').checked;let t,c;
 if(gr==='na'){t='<b>No se dan fármacos.</b> Solo estilo de vida.';c='ok'}
 else if(gr==='g1'&&!ar){t='<b>Estilo de vida 3 a 6 meses</b>; si no se controla, fármaco.';c='mid'}
 else{t='<b>Fármaco desde el inicio</b>, junto con estilo de vida.';c='no'}
 $('#sxi-resIni').style.background=`var(--${c}b)`;$('#sxi-resIni').innerHTML=`<div style="color:var(--${c});display:flex">${ico(c==='no'?'pild':c==='ok'?'ok':'reloj')}</div><div>${t}</div>`}
seg($('#sxi-segGrado'),[['na','Normal alta'],['g1','Grado 1'],['g2','Grado 2'],['g3','Grado 3']],'g1',k=>{gr=k;ini()});
$('#sxi-altoR').addEventListener('change',ini);

/* ---------- Pasos ---------- */
const PS=[['Paso 1','Doble terapia','#0071e3',90,'<b>Inhibidor de la enzima convertidora de angiotensina o antagonista del receptor de angiotensina II</b> más <b>calcioantagonista o diurético tiazídico</b>, de preferencia en una sola tableta. Monoterapia solo en grado 1 de bajo riesgo o en adultos mayores frágiles.'],['Paso 2','Triple terapia','#5a4fd6',130,'Los <b>tres grupos juntos</b>: inhibidor de la enzima convertidora o antagonista del receptor de angiotensina, calcioantagonista y tiazida.'],['Paso 3','Más espironolactona','#a03ad0',170,'Agrega <b>espironolactona</b>. Revisa antes el potasio y la función renal.']];
let ps=0;
function pasos(){$('#sxi-escPasos').innerHTML=PS.map(([a,b,c,h],i)=>`<button type="button" aria-pressed="${i===ps}" data-i="${i}" style="height:${h}px;background:${c}">${a}<small>${b}</small></button>`).join('');$('#sxi-infoPaso').innerHTML=`<b>${PS[ps][0]}:</b> ${PS[ps][4]}`}
$('#sxi-escPasos').onclick=e=>{const b=e.target.closest('button');if(b){ps=+b.dataset.i;pasos()}};pasos();

/* ---------- Según paciente ---------- */
const PA={dm:['Inhibidor de la enzima convertidora o antagonista del receptor de angiotensina II.','—','Diabetes, albuminuria o enfermedad renal crónica'],viejo:['Calcioantagonista o tiazida.','—','Adulto mayor con sistólica aislada'],emb:['Alfametildopa, labetalol o nifedipino.','Inhibidores de la enzima convertidora y antagonistas del receptor de angiotensina: contraindicados.','Embarazo'],hpb:['Alfabloqueador como fármaco agregado.','—','Hiperplasia prostática'],asma:['Los grupos del paso 1.','Betabloqueadores.','Asma'],gota:['Los otros grupos.','Tiazidas.','Gota'],tos:['Cambiar a un antagonista del receptor de angiotensina II.','Seguir con enalapril.','Tos seca con enalapril'],edema:['Es efecto de clase de las dihidropiridinas, no insuficiencia cardiaca.','—','Edema de tobillos con amlodipino']};
seg($('#sxi-segPac'),Object.entries(PA).map(([k,v])=>[k,v[2]]),'emb',k=>{const [u,e]=PA[k];$('#sxi-usoPac').innerHTML=`<div class="c" style="background:var(--okb)"><small style="color:var(--ok)">Usa</small>${u}</div><div class="c" style="background:var(--nob)"><small style="color:var(--no)">Evita</small>${e}</div>`});

/* ---------- Dosis ---------- */
$('#sxi-dosisG').innerHTML=[['Losartán','50 mg','una vez al día; rango de 25 a 100 mg'],['Enalapril','5 mg al día','2.5 mg si toma diurético; mantenimiento 10 a 40 mg al día en 1 o 2 tomas'],['Amlodipino','5 mg','una vez al día, máximo 10 mg; 2.5 mg en adultos mayores frágiles'],['Hidroclorotiazida o clortalidona','12.5 a 25 mg','una vez al día']].map(([t,b,s])=>`<div class="dc"><h4>${ico('pild','var(--blue)')}${t}</h4><div class="sbig">${b}</div><div class="sub">${s}</div></div>`).join('');

/* ---------- Resistente ---------- */
const RS=['Falta de apego (la causa más frecuente)','Mala técnica de medición','Bata blanca: confirmada con monitoreo de 24 horas','Exceso de sal','Antiinflamatorios u otros fármacos que suben la presión'];
$('#sxi-chkRes').innerHTML=RS.map((t,i)=>`<label><input type="checkbox" data-i="${i}">Descartado: ${t}</label>`).join('');
function res(){const n=[...$('#sxi-chkRes').querySelectorAll('input')].filter(x=>x.checked).length,all=n===RS.length;
 $('#sxi-resRes').style.background=all?'var(--okb)':'var(--ctrl)';
 $('#sxi-resRes').innerHTML=`<div class="sn" style="color:${all?'var(--ok)':'var(--ink2)'};font-size:clamp(30px,6vw,40px)">${n}/${RS.length}</div><div>${all?'<b>Es resistente de verdad.</b> Cuarto fármaco: <b>espironolactona</b>. Busca causa secundaria y refiere a cardiología o medicina interna.':'Marca lo que ya descartaste antes de llamarla resistente.'}</div>`}
$('#sxi-chkRes').addEventListener('change',res);res();

/* ---------- Crisis ---------- */
const DN=[['cerebro','Encefalopatía o evento vascular cerebral'],['cor','Síndrome coronario agudo'],['pulm','Edema pulmonar'],['alerta','Disección aórtica'],['rinon','Lesión renal aguda'],['emb','Eclampsia']];
$('#sxi-danos').innerHTML=DN.map(([i,t],k)=>`<label>${ico(i,'var(--no)')}<input type="checkbox" data-k="${k}">${t}</label>`).join('');
function cri(){const s=parseFloat($('#sxi-cs').value),d=parseFloat($('#sxi-cd').value),dan=[...$('#sxi-danos').querySelectorAll('input')].some(x=>x.checked),cr=s>=180||d>=120;let t,c;
 if(dan&&cr){t='<b>Emergencia hipertensiva.</b> Daño agudo de órgano blanco: <b>referencia inmediata</b> para tratamiento intravenoso.';c='no'}
 else if(cr){t='<b>Urgencia hipertensiva.</b> Sin daño agudo: fármacos <b>orales</b>, bajar de forma gradual en <b>24 a 48 horas</b>; revisa el apego y cita pronto.';c='mid'}
 else if(dan){t='No llega a cifras de crisis, pero hay datos de daño agudo: valora y refiere a urgencias según el cuadro.';c='mid'}
 else{t='No es crisis hipertensiva (crisis: 180 o más de sistólica y/o 120 o más de diastólica).';c='ok'}
 $('#sxi-resCri').style.background=`var(--${c}b)`;$('#sxi-resCri').innerHTML=`<div class="sn" style="color:var(--${c});font-size:clamp(26px,5vw,34px);min-width:auto">${isNaN(s)?'–':s}/${isNaN(d)?'–':d}</div><div>${t}</div>`}
['cs','cd'].forEach(id=>$('#sxi-'+id).addEventListener('input',cri));$('#sxi-danos').addEventListener('change',cri);cri();

/* ---------- Seguimiento ---------- */
$('#sxi-lineaSeg').innerHTML=[['Revalorar 2 a 4 semanas después de iniciar o ajustar',0,4,'var(--blue)'],['Meta alcanzada en unos 3 meses',0,13,'var(--ok)'],['Ya controlado: cada 3 a 6 meses',13,26,'var(--teal)']].map(([t,a,b,c])=>`<div class="fil"><small style="color:${c}">${t}</small><div class="pista"><i style="left:${a/26*100}%;width:${(b-a)/26*100}%;background:${c}"></i></div></div>`).join('')+`<div class="ej"><span class="mk" style="left:0">Semana 0</span><span class="mk" style="left:${13/26*100}%">3 meses</span><span class="mk" style="left:100%">6 meses</span></div>`;

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Cómo se confirma el diagnóstico?','Dos visitas o mediciones fuera del consultorio; la bata blanca se descarta con monitoreo de 24 horas.'],['¿Con cuántos fármacos se inicia casi siempre?','Doble terapia. Monoterapia solo en grado 1 de bajo riesgo o anciano frágil.'],['¿Cuarto fármaco en la resistente?','Espironolactona.'],['¿Antihipertensivo en el embarazo?','Alfametildopa. Nunca inhibidores de la enzima convertidora ni antagonistas del receptor de angiotensina.'],['¿Hipopotasemia más hipertensión?','Hiperaldosteronismo primario.'],['¿Urgencia frente a emergencia?','Urgencia sin daño: orales y bajar gradual. Emergencia con daño: intravenoso y referencia.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Meta de presión','Menor de 130/80 si se tolera; adulto mayor frágil, sistólica de 140 a 150.','Menor de 130/80 sin bajar de 110/70; menor de 140/90 en el adulto mayor.'],['Doble terapia inicial','Inhibidor de la enzima convertidora o antagonista del receptor de angiotensina más calcioantagonista o tiazida.','Inhibidor de la enzima convertidora o antagonista del receptor de angiotensina más indapamida o hidroclorotiazida; calcioantagonista como segundo paso a las 2 semanas, o desde el inicio con riesgo cardiometabólico o diabetes.'],['Umbral de diagnóstico','140/90 (guías europeas).','140/90. La guía de Estados Unidos usa 130/80, pero en el ENARM (Examen Nacional de Aspirantes a Residencias Médicas) se usa 140/90.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--blue2)"><small style="color:var(--blue)">CTO (guías europeas)</small>${g}</div><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">México (Instituto Mexicano del Seguro Social)</small>${a}</div></div></div>`).join('');
}};
ILU["endocrinologia-5"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="mapa">Mapa</button><button type="button" data-ir="diagnostico">Diagnóstico</button><button type="button" data-ir="tamizaje">Tamizaje</button><button type="button" data-ir="metas">Metas</button><button type="button" data-ir="estilo">Estilo de vida</button><button type="button" data-ir="metformina">Metformina</button><button type="button" data-ir="plan">Tratamiento</button><button type="button" data-ir="adversos">Efectos adversos</button><button type="button" data-ir="insulina">Insulina</button><button type="button" data-ir="hipoglucemia">Hipoglucemia</button><button type="button" data-ir="vigilancia">Vigilancia</button><button type="button" data-ir="referir">Referir</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-mapa">
<h2>Qué revisar en el paciente con diabetes</h2>
<p class="muted">Toca cada órgano. La diabetes tipo 2 es resistencia a la insulina más falla progresiva de la célula beta.</p>
<div class="duo">
<div class="ilu" style="background:var(--aire)"><svg id="sxi-cuerpo" viewBox="0 0 320 430" role="img" aria-label="Silueta con ojos, corazón, páncreas, riñones y pies"></svg></div>
<div><div class="seg" id="sxi-segCuerpo"></div><div class="spanel" id="sxi-infoCuerpo"></div></div>
</div>
</section>

<section class="scard glass" id="sxi-diagnostico">
<h2>¿Normal, prediabetes o diabetes?</h2>
<p class="muted">Elige la prueba y escribe el resultado.</p>
<div class="seg" id="sxi-segPrueba"></div>
<div class="campos"><label><span id="sxi-lblValor">Glucosa en ayuno (mg/dL)</span><input type="number" id="sxi-valor" step="0.1" inputmode="decimal" value="118"></label></div>
<div class="escala" id="sxi-escala"></div>
<div class="res" id="sxi-resDx"></div>
<p class="nota" id="sxi-notaDx"></p>
<div class="slot lib" style="margin-top:12px"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 5.1: niveles normales y patológicos de glucemia</b><small>Endocrinología, página 100 del archivo.</small></div></div>
</section>

<section class="scard glass" id="sxi-tamizaje">
<h2>A quién buscarle diabetes</h2>
<div class="duo">
<div>
<div class="res" style="background:var(--blue2)"><div class="sn" style="color:var(--blue)">35</div><div><b>Todo adulto desde los 35 años.</b> Antes, si tiene índice de masa corporal de 25 o más y al menos un factor de riesgo.</div></div>
<h3>Factores de riesgo</h3>
<div class="chips2"><span>Familiar de primer grado con diabetes</span><span>Origen latino</span><span>Hipertensión</span><span>Enfermedad cardiovascular</span><span>Colesterol de alta densidad menor de 35</span><span>Triglicéridos mayores de 250</span><span>Síndrome de ovario poliquístico</span><span>Sedentarismo</span><span>Acantosis nigricans</span><span>Diabetes gestacional o recién nacido de más de 4 kg</span></div>
<p>Si sale normal, repetir <strong>cada 3 años</strong>. Con diabetes gestacional previa, al menos cada 3 años de por vida.</p>
</div>
<figure class="foto"><img src="img/estudio/acantosis-nigricans.jpg" width="720" height="684" loading="lazy" decoding="async" alt="Piel engrosada, oscura y aterciopelada en el codo"><figcaption><b>Acantosis nigricans:</b> piel engrosada, oscura y aterciopelada en pliegues; marcador de resistencia a la insulina.<small>Foto: Vassia Atanassova (Spiritia). Licencia Creative Commons Atribución-CompartirIgual 4.0. <a href="https://commons.wikimedia.org/wiki/File:Acanthosis_negricans_-_elbow_(cropped).jpg" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons</a></small></figcaption></figure>
</div>
</section>

<section class="scard glass" id="sxi-metas">
<h2>Metas de control</h2>
<div class="seg" id="sxi-segMeta"></div>
<div class="res" style="background:var(--okb)" id="sxi-resMeta"></div>
<div class="gauge" id="sxi-gauge"></div>
<div class="sgrid">
<div class="dc"><h4>Glucosa en ayuno o antes de comer</h4><div class="sbig">80 a 130</div><div class="sub">mg/dL</div></div>
<div class="dc"><h4>Glucosa 2 horas después de comer</h4><div class="sbig">Menor de 180</div><div class="sub">mg/dL</div></div>
<div class="dc"><h4>Presión arterial</h4><div class="sbig">Menor de 130/80</div><div class="sub">mmHg</div></div>
<div class="dc"><h4>Colesterol de baja densidad</h4><div class="sbig">Menor de 70 o 100</div><div class="sub">Muy alto riesgo menor de 70; alto riesgo menor de 100 mg/dL</div></div>
<div class="dc"><h4>Peso</h4><div class="sbig">Bajar 5 a 10%</div><div class="sub">si hay sobrepeso u obesidad</div></div>
</div>
</section>

<section class="scard glass" id="sxi-estilo">
<h2>Sin fármacos, para todos</h2>
<ul class="lista" id="sxi-listaEstilo"></ul>
<h3>Una semana de ejercicio</h3>
<div class="escalera" id="sxi-semana" style="grid-template-columns:repeat(7,minmax(0,1fr))"></div>
<p class="nota">Al menos 150 minutos por semana de ejercicio aeróbico moderado en 3 o más días, más fuerza 2 veces por semana.</p>
</section>

<section class="scard glass" id="sxi-metformina">
<h2>Metformina: el primer fármaco</h2>
<div class="escalera" id="sxi-escMet"></div>
<p class="nota">Inicio: 500 mg cada 12 horas u 850 mg una vez al día, con alimentos. Subir 500 mg por semana. Máximo 2,550 mg al día.</p>
<h3>¿Puedo darla con esta función renal?</h3>
<div class="campos"><label>Filtración glomerular (mL/min/1.73 m²)<input type="range" id="sxi-tfg" min="5" max="120" value="52" style="width:min(100%,320px);accent-color:var(--blue)"></label></div>
<div class="res" id="sxi-resTfg"></div>
<div class="chips2"><span>Náusea, diarrea y distensión al inicio</span><span>Deficiencia de vitamina B12 con el uso prolongado</span><span>Acidosis láctica: rara</span><span>Suspender antes de contraste yodado</span></div>
<p class="nota">Si no se tolera: presentación de liberación prolongada o cambiar a un inhibidor de la dipeptidil peptidasa 4.</p>
</section>

<section class="scard glass" id="sxi-plan">
<h2>Arma el tratamiento de tu paciente</h2>
<div class="duo">
<div>
<div class="campos"><label>Hemoglobina glucosilada (%)<input type="number" id="sxi-hba" step="0.1" value="8.8" inputmode="decimal"></label><label>Glucosa (mg/dL)<input type="number" id="sxi-glu" value="190" inputmode="numeric"></label></div>
<div class="crit" id="sxi-perfil" style="margin-top:10px"></div>
</div>
<div><div class="algo" id="sxi-algoPlan"></div></div>
</div>
<h3>Las clases de fármacos</h3>
<div class="sgrid" id="sxi-clases"></div>
<p class="nota"><b>No combinar</b> un inhibidor de la dipeptidil peptidasa 4 con un agonista del péptido similar al glucagón tipo 1.</p>
<div class="slot lib" style="margin-top:12px"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 5.11: algoritmo de manejo farmacológico</b><small>Endocrinología, página 121 del archivo. La figura 5.10 (página 119) resume los fármacos.</small></div></div>
</section>

<section class="scard glass" id="sxi-adversos">
<h2>Efectos adversos que más se preguntan</h2>
<div class="sgrid" id="sxi-flipsAdv"></div>
</section>

<section class="scard glass" id="sxi-insulina">
<h2>Insulina basal: inicio y ajuste</h2>
<p><b>Desde el inicio</b> si hay pérdida de peso o cetosis, hemoglobina glucosilada mayor de 10% o glucosa de 300 mg/dL o más.</p>
<div class="duo">
<div>
<div class="campos"><label>Peso en kilos<input type="number" id="sxi-pesoIns" value="80" inputmode="decimal"></label></div>
<div class="seg" id="sxi-segIns"></div>
<div class="sgrid" id="sxi-dosisIns"></div>
</div>
<div>
<h3 style="margin-top:4px">Ajuste semanal de glargina</h3>
<div class="campos"><label>Promedio de glucosa en ayuno (mg/dL)<input type="number" id="sxi-ayunoProm" value="165" inputmode="numeric"></label></div>
<div class="res" id="sxi-resAjuste"></div>
<div class="linea" id="sxi-lineaAjuste"></div>
</div>
</div>
<p class="nota">Al iniciar insulina se suspenden sulfonilureas y pioglitazona; la metformina se mantiene.</p>
<div class="slot lib" style="margin-top:12px"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 5.9: pautas de tratamiento con insulina</b><small>Endocrinología, página 118 del archivo.</small></div></div>
</section>

<section class="scard glass" id="sxi-hipoglucemia">
<h2>Hipoglucemia: regla 15-15</h2>
<div class="duo">
<div class="ilu" style="background:var(--blue2)"><svg id="sxi-ciclo" viewBox="0 0 300 260" role="img" aria-label="Ciclo de la regla 15-15"></svg></div>
<div>
<p>Glucosa <b>menor de 70 mg/dL</b>. Síntomas adrenérgicos (temblor, sudoración, palpitaciones) y neuroglucopénicos (confusión, convulsiones).</p>
<div class="fin" style="background:var(--nob)"><b style="color:var(--no)">Inconsciente:</b> glucagón intramuscular o glucosa intravenosa al 50%.</div>
<p class="nota">Los betabloqueadores pueden <b>ocultar</b> los síntomas adrenérgicos.</p>
</div>
</div>
<div class="slot lib" style="margin-top:12px"><div class="marco"><svg class="ico"><use href="#sxi-i-libro"/></svg></div><div><b>Mira en tu CTO la figura 5.3: tratamiento de la hipoglucemia</b><small>Endocrinología, página 109 del archivo.</small></div></div>
</section>

<section class="scard glass" id="sxi-vigilancia">
<h2>Qué revisar y cada cuándo</h2>
<div class="scal" id="sxi-cal"></div>
<p class="nota">Estatina de intensidad moderada en diabéticos de 40 a 75 años; de alta intensidad si ya hay enfermedad cardiovascular.</p>
</section>

<section class="scard glass" id="sxi-referir">
<h2>Cuándo referir</h2>
<div class="sgrid" id="sxi-alarmas"></div>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>Lo mexicano frente al CTO</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Endocrinología capítulo 5; Guía de Práctica Clínica GPC-IMSS-718-18; Protocolo de Atención Integral de diabetes del Instituto Mexicano del Seguro Social (2022); Harrison 21.ª edición.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const fmt=n=>Math.round(n).toLocaleString('es-MX');
const li=arr=>arr.map(([i,c,b,t])=>`<li><span class="sic" style="background:${b};color:${c}">${ico(i)}</span><span>${t}</span></li>`).join('');
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- Cuerpo ---------- */
const ORG={
 ojos:{t:'Ojos',x:171,y:50,lx:212,ly:20,d:'Retinopatía',txt:'<b>Fondo de ojo cada año</b> desde el diagnóstico. Cualquier alteración: referir a oftalmología.'},
 cor:{t:'Corazón',x:176,y:142,lx:226,ly:112,d:'Riesgo cardiovascular',txt:'Presión <b>menor de 130/80</b>. Estatina de intensidad moderada de 40 a 75 años; alta intensidad si ya hay enfermedad cardiovascular. Con enfermedad cardiovascular, insuficiencia cardiaca o enfermedad renal: agregar un inhibidor del cotransportador sodio-glucosa tipo 2 o un agonista del péptido similar al glucagón tipo 1.'},
 pan:{t:'Páncreas',x:160,y:176,lx:6,ly:150,d:'Cómo se produce',txt:'<b>Resistencia a la insulina</b> más <b>falla progresiva de la célula beta</b>. Casi siempre con sobrepeso, obesidad abdominal y sedentarismo.'},
 rin:{t:'Riñones',x:134,y:204,lx:6,ly:214,d:'Nefropatía',txt:'<b>Cociente albúmina/creatinina en orina y filtración glomerular cada año.</b> Albuminuria de 30 mg/g o más, confirmada en 2 de 3 muestras en 3 a 6 meses. Referir a nefrología con más de 300 mg/g o si la filtración cae rápido.'},
 pies:{t:'Pies',x:196,y:404,lx:224,ly:362,d:'Pie diabético',txt:'Revisar los pies <b>en cada consulta</b>. Exploración completa cada año con <b>monofilamento de 10 g</b> y diapasón de 128 Hz. Pie infectado o con isquemia: urgencias.'}};
const cu=$('#sxi-cuerpo');
function cuerpo(sel){const on=k=>k===sel,hl=k=>on(k)?'stroke="#0071e3" stroke-width="3"':'';
 cu.innerHTML=`<defs><linearGradient id="gpc" x1="0" x2="1"><stop offset="0" stop-color="var(--piel)"/><stop offset="1" stop-color="var(--pielL)"/></linearGradient></defs>
 <g fill="url(#gpc)" stroke="rgba(0,0,0,.12)">
 <circle cx="160" cy="50" r="30"/><rect x="150" y="76" width="20" height="22" rx="6"/>
 <path d="M110 100Q160 88 210 100L224 236Q160 254 96 236Z"/>
 <path d="M112 104L84 222" stroke="url(#gpc)" stroke-width="22" stroke-linecap="round"/><path d="M208 104L236 222" stroke="url(#gpc)" stroke-width="22" stroke-linecap="round"/>
 <path d="M138 240L130 392" stroke="url(#gpc)" stroke-width="28" stroke-linecap="round"/><path d="M182 240L190 392" stroke="url(#gpc)" stroke-width="28" stroke-linecap="round"/>
 </g>
 <ellipse cx="124" cy="404" rx="24" ry="11" fill="${on('pies')?'#ff8a8a':'var(--pielL)'}" ${hl('pies')}/><ellipse cx="196" cy="404" rx="24" ry="11" fill="${on('pies')?'#ff8a8a':'var(--pielL)'}" ${hl('pies')}/>
 <circle cx="149" cy="48" r="5" fill="${on('ojos')?'#0071e3':'#4b3a33'}"/><circle cx="171" cy="48" r="5" fill="${on('ojos')?'#0071e3':'#4b3a33'}"/>
 <path d="M176 156C160 146 152 138 152 130a8 8 0 0 1 16-4 8 8 0 0 1 16 4c0 8-8 16-8 26Z" transform="translate(-2 -4)" fill="${on('cor')?'#ff3b4d':'#d8434f'}" ${hl('cor')}/>
 <path d="M136 178C150 168 176 168 192 172C198 174 196 182 188 182C170 182 152 186 140 186C132 186 130 182 136 178Z" fill="${on('pan')?'#ffc46b':'#efb07a'}" ${hl('pan')}/>
 <path d="M128 192c-8 0-10 12-6 20s12 8 14 2-2-8 0-12-2-10-8-10Z" fill="${on('rin')?'#e2474f':'#a83444'}" ${hl('rin')}/><path d="M192 192c8 0 10 12 6 20s-12 8-14 2 2-8 0-12 2-10 8-10Z" fill="${on('rin')?'#e2474f':'#a83444'}" ${hl('rin')}/>
 ${Object.entries(ORG).map(([k,z])=>{const w=z.t.length*7.4+24,cx=z.lx+w/2;return `<g class="hs" data-k="${k}" tabindex="0" role="button" aria-label="${z.t}">
 <line x1="${cx}" y1="${z.ly+13}" x2="${z.x}" y2="${z.y}" stroke="${on(k)?'#0071e3':'rgba(0,0,0,.35)'}" stroke-width="1.5" stroke-dasharray="3 3"/>
 <circle cx="${z.x}" cy="${z.y}" r="15" fill="#0071e3" class="pulso"/><circle cx="${z.x}" cy="${z.y}" r="6" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="2.5"/>
 <rect x="${z.lx}" y="${z.ly}" width="${w}" height="26" rx="13" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="1.5"/>
 <text x="${cx}" y="${z.ly+17.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${on(k)?'#fff':'#0071e3'}">${z.t}</text></g>`}).join('')}`;}
const sc=$('#sxi-segCuerpo');
function org(k){cuerpo(k);const z=ORG[k];$('#sxi-infoCuerpo').innerHTML=`<div class="muted">${z.t}</div><h3 style="margin:2px 0 6px">${z.d}</h3><p>${z.txt}</p>`;sc.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k))}
sc.innerHTML=Object.entries(ORG).map(([k,z])=>`<button type="button" data-k="${k}">${z.t}</button>`).join('');
sc.onclick=e=>{const b=e.target.closest('button');if(b)org(b.dataset.k)};
cu.addEventListener('click',e=>{const g=e.target.closest('.hs');if(g)org(g.dataset.k)});
cu.addEventListener('keydown',e=>{const g=e.target.closest('.hs');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();org(g.dataset.k)}});
org('rin');

/* ---------- Diagnóstico ---------- */
const PR={
 ay:{l:'Glucosa en ayuno (mg/dL)',min:60,max:200,c:[100,126],v:118,e:['Normal','Prediabetes: glucosa alterada en ayuno','Diabetes'],n:'Ayuno de al menos 8 horas.'},
 cu:{l:'Glucosa a las 2 horas de la curva con 75 g (mg/dL)',min:80,max:300,c:[140,200],v:165,e:['Normal','Prediabetes: intolerancia a la glucosa','Diabetes'],n:'Curva de tolerancia oral con 75 g de glucosa.'},
 hb:{l:'Hemoglobina glucosilada (%)',min:4,max:10,c:[5.7,6.5],v:6.1,e:['Normal','Prediabetes','Diabetes'],n:'No sirve en anemia de células falciformes, embarazo en segundo y tercer trimestre, hemodiálisis, transfusión o tratamiento con eritropoyetina: usa solo criterios de glucosa.'},
 az:{l:'Glucosa al azar con síntomas clásicos (mg/dL)',min:80,max:400,c:[200,200],v:240,e:['No establece el diagnóstico','','Diabetes'],n:'Síntomas clásicos: poliuria, polidipsia, polifagia y pérdida de peso, o crisis hiperglucémica.'}};
let pr='ay';
function dx(){const P=PR[pr],v=parseFloat($('#sxi-valor').value),span=P.max-P.min,pc=x=>Math.max(0,Math.min(100,(x-P.min)/span*100));
 const z=pr==='az'?[[P.min,200,'var(--line)'],[200,P.max,'var(--no)']]:[[P.min,P.c[0],'var(--ok)'],[P.c[0],P.c[1],'var(--mid)'],[P.c[1],P.max,'var(--no)']];
 $('#sxi-escala').innerHTML=`<div class="zonas">${z.map(([a,b,c])=>`<i style="width:${(b-a)/span*100}%;background:${c}"></i>`).join('')}</div>${isNaN(v)?'':`<div class="marca" style="left:${pc(v)}%"></div>`}<span class="et" style="left:0">${P.min}</span>${[...new Set(P.c)].map(c=>`<span class="et" style="left:${pc(c)}%">${c}</span>`).join('')}`;
 let i=isNaN(v)?-1:v>=P.c[1]?2:v>=P.c[0]?1:0;const col=['var(--ok)','var(--mid)','var(--no)'][i]||'var(--ink2)',bg=['var(--okb)','var(--midb)','var(--nob)'][i]||'var(--ctrl)';
 let txt=i<0?'Escribe un valor.':P.e[i];
 if(pr==='az'&&i===0)txt+='. Pide glucosa en ayuno, curva o hemoglobina glucosilada.';
 if(i===2)txt+=pr==='az'?'. <b>Basta sola: no requiere confirmación.</b>':'. <b>Confírmala</b> con una segunda prueba alterada: la misma repetida o una distinta.';
 if(i===1)txt+='. Vigilar <b>cada año</b> y tratar los factores de riesgo cardiovascular.';
 $('#sxi-resDx').style.background=bg;$('#sxi-resDx').innerHTML=`<div class="sn" style="color:${col};font-size:clamp(34px,6vw,46px)">${isNaN(v)?'–':v}</div><div>${txt}</div>`;
 $('#sxi-notaDx').innerHTML=P.n+(pr!=='az'?' Si dos pruebas distintas no coinciden, se repite la que salió alterada.':'');}
seg($('#sxi-segPrueba'),[['ay','Ayuno'],['cu','Curva 2 horas'],['hb','Hemoglobina glucosilada'],['az','Al azar con síntomas']],'ay',k=>{pr=k;$('#sxi-lblValor').textContent=PR[k].l;$('#sxi-valor').value=PR[k].v;dx()});
$('#sxi-valor').addEventListener('input',dx);

/* ---------- Metas ---------- */
const MT={jov:[6.5,'Menor de 6.5%','Jóvenes, con poca evolución y sin riesgo de hipoglucemia.'],may:[7,'Menor de 7%','La mayoría de los adultos.'],fra:[8,'Menor de 8%','Adultos mayores frágiles, hipoglucemias graves, poca expectativa de vida o complicaciones avanzadas (hasta 8.5%).']};
seg($('#sxi-segMeta'),[['jov','Joven sin hipoglucemias'],['may','La mayoría'],['fra','Adulto mayor frágil']],'may',k=>{const [v,t,d]=MT[k];
 $('#sxi-resMeta').innerHTML=`<div class="sn" style="color:var(--ok);font-size:clamp(30px,6vw,44px)">${v}%</div><div><b>Hemoglobina glucosilada ${t.toLowerCase()}.</b> ${d}</div>`;
 const pc=x=>(x-5)/5*100;$('#sxi-gauge').innerHTML=`<i style="width:${pc(v)}%"></i>${[5,6,7,8,9,10].map(x=>`<span style="left:${pc(x)}%">${x}%</span>`).join('')}`;});

/* ---------- Estilo de vida ---------- */
$('#sxi-listaEstilo').innerHTML=li([['plato','var(--ok)','var(--okb)','Plan de alimentación con nutrición: menos azúcares simples y <b>bebidas azucaradas</b>; porciones con el plato del bien comer.'],['correr','var(--ok)','var(--okb)','<b>150 minutos por semana</b> de ejercicio aeróbico moderado, en 3 o más días.'],['pesa','var(--ok)','var(--okb)','Ejercicios de <b>fuerza 2 veces por semana</b>.'],['humo','var(--ok)','var(--okb)','Dejar de fumar.'],['pie','var(--ok)','var(--okb)','Educación en diabetes y <b>autocuidado de los pies</b>.']]);
$('#sxi-semana').innerHTML=[['Lun',30,1],['Mar',0,1],['Mié',30,0],['Jue',0,1],['Vie',30,0],['Sáb',30,0],['Dom',30,0]].map(([d,m,f])=>`<div style="height:${40+m*2.2}px;${m?'':'background:var(--ctrl)'}"><b>${m?m:'–'}</b>${m?'min':''}${f?'<small style="color:var(--teal);font-weight:600">fuerza</small>':''}<span class="muted" style="font-size:12px">${d}</span></div>`).join('');

/* ---------- Metformina ---------- */
$('#sxi-escMet').innerHTML=[['Semana 1','1,000'],['Semana 2','1,500'],['Semana 3','2,000'],['Máximo','2,550']].map(([s,m],i)=>`<div style="height:${60+i*26}px"><b>${m}</b>mg al día<span class="muted" style="font-size:12px">${s}</span></div>`).join('');
function tfg(){const v=+$('#sxi-tfg').value;let c,b,t;
 if(v>=45){c='var(--ok)';b='var(--okb)';t='<b>Se puede usar.</b>'}
 else if(v>=30){c='var(--mid)';b='var(--midb)';t='<b>No iniciar.</b> Si ya la toma, revalora riesgo y beneficio.'}
 else{c='var(--no)';b='var(--nob)';t='<b>Contraindicada.</b> Suspender.'}
 $('#sxi-resTfg').style.background=b;$('#sxi-resTfg').innerHTML=`<div class="sn" style="color:${c};font-size:clamp(34px,6vw,46px)">${v}</div><div>${t}<div class="muted">Filtración glomerular en mL/min/1.73 m²</div></div>`}
$('#sxi-tfg').addEventListener('input',tfg);tfg();

/* ---------- Plan de tratamiento ---------- */
const PF=[['ecv','corazón','Enfermedad cardiovascular aterosclerótica o alto riesgo'],['ic','cor','Insuficiencia cardiaca'],['erc','rinon','Enfermedad renal crónica con albuminuria'],['peso','pesa','Necesita bajar de peso'],['hipo','alerta','Riesgo de hipoglucemia o adulto mayor frágil'],['costo','pild','El costo es lo principal'],['cat','term','Pérdida de peso o cetosis (catabolismo)']];
$('#sxi-perfil').innerHTML=PF.map(([k,i,t])=>`<label>${ico(i==='corazón'?'cor':i,'var(--blue)')}<input type="checkbox" id="sxi-p-${k}">${t}</label>`).join('');
const CL={
 sglt:['Inhibidores del cotransportador sodio-glucosa tipo 2','Empagliflozina, dapagliflozina, canagliflozina','De preferencia en insuficiencia cardiaca y enfermedad renal con albuminuria. Bajan peso.'],
 glp:['Agonistas del receptor del péptido similar al glucagón tipo 1','Liraglutida, dulaglutida, semaglutida','Enfermedad cardiovascular aterosclerótica y necesidad de bajar de peso.'],
 dpp:['Inhibidores de la dipeptidil peptidasa 4','Sitagliptina, linagliptina (sin ajuste renal)','Poco riesgo de hipoglucemia: adulto mayor frágil.'],
 su:['Sulfonilureas','Glibenclamida, glimepirida','Bajo costo. Causan hipoglucemia y aumento de peso.'],
 pio:['Pioglitazona','','Retención de líquidos; empeora la insuficiencia cardiaca. Aumenta peso y fracturas.']};
function plan(){const h=parseFloat($('#sxi-hba').value),g=parseFloat($('#sxi-glu').value),P=k=>$('#sxi-p-'+k).checked;
 const ins=P('cat')||h>10||g>=300;const sel=new Set(),evi=new Set();
 if(P('ecv')){sel.add('glp');sel.add('sglt')}if(P('ic')){sel.add('sglt');evi.add('pio')}if(P('erc'))sel.add('sglt');if(P('peso')){sel.add('glp');sel.add('sglt');evi.add('su');evi.add('pio')}
 if(P('hipo')){sel.add('dpp');evi.add('su')}if(P('costo')&&!P('hipo'))sel.add('su');
 const org=P('ecv')||P('ic')||P('erc');const dual=!isNaN(h)&&h>=8.5;
 const N=[];
 if(ins)N.push(['Insulina desde el inicio',`${P('cat')?'Hay catabolismo':h>10?'Hemoglobina glucosilada mayor de 10%':'Glucosa de 300 mg/dL o más'}: inicia insulina basal y mantén metformina.`,'no']);
 N.push(['Paso 1','Metformina más cambios de estilo de vida.','ok']);
 if(org)N.push(['Ya, sin importar la hemoglobina glucosilada',P('ecv')?'Agonista del péptido similar al glucagón tipo 1 o inhibidor del cotransportador sodio-glucosa tipo 2 con beneficio cardiovascular.':'Inhibidor del cotransportador sodio-glucosa tipo 2.','ok']);
 else if(dual)N.push(['Inicia con dos fármacos','La hemoglobina glucosilada está 1.5 puntos o más por arriba de la meta de 7%.','mid']);
 N.push(['Si no llega a la meta en 3 meses','Agrega el segundo fármaco según el perfil (resaltado abajo). Evita la inercia terapéutica.','mid']);
 $('#sxi-algoPlan').innerHTML=N.map(([t,d,c],i)=>`<div class="fin" style="background:var(--${c}b);margin:0"><b style="color:var(--${c})">${t}</b><br>${d}</div>${i<N.length-1?'<div class="flecha"></div>':''}`).join('');
 $('#sxi-clases').innerHTML=Object.entries(CL).map(([k,[t,e,d]])=>`<div class="clase ${sel.has(k)?'elegida':evi.has(k)?'evitar':''}"><span class="sello">${sel.has(k)?'Buena opción':'Evitar'}</span><h4>${t}</h4>${e?`<div class="muted">${e}</div>`:''}<p style="font-size:14px;margin:6px 0 0">${d}</p></div>`).join('');}
['hba','glu'].forEach(id=>$('#sxi-'+id).addEventListener('input',plan));$('#sxi-perfil').addEventListener('change',plan);
$('#sxi-p-ecv').checked=true;plan();

/* ---------- Adversos ---------- */
flips($('#sxi-flipsAdv'),[['Inhibidores del cotransportador sodio-glucosa tipo 2','Infecciones genitales, infección urinaria, hipovolemia y cetoacidosis euglucémica.'],['Agonistas del péptido similar al glucagón tipo 1','Náusea y vómito. Suspender si hay pancreatitis. Contraindicados con carcinoma medular de tiroides o neoplasia endocrina múltiple tipo 2.'],['Pioglitazona','Retención de líquidos, empeora la insuficiencia cardiaca, aumento de peso y fracturas.'],['Sulfonilureas','Hipoglucemia (sobre todo en adultos mayores y con falla renal) y aumento de peso.'],['Metformina','Molestias digestivas al inicio, deficiencia de vitamina B12; acidosis láctica rara.']]);

/* ---------- Insulina ---------- */
let base='10';
function ins(){const w=parseFloat($('#sxi-pesoIns').value)||0;const u=base==='10'?10:Math.round(w*(+base));
 const m=Math.round(u*2/3),n=u-m;
 $('#sxi-dosisIns').innerHTML=`<div class="dc"><h4>${ico('jer','var(--blue)')}Glargina</h4><div class="sbig">${u} unidades</div><div class="sub">una vez al día, en la noche</div></div><div class="dc"><h4>${ico('jer','var(--blue)')}NPH</h4><div class="sbig">${m} + ${n} unidades</div><div class="sub">dos tercios en la mañana y un tercio en la noche</div></div>`}
seg($('#sxi-segIns'),[['10','10 unidades al día'],['0.1','0.1 unidades por kilo'],['0.2','0.2 unidades por kilo']],'10',k=>{base=k;ins()});
$('#sxi-pesoIns').addEventListener('input',ins);
function aj(){const v=parseFloat($('#sxi-ayunoProm').value);let t,c,b;
 if(isNaN(v)){t='Escribe el promedio.';c='var(--ink2)';b='var(--ctrl)'}
 else if(v<80){t='<b>Bajar 2 unidades.</b>';c='var(--no)';b='var(--nob)'}
 else if(v<130){t='<b>En meta:</b> sin cambio.';c='var(--ok)';b='var(--okb)'}
 else if(v<150){t='<b>Subir 1 unidad.</b>';c='var(--mid)';b='var(--midb)'}
 else if(v<180){t='<b>Subir 2 unidades.</b>';c='var(--mid)';b='var(--midb)'}
 else{t='<b>Subir 3 unidades.</b>';c='var(--no)';b='var(--nob)'}
 $('#sxi-resAjuste').style.background=b;$('#sxi-resAjuste').innerHTML=`<div class="sn" style="color:${c};font-size:clamp(30px,6vw,42px)">${isNaN(v)?'–':v}</div><div>${t} Revisa cada 7 días.</div>`}
$('#sxi-ayunoProm').addEventListener('input',aj);aj();
$('#sxi-lineaAjuste').innerHTML=[['Menor de 80','−2','var(--no)'],['80 a 129','Sin cambio','var(--ok)'],['130 a 149','+1','var(--mid)'],['150 a 179','+2','var(--mid)'],['180 o más','+3','var(--no)']].map(([r,a,c])=>`<div class="fil" style="display:flex;justify-content:space-between;border-radius:10px;padding:6px 10px;background:var(--ctrl)"><span>${r} mg/dL</span><b style="color:${c}">${a}</b></div>`).join('');

/* ---------- Ciclo 15-15 ---------- */
const P4=[['15 g de azúcar rápida','Medio vaso de jugo o refresco normal'],['Esperar 15 minutos',''],['Medir la glucosa',''],['¿Sigue menor de 70?','Repetir']];
$('#sxi-ciclo').innerHTML=`<circle cx="150" cy="130" r="86" fill="none" stroke="#0071e3" stroke-width="3" stroke-dasharray="8 8" opacity=".5"/>
 <text x="150" y="124" text-anchor="middle" font-size="30" font-weight="800" fill="#0071e3">15-15</text><text x="150" y="146" text-anchor="middle" font-size="12" fill="currentColor" opacity=".7">glucosa menor de 70</text>
 ${P4.map(([t,s],i)=>{const a=-Math.PI/2+i*Math.PI/2,x=150+86*Math.cos(a),y=130+86*Math.sin(a),w=Math.max(t.length,s.length)*6.2+20;return `<g><rect x="${Math.max(2,Math.min(298-w,x-w/2))}" y="${y-(s?20:13)}" width="${w}" height="${s?40:26}" rx="12" fill="#fff" stroke="#0071e3" stroke-width="1.5"/><text x="${Math.max(2,Math.min(298-w,x-w/2))+w/2}" y="${y+(s?-3:4.5)}" text-anchor="middle" font-size="12" font-weight="700" fill="#1d1d1f">${t}</text>${s?`<text x="${Math.max(2,Math.min(298-w,x-w/2))+w/2}" y="${y+13}" text-anchor="middle" font-size="10.5" fill="#6e6e73">${s}</text>`:''}</g>`}).join('')}`;
$('#sxi-ciclo').style.color='var(--ink)';

/* ---------- Calendario ---------- */
$('#sxi-cal').innerHTML=[['Cada consulta',[['pie','Revisar los pies'],['cor','Presión arterial y peso']]],['Cada 3 a 6 meses',[['lab','Hemoglobina glucosilada: cada 3 meses si no está en meta; cada 6 si está controlada']]],['Cada año',[['ojo','Fondo de ojo'],['rinon','Albúmina/creatinina en orina y filtración glomerular'],['pie','Monofilamento de 10 g y diapasón de 128 Hz'],['lab','Perfil de lípidos (el protocolo mexicano: cada 6 meses)']]]].map(([t,it])=>`<div class="col"><h4>${ico('cal','var(--blue)')} ${t}</h4><ul class="lista">${li(it.map(([i,x])=>[i,'var(--blue)','var(--blue2)',x]))}</ul></div>`).join('');

/* ---------- Referir ---------- */
$('#sxi-alarmas').innerHTML=[['alerta','Urgencias','Cetoacidosis, estado hiperglucémico hiperosmolar, hipoglucemia grave, pie diabético infectado o con isquemia.'],['rinon','Nefrología','Albuminuria mayor de 300 mg/g o filtración que cae rápido.'],['lab','Medicina interna o endocrinología','Falla a triple terapia, insulina intensiva, sospecha de diabetes autoinmune del adulto o monogénica.'],['ojo','Oftalmología','Cualquier alteración en el fondo de ojo.']].map(([i,t,d])=>`<div class="dc" style="border-color:transparent;background:var(--nob)"><h4><span style="color:var(--no);display:flex">${ico(i)}</span>${t}</h4><div class="sub" style="color:var(--ink)">${d}</div></div>`).join('');

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Glucosa al azar de 200 o más con síntomas se confirma?','No: basta sola. Todo lo demás se confirma.'],['¿Cuándo se suspende la metformina?','Filtración glomerular menor de 30 y antes de contraste yodado.'],['¿Diabético con insuficiencia cardiaca o enfermedad renal?','Inhibidor del cotransportador sodio-glucosa tipo 2, aunque la hemoglobina glucosilada esté en meta.'],['¿Pioglitazona en insuficiencia cardiaca?','Contraindicada.'],['¿Prurito genital con dapagliflozina?','Candidosis por el fármaco, no descontrol.'],['¿Estudio clave del pie en primer nivel?','Monofilamento de 10 g: detecta pérdida de la sensibilidad protectora.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Metas de hemoglobina glucosilada','Menor de 7% para la mayoría; 6.5% en jóvenes; 8% en frágiles.','Por grupos: menor de 7% en menores de 65 sin daño renal; 7.5% en mayores de 65 independientes o enfermedad renal 3; 8% en frágiles o enfermedad renal 4; 8.5% en enfermedad renal 5 o terminal.'],['Agonistas del péptido similar al glucagón tipo 1','Segundo fármaco con enfermedad cardiovascular o para bajar de peso.','En el Instituto Mexicano del Seguro Social se reservan a índice de masa corporal mayor de 35 y los prescribe endocrinología.'],['Cuándo iniciar insulina','Hemoglobina glucosilada mayor de 10% o glucosa de 300 o más.','Hemoglobina glucosilada de 9% o más o glucosa mayor de 260; falla a triple terapia oral; embarazo; cirugía.'],['Prediabetes','Vigilar cada año y tratar factores de riesgo.','Metformina en menores de 60 años, índice de masa corporal mayor de 35 o diabetes gestacional previa.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--blue2)"><small style="color:var(--blue)">CTO (Asociación Americana de Diabetes)</small>${g}</div><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">México (Instituto Mexicano del Seguro Social)</small>${a}</div></div></div>`).join('');
}};
ILU["endocrinologia-7"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="imc">Índice de masa</button><button type="button" data-ir="metabolico">Síndrome metabólico</button><button type="button" data-ir="riesgo">Riesgo y metas</button><button type="button" data-ir="estatinas">Estatinas</button><button type="button" data-ir="trigliceridos">Triglicéridos</button><button type="button" data-ir="friedewald">Calcular colesterol</button><button type="button" data-ir="causas">Causas secundarias</button><button type="button" data-ir="familiar">Familiar</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-imc">
<h2>Calcula el índice de masa corporal</h2>
<div class="duo">
<div>
<div class="campos"><label>Peso (kg)<input type="number" id="sxi-peso" value="96" step="0.1" inputmode="decimal"></label><label>Talla (m)<input type="number" id="sxi-talla" value="1.68" step="0.01" inputmode="decimal"></label><label>Cintura (cm)<input type="number" id="sxi-cintura" value="104" inputmode="numeric"></label></div>
<div class="seg" id="sxi-segSexo"></div>
<div class="crit"><label><input type="checkbox" id="sxi-comorb" checked>Tiene comorbilidad (diabetes, hipertensión, apnea del sueño, dislipidemia)</label></div>
</div>
<div><div class="res" id="sxi-resImc" style="margin-top:0"></div><div class="imcbar" id="sxi-imcbar"></div></div>
</div>
<h3>Escalera de tratamiento</h3>
<div class="escalon" id="sxi-escalon"></div>
<p class="nota" id="sxi-notaImc"></p>
</section>

<section class="scard glass" id="sxi-metabolico">
<h2>¿Tiene síndrome metabólico?</h2>
<p class="muted">Se necesitan 3 de 5.</p>
<div class="crit" id="sxi-sm"></div>
<div class="res" id="sxi-resSm"></div>
</section>

<section class="scard glass" id="sxi-riesgo">
<h2>Riesgo cardiovascular y meta de colesterol</h2>
<div class="seg" id="sxi-segRiesgo"></div>
<div class="spanel" id="sxi-infoRiesgo"></div>
<div class="campos" style="margin-top:10px"><label>Colesterol de baja densidad actual (mg/dL)<input type="number" id="sxi-ldl" value="160" inputmode="numeric"></label></div>
<div class="res" id="sxi-resLdl"></div>
</section>

<section class="scard glass" id="sxi-estatinas">
<h2>Estatinas</h2>
<div class="sgrid" id="sxi-estG"></div>
<div class="sgrid" style="margin-top:10px" id="sxi-estAd"></div>
</section>

<section class="scard glass" id="sxi-trigliceridos">
<h2>Triglicéridos: ¿qué hago?</h2>
<div class="campos"><label>Triglicéridos (mg/dL)<input type="range" id="sxi-tg" min="50" max="2000" step="10" value="620" style="width:min(100%,360px);accent-color:var(--blue)"></label></div>
<div class="res" id="sxi-resTg"></div>
</section>

<section class="scard glass" id="sxi-friedewald">
<h2>Calcula el colesterol de baja densidad</h2>
<div class="campos"><label>Colesterol total<input type="number" id="sxi-ct" value="240" inputmode="numeric"></label><label>Colesterol de alta densidad<input type="number" id="sxi-hdl" value="42" inputmode="numeric"></label><label>Triglicéridos<input type="number" id="sxi-tg2" value="190" inputmode="numeric"></label></div>
<div class="res" id="sxi-resFw"></div>
</section>

<section class="scard glass" id="sxi-causas">
<h2>Antes de tratar: causas secundarias</h2>
<div class="sgrid" id="sxi-flipsCausas"></div>
</section>

<section class="scard glass" id="sxi-familiar">
<h2>Hipercolesterolemia familiar</h2>
<div class="sgrid" id="sxi-hfG"></div>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>Guía mexicana frente al CTO</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Endocrinología capítulo 7; Guías de Práctica Clínica IMSS-233-09 (2016) e IMSS-046-08 (2018); Harrison 21.ª edición, capítulos 401, 402 y 407.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- IMC ---------- */
let sx='h';
const CL=[[0,18.5,'Bajo peso','#7fb3ec'],[18.5,25,'Normal','#0a9f4a'],[25,30,'Sobrepeso','#c8b02a'],[30,35,'Obesidad grado 1','#ee9a3a'],[35,40,'Obesidad grado 2','#e0663a'],[40,60,'Obesidad grado 3','#d93a3f']];
function imc(){const w=parseFloat($('#sxi-peso').value),t=parseFloat($('#sxi-talla').value),ci=parseFloat($('#sxi-cintura').value),co=$('#sxi-comorb').checked;
 const v=w/(t*t),ok=isFinite(v)&&v>0;const c=ok?CL.find(([a,b])=>v>=a&&v<b)||CL[5]:null;
 const lim=sx==='h'?[102,90]:[88,80],alta=ci>lim[0],altaMx=ci>lim[1];
 $('#sxi-resImc').style.background=ok?`color-mix(in srgb,${c[3]} 16%,transparent)`:'var(--ctrl)';
 $('#sxi-resImc').innerHTML=ok?`<div class="sn" style="color:${c[3]};font-size:clamp(34px,6vw,46px)">${v.toFixed(1)}</div><div><b>${c[2]}.</b> ${isNaN(ci)?'':(alta?`Cintura de ${ci} cm: <b>grasa abdominal de riesgo</b>.`:altaMx?`Cintura de ${ci} cm: de riesgo con el criterio mexicano (${lim[1]} cm).`:`Cintura de ${ci} cm sin riesgo.`)}</div>`:'Escribe peso y talla.';
 const pc=x=>Math.max(0,Math.min(100,(x-15)/30*100));
 $('#sxi-imcbar').innerHTML=`<div class="zonas">${CL.map(([a,b,,col])=>{const A=Math.max(a,15),B=Math.min(b,45);return B>A?`<i style="width:${(B-A)/30*100}%;background:${col}"></i>`:''}).join('')}</div>${ok?`<div class="marca" style="left:${pc(v)}%"></div>`:''}${[18.5,25,30,35,40].map(x=>`<span class="et" style="left:${pc(x)}%">${x}</span>`).join('')}`;
 const st=[['Estilo de vida','Todos con sobrepeso u obesidad',ok&&v>=25],['Fármaco','30 o más, o 27 con comorbilidad',ok&&(v>=30||(v>=27&&co))],['Cirugía bariátrica','40 o más, o 35 con comorbilidad grave',ok&&(v>=40||(v>=35&&co))],['Meta','Bajar 5 a 10% en 6 meses',ok&&v>=25]];
 $('#sxi-escalon').innerHTML=st.map(([a,b,on],i)=>`<div class="${on?'on':''}" style="height:${70+i*18}px"><b>${a}</b>${b}</div>`).join('');
 $('#sxi-notaImc').innerHTML=ok&&v>=25?`Meta de peso a 6 meses: entre <b>${(w*0.9).toFixed(1)}</b> y <b>${(w*0.95).toFixed(1)} kg</b>. Si a las 12 semanas de un fármaco no bajó 5%, cámbialo o suspéndelo.`:''}
['peso','talla','cintura'].forEach(id=>$('#sxi-'+id).addEventListener('input',imc));$('#sxi-comorb').addEventListener('change',imc);
seg($('#sxi-segSexo'),[['h','Hombre'],['m','Mujer']],'h',k=>{sx=k;imc()});

/* ---------- Síndrome metabólico ---------- */
const SM=['Cintura mayor de 102 cm en hombres u 88 en mujeres','Triglicéridos de 150 mg/dL o más','Colesterol de alta densidad menor de 40 en hombres o 50 en mujeres','Presión de 130/85 o más (o en tratamiento)','Glucosa en ayuno de 100 mg/dL o más (o en tratamiento)'];
$('#sxi-sm').innerHTML=SM.map((t,i)=>`<label><input type="checkbox" data-i="${i}" ${i<2?'checked':''}>${t}</label>`).join('');
function sm(){const n=[...$('#sxi-sm').querySelectorAll('input')].filter(x=>x.checked).length,s=n>=3;
 $('#sxi-resSm').style.background=s?'var(--nob)':'var(--okb)';$('#sxi-resSm').innerHTML=`<div class="sn" style="color:${s?'var(--no)':'var(--ok)'};font-size:clamp(30px,6vw,40px)">${n}/5</div><div>${s?'<b>Sí tiene síndrome metabólico.</b> Bajar de peso y ejercicio; trata cada componente según su meta.':'<b>No cumple criterios</b> (se necesitan 3). Vigila y corrige los factores presentes.'}</div>`}
$('#sxi-sm').addEventListener('change',sm);sm();

/* ---------- Riesgo y meta ---------- */
const RI={mua:[70,'Muy alto','Enfermedad cardiovascular establecida, diabetes con daño a órgano blanco, filtración glomerular menor de 60 o Globorisk mayor de 10%.','Estatina de alta intensidad.'],alt:[100,'Alto','Globorisk de 5 a 10%, presión de 180/110 o más, colesterol total mayor de 310 o dislipidemia familiar.','Estatina de alta intensidad si el colesterol de baja densidad es de 155 o más.'],mod:[115,'Moderado','Globorisk de 1 a 5%.','Estatina de intensidad moderada si el colesterol de baja densidad es de 190 o más; antes, estilo de vida.'],baj:[130,'Bajo','Globorisk menor de 1%.','Estilo de vida.']};
let ri='mua';
function ldl(){const [m,t,d,tx]=RI[ri],v=parseFloat($('#sxi-ldl').value);$('#sxi-infoRiesgo').innerHTML=`<b>Riesgo ${t.toLowerCase()}:</b> ${d}<br><b>Meta:</b> colesterol de baja densidad menor de ${m} mg/dL. ${tx}`;
 if(isNaN(v)){$('#sxi-resLdl').innerHTML='Escribe el valor.';return}
 const red=v>m?Math.round((1-m/v)*100):0;let int=red>=50?'alta intensidad, y quizá agregar ezetimiba':red>=30?'alta intensidad':red>0?'intensidad moderada':'';
 $('#sxi-resLdl').style.background=red?'var(--midb)':'var(--okb)';$('#sxi-resLdl').innerHTML=`<div class="sn" style="color:${red?'var(--mid)':'var(--ok)'};font-size:clamp(30px,6vw,42px)">${red?red+'%':'Meta'}</div><div>${red?`Necesita bajar <b>${red}%</b> para llegar a menos de ${m}. Sugiere estatina de <b>${int}</b>.`:`Ya está en la meta de menos de ${m} mg/dL.`}</div>`}
seg($('#sxi-segRiesgo'),[['mua','Muy alto'],['alt','Alto'],['mod','Moderado'],['baj','Bajo']],'mua',k=>{ri=k;ldl()});
$('#sxi-ldl').addEventListener('input',ldl);

/* ---------- Estatinas ---------- */
$('#sxi-estG').innerHTML=[['Alta intensidad','Baja 50% o más','Atorvastatina 40 a 80 mg; rosuvastatina 20 a 40 mg.','var(--no)'],['Intensidad moderada','Baja 30 a 49%','Atorvastatina 10 a 20 mg; rosuvastatina 5 a 10 mg; simvastatina 20 a 40 mg; pravastatina 40 a 80 mg.','var(--mid)']].map(([t,b,d,c])=>`<div class="dc"><h4 style="color:${c}">${t}</h4><div class="sbig" style="font-size:20px">${b}</div><div class="sub">${d}</div></div>`).join('');
$('#sxi-estAd').innerHTML=[['alerta','Efectos adversos','Mialgias, miopatía, rabdomiólisis (creatina fosfocinasa más de 10 veces) y transaminasas altas. Contraindicadas en el embarazo.'],['lab','Cuándo medir creatina fosfocinasa','Solo con síntomas musculares o riesgo (fármacos, hipotiroidismo, edad avanzada).'],['pild','Interacciones','Gemfibrozilo, macrólidos y ciclosporina aumentan el riesgo de miopatía.'],['reloj','Seguimiento','Perfil de lípidos a las 12 semanas; luego cada 6 a 12 meses. Sin meta: agregar ezetimiba.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--blue)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Triglicéridos ---------- */
function tg(){const v=+$('#sxi-tg').value;let t,c;
 if(v<150){t='<b>Normal.</b>';c='ok'}
 else if(v<500){t='<b>Elevados.</b> Estilo de vida, controla glucosa y alcohol; estatina según el riesgo cardiovascular. La guía mexicana agrega fibrato con 204 o más y colesterol de alta densidad menor de 35.';c='mid'}
 else if(v<1000){t='<b>Riesgo de pancreatitis.</b> Dieta muy baja en grasa, sin alcohol y <b>fibrato</b>; busca causas secundarias.';c='no'}
 else{t='<b>Riesgo alto de pancreatitis.</b> Fibrato, sin alcohol y control de la glucosa. Busca xantomas eruptivos y lipemia retinalis; si hay dolor abdominal, piensa en pancreatitis.';c='no'}
 $('#sxi-resTg').style.background=`var(--${c}b)`;$('#sxi-resTg').innerHTML=`<div class="sn" style="color:var(--${c});font-size:clamp(30px,6vw,42px)">${v}</div><div>${t}</div>`}
$('#sxi-tg').addEventListener('input',tg);tg();

/* ---------- Friedewald ---------- */
function fw(){const ct=parseFloat($('#sxi-ct').value),h=parseFloat($('#sxi-hdl').value),t=parseFloat($('#sxi-tg2').value);
 if([ct,h,t].some(isNaN)){$('#sxi-resFw').innerHTML='Escribe los tres valores.';return}
 const nh=ct-h;let x;
 if(t>=400){x=`<b>No uses la fórmula</b> con triglicéridos de 400 o más. Usa el colesterol no de alta densidad: <b>${nh}</b> mg/dL.`;$('#sxi-resFw').style.background='var(--midb)';$('#sxi-resFw').innerHTML=`<div class="sn" style="color:var(--mid);font-size:clamp(28px,6vw,40px)">${nh}</div><div>${x}</div>`;return}
 const l=Math.round(ct-h-t/5);$('#sxi-resFw').style.background='var(--blue2)';$('#sxi-resFw').innerHTML=`<div class="sn" style="color:var(--blue);font-size:clamp(28px,6vw,40px)">${l}</div><div>Colesterol de baja densidad = ${ct} − ${h} − ${t}/5. Colesterol no de alta densidad: <b>${nh}</b> mg/dL.</div>`}
['ct','hdl','tg2'].forEach(id=>$('#sxi-'+id).addEventListener('input',fw));fw();

/* ---------- Causas ---------- */
flips($('#sxi-flipsCausas'),[['Colesterol alto con piel seca, frío y estreñimiento','Hipotiroidismo: pide hormona estimulante de la tiroides y trata antes de la estatina.'],['Triglicéridos altos y colesterol de alta densidad bajo','Diabetes tipo 2 mal controlada (la causa secundaria más frecuente).'],['Edema, proteinuria e hipercolesterolemia','Síndrome nefrótico.'],['Triglicéridos que suben en un bebedor','Alcohol.'],['Fármacos que elevan lípidos','Tiazidas, betabloqueadores, corticoides, estrógenos orales, retinoides y antirretrovirales.'],['Obesidad con estrías violáceas y debilidad proximal','Síndrome de Cushing.']]);

/* ---------- Familiar ---------- */
$('#sxi-hfG').innerHTML=[['lab','Sospecha','Colesterol de baja densidad mayor de 190 mg/dL sin causa secundaria.'],['alerta','Signos','Xantomas tendinosos (Aquiles, extensores de la mano) y arco corneal antes de los 45 años.'],['cor','Familia','Cardiopatía coronaria prematura: hombre menor de 55, mujer menor de 65.'],['pild','Tratamiento','Estatina de alta intensidad desde el diagnóstico; ezetimiba e inhibidores de PCSK9 si no llega a la meta. Estudiar a la familia.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--vio)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Meta en muy alto riesgo (guía mexicana)?','Colesterol de baja densidad menor de 70.'],['¿Estatina más qué fibrato da rabdomiólisis?','Gemfibrozilo.'],['¿Triglicéridos mayores de 1,000 y dolor abdominal?','Pancreatitis. Fibrato.'],['¿Efecto adverso del orlistat?','Esteatorrea y déficit de vitaminas liposolubles.'],['¿Cirugía bariátrica?','Índice de 40, o 35 con comorbilidad grave.'],['¿Qué vigilas tras un bypass gástrico?','Vitamina B12, hierro, calcio y vitamina D.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Escala de riesgo','Globorisk, validada en población mexicana, desde los 40 años.','El CTO usa SCORE2 de Europa.'],['Meta en muy alto riesgo','Colesterol de baja densidad menor de 70.','Guías europeas: menor de 55 y reducir al menos 50%.'],['Fármacos para obesidad','Orlistat de primera elección; aún menciona lorcaserina.','La lorcaserina se retiró en 2020. Hoy se usan agonistas del péptido similar al glucagón tipo 1, orlistat y fentermina con topiramato.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">Guía mexicana</small>${g}</div><div class="c" style="background:var(--blue2)"><small style="color:var(--blue)">CTO y actual</small>${a}</div></div></div>`).join('');
}};
ILU["enfermedades-infecciosas-8"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="incubacion">Incubación</button><button type="button" data-ir="tipo">Tipo</button><button type="button" data-ir="hidratacion">Hidratación</button><button type="button" data-ir="antibiotico">¿Antibiótico?</button><button type="button" data-ir="adulto">Adulto</button><button type="button" data-ir="cdifficile">Difficile</button><button type="button" data-ir="complicaciones">Complicaciones</button><button type="button" data-ir="alarma">Alarma</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-incubacion">
<h2>¿Cuántas horas después de comer empezó?</h2>
<p class="muted">Toca cada franja: el tiempo de incubación orienta al germen.</p>
<div class="reloj" id="sxi-reloj"></div>
<div class="spanel" id="sxi-infoInc"></div>
</section>

<section class="scard glass" id="sxi-tipo">
<h2>¿Acuosa o disentérica?</h2>
<div class="seg" id="sxi-segTipo"></div>
<div class="sgrid" id="sxi-tipoG"></div>
</section>

<section class="scard glass" id="sxi-hidratacion">
<h2>Evalúa la hidratación del niño</h2>
<p class="muted">Marca lo que encuentras.</p>
<div class="duo">
<div>
<div class="crit" id="sxi-signos"></div>
<div class="campos" style="margin-top:10px"><label>Peso en kilos<input type="number" id="sxi-pesoN" value="12" step="0.1" inputmode="decimal"></label><label>Edad<select id="sxi-edadN"><option value="0">Menor de 6 meses</option><option value="1">6 a 11 meses</option><option value="2" selected>1 año o más</option></select></label></div>
</div>
<div><div class="res" id="sxi-resPlan" style="margin-top:0"></div><div class="sgrid" id="sxi-volPlan" style="margin-top:10px"></div></div>
</div>
<p class="nota">Suero oral de baja osmolaridad (sodio 75, 245 mOsm/L). Sigue la lactancia y la comida. Sin loperamida, sin refrescos ni bebidas deportivas.</p>
</section>

<section class="scard glass" id="sxi-antibiotico">
<h2>¿Lleva antibiótico?</h2>
<p class="muted">Marca lo que aplica.</p>
<div class="crit" id="sxi-abx"></div>
<div class="res" id="sxi-resAbx"></div>
</section>

<section class="scard glass" id="sxi-adulto">
<h2>El adulto con diarrea</h2>
<div class="sgrid" id="sxi-adultoG"></div>
</section>

<section class="scard glass" id="sxi-cdifficile">
<h2>Clostridioides difficile</h2>
<div class="sgrid" id="sxi-cdG"></div>
</section>

<section class="scard glass" id="sxi-complicaciones">
<h2>Complicaciones que se preguntan</h2>
<div class="sgrid" id="sxi-flipsComp"></div>
</section>

<section class="scard glass" id="sxi-alarma">
<h2>Datos de alarma y hospitalización</h2>
<div class="sgrid" id="sxi-alarmas"></div>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>México frente a la Organización Mundial de la Salud</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Enfermedades infecciosas capítulo 8; Guía de Práctica Clínica IMSS-156-08; Guía GPC-SS-106-20; Harrison 21.ª edición, capítulos 46 y 133.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const fmt=n=>Math.round(n).toLocaleString('es-MX');
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- Incubación ---------- */
const INC=[[0,6,'Menos de 6 horas: vómito','#d93a3f','<b>Toxina preformada.</b> Staphylococcus aureus (pasteles, cremas, mayonesa) o Bacillus cereus (arroz frito). Predomina el vómito; se cura sola en 24 horas.'],[8,16,'8 a 16 horas: acuosa','#ee7a3a','<b>Enterotoxina formada en el intestino.</b> Clostridium perfringens o Bacillus cereus diarreico (carne, verduras).'],[16,72,'16 a 72 horas: acuosa','#c77a00','<b>Virus y enterotoxinas.</b> Norovirus (brotes), Escherichia coli enterotoxigénica (viajero), Vibrio cholerae (heces en agua de arroz).'],[48,72,'48 a 72 horas: disentería','#7a3fbf','<b>Citotoxinas tipo Shiga.</b> Escherichia coli enterohemorrágica y Shigella. Riesgo de síndrome hemolítico urémico.'],[72,120,'3 a 5 días: fiebre','#0071e3','<b>Bacterias invasoras.</b> Campylobacter, Salmonella, Shigella, Escherichia coli enteroinvasiva.']];
let ii=0;
function inc(){$('#sxi-reloj').innerHTML=INC.map(([a,b,t,c],i)=>`<button type="button" data-i="${i}" aria-pressed="${i===ii}"><i style="left:${a/120*100}%;width:${(b-a)/120*100}%;background:${c};opacity:.85"></i><span style="color:${i===ii?'var(--ink)':'var(--ink)'}">${t}</span></button>`).join('')+`<div class="eje2"><span>0 h</span><span>24</span><span>48</span><span>72</span><span>96</span><span>120 h</span></div>`;
 $('#sxi-infoInc').innerHTML=INC[ii][4]}
$('#sxi-reloj').onclick=e=>{const b=e.target.closest('button');if(b){ii=+b.dataset.i;inc()}};inc();

/* ---------- Tipo ---------- */
const TP={ac:[['gota','Cómo es','Abundante, sin sangre ni moco, sin fiebre alta.'],['lab','Causas','Virus (rotavirus, norovirus), Escherichia coli enterotoxigénica, cólera.'],['ok','Manejo','Hidratación. Antibiótico casi nunca (cólera sí). En adultos sin fiebre puede usarse loperamida.']],dis:[['alerta','Cómo es','Sangre, moco, fiebre, cólico y tenesmo; poco volumen.'],['lab','Causas','Shigella, Campylobacter, Salmonella, Escherichia coli enterohemorrágica, amiba.'],['pild','Manejo','Hidratación y antibiótico según el caso. Nunca loperamida. Sin antibiótico si se sospecha Escherichia coli O157.']]};
seg($('#sxi-segTipo'),[['ac','Acuosa'],['dis','Disentérica']],'dis',k=>{$('#sxi-tipoG').innerHTML=TP[k].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,k==='ac'?'var(--blue)':'var(--no)')}${t}</h4><div class="sub">${d}</div></div>`).join('')});

/* ---------- Hidratación ---------- */
const SG=[['d','Inquieto o irritable'],['d','Ojos hundidos'],['d','Bebe con avidez, tiene mucha sed'],['d','Pliegue cutáneo regresa lento'],['g','Letárgico o inconsciente'],['g','No puede beber o bebe muy poco'],['g','Pulso débil o llenado capilar mayor de 2 segundos'],['g','Pliegue regresa muy lento (más de 2 segundos)']];
$('#sxi-signos').innerHTML=SG.map(([t,s],i)=>`<label><input type="checkbox" data-i="${i}">${s}</label>`).join('');
function plan(){const ch=[...$('#sxi-signos').querySelectorAll('input')].map(x=>x.checked);const g=SG.some(([t],i)=>t==='g'&&ch[i]),d=SG.filter(([t],i)=>t==='d'&&ch[i]).length;
 const w=parseFloat($('#sxi-pesoN').value)||0,ed=+$('#sxi-edadN').value;let p,c,t,V=[];
 const zinc=ed===0?'10 mg':'20 mg';
 if(g){p='C';c='no';t='<b>Plan C: deshidratación grave o choque.</b> Solución Hartmann o salina al 0.9% intravenosa y referir.';V=[['1.ª hora','50 mL por kilo',fmt(50*w)+' mL'],['2.ª hora','25 mL por kilo',fmt(25*w)+' mL'],['3.ª hora','25 mL por kilo',fmt(25*w)+' mL']]}
 else if(d>=2){p='B';c='mid';t='<b>Plan B: deshidratación.</b> Suero oral en la unidad, en tomas cada 30 minutos; revalora a las 4 horas.';V=[['En 4 horas','100 mL por kilo',fmt(100*w)+' mL'],['Cada 30 minutos','la octava parte',fmt(100*w/8)+' mL'],['Si vomita','espera 10 minutos','y sigue más despacio']]}
 else{p='A';c='ok';t='<b>Plan A: sin deshidratación.</b> Manejo en casa, más líquidos, sigue comiendo y enseña datos de alarma.';V=[['Después de cada evacuación',ed<2?'menor de 1 año':'1 año o más',ed<2?'75 mL':'150 mL'],['Zinc al día','por 10 a 14 días',zinc],['Revisión','si empeora','datos de alarma']]}
 if(p!=='A')V.push(['Zinc al día','al tolerar la vía oral, 10 a 14 días',zinc]);
 $('#sxi-resPlan').style.background=`var(--${c}b)`;$('#sxi-resPlan').innerHTML=`<div class="sn" style="color:var(--${c})">${p}</div><div>${t}</div>`;
 $('#sxi-volPlan').innerHTML=V.map(([a,b,v])=>`<div class="dc"><h4>${a}</h4><div class="sbig" style="font-size:22px">${v}</div><div class="sub">${b}</div></div>`).join('')}
$('#sxi-signos').addEventListener('change',plan);['pesoN','edadN'].forEach(id=>$('#sxi-'+id).addEventListener('input',plan));
$('#sxi-signos').querySelectorAll('input')[1].checked=true;$('#sxi-signos').querySelectorAll('input')[2].checked=true;plan();

/* ---------- Antibiótico ---------- */
const AB=[['dis','Disentería con fiebre (sospecha de Shigella)','si'],['col','Cólera','si'],['ame','Amebiasis disentérica o giardiasis','si'],['cd','Clostridioides difficile','si'],['sep','Sepsis, inmunosupresión o prótesis vascular','si'],['sal6','Salmonella en menor de 6 meses','si'],['salok','Salmonella en un niño o adulto sano','no'],['o157','Sospecha de Escherichia coli O157 (sangre sin fiebre alta)','no'],['vir','Diarrea acuosa probablemente viral','no']];
$('#sxi-abx').innerHTML=AB.map(([k,t])=>`<label><input type="checkbox" data-k="${k}">${t}</label>`).join('');
function abx(){const ch=[...$('#sxi-abx').querySelectorAll('input')].filter(x=>x.checked).map(x=>x.dataset.k);let t,c;
 if(ch.includes('o157')){t='<b>No des antibiótico:</b> aumenta el riesgo de síndrome hemolítico urémico. Hidrata y vigila orina, hemoglobina y plaquetas.';c='no'}
 else if(ch.some(k=>AB.find(a=>a[0]===k)[2]==='si')){const x=[];if(ch.includes('dis'))x.push('azitromicina (en niños, dosis por peso; adultos 500 mg al día por 3 días)');if(ch.includes('col'))x.push('cólera: doxiciclina 300 mg o azitromicina 1 g dosis única en adultos');if(ch.includes('ame'))x.push('metronidazol (amiba: más un amebicida luminal)');if(ch.includes('cd'))x.push('vancomicina oral 125 mg cada 6 horas por 10 días');if(ch.includes('sep')||ch.includes('sal6'))x.push('antibiótico según el germen y la gravedad; valorar hospitalización');
  t='<b>Sí lleva antibiótico.</b> '+x.join('; ')+'.';c='ok'}
 else if(ch.length){t='<b>No lleva antibiótico.</b> Solo hidratación: el antibiótico no acorta la diarrea y en Salmonella prolonga el estado de portador.';c='mid'}
 else{t='Marca las situaciones de tu paciente.';c='blue'}
 $('#sxi-resAbx').style.background=c==='blue'?'var(--blue2)':`var(--${c}b)`;$('#sxi-resAbx').innerHTML=`<div style="color:${c==='blue'?'var(--blue)':`var(--${c})`};display:flex">${ico('pild')}</div><div>${t}</div>`}
$('#sxi-abx').addEventListener('change',abx);abx();

/* ---------- Adulto ---------- */
$('#sxi-adultoG').innerHTML=[['vaso','Hidratación','Suero oral y dieta normal según tolerancia.'],['pild','Loperamida','Solo sin fiebre ni sangre: 4 mg al inicio y 2 mg tras cada evacuación; máximo 16 mg al día.'],['lab','Coprocultivo solo si','fiebre alta, sangre, deshidratación grave, inmunosupresión, más de 7 días, brote o antibióticos recientes.'],['pild','Antibiótico empírico','Azitromicina 500 mg al día por 3 días o ciprofloxacino 500 mg cada 12 horas por 3 días. Campylobacter: macrólido.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--blue)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- C. difficile ---------- */
$('#sxi-cdG').innerHTML=[['alerta','Cuándo pensarlo','Diarrea durante o después de antibióticos (clindamicina, cefalosporinas, quinolonas) u hospitalización; los inhibidores de la bomba de protones aumentan el riesgo.'],['lab','Diagnóstico','Glutamato deshidrogenasa como tamiz y toxinas A y B en heces. No se repite para comprobar curación.'],['pild','Tratamiento','Vancomicina oral 125 mg cada 6 horas por 10 días (o fidaxomicina) y suspender el antibiótico causal.'],['mano','Contagio','Lavado de manos con agua y jabón: el alcohol no mata las esporas. Aislamiento de contacto.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--teal)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Complicaciones ---------- */
flips($('#sxi-flipsComp'),[['Diarrea con sangre y a la semana anemia, plaquetas bajas y falla renal','Síndrome hemolítico urémico por Escherichia coli O157:H7 o Shigella dysenteriae tipo 1.'],['Diarrea con fiebre y 2 semanas después parálisis ascendente','Guillain-Barré por Campylobacter jejuni.'],['Artritis, conjuntivitis y uretritis después de una diarrea','Artritis reactiva (Salmonella, Shigella, Yersinia o Campylobacter; HLA-B27).'],['Diarrea por Clostridioides difficile con distensión y dolor','Megacolon tóxico: urgencia; puede requerir colectomía.']]);

/* ---------- Alarma ---------- */
$('#sxi-alarmas').innerHTML=[['bebe','Niño: datos de alarma','No puede beber, vomita todo, letargia, convulsiones, sangre, fiebre alta, más de 10 evacuaciones al día o anuria de 12 horas.'],['alerta','Hospitalizar','Choque, deshidratación mayor de 9%, lactante menor de 6 meses con muchas evacuaciones o vómitos, alteración neurológica.'],['mayor','Adulto','Deshidratación grave, sangre con fiebre alta, adulto mayor o inmunosuprimido con mal estado general, dolor intenso.']].map(([i,t,d])=>`<div class="dc" style="border-color:transparent;background:var(--nob)"><h4><span style="color:var(--no);display:flex">${ico(i)}</span>${t}</h4><div class="sub" style="color:var(--ink)">${d}</div></div>`).join('');

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Vómito a las 2 horas de un pastel con crema?','Staphylococcus aureus.'],['¿Diarrea del viajero?','Escherichia coli enterotoxigénica.'],['¿Heces en agua de arroz?','Cólera.'],['¿Plan B?','Suero oral 100 mL por kilo en 4 horas.'],['¿Plan C mexicano?','Hartmann 50, 25 y 25 mL por kilo en 3 horas.'],['¿Zinc?','10 mg en menores de 6 meses; 20 mg en mayores; 10 a 14 días.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Plan A','Después de cada evacuación: media taza (75 mL) en menores de 1 año y una taza (150 mL) en mayores.','Organización Mundial de la Salud: 50 a 100 mL en menores de 2 años y 100 a 200 mL de 2 a 10 años.'],['Plan B','Suero oral 100 mL por kilo en 4 horas.','Organización Mundial de la Salud: 75 mL por kilo en 4 horas.'],['Plan C','Hartmann 100 mL por kilo en 3 horas: 50, 25 y 25.','Organización Mundial de la Salud: 30 mL por kilo y luego 70 mL por kilo, en 3 horas (mayores de 1 año) o 6 horas (menores).']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">México</small>${g}</div><div class="c" style="background:var(--blue2)"><small style="color:var(--blue)">Organización Mundial de la Salud</small>${a}</div></div></div>`).join('');
}};
ILU["gastroenterologia-y-hepatologia-digestivo-4"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="alarma">Alarma</button><button type="button" data-ir="esofago">Esófago</button><button type="button" data-ir="ruta">Qué hago</button><button type="button" data-ir="ibp">Inhibidor</button><button type="button" data-ir="losangeles">Los Ángeles</button><button type="button" data-ir="helicobacter">Helicobacter</button><button type="button" data-ir="ulcera">Úlcera</button><button type="button" data-ir="referir">Referir</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-alarma">
<h2>Primero: ¿hay datos de alarma?</h2>
<div class="crit" id="sxi-chkAl"></div>
<div class="res" id="sxi-resAl"></div>
</section>

<section class="scard glass" id="sxi-esofago">
<h2>Qué pasa en el esófago</h2>
<div class="seg" id="sxi-segEso"></div>
<div class="duo">
<div class="ilu" style="background:var(--rosab)"><svg id="sxi-eso" viewBox="0 0 260 300" role="img" aria-label="Esófago, esfínter esofágico inferior y estómago"></svg></div>
<div class="spanel" id="sxi-infoEso"></div>
</div>
</section>

<section class="scard glass" id="sxi-ruta">
<h2>¿Qué hago en la consulta?</h2>
<div class="seg" id="sxi-segRuta"></div>
<div class="algo" id="sxi-algoRuta"></div>
</section>

<section class="scard glass" id="sxi-ibp">
<h2>El inhibidor de la bomba de protones, bien tomado</h2>
<div class="sgrid" id="sxi-ibpG"></div>
</section>

<section class="scard glass" id="sxi-losangeles">
<h2>Esofagitis: clasificación de Los Ángeles</h2>
<div class="seg" id="sxi-segLA"></div>
<div class="duo">
<div class="ilu" style="background:#1b1b1f"><svg id="sxi-la" viewBox="0 0 200 200" role="img" aria-label="Vista endoscópica del esófago distal"></svg></div>
<div class="spanel" id="sxi-infoLA"></div>
</div>
</section>

<section class="scard glass" id="sxi-helicobacter">
<h2>Helicobacter pylori paso a paso</h2>
<div class="linea" id="sxi-lineaHp"></div>
<div class="sgrid" id="sxi-hpG" style="margin-top:12px"></div>
</section>

<section class="scard glass" id="sxi-ulcera">
<h2>Úlcera duodenal o gástrica</h2>
<div class="cmp2" id="sxi-ulc"></div>
<div class="sgrid" style="margin-top:10px" id="sxi-ulcComp"></div>
</section>

<section class="scard glass" id="sxi-referir">
<h2>Cuándo referir</h2>
<div class="sgrid" id="sxi-alarmas"></div>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>Guía mexicana frente a lo actual</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Digestivo capítulos 4, 7 y 10; Guía de Práctica Clínica IMSS-071-08; Harrison 21.ª edición, capítulos 45, 163, 323 y 324.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- Alarma ---------- */
const AL=['Disfagia u odinofagia','Pérdida de peso no intencionada','Anemia por deficiencia de hierro','Hematemesis o melena','Vómito persistente','Masa abdominal','Inicio de síntomas después de los 50 años','Familiar con cáncer gástrico'];
$('#sxi-chkAl').innerHTML=AL.map((t,i)=>`<label><input type="checkbox" data-i="${i}">${t}</label>`).join('');
function al(){const n=[...$('#sxi-chkAl').querySelectorAll('input')].filter(x=>x.checked).length;
 $('#sxi-resAl').style.background=n?'var(--nob)':'var(--okb)';$('#sxi-resAl').innerHTML=`<div style="color:${n?'var(--no)':'var(--ok)'};display:flex">${ico(n?'endo':'ok')}</div><div>${n?'<b>Endoscopia pronto.</b> No inicies tratamiento empírico prolongado: descarta cáncer, úlcera o estenosis.':'<b>Sin alarma:</b> puedes tratar de forma empírica (sigue la ruta de abajo).'}</div>`}
$('#sxi-chkAl').addEventListener('change',al);al();

/* ---------- Esófago ---------- */
const ES={nor:'<b>Normal:</b> el esfínter esofágico inferior, junto con el diafragma, impide que el ácido suba.',ref:'<b>Reflujo:</b> el ácido sube por relajaciones del esfínter. Da <b>pirosis y regurgitación</b>, peor al acostarse, al agacharse o tras comidas abundantes.',her:'<b>Hernia hiatal:</b> parte del estómago sube por arriba del diafragma y favorece el reflujo. La de deslizamiento sin complicaciones no se opera.',bar:'<b>Esófago de Barrett:</b> el epitelio del esófago distal cambia a <b>metaplasia intestinal</b> (lenguas color salmón). Riesgo de <b>adenocarcinoma</b>: inhibidor y vigilancia con biopsias.'};
function eso(k){const her=k==='her',up=her?-38:0;$('#sxi-eso').innerHTML=`
 <path d="M0 ${150}H260" stroke="#8d6e63" stroke-width="10" opacity=".55"/>
 <text x="252" y="${144}" text-anchor="end" font-size="11" fill="currentColor" opacity=".7">diafragma</text>
 <path d="M112 0V${150+up}M148 0V${150+up}" stroke="#d98b93" stroke-width="3" fill="none"/>
 <rect x="113" y="0" width="34" height="${150+up}" fill="#f2b8bd"/>
 ${k==='ref'?'<rect x="113" y="70" width="34" height="80" fill="#e8636f" opacity=".75"/>':''}
 ${k==='bar'?'<path d="M113 150V100l8 10 6-22 7 26 6-18 7 14V150Z" fill="#f08a5d"/>':''}
 <path d="M112 ${150+up}C104 ${190+up} 60 ${190+up} 60 ${238+up}C60 290 200 300 210 244C220 200 190 ${168+up} 148 ${150+up}" fill="#e9a0a6" stroke="#c76b75" stroke-width="3"/>
 <rect x="108" y="${142+up}" width="44" height="14" rx="7" fill="${k==='nor'?'#0a9f4a':'#d93a3f'}"/>
 <text x="160" y="${153+up}" font-size="11" fill="currentColor" font-weight="600">esfínter</text>
 ${k==='ref'?[0,1,2].map(i=>`<path d="M130 ${210-i*40}v-26" stroke="#c77a00" stroke-width="4" stroke-linecap="round"/><path d="M122 ${192-i*40}l8-10 8 10" fill="none" stroke="#c77a00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join(''):''}
 <text x="130" y="275" text-anchor="middle" font-size="12" fill="#7a2632" font-weight="700">estómago</text>`;
 $('#sxi-eso').style.color='var(--ink)';$('#sxi-infoEso').innerHTML=ES[k]}
seg($('#sxi-segEso'),[['nor','Normal'],['ref','Reflujo'],['her','Hernia hiatal'],['bar','Barrett']],'ref',eso);

/* ---------- Ruta ---------- */
const RU={pir:[['Pirosis o regurgitación sin alarma','ok'],['Estilo de vida: bajar de peso, elevar la cabecera, no cenar tarde','ok'],['Inhibidor de la bomba de protones 8 semanas, antes del desayuno','ok'],['Respuesta parcial: dosis doble antes del desayuno y de la cena','mid'],['Sin respuesta o síntomas atípicos: endoscopia y pH-metría de 24 horas','no'],['Mejoró: dosis mínima eficaz o a demanda','ok']],
 dis:[['Dolor o ardor epigástrico, llenura o saciedad temprana sin alarma','ok'],['Suspende antiinflamatorios si es posible','ok'],['Busca Helicobacter pylori (aliento o antígeno en heces) y trátalo si es positivo','ok'],['Negativo o persiste: inhibidor de la bomba de protones 4 a 8 semanas','mid'],['Persiste: procinético o tricíclico a dosis baja','mid'],['Sin respuesta: endoscopia','no']]};
seg($('#sxi-segRuta'),[['pir','Predomina pirosis o regurgitación'],['dis','Predomina dolor o llenura epigástrica']],'pir',k=>{const N=RU[k];$('#sxi-algoRuta').innerHTML=N.map(([t,c],i)=>`<div class="fin" style="background:var(--${c}b);margin:0"><b style="color:var(--${c})">${i===0?'Inicio':'Paso '+i}</b><br>${t}</div>${i<N.length-1?'<div class="flecha"></div>':''}`).join('')});

/* ---------- IBP ---------- */
$('#sxi-ibpG').innerHTML=[['reloj','Cuándo','30 a 60 minutos antes del desayuno: actúa sobre las bombas que se activan al comer.'],['pild','Dosis estándar','Omeprazol 20 mg, pantoprazol 40 mg, esomeprazol 40 mg, lansoprazol 30 mg.'],['cal','Cuánto tiempo','8 semanas en reflujo; 4 a 8 en dispepsia. Luego la dosis mínima eficaz.'],['alerta','Uso prolongado','Hipomagnesemia, déficit de vitamina B12, fracturas, neumonía y Clostridioides difficile.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--blue)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Los Ángeles ---------- */
const LA={A:[1,6,'<b>Grado A:</b> una o más erosiones de <b>5 mm o menos</b>, que no se extienden entre dos pliegues.'],B:[1,14,'<b>Grado B:</b> erosiones de <b>más de 5 mm</b>, sin continuidad entre pliegues.'],C:[3,0,'<b>Grado C:</b> erosiones <b>continuas entre dos o más pliegues</b>, en menos de 75% de la circunferencia.'],D:[6,0,'<b>Grado D:</b> erosiones en <b>75% o más</b> de la circunferencia. Esofagitis grave: inhibidor continuo.']};
function la(k){const [n,len,t]=LA[k];let er='';
 if(k==='A'||k==='B')er=`<path d="M100 40 l4 ${len*2}" stroke="#ff4d5e" stroke-width="${k==='A'?5:7}" stroke-linecap="round"/><path d="M152 92 l-${len*1.6} 6" stroke="#ff4d5e" stroke-width="${k==='A'?5:7}" stroke-linecap="round"/>`;
 else{const fr=k==='C'?0.55:0.9;const a0=-Math.PI/2,a1=a0+fr*2*Math.PI;const R=56,r=30,P=(a,rr)=>[100+rr*Math.cos(a),100+rr*Math.sin(a)];const [x1,y1]=P(a0,R),[x2,y2]=P(a1,R),[x3,y3]=P(a1,r),[x4,y4]=P(a0,r);er=`<path d="M${x1} ${y1}A${R} ${R} 0 ${fr>.5?1:0} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${fr>.5?1:0} 0 ${x4} ${y4}Z" fill="#ff4d5e" opacity=".8"/>`}
 $('#sxi-la').innerHTML=`<circle cx="100" cy="100" r="92" fill="#0a0a0c"/><circle cx="100" cy="100" r="72" fill="#f2a3a9"/><circle cx="100" cy="100" r="22" fill="#5a1f2a"/>
 ${[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return `<path d="M${100+24*Math.cos(a)} ${100+24*Math.sin(a)}L${100+70*Math.cos(a)} ${100+70*Math.sin(a)}" stroke="#d9848c" stroke-width="3"/>`}).join('')}${er}`;
 $('#sxi-infoLA').innerHTML=t}
seg($('#sxi-segLA'),[['A','A'],['B','B'],['C','C'],['D','D']],'B',la);

/* ---------- H. pylori ---------- */
$('#sxi-lineaHp').innerHTML=[['Suspender antibióticos y bismuto 4 semanas antes de la prueba',0,4,'var(--mid)'],['Suspender el inhibidor de la bomba de protones 2 semanas antes',2,4,'var(--mid)'],['Tratamiento por 14 días',4,6,'var(--blue)'],['Prueba de control al menos 4 semanas después',10,12,'var(--ok)']].map(([t,a,b,c])=>`<div class="fil"><small style="color:${c}">${t}</small><div class="pista"><i style="left:${a/12*100}%;width:${(b-a)/12*100}%;background:${c}"></i></div></div>`).join('')+`<div class="ej"><span class="mk" style="left:0">Semana 0</span><span class="mk" style="left:${4/12*100}%">Prueba</span><span class="mk" style="left:100%">Semana 12</span></div>`;
$('#sxi-hpG').innerHTML=[['lab','Pruebas','Aliento con urea (de elección) o antígeno en heces. La serología no sirve para comprobar curación.'],['pild','Cuádruple con bismuto 14 días','Inhibidor de la bomba de protones, bismuto, tetraciclina y metronidazol. Preferida en México y en alergia a penicilina.'],['pild','Triple 14 días','Inhibidor, amoxicilina 1 g y claritromicina 500 mg cada 12 horas, solo con resistencia baja a claritromicina.'],['alerta','Qué causa','Gastritis, úlcera duodenal y gástrica, adenocarcinoma gástrico y linfoma MALT.']].map(([i,t,d])=>`<div class="dc"><h4>${ico(i,'var(--teal)')}${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Úlcera ---------- */
$('#sxi-ulc').innerHTML=`<div class="c" style="background:var(--blue2)"><small style="color:var(--blue)">Duodenal</small>Dolor que <b>mejora al comer</b> y despierta en la madrugada. Casi siempre por Helicobacter pylori. No necesita biopsia.</div><div class="c" style="background:var(--midb)"><small style="color:var(--mid)">Gástrica</small>Dolor que <b>empeora con la comida</b>; náusea y pérdida de peso. <b>Siempre biopsia</b> y endoscopia de control hasta cicatrizar.</div>`;
$('#sxi-ulcComp').innerHTML=[['Hemorragia','La más frecuente: hematemesis o melena.'],['Perforación','Dolor súbito intenso, abdomen en tabla, aire libre bajo el diafragma.'],['Obstrucción','Vómito de alimentos de horas antes, saciedad temprana.']].map(([t,d])=>`<div class="dc" style="border-color:transparent;background:var(--nob)"><h4 style="color:var(--no)">${t}</h4><div class="sub" style="color:var(--ink)">${d}</div></div>`).join('');

/* ---------- Referir ---------- */
$('#sxi-alarmas').innerHTML=[['endo','Endoscopia pronto','Cualquier dato de alarma o inicio después de los 50 años.'],['lab','Gastroenterología','Síntomas que persisten tras tratamiento empírico y dos intentos de erradicación, Barrett o estenosis.'],['alerta','Urgencias','Hematemesis o melena con inestabilidad, dolor abdominal súbito e intenso o vómito que impide comer.']].map(([i,t,d])=>`<div class="dc" style="border-color:transparent;background:var(--nob)"><h4><span style="color:var(--no);display:flex">${ico(i)}</span>${t}</h4><div class="sub" style="color:var(--ink)">${d}</div></div>`).join('');

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Pirosis típica sin alarma?','Inhibidor de la bomba de protones 8 semanas, sin estudios.'],['¿Prueba más exacta para reflujo?','pH-metría de 24 horas.'],['¿Barrett?','Metaplasia intestinal; riesgo de adenocarcinoma.'],['¿Prueba de elección para Helicobacter pylori?','Aliento con urea.'],['¿Úlcera gástrica?','Siempre biopsia.'],['¿Cirugía antirreflujo?','Funduplicatura de Nissen laparoscópica.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Tratamiento empírico de la dispepsia','Guía de 2009: metoclopramida, luego ranitidina y luego omeprazol; erradicar si no responde.','Buscar y tratar Helicobacter pylori primero y luego inhibidor de la bomba de protones. La ranitidina se retiró en 2020.'],['Esquema para Helicobacter pylori','Triple o cuádruple; cuádruple con bismuto si recurre.','Cuádruple con bismuto 14 días de primera línea por la resistencia a claritromicina.'],['Dato de alarma por edad','Inicio después de los 50 años.','Igual: endoscopia si los síntomas empiezan después de los 50.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--midb)"><small style="color:var(--mid)">Guía mexicana</small>${g}</div><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">Usa esto</small>${a}</div></div></div>`).join('');
}};
ILU["urologia-2"]={
html:()=>`<div class="sxi"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="sxi-i-term" viewBox="0 0 24 24"><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></symbol><symbol id="sxi-i-gota" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></symbol><symbol id="sxi-i-ojo" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="sxi-i-tos" viewBox="0 0 24 24"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></symbol><symbol id="sxi-i-pild" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7ZM8.5 8.5l7 7"/></symbol><symbol id="sxi-i-jer" viewBox="0 0 24 24"><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/></symbol><symbol id="sxi-i-alerta" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></symbol><symbol id="sxi-i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol><symbol id="sxi-i-cor" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></symbol><symbol id="sxi-i-ok" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="sxi-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol><symbol id="sxi-i-vaso" viewBox="0 0 24 24"><path d="M5 3h14l-2 18H7ZM6 9c2 1.3 4 1.3 6 0s4-1.3 6 0"/></symbol><symbol id="sxi-i-miel" viewBox="0 0 24 24"><path d="M7 7h10v3a5 5 0 0 1 2 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a5 5 0 0 1 2-4ZM8 3h8v4H8z"/></symbol><symbol id="sxi-i-spray" viewBox="0 0 24 24"><path d="M9 10h6v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2ZM10 10V6l2-4 2 4v4M5 5l2 1M4 9h2M18 6l2-1M18 9h2"/></symbol><symbol id="sxi-i-bebe" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7M10 7h.01M14 7h.01"/></symbol><symbol id="sxi-i-mayor" viewBox="0 0 24 24"><circle cx="11" cy="5" r="2.5"/><path d="M11 8v7l-3 6M11 15l3 6M8 11l3-2 3 2M17 11v10"/></symbol><symbol id="sxi-i-emb" viewBox="0 0 24 24"><circle cx="11" cy="4.5" r="2.5"/><path d="M10 8c-2 1-2 4-1 6l-1 7M12 8c3 1 5 3.5 4 6.5-.6 1.8-2.6 2-4 1.5M11 16l1 5"/></symbol><symbol id="sxi-i-cron" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></symbol><symbol id="sxi-i-cam" viewBox="0 0 24 24"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5Z"/><circle cx="12" cy="13" r="3.5"/></symbol><symbol id="sxi-i-libro" viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24H20M8 7h8M8 11h6"/></symbol><symbol id="sxi-i-gang" viewBox="0 0 24 24"><path d="M7 3c-1 4 0 8 3 11s4 6 3 8"/><circle cx="14" cy="9" r="2.5"/><circle cx="17" cy="14" r="2"/></symbol><symbol id="sxi-i-pulm" viewBox="0 0 24 24"><path d="M12 3v8M12 11c-1.5 1-3 1-3 1M12 11c1.5 1 3 1 3 1M9 6.5C6 7 3 11 3 16c0 3 1 5 3 5s3-1.5 3-4V6.5ZM15 6.5c3 .5 6 4.5 6 9.5 0 3-1 5-3 5s-3-1.5-3-4V6.5Z"/></symbol><symbol id="sxi-i-bazo" viewBox="0 0 24 24"><path d="M7 4c5-2 12 1 12 7s-5 10-10 9c-3-.6-5-3-4-6 .8-2.3 3-2.5 3-5S5 5 7 4Z"/></symbol><symbol id="sxi-i-piel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="9" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="11" r="1"/></symbol><symbol id="sxi-i-cerebro" viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></symbol><symbol id="sxi-i-sal" viewBox="0 0 24 24"><path d="M8 9h8l-1 12H9ZM9 9l1-5h4l1 5M11 6h.01M13 6h.01"/></symbol><symbol id="sxi-i-rinon" viewBox="0 0 24 24"><path d="M9 3C5 3 3 7 3 12s2 9 6 9c2.5 0 3-2 3-4 0-1.5-1.5-2.5-1.5-5S12 8.5 12 7c0-2-1-4-3-4ZM15 3c4 0 6 4 6 9s-2 9-6 9"/></symbol><symbol id="sxi-i-correr" viewBox="0 0 24 24"><circle cx="15" cy="4" r="2"/><path d="m4 17 4-1 2-4 3 2v6M10 12l1-5 4 2 3 3M7 9l4-2"/></symbol><symbol id="sxi-i-pesa" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></symbol><symbol id="sxi-i-copa" viewBox="0 0 24 24"><path d="M8 3h8l-1 7a3 3 0 0 1-6 0ZM12 13v7M8 21h8"/></symbol><symbol id="sxi-i-humo" viewBox="0 0 24 24"><path d="M3 15h13v3H3zM18 15h3v3h-3M18 11c0-2 2-2 2-4M21 11c0-2 1-3 0-5M2 2l20 20"/></symbol><symbol id="sxi-i-plato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 12h9"/></symbol><symbol id="sxi-i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/></symbol><symbol id="sxi-i-ecg" viewBox="0 0 24 24"><path d="M2 12h5l2-5 3 10 2-5h8"/></symbol><symbol id="sxi-i-luna" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></symbol><symbol id="sxi-i-pie" viewBox="0 0 24 24"><path d="M8 21c-2 0-3-2-3-5 0-4 1-7 1-10a3 3 0 0 1 6 0c0 3-1 5-1 8s2 4 2 5-1 2-5 2ZM15 4h.01M17.5 5.5h.01M19 8h.01M19.5 11h.01"/></symbol><symbol id="sxi-i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol><symbol id="sxi-i-cinta" viewBox="0 0 24 24"><path d="M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2"/></symbol><symbol id="sxi-i-mano" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol><symbol id="sxi-i-endo" viewBox="0 0 24 24"><path d="M4 4c6 0 6 8 12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="16" r="1.5"/></symbol></svg><nav class="snav" aria-label="Secciones"><button type="button" data-ir="mapa">Mapa</button><button type="button" data-ir="complicada">¿Complicada?</button><button type="button" data-ir="tira">Tira reactiva</button><button type="button" data-ir="cultivo">Urocultivo</button><button type="button" data-ir="tratamiento">Tratamiento</button><button type="button" data-ir="bacteriuria">Bacteriuria</button><button type="button" data-ir="recurrente">Recurrente</button><button type="button" data-ir="referir">Referir</button><button type="button" data-ir="perlas">Perlas</button><button type="button" data-ir="mexico">México</button></nav><section class="scard glass" id="sxi-mapa">
<h2>¿Dónde está la infección?</h2>
<div class="seg sexo" id="sxi-segSexo"></div>
<div class="duo">
<div class="ilu" style="background:var(--aire)"><svg id="sxi-via" viewBox="0 0 300 330" role="img" aria-label="Riñones, uréteres, vejiga, uretra y próstata"></svg></div>
<div><div class="seg" id="sxi-segVia"></div><div class="spanel" id="sxi-infoVia"></div></div>
</div>
</section>

<section class="scard glass" id="sxi-complicada">
<h2>¿Complicada o no complicada?</h2>
<p class="muted">Marca lo que tenga tu paciente.</p>
<div class="crit" id="sxi-chkComp"></div>
<div class="res" id="sxi-resComp"></div>
</section>

<section class="scard glass" id="sxi-tira">
<h2>Diagnóstico: síntomas y tira reactiva</h2>
<div class="seg" id="sxi-segSint"></div>
<div class="crit"><label><input type="checkbox" id="sxi-vag">Tiene flujo o prurito vaginal</label></div>
<h3>Toca cada cuadro de la tira</h3>
<div class="tira"><div class="tirabase"></div><button type="button" class="pad" id="sxi-padN">Nitritos</button><button type="button" class="pad" id="sxi-padE">Esterasa</button></div>
<div class="res" id="sxi-resTira"></div>
<p class="nota">Los nitritos aparecen cuando las enterobacterias reducen los nitratos; la esterasa leucocitaria indica piuria. Una tira negativa no descarta la infección.</p>
</section>

<section class="scard glass" id="sxi-cultivo">
<h2>Urocultivo: ¿cuántas colonias son significativas?</h2>
<div class="seg" id="sxi-segMuestra"></div>
<div class="res" id="sxi-resCult"></div>
<p class="nota">Pide urocultivo en pielonefritis, infección complicada, embarazo, varón, recurrencia o falla al tratamiento.</p>
</section>

<section class="scard glass" id="sxi-tratamiento">
<h2>¿Qué le doy?</h2>
<div class="seg" id="sxi-segPac"></div>
<div class="sgrid" id="sxi-tx"></div>
<p class="nota" id="sxi-notaTx"></p>
</section>

<section class="scard glass" id="sxi-bacteriuria">
<h2>Bacteriuria sin síntomas: ¿tratar o no?</h2>
<p class="muted">Toca cada tarjeta para ver la respuesta.</p>
<div class="sgrid" id="sxi-flipsBa"></div>
</section>

<section class="scard glass" id="sxi-recurrente">
<h2>Infección recurrente</h2>
<div class="sgrid" id="sxi-recG"></div>
</section>

<section class="scard glass" id="sxi-referir">
<h2>Cuándo referir u hospitalizar</h2>
<div class="sgrid" id="sxi-alarmas"></div>
</section>

<section class="scard glass" id="sxi-perlas">
<h2>Perlas: toca para voltear</h2>
<div class="sgrid" id="sxi-flips"></div>
</section>

<section class="scard glass" id="sxi-mexico">
<h2>Guía mexicana frente a lo actual</h2>
<div class="scmp" id="sxi-cmp"></div>
<p class="nota">Fuentes: Manual CTO 14.ª edición, Urología capítulo 2; Guía de Práctica Clínica IMSS-077-08; Harrison 21.ª edición, capítulo 135.</p>
</section>
</div>`,
init:root=>{if(!root)return;
const $=s=>root.querySelector(s);
const ir=k=>{const el=$('#sxi-'+k);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-ir]');if(b){e.preventDefault();ir(b.dataset.ir)}});
const ico=(n,c='')=>`<svg class="ico" ${c?`style="color:${c}"`:''}><use href="#sxi-i-${n}"/></svg>`;
const seg=(el,ops,val,fn)=>{const r=()=>{el.innerHTML=ops.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')};r();el.onclick=e=>{const b=e.target.closest('button');if(!b)return;val=b.dataset.k;r();fn(val)};fn(val)};
const flips=(el,arr)=>{el.innerHTML=arr.map(([q,a])=>`<button type="button" class="flip" aria-pressed="false"><div class="in"><div class="cara frente"><b>${q}</b><small>Toca para ver la respuesta</small></div><div class="cara bk"><b style="font-size:16px;line-height:1.35">${a}</b><small>Toca para regresar</small></div></div></button>`).join('');el.onclick=e=>{const b=e.target.closest('.flip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')}};

/* ---------- Mapa ---------- */
const ZV={
 rin:{t:'Riñón',x:84,y:84,lx:6,ly:20,d:'Pielonefritis',txt:'Fiebre mayor de 38 °C, <b>dolor en fosa renal</b> con puñopercusión positiva, escalofríos y vómito. <b>Urocultivo antes</b> del antibiótico; ciprofloxacino 500 mg cada 12 horas por 7 días si puede ser ambulatoria.'},
 vej:{t:'Vejiga',x:150,y:236,lx:196,ly:188,d:'Cistitis',txt:'<b>Disuria, polaquiuria y urgencia</b>, dolor suprapúbico, hematuria terminal; <b>sin fiebre</b>. En mujer sana: tratamiento empírico sin estudios.'},
 ure:{t:'Uretra',x:150,y:304,lx:186,ly:296,d:'Uretritis',txt:'Disuria con secreción uretral. La causa más frecuente es <b>Chlamydia trachomatis</b>; también gonococo. Trata a la pareja.'},
 pro:{t:'Próstata',x:150,y:276,lx:6,ly:262,d:'Prostatitis aguda',txt:'Fiebre, <b>dolor perineal</b>, síntomas obstructivos y próstata muy dolorosa. <b>No hagas masaje prostático.</b> Quinolona por 2 a 4 semanas.'}};
let sexo='m',zv='vej';
const via=$('#sxi-via');
function dibVia(){const on=k=>k===zv,hl=k=>on(k)?'stroke="#0071e3" stroke-width="3.5"':'stroke="rgba(0,0,0,.2)" stroke-width="1.5"';
 const ks=Object.keys(ZV).filter(k=>k!=='pro'||sexo==='h');
 via.innerHTML=`<path d="M102 92C110 140 136 180 142 222M198 92C190 140 164 180 158 222" fill="none" stroke="${on('rin')?'#7fb3ec':'#d9a2a8'}" stroke-width="7" stroke-linecap="round"/>
 <path d="M84 40c-26 0-36 30-30 58s30 40 44 30c10-8 0-18 4-34s-4-54-18-54Z" fill="${on('rin')?'#e2474f':'#b8525e'}" ${hl('rin')}/>
 <path d="M216 40c26 0 36 30 30 58s-30 40-44 30c-10-8 0-18-4-34s4-54 18-54Z" fill="${on('rin')?'#e2474f':'#b8525e'}" ${hl('rin')}/>
 <path d="M112 230C112 206 188 206 188 230C188 262 168 272 150 272C132 272 112 262 112 230Z" fill="${on('vej')?'#ffb347':'#f1c27d'}" ${hl('vej')}/>
 ${sexo==='h'?`<ellipse cx="150" cy="282" rx="22" ry="14" fill="${on('pro')?'#c38bea':'#d7b3ee'}" ${hl('pro')}/>`:''}
 <path d="M150 272V${sexo==='h'?326:300}" stroke="${on('ure')?'#0071e3':'#d9a2a8'}" stroke-width="7" stroke-linecap="round"/>
 ${ks.map(k=>{const z=ZV[k],w=z.t.length*7.6+24,cx=z.lx+w/2;return `<g class="hs" data-k="${k}" tabindex="0" role="button" aria-label="${z.t}">
 <line x1="${cx}" y1="${z.ly+13}" x2="${z.x}" y2="${z.y}" stroke="${on(k)?'#0071e3':'rgba(0,0,0,.35)'}" stroke-width="1.5" stroke-dasharray="3 3"/>
 <circle cx="${z.x}" cy="${z.y}" r="14" fill="#0071e3" class="pulso"/><circle cx="${z.x}" cy="${z.y}" r="6" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="2.5"/>
 <rect x="${z.lx}" y="${z.ly}" width="${w}" height="26" rx="13" fill="${on(k)?'#0071e3':'#fff'}" stroke="#0071e3" stroke-width="1.5"/>
 <text x="${cx}" y="${z.ly+17.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${on(k)?'#fff':'#0071e3'}">${z.t}</text></g>`}).join('')}`;
 const z=ZV[zv];$('#sxi-infoVia').innerHTML=`<div class="muted">${z.t}</div><h3 style="margin:2px 0 6px">${z.d}</h3><p>${z.txt}</p>`;
 $('#sxi-segVia').innerHTML=ks.map(k=>`<button type="button" data-k="${k}" aria-pressed="${k===zv}">${ZV[k].t}</button>`).join('')}
$('#sxi-segVia').onclick=e=>{const b=e.target.closest('button');if(b){zv=b.dataset.k;dibVia()}};
via.addEventListener('click',e=>{const g=e.target.closest('.hs');if(g){zv=g.dataset.k;dibVia()}});
via.addEventListener('keydown',e=>{const g=e.target.closest('.hs');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();zv=g.dataset.k;dibVia()}});
seg($('#sxi-segSexo'),[['m','Mujer'],['h','Hombre']],'m',k=>{sexo=k;if(k==='m'&&zv==='pro')zv='vej';dibVia()});

/* ---------- Complicada ---------- */
const CP=['Es hombre','Embarazo','Sonda vesical','Litiasis u obstrucción','Anomalía de la vía urinaria o reflujo vesicoureteral','Insuficiencia renal o trasplante','Inmunosupresión o diabetes descontrolada','Fiebre y dolor lumbar (pielonefritis)'];
$('#sxi-chkComp').innerHTML=CP.map((t,i)=>`<label><input type="checkbox" data-i="${i}">${t}</label>`).join('');
function comp(){const n=[...$('#sxi-chkComp').querySelectorAll('input')].filter(x=>x.checked);const c=n.length>0;
 $('#sxi-resComp').style.background=c?'var(--midb)':'var(--okb)';
 $('#sxi-resComp').innerHTML=`<div style="color:${c?'var(--mid)':'var(--ok)'};display:flex">${ico(c?'alerta':'ok')}</div><div>${c?'<b>Infección complicada.</b> Pide urocultivo, tratamiento más largo (7 días o más) y vigila de cerca.':'<b>Cistitis no complicada.</b> Mujer sana no embarazada: tratamiento corto y empírico, sin estudios.'}</div>`}
$('#sxi-chkComp').addEventListener('change',comp);comp();

/* ---------- Tira reactiva ---------- */
let sint='2',N=false,E=false;
function tira(){$('#sxi-padN').style.background=N?'#d6337a':'#f4d8e6';$('#sxi-padN').style.color=N?'#fff':'#9a4b72';$('#sxi-padE').style.background=E?'#7a3fbf':'#e9ddf6';$('#sxi-padE').style.color=E?'#fff':'#6b4a99';
 $('#sxi-padN').textContent=N?'Nitritos +':'Nitritos −';$('#sxi-padE').textContent=E?'Esterasa +':'Esterasa −';
 const vag=$('#sxi-vag').checked;let t,c;
 if(vag){t='<b>Explora:</b> con flujo o prurito vaginal piensa en vaginitis o infección de transmisión sexual antes que en cistitis.';c='mid'}
 else if(sint==='2'){t='<b>Trata sin estudios:</b> con dos o más síntomas clásicos la probabilidad de cistitis es alta; la tira no cambia la conducta.';c='ok'}
 else if(sint==='1'){t=(N||E)?'<b>Trata:</b> con un solo síntoma y tira positiva la probabilidad de bacteriuria es cercana a 80%.':'<b>No descarta:</b> con un síntoma y tira negativa, explora, considera examen microscópico o urocultivo antes de tratar.';c=(N||E)?'ok':'mid'}
 else{t='<b>No busques ni trates</b> bacteriuria en una mujer no embarazada sin síntomas.';c='ok'}
 $('#sxi-resTira').style.background=`var(--${c}b)`;$('#sxi-resTira').innerHTML=`<div style="color:var(--${c});display:flex">${ico('lab')}</div><div>${t}</div>`}
seg($('#sxi-segSint'),[['2','Dos o más síntomas clásicos'],['1','Un solo síntoma'],['0','Sin síntomas']],'2',k=>{sint=k;tira()});
$('#sxi-padN').onclick=()=>{N=!N;tira()};$('#sxi-padE').onclick=()=>{E=!E;tira()};$('#sxi-vag').addEventListener('change',tira);

/* ---------- Urocultivo ---------- */
const MU={chorro:['100,000','Chorro medio sin síntomas o recuento clásico','Si crecen dos o más especies, piensa en contaminación.'],sint:['1,000','Mujer con síntomas y piuria','Recuentos bajos pueden ser infección activa si hay síntomas.'],pielo:['10,000','Pielonefritis o varón',''],cat:['100','Muestra por cateterismo',''],pun:['Cualquiera','Punción suprapúbica','La vejiga es estéril: cualquier bacteria es significativa.']};
seg($('#sxi-segMuestra'),[['chorro','Chorro medio'],['sint','Mujer con síntomas'],['pielo','Pielonefritis o varón'],['cat','Cateterismo'],['pun','Punción suprapúbica']],'chorro',k=>{const [n,t,x]=MU[k];$('#sxi-resCult').style.background='var(--blue2)';$('#sxi-resCult').innerHTML=`<div class="sn" style="color:var(--blue);font-size:clamp(26px,5.5vw,40px);min-width:auto">${n}</div><div><b>${t}.</b> Unidades formadoras de colonias por mL. ${x}</div>`});

/* ---------- Tratamiento ---------- */
const TX={
 cis:[[['Fosfomicina','3 g','dosis única'],['Nitrofurantoína','100 mg cada 12 horas','por 5 a 7 días'],['Trimetoprima con sulfametoxazol','160/800 mg cada 12 horas','por 3 días si la resistencia local es baja']],'No uses quinolonas de forma empírica. Fenazopiridina 100 mg cada 8 horas por 48 horas si la disuria es intensa.'],
 emb:[[['Fosfomicina','3 g','dosis única'],['Cefalexina','500 mg cada 6 a 12 horas','por 5 a 7 días'],['Amoxicilina con ácido clavulánico','500/125 mg cada 12 horas','por 5 a 7 días']],'Evita quinolonas y sulfonamidas en el tercer trimestre. Pide urocultivo de control. Pielonefritis en el embarazo: hospitalizar.'],
 var:[[['Según urocultivo','7 días','trimetoprima con sulfametoxazol o quinolona'],['Prostatitis aguda','Quinolona','por 2 a 4 semanas; sin masaje prostático'],['Orquiepididimitis menor de 35 años','Ceftriaxona más doxiciclina','por Chlamydia y gonococo']],'Toda infección urinaria en el varón es complicada.'],
 pie:[[['Ciprofloxacino','500 mg cada 12 horas','por 7 días si es ambulatoria'],['Ceftriaxona','1 g intravenosa o intramuscular','como dosis inicial o si no tolera la vía oral'],['Trimetoprima con sulfametoxazol','160/800 mg cada 12 horas','por 14 días solo si el germen es sensible']],'Urocultivo antes del antibiótico. Nitrofurantoína no sirve. Hospitaliza si hay sepsis, vómito, embarazo o no mejora en 48 a 72 horas.']};
seg($('#sxi-segPac'),[['cis','Cistitis en mujer sana'],['emb','Embarazada'],['var','Varón'],['pie','Pielonefritis']],'cis',k=>{const [c,n]=TX[k];$('#sxi-tx').innerHTML=c.map(([t,b,s])=>`<div class="dc"><h4>${ico('pild','var(--blue)')}${t}</h4><div class="sbig" style="font-size:20px">${b}</div><div class="sub">${s}</div></div>`).join('');$('#sxi-notaTx').innerHTML=n});

/* ---------- Bacteriuria ---------- */
flips($('#sxi-flipsBa'),[['Embarazada de 14 semanas','Sí: tratar y pedir urocultivo de control.'],['Mujer de 78 años, diabética','No tratar.'],['Antes de una resección transuretral de próstata','Sí: tratar antes del procedimiento.'],['Paciente con sonda permanente','No tratar si no hay síntomas.'],['Mujer sana de 30 años no embarazada','No buscar ni tratar.'],['Persiste 3 a 5 días después de retirar una sonda','Sí: tratar.']]);

/* ---------- Recurrente ---------- */
$('#sxi-recG').innerHTML=[['Definición','3 episodios en 12 meses o 2 en 6 meses (guía mexicana).'],['Reinfección o recaída','Reinfección: otro germen, lapsos largos (lo más frecuente). Recaída: mismo germen poco después; busca litiasis o prostatitis.'],['Relacionada con el coito','Una dosis de antibiótico después de la relación.'],['Profilaxis continua','Nitrofurantoína o trimetoprima con sulfametoxazol en dosis baja.'],['Posmenopáusica','Estrógenos vaginales tópicos.'],['Estudios de imagen','Solo con hematuria, sospecha de litiasis o mala respuesta.']].map(([t,d])=>`<div class="dc"><h4>${t}</h4><div class="sub">${d}</div></div>`).join('');

/* ---------- Referir ---------- */
$('#sxi-alarmas').innerHTML=[['alerta','Urgencias','Pielonefritis con sepsis, vómito persistente, embarazo, sospecha de obstrucción o absceso.'],['rinon','Urología','Recurrencias con hematuria, litiasis, anomalías anatómicas o prostatitis que no mejora.'],['lab','Segundo nivel','Cistitis que persiste tras un segundo esquema guiado por cultivo, con buen apego.']].map(([i,t,d])=>`<div class="dc" style="border-color:transparent;background:var(--nob)"><h4><span style="color:var(--no);display:flex">${ico(i)}</span>${t}</h4><div class="sub" style="color:var(--ink)">${d}</div></div>`).join('');

/* ---------- Perlas ---------- */
flips($('#sxi-flips'),[['¿Germen más frecuente?','Escherichia coli. Después, en mujer joven sexualmente activa, Staphylococcus saprophyticus.'],['¿Qué germen es resistente a nitrofurantoína?','Proteus, que además alcaliniza la orina.'],['¿Recuento significativo por punción suprapúbica?','Cualquiera.'],['¿Qué no se hace en la prostatitis aguda?','Masaje prostático.'],['¿Nitrofurantoína en pielonefritis?','No: casi no alcanza el riñón.'],['¿Bacteriuria asintomática en adulto mayor?','No se trata.']]);

/* ---------- México ---------- */
$('#sxi-cmp').innerHTML=[['Cistitis no complicada','Trimetoprima con sulfametoxazol 3 días de primera elección; nitrofurantoína 7 días de segunda; fosfomicina donde hay resistencia.','Nitrofurantoína 5 días o fosfomicina dosis única; trimetoprima con sulfametoxazol solo si la resistencia local es baja.'],['Pielonefritis','Ciprofloxacino; la guía menciona 7 o 14 días.','Ciprofloxacino 7 días en la no complicada.'],['Recurrencia','3 en 12 meses o 2 en 6 meses.','El CTO usa 4 o más al año.']].map(([t,g,a])=>`<div><h3 style="margin:4px 0">${t}</h3><div class="fila"><div class="c" style="background:var(--midb)"><small style="color:var(--mid)">Guía mexicana</small>${g}</div><div class="c" style="background:var(--okb)"><small style="color:var(--ok)">Usa esto</small>${a}</div></div></div>`).join('');
}};
})();
