# Documentación General de la Implementación SIACOP

## Propósito del documento

Este documento resume de forma integral la implementación realizada en SIACOP, incluyendo arquitectura, frontend React, backend modular, autenticación compartida, navegación unificada, APIs internas y externas, cambios de base de datos y módulos funcionales relevantes.

La idea no es describir solo pantallas aisladas, sino dejar constancia de la lógica técnica y arquitectónica que se fue incorporando para soportar la evolución del sistema.

## Contexto general de la solución

La implementación realizada en SIACOP responde a un proceso de modernización progresiva del sistema. En lugar de reemplazar completamente la aplicación anterior, se construyó una arquitectura híbrida que permite la convivencia entre:

- el sistema legacy basado en MVC
- la nueva SPA construida en React
- una API interna modular en el backend principal
- una API externa/institucional de datos base (`api_base_upea`)

Esto significa que SIACOP no fue rediseñado como dos aplicaciones totalmente separadas, sino como un ecosistema coordinado donde varias capas comparten sesión, lógica, navegación, contratos de datos y servicios.

## Arquitectura implementada

La solución implementada puede describirse como una **arquitectura híbrida modular con modernización incremental**.

Sus componentes principales son:

- `server/`: backend principal del sistema, construido sobre CodeIgniter 4
- `client/`: frontend SPA en React montado dentro del mismo ecosistema
- `api_base_upea/`: API institucional para exponer datos base de forma segura y controlada

Desde una perspectiva profesional, esta arquitectura combina:

- MVC tradicional para mantener operativo el sistema anterior
- SPA React para los módulos nuevos o modernizados
- API interna versionada para desacoplar frontend y backend
- servicios de integración para enriquecer datos
- una estrategia de migración progresiva sin interrumpir operación

## Coexistencia entre MVC, React y API interna

Uno de los aportes principales fue la coexistencia funcional entre el sistema legacy y el sistema nuevo.

La versión tradicional sigue operando bajo MVC, mientras que la nueva interfaz React se monta bajo `/apps` y consume endpoints internos del backend. La API interna vive principalmente en `server/app/Modules/ApiSiacop`, donde se organizaron rutas, filtros, controladores, servicios y modelos por dominio funcional.

Esto permite que:

- el sistema anterior siga disponible
- la nueva SPA evolucione por módulos
- la lógica de negocio siga centralizada en backend
- el frontend nuevo no dependa de vistas MVC

En este sentido, la solución se acerca a una **arquitectura híbrida HMVC + SPA**, con modularización real en backend.

## Autenticación compartida y gestión de sesión

La autenticación principal del sistema no fue implementada como una autenticación autónoma en React, sino como una **integración de sesión compartida con el backend**.

La sesión real vive en el backend `server/`, apoyado en CodeIgniter Shield. React consume esa sesión mediante cookies y no administra un login independiente ni un bearer token operativo para el flujo normal.

### Funcionamiento

El flujo general es:

1. El usuario inicia sesión en el backend.
2. Shield genera la sesión PHP correspondiente.
3. React se carga dentro del mismo entorno del sistema.
4. Axios envía automáticamente la cookie de sesión usando `withCredentials`.
5. React consulta el usuario autenticado vía `auth/check`.
6. Si la sesión existe, habilita rutas privadas.
7. Si no existe, redirige al login servido por el backend.

### Piezas principales

- [Auth.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/Auth.tsx:1)
- [AuthHelpers.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/AuthHelpers.ts:1)
- [AppRoutes.tsx](C:/Users/az232/Desktop/siacop/client/src/app/routing/AppRoutes.tsx:1)
- [SessionAuthFilter.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Filters/SessionAuthFilter.php:1)
- [AuthController.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Controllers/V1/AuthController.php:1)

### Qué representa técnicamente

Lo implementado puede nombrarse como:

- autenticación basada en sesión compartida
- integración SPA-backend con sesión centralizada
- control de acceso híbrido entre backend y frontend

## Autorización por roles y permisos

Además de la autenticación, se implementó una **capa de autorización interna en React** basada en roles y permisos.

El backend devuelve al frontend información del usuario autenticado, incluyendo grupos, permisos, menú y algunos datos operativos. A partir de ello, React calcula permisos disponibles y protege rutas, vistas y acciones.

