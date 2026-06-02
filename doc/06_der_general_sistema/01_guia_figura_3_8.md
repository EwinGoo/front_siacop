# Figura 3.8. Diagrama entidad-relación general del sistema

Esta guía define el contenido recomendado para la figura:

`Figura 3.8. Diagrama entidad-relación general del sistema`

La figura debe representar la estructura general de datos del sistema `SIACOP`,
considerando que la solución utiliza dos bases de datos:

- `base_siacop`, donde se almacenan los datos funcionales y operativos del sistema
- `base_upea`, donde residen los datos institucionales maestros consumidos mediante `api_base_upea`

La recomendación para esta figura es presentar un solo diagrama general, pero separado
visualmente por bloques de base de datos, diferenciando:

- relaciones físicas internas
- relaciones lógicas de integración entre bases

## 1. Objetivo de la figura

La figura debe permitir comprender:

- cómo se estructuran las entidades principales del sistema
- qué datos pertenecen a `base_siacop`
- qué datos pertenecen a `base_upea`
- cómo se relacionan los módulos funcionales con las entidades institucionales
- cómo se integran las tablas propias con las tablas maestras externas

## 2. Criterio general para construir el diagrama

Como el sistema trabaja con dos bases de datos, no conviene mezclar todas las entidades
como si pertenecieran a un solo origen. El diagrama debe dividirse en dos bloques:

### 2.1. Bloque `base_upea`

Debe mostrar las entidades institucionales maestras.

### 2.2. Bloque `base_siacop`

Debe mostrar las entidades funcionales propias del sistema.

### 2.3. Relaciones entre bloques

Las relaciones entre ambas bases deben representarse como:

- `relaciones lógicas`
- `líneas punteadas`
- o una nota que indique `integración mediante api_base_upea`

Esto es importante porque varias referencias no están implementadas como claves foráneas
físicas entre bases, sino como integraciones lógicas a nivel de servicio.

## 3. Estructura general recomendada del DER

La figura debería organizarse así:

```text
Sistema SIACOP
├── Base de datos institucional: base_upea
│   ├── persona
│   ├── siacop_asignacion_administrativo
│   ├── siacop_vacacion_solicitado
│   ├── siacop_unidad_sede
│   ├── siacop_horario_tipo
│   ├── siacop_horario
│   ├── siacop_horario_alterno
│   ├── vista_siacop_asignacion_administrativo
│   └── tablas técnicas API
│
└── Base de datos funcional: base_siacop
    ├── seguridad y usuarios
    ├── permisos y comisiones
    ├── declaratoria
    ├── biométricos
    ├── guardias
    ├── planilla de asistencia
    └── resultados
```

## 4. Entidades principales de `base_upea`

Estas entidades deben aparecer como origen institucional del sistema.

## 4.1. `persona`

Entidad maestra de personas institucionales.

### Atributos mínimos sugeridos

- `id` (PK)
- `ci`
- `nombre`
- `paterno`
- `materno`
- `genero`

### Relación importante

- una `persona` puede tener una o varias `siacop_asignacion_administrativo`

## 4.2. `siacop_asignacion_administrativo`

Entidad institucional de asignación administrativa del personal.

### Atributos mínimos sugeridos

- `id_asignacion_administrativo` (PK)
- `id_persona_administrativo`
- `id_poa`
- `id_nivel`
- `id_horario_tipo`
- `fecha_inicio_asignacion_administrativo`
- `fecha_fin_asignacion_administrativo`
- `tipo_contratacion`
- `codigo_cargo`
- `estado_asignacion_administrativo`

### Relaciones importantes

- pertenece a una `persona`
- se relaciona con `siacop_horario_tipo`
- se relaciona lógicamente con permisos, comisiones, declaratorias, vacaciones y planilla en `base_siacop`

## 4.3. `siacop_vacacion_solicitado`

Entidad institucional de vacaciones solicitadas del personal.

### Atributos mínimos sugeridos

- `id_vacacion_solicitado` (PK)
- `id_asignacion_administrativo`
- `fecha_vacacion_inicio`
- `fecha_vacacion_fin`
- `dias_solicitado`
- `dias_saldo`
- `estado_vacacion`
- `correlativo`

