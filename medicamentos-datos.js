/* GCHE2 · Medicamentos: lista aprobada de 118 medicamentos de primer nivel y fichas verificadas.
   Cada ficha cita su fuente oficial y la fecha de revisión. Sin ficha verificada, la app muestra "Ficha en preparación". */
(()=>{
'use strict';
const L=`Analgésicos y antiinflamatorios|Paracetamol|Dolor leve y fiebre
Analgésicos y antiinflamatorios|Ibuprofeno|Dolor, fiebre e inflamación
Analgésicos y antiinflamatorios|Naproxeno|Dolor musculoesquelético y dismenorrea
Analgésicos y antiinflamatorios|Diclofenaco|Dolor e inflamación
Analgésicos y antiinflamatorios|Ketorolaco|Dolor moderado de corta duración
Analgésicos y antiinflamatorios|Metamizol|Dolor y fiebre
Analgésicos y antiinflamatorios|Celecoxib|Dolor articular e inflamación
Analgésicos y antiinflamatorios|Tramadol|Dolor moderado a intenso
Antibióticos|Amoxicilina|Infecciones respiratorias y de oído
Antibióticos|Amoxicilina con ácido clavulánico|Sinusitis, otitis y mordeduras
Antibióticos|Ampicilina|Infecciones respiratorias y urinarias
Antibióticos|Dicloxacilina|Infecciones de piel y tejidos blandos
Antibióticos|Penicilina G benzatínica|Faringoamigdalitis estreptocócica y sífilis
Antibióticos|Cefalexina|Infecciones de piel y urinarias
Antibióticos|Cefuroxima|Infecciones respiratorias
Antibióticos|Ceftriaxona|Infecciones graves e infecciones de transmisión sexual
Antibióticos|Azitromicina|Infecciones respiratorias y de transmisión sexual
Antibióticos|Claritromicina|Infecciones respiratorias y erradicación de Helicobacter pylori
Antibióticos|Trimetoprima con sulfametoxazol|Infecciones urinarias y de piel
Antibióticos|Nitrofurantoína|Cistitis
Antibióticos|Fosfomicina|Cistitis no complicada
Antibióticos|Ciprofloxacino|Infecciones urinarias y gastrointestinales
Antibióticos|Levofloxacino|Infecciones respiratorias en adultos
Antibióticos|Metronidazol|Amibiasis, giardiasis y vaginosis bacteriana
Antibióticos|Clindamicina|Infecciones de piel y dentales
Antibióticos|Doxiciclina|Acné, infecciones de transmisión sexual y rickettsiosis
Antiparasitarios|Albendazol|Helmintiasis
Antiparasitarios|Mebendazol|Helmintiasis
Antiparasitarios|Nitazoxanida|Parasitosis intestinal
Antifúngicos|Fluconazol|Candidiasis
Antifúngicos|Clotrimazol|Micosis de piel y candidiasis vaginal
Antifúngicos|Nistatina|Candidiasis oral
Antifúngicos|Terbinafina|Tiñas y onicomicosis
Antivirales|Aciclovir|Herpes simple y varicela zóster
Antivirales|Oseltamivir|Influenza
Gastrointestinales|Omeprazol|Enfermedad por reflujo y úlcera péptica
Gastrointestinales|Pantoprazol|Enfermedad por reflujo y úlcera péptica
Gastrointestinales|Esomeprazol|Enfermedad por reflujo y úlcera péptica
Gastrointestinales|Famotidina|Dispepsia y reflujo
Gastrointestinales|Hidróxido de aluminio y magnesio|Pirosis y dispepsia
Gastrointestinales|Metoclopramida|Náusea y vómito
Gastrointestinales|Ondansetrón|Náusea y vómito
Gastrointestinales|Butilhioscina|Cólico abdominal
Gastrointestinales|Pinaverio|Colon irritable
Gastrointestinales|Loperamida|Diarrea aguda no infecciosa en adultos
Gastrointestinales|Sales de rehidratación oral|Deshidratación por diarrea
Gastrointestinales|Lactulosa|Estreñimiento
Gastrointestinales|Polietilenglicol|Estreñimiento
Gastrointestinales|Senósidos|Estreñimiento
Respiratorios y antialérgicos|Salbutamol|Broncoespasmo y crisis asmática
Respiratorios y antialérgicos|Bromuro de ipratropio|Enfermedad pulmonar obstructiva crónica y broncoespasmo
Respiratorios y antialérgicos|Beclometasona inhalada|Control del asma
Respiratorios y antialérgicos|Budesonida inhalada|Control del asma y crup
Respiratorios y antialérgicos|Fluticasona nasal|Rinitis alérgica
Respiratorios y antialérgicos|Montelukast|Asma y rinitis alérgica
Respiratorios y antialérgicos|Loratadina|Rinitis alérgica y urticaria
Respiratorios y antialérgicos|Cetirizina|Rinitis alérgica y urticaria
Respiratorios y antialérgicos|Clorfenamina|Reacciones alérgicas
Respiratorios y antialérgicos|Ambroxol|Tos productiva
Cardiovasculares|Losartán|Hipertensión arterial y nefroprotección
Cardiovasculares|Enalapril|Hipertensión arterial e insuficiencia cardiaca
Cardiovasculares|Amlodipino|Hipertensión arterial
Cardiovasculares|Nifedipino|Hipertensión arterial
Cardiovasculares|Hidroclorotiazida|Hipertensión arterial
Cardiovasculares|Clortalidona|Hipertensión arterial
Cardiovasculares|Furosemida|Edema e insuficiencia cardiaca
Cardiovasculares|Espironolactona|Insuficiencia cardiaca y edema
Cardiovasculares|Metoprolol|Hipertensión, cardiopatía isquémica y control de frecuencia
Cardiovasculares|Propranolol|Profilaxis de migraña y temblor
Cardiovasculares|Metildopa|Hipertensión en el embarazo
Cardiovasculares|Atorvastatina|Dislipidemia y prevención cardiovascular
Cardiovasculares|Bezafibrato|Hipertrigliceridemia
Cardiovasculares|Ácido acetilsalicílico|Antiagregante en prevención cardiovascular
Cardiovasculares|Clopidogrel|Antiagregante
Endocrinos|Metformina|Diabetes mellitus tipo 2
Endocrinos|Glibenclamida|Diabetes mellitus tipo 2
Endocrinos|Sitagliptina|Diabetes mellitus tipo 2
Endocrinos|Dapagliflozina|Diabetes tipo 2, insuficiencia cardiaca y enfermedad renal
Endocrinos|Insulina NPH (protamina neutra de Hagedorn)|Diabetes mellitus
Endocrinos|Insulina glargina|Diabetes mellitus
Endocrinos|Insulina de acción rápida|Diabetes mellitus
Endocrinos|Levotiroxina|Hipotiroidismo
Endocrinos|Metimazol|Hipertiroidismo
Corticoesteroides|Prednisona|Asma, alergias y enfermedades inflamatorias
Corticoesteroides|Dexametasona|Crup, reacciones alérgicas e inflamación
Corticoesteroides|Hidrocortisona|Dermatitis (tópica) y anafilaxia (inyectable)
Neurológicos y psiquiátricos|Sertralina|Depresión y ansiedad
Neurológicos y psiquiátricos|Fluoxetina|Depresión
Neurológicos y psiquiátricos|Escitalopram|Depresión y ansiedad
Neurológicos y psiquiátricos|Amitriptilina|Dolor neuropático y profilaxis de migraña
Neurológicos y psiquiátricos|Diazepam|Ansiedad aguda y crisis convulsivas
Neurológicos y psiquiátricos|Clonazepam|Ansiedad y crisis convulsivas
Neurológicos y psiquiátricos|Carbamazepina|Epilepsia y neuralgia del trigémino
Neurológicos y psiquiátricos|Ácido valproico|Epilepsia
Neurológicos y psiquiátricos|Levetiracetam|Epilepsia
Neurológicos y psiquiátricos|Pregabalina|Dolor neuropático
Musculoesqueléticos|Metocarbamol|Contractura muscular
Musculoesqueléticos|Colchicina|Crisis de gota
Musculoesqueléticos|Alopurinol|Hiperuricemia y gota
Vitaminas, minerales y embarazo|Sulfato ferroso|Anemia por deficiencia de hierro
Vitaminas, minerales y embarazo|Ácido fólico|Embarazo y anemia megaloblástica
Vitaminas, minerales y embarazo|Vitamina B12|Deficiencia de vitamina B12
Vitaminas, minerales y embarazo|Carbonato de calcio con vitamina D|Osteoporosis y suplemento en embarazo
Vitaminas, minerales y embarazo|Zinc|Diarrea aguda en niños
Ginecológicos y anticonceptivos|Levonorgestrel|Anticoncepción de emergencia
Ginecológicos y anticonceptivos|Etinilestradiol con levonorgestrel|Anticoncepción oral
Ginecológicos y anticonceptivos|Medroxiprogesterona inyectable|Anticoncepción
Urológicos|Tamsulosina|Hiperplasia prostática
Dermatológicos|Mupirocina|Impétigo
Dermatológicos|Permetrina|Escabiosis y pediculosis
Dermatológicos|Sulfadiazina de plata|Quemaduras
Dermatológicos|Betametasona tópica|Dermatitis
Oftálmicos y óticos|Tobramicina oftálmica|Conjuntivitis bacteriana
Oftálmicos y óticos|Hipromelosa (lágrimas artificiales)|Ojo seco
Oftálmicos y óticos|Ciprofloxacino ótico|Otitis externa
Urgencias en consultorio|Epinefrina|Anafilaxia
Urgencias en consultorio|Solución glucosada al 50%|Hipoglucemia grave
Urgencias en consultorio|Solución salina al 0.9%|Hidratación intravenosa`;
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'');
const M=L.split('\n').map(r=>{const [g,n,u]=r.split('|');return{id:slug(n),g,n,u}});
/* fichas verificadas: se agregan por lotes en FICHAS[id] */
const FICHAS={};
window.MXD={M,FICHAS,slug};
})();