### Piezas clave

- [roles.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/roles.ts:1)
- [permissions.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/roles/permissions.ts:1)
- [roleDefinitions.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/roles/roleDefinitions.ts:1)
- [ProtectedRoute.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/ProtectedRoute.tsx:1)
- [usePermissions.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/hooks/usePermissions.ts:1)

### Alcance de esta capa

Esta capa permite:

- proteger rutas privadas
- habilitar o restringir módulos
- condicionar botones y acciones
- agrupar permisos por dominio funcional

Esto no reemplaza la validación backend, pero sí organiza la experiencia del usuario en la SPA.

## MenuBuilder y navegación compartida

Se implementó una utilidad de construcción de menús en [MenuBuilder.php](C:/Users/az232/Desktop/siacop/server/app/Libraries/MenuBuilder.php:1), orientada a unificar la navegación entre el sistema legacy MVC y la nueva SPA React.

Esto permitió centralizar la estructura del menú y evitar que cada interfaz definiera su propia lógica de navegación de forma aislada.

### Aporte de `MenuBuilder`

- genera menús reutilizables para MVC y React
- mantiene consistencia visual y funcional
- permite filtrar opciones según contexto del usuario
- evita duplicación de reglas de navegación

Profesionalmente, esto puede describirse como una **capa compartida de navegación y visibilidad funcional**.

## Backend modular y capa de servicios

El backend principal de `server/` no se limitó a exponer CRUDs. Se implementó una **capa de servicios y orquestación de negocio**, donde los controladores delegan la lógica real a servicios especializados.

Eso permitió:

- encapsular reglas de negocio
- centralizar integración con otras fuentes
- evitar lógica compleja en controllers
- enriquecer respuestas antes de enviarlas al frontend

En varios módulos el backend actúa como:

- fachada de integración
- orquestador de datos
- capa de enriquecimiento

## Integración con `api_base_upea`

Se implementó una **capa de integración con servicios institucionales externos** usando [BaseUpeaService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/BaseUpeaService.php:1).

La finalidad de esta capa es consumir datos institucionales sin acoplar directamente cada módulo a la base o estructura interna de `base_upea`.

### Configuración

- [ApiSiacop.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Config/ApiSiacop.php:1)
- `ApiSiacop.baseUpeaUrl`
- `ApiSiacop.baseUpeaApiKey`

### Rol técnico

Esta capa permite:

- consumir `api_base_upea` por HTTP
- autenticar el consumo con `X-Api-Key`
- desacoplar SIACOP de la base institucional
- combinar datos externos con datos locales
- reutilizar la misma integración desde varios módulos

Profesionalmente puede nombrarse como una **capa de integración y enriquecimiento de datos institucionales**.

## `api_base_upea` como API institucional de datos base

En [api_base_upea](C:/Users/az232/Desktop/siacop/api_base_upea) se implementó una API independiente para exponer datos institucionales reutilizables a sistemas clientes como SIACOP.

No se trata de una API abierta ni de una API simple de consulta. Se construyó como una **API institucional protegida**, con autenticación por API key, autorización por endpoint, reglas de campos, rate limit y auditoría.

### Referencias principales

- [backend.md](C:/Users/az232/Desktop/siacop/api_base_upea/doc/backend.md:1)
- [API_GUIDE.md](C:/Users/az232/Desktop/siacop/api_base_upea/docs/API_GUIDE.md:1)
- [Routes.php](C:/Users/az232/Desktop/siacop/api_base_upea/app/Config/Routes.php:1)
- [ApiKeyFilter.php](C:/Users/az232/Desktop/siacop/api_base_upea/app/Filters/ApiKeyFilter.php:1)
- [ApiKeyService.php](C:/Users/az232/Desktop/siacop/api_base_upea/app/Services/ApiKeyService.php:1)

### Funciones implementadas

- autenticación por `X-Api-Key`
- permisos por endpoint y método HTTP
- whitelist de campos por endpoint
- selección dinámica de campos mediante `?fields=`
- rate limit por cliente
- logging y auditoría de requests
- cache de permisos y field rules

### Valor arquitectónico

