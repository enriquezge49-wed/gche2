# GCHE2

App personal de consultas, medicamentos, estudio y herramientas clínicas del Dr. Genaro Chicatti Enríquez.

- Versión 1.0.0 (Fase 1): diseño y navegación completa, instalable y con funcionamiento sin internet.
- Se publica con GitHub Pages.

## Versión 1.1.0: Consultas

- Inicio de sesión con Google y base de datos en Firebase (proyecto gche2-f0012). Cada médico solo ve sus propios pacientes.
- Funciona sin internet: lo capturado se guarda en el dispositivo y se sube al conectar.
- Pacientes, expediente con resumen fijo, historia clínica en 5 versiones, nota SOAP, consulta rápida, referencia, agenda y documentos para imprimir o guardar en PDF.

## Versión 1.6.0: Estudio con materias y cursos

- Mis materias: 7 áreas, 34 materias y 421 temas del Manual CTO de Medicina y Cirugía, 14.ª edición, con fuente por tema y notas privadas. Los resúmenes y las preguntas se agregan conforme se estudia cada tema.
- Mis cursos: el curso de Farmacología se abre en un visor dentro de la app (pdf.js, en `lib/`). Los documentos y su índice de búsqueda se guardan solo en el dispositivo; nunca van a este repositorio.

## Versión 1.7.0: Madera y Guías de Práctica Clínica

- Mis cursos ahora tiene dos cursos: Farmacología y Flashcards Madera (4 partes, 1095 páginas, con lista de temas y buscador). Como en Farmacología, los documentos y su índice solo viven en el dispositivo.
- Guías de Práctica Clínica: 84 guías de 58 temas de las rotaciones del Programa de Internado Rotatorio de Pregrado del IESIT, con buscador y enlace a cada guía.

## Versión 1.10.0: primeros temas completos de Estudio

- Diabetes tipo 2 (Endocrinología, tema 5), hipertensión arterial (Cardiología, tema 14) e infecciones respiratorias agudas altas (Enfermedades Infecciosas, tema 6): resumen, 30 preguntas tipo ENARM con opciones revueltas y explicación, repaso en audio con la voz del dispositivo, y fuentes.
- El contenido vive en `estudio-temas.js`, redactado con palabras propias a partir de la bibliografía citada; solo enlaza a sitios .gob.mx.
