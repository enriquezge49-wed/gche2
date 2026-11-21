/* GCHE2 · Ilustraciones de líneas finas para las escalas. Cada función recibe el valor elegido y devuelve el dibujo. */
(()=>{
'use strict';
const almond='M18 56 Q80 6 142 56 Q80 104 18 56 Z';
const star=(x,y)=>`<path class="acf" d="M${x} ${y-9} l3 6 6 -2 -3 5 5 4 -6 1 1 6 -5 -4 -4 5 0 -6 -6 -1 5 -4 -3 -6 6 2z"/>`;
const eye=n=>{const o={4:1,3:.62,2:.3,1:0}[n],c=78-70*o;
  return `<defs><clipPath id="hxEc"><path d="${almond}"/></clipPath></defs><path class="sk" d="M8 56 Q80 -8 152 56 Q80 118 8 56 Z" opacity=".35"/>
  <path class="scl" d="${almond}"/><g clip-path="url(#hxEc)"><circle class="ir" cx="80" cy="56" r="20"/><circle class="pu" cx="80" cy="56" r="8"/><path class="lid" d="M10 56 Q80 ${c} 150 56 L150 -10 L10 -10 Z"/></g>
  <path class="ln" d="M18 56 Q80 ${c} 142 56"/>
  ${o===0?[30,48,66,84,102,120].map((x,i)=>`<path class="ln" d="M${x+6} ${60+Math.sin(i/5*Math.PI)*10} l${-3+i*1.2} 9"/>`).join(''):''}
  ${n===3?'<path class="ac" d="M138 20 a10 10 0 0 1 0 14"/><path class="ac" d="M144 14 a18 18 0 0 1 0 26"/><path class="ac" d="M150 8 a26 26 0 0 1 0 38"/>':''}
  ${n===2?star(145,18):''}`};
const head=`<path class="sk" d="M44 104 C30 88 26 66 30 48 C35 26 54 14 74 16 C92 18 101 32 101 46 L109 60 C110 62 108 63 106 63 L102 64 C103 69 102 73 99 75 C101 79 98 82 94 82 C92 90 85 94 74 94 L70 104 Z"/><path class="ln" d="M82 44 q4 -3 8 0" opacity=".7"/>`;
const voice=n=>`${head}<path class="bub" d="M110 16 h40 a8 8 0 0 1 8 8 v28 a8 8 0 0 1 -8 8 h-26 l-10 10 l2 -10 h-6 a8 8 0 0 1 -8 -8 v-28 a8 8 0 0 1 8 -8 z" ${n===1?'stroke-dasharray="5 5"':''}/>
  ${n===5?'<rect class="tx" x="114" y="27" width="34" height="4" rx="2"/><rect class="tx" x="114" y="36" width="24" height="4" rx="2"/><rect class="tx" x="114" y="45" width="30" height="4" rx="2"/>':''}
  ${n===4?'<text class="tx" x="130" y="51" font-size="28" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">?</text>':''}
  ${n===3?'<rect class="tx" x="114" y="26" width="10" height="4" rx="2" transform="rotate(-12 119 28)"/><rect class="tx" x="130" y="30" width="14" height="4" rx="2" transform="rotate(15 137 32)"/><rect class="tx" x="117" y="40" width="8" height="4" rx="2" transform="rotate(20 121 42)"/><rect class="tx" x="133" y="44" width="11" height="4" rx="2" transform="rotate(-18 138 46)"/>':''}
  ${n===2?'<path class="ln" d="M114 40 q4 -10 8 0 t8 0 t8 0 t8 0" style="stroke-width:2.6"/>':''}
  ${n===1?'<path class="ac" d="M118 26 l26 26"/>':''}`;
const POSE={6:[[88,40],[98,14]],5:[[88,46],[62,22]],4:[[86,72],[80,52]],3:[[76,80],[54,64]],2:[[74,82],[80,108]],1:[[70,84],[72,110]]};
const limb=(a,b,c)=>`<path class="lo" d="M${a} L${b} L${c}"/><path class="li" d="M${a} L${b} L${c}"/>`;
const motor=n=>{const [E,W]=POSE[n],S=[64,50];
  return `<g transform="translate(14 0)">${limb([16,50],[10,80],[12,106])}<circle class="hd" cx="12" cy="106" r="5.5"/>
  <path class="sk" d="M12 114 L12 60 Q14 44 40 44 Q66 44 68 60 L68 114 Z"/><path class="sk" d="M34 44 l1 -7 h10 l1 7 z"/><circle class="hd" cx="40" cy="22" r="14"/>
  ${n===5?star(58,14):''}${n===4?star(132,62)+'<path class="ac" d="M120 62 h-22 m7 -6 l-7 6 7 6"/>':''}
  ${limb(S,E,W)}<circle class="hd" cx="${W[0]}" cy="${W[1]}" r="${n===3?5:6.5}"/>
  ${n===6?'<path class="ac" d="M114 20 l6 6 12 -13" style="stroke-width:3;opacity:1"/>':''}
  ${n===3?'<path class="ac" d="M88 68 a14 14 0 0 0 -10 -14 m0 0 l1 6 m-1 -6 l6 1"/>':''}
  ${n===2?'<path class="ac" d="M94 88 a16 16 0 0 1 -4 18 m0 0 l6 -1 m-6 1 l0 -6"/>':''}</g>`};
const svg=(body,label,dim)=>`<svg viewBox="0 0 160 112" role="img" aria-label="${label}" class="${dim?'dim':''}">${body}</svg>`;
window.HXI={glasgow:{o:v=>svg(eye(v||4),'Apertura ocular',!v),v:v=>svg(voice(v||5),'Respuesta verbal',!v),m:v=>svg(motor(v||6),'Respuesta motora',!v)}};
})();