Esta API funciona como una **plataforma institucional de datos base**, que evita acceso directo a la base fuente y permite controlar qué consume cada sistema cliente.

## Módulo de comisiones

El módulo de comisiones no se limitó al alta y listado de registros. Se implementó un flujo de operación completo que incluye:

- creación y edición de boletas
- validaciones de formulario
- recepción, observación y aprobación por estados
- reportes PDF
- integración con datos institucionales
- compatibilidad con gestión QR
- comportamiento adaptado para desktop y mobile

### Validaciones

Se implementaron validaciones en frontend con Formik + Yup, incluyendo reglas condicionales, validación por tipo de comisión, coherencia de fechas y horas y restricciones de campos obligatorios.

Referencias:

- [EditModalForm.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/comision/comision-list/comision-edit-modal/EditModalForm.tsx:1)
- [editComisionSchema.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/comision/comision-list/comision-edit-modal/schemas/editComisionSchema.ts:1)

### Observación y cambios de estado

También se implementó flujo de observación con validación propia y transición de estados desde frontend hacia backend.

Referencia:

- [ObservarModal.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/comision/comision-list/comision-edit-modal/ObservarModal.tsx:1)

### Reportes PDF

Se desarrolló un modal de reportes que permite solicitar PDFs filtrados por fecha, estado y tipo de permiso, usando validación previa y consumo de blob desde backend.

Referencias:

- [ReportModalFormWrapper.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/comision/comision-list/comision-report-modal/ReportModalFormWrapper.tsx:1)
- [reportValidationSchema.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/comision/comision-list/comision-report-modal/schema/reportValidationSchema.ts:1)

## Módulo de permisos

En permisos se implementó una lógica similar a comisiones, pero adaptada al dominio de licencias o permisos especiales.

El módulo contempla:

- formularios con validación inline
- cambios de estado
- aprobación y observación
- filtros y reportes
- integración con QR

### Validación inline

Las validaciones incluyen:

- solicitante requerido según contexto
- tipo de permiso obligatorio
- fechas coherentes
- validaciones de rango

Referencia:

- [asistenciaPermisoSchema.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/permisos/asistencia-permiso/schemas/asistenciaPermisoSchema.ts:1)

## Módulo de declaratoria de comisión

Se implementó un módulo específico para declaratorias de comisión, con formulario validado, consulta de datos, visualización detallada y manejo de PDF en modal.

### Validaciones

Se desarrolló un formulario con validación por campos obligatorios, coherencia entre fechas, hoja de ruta, destino, unidad solicitante y otros datos de negocio.

Referencia:

- [EditModalForm.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/declaratoria-comision/declaratoria-comision-list/form-edit-modal/EditModalForm.tsx:1)

### PDF en modal

Se implementó una experiencia de visualización del PDF dentro de modal, en lugar de expulsar al usuario inmediatamente a otra pestaña.

Referencia:

- [PDFModal.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/declaratoria-comision/declaratoria-comision-list/pdf-modal/PDFModal.tsx:1)

## Gestión QR

Se implementó un **módulo unificado de procesamiento de estados por QR y por ingreso manual**.

El objetivo no fue solo leer códigos QR, sino centralizar la recepción, aprobación y observación de:

- comisiones
- permisos
- vacaciones

### Funcionamiento

El módulo detecta automáticamente el tipo documental según el prefijo del código:

- `C` → comisión
- `P` → permiso
- `V` → vacación

Luego enruta el flujo al módulo correspondiente usando un registro de módulos y un procesamiento común.

### Capacidades implementadas

- escaneo por cámara
- sonido y retroalimentación visual
- prevención de lecturas duplicadas
- ingreso manual de código
- modo manual y modo automático
- ejecución de acciones según estado
- reutilización de endpoints existentes de cada dominio

### Referencias

- [GestionQrPage.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/gestion-qr/GestionQrPage.tsx:1)
- [useQRScanner.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/gestion-qr/hooks/useQRScanner.ts:1)
- [useProcessor.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/gestion-qr/hooks/useProcessor.ts:1)
- [parseID.ts](C:/Users/az232/Desktop/siacop/client/src/app/utils/parseID.ts:1)

## Módulo de guardias de seguridad

