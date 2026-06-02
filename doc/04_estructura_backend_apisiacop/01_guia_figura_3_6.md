# Figura 3.6. Diagrama de paquetes o módulos del backend ApiSiacop

Esta guía define el contenido recomendado para la figura:

`Figura 3.6. Diagrama de paquetes o módulos del backend ApiSiacop`

La figura debe mostrar la organización lógica del backend implementado en `CodeIgniter 4`,
tomando como base el módulo `ApiSiacop`. No se recomienda presentar un árbol completo de
archivos, sino una vista estructurada por paquetes funcionales y componentes compartidos.

## 1. Objetivo de la figura

La figura debe permitir comprender:

- cómo se organizó el backend desacoplado del sistema
- cómo se distribuyeron los controladores, servicios y componentes transversales
- cómo se separaron los módulos administrativos y de control personal
- cómo el backend expone servicios versionados para el frontend React

## 2. Nivel de detalle recomendado

Para esta figura conviene usar un nivel de detalle intermedio, mostrando:

- paquete principal `ApiSiacop`
- subpaquetes de configuración, filtros, controladores, servicios, modelos, librerías y traits
- agrupación por dominios funcionales
- submódulos especializados como `Administrador`, `ControlPersonal`, `Guardia` y `PlanillaAsistencia`

No conviene mostrar cada archivo menor o cada método interno. El propósito de la figura es
explicar la arquitectura modular del backend.

## 3. Estructura general que sí debe aparecer

La estructura general del backend puede representarse de manera similar a esta:

```text
ApiSiacop/
├── Config
├── Controllers
│   └── V1
│       ├── Administrador
│       ├── ControlPersonal
│       │   ├── Guardia
│       │   └── PlanillaAsistencia
│       ├── AuthController
│       ├── PersonaController
│       └── HealthController
├── Filters
├── Libraries
├── Models
├── Services
│   ├── Administrador
│   └── ControlPersonal
│       ├── Guardia
│       └── PlanillaAsistencia
├── Traits
└── Views
```

Esta estructura es suficiente para una figura general de paquetes.

## 4. Paquetes principales que deben figurar

### 4.1. Paquete `Config`

Debe mostrarse como el paquete donde se define la configuración de rutas versionadas
del backend. En este paquete se centraliza la exposición de endpoints de `ApiSiacop`
consumidos por el frontend React.

Se puede describir como:

- definición de rutas `api/v1`
- agrupación de endpoints por módulos
- integración con filtros de autenticación

### 4.2. Paquete `Filters`

Debe aparecer porque cumple una función transversal importante.

Componente principal:

- `SessionAuthFilter`

Responsabilidad:

- validación de sesión autenticada
- protección de rutas privadas
- control de acceso a endpoints del backend

### 4.3. Paquete `Traits`

Debe figurar como paquete compartido de apoyo.

Componentes identificados:

- `ApiResponseTrait`
- `PersonaEnriquecerTrait`

Responsabilidades:

- estandarización de respuestas JSON
- reutilización de lógica común
- apoyo al enriquecimiento de datos de personas

### 4.4. Paquete `Controllers`

Este paquete representa la capa de entrada del backend. Aquí se reciben las solicitudes
HTTP y se delega la lógica hacia servicios especializados.

Dentro de `Controllers/V1` conviene mostrar:

- `AuthController`
- `PersonaController`
- `HealthController`
- `Administrador`
- `ControlPersonal`

### 4.5. Paquete `Services`

Este paquete representa la capa de lógica de negocio del backend. Es importante que el
diagrama lo destaque, porque en tu arquitectura gran parte del procesamiento fue llevado
ahí.

Dentro de `Services` conviene mostrar:

- `Administrador`
- `ControlPersonal`
- `Guardia`
- `PlanillaAsistencia`

### 4.6. Paquete `Models`

Debe aparecer como el paquete responsable de la interacción con la persistencia de datos,
incluyendo entidades y acceso a tablas de la base de datos del sistema.

No es necesario detallar todas las clases del paquete si la figura es general.

### 4.7. Paquete `Libraries`

