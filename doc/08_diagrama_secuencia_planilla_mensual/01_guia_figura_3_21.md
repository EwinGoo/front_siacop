# Figura 3.21. Diagrama de secuencia del proceso mensual de planilla

Esta guía define el contenido recomendado para la figura:

`Figura 3.21. Diagrama de secuencia del proceso mensual de planilla`

La figura debe representar la interacción temporal entre los componentes principales
que intervienen en la ejecución del proceso mensual de planilla de asistencia.

## 1. Objetivo de la figura

La figura debe permitir comprender:

- qué actor inicia el proceso mensual
- qué controlador recibe la solicitud
- qué servicios coordinan la ejecución del proceso
- cómo se obtiene el proceso y el snapshot de personas
- cómo se realiza la precarga de datos
- cómo se ejecuta el cálculo diario
- cómo se consolida el resultado mensual
- cómo se actualiza el estado final del proceso

## 2. Alcance del diagrama

Esta figura debe enfocarse en la ejecución mensual de planilla, es decir, en el flujo que
comienza cuando se invoca la operación:

- `POST /api/v1/control-personal/planilla-asistencia/procesos/{id}/ejecutar`

No debe mostrar el detalle interno exhaustivo del cálculo diario punto por punto, porque
eso ya corresponde a la `Figura 3.20`. Aquí interesa la colaboración entre componentes.

## 3. Participantes que deben aparecer

Se recomienda que el diagrama de secuencia muestre los siguientes participantes:

1. `Usuario / Planillero`
2. `Frontend React`
3. `AsistenciaProcesoController`
4. `GeneradorPlanillaAsistenciaService`
5. `AsistenciaProcesoService`
6. `PrecargaAsistenciaService`
7. `CalculadorDiarioService`
8. `ConsolidadorMensualService`
9. `BaseUpeaService`
10. `ApiBaseUpea`
11. `Base de datos SIACOP`

## 4. Rol de cada participante

### 4.1. `Usuario / Planillero`

Es el actor que inicia la ejecución del proceso mensual desde la interfaz del sistema.

### 4.2. `Frontend React`

Envía la solicitud al backend y recibe la respuesta final del proceso ejecutado.

### 4.3. `AsistenciaProcesoController`

Recibe la petición HTTP, valida el identificador del proceso y delega la ejecución al
servicio generador.

### 4.4. `GeneradorPlanillaAsistenciaService`

Coordina todo el proceso mensual. Es el orquestador principal del flujo.

### 4.5. `AsistenciaProcesoService`

Se encarga de:

- obtener el proceso y su detalle
- marcar el proceso como `PROCESANDO`
- marcarlo como `FINALIZADO`
- marcarlo como `ERROR` cuando ocurre una excepción

### 4.6. `PrecargaAsistenciaService`

Obtiene y agrupa la información base necesaria para el cálculo:

- parámetros
- horarios
- marcaciones
- permisos
- comisiones
- declaratorias
- vacaciones
- feriados
- guardias
- reemplazos

### 4.7. `CalculadorDiarioService`

Ejecuta el cálculo diario para cada persona y cada fecha del rango.

### 4.8. `ConsolidadorMensualService`

Toma los resultados diarios y genera la consolidación mensual final por persona.

### 4.9. `BaseUpeaService`

Es el cliente HTTP que usa `ApiSiacop` para obtener información institucional externa.

### 4.10. `ApiBaseUpea`

Expone los datos institucionales consumidos por el proceso mensual.

### 4.11. `Base de datos SIACOP`

Representa la persistencia local del proceso, snapshots, marcaciones, resultados diarios
y resultados mensuales.

## 5. Flujo general que debe mostrarse

El flujo principal del diagrama es este:

1. El usuario ejecuta el proceso mensual desde el frontend.
2. El frontend invoca el endpoint de ejecución del proceso.
3. El controlador delega la ejecución al generador.
4. El generador consulta el detalle del proceso.
5. El generador valida que el proceso exista y tenga personas.
6. El generador marca el proceso como `PROCESANDO`.
7. El generador solicita la precarga de datos.
8. La precarga consulta datos locales y datos institucionales.
9. El generador invoca el cálculo diario.
10. El cálculo diario persiste resultados diarios.
11. El generador invoca la consolidación mensual.
12. La consolidación mensual persiste resultados mensuales.
13. El generador construye el resumen final.
14. El proceso se marca como `FINALIZADO`.
15. El controlador devuelve la respuesta final al frontend.

## 6. Mensajes principales que deberían aparecer

## 6.1. Inicio desde el frontend

Mensajes sugeridos:

- `Usuario -> Frontend React: Ejecutar proceso mensual`
- `Frontend React -> AsistenciaProcesoController: POST /procesos/{id}/ejecutar`

## 6.2. Delegación al generador

Mensajes sugeridos:

- `AsistenciaProcesoController -> GeneradorPlanillaAsistenciaService: ejecutarProceso(idProceso)`