### Relaciones importantes

- pertenece a una `siacop_asignacion_administrativo`
- se integra lógicamente con el módulo de vacaciones y con el proceso de asistencia

## 4.4. `siacop_unidad_sede`

Entidad institucional de unidad o sede.

### Atributos mínimos sugeridos

- `id_unidad_sede` (PK)
- `nombre_unidad_sede` o equivalente
- `estado`

### Relación importante

- se usa para enriquecer asignaciones y declaratorias

## 4.5. `siacop_horario_tipo`

Catálogo institucional de tipos de horario.

### Atributos mínimos sugeridos

- `id_horario_tipo` (PK)
- `nombre_horario_tipo`
- `descripcion_horario_tipo`
- `estado_horario_tipo`

### Relaciones importantes

- un `siacop_horario_tipo` puede tener varios `siacop_horario`
- una `siacop_asignacion_administrativo` referencia un `siacop_horario_tipo`
- se integra con el motor de asistencia en `base_siacop`

## 4.6. `siacop_horario`

Horario base asociado a un tipo de horario.

### Atributos mínimos sugeridos

- `id_horario` (PK)
- `id_horario_tipo`
- `hora_inicio`
- `hora_fin`
- `descripcion_horario`

### Relación importante

- pertenece a un `siacop_horario_tipo`

## 4.7. `siacop_horario_alterno`

Horario alterno o excepcional.

### Atributos mínimos sugeridos

- `id_horario_alterno` (PK)
- `id_horario`
- `fecha_inicio_horario_alterno`
- `fecha_fin_horario_alterno`
- `hora_inicio_alterno`
- `hora_fin_alterno`

### Relación importante

- pertenece a un `siacop_horario`

## 4.8. `vista_siacop_asignacion_administrativo`

Vista de consulta enriquecida.

### Recomendación

No es obligatorio dibujarla como entidad principal, porque es una vista derivada. Si la
incluyes, debe aparecer como:

- vista auxiliar de consulta
- no como entidad transaccional central

## 4.9. Tablas técnicas de API en `base_upea`

Estas tablas deben aparecer en un bloque técnico secundario, no en el centro del DER.

### Entidades sugeridas

- `siacop_api_clients`
- `siacop_api_keys`
- `siacop_api_permissions`
- `siacop_api_field_rules`
- `siacop_api_request_logs`

### Propósito

- autenticación por API Key
- autorización por endpoint
- control de campos permitidos
- auditoría de peticiones

### Relaciones sugeridas

- `siacop_api_clients` 1:N `siacop_api_keys`
- `siacop_api_keys` 1:N `siacop_api_permissions`
- `siacop_api_keys` 1:N `siacop_api_field_rules`
- `siacop_api_keys` 1:N `siacop_api_request_logs`

## 5. Entidades principales de `base_siacop`

Estas entidades representan la lógica funcional propia del sistema.

## 5.1. `siacop_users`

Entidad de usuarios del sistema.

### Atributos mínimos sugeridos

- `id` (PK)
- `username` o equivalente
- `email`
- `active`

### Relación importante

- se relaciona con múltiples tablas operativas como generador, aprobador o receptor

## 5.2. `siacop_correlativo`

Catálogo de correlativos institucionales usados por módulos documentales.

### Atributos mínimos sugeridos

- `id_correlativo` (PK)
- `codigo_correlativo`
- `correlativo`
- `gestion_correlativo`
- `descripcion_correlativo`

## 5.3. `siacop_multimedia`

Entidad de archivos adjuntos.

### Atributos mínimos sugeridos

- `id_multimedia` (PK)
- `id_usuario`
- `nombre_archivo`
- `ruta_archivo`
- `tipo_archivo`
- `tipo_relacion`

### Relación importante

- pertenece a `siacop_users`

## 5.4. `siacop_asistencia_tipo_permiso`

Catálogo de tipos de permiso y comisión.

### Atributos mínimos sugeridos

- `id_tipo_permiso` (PK)
- `nombre`
- `tipo_permiso`
- `limite_dias`

## 5.5. `siacop_asistencia_permiso`

Entidad de permisos administrativos.

### Atributos mínimos sugeridos