Debe figurar como paquete de apoyo para componentes reutilizables, adaptadores o lógica
auxiliar más especializada.

### 4.8. Paquete `Views`

Puede mostrarse como paquete auxiliar del módulo, aunque su protagonismo es menor debido
a que el sistema opera principalmente como API para un frontend desacoplado.

## 5. Submódulos funcionales que deben aparecer

## 5.1. Módulo `Administrador`

Este submódulo debe aparecer como paquete funcional independiente dentro de `Controllers`
y `Services`, porque centraliza las operaciones administrativas del sistema relacionadas
con dispositivos biométricos y comunicación con equipos ZKTeco.

### Controladores identificados

- `BiometricoController`
- `ZktecoController`

### Servicios identificados

- `BiometricoService`
- `ZktecoService`

### Responsabilidades del módulo

- gestión CRUD de dispositivos biométricos
- obtención de dispositivos por identificador o serial
- conexión con dispositivos ZKTeco
- gestión de sesión con el biométrico
- consulta de usuarios del dispositivo
- verificación del estado de conexión del equipo

## 5.2. Módulo `ControlPersonal`

Este submódulo representa el núcleo funcional del sistema. Aquí se concentró la mayor
parte de los procesos administrativos de Recursos Humanos y control de asistencia.

### Controladores identificados

- `AsignacionAdministrativoController`
- `AsistenciaFeriadoAsuetoController`
- `AsistenciaPermisoController`
- `BoletaComisionController`
- `DeclaratoriaComisionController`
- `TipoPermisoController`
- `VacacionController`

### Servicios identificados

- `AsignacionAdministrativoService`
- `AsistenciaPermisoService`
- `BoletaService`
- `CorrelativoService`
- `VacacionAdministrativoService`

### Responsabilidades del módulo

- asignaciones administrativas
- feriados y asuetos
- permisos
- boletas de comisión
- declaratorias en comisión
- tipos de permiso
- vacaciones

## 5.3. Submódulo `Guardia`

Este submódulo debe mostrarse dentro de `ControlPersonal`, porque depende del dominio de
control personal, pero posee una estructura propia por su complejidad funcional.

### Controladores identificados

- `GuardiaAsignacionController`
- `GuardiaBloqueController`
- `GuardiaGrupoController`
- `GuardiaHorarioController`
- `GuardiaProgramacionSemanalController`
- `GuardiaTurnoController`

### Servicios identificados

- `GuardiaPersonaService`

### Responsabilidades del submódulo

- gestión de turnos
- gestión de bloques o puestos
- administración de grupos de guardias
- asignación de miembros
- generación de horarios semanales
- programación semanal
- asignaciones especiales

## 5.4. Submódulo `PlanillaAsistencia`

Este submódulo también debe mostrarse dentro de `ControlPersonal`, ya que constituye una
unidad funcional especializada para importación, procesamiento y consolidación de
marcaciones biométricas y resultados mensuales.

### Controladores identificados

- `AsistenciaImportacionController`
- `AsistenciaProcesoController`
- `AsistenciaResultadoController`
- `AsistenciaResultadoMensualController`

### Servicios identificados

- `AsistenciaConfiguracionService`
- `AsistenciaProcesoService`
- `AsistenciaResultadoMensualService`
- `AsistenciaResultadoService`
- `CalculadorAtrasoService`
- `CalculadorDiarioService`
- `ClasificadorMarcacionService`
- `ConsolidadorMensualService`
- `GeneradorPlanillaAsistenciaService`
- `ImportadorMarcacionDatService`
- `PrecargaAsistenciaService`
- `ResolvedorHorarioService`
- `ResolvedorJustificativoService`

### Responsabilidades del submódulo

- importación de marcaciones biométricas
- normalización de registros
- clasificación de marcaciones
- resolución de horarios
- resolución de justificativos
- cálculo diario de asistencia
- cálculo de atrasos
- consolidación mensual
- generación de planilla mensual de asistencia
- generación de resultados mensuales

## 6. Componentes transversales que conviene mostrar en el diagrama

