# Pantallas Completas: Planilla de Asistencia

## Resumen

Estas son las pantallas que deberían existir para considerar el frontend del módulo como completo en su primera versión funcional.

## Grupo 1. Importaciones

### 1. Importación de marcaciones

- ruta sugerida: `/apps/planilla-asistencia/importaciones`
- objetivo: subir uno o varios archivos `.dat`
- prioridad: alta

### 2. Historial o resumen de importaciones

- ruta sugerida: `/apps/planilla-asistencia/importaciones/resumen`
- objetivo: ver trazabilidad por archivo
- prioridad: alta

### 3. Consulta de marcaciones crudas

- ruta sugerida: `/apps/planilla-asistencia/importaciones/raw`
- objetivo: auditoría técnica
- prioridad: media

### 4. Consulta de marcaciones normalizadas

- ruta sugerida: `/apps/planilla-asistencia/importaciones/normalizadas`
- objetivo: revisar relación persona-marcación y duplicados
- prioridad: media

## Grupo 2. Procesos

### 5. Listado de procesos

- ruta sugerida: `/apps/planilla-asistencia/procesos`
- objetivo: ver procesos creados y su estado
- prioridad: alta

### 6. Crear proceso

- puede ser modal o vista
- objetivo: crear el snapshot del período
- prioridad: alta

### 7. Detalle de proceso

- ruta sugerida: `/apps/planilla-asistencia/procesos/:id`
- objetivo: ver resumen del proceso y sus fuentes
- prioridad: media

## Grupo 3. Resultados

### 8. Resultados diarios por proceso

- ruta sugerida: `/apps/planilla-asistencia/procesos/:id/resultados-diarios`
- objetivo: auditoría diaria
- prioridad: alta

### 9. Detalle diario por persona y fecha

- modal o drawer
- objetivo: ver puntos de marcado usados en un día
- prioridad: alta

### 10. Resultados mensuales por proceso

- ruta sugerida: `/apps/planilla-asistencia/procesos/:id/resultados-mensuales`
- objetivo: mostrar la planilla consolidada final
- prioridad: alta

### 11. Detalle mensual por persona

- modal o vista secundaria
- objetivo: ver resumen mensual de una persona con enlace al diario
- prioridad: media

## Pantallas mínimas para cerrar versión 1

Si necesitas cerrar rápido el módulo para uso real inicial, estas son las obligatorias:

1. Importación de marcaciones
2. Resumen de importaciones
3. Listado de procesos
4. Crear proceso
5. Ejecutar proceso
6. Resultados diarios
7. Detalle diario
8. Resultados mensuales

## Pantallas diferibles

Estas se pueden dejar para una segunda tanda:

- vista de marcaciones crudas
- vista de marcaciones normalizadas
- detalle extendido de proceso
- exportaciones avanzadas
- dashboard de rendimiento

## Estructura sugerida en `src`

```txt
src/app/modules/apps/control-personal/planilla-asistencia/
  PlanillaAsistenciaPage.tsx
  importaciones/
  procesos/
  resultados-diarios/
  resultados-mensuales/
  core/
```

## Permisos frontend sugeridos

Todavía no existen en `permissions.ts`, pero conviene reservar algo así:

```ts
PLANILLA_ASISTENCIA: {
  VIEW: 'planilla_asistencia.view',
  IMPORT: 'planilla_asistencia.import',
  CREATE_PROCESS: 'planilla_asistencia.create_process',
  EXECUTE_PROCESS: 'planilla_asistencia.execute_process',
  REVIEW: 'planilla_asistencia.review',
}
```