- `id_asistencia_permiso` (PK)
- `id_persona`
- `id_tipo_permiso`
- `id_usuario_generador`
- `id_usuario_aprobador`
- `id_usuario_recepcion`
- `estado_permiso`
- `fecha_inicio_permiso`
- `fecha_fin_permiso`
- `correlativo`

### Relaciones importantes

- pertenece a `siacop_asistencia_tipo_permiso`
- se relaciona con `siacop_users`
- se relaciona lógicamente con `persona` de `base_upea`

## 5.6. `siacop_boleta_comision`

Entidad de boletas de comisión.

### Atributos mínimos sugeridos

- `id_comision` (PK)
- `id_asignacion_administrativo`
- `id_usuario_generador`
- `id_usuario_aprobador`
- `id_usuario_recepcion`
- `id_tipo_permiso`
- `fecha_comision`
- `fecha_comision_fin`
- `estado_boleta_comision`
- `correlativo`

### Relaciones importantes

- pertenece a `siacop_asistencia_tipo_permiso`
- se relaciona con `siacop_users`
- se relaciona lógicamente con `siacop_asignacion_administrativo` de `base_upea`

## 5.7. `siacop_declaratoria_comision`

Entidad de declaratoria en comisión.

### Atributos mínimos sugeridos

- `id_declaratoria_comision` (PK)
- `id_asignacion_administrativo`
- `id_unidad_sede`
- `id_usuario`
- `fecha_inicio`
- `fecha_fin`
- `destino`
- `estado`
- `correlativo`

### Relaciones importantes

- se relaciona con `siacop_users`
- se relaciona lógicamente con `siacop_asignacion_administrativo`
- se relaciona lógicamente con `siacop_unidad_sede`

## 5.8. `siacop_asistencia_feriado_asueto`

Entidad de feriados y asuetos.

### Atributos mínimos sugeridos

- `id_asistencia_feriado_asueto` (PK)
- `id_usuario`
- `nombre_evento`
- `fecha_evento`
- `tipo_evento`
- `aplicado_a`

### Relación importante

- pertenece a `siacop_users`

## 5.9. `siacop_biometrico_dispositivos`

Entidad de dispositivos biométricos.

### Atributos mínimos sugeridos

- `id_biometrico` (PK)
- `id_usuario`
- `nombre_dispositivo`
- `direccion_ip`
- `puerto`
- `serial`
- `modelo`

### Relación importante

- pertenece a `siacop_users`

## 5.10. `siacop_guardia_turno`

Catálogo de turnos de guardias.

### Atributos mínimos sugeridos

- `id_guardia_turno` (PK)
- `nombre`
- `hora_inicio`
- `hora_fin`

## 5.11. `siacop_guardia_bloque`

Catálogo de bloques o áreas de guardia.

### Atributos mínimos sugeridos

- `id_guardia_bloque` (PK)
- `nombre`
- `descripcion`

## 5.12. `siacop_guardia_grupo`

Entidad de grupos de rotación de guardias.

### Atributos mínimos sugeridos

- `id_guardia_grupo` (PK)
- `nombre`
- `orden`

## 5.13. `siacop_guardia_grupo_miembro`

Entidad de miembros de grupo de guardias.

### Atributos mínimos sugeridos

- `id_guardia_grupo_miembro` (PK)
- `id_guardia_grupo`
- `id_persona`
- `id_guardia_bloque`

### Relaciones importantes

- pertenece a `siacop_guardia_grupo`
- puede relacionarse con `siacop_guardia_bloque`
- se relaciona lógicamente con `persona` de `base_upea`

## 5.14. `siacop_guardia_programacion_semanal`

Programación semanal de grupos de guardia.

### Atributos mínimos sugeridos

- `id_guardia_programacion_semanal` (PK)
- `id_guardia_grupo`
- `id_guardia_turno`
- `fecha_inicio_semana`
- `fecha_fin_semana`

### Relaciones importantes

- pertenece a `siacop_guardia_grupo`
- pertenece a `siacop_guardia_turno`

## 5.15. `siacop_guardia_asignacion`

Asignación diaria de guardias.

### Atributos mínimos sugeridos

