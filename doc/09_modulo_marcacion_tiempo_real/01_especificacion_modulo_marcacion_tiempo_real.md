# Especificación del Módulo de Marcación en Tiempo Real

## 1. Nombre del módulo

`Módulo de Marcación Biométrica en Tiempo Real`

## 2. Propósito del módulo

El módulo de marcación biométrica en tiempo real tuvo como propósito permitir que las
marcaciones realizadas por los funcionarios en dispositivos biométricos ZKTeco sean
recibidas automáticamente por el sistema SIACOP, almacenadas de forma segura, normalizadas
y puestas a disposición tanto para consulta operativa como para el procesamiento mensual
de la planilla de asistencia.

Este módulo fue concebido como una ampliación del subsistema biométrico, integrándose con
la estructura de `ApiSiacop` y con el motor de `planilla-asistencia`, con la finalidad
de evitar procesos manuales repetitivos y reducir la dependencia exclusiva de importaciones
manuales de archivos.

## 3. Objetivo general del módulo

Registrar en tiempo real las marcaciones provenientes de dispositivos biométricos ZKTeco,
para su almacenamiento, validación, normalización, consulta y posterior utilización en el
cálculo diario y mensual de asistencia del personal administrativo.

## 4. Objetivos específicos del módulo

- recibir automáticamente las marcaciones generadas por el dispositivo biométrico
- validar que el dispositivo emisor esté autorizado en el sistema
- almacenar la información original recibida desde el equipo biométrico
- transformar la información recibida en una estructura normalizada
- relacionar la marcación con una persona institucional cuando sea posible
- permitir la consulta de marcaciones por parte del personal y de los administradores
- integrar las marcaciones en tiempo real con el módulo de planilla de asistencia
- mantener trazabilidad ante errores, duplicados o registros no vinculados

## 5. Justificación funcional

La incorporación de este módulo respondió a la necesidad de contar con una captura continua
de marcaciones biométricas sin depender únicamente de la carga manual de archivos. Bajo este
enfoque, las marcaciones generadas en los relojes biométricos pueden reflejarse de forma
inmediata en el sistema, permitiendo mejorar la visibilidad operativa del control de
asistencia y fortalecer la calidad de los datos empleados por el proceso mensual de planilla.

Asimismo, este módulo permitió unificar las fuentes de marcación bajo una misma estructura
de procesamiento, haciendo posible que las marcaciones capturadas en tiempo real y las
marcaciones importadas manualmente converjan en un mismo flujo de normalización y cálculo.

## 6. Alcance del módulo

El módulo contempló:

- recepción de marcaciones mediante protocolo push del dispositivo biométrico
- validación básica del dispositivo emisor
- almacenamiento del evento crudo recibido
- normalización inmediata del evento hacia la estructura usada por asistencia
- control de duplicados
- conservación de registros no vinculados a persona
- consulta funcional de marcaciones
- soporte para el cálculo diario y mensual de asistencia

El módulo no estuvo orientado exclusivamente a la administración del dispositivo, sino al
tratamiento de la marcación como dato funcional dentro del sistema.

## 7. Dispositivos considerados

El módulo fue planteado para dispositivos biométricos ZKTeco, particularmente equipos del
tipo `uFace800`, los cuales pueden ser configurados para enviar marcaciones a un servidor
mediante una dirección IP o dominio.

Cuando el dispositivo detecta conectividad con el servidor, envía la marcación de forma
inmediata. Si el servidor no se encuentra disponible en ese momento, el equipo conserva
internamente los eventos pendientes y los envía posteriormente cuando se restablece la
conexión, manteniendo así continuidad en la transmisión.

## 8. Mecanismo de comunicación

El mecanismo de comunicación definido para este módulo fue de tipo `push`, es decir, el
dispositivo biométrico envía automáticamente las marcaciones al servidor.

### Endpoint compatible

El endpoint de recepción debe mantenerse como:

