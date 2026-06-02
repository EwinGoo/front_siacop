# Figura 3.20. Diagrama de actividad del cálculo diario de asistencia

Esta guía define el contenido recomendado para la figura:

`Figura 3.20. Diagrama de actividad del cálculo diario de asistencia`

La figura debe representar el flujo de actividades que ejecuta el motor de asistencia
para calcular el resultado diario de cada funcionario dentro de un proceso de planilla.

## 1. Objetivo de la figura

La figura debe permitir comprender:

- cómo inicia el cálculo diario dentro de un proceso de asistencia
- qué datos son precargados antes del cálculo
- cómo se evalúa a cada persona para cada fecha
- cómo se resuelven horarios, guardias, justificativos y marcaciones
- cómo se determina el estado final del día
- cómo se almacenan los resultados diarios y sus puntos de control

## 2. Alcance del diagrama

El diagrama no debe representar toda la generación mensual completa, sino el flujo
específico del cálculo diario que se aplica para cada combinación:

- `persona`
- `fecha`

Es decir, dentro de un proceso general, el motor recorre todas las personas del snapshot
y todas las fechas del rango definido, calculando el resultado diario para cada caso.

## 3. Punto de inicio del proceso

El flujo inicia cuando ya existe un `proceso de asistencia` creado y el sistema procede
a ejecutar el cálculo diario.

Antes del cálculo por día, el motor realiza una preparación inicial:

- marca el proceso como `PROCESANDO`
- obtiene el snapshot de personas del proceso
- precarga configuraciones y fuentes auxiliares
- limpia resultados diarios previos del mismo proceso

Por lo tanto, en el diagrama conviene comenzar con una actividad como:

- `Iniciar ejecución del proceso de asistencia`

y luego:

- `Precargar datos necesarios del proceso`

## 4. Datos precargados que intervienen en el flujo

En la actividad de precarga conviene mencionar que el sistema carga:

- parámetros del motor de asistencia
- puntos esperados por tipo de horario
- días laborables por tipo de horario
- tipos no descontables
- horarios base
- horarios alternos
- guardias asignadas
- reemplazos de guardias
- marcaciones biométricas
- permisos aprobados
- comisiones aprobadas
- declaratorias vigentes
- feriados y asuetos
- vacaciones aprobadas

No es necesario dibujar cada fuente como caja independiente, pero sí conviene agruparlas
como una actividad de carga de contexto.

## 5. Estructura general del flujo

El diagrama debe reflejar esta lógica general:

1. Iniciar proceso.
2. Precargar datos del rango.
3. Recorrer cada persona del snapshot.
4. Recorrer cada fecha del rango.
5. Resolver contexto del día.
6. Resolver justificativo del día.
7. Obtener marcaciones del día.
8. Evaluar si el día es laborable o no.
9. Evaluar si existen puntos esperados.
10. Clasificar marcaciones contra puntos esperados.
11. Aplicar justificativos sobre puntos faltantes.
12. Determinar estado diario.
13. Construir resultado diario.
14. Acumular resultados en lote.
15. Persistir resultados y puntos.
16. Finalizar cálculo.

## 6. Actividades principales que deben aparecer

## 6.1. Iniciar ejecución

Actividad sugerida:

- `Iniciar cálculo diario del proceso`

## 6.2. Eliminar resultados previos

Antes de recalcular, el sistema elimina resultados previos del mismo proceso.

Actividad sugerida:

- `Eliminar resultados diarios anteriores del proceso`

## 6.3. Inicializar resumen y rango de fechas

Actividad sugerida:

- `Inicializar resumen del proceso`
- `Generar rango de fechas del proceso`

## 6.4. Iterar personas

Actividad sugerida:

- `Recorrer personas del snapshot`

## 6.5. Iterar fechas

Actividad sugerida:

- `Recorrer fechas del proceso`

## 6.6. Resolver contexto del día

Esta actividad debe agrupar:

- identificación del tipo de horario
- verificación de día laborable
- carga de guardias del día
- resolución de horario real
- construcción de puntos esperados

Actividad sugerida:

- `Resolver contexto horario del día`

## 6.7. Resolver justificativo