- `id_guardia_asignacion` (PK)
- `id_persona`
- `id_guardia_turno`
- `id_guardia_bloque`
- `id_guardia_grupo`
- `fecha`
- `tipo_origen`

### Relaciones importantes

- pertenece a `siacop_guardia_turno`
- puede pertenecer a `siacop_guardia_bloque`
- puede pertenecer a `siacop_guardia_grupo`
- se relaciona lógicamente con `persona`

## 5.16. `siacop_asistencia_importacion_archivo`

Bitácora de importaciones biométricas.

### Atributos mínimos sugeridos

- `id_importacion_archivo` (PK)
- `archivo_origen`
- `estado_importacion`
- `total_lineas_archivo`
- `lineas_validas`
- `lineas_invalidas`
- `fecha_inicio_importacion`
- `fecha_fin_importacion`

## 5.17. `siacop_asistencia_marcacion_raw`

Marcaciones crudas importadas desde archivo.

### Atributos mínimos sugeridos

- `id_marcacion_raw` (PK)
- `archivo_origen`
- `linea_origen`
- `codigo_biometrico`
- `fecha_hora_marcacion`
- `fecha_importacion`

## 5.18. `siacop_asistencia_marcacion`

Marcaciones normalizadas.

### Atributos mínimos sugeridos

- `id_marcacion` (PK)
- `id_marcacion_raw`
- `id_persona`
- `codigo_biometrico`
- `fecha_hora_marcacion`
- `fecha_marcacion`
- `hora_marcacion`

### Relaciones importantes

- puede pertenecer a `siacop_asistencia_marcacion_raw`
- se relaciona lógicamente con `persona`

## 5.19. `siacop_asistencia_persona_biometrico`

Relación entre persona y código biométrico.

### Atributos mínimos sugeridos

- `id_persona_biometrico` (PK)
- `id_persona`
- `codigo_biometrico`
- `es_principal`
- `activo`

### Relación importante

- se relaciona lógicamente con `persona`

## 5.20. `siacop_asistencia_proceso`

Proceso principal de generación de planilla.

### Atributos mínimos sugeridos

- `id_proceso` (PK)
- `tipo_proceso`
- `fecha_inicio`
- `fecha_fin`
- `gestion`
- `mes`
- `estado_proceso`

## 5.21. `siacop_asistencia_proceso_persona`

Snapshot de personas procesadas.

### Atributos mínimos sugeridos

- `id_proceso_persona` (PK)
- `id_proceso`
- `id_persona`
- `id_asignacion_administrativo`
- `id_horario_tipo`
- `ci`
- `nombre_completo`

### Relaciones importantes

- pertenece a `siacop_asistencia_proceso`
- se relaciona físicamente con `siacop_horario_tipo` si está replicado/localmente
- se relaciona lógicamente con `persona`
- se relaciona lógicamente con `siacop_asignacion_administrativo`

## 5.22. `siacop_asistencia_proceso_fuente`

Trazabilidad de fuentes usadas en el proceso.

### Atributos mínimos sugeridos

- `id_proceso_fuente` (PK)
- `id_proceso`
- `fuente`
- `estado_fuente`
- `total_registros`

### Relación importante

- pertenece a `siacop_asistencia_proceso`

## 5.23. `siacop_asistencia_resultado_diario`

Resultado diario del motor de asistencia.

### Atributos mínimos sugeridos

- `id_resultado_diario` (PK)
- `id_proceso`
- `id_persona`
- `id_asignacion_administrativo`
- `id_horario_tipo`
- `fecha`
- `estado_dia`
- `minutos_atraso_oficial`
- `dias_descuento_oficial`

### Relaciones importantes

- pertenece a `siacop_asistencia_proceso`
- se relaciona físicamente con `siacop_horario_tipo` si está en esta base
- se relaciona lógicamente con `persona`
- se relaciona lógicamente con `siacop_asignacion_administrativo`

## 5.24. `siacop_asistencia_resultado_mensual`

Resultado mensual consolidado.

### Atributos mínimos sugeridos

- `id_resultado_mensual` (PK)
- `id_proceso`
- `id_persona`
- `id_asignacion_administrativo`
- `dias_trabajados`
- `dias_falta`
- `dias_abandono`
- `minutos_atraso_oficial`
- `dias_descuento_oficial`
- `estado_mensual`