Se implementó un módulo integral para la operación de guardias, estructurado en tres ejes:

- bloques o áreas
- grupos de rotación
- horario semanal

No es un CRUD simple, sino un submódulo operativo que combina organización de personal, asignación semanal, cobertura y reemplazos por emergencia.

### Capacidades principales

- alta y mantenimiento de bloques o áreas de cobertura
- creación de grupos de rotación
- administración de miembros por grupo
- asignación de bloques por defecto a miembros
- autocompletado de personal válido para guardia
- cálculo de horario semanal
- generación automática de semana por ciclo
- asignaciones manuales
- reemplazos de emergencia
- visualización tipo calendario y tipo tabla

### Referencias

- [GestionGuardiasPage.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/guardias-seguridad/GestionGuardiasPage.tsx:1)
- [HorarioPage.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/guardias-seguridad/horario/HorarioPage.tsx:1)
- [GuardiaHorarioController.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Controllers/V1/ControlPersonal/Guardia/GuardiaHorarioController.php:1)
- [GuardiaAsignacionController.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Controllers/V1/ControlPersonal/Guardia/GuardiaAsignacionController.php:1)
- [GuardiaGrupoController.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Controllers/V1/ControlPersonal/Guardia/GuardiaGrupoController.php:1)
- [GuardiaPersonaService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/Guardia/GuardiaPersonaService.php:1)

### Valor técnico

Este módulo incorpora reglas operativas reales, como:

- cálculo de posición dentro de un ciclo
- programación automática de lunes a viernes
- respeto de asignaciones existentes
- control de reemplazos activos
- prevención de duplicidad por persona, fecha y turno
- enriquecimiento de personas desde la API institucional

## Módulo de vacaciones y reporte de vacaciones

En React se implementó el módulo de reporte de vacaciones en la ruta:

- `http://localhost:3011/apps/vacaciones-reporte/listar`

Este módulo ofrece una vista de consulta y generación de reportes PDF de vacaciones, con filtros por fechas, estado, tipo de solicitud y modalidad de reporte.

### Capacidades implementadas

- listado de registros de vacaciones
- soporte para tabla y cards
- reporte general
- reporte de recepción
- descarga en móvil
- visualización en iframe dentro del modal para desktop

### Modal de reporte

El reporte se construyó como un flujo mixto:

- en desktop, el PDF se muestra en modal mediante `iframe`
- en móvil, el archivo se descarga directamente por compatibilidad

Referencias:

- [VacacionReportePage.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/vacaciones/reporte/VacacionReportePage.tsx:1)
- [ReportModal.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/vacaciones/reporte/vacacion-reporte-list/report-modal/ReportModal.tsx:1)
- [ReportModalFormWrapper.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/vacaciones/reporte/vacacion-reporte-list/report-modal/ReportModalFormWrapper.tsx:1)
- [ReportModalForm.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/vacaciones/reporte/vacacion-reporte-list/report-modal/ReportModalForm.tsx:1)

## Asignaciones administrativas

Se implementó también el módulo de asignaciones administrativas, apoyado tanto en backend como en `api_base_upea`, como una pieza clave para identificar la relación activa entre persona, cargo, unidad y ahora también el tipo de horario.

Esto fue importante porque varias reglas del sistema dependen de la asignación administrativa activa del usuario:

- permisos
- comisiones
- vacaciones
- guardias
- planilla de asistencia

## Motor general de planilla de asistencia mensual

El componente más importante de la implementación es el **motor general de planilla de asistencia mensual**, ya que actúa como el núcleo integrador del sistema de control personal. En términos funcionales, este motor es el que transforma datos dispersos de marcaciones, horarios, asignaciones, guardias y justificativos administrativos en un resultado mensual consolidado por persona.

No se trata de una pantalla aislada ni de un reporte simple. Se implementó una **cadena completa de procesamiento** que permite:

- importar marcaciones biométricas
- normalizar y relacionar esas marcaciones con personas del sistema
- crear procesos mensuales de cálculo con snapshot de personal
- precargar reglas, horarios, guardias y justificativos
- calcular resultados diarios por persona y fecha
- consolidar resultados mensuales
- exponer resultados detallados para revisión y seguimiento

