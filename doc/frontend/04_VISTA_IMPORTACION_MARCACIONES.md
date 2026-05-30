# Vista: Importación de Marcaciones

## Qué hace la vista

Permite subir uno o varios archivos biométricos `.dat` y ver el resultado de importación por archivo.

## Ruta sugerida

- `/apps/planilla-asistencia/importaciones`

## Endpoint principal

- `POST /api/v1/control-personal/planilla-asistencia/importaciones/marcaciones/upload`

## Qué debe mostrar

### Formulario de carga

- selector múltiple de archivos
- ayuda visible indicando que en Postman/backend el campo trabaja como multiarchivo
- botón `Importar`

### Resultado por archivo

- `archivo_origen`
- `estado_importacion`
- `total_lineas_archivo`
- `lineas_validas`
- `lineas_invalidas`
- `raw_insertados`
- `raw_duplicados`
- `normalizados_insertados`
- `normalizados_duplicados`
- `sin_persona_relacionada`
- `duracion_ms`

## Qué acciones permite

- subir 1 archivo
- subir varios archivos
- ver resultado individual por archivo
- pasar a la pantalla de resumen

## Estados importantes

- cargando
- éxito total
- éxito parcial
- error por archivo
- error total del request

## Validaciones mínimas

- no permitir enviar vacío
- advertir si algún archivo no termina en `.dat`
- permitir multiarchivo desde el selector del navegador

## Recomendación de UI

Desktop:

- tabla de resultados por archivo

Mobile:

- cards por archivo con estado destacado

## Mensajes útiles

- `Archivos biométricos procesados correctamente.`
- `Archivo biométrico importado correctamente.`
- `Debe adjuntar al menos un archivo .dat en el campo archivo o archivos.`

## Vista relacionada

Después de esta vista el usuario normalmente debe ir a:

- resumen de importaciones
- creación de proceso
