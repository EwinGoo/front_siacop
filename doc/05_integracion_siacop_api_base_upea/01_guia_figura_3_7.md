# Figura 3.7. Diagrama de integración entre SIACOP y api_base_upea

Esta guía define el contenido recomendado para la figura:

`Figura 3.7. Diagrama de integración entre SIACOP y api_base_upea`

La figura debe representar cómo el sistema `SIACOP` consume la API institucional
`api_base_upea` para obtener datos base de personas, asignaciones, unidades,
vacaciones y otros datos complementarios necesarios para sus módulos funcionales.

## 1. Objetivo de la figura

La figura debe permitir comprender:

- cómo se comunica el frontend React con el backend `ApiSiacop`
- cómo `ApiSiacop` actúa como capa intermedia entre el cliente y `api_base_upea`
- qué base de datos administra cada sistema
- qué tipo de información es consumida desde la API institucional
- cómo se separa la lógica propia de `SIACOP` de los datos institucionales de `UPEA`

## 2. Idea central que debe expresar la figura

La idea principal del diagrama es esta:

`Frontend React -> ApiSiacop -> api_base_upea -> base_upea`

combinado con:

`ApiSiacop -> base_siacop`

Es decir, `ApiSiacop` no depende únicamente de su propia base de datos, sino que
integra información institucional externa mediante `api_base_upea`, consolidando
una respuesta final unificada para el frontend.

## 3. Componentes que deben aparecer

La figura debería mostrar al menos estos bloques:

### 3.1. Frontend SIACOP

Representa la interfaz de usuario desarrollada en `React`, desde donde se realizan
las solicitudes HTTP.

Responsabilidades:

- formularios
- listados
- autocompletados
- consultas de módulos
- interacción del usuario con el sistema

### 3.2. Backend SIACOP - ApiSiacop

Representa el backend principal del sistema, implementado en `CodeIgniter 4`.

Responsabilidades:

- autenticación de sesión
- validación de permisos y acceso
- exposición de endpoints propios del sistema
- consumo de `api_base_upea`
- combinación de datos institucionales con datos propios de `base_siacop`
- devolución de respuestas unificadas al frontend

### 3.3. Base de datos `base_siacop`

Representa la base de datos propia del sistema SIACOP.

Aquí se almacenan, entre otros:

- permisos
- comisiones
- declaratorias
- guardias
- tipos de horario
- horarios base y alternos
- estructuras de planilla
- marcaciones importadas
- resultados mensuales
- planilla de asistencia
- planilla de bono refrigerio
- tablas API propias de SIACOP

### 3.4. API institucional `api_base_upea`

Representa la API de datos institucionales que expone información base para ser
consumida por otros sistemas, entre ellos `SIACOP`.

Responsabilidades:

- exponer datos de personas
- exponer asignaciones administrativas
- exponer unidades activas
- exponer sucursales de caja de salud
- exponer vacaciones solicitadas
- proteger sus endpoints mediante `X-Api-Key`

### 3.5. Base de datos `base_upea`

Representa la base de datos institucional, donde se encuentran tablas de referencia
administrativa y académica utilizadas por `api_base_upea`.

Entre las tablas importantes para la integración se encuentran:

- `siacop_asignacion_administrativo`
- `siacop_vacaciones_solicitadas`
- `vista_siacop_asignacion_administrativo`
- `siacop_unidad_sede`
- tablas de personas institucionales

## 4. Relación entre los componentes

La figura debe dejar claro que:

- el frontend no consume directamente `api_base_upea`
- el frontend consume únicamente `ApiSiacop`
- `ApiSiacop` usa `BaseUpeaService` como cliente HTTP centralizado
- `ApiSiacop` consulta `base_siacop` para sus tablas propias
- `ApiSiacop` consulta `api_base_upea` para datos institucionales
- `api_base_upea` accede a `base_upea`

## 5. Flujo de integración recomendado para representar

Puedes expresar el flujo principal así:

1. El usuario interactúa con el `Frontend React`.
2. El frontend consume endpoints del backend `ApiSiacop`.
3. `ApiSiacop` valida la sesión del usuario.
4. Si necesita datos institucionales, `ApiSiacop` usa `BaseUpeaService`.
5. `BaseUpeaService` realiza llamadas HTTP a `api_base_upea`.
6. `api_base_upea` consulta `base_upea`.
7. `ApiSiacop` combina la respuesta de `api_base_upea` con datos de `base_siacop`.
8. `ApiSiacop` devuelve una respuesta unificada al frontend.

## 6. Mecanismos de autenticación que conviene mostrar

La figura será más profesional si diferencia los dos mecanismos de autenticación:

### 6.1. Entre Frontend y ApiSiacop

Se usa:

- sesión autenticada
- cookie de sesión
- `withCredentials`
- `SessionAuthFilter`

### 6.2. Entre ApiSiacop y api_base_upea

Se usa:

- comunicación HTTP servidor a servidor
- encabezado `X-Api-Key`
- `BaseUpeaService`
- control de acceso por API Key y rate limit

Esto es importante porque muestra que ambas capas no usan el mismo mecanismo de seguridad.

## 7. Módulos de SIACOP que realmente integran con api_base_upea

La figura puede incluir una caja lateral o anotación con los módulos que consumen
datos de `api_base_upea`.

### 7.1. Personas

Endpoints consumidos desde `api_base_upea`:

- `persona/ci/{ci}`
- `persona/buscar`
- `persona/autocompletar`
- `persona/batch`
- `persona/datos-completos`

Uso en SIACOP:

- búsqueda de personas
- autocompletado
- detalle institucional
- enriquecimiento de registros

### 7.2. Permisos