Por esta razón, puede afirmarse que este motor constituye el **corazón operativo del sistema**, y que varios de los demás módulos fueron implementados o ajustados precisamente para alimentar correctamente su funcionamiento.

### Propósito del motor

El objetivo del motor es generar una planilla de asistencia mensual a partir de evidencia real de marcación y de la situación administrativa vigente de cada persona. Para ello cruza, interpreta y consolida información de distintas fuentes, evitando que el cálculo quede reducido a una simple comparación entre hora de entrada y hora de salida.

En este enfoque, la planilla mensual no depende de una sola tabla, sino de una red de módulos relacionados:

- asignación administrativa activa
- tipo de horario
- puntos esperados por horario
- marcaciones biométricas importadas
- guardias programadas
- permisos aprobados
- comisiones aprobadas
- declaratorias vigentes
- vacaciones aprobadas
- feriados y asuetos

### Flujo general implementado

El flujo del motor se construyó en varias etapas bien diferenciadas:

#### 1. Importación y normalización de marcaciones biométricas

Se implementó un servicio específico para importar archivos `.dat` o `.txt` provenientes del biométrico:

- [ImportadorMarcacionDatService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/ImportadorMarcacionDatService.php:1)

Este componente:

- valida el archivo recibido
- guarda una copia temporal del origen importado
- parsea línea por línea
- registra la traza original en `raw`
- normaliza la marcación para uso operativo
- intenta relacionar el código biométrico con una persona activa
- evita duplicados mediante hash de deduplicación

Con ello se construyó una separación clara entre:

- marcación cruda importada
- marcación normalizada utilizable por el motor

Esto permite trazabilidad, control de duplicados y depuración de inconsistencias en la fuente biométrica.

#### 2. Creación del proceso mensual

Se implementó un modelo de **proceso de planilla** que no calcula directamente sobre el universo vivo del sistema, sino sobre un snapshot controlado del periodo:

- [AsistenciaProcesoController.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Controllers/V1/ControlPersonal/PlanillaAsistencia/AsistenciaProcesoController.php:1)
- [AsistenciaProcesoService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/AsistenciaProcesoService.php:1)

Este proceso mensual concentra:

- gestión
- mes
- rango de fechas
- personas incluidas
- estado del proceso
- resumen de ejecución

La decisión de usar procesos independientes permite recalcular, auditar y revisar resultados sin depender únicamente del estado actual cambiante de los módulos fuente.

#### 3. Precarga de contexto de cálculo

Antes del cálculo diario se implementó una etapa de precarga:

- [PrecargaAsistenciaService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/PrecargaAsistenciaService.php:1)

Esta capa reúne en memoria operativa:

- parámetros de configuración
- puntos por horario
- días laborables por tipo de horario
- tipos no descontables
- marcaciones por persona y fecha
- guardias por persona y fecha
- permisos aprobados
- comisiones aprobadas
- declaratorias vigentes
- feriados y asuetos
- vacaciones aprobadas desde `api_base_upea`

Esto es importante porque el motor no consulta cada módulo de forma improvisada dentro del cálculo, sino que primero arma un contexto consolidado para procesar el mes de manera consistente.

#### 4. Resolución del horario esperado

Se implementó una capa para resolver qué horario corresponde realmente a una persona en un día determinado:

- [ResolvedorHorarioService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/ResolvedorHorarioService.php:1)

Esta lógica:

- identifica el tipo de horario de la persona
- verifica si el día es laborable según configuración
- detecta si existe una guardia asignada
- reemplaza el horario normal por el turno de guardia cuando corresponde
- define los puntos esperados de marcación para ese día

Aquí se ve claramente por qué fue necesario implementar también el módulo de guardias y la estructura de horarios: ambos alimentan directamente al motor de asistencia.

#### 5. Resolución de justificativos

Otro aporte central fue la construcción de una capa que interpreta justificativos administrativos:

- [ResolvedorJustificativoService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/ResolvedorJustificativoService.php:1)

Esta capa revisa si una fecha está cubierta por:

- feriado o asueto
- vacación aprobada
- declaratoria de comisión
- boleta de comisión
- permiso aprobado