El sistema verifica si el día está cubierto por:

- feriado
- asueto
- vacación
- declaratoria en comisión
- boleta de comisión
- permiso

Actividad sugerida:

- `Resolver justificativo del día`

## 6.8. Obtener marcaciones del día

El sistema recupera marcaciones:

- de la persona titular
- del día actual
- del día siguiente si el horario cruza medianoche
- de reemplazos de guardia cuando corresponde

Actividad sugerida:

- `Obtener marcaciones válidas del día`

## 6.9. Decisión: ¿el día es no laborable por justificativo?

Primera decisión importante:

- si existe feriado o asueto aplicable, el resultado se clasifica como `NO_LABORABLE`

Nodo de decisión sugerido:

- `¿Existe justificativo no laborable?`

Si `Sí`:

- `Registrar resultado NO_LABORABLE`

Si `No`:

- continuar con la evaluación del contexto laboral

## 6.10. Decisión: ¿el día es laborable?

Segunda decisión importante:

- si el contexto indica que no es laborable, el día se registra como `NO_LABORABLE`

Nodo de decisión sugerido:

- `¿El día es laborable según el horario o guardia?`

Si `No`:

- `Registrar resultado NO_LABORABLE`

Si `Sí`:

- continuar con la evaluación de puntos

## 6.11. Decisión: ¿existen puntos esperados?

Si no existen puntos configurados para el tipo de horario o el día:

- el estado se clasifica como `SIN_HORARIO`

Nodo de decisión sugerido:

- `¿Existen puntos esperados para el día?`

Si `No`:

- `Registrar resultado SIN_HORARIO`

Si `Sí`:

- continuar con la clasificación

## 6.12. Clasificar marcaciones

Aquí el sistema compara:

- puntos esperados
- marcaciones disponibles
- tolerancia diaria
- ventanas de clasificación
- márgenes nocturnos

Actividad sugerida:

- `Clasificar marcaciones contra puntos esperados`

## 6.13. Aplicar justificativos sobre puntos faltantes

Después de clasificar, el sistema revisa si los puntos sin marcación pueden ser
justificados por:

- permiso
- comisión
- declaratoria
- vacación

Actividad sugerida:

- `Aplicar justificativo sobre puntos faltantes`

## 6.14. Determinar estado diario

Con base en la cobertura, el sistema resuelve el estado final del día.

Los estados posibles más importantes son:

- `NO_LABORABLE`
- `SIN_HORARIO`
- `JUSTIFICADO`
- `FALTA`
- `ABANDONO`
- `ATRASO`
- `OBSERVADO`
- `PRESENTE`

Actividad sugerida:

- `Determinar estado diario`

## 6.15. Construir resultado diario

En esta actividad se generan los datos persistibles:

- id de proceso
- persona
- asignación administrativa
- horario tipo
- fecha
- cantidad de marcaciones esperadas
- cantidad de marcaciones válidas
- minutos de atraso
- días de descuento
- estado diario
- justificativo principal
- observación
- detalle JSON
- puntos calculados

Actividad sugerida:

- `Construir resultado diario`

## 6.16. Agregar a lote

El sistema no guarda cada fila inmediatamente, sino que acumula resultados en lotes.

Actividad sugerida:

- `Agregar resultado al lote`

## 6.17. Decisión: ¿se alcanzó el tamaño de lote?

Nodo de decisión sugerido:

- `¿El lote alcanzó el tamaño configurado?`

Si `Sí`:

- `Persistir lote de resultados diarios`
- `Persistir puntos de marcación`

Si `No`:

- continuar con la siguiente fecha

## 6.18. Persistencia final

Al terminar de recorrer personas y fechas:

- si quedan resultados pendientes, se persisten

Actividad sugerida:

- `Persistir lote final`

## 6.19. Actualizar resumen del proceso

El cálculo acumula métricas como:

- total de funcionarios
- total de días evaluados
- total de resultados diarios
- total de observados
- total de justificados
- tiempos de cálculo
- total de puntos generados

Actividad sugerida:

- `Actualizar resumen y métricas del proceso`

## 6.20. Finalizar ejecución

Actividad sugerida:

- `Finalizar cálculo diario`