Además de los paquetes funcionales, se recomienda que el diagrama exprese la relación de
los controladores con elementos transversales del backend:

- `BaseApiController`
- `ApiResponseTrait`
- `SessionAuthFilter`
- servicios de negocio
- modelos o acceso a persistencia

Estas relaciones ayudan a demostrar que la arquitectura no fue una colección aislada de
controladores, sino una estructura modular con reutilización y estandarización.

## 7. Relaciones recomendadas para el diagrama

Para que el diagrama quede profesional, conviene reflejar estas relaciones:

- `Config` define rutas hacia `Controllers`
- `Filters` protege el acceso a los `Controllers`
- `Controllers` dependen de `Services`
- `Services` consumen `Models`, `Libraries` y `Traits` cuando corresponde
- `Administrador` y `ControlPersonal` son subpaquetes funcionales del backend
- `Guardia` y `PlanillaAsistencia` son subpaquetes especializados dentro de `ControlPersonal`

## 8. Versión resumida lista para dibujar

Puedes dibujar la figura con esta estructura base:

```text
ApiSiacop
├── Config
│   └── Routes
├── Filters
│   └── SessionAuthFilter
├── Traits
│   ├── ApiResponseTrait
│   └── PersonaEnriquecerTrait
├── Controllers
│   └── V1
│       ├── AuthController
│       ├── PersonaController
│       ├── HealthController
│       ├── Administrador
│       │   ├── BiometricoController
│       │   └── ZktecoController
│       └── ControlPersonal
│           ├── AsignacionAdministrativoController
│           ├── AsistenciaFeriadoAsuetoController
│           ├── AsistenciaPermisoController
│           ├── BoletaComisionController
│           ├── DeclaratoriaComisionController
│           ├── TipoPermisoController
│           ├── VacacionController
│           ├── Guardia
│           │   ├── GuardiaAsignacionController
│           │   ├── GuardiaBloqueController
│           │   ├── GuardiaGrupoController
│           │   ├── GuardiaHorarioController
│           │   ├── GuardiaProgramacionSemanalController
│           │   └── GuardiaTurnoController
│           └── PlanillaAsistencia
│               ├── AsistenciaImportacionController
│               ├── AsistenciaProcesoController
│               ├── AsistenciaResultadoController
│               └── AsistenciaResultadoMensualController
├── Services
│   ├── Administrador
│   │   ├── BiometricoService
│   │   └── ZktecoService
│   └── ControlPersonal
│       ├── AsignacionAdministrativoService
│       ├── AsistenciaPermisoService
│       ├── BoletaService
│       ├── CorrelativoService
│       ├── VacacionAdministrativoService
│       ├── Guardia
│       │   └── GuardiaPersonaService
│       └── PlanillaAsistencia
│           ├── AsistenciaConfiguracionService
│           ├── AsistenciaProcesoService
│           ├── AsistenciaResultadoMensualService
│           ├── AsistenciaResultadoService
│           ├── CalculadorAtrasoService
│           ├── CalculadorDiarioService
│           ├── ClasificadorMarcacionService
│           ├── ConsolidadorMensualService
│           ├── GeneradorPlanillaAsistenciaService
│           ├── ImportadorMarcacionDatService
│           ├── PrecargaAsistenciaService
│           ├── ResolvedorHorarioService
│           └── ResolvedorJustificativoService
├── Models
├── Libraries
└── Views
```

## 9. Recomendación para tu tesis

La figura debe verse como un diagrama de paquetes, no como una captura del explorador de
archivos. Lo más recomendable es agrupar visualmente por capas:

- capa de configuración y seguridad
- capa de controladores
- capa de servicios
- capa de persistencia y apoyo
- capa de módulos funcionales

Eso hará que el resultado sea más académico, más limpio y más fácil de defender.

## 10. Archivos sugeridos para este directorio

Se recomienda guardar aquí:

- `figura_3_6_backend_apisiacop.drawio`
- `figura_3_6_backend_apisiacop.png`
- `figura_3_6_backend_apisiacop.svg`
- `figura_3_6_backend_apisiacop_borrador.md`
