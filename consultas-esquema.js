/* GCHE2 · Consultas: esquema de la historia clínica, la nota de consulta y la hoja de referencia.
   Basado en las plantillas aprobadas y en la Norma Oficial Mexicana NOM-004-SSA3-2012, Del expediente clínico.
   Tipos de expediente: h adulto hombre, m adulto mujer, e embarazada, p pediátrico, g adulto mayor. */
(()=>{
'use strict';
/* utilidades de fecha y cálculo */
const p2=n=>String(n).padStart(2,'0');
const fISO=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const pDate=s=>{if(!s||typeof s!=='string')return null;const a=s.split('-').map(Number);if(a.length<3||!a[0])return null;return new Date(a[0],a[1]-1,a[2])};
const fLarga=s=>{const d=pDate(s);return d?d.toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}):''};
const num=v=>{if(v===undefined||v===null||v==='')return null;const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
const r1=n=>Math.round(n*10)/10;
const diasDesde=s=>{const d=pDate(s);if(!d)return null;const h=new Date();h.setHours(0,0,0,0);return Math.round((h-d)/864e5)};
const edadDe=(fnac,ref=new Date())=>{const b=pDate(fnac);if(!b||b>ref)return null;let y=ref.getFullYear()-b.getFullYear(),m=ref.getMonth()-b.getMonth(),d=ref.getDate()-b.getDate();if(d<0){m--;d+=new Date(ref.getFullYear(),ref.getMonth(),0).getDate()}if(m<0){y--;m+=12}return{y,m,d,dias:Math.floor((ref-b)/864e5)}};
const edadTxt=e=>{if(!e)return'';if(e.y>=2)return e.y+' años';if(e.y===1)return '1 año'+(e.m?` ${e.m} ${e.m===1?'mes':'meses'}`:'');if(e.m>0)return `${e.m} ${e.m===1?'mes':'meses'}`+(e.d?` ${e.d} ${e.d===1?'día':'días'}`:'');return `${e.dias} ${e.dias===1?'día':'días'}`};
const edadP=p=>{const h=(p&&p.hc)||{};const e=edadDe(h.fnac);if(e)return edadTxt(e);return h.edad_txt?h.edad_txt+' años':''};
const aniosP=p=>{const h=(p&&p.hc)||{};const e=edadDe(h.fnac);if(e)return e.y+e.m/12;return num(h.edad_txt)};
const sexoP=p=>!p?'':p.tipo==='h'?'Hombre':(p.tipo==='m'||p.tipo==='e')?'Mujer':((p.hc||{}).sexo||'');
const evolTxt=s=>{const d=diasDesde(s);if(d===null||d<0)return'';if(d<1)return 'Menos de un día';if(d<14)return d+(d===1?' día':' días');if(d<60)return Math.floor(d/7)+' semanas';if(d<730)return Math.floor(d/30.4)+' meses';return Math.floor(d/365.25)+' años'};
const sdgDe=fum=>{const d=diasDesde(fum);if(d===null||d<0||d>320)return null;return{w:Math.floor(d/7),d:d%7,dias:d}};
const sdgTxt=s=>s?`${s.w} semanas${s.d?` y ${s.d} ${s.d===1?'día':'días'}`:''}`:'';
const fppDe=fum=>{const f=pDate(fum);if(!f)return'';const x=new Date(f);x.setDate(x.getDate()+280);return fLarga(fISO(x))};
const imcDe=d=>{const w=num(d.peso),t=num(d.talla);if(!w||!t)return null;const m=t>3?t/100:t;return w/(m*m)};
const imcClas=v=>v<18.5?'bajo peso':v<25?'peso normal':v<30?'sobrepeso':v<35?'obesidad grado I':v<40?'obesidad grado II':'obesidad grado III';
const tallaCm=d=>{const t=num(d.talla);return t?(t>3?t:t*100):null};
const pesoIdeal=(d,sx)=>{const t=tallaCm(d);if(!t||!sx)return null;return(sx==='Hombre'?50:45.5)+2.3*(t/2.54-60)};
const ckdEpi=(cr,edad,sx)=>{if(!cr||!edad||edad<18||!sx)return null;const f=sx==='Mujer',k=f?.7:.9,a=f?-.241:-.302;return 142*Math.pow(Math.min(cr/k,1),a)*Math.pow(Math.max(cr/k,1),-1.2)*Math.pow(.9938,edad)*(f?1.012:1)};
const kdigo=g=>g>=90?'G1':g>=60?'G2':g>=45?'G3a':g>=30?'G3b':g>=15?'G4':'G5';
const cockcroft=(cr,edad,peso,sx)=>{if(!cr||!edad||!peso||!sx)return null;return(140-edad)*peso/(72*cr)*(sx==='Mujer'?.85:1)};
const holliday=kg=>kg<=10?100*kg:kg<=20?1000+50*(kg-10):1500+20*(kg-20);

/* constructores de campos */
const F=(t,id,l,o={})=>Object.assign({t,id,l},o);
const ln=(id,l,o)=>F('ln',id,l,o),tx=(id,l,o)=>F('tx',id,l,o),nm=(id,l,o)=>F('nm',id,l,o),dt=(id,l,o)=>F('dt',id,l,o),hr=(id,l,o)=>F('hr',id,l,o);
const se=(id,l,op,o)=>F('se',id,l,Object.assign({op},o)),ck=(id,l,op,o)=>F('ck',id,l,Object.assign({op},o)),bo=(id,l,o)=>F('bo',id,l,o);
const au=(id,l,fn,o)=>F('au',id,l,Object.assign({fn},o)),hd=(l,o)=>F('hd','',l,o),nt=(l,o)=>F('nt','',l,o),sl=(id,l,o)=>F('sl',id,l,o);
const sy=(id,l,op)=>F('sy',id,l,{op}),rg=(id,l,def,det,o)=>F('rg',id,l,Object.assign({def,det},o)),rw=(id,l,cols,o)=>F('rw',id,l,Object.assign({cols},o));
const tm=(id,l,o)=>F('tm',id,l,o),gr=(id,l,o)=>F('gr',id,l,o),bt=(l,act,o)=>F('bt','',l,Object.assign({act},o));
const has=(a,x)=>Array.isArray(a)&&a.includes(x);
const mujer=c=>c.sexo==='Mujer',hombre=c=>c.sexo==='Hombre';

/* listas */
const ESC=['Ninguna','Primaria','Secundaria','Bachillerato','Licenciatura','Posgrado'];
const FAM=['Padre','Madre','Hermanos','Abuelos paternos','Abuelos maternos','Hijos'];
const HF=['Diabetes mellitus','Hipertensión arterial','Cardiopatía isquémica o muerte súbita antes de los 55 años en hombres o 65 en mujeres','Enfermedad vascular cerebral','Dislipidemia','Cáncer','Enfermedad renal crónica','Enfermedad tiroidea','Asma y alergias','Enfermedad psiquiátrica','Epilepsia u otra enfermedad neurológica','Tuberculosis'];
const CRON=['Diabetes mellitus','Hipertensión arterial','Dislipidemia','Cardiopatía','Asma','Enfermedad pulmonar obstructiva crónica','Enfermedad renal crónica','Enfermedad tiroidea','Epilepsia','Depresión o ansiedad','Infección por virus de la inmunodeficiencia humana','Hepatitis viral','Tuberculosis','Cáncer','Otra'];
const FREQ=['Nunca','1 a 2 días','3 a 4 días','5 a 7 días'];
const ALARMA_OBST=['Sangrado vaginal','Salida de líquido','Dolor abdominal o contracciones','Disminución de movimientos fetales','Cefalea intensa','Fosfenos','Acufenos','Epigastralgia','Edema de cara y manos','Fiebre','Disuria'];
const AIEPI=['No puede beber ni amamantar','Vomita todo','Convulsiones','Letargia o inconsciencia','Dificultad respiratoria','Signos de deshidratación'];
const MEDC=[['n','Medicamento'],['d','Dosis'],['v','Vía'],['f','Frecuencia']];
const RXC=[['n','Medicamento (genérico y comercial)',{w:1}],['pr','Presentación'],['d','Dosis'],['v','Vía'],['f','Frecuencia'],['t','Duración']];
const DXC=[['n','Diagnóstico',{w:1}],['c','Código de la Clasificación Internacional de Enfermedades'],['e','Presuntivo o definitivo',{op:['Presuntivo','Definitivo']}]];

/* frases rápidas */
const FR={
  pa:['Inicia su padecimiento hace ','Refiere que el cuadro inició de forma súbita.','Niega fiebre.','Niega otros síntomas acompañantes.','Ha recibido tratamiento sin mejoría.','Acude por persistencia de los síntomas.'],
  evol:['Refiere mejoría del cuadro clínico.','Refiere persistencia de los síntomas.','Niega fiebre.','Niega datos de alarma.','Con adecuado apego al tratamiento indicado.','Tolera la vía oral.'],
  anal:['Paciente estable, sin datos de alarma.','Se integra el diagnóstico por clínica.','Sin datos de urgencia en este momento.','Evolución favorable con el tratamiento.'],
  med:['Dieta normal.','Dieta blanda.','Abundantes líquidos orales.','Reposo relativo.','Lavado de manos frecuente.','Medios físicos para control de la temperatura.'],
  ind:['Tome sus medicamentos a la hora indicada y no los suspenda sin consultar.','Tome abundante agua.','Lávese las manos con frecuencia.','Descanse en casa.','Coma alimentos suaves y en poca cantidad.','Regrese a consulta si no mejora.'],
  alarma:c=>[c.tipo==='e'?'Acuda a urgencias si presenta sangrado o salida de líquido por la vagina, dolor de cabeza intenso, ve lucecitas, le zumban los oídos, tiene dolor en la boca del estómago, se le hinchan la cara o las manos, tiene fiebre o siente que el bebé se mueve menos.':c.tipo==='p'?'Acuda a urgencias si su hijo no puede beber ni mamar, vomita todo, tiene convulsiones, está muy dormido o le cuesta trabajo respirar.':c.tipo==='g'?'Acuda a urgencias si presenta confusión de inicio reciente, una caída, dificultad para respirar, fiebre o deja de comer o de beber.':'Acuda a urgencias si presenta fiebre que no baja, dificultad para respirar, dolor intenso, vómito que no se quita, confusión o somnolencia.']
};

/* interrogatorio por aparatos y sistemas */
const ROS=[['ros_gen','Síntomas generales',['Fiebre','Astenia','Adinamia','Hiporexia','Pérdida de peso','Ganancia de peso','Diaforesis']],
 ['ros_piel','Piel y anexos',['Prurito','Cambios de coloración','Lesiones','Caída de cabello','Cambios en uñas']],
 ['ros_sent','Órganos de los sentidos',['Visión borrosa','Acufenos','Hipoacusia','Otalgia','Epistaxis','Odinofagia']],
 ['ros_resp','Respiratorio',['Tos','Expectoración','Disnea','Hemoptisis','Sibilancias','Dolor torácico pleurítico']],
 ['ros_cv','Cardiovascular',['Dolor precordial','Palpitaciones','Disnea de esfuerzo','Ortopnea','Edema','Síncope']],
 ['ros_dig','Digestivo',['Disfagia','Pirosis','Náusea','Vómito','Dolor abdominal','Diarrea','Estreñimiento','Hematemesis','Melena','Ictericia']],
 ['ros_uri','Urinario',['Disuria','Polaquiuria','Urgencia','Hematuria','Poliuria','Nicturia','Incontinencia']],
 ['ros_gen2','Genital',['Flujo','Sangrado anormal','Dolor pélvico o testicular','Lesiones']],
 ['ros_end','Endocrino',['Polidipsia','Polifagia','Intolerancia al frío','Intolerancia al calor','Cambios de peso sin causa']],
 ['ros_hem','Hematológico y linfático',['Palidez','Sangrados','Equimosis fáciles','Adenopatías']],
 ['ros_me','Musculoesquelético',['Artralgias','Mialgias','Rigidez matutina','Limitación del movimiento']],
 ['ros_neu','Nervioso',['Cefalea','Mareo','Vértigo','Convulsiones','Parestesias','Debilidad','Alteraciones de la memoria']],
 ['ros_psi','Psíquico',['Ánimo deprimido','Ansiedad','Insomnio','Irritabilidad']]];

/* exploración por regiones: id, región, texto normal, qué revisar si está alterada, obligatoria */
const REG=[['x_cab','Cabeza','Normocéfala, sin hundimientos ni exostosis.','',1],
 ['x_ojo','Ojos','Pupilas isocóricas y normorreflécticas, conjuntivas sin alteraciones.','Agudeza visual con cartilla de Snellen por ojo, campos visuales por confrontación, movimientos oculares y fondo de ojo: papila, vasos, exudados y hemorragias.',1],
 ['x_oid','Oídos y nariz','Conductos permeables, sin secreciones.','Otoscopia con estado de la membrana timpánica y pruebas de Rinne y Weber.',1],
 ['x_boc','Boca y orofaringe','Mucosas hidratadas, faringe sin hiperemia, amígdalas sin exudado.','',1],
 ['x_cue','Cuello','Cilíndrico, tráquea central, sin adenopatías, tiroides no palpable.','Pulsos carotídeos y soplos, ingurgitación yugular, tiroides con tamaño y nódulos; ganglios cervicales, supraclaviculares, axilares e inguinales con tamaño, consistencia, movilidad y dolor.',1],
 ['x_tp','Tórax pulmonar','Movimientos de amplexión y amplexación normales, murmullo vesicular presente, sin estertores.','Inspección, vibraciones vocales, percusión y auscultación; ruidos agregados (estertores crepitantes, sibilancias, roncus, frote pleural) con su localización.',1],
 ['x_tc','Tórax cardiaco','Ruidos cardiacos rítmicos, de buena intensidad, sin soplos.','Choque de punta, ritmo, focos aórtico, pulmonar, tricuspídeo y mitral; soplos con foco, momento del ciclo y grado del I al VI; tercer o cuarto ruido.',1],
 ['x_mam','Mamas (opcional, con consentimiento)','Sin masas, retracciones ni secreción.','',0],
 ['x_abd','Abdomen','Blando, depresible, no doloroso, sin visceromegalias, peristalsis presente.','Inspección, auscultación, percusión y palpación superficial y profunda; dolor por cuadrante; signos de Murphy, McBurney, rebote, Rovsing, psoas, obturador y Giordano; hernias y tamaño del hígado.',1],
 ['x_gen','Genitales (opcional, con consentimiento y acompañante)','Sin alteraciones.','',0],
 ['x_col','Columna','Sin deformidades, sin dolor a la percusión.','',1],
 ['x_ext','Extremidades','Íntegras, pulsos presentes y simétricos, llenado capilar inmediato, sin edema.','Pulsos radial, femoral, poplíteo, pedio y tibial posterior por lado; edema con fóvea y su grado; várices y cambios tróficos. Si hay diabetes: inspección del pie, deformidades, úlceras, sensibilidad con monofilamento y con diapasón, y pulsos.',1],
 ['x_neu','Neurológico','Consciente, orientado, pares craneales sin alteraciones, fuerza y reflejos conservados y simétricos, sensibilidad y coordinación sin alteraciones.','Estado mental; pares craneales del I al XII; fuerza por segmento en escala de Daniels de 0 a 5 y tono; reflejos bicipital, tricipital, rotuliano y aquíleo de 0 a 4 y signo de Babinski; sensibilidad táctil, dolorosa, vibratoria y propioceptiva; dedo-nariz, talón-rodilla, marcha y Romberg; signos meníngeos.',1],
 ['x_piel','Piel','Sin lesiones.','Lesiones primarias y secundarias, número, tamaño y ubicación.',1],
 ['x_rec','Tacto rectal (opcional, solo si está indicado y con consentimiento)','','Hallazgos.',0]];
const ASP='Consciente, orientado en sus tres esferas, cooperador, facies no característica, constitución mediana, marcha sin alteraciones, hidratado, con buena coloración de piel y mucosas, en buen estado general.';
const EXPL_NORMAL=ASP+' '+REG.filter(r=>r[4]).map(r=>r[1]+': '+r[2]).join(' ');

/* cálculos automáticos que usan los datos */
const A={
  edad:c=>edadP(c.p),
  imc:c=>{const v=imcDe(c.d);if(!v)return'';return c.tipo==='p'?`${r1(v)} kilogramos por metro cuadrado (en niños se interpreta con percentiles)`:`${r1(v)} kilogramos por metro cuadrado: ${imcClas(v)} según la Organización Mundial de la Salud`},
  pam:c=>{const s=num(c.d.ta_s),d=num(c.d.ta_d);return s&&d?Math.round((s+2*d)/3)+' milímetros de mercurio':''},
  sdg:c=>sdgTxt(sdgDe(c.d.fum)),
  fpp:c=>fppDe(c.d.fum),
  trim:c=>{const s=sdgDe(c.d.fum);return !s?'':s.w<14?'Primer trimestre':s.w<28?'Segundo trimestre':'Tercer trimestre'},
  sdgUs:c=>{const w=num(c.d.us_sdg),dd=diasDesde(c.d.us_f);if(w===null||dd===null)return'';const t=Math.round(w*7+(num(c.d.us_dias)||0)+dd);return sdgTxt({w:Math.floor(t/7),d:t%7})},
  it:c=>{const a=num(c.d.tab_cig),b=num(c.d.tab_anios);return a&&b?r1(a*b/20)+' paquetes-año':''},
  iehl:c=>{const a=num(c.d.lena_h),b=num(c.d.lena_a);return a&&b?r1(a*b)+' horas-año':''},
  formula:c=>{const d=c.d,k=['g','pa','ce','ab','ec'];if(!k.some(x=>num(d[x])!==null))return'';return `Gestas ${num(d.g)||0}, partos ${num(d.pa)||0}, cesáreas ${num(d.ce)||0}, abortos ${num(d.ab)||0}, ectópicos ${num(d.ec)||0}`},
  inter:c=>{const a=c.d.ult_evento,b=c.d.fum;const x=pDate(a),y=pDate(b);if(!x||!y||y<x)return'';return Math.floor((y-x)/864e5/30.4)+' meses'},
  ict:c=>{const ci=num(c.d.cintura),t=tallaCm(c.d);return ci&&t?String(Math.round(ci/t*100)/100):''},
  sc:c=>{const w=num(c.d.peso),t=tallaCm(c.d);return w&&t?(Math.round(Math.sqrt(w*t/3600)*100)/100)+' metros cuadrados (fórmula de Mosteller)':''},
  pi:c=>{const v=pesoIdeal(c.d,c.sexo);return v&&v>0?r1(v)+' kilogramos (fórmula de Devine)':''},
  paj:c=>{const v=pesoIdeal(c.d,c.sexo),w=num(c.d.peso);return v&&w&&w>v?r1(v+.4*(w-v))+' kilogramos':''},
  cg:c=>{const v=cockcroft(num(c.d.cr),aniosP(c.p),num(c.d.peso),c.sexo);return v?Math.round(v)+' mililitros por minuto':''},
  tfg:c=>{const v=ckdEpi(num(c.d.cr),aniosP(c.p),c.sexo);return v?`${Math.round(v)} mililitros por minuto por 1.73 metros cuadrados, estadio ${kdigo(v)} de KDIGO`:''},
  tfgErc:c=>{const v=ckdEpi(num(c.d.cr_ult),aniosP(c.p),c.sexo);return v?`${Math.round(v)} mililitros por minuto por 1.73 metros cuadrados, estadio ${kdigo(v)} de KDIGO`:''},
  hs:c=>{const w=num(c.d.peso);if(!w)return'';const v=holliday(w);return `${Math.round(v)} mililitros al día, ${r1(v/24)} mililitros por hora (Holliday-Segar)`},
  evol:c=>evolTxt(c.d.pa_inicio),
  orto:c=>{const a=num(c.d.orto_s1),b=num(c.d.orto_s2),x=num(c.d.orto_d1),y=num(c.d.orto_d2);return a&&b&&x&&y?`Cambio al ponerse de pie: sistólica ${b-a>=0?'+':''}${b-a}, diastólica ${y-x>=0?'+':''}${y-x} milímetros de mercurio`:''},
  imcPre:c=>{const v=imcDe({peso:c.d.peso_pre,talla:c.d.talla});return v?`${r1(v)}: ${imcClas(v)}`:''},
  ganancia:c=>{const a=num(c.d.peso),b=num(c.d.peso_pre);return a&&b?`${r1(a-b)} kilogramos`:''},
  afu:c=>{const a=num(c.d.afu),s=sdgDe(c.d.fum);return a&&s?`${a} centímetros con ${s.w} semanas de gestación`:''},
  polif:c=>{const n=(c.d.meds||[]).filter(r=>r&&r.n).length;return n>=5?`${n} medicamentos: polifarmacia`:n?`${n} medicamentos`:''},
  edadCorr:c=>{const s=num(c.d.nac_sdg),b=pDate((c.p.hc||{}).fnac);if(!s||s>=37||!b)return'';const x=new Date(b);x.setDate(x.getDate()+Math.round((40-s)*7));return edadTxt(edadDe(fISO(x)))||'Aún no cumple las 40 semanas corregidas'},
  medico:c=>c.medico||''
};

/* signos vitales, compartidos por historia clínica y nota */
const SV=(o={})=>[hd('Signos vitales'),
  nm('ta_s','Presión arterial sistólica (milímetros de mercurio)',{req:1,sv:1}),nm('ta_d','Presión arterial diastólica (milímetros de mercurio)',{req:1,sv:1}),
  ...(o.brazo?[se('ta_brazo','Brazo',['Derecho','Izquierdo'],{sv:1}),se('ta_pos','Posición',['Sentado','Acostado','De pie'],{sv:1})]:[]),
  au('pam','Presión arterial media',A.pam,{sv:1}),
  nm('fc','Frecuencia cardiaca (latidos por minuto)',{req:1,sv:1}),nm('fr','Frecuencia respiratoria (respiraciones por minuto)',{req:1,sv:1}),
  nm('temp','Temperatura (grados Celsius)',{req:1,sv:1}),nm('sat','Saturación de oxígeno (porcentaje)',{sv:1}),nm('gluc','Glucosa capilar (miligramos por decilitro, opcional)',{sv:1}),
  nt('Las alertas automáticas de signos vitales se activarán cuando definamos los valores con su referencia bibliográfica.')];
const SOMA=(o={})=>[hd('Somatometría'),nm('peso','Peso (kilogramos)',{req:o.req}),nm('talla','Talla (centímetros)',{req:o.req}),au('imc','Índice de masa corporal',A.imc),
  ...(o.cintura?[nm('cintura','Circunferencia de cintura (centímetros)',{v:'hmeg'})]:[]),
  nm('pc','Perímetro cefálico (centímetros)',{v:'p'}),nm('pb','Perímetro braquial (centímetros, opcional)',{v:'p'}),
  nt('Percentiles y puntuación Z con las tablas de crecimiento de la Organización Mundial de la Salud: información pendiente.',{v:'p'})];

/* historia clínica */
const HC=[
 {id:'consulta',t:'Datos de la consulta',s:'La fecha, la hora y el médico se registran solos, como pide la norma en todas las notas.',f:[
  au('hc_fecha','Fecha de elaboración',c=>c.fechaDoc||''),au('hc_medico','Médico que elabora',A.medico),
  se('interrog','Tipo de interrogatorio',['Directo','Indirecto','Mixto'],{req:1}),
  ln('informante','Informante y parentesco',{if:c=>c.d.interrog&&c.d.interrog!=='Directo',full:1}),
  tx('motivo','Motivo de consulta, en palabras del paciente',{req:1})]},
 {id:'ficha',t:'Ficha de identificación',s:'Se llena una sola vez y aparece en el encabezado de todas las notas del paciente.',f:[
  ln('nombre','Nombre completo',{req:1,full:1}),dt('fnac','Fecha de nacimiento',{req:1}),au('edad','Edad',A.edad),
  se('sexo','Sexo',['Hombre','Mujer'],{req:1,v:'pg'}),
  ln('curp','Clave Única de Registro de Población (opcional)'),
  se('civil','Estado civil',['Soltero','Casado','Unión libre','Divorciado','Viudo'],{v:'hmeg'}),
  se('escol','Escolaridad',ESC,{v:'hmeg'}),ln('ocup','Ocupación',{v:'hmeg'}),
  ln('relig','Religión (opcional)'),ln('etnia','Grupo étnico y lengua indígena que habla (opcional)'),
  ln('origen','Lugar de origen'),ln('resid','Lugar de residencia'),ln('domic','Domicilio',{full:1}),ln('tel','Teléfono',{tel:1}),
  se('servicio','Servicio de salud con el que cuenta',['Instituto Mexicano del Seguro Social','Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado','IMSS-Bienestar','Privado','Ninguno']),
  ln('emerg','Contacto de emergencia: nombre, parentesco y teléfono',{full:1}),
  hd('Ficha del tutor',{v:'p'}),ln('tut_nom','Nombre del tutor',{v:'p'}),ln('tut_par','Parentesco',{v:'p'}),nm('tut_edad','Edad del tutor (años)',{v:'p'}),
  se('tut_esc','Escolaridad del tutor',ESC,{v:'p'}),ln('tut_ocup','Ocupación del tutor',{v:'p'}),ln('tut_tel','Teléfono del tutor',{v:'p',tel:1}),
  se('cuida','Quién lo cuida la mayor parte del día',['Madre','Padre','Abuelos','Otro familiar','Guardería'],{v:'p'}),ln('escuela','Guardería o escuela y grado escolar',{v:'p'}),
  hd('Cuidador y entorno',{v:'g'}),ln('cuid','Cuidador principal: nombre, parentesco y teléfono',{v:'g',full:1}),
  se('vive_con','Con quién vive',['Solo','Con pareja','Con hijos','Con otros familiares','En institución'],{v:'g'}),nm('escol_anios','Escolaridad en años',{v:'g'}),
  bo('voluntad','Tiene voluntad anticipada registrada',{v:'g'}),ln('voluntad_t','Detalle de la voluntad anticipada',{v:'g',if:c=>c.d.voluntad}),
  bo('aviso','El paciente aceptó el aviso de privacidad',{req:1,full:1})]},
 {id:'hf',t:'Antecedentes heredofamiliares',s:'Toca la casilla del familiar que tiene cada enfermedad, o marca todo como negado.',reqAny:1,f:[
  gr('hf','Enfermedades en la familia'),ln('hf_cancer','Tipo de cáncer en la familia',{if:c=>c.d.hf&&c.d.hf.m&&(c.d.hf.m[5]||[]).length}),ln('hf_otra','Otra enfermedad en la familia'),
  se('padre_vive','Padre',['Vive','Finado']),ln('padre_causa','Causa de muerte del padre',{if:c=>c.d.padre_vive==='Finado'}),
  se('madre_vive','Madre',['Vive','Finada']),ln('madre_causa','Causa de muerte de la madre',{if:c=>c.d.madre_vive==='Finada'}),
  ln('padres_salud','Edad y estado de salud de padre y madre',{v:'p',full:1}),bo('consang','Consanguinidad entre los padres',{v:'p'}),
  ln('geneticas','Enfermedades genéticas o malformaciones en la familia',{v:'p',full:1}),ln('hermanos','Número de hermanos y su estado de salud',{v:'p',full:1})]},
 {id:'pnp',t:'Antecedentes personales no patológicos',s:'Incluye el consumo de tabaco, alcohol y otras sustancias, que la norma pide de forma expresa.',reqAny:1,f:[
  hd('Vivienda y entorno'),se('viv','Tipo de vivienda',['Urbana','Rural']),ln('viv_mat','Material de la vivienda'),
  ck('serv','Servicios',['Agua potable','Drenaje','Electricidad','Gas']),nm('habit','Personas que viven en la casa'),
  ck('anim','Convivencia con animales',['Perros','Gatos','Aves','Ganado','Otros']),
  bo('lena','Exposición a humo de leña'),nm('lena_h','Horas al día de exposición',{if:c=>c.d.lena}),nm('lena_a','Años de exposición',{if:c=>c.d.lena}),au('iehl','Índice de exposición a humo de leña',A.iehl,{if:c=>c.d.lena}),
  bo('humo_casa','Exposición a humo de tabaco en casa',{v:'p'}),
  ck('lab_exp','Exposiciones laborales',['Polvos','Solventes','Pesticidas','Ruido'],{v:'hmeg'}),ln('lab_exp_t','Detalle de exposiciones laborales',{v:'hmeg',if:c=>(c.d.lab_exp||[]).length}),
  hd('Hábitos'),nm('comidas','Comidas al día'),tx('alim','Descripción de la alimentación'),
  se('act','Actividad física',['Sedentario','Ocasional','Regular']),nm('act_min','Minutos de actividad física por semana'),
  nm('sueno','Horas de sueño por noche'),se('sueno_c','Calidad del sueño',['Buena','Regular','Mala']),nm('pantallas','Horas de pantallas al día',{v:'p'}),
  se('hig','Higiene personal y dental',['Buena','Regular','Mala']),ln('viajes','Viajes recientes fuera de su localidad'),
  ck('vac','Inmunizaciones',['Esquema de la infancia completo','Influenza del año','COVID-19','Tétanos y difteria','Hepatitis B','Neumococo','Virus del papiloma humano'],{v:'hmeg'}),
  ln('vac_t','Año de la última dosis de cada vacuna',{v:'hmeg',full:1}),
  hd('Consumo de sustancias'),se('tab','Tabaco',['Nunca','Actual','Exfumador']),
  nm('tab_cig','Cigarros al día',{if:c=>c.d.tab&&c.d.tab!=='Nunca'}),nm('tab_anios','Años fumando',{if:c=>c.d.tab&&c.d.tab!=='Nunca'}),
  au('it','Índice tabáquico',A.it,{if:c=>c.d.tab&&c.d.tab!=='Nunca'}),nm('tab_deja','Año en que dejó de fumar',{if:c=>c.d.tab==='Exfumador'}),
  se('alc','Alcohol',['Nunca','Ocasional','Frecuente','Exbebedor']),ln('alc_t','Tipo de bebida, frecuencia y cantidad por ocasión',{if:c=>c.d.alc&&c.d.alc!=='Nunca',full:1}),
  ck('drog','Otras sustancias',['Negadas','Marihuana','Cocaína','Metanfetaminas','Inhalables','Otras'],{ex:'Negadas'}),
  ln('drog_t','Vía, frecuencia y último consumo',{if:c=>(c.d.drog||[]).some(x=>x!=='Negadas'),full:1}),
  hd('Alimentación detallada (frecuencia por semana)',{v:'hmeg'}),
  ...['Frutas y verduras','Cereales','Leguminosas','Carnes y lácteos','Embutidos','Comida rápida','Pan dulce','Bebidas azucaradas'].map((g,i)=>se('fq'+i,g,FREQ,{v:'hmeg'})),
  nm('agua','Agua natural al día (litros)',{v:'hmeg'}),nm('cafe','Tazas de café al día',{v:'hmeg'}),nm('refresco','Refrescos al día',{v:'hmeg'}),
  bo('sal','Agrega sal a la comida ya servida',{v:'hmeg'}),se('dieta','Dieta especial',['Ninguna','Vegetariana','Para diabetes','Baja en sal','Otra'],{v:'hmeg'}),
  hd('Trabajo y entorno social',{v:'hmeg'}),ln('horario','Horario laboral, turnos nocturnos y horas por semana',{v:'hmeg',full:1}),
  ck('riesgos','Riesgos del puesto',['Carga de peso','Postura prolongada','Pantallas','Exposición a químicos'],{v:'hmeg'}),
  nm('dependientes','Personas que dependen económicamente del paciente',{v:'hmeg'}),se('red','Red de apoyo',['Vive solo','Con pareja','Con familia','En institución'],{v:'hmeg'}),
  hd('Salud mental',{v:'hmeg'}),
  ck('phq2','Detección de depresión en las últimas dos semanas',['Poco interés o placer en hacer las cosas','Se ha sentido decaído, deprimido o sin esperanza'],{v:'hmeg'}),
  nt('Alguna pregunta es positiva: aplica el cuestionario de 9 preguntas para depresión y anota el puntaje en Escalas y cálculos.',{v:'hmeg',if:c=>(c.d.phq2||[]).length}),
  se('ansiedad','Ansiedad y estrés',['Sin datos','Leve','Moderado','Importante'],{v:'hmeg'}),
  bo('psiq','Antecedente de atención psicológica o psiquiátrica',{v:'hmeg'}),ln('psiq_t','Detalle de la atención',{v:'hmeg',if:c=>c.d.psiq}),
  bo('violencia','Detección de violencia familiar o de pareja positiva (preguntar en privado)',{v:'hmeg',red:1}),
  nt('Ruta de atención: se cargará con la Norma Oficial Mexicana NOM-046-SSA2-2005, Violencia familiar, sexual y contra las mujeres.',{v:'hmeg',if:c=>c.d.violencia,red:1})]},
 {id:'peri',t:'Antecedentes perinatales',v:'p',f:[
  nm('gesta_n','Número de gesta'),nm('cpn','Consultas de control prenatal'),tx('emb_comp','Complicaciones del embarazo, suplementos y exposiciones'),
  se('nac_via','Vía de nacimiento',['Parto','Cesárea']),nm('nac_sdg','Semanas de gestación al nacer'),au('edad_corr','Edad corregida',A.edadCorr,{if:c=>num(c.d.nac_sdg)&&num(c.d.nac_sdg)<37}),
  nm('nac_peso','Peso al nacer (gramos)'),nm('nac_talla','Talla al nacer (centímetros)'),nm('nac_pc','Perímetro cefálico al nacer (centímetros)'),
  nm('apgar1','Apgar al minuto'),nm('apgar5','Apgar a los cinco minutos'),
  ck('neo','Periodo neonatal',['Reanimación','Estancia en cuneros','Terapia intensiva neonatal','Ictericia']),ln('neo_t','Detalle del periodo neonatal',{full:1}),
  ck('tamiz','Tamiz neonatal realizado',['Metabólico','Auditivo','Cardiaco']),ln('tamiz_t','Resultado de los tamices',{full:1})]},
 {id:'alim_p',t:'Alimentación',v:'p',f:[
  bo('lme','Lactancia materna exclusiva'),nm('lme_m','Duración de la lactancia materna exclusiva (meses)',{if:c=>c.d.lme}),ln('formula_t','Fórmula: tipo y cantidad'),
  nm('ablact','Inicio de la alimentación complementaria (meses de edad)'),ln('ablact_t','Alimentos introducidos',{full:1}),
  tx('alim_act','Alimentación actual por grupos'),se('apetito','Apetito',['Bueno','Regular','Malo']),ck('supl_p','Suplementos',['Vitaminas','Hierro'])]},
 {id:'des',t:'Desarrollo psicomotor e inmunizaciones',v:'p',f:[
  tx('dm_mg','Motor grueso: hitos logrados y edad en que los logró'),tx('dm_mf','Motor fino: hitos logrados y edad'),tx('dm_len','Lenguaje: hitos logrados y edad'),tx('dm_soc','Social: hitos logrados y edad'),
  se('edi','Prueba de Evaluación del Desarrollo Infantil (menores de 5 años)',['No aplicada','Desarrollo normal','Rezago en el desarrollo','Riesgo de retraso']),
  se('escolar','Rendimiento escolar',['Bueno','Regular','Bajo','No aplica']),ln('conducta','Conducta',{full:1}),
  tx('vac_p','Vacunas aplicadas con fecha, según la Cartilla Nacional de Salud'),
  nt('El esquema por edad, con cada dosis marcada como aplicada o pendiente, se cargará de la Cartilla Nacional de Salud vigente.'),
  hd('Adolescentes'),bo('adol_solo','Parte de la entrevista fue a solas, con aviso de confidencialidad'),
  tx('adol_psico','Entrevista psicosocial: hogar, escuela, actividades, drogas, sexualidad, estado de ánimo y seguridad'),
  ln('tanner','Desarrollo puberal (escala de Tanner)'),nm('menarca_p','Menarca, edad',{if:mujer}),ln('ritmo_p','Ritmo menstrual',{if:mujer})]},
 {id:'pp',t:'Antecedentes personales patológicos',s:'Las alergias y los medicamentos actuales alimentan el resumen fijo del expediente y las alertas al recetar.',reqAny:1,f:[
  ck('cron','Enfermedades crónicas',CRON),tx('cron_t','Año de diagnóstico, tratamiento actual y control de cada una',{if:c=>(c.d.cron||[]).length}),
  hd('Diabetes mellitus',{if:c=>has(c.d.cron,'Diabetes mellitus')}),
  se('dm_tipo','Tipo de diabetes',['Tipo 1','Tipo 2','Otra'],{if:c=>has(c.d.cron,'Diabetes mellitus')}),bo('dm_ins','Usa insulina',{if:c=>has(c.d.cron,'Diabetes mellitus')}),
  nm('hba1c','Última hemoglobina glucosilada (porcentaje)',{if:c=>has(c.d.cron,'Diabetes mellitus')}),dt('hba1c_f','Fecha de la hemoglobina glucosilada',{if:c=>has(c.d.cron,'Diabetes mellitus')}),
  bo('dm_hipo','Hipoglucemias recientes',{if:c=>has(c.d.cron,'Diabetes mellitus')}),ck('dm_comp','Complicaciones de la diabetes',['Retinopatía','Nefropatía','Neuropatía','Pie diabético'],{if:c=>has(c.d.cron,'Diabetes mellitus')}),
  hd('Hipertensión arterial',{if:c=>has(c.d.cron,'Hipertensión arterial')}),ln('hta_casa','Cifras habituales en casa',{if:c=>has(c.d.cron,'Hipertensión arterial')}),
  ck('hta_dob','Daño a órgano blanco',['Corazón','Riñón','Retina','Cerebro'],{if:c=>has(c.d.cron,'Hipertensión arterial')}),
  hd('Asma o enfermedad pulmonar obstructiva crónica',{if:c=>has(c.d.cron,'Asma')||has(c.d.cron,'Enfermedad pulmonar obstructiva crónica')}),
  nm('crisis','Crisis en el último año',{if:c=>has(c.d.cron,'Asma')||has(c.d.cron,'Enfermedad pulmonar obstructiva crónica')}),nm('crisis_h','Hospitalizaciones por crisis',{if:c=>has(c.d.cron,'Asma')||has(c.d.cron,'Enfermedad pulmonar obstructiva crónica')}),
  ln('inhal','Inhaladores y técnica de uso',{if:c=>has(c.d.cron,'Asma')||has(c.d.cron,'Enfermedad pulmonar obstructiva crónica'),full:1}),
  hd('Enfermedad renal crónica',{if:c=>has(c.d.cron,'Enfermedad renal crónica')}),nm('cr_ult','Última creatinina (miligramos por decilitro)',{if:c=>has(c.d.cron,'Enfermedad renal crónica')}),
  dt('cr_f','Fecha de la creatinina',{if:c=>has(c.d.cron,'Enfermedad renal crónica')}),au('erc_tfg','Filtración glomerular estimada y estadio',A.tfgErc,{if:c=>has(c.d.cron,'Enfermedad renal crónica')}),
  hd('Enfermedad tiroidea',{if:c=>has(c.d.cron,'Enfermedad tiroidea')}),se('tir_tipo','Tipo',['Hipotiroidismo','Hipertiroidismo','Nódulo','Otra'],{if:c=>has(c.d.cron,'Enfermedad tiroidea')}),
  ln('tir_perfil','Último perfil tiroideo: fecha y resultado',{if:c=>has(c.d.cron,'Enfermedad tiroidea')}),
  ln('ca_t','Cáncer: tipo, año, tratamiento recibido y estado actual',{if:c=>has(c.d.cron,'Cáncer'),full:1}),
  hd('Otros antecedentes'),
  tx('quir','Quirúrgicos: procedimiento, año y complicaciones (uno por renglón)'),tx('trauma','Traumáticos: fracturas, esguinces o traumatismo craneoencefálico, con año y secuelas'),
  bo('transf','Transfusiones previas'),ln('transf_t','Fecha, motivo y reacciones de la transfusión',{if:c=>c.d.transf,full:1}),
  ck('alerg','Alergias',['Negadas','Medicamentos','Alimentos','Látex','Picaduras','Otros'],{ex:'Negadas',red:1,req:1}),
  ln('alerg_t','Sustancia y tipo de reacción',{if:c=>(c.d.alerg||[]).some(x=>x!=='Negadas'),full:1,req:1}),
  tx('hosp','Hospitalizaciones previas: motivo, año y duración'),ck('infec','Infecciosas relevantes',['Varicela','Hepatitis','COVID-19','Otras de la infancia']),
  ln('enf_inf','Enfermedades de la infancia',{v:'p',full:1}),ck('inf_rep','Infecciones de repetición',['Respiratorias','Diarreicas'],{v:'p'}),ln('hosp_neo','Hospitalizaciones en la etapa neonatal',{v:'p',full:1}),
  hd('Medicamentos actuales'),rw('meds','Medicamentos actuales',MEDC),au('polif','Número de medicamentos',A.polif,{v:'g'}),
  ln('otc','Medicamentos de venta libre, herbolaria y suplementos',{full:1}),
  se('apego','Apego al tratamiento',['Bueno','Irregular','Lo abandonó']),ln('apego_t','Por qué',{if:c=>c.d.apego&&c.d.apego!=='Bueno'}),dt('ult_rev','Última revisión médica general'),
  bo('conciliacion','Conciliación hecha con todos los medicamentos que trae el paciente o su cuidador',{v:'g'}),
  tx('beers','Medicamentos potencialmente inapropiados (criterios de Beers y STOPP/START)',{v:'g'}),
  nt('La revisión automática con los criterios de Beers y STOPP/START llegará con el módulo de Medicamentos.',{v:'g'})]},
 {id:'gin',t:'Antecedentes ginecoobstétricos',if:c=>mujer(c)&&c.tipo!=='p',reqAny:1,f:[
  nm('menarca','Menarca, edad'),nm('ciclo','Ritmo menstrual: cada cuántos días'),nm('ciclo_dur','Duración del sangrado (días)'),se('ciclo_cant','Cantidad',['Escasa','Normal','Abundante']),bo('dismen','Dismenorrea'),
  dt('fum','Fecha de última menstruación',{v:'mg'}),
  nt('Han pasado más días que su ritmo menstrual desde la última menstruación. Si hay retraso, cambia el expediente a la versión de embarazada desde el expediente, en Más opciones.',{v:'m',if:c=>{const d=diasDesde(c.d.fum);return d!==null&&d>(num(c.d.ciclo)||28)}}),
  nm('ivsa','Inicio de vida sexual, edad'),nm('parejas','Número de parejas sexuales'),
  se('pf','Método de planificación familiar',['Ninguno','Preservativo','Hormonal oral','Inyectable','Implante','Dispositivo intrauterino','Oclusión tubaria bilateral','Otro']),dt('pf_f','Usa el método desde'),
  nm('g','Gestas'),nm('pa','Partos'),nm('ce','Cesáreas'),nm('ab','Abortos'),nm('ec','Embarazos ectópicos'),au('formula','Fórmula obstétrica',A.formula),dt('ult_evento','Fecha del último evento obstétrico'),
  ln('cito','Última citología cervical: fecha y resultado',{full:1}),ln('masto','Última mastografía: fecha y resultado',{full:1}),
  nm('menop','Menopausia, edad',{v:'mg'}),ln('trh','Terapia hormonal',{v:'mg'}),ln('its','Infecciones de transmisión sexual previas',{full:1})]},
 {id:'andro',t:'Antecedentes andrológicos',if:c=>hombre(c)&&c.tipo!=='p',f:[
  nm('ivsa','Inicio de vida sexual, edad'),nm('parejas','Número de parejas sexuales'),se('pf_h','Método de planificación familiar',['Ninguno','Preservativo','Vasectomía','Otro']),
  ck('sub','Síntomas urinarios bajos',['Chorro débil','Goteo','Nicturia','Urgencia']),bo('de','Disfunción eréctil'),
  ln('ape','Último antígeno prostático específico: fecha y resultado',{full:1}),ln('its_h','Infecciones de transmisión sexual previas',{full:1})]},
 {id:'emb',t:'Embarazo actual',v:'e',s:'Las semanas de gestación y la fecha probable de parto se calculan solas.',f:[
  dt('fum','Fecha de última menstruación',{req:1}),bo('fum_conf','La fecha de última menstruación es confiable'),
  au('sdg','Semanas de gestación por fecha de última menstruación',A.sdg),au('fpp','Fecha probable de parto (regla de Naegele)',A.fpp),au('trim','Trimestre',A.trim),
  nm('us_sdg','Semanas por ultrasonido del primer trimestre'),nm('us_dias','Días adicionales del ultrasonido'),dt('us_f','Fecha del ultrasonido'),au('sdg_us','Semanas de gestación hoy por ultrasonido',A.sdgUs),
  nt('Cuál cálculo usar cuando no coinciden se definirá con la Guía de Práctica Clínica de control prenatal.'),
  ck('emb_plan','Embarazo',['Planeado','Deseado']),se('emb_mult','Número de fetos',['Único','Múltiple']),nm('cpn_n','Consultas prenatales previas'),ln('cpn_lugar','Dónde lleva su control'),
  hd('Antecedentes obstétricos detallados'),tx('obst_prev','Por cada embarazo previo: año, resolución, semanas al nacer, peso del recién nacido y complicaciones'),
  ck('obst_comp','Complicaciones en embarazos previos',['Preeclampsia','Diabetes gestacional','Hemorragia','Parto pretérmino','Restricción del crecimiento','Pérdida gestacional']),
  au('inter','Periodo intergenésico',A.inter),
  ck('fr_obst','Factores de riesgo obstétrico',['Edad materna','Enfermedades crónicas','Cesárea previa','Complicaciones en embarazos anteriores','Embarazo múltiple','Obesidad','Consumo de sustancias'],{red:1}),
  nt('La clasificación automática de riesgo bajo o alto se cargará con la Guía de Práctica Clínica de control prenatal.'),
  hd('Síntomas y signos de alarma'),ck('sint_hab','Síntomas habituales',['Náusea','Vómito','Pirosis','Estreñimiento','Lumbalgia']),ck('alarma_obst','Signos de alarma',ALARMA_OBST,{red:1}),
  hd('Hábitos del embarazo'),ck('supl','Suplementos',['Ácido fólico','Hierro','Calcio','Multivitamínico']),ln('supl_f','Fecha de inicio de los suplementos'),
  ck('vac_emb','Vacunas en el embarazo',['Influenza','Tétanos y difteria con tos ferina acelular','COVID-19']),nm('edimburgo','Escala de depresión posnatal de Edimburgo: puntaje')]},
 {id:'pa',t:'Padecimiento actual',s:'Es la parte narrativa: aprovecha las frases rápidas y el dictado del teclado.',f:[
  dt('pa_inicio','Fecha de inicio'),au('pa_evol','Tiempo de evolución',A.evol),se('pa_forma','Forma de inicio',['Súbito','Insidioso']),se('pa_curso','Curso',['Agudo','Crónico','Intermitente','Progresivo']),
  tx('pa_desc','Descripción cronológica del padecimiento',{req:1,fr:FR.pa}),tx('pa_trat','Tratamientos recibidos para este padecimiento y respuesta'),
  ck('pa_acomp','Síntomas acompañantes',['Fiebre','Náusea','Vómito','Pérdida de peso','Otros']),
  ck('aiepi','Datos de alarma',AIEPI,{v:'p',red:1}),
  bo('dolor','El motivo de consulta es dolor'),
  ln('dol_ini','Inicio y circunstancia en que apareció el dolor',{if:c=>c.d.dolor,full:1}),ln('dol_loc','Localización',{if:c=>c.d.dolor}),sl('dol_eva','Intensidad en escala visual análoga (0 a 10)',{if:c=>c.d.dolor}),
  se('dol_car','Carácter',['Opresivo','Punzante','Urente','Cólico','Sordo','Otro'],{if:c=>c.d.dolor}),ln('dol_irr','Irradiación',{if:c=>c.d.dolor}),
  ln('dol_fac','Factores que lo agravan y que lo alivian',{if:c=>c.d.dolor,full:1}),ln('dol_dur','Duración, frecuencia y horario',{if:c=>c.d.dolor,full:1}),
  se('sint_pr','Preguntas dirigidas según el síntoma principal',['Ninguno','Fiebre','Tos','Diarrea','Cefalea','Dolor torácico','Disuria','Mareo','Lesión de piel']),
  tx('sint_pr_t','Respuestas a las preguntas dirigidas',{if:c=>c.d.sint_pr&&c.d.sint_pr!=='Ninguno',ph:c=>({'Fiebre':'Temperatura máxima, patrón, escalofríos y respuesta a antipirético','Tos':'Tiempo de evolución, seca o productiva, color de la expectoración, predominio de horario, sangre','Diarrea':'Evacuaciones al día, consistencia, moco o sangre, fiebre, datos de deshidratación','Cefalea':'Localización, carácter, aura','Dolor torácico':'Relación con el esfuerzo, irradiación, diaforesis, disnea y factores de riesgo cardiovascular','Disuria':'Frecuencia, urgencia, hematuria, fiebre, dolor lumbar y flujo','Mareo':'Si es vértigo, inestabilidad o presíncope; síntomas acompañantes','Lesión de piel':'Tiempo, cambios, prurito, dolor y exposiciones'})[c.d.sint_pr]||''}),
  ck('cef_alarma','Datos de alarma de la cefalea',['Inicio súbito','El peor dolor de su vida','Fiebre con rigidez de nuca','Déficit neurológico','Inicio después de los 50 años'],{red:1,if:c=>c.d.sint_pr==='Cefalea'})]},
 {id:'ros',t:'Interrogatorio por aparatos y sistemas',s:'Toca Negado o los síntomas presentes. Cada sistema debe quedar contestado.',neg:'Todo negado',f:ROS.map(([id,l,op])=>Object.assign(sy(id,l,op),{req:1}))},
 {id:'ef',t:'Exploración física',s:'Cada región tiene un botón Normal con el texto predeterminado, que puedes editar.',neg:'Todo normal',f:[
  ...SV({brazo:1}),
  nm('orto_s1','Sistólica acostado',{v:'g'}),nm('orto_d1','Diastólica acostado',{v:'g'}),nm('orto_s2','Sistólica de pie',{v:'g'}),nm('orto_d2','Diastólica de pie',{v:'g'}),au('orto','Presión arterial acostado y de pie',A.orto,{v:'g'}),
  ...SOMA({req:1,cintura:1}),
  hd('Somatometría del embarazo',{v:'e'}),nm('peso_pre','Peso antes del embarazo (kilogramos)',{v:'e'}),au('imc_pre','Índice de masa corporal pregestacional',A.imcPre,{v:'e'}),au('ganancia','Ganancia de peso actual',A.ganancia,{v:'e'}),
  nt('La ganancia recomendada según el índice de masa corporal pregestacional se cargará con su referencia bibliográfica.',{v:'e'}),
  hd('Aspecto general'),rg('x_asp','Aspecto general',ASP,'Estado de conciencia, orientación, actitud, facies, constitución, marcha, hidratación, coloración de piel y mucosas.',{req:1}),
  hd('Exploración por regiones'),...REG.map(([id,l,def,det,req])=>rg(id,l,def,det,{req})),
  hd('Exploración obstétrica',{v:'e'}),nm('afu','Altura del fondo uterino (centímetros)',{v:'e'}),au('afu_cmp','Comparación con las semanas de gestación',A.afu,{v:'e'}),
  se('leo_sit','Situación',['Longitudinal','Transversa','Oblicua'],{v:'e'}),se('leo_pres','Presentación',['Cefálica','Pélvica','De hombro'],{v:'e'}),
  se('leo_pos','Posición del dorso',['Izquierda','Derecha'],{v:'e'}),se('leo_enc','Encajamiento',['Libre','Abocado','Encajado'],{v:'e'}),
  nm('fcf','Frecuencia cardiaca fetal (latidos por minuto)',{v:'e'}),se('mov_fet','Movimientos fetales',['Presentes','Disminuidos','Ausentes','Aún no perceptibles'],{v:'e'}),
  se('edema_e','Edema',['Sin edema','+','++','+++','++++'],{v:'e'}),se('rot','Reflejos osteotendinosos',['Normales','Disminuidos','Aumentados'],{v:'e'}),
  tx('especulo','Especuloscopia y tacto vaginal (opcional, si está indicado y con consentimiento): sangrado, líquido, modificaciones cervicales y membranas',{v:'e'}),
  hd('Exploración propia de la edad',{v:'p'}),
  tx('expl_rn','Recién nacido y lactante: fontanelas, reflejos primitivos, maniobras de Ortolani y Barlow, ombligo y genitales con descenso testicular',{v:'p'}),
  tx('expl_esc','Preescolar y escolar: agudeza visual, audición y salud bucal',{v:'p'}),
  tx('expl_adol','Escolar y adolescente: columna con maniobra de Adams y desarrollo puberal en escala de Tanner',{v:'p'}),
  hd('Exploración geriátrica',{v:'g'}),nm('tinetti','Escala de Tinetti de marcha y equilibrio: puntaje',{v:'g'}),ln('upp','Úlceras por presión: localización y grado',{v:'g',full:1}),
  ck('boca_g','Boca y deglución',['Usa prótesis dental','Prótesis mal ajustada','Dificultad para deglutir'],{v:'g'}),ln('pies_g','Pies: uñas, deformidades y lesiones',{v:'g',full:1})]},
 {id:'vgi',t:'Valoración geriátrica integral',v:'g',s:'Captura el puntaje de cada escala. La escala para aplicarla paso a paso llega con el módulo de Herramientas.',f:[
  hd('Funcionalidad'),nm('barthel','Índice de Barthel: puntaje'),nm('katz','Índice de Katz: puntaje'),nm('lawton','Escala de Lawton y Brody: puntaje'),
  nm('tug','Levántate y anda cronometrada (segundos)'),nm('vel_marcha','Velocidad de la marcha (metros por segundo)'),
  hd('Caídas'),nm('caidas','Caídas en el último año'),ck('caidas_c','Consecuencias',['Fractura','Otra lesión','Hospitalización','Miedo a caer']),
  ck('caidas_casa','Factores de riesgo en casa',['Tapetes','Escaleras','Poca luz','Baño sin barras']),
  hd('Esfera cognitiva'),nm('minicog','Mini-Cog: puntaje'),nm('mmse','Mini examen del estado mental de Folstein: puntaje',{if:c=>c.d.minicog!==undefined&&c.d.minicog!==''}),
  ln('reloj','Prueba del reloj: resultado'),se('cam','Método de Evaluación de la Confusión',['Negativo','Positivo para delirium']),
  hd('Esfera afectiva'),nm('yesavage','Escala de depresión geriátrica de Yesavage de 15 preguntas: puntaje'),
  hd('Esfera nutricional'),nm('mna','Mini evaluación nutricional: puntaje'),ln('perd_peso','Pérdida de peso involuntaria'),nm('pantorrilla','Circunferencia de pantorrilla (centímetros)'),
  hd('Esfera social'),se('red_g','Red de apoyo',['Buena','Limitada','Nula']),se('econ','Situación económica',['Suficiente','Limitada','Insuficiente']),
  bo('maltrato','Detección de maltrato positiva (preguntar en privado)',{red:1}),nm('zarit','Escala de Zarit de sobrecarga del cuidador: puntaje'),
  hd('Esfera sensorial'),ck('sens','Visión, audición y boca',['Usa lentes','Prueba del susurro alterada','Usa auxiliar auditivo','Usa prótesis dental']),
  hd('Síndromes geriátricos'),nm('frail','Escala FRAIL de fragilidad: puntaje'),nm('sarcf','Cuestionario SARC-F de sarcopenia: puntaje'),
  ck('sindromes','Presentes',['Incontinencia urinaria','Incontinencia fecal','Estreñimiento','Insomnio','Dolor crónico']),nm('braden','Escala de Braden de riesgo de úlceras por presión: puntaje')]},
 {id:'tz',t:'Prevención y tamizajes',s:'Las edades e intervalos de cada detección se cargarán de la Norma Oficial Mexicana o la Guía de Práctica Clínica vigente, con su referencia. Por ahora registra la fecha y el resultado.',f:[
  ...[['tz_ta','Presión arterial'],['tz_glu','Glucosa en ayuno o hemoglobina glucosilada'],['tz_lip','Perfil de lípidos'],['tz_obe','Sobrepeso y obesidad'],['tz_rcv','Riesgo cardiovascular a 10 años'],
    ['tz_ren','Función renal (con diabetes o hipertensión)'],['tz_mama','Mama: exploración clínica y mastografía',mujer],['tz_cacu','Cervicouterino: citología cervical o prueba de virus del papiloma humano',mujer],
    ['tz_pros','Próstata: antígeno prostático específico, con decisión compartida',hombre],['tz_col','Colorrectal: sangre oculta en heces o colonoscopia'],['tz_osteo','Osteoporosis',c=>mujer(c)||c.tipo==='g'],
    ['tz_dep','Depresión y consumo de riesgo de alcohol y tabaco'],['tz_its','Pruebas rápidas de virus de la inmunodeficiencia humana, sífilis y hepatitis C'],['tz_vis','Agudeza visual, audición y salud bucal'],['tz_vac','Esquema de vacunación del adulto (Cartilla Nacional de Salud)']]
    .map(([id,l,cond])=>tm(id,l,{v:'hmg',if:cond})),
  ...[['tz_e1','Biometría hemática, grupo sanguíneo y factor Rh'],['tz_e2','Glucosa y curva de tolerancia a la glucosa'],['tz_e3','Examen general de orina y urocultivo'],['tz_e4','Virus de la inmunodeficiencia humana, sífilis y hepatitis B'],
    ['tz_e5','Ultrasonido del primer trimestre'],['tz_e6','Ultrasonido estructural'],['tz_e7','Ultrasonido del tercer trimestre'],['tz_e8','Citología cervical si no está al día']].map(([id,l])=>tm(id,l,{v:'e'})),
  ...[['tz_p1','Tamiz neonatal metabólico, auditivo y cardiaco'],['tz_p2','Displasia del desarrollo de la cadera'],['tz_p3','Desarrollo psicomotor'],['tz_p4','Anemia, sobrepeso y obesidad'],
    ['tz_p5','Agudeza visual, audición y salud bucal'],['tz_p6','Esquema de vacunación completo para la edad']].map(([id,l])=>tm(id,l,{v:'p'})),
  ck('vac_g','Vacunas del adulto mayor',['Influenza','Neumococo','Herpes zóster','COVID-19','Tétanos y difteria'],{v:'g'})]},
 {id:'esc',t:'Escalas y cálculos',s:'Los cálculos toman los datos que ya capturaste. Los cuestionarios completos, con su interpretación, llegan con el módulo de Herramientas.',f:[
  hd('Cálculos automáticos'),au('c_imc','Índice de masa corporal',A.imc),au('c_ict','Índice cintura-talla',A.ict,{v:'hmeg'}),au('c_sc','Superficie corporal',A.sc),
  au('c_pi','Peso ideal',A.pi,{v:'hmeg'}),au('c_paj','Peso ajustado',A.paj,{v:'hmeg'}),au('c_pam','Presión arterial media',A.pam),
  au('c_it','Índice tabáquico',A.it),au('c_iehl','Índice de exposición a humo de leña',A.iehl),au('c_hs','Líquidos de mantenimiento',A.hs,{v:'p'}),
  nm('cr','Creatinina sérica para los cálculos renales (miligramos por decilitro)'),
  au('c_cg','Depuración de creatinina (Cockcroft-Gault)',A.cg,{v:'hmeg'}),au('c_tfg','Filtración glomerular estimada (Colaboración Epidemiológica de la Enfermedad Renal Crónica, 2021)',A.tfg,{v:'hmeg'}),
  hd('Cuestionarios: anota el puntaje'),
  nm('s_fag','Prueba de Fagerström de dependencia a la nicotina',{if:c=>c.d.tab==='Actual'}),nm('s_audit','Prueba de identificación de trastornos por consumo de alcohol, versión de 3 preguntas',{v:'hmeg'}),
  nm('s_phq9','Cuestionario de salud del paciente de 9 preguntas (depresión)',{v:'hmeg'}),nm('s_gad7','Escala de trastorno de ansiedad generalizada de 7 preguntas',{v:'hmeg'}),
  nm('s_find','Escala finlandesa de riesgo de diabetes',{v:'hmeg'}),nm('s_stop','Cuestionario STOP-Bang de apnea obstructiva del sueño',{v:'hmeg'}),
  nm('s_glas','Escala de Glasgow'),ln('s_otra','Otra escala aplicada y su resultado',{full:1}),
  nt('Sugeridas según el diagnóstico: CURB-65 en neumonía, Centor modificada por McIsaac en faringoamigdalitis, Wells en sospecha de trombosis o tromboembolia, reglas de Ottawa en tobillo o rodilla, Alvarado en dolor de fosa ilíaca derecha y Glasgow en alteración del estado de conciencia.')]},
 {id:'plan',t:'Estudios, diagnóstico, pronóstico y plan',s:'Cierra la historia clínica con la misma estructura de la nota de consulta.',f:[
  tx('estudios','Estudios previos y actuales: laboratorio, gabinete y otros, con fecha y resultado'),
  rw('dx','Diagnósticos',DXC,{req:1}),nt('La búsqueda por nombre en la Clasificación Internacional de Enfermedades llegará en una actualización. Por ahora escribe el código si lo tienes.'),
  se('pron_vida','Pronóstico para la vida',['Bueno','Reservado','Malo'],{req:1}),se('pron_fun','Pronóstico para la función',['Bueno','Reservado','Malo'],{req:1}),
  rw('rx','Tratamiento farmacológico',RXC,{alg:1}),tx('medidas','Medidas generales y dieta',{fr:FR.med}),tx('est_sol','Estudios solicitados'),
  bo('referir','Requiere referencia o interconsulta'),tx('alarma','Signos de alarma explicados al paciente',{fr:FR.alarma}),
  dt('prox_f','Próxima cita'),hr('prox_h','Hora de la próxima cita'),
  tx('metas_g','Metas de tratamiento individualizadas según funcionalidad y pronóstico',{v:'g'}),tx('cuidados_g','Plan de cuidados en casa para el cuidador',{v:'g'}),
  ck('ref_g','Referencia a',['Geriatría','Rehabilitación','Cuidados paliativos'],{v:'g'})]},
 {id:'cierre',t:'Cierre y firma',cierre:1,f:[]}
];

/* identificación mínima de la consulta rápida (se guarda en el paciente) */
const IDENT=[{id:'ident',t:'Identificación',s:'Solo lo indispensable. La historia clínica completa la puedes llenar después.',f:[
  ln('nombre','Nombre completo',{req:1,full:1,to:'p'}),dt('fnac','Fecha de nacimiento',{to:'p'}),nm('edad_txt','Edad en años, si no tienes la fecha',{to:'p',if:c=>!(c.p.hc||{}).fnac}),
  au('edad','Edad',A.edad),se('sexo','Sexo',['Hombre','Mujer'],{req:1,to:'p',v:'hmpg'}),ln('tel','Teléfono',{to:'p',tel:1}),
  ln('alerg_rap','Alergias (escribe Negadas si no tiene)',{req:1,to:'p',full:1}),
  bo('aviso','El paciente aceptó el aviso de privacidad',{req:1,to:'p',full:1})]}];

/* nota de consulta en formato subjetivo, objetivo, análisis y plan */
const NOTA=[
 {id:'s',t:'Subjetivo',f:[tx('motivo','Motivo de consulta'),tx('evol','Evolución y actualización del cuadro clínico',{req:1,fr:FR.evol}),
  ck('alarma_obst','Signos de alarma obstétrica',ALARMA_OBST,{v:'e',red:1}),ck('aiepi','Datos de alarma',AIEPI,{v:'p',red:1})]},
 {id:'o',t:'Objetivo',f:[...SV(),...SOMA(),
  hd('Embarazo',{v:'e'}),dt('fum','Fecha de última menstruación',{v:'e'}),au('sdg','Semanas de gestación',A.sdg,{v:'e'}),au('fpp','Fecha probable de parto',A.fpp,{v:'e'}),
  nm('afu','Altura del fondo uterino (centímetros)',{v:'e'}),nm('fcf','Frecuencia cardiaca fetal (latidos por minuto)',{v:'e'}),
  se('mov_fet','Movimientos fetales',['Presentes','Disminuidos','Ausentes','Aún no perceptibles'],{v:'e'}),se('edema_e','Edema',['Sin edema','+','++','+++','++++'],{v:'e'}),
  rg('expl','Exploración física',EXPL_NORMAL,'Describe solo lo alterado y deja lo demás como normal.',{req:1}),
  tx('resultados','Resultados de estudios de laboratorio y gabinete')]},
 {id:'a',t:'Análisis',f:[tx('analisis','Análisis e integración',{fr:FR.anal}),rw('dx','Diagnósticos',DXC,{req:1}),
  se('pron_vida','Pronóstico para la vida',['Bueno','Reservado','Malo'],{req:1}),se('pron_fun','Pronóstico para la función',['Bueno','Reservado','Malo'])]},
 {id:'p',t:'Plan',f:[rw('rx','Receta',RXC,{alg:1}),tx('medidas','Medidas generales y dieta',{fr:FR.med}),tx('est_sol','Estudios solicitados'),
  tx('ind_pac','Indicaciones para el paciente en lenguaje sencillo',{fr:FR.ind}),tx('alarma','Signos de alarma',{fr:FR.alarma}),
  dt('prox_f','Próxima cita'),hr('prox_h','Hora de la próxima cita'),bo('referir','Requiere referencia o interconsulta')]},
 {id:'cierre',t:'Cierre y firma',cierre:1,f:[]}
];

/* hoja de referencia, apartado 6.4 de la norma */
const REF=[
 {id:'env',t:'Envío',f:[se('ref_tipo','Tipo',['Referencia','Interconsulta'],{req:1}),se('ref_urg','Prioridad',['Ordinaria','Urgente']),
  ln('ref_envia','Establecimiento que envía',{req:1,full:1}),ln('ref_recibe','Establecimiento que recibe',{req:1,full:1}),ln('ref_serv','Servicio o especialidad',{full:1})]},
 {id:'res',t:'Resumen clínico',s:'La norma pide motivo de envío, impresión diagnóstica incluyendo el consumo de tabaco, alcohol y otras sustancias, y la terapéutica empleada.',f:[
  bt('Llenar desde el expediente','refgen'),tx('ref_motivo','Motivo de envío',{req:1}),tx('ref_resumen','Resumen clínico',{req:1}),tx('ref_dx','Impresión diagnóstica',{req:1}),
  tx('ref_sust','Consumo de tabaco, alcohol y otras sustancias',{req:1}),tx('ref_trat','Terapéutica empleada',{req:1}),tx('ref_est','Estudios realizados'),
  tx('ref_estado','Estado del paciente al momento del envío')]},
 {id:'contra',t:'Contrarreferencia',s:'Cuando recibas la respuesta, regístrala aquí.',f:[se('cr_estado','Estado',['Pendiente','Recibida']),dt('cr_fecha','Fecha de respuesta'),tx('cr_txt','Respuesta del establecimiento que recibió')]},
 {id:'cierre',t:'Cierre y firma',cierre:1,f:[]}
];

window.CXS={HC,NOTA,IDENT,REF,FAM,HF,FR,A,EXPL_NORMAL,util:{p2,fISO,pDate,fLarga,num,r1,diasDesde,edadDe,edadTxt,edadP,aniosP,sexoP,sdgDe,sdgTxt,fppDe,imcDe}};
})();
