# Vista Frontend: Bono Refrigerio

## Qué hace la vista

La vista `Bono Refrigerio` consolida por proceso mensual los días que sí son pagables para bono, los días excluidos y los días no válidos, tomando como base los resultados diarios ya generados por el motor de planilla de asistencia.

Su propósito es dar una lectura operativa más simple del beneficio: día trabajado, día pagable; permiso y vacación no computan; comisión y declaratoria de comisión sí convalidan el día.

## Qué datos muestra

La tabla principal muestra por persona:

- nombre completo
- CI o código biométrico
- cargo
- días pagables
- días excluidos
- días no válidos
- minutos de atraso oficial
- días de sanción
- estado general del bono

La sección de detalle muestra por día:

- fecha
- estado del día en asistencia
- estado del día para bono
- tipo de horario
- marcaciones válidas frente a marcaciones esperadas
- justificativo principal
- motivo de clasificación

## Qué acciones permite

- seleccionar un proceso ejecutado
- buscar por nombre o CI
- listar consolidado de bono refrigerio
- ver detalle diario por persona
- generar reporte PDF

## Qué endpoint consume

- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio/persona/{idPersona}`
- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio/reporte-general`

Además reutiliza:

- `GET /api/v1/control-personal/planilla-asistencia/procesos`

## Qué estados o validaciones importantes tiene

- si no hay proceso seleccionado, la vista muestra estado vacío y no intenta consultar
- el reporte PDF exige un proceso válido
- la clasificación del bono deriva del resultado diario:
  - `PRESENTE` y `ATRASO` cuentan como `VALIDO`
  - `COMISION` y `DECLARATORIA_COMISION` cuentan como `VALIDO`
  - `VACACION`, `PERMISO` y `NO_LABORABLE` quedan como `EXCLUIDO`
  - `FALTA` y `ABANDONO` quedan como `NO_VALIDO`
  - `OBSERVADO` y `SIN_HORARIO` quedan como `OBSERVADO`

## Observaciones funcionales

- el módulo persiste resultados propios en tablas diaria y mensual de bono refrigerio
- el cálculo se ejecuta como parte del proceso mensual de asistencia
- la vista ya no depende de recalcular todo al vuelo para listar, detallar o exportar