Endpoint consumido:

- `persona/autocompletar-asistencia-permiso`

Uso en SIACOP:

- autocompletado especializado para permisos
- recuperación de datos de persona, cargo y unidad

### 7.3. Boletas de comisión

Endpoints consumidos:

- `persona/autocompletar`
- `asignacion/{id}`
- `asignacion/batch`
- `caja-salud-sucursales`

Uso en SIACOP:

- validación de solicitantes
- enriquecimiento de boletas
- consulta de asignación administrativa
- sucursales de caja de salud

### 7.4. Declaratoria en comisión

Endpoints consumidos:

- `asignacion/{id}`
- `asignacion/batch`
- `unidad-sede`

Uso en SIACOP:

- resolución de persona, cargo y unidad
- listado de unidades activas

### 7.5. Guardias de seguridad

Endpoint consumido:

- `persona/autocompletar`

Uso en SIACOP:

- autocompletado de personal
- selección de integrantes de grupos y asignaciones

### 7.6. Asignaciones administrativas

Endpoints consumidos:

- `asignacion-administrativo`
- `asignacion-administrativo/{id}`
- `asignacion-administrativo/persona/{idPersona}`
- `asignacion-administrativo/batch`

Uso en SIACOP:

- consulta y sincronización de asignaciones institucionales
- recuperación de datos administrativos del personal

### 7.7. Vacaciones

Endpoints consumidos:

- `vacacion-solicitado`
- `vacacion-solicitado/asignacion/{id}`
- `vacacion-solicitado/batch`

Uso en SIACOP:

- consulta de vacaciones solicitadas
- integración con procesos administrativos y cálculo de asistencia

### 7.8. Planilla de asistencia

Integración indirecta y directa mediante:

- `asignacion-administrativo`
- datos de persona
- datos de vacaciones
- unidades activas

Uso en SIACOP:

- precarga de personal
- resolución de horarios y asignaciones
- trazabilidad de la fuente institucional
- consolidación de resultados mensuales

## 8. Componente técnico clave que sí conviene mencionar

La figura debería mencionar explícitamente a:

- `BaseUpeaService`

porque es el componente central de integración entre ambos sistemas.

Su rol es:

- encapsular llamadas HTTP
- enviar `X-Api-Key`
- manejar `timeout`
- aplicar reintentos
- manejar cache en consultas GET
- centralizar la comunicación con `api_base_upea`

## 9. Qué bases de datos y tablas conviene reflejar

Para que el diagrama tenga valor académico, conviene diferenciar claramente las dos bases:

### 9.1. `base_siacop`

Datos propios del sistema:

- permisos
- comisiones
- declaratorias
- guardias
- horarios
- marcaciones importadas
- resultados diarios y mensuales
- planilla de asistencia
- bono refrigerio
- configuración y tablas auxiliares

### 9.2. `base_upea`

Datos institucionales consumidos mediante `api_base_upea`:

- personas
- asignaciones administrativas
- vista de asignaciones administrativas
- unidades sede
- vacaciones solicitadas

## 10. Forma profesional de dibujarlo

La figura puede organizarse por capas horizontales o por bloques laterales.

### Opción recomendada

```text
Usuario
   |
   v
Frontend React (SIACOP)
   |
   | HTTP + Cookie de sesión
   v
ApiSiacop (CodeIgniter 4)
   | \
   |  \ consulta local
   |   \
   |    v
   |   base_siacop
   |
   | HTTP + X-Api-Key
   v
api_base_upea
   |
   v
base_upea
```

Luego puedes añadir anotaciones laterales:

- módulos SIACOP que integran datos institucionales
- endpoints principales consumidos
- tipo de autenticación en cada enlace

## 11. Versión resumida lista para dibujar

Puedes usar esta estructura base:

```text
SIACOP
├── Frontend React
│   ├── formularios
│   ├── listados
│   └── autocompletados
│
├── Backend ApiSiacop
│   ├── SessionAuthFilter
│   ├── BaseApiController
│   ├── BaseUpeaService
│   ├── módulos propios
│   │   ├── permisos
│   │   ├── comisiones
│   │   ├── declaratoria
│   │   ├── guardias
│   │   ├── asignaciones
│   │   └── planilla asistencia
│   └── base_siacop
│
└── Integración externa
    ├── api_base_upea
    │   ├── persona
    │   ├── asignacion
    │   ├── asignacion-administrativo
    │   ├── unidad-sede
    │   ├── caja-salud-sucursales
    │   └── vacacion-solicitado
    └── base_upea
```

## 12. Qué no conviene hacer en esta figura

No conviene:

- dibujar todos los endpoints existentes
- mostrar todos los controladores internos de ambos proyectos
- saturar la imagen con demasiadas tablas
- mezclar esta figura con diagrama de clases

Esta figura debe enfocarse en la integración entre sistemas, no en el detalle interno
de implementación.

## 13. Recomendación final para tu tesis

La figura debe dejar muy claro que:

- `SIACOP` no replica toda la información institucional
- `api_base_upea` funciona como proveedor de datos base
- `ApiSiacop` centraliza la lógica de integración
- `base_siacop` conserva la lógica y datos propios del sistema
- la arquitectura fue desacoplada y orientada a servicios

Eso le da mucho valor técnico y metodológico al capítulo.

## 14. Archivos sugeridos para este directorio

Se recomienda guardar aquí:

- `figura_3_7_integracion_siacop_api_base_upea.drawio`
- `figura_3_7_integracion_siacop_api_base_upea.png`
- `figura_3_7_integracion_siacop_api_base_upea.svg`
- `figura_3_7_integracion_siacop_api_base_upea_borrador.md`