Además, no solo detecta la existencia del justificativo, sino que interpreta su **cobertura real**, por ejemplo:

- día completo
- turno mañana
- turno tarde
- ventana horaria parcial
- día no laborable

Eso permitió que el cálculo diario no trate todos los justificativos como equivalentes, sino según el alcance real de cada uno.

#### 6. Cálculo diario de asistencia

El cálculo diario se implementó en:

- [CalculadorDiarioService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/CalculadorDiarioService.php:1)

Este servicio recorre:

- cada persona del proceso
- cada fecha del rango mensual

Y para cada día:

- resuelve el contexto horario
- aplica justificativos
- recupera las marcaciones válidas del día
- considera cruces de medianoche cuando el turno lo requiere
- clasifica la cobertura de puntos esperados
- calcula atrasos
- determina descuentos calculados y oficiales
- produce el estado diario final
- persiste resultado diario y detalle por punto

Los estados diarios contemplados incluyen:

- `PRESENTE`
- `ATRASO`
- `JUSTIFICADO`
- `FALTA`
- `ABANDONO`
- `OBSERVADO`
- `SIN_HORARIO`
- `NO_LABORABLE`

Esto demuestra que el motor no produce solo un conteo bruto de marcaciones, sino una **clasificación funcional completa del día laboral**.

#### 7. Consolidación mensual

Una vez generados los resultados diarios, se implementó una consolidación mensual por persona:

- [ConsolidadorMensualService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/ConsolidadorMensualService.php:1)

Esta etapa resume:

- días trabajados
- días justificados
- faltas
- abandonos
- minutos de atraso
- descuentos calculados
- descuentos oficiales
- estado mensual
- observaciones derivadas del detalle diario

Los estados mensuales incluyen categorías como:

- `NORMAL`
- `CON_ATRASOS`
- `CON_FALTAS`
- `CON_ABANDONOS`
- `JUSTIFICADO`
- `OBSERVADO`

Con esto se obtiene un resultado mensual final listo para consulta, revisión administrativa o futuras integraciones de reporte.

#### 8. Orquestación completa del proceso

Toda la cadena anterior se articula desde:

- [GeneradorPlanillaAsistenciaService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/PlanillaAsistencia/GeneradorPlanillaAsistenciaService.php:1)

Este servicio:

- obtiene el proceso creado
- valida que exista snapshot de personas
- marca el proceso como en ejecución
- ejecuta la precarga
- dispara el cálculo diario
- dispara la consolidación mensual
- guarda el resumen final
- marca el proceso como finalizado o con error

Esto refleja una implementación de tipo **motor orquestador**, no solo una suma de consultas sueltas.

### Por qué este motor es el corazón del sistema

Desde el punto de vista arquitectónico, este motor es el componente que más dependencias funcionales integra y el que más justifica la existencia de otros módulos. Varias piezas del sistema fueron necesarias precisamente para que la planilla mensual sea confiable:

- la estructura de horarios define la expectativa de marcación
- las asignaciones administrativas permiten saber a quién procesar y bajo qué tipo de horario
- el módulo de guardias altera la lógica normal del día
- permisos, comisiones, declaratorias y vacaciones justifican ausencias o coberturas parciales
- `api_base_upea` aporta datos institucionales y vacaciones aprobadas
- el mapeo biométrico relaciona la marcación física con la persona real del sistema

En otras palabras, la planilla mensual funciona como un **motor de consolidación transversal** y no como un módulo aislado. Por eso puede describirse como el resultado integrador más importante de toda la implementación.

### Qué se implementó en frontend y API para este motor

Además del backend de cálculo, se implementó una API específica para operar el motor, incluyendo:

- carga de archivos de marcación
- consulta de registros `raw`
- consulta de marcaciones normalizadas
- resumen de importaciones
- creación y listado de procesos
- ejecución de procesos
- consulta de resultados diarios
- consulta de resultados mensuales
- detalle por persona

Estas capacidades viven principalmente en:

- `server/app/Modules/ApiSiacop/Controllers/V1/ControlPersonal/PlanillaAsistencia`

Y deben entenderse como la interfaz operativa del motor, no solo como endpoints auxiliares.

### Descripción profesional sugerida