## 6.3. Recuperación del proceso

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: obtenerDetalle(idProceso)`
- `AsistenciaProcesoService -> Base de datos SIACOP: consultar proceso + snapshot + fuentes`
- `Base de datos SIACOP --> AsistenciaProcesoService: detalle del proceso`
- `AsistenciaProcesoService --> GeneradorPlanillaAsistenciaService: proceso`

## 6.4. Validación del proceso

Aquí conviene una condición:

- `alt proceso no existe o no tiene personas`
  - lanzar error
- `else`
  - continuar

## 6.5. Cambio de estado a PROCESANDO

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: marcarProcesoComoProcesando(idProceso)`
- `AsistenciaProcesoService -> Base de datos SIACOP: actualizar estado_proceso = PROCESANDO`

## 6.6. Precarga de información

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService -> PrecargaAsistenciaService: cargar(proceso, personas)`

Dentro de la precarga conviene mostrar llamadas resumidas:

- `PrecargaAsistenciaService -> Base de datos SIACOP: cargar parámetros, horarios, alternos, marcaciones, guardias, reemplazos, permisos, comisiones, declaratorias, feriados`
- `PrecargaAsistenciaService -> BaseUpeaService: obtener vacaciones / datos institucionales`
- `BaseUpeaService -> ApiBaseUpea: solicitud HTTP`
- `ApiBaseUpea --> BaseUpeaService: respuesta institucional`
- `BaseUpeaService --> PrecargaAsistenciaService: datos institucionales`
- `PrecargaAsistenciaService --> GeneradorPlanillaAsistenciaService: precarga`

## 6.7. Cálculo diario

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService -> CalculadorDiarioService: ejecutar(proceso, personas, precarga)`
- `CalculadorDiarioService -> Base de datos SIACOP: eliminar resultados diarios previos`
- `loop por cada persona`
  - `loop por cada fecha del rango`
    - `CalculadorDiarioService: resolver contexto`
    - `CalculadorDiarioService: resolver justificativo`
    - `CalculadorDiarioService: clasificar marcaciones`
    - `CalculadorDiarioService: construir resultado diario`
  - `end`
- `end`
- `CalculadorDiarioService -> Base de datos SIACOP: insertar resultados diarios`
- `CalculadorDiarioService -> Base de datos SIACOP: insertar puntos de resultado`
- `CalculadorDiarioService --> GeneradorPlanillaAsistenciaService: resumenDiario`

Aquí no hace falta abrir todo el detalle del cálculo; basta con resumir el bloque.

## 6.8. Consolidación mensual

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService -> ConsolidadorMensualService: consolidar(proceso, personas, precarga)`
- `ConsolidadorMensualService -> Base de datos SIACOP: eliminar resultados mensuales previos`
- `ConsolidadorMensualService -> Base de datos SIACOP: consultar resultados diarios`
- `loop por cada persona`
  - `ConsolidadorMensualService: consolidar estados diarios`
  - `ConsolidadorMensualService: calcular faltas, atrasos, abandonos, justificados`
  - `ConsolidadorMensualService: construir resultado mensual`
- `end`
- `ConsolidadorMensualService -> Base de datos SIACOP: insertar resultados mensuales`
- `ConsolidadorMensualService --> GeneradorPlanillaAsistenciaService: resumenMensual`

## 6.9. Finalización del proceso

Mensajes sugeridos:

- `GeneradorPlanillaAsistenciaService: combinar resumenDiario + resumenMensual + métricas`
- `GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: marcarProcesoComoFinalizado(idProceso, resumen)`
- `AsistenciaProcesoService -> Base de datos SIACOP: actualizar estado_proceso = FINALIZADO`
- `GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: obtenerDetalle(idProceso)`
- `AsistenciaProcesoService -> Base de datos SIACOP: consultar proceso final`
- `AsistenciaProcesoService --> GeneradorPlanillaAsistenciaService: proceso final`
- `GeneradorPlanillaAsistenciaService --> AsistenciaProcesoController: proceso ejecutado`
- `AsistenciaProcesoController --> Frontend React: respuesta exitosa`
- `Frontend React --> Usuario: proceso mensual finalizado`

## 7. Flujo alterno de error que conviene representar

Es importante que el diagrama tenga al menos una rama `alt` de error.

### Caso sugerido: error durante ejecución

Si ocurre una excepción en precarga, cálculo diario o consolidación:

- `GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: marcarProcesoComoError(idProceso, mensaje)`
- `AsistenciaProcesoService -> Base de datos SIACOP: actualizar estado_proceso = ERROR`
- `GeneradorPlanillaAsistenciaService --> AsistenciaProcesoController: excepción`
- `AsistenciaProcesoController --> Frontend React: respuesta de error`

Esto muestra robustez del proceso y control de estados.

## 8. Relación con ApiBaseUpea

En este diagrama sí conviene que aparezca `ApiBaseUpea`, porque el proceso mensual usa
datos institucionales durante la precarga, principalmente para:

- vacaciones aprobadas
- asignaciones administrativas
- datos de apoyo institucional cuando corresponda

No hace falta dibujar todos los endpoints, pero sí la dependencia entre:

- `PrecargaAsistenciaService`
- `BaseUpeaService`
- `ApiBaseUpea`

## 9. Versión resumida lista para dibujar

Puedes usar esta secuencia base:

```text
Usuario/Planillero -> Frontend React: ejecutar proceso mensual
Frontend React -> AsistenciaProcesoController: POST /procesos/{id}/ejecutar
AsistenciaProcesoController -> GeneradorPlanillaAsistenciaService: ejecutarProceso(idProceso)

GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: obtenerDetalle(idProceso)
AsistenciaProcesoService -> Base de datos SIACOP: consultar proceso + personas
Base de datos SIACOP --> AsistenciaProcesoService: proceso
AsistenciaProcesoService --> GeneradorPlanillaAsistenciaService: proceso

alt proceso inválido
    GeneradorPlanillaAsistenciaService --> AsistenciaProcesoController: error
else proceso válido
    GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: marcarProcesoComoProcesando(idProceso)
    AsistenciaProcesoService -> Base de datos SIACOP: actualizar estado PROCESANDO

    GeneradorPlanillaAsistenciaService -> PrecargaAsistenciaService: cargar(proceso, personas)
    PrecargaAsistenciaService -> Base de datos SIACOP: cargar datos locales
    PrecargaAsistenciaService -> BaseUpeaService: obtener datos institucionales
    BaseUpeaService -> ApiBaseUpea: solicitud HTTP
    ApiBaseUpea --> BaseUpeaService: respuesta
    BaseUpeaService --> PrecargaAsistenciaService: datos institucionales
    PrecargaAsistenciaService --> GeneradorPlanillaAsistenciaService: precarga

    GeneradorPlanillaAsistenciaService -> CalculadorDiarioService: ejecutar(proceso, personas, precarga)
    CalculadorDiarioService -> Base de datos SIACOP: eliminar resultados diarios previos
    loop personas y fechas
        CalculadorDiarioService: calcular resultado diario
    end
    CalculadorDiarioService -> Base de datos SIACOP: guardar resultados diarios y puntos
    CalculadorDiarioService --> GeneradorPlanillaAsistenciaService: resumenDiario

    GeneradorPlanillaAsistenciaService -> ConsolidadorMensualService: consolidar(proceso, personas, precarga)
    ConsolidadorMensualService -> Base de datos SIACOP: eliminar resultados mensuales previos
    ConsolidadorMensualService -> Base de datos SIACOP: leer resultados diarios
    loop personas
        ConsolidadorMensualService: consolidar resultado mensual
    end
    ConsolidadorMensualService -> Base de datos SIACOP: guardar resultados mensuales
    ConsolidadorMensualService --> GeneradorPlanillaAsistenciaService: resumenMensual

    GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: marcarProcesoComoFinalizado(idProceso, resumen)
    AsistenciaProcesoService -> Base de datos SIACOP: actualizar estado FINALIZADO
    GeneradorPlanillaAsistenciaService -> AsistenciaProcesoService: obtenerDetalle(idProceso)
    AsistenciaProcesoService -> Base de datos SIACOP: consultar proceso final
    AsistenciaProcesoService --> GeneradorPlanillaAsistenciaService: proceso final
    GeneradorPlanillaAsistenciaService --> AsistenciaProcesoController: proceso finalizado
    AsistenciaProcesoController --> Frontend React: respuesta exitosa
end
```

## 10. Recomendación visual para el diagrama

Para que se vea claro y académico, ordena los participantes de izquierda a derecha así:

1. `Usuario / Planillero`
2. `Frontend React`
3. `AsistenciaProcesoController`
4. `GeneradorPlanillaAsistenciaService`
5. `AsistenciaProcesoService`
6. `PrecargaAsistenciaService`
7. `CalculadorDiarioService`
8. `ConsolidadorMensualService`
9. `BaseUpeaService`
10. `ApiBaseUpea`
11. `Base de datos SIACOP`

Si el diagrama se ve demasiado ancho, puedes fusionar:

- `BaseUpeaService + ApiBaseUpea`

o

- `Base de datos SIACOP` como una sola lifeline compartida

## 11. Qué no conviene hacer

No conviene:

- meter todo el detalle de las decisiones del cálculo diario
- poner cada consulta menor como mensaje separado
- mezclar el diagrama de secuencia con el de actividad

La secuencia debe mostrar `interacción entre componentes`, no el detalle de reglas
internas del cálculo.

## 12. Recomendación final para tu tesis

La figura debe transmitir que el proceso mensual de planilla:

- es orquestado por un servicio central
- depende de una fase de precarga
- ejecuta el cálculo diario antes de consolidar resultados mensuales
- consume tanto datos locales como institucionales
- controla el estado del proceso de principio a fin

Eso hace que el módulo se vea sólido, modular y técnicamente bien diseñado.

## 13. Archivos sugeridos para este directorio

Se recomienda guardar aquí:

- `figura_3_21_secuencia_planilla_mensual.drawio`
- `figura_3_21_secuencia_planilla_mensual.png`
- `figura_3_21_secuencia_planilla_mensual.svg`
- `figura_3_21_secuencia_planilla_mensual_borrador.md`