`/iclock/cdata`

Esto se debe a que el dispositivo biométrico ya trabaja con ese patrón de comunicación.
Sin embargo, la lógica de atención del endpoint debe ser migrada e integrada dentro de la
estructura de rutas y controladores de `ApiSiacop`, evitando seguir dependiendo del esquema
legacy previo.

## 9. Flujo funcional general

El comportamiento general del módulo debe seguir la siguiente secuencia:

1. El funcionario realiza una marcación en el biométrico.
2. El dispositivo ZKTeco genera el evento de asistencia.
3. El equipo envía el evento al endpoint `/iclock/cdata`.
4. El sistema recibe la solicitud y valida el serial del dispositivo.
5. El evento crudo se registra en la tabla de marcaciones de origen.
6. El sistema intenta normalizar la marcación.
7. Se resuelve el código biométrico y se intenta asociar a una persona.
8. Si la marcación es válida, se inserta en la tabla normalizada.
9. Si no se logra asociar a una persona, la marcación se conserva en la tabla cruda.
10. La marcación normalizada queda disponible para consulta y para el motor de planilla.

## 10. Relación con el módulo de planilla de asistencia

Sí, las marcaciones en tiempo real deben servir para el proceso mensual de planilla.

Esta fue una decisión técnica importante, ya que evita construir dos flujos separados:

- uno para marcaciones manuales
- otro para marcaciones en línea

En consecuencia, la marcación recibida en tiempo real debe alimentar la misma estructura
que actualmente utiliza el módulo `planilla-asistencia`, permitiendo que el motor de cálculo
consuma una única fuente normalizada de marcaciones.

## 11. Decisión de almacenamiento

La estrategia recomendada para este módulo consiste en registrar cada marcación en dos niveles:

### 11.1. Nivel crudo

La información original del evento recibido desde el biométrico debe almacenarse en:

- `siacop_asistencia_marcacion_raw`

### 11.2. Nivel normalizado

La información procesada y estructurada debe almacenarse en:

- `siacop_asistencia_marcacion`

Este enfoque ofrece:

- trazabilidad del evento original
- reutilización del flujo actual de asistencia
- control de errores y duplicados
- integración directa con planilla mensual

## 12. Tablas involucradas

## 12.1. Tabla de marcación cruda

### Tabla

- `siacop_asistencia_marcacion_raw`

### Finalidad

Conservar el evento original recibido desde el dispositivo, junto con su contexto técnico
de recepción.

### Rol dentro del módulo

- bitácora de origen
- auditoría técnica
- respaldo del dato recibido
- base para reproceso o normalización posterior

### Campos existentes relevantes

- `id_marcacion_raw`
- `archivo_origen`
- `linea_origen`
- `contenido_linea`
- `codigo_biometrico`
- `fecha_hora_marcacion`
- `fecha_importacion`
- `estado_importacion`

### Campos adicionales recomendados para tiempo real

Para soportar adecuadamente la recepción en vivo, se recomienda ampliar esta tabla con:

- `tipo_ingesta`
  valores sugeridos: `MANUAL`, `PUSH`

- `serial_dispositivo`
  serial del biométrico emisor

- `id_biometrico`
  referencia al dispositivo registrado en el sistema

- `ip_origen`
  IP del dispositivo o del emisor

- `payload_origen`
  contenido completo del cuerpo recibido

- `hash_evento`
  hash técnico para control de duplicados

- `fecha_recepcion`
  momento en que el servidor recibió el evento

- `estado_procesamiento`
  valores sugeridos: `RECIBIDO`, `NORMALIZADO`, `PENDIENTE`, `ERROR`

### Observación

Aunque el nombre de algunos campos proviene del flujo de importación manual, la tabla puede
evolucionar para actuar como repositorio unificado de marcaciones crudas.

## 12.2. Tabla de marcación normalizada

### Tabla

- `siacop_asistencia_marcacion`