Para fines de documentación formal, este trabajo puede describirse así:

> Se implementó un motor general de planilla de asistencia mensual orientado al procesamiento integral de asistencia institucional. Dicho motor importa marcaciones biométricas, normaliza su relación con el personal, consolida un snapshot mensual de cálculo y cruza horarios, guardias, permisos, comisiones, declaratorias, vacaciones y feriados para generar resultados diarios y mensuales por persona. La solución fue construida como una capa orquestadora de negocio, con servicios especializados para precarga, resolución de horarios, interpretación de justificativos, cálculo diario y consolidación mensual, constituyéndose en el núcleo funcional del sistema de control personal.

## Gestión de correlativos y concurrencia

En módulos como comisiones, permisos y vacaciones se implementó una lógica de **generación transaccional de correlativos**, orientada a evitar duplicidades en escenarios concurrentes.

Esta lógica vive en servicios como:

- [BoletaService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/BoletaService.php:1)
- [AsistenciaPermisoService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/AsistenciaPermisoService.php:1)
- [VacacionAdministrativoService.php](C:/Users/az232/Desktop/siacop/server/app/Modules/ApiSiacop/Services/ControlPersonal/VacacionAdministrativoService.php:1)

El objetivo fue garantizar:

- unicidad de correlativo
- consistencia bajo concurrencia
- persistencia transaccional del cambio de estado

## Trabajo realizado en base de datos

La implementación también implicó trabajo específico de base de datos. No solo se construyeron módulos en frontend o backend, sino que se realizaron ajustes estructurales, ampliaciones de esquema y migraciones de datos para soportar los nuevos procesos.

### Tipos de trabajo realizados

- creación de tablas nuevas
- reestructuración de tablas existentes
- normalización de nombres de columnas
- incorporación de nuevos campos de relación lógica
- actualización masiva de datos
- alineación entre bases distintas

## Estructura de horarios y relación con asignación administrativa

Uno de los cambios más importantes fue la incorporación de una estructura de horarios para poder clasificar a las personas según su tipo de horario y tipo de personal operativo.

### Script en `api_base_upea`

- [2026-05-17_estructura_horarios_asignacion_administrativa.sql](C:/Users/az232/Desktop/siacop/api_base_upea/db/2026-05-17_estructura_horarios_asignacion_administrativa.sql:1)

En `api_base_upea` se implementó una estructura formada por:

- `siacop_horario_tipo`
- `siacop_horario`
- `siacop_horario_alterno`

Con esto se buscó:

- crear un catálogo formal de tipos de horario
- definir horarios base por tipo
- registrar horarios alternos o excepcionales
- reutilizar el dato de horario dentro de la asignación administrativa

En esa base sí se planteó una relación estructurada entre la asignación administrativa y el tipo de horario, ya que la tabla fuente de asignaciones vive allí.

### Ajuste equivalente en `server`

- [2026-05-17_estructura_horarios_asignacion_administrativa.sql](C:/Users/az232/Desktop/siacop/server/db/Horarios/2026-05-17_estructura_horarios_asignacion_administrativa.sql:1)

En `server` se realizó el ajuste equivalente, pero con una diferencia importante: como `server` y `api_base_upea` trabajan sobre bases distintas, la relación con `id_horario_tipo` ya no podía mantenerse como una FK física real entre ambas bases.

Por eso, en `server` la columna quedó documentada como una **referencia lógica** y no como una restricción relacional estricta entre dos motores o esquemas distintos.

Esto es importante para la documentación porque no fue una simple copia de estructura, sino una adaptación deliberada para mantener compatibilidad sin forzar una FK imposible entre bases separadas.

## Ajustes para planilla de asistencia

También se realizaron cambios en base de datos para el módulo de planilla de asistencia.

### Carpeta de ajustes

- [actualizar-campos](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos)

### Cambios principales

#### 1. Normalización del nombre del campo de horario

- [02_rename_id_tipo_horario_to_id_horario_tipo.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/02_rename_id_tipo_horario_to_id_horario_tipo.sql:1)

Aquí se corrigió la nomenclatura en varias tablas de planilla para unificar el uso de `id_horario_tipo`, dejando atrás la forma anterior `id_tipo_horario`.

