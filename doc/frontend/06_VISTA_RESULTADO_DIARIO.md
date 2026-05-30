# Vista: Resultado Diario

## Qué hace la vista

Muestra la auditoría diaria de asistencia por proceso, persona y fecha.

Es la vista para responder:

- por qué una persona salió con atraso
- por qué se marcó falta
- qué justificativo se aplicó
- qué marcaciones concretas usó el motor

## Ruta sugerida

- `/apps/planilla-asistencia/procesos/:id/resultados-diarios`

## Endpoints

- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados/persona/{idPersona}?fecha=YYYY-MM-DD`

## Filtros mínimos

- búsqueda por persona
- filtro por `estado_dia`
- filtro por fecha

## Campos mínimos del listado

Tomados del diseño del motor:

- `id_persona`
- `fecha`
- `tipo_horario`
- `cantidad_marcaciones_esperadas`
- `cantidad_marcaciones_validas`
- `estado_dia`
- `minutos_atraso`
- `dias_sancion_calculados`
- `dias_sancion_aplicados`
- `es_no_descontable`
- `motivo_no_descuento`
- `observacion`

## Estados de día a contemplar

- `PRESENTE`
- `ATRASO`
- `SIN_MARCACION`
- `FALTA`
- `ABANDONO`
- `PERMISO`
- `COMISION`
- `DECLARATORIA_COMISION`
- `VACACION`
- `BAJA_MEDICA`
- `FERIADO`
- `ASUETO`
- `OBSERVADO`
- `NO_LABORAL`
- `SIN_HORARIO`

## Detalle diario por persona y fecha

El detalle debe mostrar como mínimo:

- encabezado de persona
- fecha
- estado del día
- minutos de atraso
- horario aplicado
- cantidad de marcaciones válidas vs esperadas
- observación general
- puntos usados por el motor
- marcaciones crudas del día
- marcaciones sobrantes
- justificativo aplicado
- guardias y reemplazos si existen
- si el día quedó como no descontable

## Puntos mínimos a mostrar

Basado en `resultado_punto`:

- `orden`
- `nombre_punto`
- `codigo_punto`
- `hora_esperada`
- `hora_marcada`
- `tipo_resultado`
- `valor_mostrado`
- `fecha_hora_marcacion`
- `minutos_atraso`
- `minutos_desfase`
- `justificativo_punto`
- `observacion`

## Modal actual

La vista usa un modal amplio para auditoría del día con estos bloques:

- `Resumen`
  - estado
  - justificativo principal visible como badge secundario cuando exista
  - horario aplicado
  - atraso sancionable
  - marcaciones válidas vs esperadas
- `Puntos evaluados`
  - hora esperada
  - hora marcada
  - estado del punto
  - fecha y hora de la marcación
  - desfase en minutos
- `Marcaciones del día`
  - lista cruda de marcaciones usadas por el motor
- `Marcaciones sobrantes`
  - marcaciones no usadas en la clasificación
- `Contexto del cálculo`
  - justificativo
  - guardias
  - reemplazos
  - indicador de no descontable

## Comportamientos importantes

- para registros con `estado_dia = NO_LABORABLE`, la tabla no muestra `Ver detalle`
- el modal de detalle usa apertura y cierre con transición visual tipo `fade`
- el modal de detalle puede cerrarse con la tecla `Esc`
- cuando el día está justificado, la UI muestra el `justificativo_principal` como badge adicional, por ejemplo `VACACION`, `PERMISO` o `COMISION`
- cuando el día corresponde a guardia, la columna `Horario` y el resumen del modal muestran `SEGURIDAD` como texto principal y el turno debajo en badge, por ejemplo `NOCHE`

## Ejemplo visual esperado

- Entrada mañana: `08:34`
- Salida mañana: `COMISION`
- Entrada tarde: `14:00`
- Salida tarde: `18:02`
- Estado día: `PRESENTE`

## Recomendación de UI

Desktop:

- tabla principal
- modal lateral o modal grande para detalle

Mobile:

- cards por día
- detalle en modal full screen
