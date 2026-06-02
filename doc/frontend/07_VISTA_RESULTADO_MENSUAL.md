# Vista: Resultado Mensual Consolidado

## Qué hace la vista

Es la vista final de planilla.  
Debe mostrar el consolidado mensual por persona y servir como base de revisión y posterior exportación.

## Ruta sugerida

- `/apps/planilla-asistencia/procesos/:id/resultados-mensuales`

## Endpoints

- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados-mensuales`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados-mensuales/persona/{idPersona}`
- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados-mensuales/reporte-general`

## Campos mínimos obligatorios

Tomados de la estructura del motor:

- `nombre_completo`
- `ci`
- `cargo`
- `total_minutos_atraso_calculados`
- `tolerancia_mensual_minutos`
- `total_minutos_atraso_oficiales`
- `total_dias_sancion_calculados`
- `total_dias_sancion_oficiales`
- `total_faltas`
- `total_abandonos`
- `total_permisos`
- `total_comisiones`
- `total_vacaciones`
- `total_feriados`
- `total_asuetos`
- `es_no_descontable`
- `motivo_no_descuento`

## Qué debe permitir

- búsqueda por persona
- acceso a detalle mensual por persona
- acceso rápido al diario de una persona
- generación de reporte PDF mensual en modal
- filtrar el reporte PDF por:
  - todos los registros
  - solo con atraso oficial
  - solo con días de sanción
  - con atraso o sanción

## Detalle mensual por persona

Debe mostrar:

- resumen de minutos
- resumen de sanciones
- faltas
- abandonos
- permisos
- comisiones
- vacaciones
- feriados
- asuetos
- bandera de no descontable
- motivo de no descuento

## Qué es importante explicar en la UI

- `minutos calculados` no es lo mismo que `minutos oficiales`
- existe tolerancia mensual
- `días sanción calculados` no es lo mismo que `días sanción oficiales`

## Vista principal para presentación

Si solo mostraras una pantalla final del motor, debería ser esta.

## Reporte PDF mensual

La vista ahora incorpora un flujo de reporte PDF con modal, siguiendo el patrón usado en permisos y comisiones.

### Qué muestra el PDF

- `Nro`
- `CI`
- `Nombre completo`
- `Días asistidos`
- `Días falta`
- `Minutos atraso oficial`
- `Días sanción`

### Qué filtros permite

- `Todos los registros`
- `Solo con atraso oficial`
- `Solo con días de sanción`
- `Con atraso o sanción`
- búsqueda opcional por nombre o CI

### Qué datos toma

- el proceso seleccionado en la vista
- el rango del proceso (`fecha_inicio` y `fecha_fin`)
- los resultados mensuales consolidados ya generados por el motor

## Recomendación visual

Desktop:

- tabla ancha con columnas fijas al inicio

Mobile:

- cards por persona con resumen compacto
- detalle ampliado en modal

## Enlace con el documento del motor

Esta pantalla debe respetar la lógica descrita en:

- `C:\Users\az232\Desktop\siacop\server\doc\documentacion_motor_planilla_asistencia_v_1.md`

porque ahí están definidos los datos finales que el reporte debe exponer.