El objetivo fue:

- unificar criterio de nombres
- alinear planilla con la nueva estructura de horarios
- evitar ambigüedad técnica en consultas y procesos

#### 2. Ampliación del snapshot del proceso

- [03_add_genero_to_proceso_persona.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/03_add_genero_to_proceso_persona.sql:1)

Se agregó el campo `genero` en la tabla de snapshot del proceso de asistencia para enriquecer el dato congelado de cada persona procesada.

#### 3. Asignación masiva de tipo de horario

- [administrativo/01_update_horario_tipo.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/administrativo/01_update_horario_tipo.sql:1)
- [guardias/01_update_horario_tipo.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/guardias/01_update_horario_tipo.sql:1)
- [limpieza/01_update_horario_tipo.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/limpieza/01_update_horario_tipo.sql:1)

Estos scripts permiten clasificar asignaciones activas según el tipo de horario que les corresponde:

- administrativo → horario tipo 1
- guardias → horario tipo 2
- limpieza → horario tipo 3

En los casos de guardias y limpieza, la asignación se hizo a partir de conjuntos concretos de personas identificadas por CI, para actualizar masivamente la clasificación de horario en `siacop_asignacion_administrativo`.

#### 4. Extracción y conciliación de personal

- [limpieza/02_pesonal_limpieza.sql](C:/Users/az232/Desktop/siacop/server/db/PlanillaAsistencia/actualizar-campos/limpieza/02_pesonal_limpieza.sql:1)

Este script se orientó a extraer datos de personas para conciliación o depuración del universo de personal de limpieza, lo que refuerza que el trabajo no fue solo crear tablas sino también homologar datos reales.

## Sentido documental del trabajo de base de datos

Todo lo anterior puede documentarse como:

- reestructuración de esquema
- adecuación de base de datos a nuevos módulos
- homologación entre bases
- migración y clasificación de datos operativos

Una forma profesional de resumirlo sería:

> Se realizaron ajustes estructurales y de datos en la base de datos para soportar la nueva arquitectura funcional del sistema, incorporando catálogos de horarios, referencias lógicas entre bases separadas, normalización de campos, enriquecimiento de snapshots operativos y procesos de clasificación masiva del personal según su tipo de horario.

## Responsive, modales y experiencia de usuario

En la SPA también se trabajó una línea de implementación consistente para mejorar la experiencia de usuario:

- visualización dual tabla/cards
- modales para edición y visualización
- PDFs mostrados dentro del sistema cuando era conveniente
- compatibilidad diferenciada entre desktop y mobile
- acciones compactas para pantallas reducidas

Esto se refleja especialmente en:

- comisiones
- declaratoria de comisión
- vacaciones reporte
- guardias

## Resumen del alcance implementado

En conjunto, el trabajo realizado abarcó:

- arquitectura híbrida MVC + SPA + API
- autenticación por sesión compartida
- autorización por roles y permisos
- menú unificado para MVC y React
- backend modular con servicios de negocio
- integración con `api_base_upea`
- API institucional con API keys, permisos y field rules
- módulos funcionales complejos en React
- generación segura de correlativos
- reestructuración y adaptación de base de datos
- procesamiento documental por QR
- programación operativa de guardias
- reportes PDF integrados a la experiencia del usuario

## Referencias de apoyo ya existentes

Para ampliar el detalle de módulos específicos ya documentados, se pueden consultar:

- [frontend.md](C:/Users/az232/Desktop/siacop/client/doc/frontend.md:1)
- [backend.md](C:/Users/az232/Desktop/siacop/client/doc/backend.md:1)
- [modulo-comisiones.md](C:/Users/az232/Desktop/siacop/client/doc/modulo-comisiones.md:1)
- [boleta-comsion.md](C:/Users/az232/Desktop/siacop/client/doc/boleta-comsion.md:1)
- [declaratoria-comsion.md](C:/Users/az232/Desktop/siacop/client/doc/declaratoria-comsion.md:1)
- [MODULO_ASIGNACIONES_ADMINISTRATIVAS.md](C:/Users/az232/Desktop/siacop/client/doc/MODULO_ASIGNACIONES_ADMINISTRATIVAS.md:1)
