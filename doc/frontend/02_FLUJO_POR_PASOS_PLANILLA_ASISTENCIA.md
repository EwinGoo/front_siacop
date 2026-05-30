# Flujo Por Pasos: Planilla de Asistencia

## Enfoque recomendado

Para este módulo conviene usar un flujo guiado, no una sola pantalla plana.  
La secuencia ideal para el usuario es:

1. subir archivos `.dat`
2. validar que los archivos importaron bien
3. crear proceso mensual
4. ejecutar proceso
5. revisar resultado diario si hay observaciones
6. revisar planilla mensual consolidada

## Propuesta UX

No hace falta implementar un wizard técnico rígido como componente obligatorio.  
Basta con que la experiencia visual respete pasos claros y visibles.

## Secuencia de vistas

### Paso 1. Importación de marcaciones

El usuario sube uno o varios archivos biométricos.  
El frontend debe mostrar resultado por archivo:

- nombre del archivo
- estado de importación
- líneas válidas
- líneas inválidas
- insertados
- duplicados
- sin persona relacionada
- duración

### Paso 2. Resumen de importaciones

Luego de importar, el usuario debe poder revisar trazabilidad:

- qué archivos entraron
- cuáles fallaron
- cuáles se revirtieron
- cuáles dejaron demasiadas marcaciones sin persona relacionada

### Paso 3. Creación de proceso

Aquí se define el período a calcular y se crea el snapshot del proceso.

Mínimo:

- fecha inicio
- fecha fin
- observación o nombre del proceso si aplica
- usuario creador visible en la lista posterior

### Paso 4. Ejecución del proceso

El usuario elige un proceso creado y lo ejecuta.

La vista debe mostrar:

- estado actual
- fecha inicio de ejecución
- fecha fin si terminó
- total de funcionarios
- total de días
- total de marcaciones
- mensaje de error si hubo fallo

### Paso 5. Resultados diarios

Aquí se revisan incidencias por persona y día.  
Esta vista sirve para auditoría y revisión fina.

### Paso 6. Resultado mensual consolidado

Aquí se muestra la planilla final para presentación, revisión o exportación.

## Recomendación de navegación

La navegación sugerida dentro del módulo:

- `Importaciones`
- `Procesos`
- `Resultados diarios`
- `Planilla mensual`

Y dentro de `Procesos`, acciones:

- `Crear proceso`
- `Ejecutar`
- `Ver detalle`
- `Ver resultados diarios`
- `Ver planilla mensual`

## Qué conviene tener listo para tu presentación

Si el tiempo es corto, el mínimo presentable es:

1. pantalla de importación multiarchivo
2. pantalla de procesos
3. acción de ejecutar proceso
4. tabla de resultados mensuales
5. modal o vista de detalle diario

Con eso ya muestras el flujo principal completo del motor.
