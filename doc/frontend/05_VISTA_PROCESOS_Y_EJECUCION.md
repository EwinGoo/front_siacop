# Vista: Procesos y Ejecución de Planilla

## Qué hace la vista

Administra los procesos mensuales de cálculo de planilla.

Desde aquí el usuario:

- crea un proceso
- ve procesos existentes
- ejecuta un proceso
- entra a resultados diarios y mensuales

## Rutas sugeridas

- `/apps/planilla-asistencia/procesos`
- `/apps/planilla-asistencia/procesos/:id`

## Endpoints principales

- `GET /api/v1/control-personal/planilla-asistencia/procesos`
- `GET /api/v1/control-personal/planilla-asistencia/procesos/{id}`
- `POST /api/v1/control-personal/planilla-asistencia/procesos`
- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/ejecutar`

## Qué debe mostrar el listado

- `id_proceso`
- `fecha_inicio`
- `fecha_fin`
- `estado_proceso`
- `total_funcionarios`
- `total_marcaciones`
- `total_dias`
- `fecha_inicio_proceso`
- `fecha_fin_proceso`
- `created_at`
- `mensaje_error` si existe

## Qué debe hacer la creación de proceso

Mínimo del formulario:

- `fecha_inicio`
- `fecha_fin`

Si el backend luego expone más campos, se podrán añadir sin romper la base del flujo.

## Qué acciones debe tener cada fila

- `Ver detalle`
- `Ejecutar`
- `Ver resultados diarios`
- `Ver planilla mensual`

## Qué debe mostrar el detalle del proceso

- resumen del proceso
- snapshot o conteos
- fuentes utilizadas
- parámetros del proceso si vienen en respuesta
- mensaje de error si falló

## Estados visibles sugeridos

- `PENDIENTE`
- `PROCESANDO`
- `COMPLETADO`
- `ERROR`

## Recomendación UX

La ejecución no debe esconderse.  
Debe existir un botón claro de `Ejecutar proceso`, con confirmación simple.

## Riesgo conocido

La ejecución sigue siendo síncrona por HTTP.  
Documentar visualmente que en procesos grandes puede tardar.

## Navegación natural después de ejecutar

Si termina bien, mostrar accesos rápidos a:

- resultados diarios
- resultados mensuales