## 7. Decisiones clave que deben verse claramente

Las decisiones más importantes del diagrama son:

- `¿Existe justificativo no laborable?`
- `¿El día es laborable?`
- `¿Existen puntos esperados?`
- `¿Hay cobertura completa con justificativo?`
- `¿No existen marcaciones válidas?`
- `¿La cobertura es parcial?`
- `¿Existe atraso?`
- `¿Se alcanzó el tamaño del lote?`

No es necesario poner todas como rombos separados si el diagrama se hace muy pesado,
pero sí deben reflejarse las principales ramas de decisión.

## 8. Estados que puede producir el cálculo diario

Conviene añadir una nota o bloque lateral con los estados posibles:

- `NO_LABORABLE`
- `SIN_HORARIO`
- `JUSTIFICADO`
- `FALTA`
- `ABANDONO`
- `ATRASO`
- `OBSERVADO`
- `PRESENTE`

Esto ayuda mucho a explicar la salida del flujo.

## 9. Versión resumida del flujo lista para dibujar

Puedes usar esta secuencia base:

```text
Inicio
  |
  v
Iniciar cálculo diario del proceso
  |
  v
Precargar datos del proceso
  |
  v
Eliminar resultados diarios anteriores
  |
  v
Inicializar resumen y rango de fechas
  |
  v
Recorrer personas del snapshot
  |
  v
Recorrer fechas del proceso
  |
  v
Resolver contexto horario del día
  |
  v
Resolver justificativo del día
  |
  v
Obtener marcaciones válidas del día
  |
  v
¿Existe justificativo no laborable?
  |-- Sí --> Registrar resultado NO_LABORABLE
  |-- No --> ¿El día es laborable?
                |-- No --> Registrar resultado NO_LABORABLE
                |-- Sí --> ¿Existen puntos esperados?
                              |-- No --> Registrar resultado SIN_HORARIO
                              |-- Sí --> Clasificar marcaciones
                                            |
                                            v
                                      Aplicar justificativos
                                            |
                                            v
                                      Determinar estado diario
                                            |
                                            v
                                      Construir resultado diario
                                            |
                                            v
                                      Agregar resultado al lote
                                            |
                                            v
                                      ¿Lote completo?
                                            |-- Sí --> Persistir resultados y puntos
                                            |-- No --> Continuar
  |
  v
¿Quedan fechas?
  |-- Sí --> Repetir
  |-- No --> ¿Quedan personas?
                |-- Sí --> Repetir
                |-- No --> Persistir lote final
                              |
                              v
                        Actualizar resumen del proceso
                              |
                              v
                            Fin
```

## 10. Recomendación visual para el diagrama

Para que la figura se vea profesional, puedes dividirla en tres zonas:

### Zona 1. Preparación

- inicio
- precarga
- limpieza
- inicialización

### Zona 2. Cálculo por persona y fecha

- contexto
- justificativos
- marcaciones
- decisiones
- clasificación
- construcción del resultado

### Zona 3. Persistencia y cierre

- almacenamiento por lotes
- persistencia final
- actualización del resumen
- fin

## 11. Qué no conviene hacer en esta figura

No conviene:

- meter el detalle de todas las consultas SQL
- mostrar todas las métricas técnicas
- mezclar este diagrama con el cálculo mensual
- convertirlo en diagrama de secuencia

Esta figura debe ser un `diagrama de actividad`, centrado en el flujo lógico del cálculo.

## 12. Recomendación final para tu tesis

La figura debe demostrar que el cálculo diario no depende solo de marcaciones, sino de
una evaluación integral de:

- horario asignado
- guardias
- reemplazos
- feriados
- vacaciones
- comisiones
- permisos
- justificativos
- tolerancias

Eso fortalece mucho la explicación metodológica y funcional del módulo de planilla de
asistencia.

## 13. Archivos sugeridos para este directorio

Se recomienda guardar aquí:

- `figura_3_20_actividad_calculo_diario.drawio`
- `figura_3_20_actividad_calculo_diario.png`
- `figura_3_20_actividad_calculo_diario.svg`
- `figura_3_20_actividad_calculo_diario_borrador.md`