### Finalidad

Registrar la marcación ya transformada y lista para ser utilizada por el motor de asistencia.

### Campos existentes relevantes

- `id_marcacion`
- `id_marcacion_raw`
- `id_persona`
- `codigo_biometrico`
- `fecha_hora_marcacion`
- `fecha_marcacion`
- `hora_marcacion`
- `origen_marcacion`
- `estado_normalizacion`
- `observacion_normalizacion`
- `hash_deduplicacion`

### Uso dentro del módulo

- consulta por persona
- consulta administrativa
- cálculo diario
- consolidación mensual
- trazabilidad de la marcación procesada

### Valor recomendado para origen

Cuando la marcación provenga del flujo en tiempo real, el campo `origen_marcacion` puede
registrarse con un valor como:

- `BIOMETRICO_PUSH`

o un valor equivalente que la diferencie de la importación manual.

## 12.3. Tabla de dispositivos biométricos

### Tabla

- `siacop_biometrico_dispositivos`

### Finalidad

Almacenar los equipos biométricos autorizados para enviar o gestionar información dentro
del sistema.

### Uso en el módulo

- validar que el serial del dispositivo exista
- identificar el equipo que originó la marcación
- asociar IP, puerto, serial y metadatos del biométrico

## 12.4. Tabla de relación persona-biométrico

### Tabla

- `siacop_asistencia_persona_biometrico`

### Finalidad

Relacionar a una persona institucional con uno o varios códigos biométricos válidos.

### Uso en el módulo

- resolver la persona correspondiente a una marcación recibida
- cubrir escenarios donde el código biométrico no coincide exactamente con CI
- mantener vínculos activos e históricos

## 13. Regla principal de persistencia

La marcación en tiempo real debe insertarse:

1. en `siacop_asistencia_marcacion_raw`
2. y también, en el mismo flujo, en `siacop_asistencia_marcacion` si pudo normalizarse

Esto implica que el sistema debe intentar ambos pasos durante la recepción del evento.

## 14. Tratamiento de marcaciones no vinculadas

Si el sistema no logra asociar la marcación a una persona institucional, la regla definida
es la siguiente:

- conservar el registro en `siacop_asistencia_marcacion_raw`
- marcarlo como pendiente o no relacionado
- no descartar el evento

Esto permitirá revisar posteriormente:

- códigos biométricos sin relación
- errores de configuración
- personal nuevo aún no vinculado
- problemas de sincronización entre persona y biométrico

## 15. Tratamiento de duplicados

Debido a que el dispositivo puede reenviar eventos cuando se restablece la conexión, el
sistema debe contemplar control de duplicados.

La estrategia recomendada consiste en construir un identificador técnico con base en:

- serial del dispositivo
- código biométrico
- fecha y hora de marcación
- contenido del evento

Con esta información puede generarse un `hash_evento` o `hash_deduplicacion`, que permita
evitar inserciones repetidas en la tabla normalizada.

## 16. Formato de marcación recibido

El sistema legacy analizado mostró que el equipo biométrico envía registros tipo `ATTLOG`
con una estructura separada por tabulaciones. A nivel preliminar, la información recibida
incluye al menos:

- identificador biométrico o usuario
- fecha y hora de marcación
- estado del evento
- tipo de verificación

Dado que el formato exacto puede variar según configuración del dispositivo, la primera
implementación del módulo debe considerar una fase de prueba controlada para registrar
el contenido real del `payload` y validar su estructura definitiva.

## 17. Vista funcional del módulo

Se recomienda dividir la consulta del módulo en dos niveles:

### 17.1. Vista del funcionario

Dirigida al personal administrativo para consultar sus propias marcaciones.

Debe permitir:

- ver marcaciones del día
- consultar por rango de fechas
- revisar horas registradas
- verificar si la marcación fue procesada correctamente

### 17.2. Vista administrativa o técnica