### Relaciones importantes

- pertenece a `siacop_asistencia_proceso`
- se relaciona lógicamente con `persona`
- se relaciona lógicamente con `siacop_asignacion_administrativo`

## 6. Relaciones principales que deberían aparecer en el diagrama

## 6.1. Relaciones físicas en `base_upea`

- `persona` 1:N `siacop_asignacion_administrativo`
- `siacop_asignacion_administrativo` N:1 `siacop_horario_tipo`
- `siacop_horario_tipo` 1:N `siacop_horario`
- `siacop_horario` 1:N `siacop_horario_alterno`
- `siacop_asignacion_administrativo` 1:N `siacop_vacacion_solicitado`

## 6.2. Relaciones físicas en `base_siacop`

- `siacop_users` 1:N `siacop_multimedia`
- `siacop_users` 1:N `siacop_asistencia_permiso`
- `siacop_users` 1:N `siacop_boleta_comision`
- `siacop_users` 1:N `siacop_declaratoria_comision`
- `siacop_asistencia_tipo_permiso` 1:N `siacop_asistencia_permiso`
- `siacop_asistencia_tipo_permiso` 1:N `siacop_boleta_comision`
- `siacop_guardia_grupo` 1:N `siacop_guardia_grupo_miembro`
- `siacop_guardia_turno` 1:N `siacop_guardia_programacion_semanal`
- `siacop_guardia_grupo` 1:N `siacop_guardia_programacion_semanal`
- `siacop_guardia_turno` 1:N `siacop_guardia_asignacion`
- `siacop_guardia_bloque` 1:N `siacop_guardia_asignacion`
- `siacop_guardia_grupo` 1:N `siacop_guardia_asignacion`
- `siacop_asistencia_marcacion_raw` 1:N `siacop_asistencia_marcacion`
- `siacop_asistencia_proceso` 1:N `siacop_asistencia_proceso_persona`
- `siacop_asistencia_proceso` 1:N `siacop_asistencia_proceso_fuente`
- `siacop_asistencia_proceso` 1:N `siacop_asistencia_resultado_diario`
- `siacop_asistencia_proceso` 1:N `siacop_asistencia_resultado_mensual`

## 6.3. Relaciones lógicas entre `base_siacop` y `base_upea`

Estas relaciones deberían dibujarse con línea punteada o una etiqueta de integración:

- `siacop_asistencia_permiso.id_persona` -> `persona.id`
- `siacop_boleta_comision.id_asignacion_administrativo` -> `siacop_asignacion_administrativo.id_asignacion_administrativo`
- `siacop_declaratoria_comision.id_asignacion_administrativo` -> `siacop_asignacion_administrativo.id_asignacion_administrativo`
- `siacop_declaratoria_comision.id_unidad_sede` -> `siacop_unidad_sede.id_unidad_sede`
- `siacop_guardia_grupo_miembro.id_persona` -> `persona.id`
- `siacop_guardia_asignacion.id_persona` -> `persona.id`
- `siacop_asistencia_marcacion.id_persona` -> `persona.id`
- `siacop_asistencia_persona_biometrico.id_persona` -> `persona.id`
- `siacop_asistencia_proceso_persona.id_persona` -> `persona.id`
- `siacop_asistencia_proceso_persona.id_asignacion_administrativo` -> `siacop_asignacion_administrativo.id_asignacion_administrativo`
- `siacop_asistencia_proceso_persona.id_horario_tipo` -> `siacop_horario_tipo.id_horario_tipo`
- `siacop_asistencia_resultado_diario.id_persona` -> `persona.id`
- `siacop_asistencia_resultado_diario.id_asignacion_administrativo` -> `siacop_asignacion_administrativo.id_asignacion_administrativo`
- `siacop_asistencia_resultado_diario.id_horario_tipo` -> `siacop_horario_tipo.id_horario_tipo`
- `siacop_asistencia_resultado_mensual.id_persona` -> `persona.id`
- `siacop_asistencia_resultado_mensual.id_asignacion_administrativo` -> `siacop_asignacion_administrativo.id_asignacion_administrativo`

