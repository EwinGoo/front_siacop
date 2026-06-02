# Índice Frontend: Planilla de Asistencia

## Objetivo

Este bloque documenta el frontend React necesario para completar el módulo de planilla de asistencia usando el motor ya implementado en `server/`.

La idea es construir el frontend en el mismo orden operativo en el que el usuario trabaja:

1. importar archivos biométricos
2. revisar trazabilidad de importación
3. crear proceso de planilla
4. ejecutar proceso
5. revisar resultados diarios
6. revisar planilla mensual consolidada
7. revisar consolidado de bono refrigerio

## Orden sugerido de construcción

1. [02_FLUJO_POR_PASOS_PLANILLA_ASISTENCIA.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/02_FLUJO_POR_PASOS_PLANILLA_ASISTENCIA.md)
2. [03_PANTALLAS_COMPLETAS_PLANILLA_ASISTENCIA.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/03_PANTALLAS_COMPLETAS_PLANILLA_ASISTENCIA.md)
3. [04_VISTA_IMPORTACION_MARCACIONES.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/04_VISTA_IMPORTACION_MARCACIONES.md)
4. [05_VISTA_PROCESOS_Y_EJECUCION.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/05_VISTA_PROCESOS_Y_EJECUCION.md)
5. [06_VISTA_RESULTADO_DIARIO.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/06_VISTA_RESULTADO_DIARIO.md)
6. [07_VISTA_RESULTADO_MENSUAL.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/07_VISTA_RESULTADO_MENSUAL.md)
7. [09_VISTA_BONO_REFRIGERIO.md](/C:/Users/az232/Desktop/siacop/client/doc/frontend/09_VISTA_BONO_REFRIGERIO.md)

## Pantallas mínimas para demo funcional

- Vista de importación de marcaciones
- Vista de resumen y trazabilidad de importaciones
- Vista de procesos de planilla
- Vista de creación de proceso
- Vista de ejecución de proceso
- Vista de resultados diarios por proceso
- Vista de detalle diario por persona y fecha
- Vista de resultados mensuales por proceso
- Vista de detalle mensual por persona
- Vista de bono refrigerio por proceso
- Vista de detalle diario de bono por persona

## Dependencias funcionales ya existentes en frontend

Estas áreas ya existen y alimentan el motor:

- permisos
- comisiones
- declaratoria de comisión
- feriados y asuetos
- vacaciones
- guardias de seguridad
- asignaciones administrativas

## Dependencias backend del módulo

Rutas base ya disponibles:

- `POST /api/v1/control-personal/planilla-asistencia/importaciones/marcaciones/upload`
- `GET /api/v1/control-personal/planilla-asistencia/importaciones/marcaciones/raw`
- `GET /api/v1/control-personal/planilla-asistencia/importaciones/marcaciones/normalizadas`
- `GET /api/v1/control-personal/planilla-asistencia/importaciones/marcaciones/resumen`
- `GET /api/v1/control-personal/planilla-asistencia/procesos`
- `POST /api/v1/control-personal/planilla-asistencia/procesos`
- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/ejecutar`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados/persona/{idPersona}?fecha=YYYY-MM-DD`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados-mensuales`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/resultados-mensuales/persona/{idPersona}`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio/persona/{idPersona}`
- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/bono-refrigerio/reporte-general`