Dirigida a responsables de control de personal o administradores del sistema.

Debe permitir:

- consultar marcaciones por persona
- consultar marcaciones por dispositivo
- revisar marcaciones no relacionadas
- detectar duplicados
- revisar eventos con error
- monitorear la recepción en tiempo real

## 18. Actores del módulo

Los actores principales del módulo serían:

- `Administrador`
- `Planillero`
- `Secretaria de Planillas` si realiza control operativo
- `Personal Administrativo` para consulta propia de marcaciones

## 19. Acciones funcionales esperadas

### Administrador

- registrar dispositivos biométricos
- revisar eventos recibidos
- revisar fallos de normalización
- consultar marcaciones por dispositivo

### Planillero

- consultar marcaciones ya normalizadas
- validar eventos previos al proceso mensual
- revisar inconsistencias de asistencia

### Personal Administrativo

- consultar sus marcaciones registradas
- revisar fechas y horas de entrada o salida

## 20. Integración con ApiSiacop

El módulo debe migrarse a la arquitectura `ApiSiacop`, bajo el criterio ya adoptado en
los demás módulos funcionales del sistema.

### Requisito de compatibilidad

Aunque se migre a `ApiSiacop`, el endpoint debe mantenerse funcionalmente compatible con:

- `/iclock/cdata`

### Enrutamiento esperado

La lógica del endpoint debe centralizarse en rutas administradas por `ApiSiacop`, evitando
seguir usando la ruta legacy como implementación principal.

## 21. Relación con el módulo biométrico administrativo

El módulo de marcación en tiempo real no reemplaza al módulo de administración de biométricos,
sino que lo complementa.

### Módulo administrativo biométrico

Se encarga de:

- registrar dispositivos
- administrar conexión
- consultar usuarios del equipo
- ejecutar operaciones administrativas sobre biométricos

### Módulo de marcación en tiempo real

Se encarga de:

- recibir marcaciones push
- almacenar eventos
- normalizar marcaciones
- exponer marcaciones para consulta
- alimentar planilla de asistencia

## 22. Reglas de negocio definidas

- el dispositivo biométrico enviará marcaciones mediante `push`
- el endpoint compatible será `/iclock/cdata`
- la recepción debe registrar marcación cruda y normalizada en el mismo flujo
- si no existe relación con persona, la marcación debe conservarse en `raw`
- la marcación en tiempo real también servirá para la planilla mensual
- el sistema debe controlar duplicados
- el sistema debe identificar el dispositivo origen
- la consulta del módulo debe diferenciar vista de usuario y vista administrativa

## 23. Beneficios esperados

La implementación de este módulo permitirá:

- reducir la dependencia de importación manual
- disponer de marcaciones con mayor inmediatez
- mejorar el control operativo del personal
- fortalecer la trazabilidad del origen de las marcaciones
- alimentar de forma más continua el motor de asistencia
- detectar inconsistencias antes del cierre mensual de planilla

## 24. Recomendación técnica de implementación

La recomendación técnica es implementar este módulo en las siguientes fases:

1. migrar el endpoint push a `ApiSiacop`
2. registrar recepción cruda del evento
3. normalizar el evento en el mismo flujo
4. integrar la relación persona-biométrico
5. habilitar consulta funcional y administrativa
6. validar reutilización completa dentro de `planilla-asistencia`

## 25. Resultado esperado

Una vez implementado, el sistema deberá ser capaz de recibir y registrar automáticamente
las marcaciones emitidas por biométricos ZKTeco, integrarlas con la estructura de asistencia
vigente y reutilizarlas como fuente válida para el cálculo diario y mensual de planilla.

## 26. Posibles documentos complementarios

Este módulo puede complementarse posteriormente con:

- diagrama de actividad de la recepción push
- diagrama de secuencia del flujo `/iclock/cdata`
- diseño de tablas actualizado
- casos de uso del módulo
- diseño de interfaces de consulta