## 7. Qué entidades conviene priorizar visualmente

Como el diagrama es general, no todas las tablas deben tener el mismo peso visual.

### 7.1. Entidades núcleo institucional

- `persona`
- `siacop_asignacion_administrativo`
- `siacop_vacacion_solicitado`
- `siacop_horario_tipo`

### 7.2. Entidades núcleo funcional de SIACOP

- `siacop_asistencia_permiso`
- `siacop_boleta_comision`
- `siacop_declaratoria_comision`
- `siacop_guardia_asignacion`
- `siacop_asistencia_marcacion`
- `siacop_asistencia_proceso`
- `siacop_asistencia_resultado_diario`
- `siacop_asistencia_resultado_mensual`

### 7.3. Entidades secundarias

- `siacop_multimedia`
- `siacop_correlativo`
- `siacop_guardia_bloque`
- `siacop_guardia_turno`
- `siacop_guardia_grupo`
- tablas técnicas API

## 8. Recomendación visual para el diagrama

La figura puede organizarse en dos grandes columnas:

### Lado izquierdo: `base_upea`

- entidades institucionales
- horarios
- vacaciones
- tablas técnicas API

### Lado derecho: `base_siacop`

- seguridad y usuarios
- permisos y comisiones
- declaratorias
- biométricos
- guardias
- planilla de asistencia

### Centro del diagrama

Coloca las relaciones lógicas principales con líneas punteadas:

- `persona`
- `siacop_asignacion_administrativo`
- `siacop_horario_tipo`
- `siacop_vacacion_solicitado`

Estas cuatro entidades son el puente conceptual más importante con `base_siacop`.

## 9. Versión resumida lista para dibujar

Puedes partir de esta estructura:

```text
BASE_UPEA
├── persona
├── siacop_asignacion_administrativo
├── siacop_vacacion_solicitado
├── siacop_unidad_sede
├── siacop_horario_tipo
├── siacop_horario
├── siacop_horario_alterno
├── vista_siacop_asignacion_administrativo
├── siacop_api_clients
├── siacop_api_keys
├── siacop_api_permissions
├── siacop_api_field_rules
└── siacop_api_request_logs

BASE_SIACOP
├── siacop_users
├── siacop_correlativo
├── siacop_multimedia
├── siacop_asistencia_tipo_permiso
├── siacop_asistencia_permiso
├── siacop_boleta_comision
├── siacop_declaratoria_comision
├── siacop_asistencia_feriado_asueto
├── siacop_biometrico_dispositivos
├── siacop_guardia_turno
├── siacop_guardia_bloque
├── siacop_guardia_grupo
├── siacop_guardia_grupo_miembro
├── siacop_guardia_programacion_semanal
├── siacop_guardia_asignacion
├── siacop_asistencia_importacion_archivo
├── siacop_asistencia_marcacion_raw
├── siacop_asistencia_marcacion
├── siacop_asistencia_persona_biometrico
├── siacop_asistencia_proceso
├── siacop_asistencia_proceso_persona
├── siacop_asistencia_proceso_fuente
├── siacop_asistencia_resultado_diario
└── siacop_asistencia_resultado_mensual
```

## 10. Qué no conviene hacer

No conviene:

- dibujar todas las columnas de todas las tablas
- mezclar vistas con tablas transaccionales sin diferenciarlas
- usar solo claves físicas y omitir las relaciones lógicas
- hacer un diagrama plano sin separar `base_upea` y `base_siacop`

## 11. Recomendación final para tu tesis

Esta figura debe demostrar que:

- el sistema tiene una arquitectura de datos distribuida
- `base_upea` conserva la información institucional maestra
- `base_siacop` gestiona la lógica funcional y operativa del sistema
- la integración entre ambas bases es controlada mediante servicios y referencias lógicas

Ese enfoque es el más correcto para defender tu sistema profesionalmente.

## 12. Archivos sugeridos para este directorio

Se recomienda guardar aquí:

- `figura_3_8_der_general_sistema.drawio`
- `figura_3_8_der_general_sistema.png`
- `figura_3_8_der_general_sistema.svg`
- `figura_3_8_der_general_sistema_borrador.md`
