# 4.2. Métricas de Calidad de Software según ISO 25010

La evaluación de la calidad del software desarrollado para SIACOP v3 se realizó tomando como referencia el modelo `ISO/IEC 25010`, debido a que este permite valorar de manera estructurada las principales características de calidad de un sistema informático. Para el presente proyecto se consideraron las dimensiones de adecuación funcional, fiabilidad, usabilidad, eficiencia de desempeño, seguridad, mantenibilidad y portabilidad.

La medición se apoyó en la evidencia documental generada durante el desarrollo, en los requerimientos funcionales identificados, en los escenarios de prueba del motor de planilla de asistencia, en los criterios de verificación documentados y en las características técnicas implementadas en la arquitectura del sistema.

## 4.2.1. Adecuación funcional

La adecuación funcional expresa el grado en que el sistema implementado satisface los requerimientos y procesos para los cuales fue construido.

Para esta métrica se consideran:

- módulos funcionales implementados
- requerimientos funcionales identificados y cubiertos

De acuerdo con el análisis del capítulo III, SIACOP v3 contempló `12` módulos funcionales principales y `12` requerimientos funcionales explícitos.

**Tabla 4.5. Base de evaluación de adecuación funcional**

| Indicador | Valor |
| --- | ---: |
| Módulos funcionales identificados | 12 |
| Requerimientos funcionales identificados | 12 |
| Requerimientos funcionales cubiertos | 12 |

La fórmula aplicada es:

```text
Adecuación Funcional (%) = (Requerimientos cubiertos / Requerimientos identificados) x 100
```

Sustituyendo:

```text
Adecuación Funcional (%) = (12 / 12) x 100
Adecuación Funcional (%) = 100%
```

**Interpretación.**

El sistema alcanzó una adecuación funcional del `100%` respecto a los requerimientos funcionales explícitamente definidos en el alcance del proyecto. Esto indica que la solución implementada cubre los procesos principales previstos para control personal, planilla de asistencia y bono refrigerio.

## 4.2.2. Fiabilidad

La fiabilidad mide la capacidad del sistema para mantener resultados consistentes y correctos durante su operación.

Para esta característica se utilizaron como base:

- `14` escenarios funcionales principales del motor de asistencia
- `36` criterios de verificación documentados en checklist y guía de pruebas

Como evidencia operativa, los escenarios cubrieron casos de presencia, atraso, falta, abandono, permisos, comisiones, declaratorias, vacaciones, asuetos por género, guardias y reemplazos.

**Tabla 4.6. Base de evaluación de fiabilidad**

| Indicador | Valor |
| --- | ---: |
| Escenarios funcionales principales verificados | 14 |
| Criterios de verificación documentados | 36 |
| Escenarios con comportamiento esperado documentado | 14 |

La fórmula aplicada fue:

```text
Fiabilidad (%) = (Escenarios verificados correctamente / Escenarios definidos) x 100
```

Sustituyendo:

```text
Fiabilidad (%) = (14 / 14) x 100
Fiabilidad (%) = 100%
```

**Interpretación.**

La fiabilidad del sistema se considera alta dentro del alcance probado, debido a que los escenarios funcionales clave del motor de planilla fueron documentados y contrastados con resultados esperados. Además, el sistema incorpora trazabilidad de procesos, resultados diarios, consolidación mensual y detalle por punto de marcado, lo cual fortalece la consistencia operativa.

## 4.2.3. Usabilidad

La usabilidad evalúa el grado en que el sistema puede ser utilizado de forma comprensible, accesible y práctica por los usuarios previstos.

En el presente proyecto no se aplicó una encuesta formal con escala Likert documentada, por lo que la evaluación se realizó mediante indicadores observables de interfaz y operación:

- uso de tablas en escritorio
- uso de cards en móvil
- modales para edición, visualización y reportes
- búsquedas y filtros en listados
- visualización integrada de PDF
- consistencia de navegación entre módulos

**Tabla 4.7. Indicadores observables de usabilidad**

| Indicador de usabilidad | Estado |
| --- | --- |
| Navegación modular unificada | Cumplido |
| Listados con filtros y búsqueda | Cumplido |
| Compatibilidad escritorio/móvil | Cumplido |
| Visualización integrada de reportes | Cumplido |
| Claridad operativa de consultas y estados | Cumplido |

Como aproximación académica, se expresa la métrica mediante:

```text
Usabilidad (%) = (Indicadores de usabilidad cumplidos / Indicadores evaluados) x 100
```

Sustituyendo:

```text
Usabilidad (%) = (5 / 5) x 100
Usabilidad (%) = 100%
```

**Interpretación.**

La usabilidad alcanzó un nivel satisfactorio dentro del alcance evaluado, debido a que el sistema ofrece una interfaz modular, consultas claras, visualización documental integrada y adaptación tanto a escritorio como a dispositivos móviles. Aunque no se aplicó una encuesta formal a usuarios, los elementos implementados evidencian una orientación clara a la operación administrativa real.

## 4.2.4. Eficiencia de desempeño

La eficiencia de desempeño mide la capacidad del sistema para responder adecuadamente utilizando de manera controlada los recursos disponibles.

En este proyecto la eficiencia se valoró a partir de criterios técnicos de diseño e implementación:

- precarga de estructuras antes del cálculo
- separación entre importación, procesamiento y consolidación
- uso de procesos identificados por periodo
- consumo controlado de `api_base_upea`
- evitación de consultas repetitivas dentro del cálculo diario

**Tabla 4.8. Indicadores de eficiencia de desempeño**

| Indicador | Estado |
| --- | --- |
| Precarga de datos de cálculo | Cumplido |
| Separación entre etapas del proceso | Cumplido |
| Snapshot por proceso mensual | Cumplido |
| Consumo controlado de API institucional | Cumplido |
| Consolidación mensual persistida | Cumplido |

La fórmula de evaluación fue:

```text
Eficiencia (%) = (Indicadores de eficiencia cumplidos / Indicadores evaluados) x 100
```

Sustituyendo:

```text
Eficiencia (%) = (5 / 5) x 100
Eficiencia (%) = 100%
```

**Interpretación.**

La eficiencia del sistema se considera adecuada porque la arquitectura evita recalcular sobre datos dispersos en tiempo real, concentra el procesamiento en procesos mensuales auditables y reduce el costo operativo mediante precarga y consolidación. Esto resulta especialmente importante para el motor de asistencia y bono refrigerio.

## 4.2.5. Seguridad

La seguridad evalúa la protección del sistema frente a accesos no autorizados y el control de la información expuesta.

Para esta característica se consideraron los siguientes mecanismos implementados:

- autenticación por sesión compartida con el backend
- control de acceso por roles y permisos
- protección de rutas privadas
- protección de endpoints internos
- seguridad de `api_base_upea` mediante `API Key`
- permisos por endpoint y control de campos visibles

**Tabla 4.9. Indicadores de seguridad implementados**

| Indicador de seguridad | Estado |
| --- | --- |
| Sesión autenticada centralizada | Cumplido |
| Control de roles y permisos | Cumplido |
| Protección de endpoints internos | Cumplido |
| API institucional con API Key | Cumplido |
| Reglas de campos por endpoint | Cumplido |

La métrica se expresa mediante:

```text
Seguridad (%) = (Controles de seguridad implementados / Controles evaluados) x 100
```

Sustituyendo:

```text
Seguridad (%) = (5 / 5) x 100
Seguridad (%) = 100%
```

**Interpretación.**

La seguridad alcanzó un nivel alto dentro del alcance del proyecto, debido a la combinación de autenticación centralizada, autorización por permisos, protección de APIs internas y uso de una API institucional protegida con control granular de acceso y campos expuestos.

## 4.2.6. Mantenibilidad

La mantenibilidad mide la facilidad con la que el sistema puede ser comprendido, corregido, ampliado o adaptado.

En SIACOP v3 esta característica se evaluó a partir de la estructura arquitectónica implementada:

- arquitectura híbrida modular
- separación frontend/backend/API institucional
- uso de controladores, servicios y modelos
- organización por dominio funcional
- desacoplamiento entre vista y lógica de negocio

**Tabla 4.10. Indicadores de mantenibilidad**

| Indicador | Estado |
| --- | --- |
| Arquitectura modular | Cumplido |
| Separación frontend/backend | Cumplido |
| Uso de servicios de negocio | Cumplido |
| Organización por módulos | Cumplido |
| Desacoplamiento de capas | Cumplido |

La fórmula aplicada es:

```text
Mantenibilidad (%) = (Indicadores de mantenibilidad cumplidos / Indicadores evaluados) x 100
```

Sustituyendo:

```text
Mantenibilidad (%) = (5 / 5) x 100
Mantenibilidad (%) = 100%
```

**Interpretación.**

La mantenibilidad del sistema es favorable, ya que la solución fue construida con modularización real, separación de responsabilidades y una arquitectura que facilita futuras ampliaciones, correcciones y nuevas integraciones sin comprometer el núcleo existente.

## 4.2.7. Portabilidad

La portabilidad evalúa la capacidad del sistema para adaptarse a diferentes entornos de ejecución.

En el proyecto se consideraron como base:

- operación mediante navegador web
- compatibilidad con escritorio y móvil
- despliegue sobre infraestructura web estándar
- posibilidad de operación en entornos Linux y Windows

**Tabla 4.11. Indicadores de portabilidad**

| Indicador | Estado |
| --- | --- |
| Acceso mediante navegador | Cumplido |
| Compatibilidad escritorio | Cumplido |
| Compatibilidad móvil | Cumplido |
| Despliegue web estándar | Cumplido |
| Adaptabilidad Linux/Windows | Cumplido |

La métrica se expresa como:

```text
Portabilidad (%) = (Indicadores de portabilidad cumplidos / Indicadores evaluados) x 100
```

Sustituyendo:

```text
Portabilidad (%) = (5 / 5) x 100
Portabilidad (%) = 100%
```

**Interpretación.**

La portabilidad del sistema es adecuada para el alcance institucional del proyecto, ya que al tratarse de una solución web híbrida puede ser utilizada desde navegadores modernos y desplegada sobre plataformas de servidor habituales, manteniendo además acceso desde escritorio y dispositivos móviles.

## 4.2.8. Síntesis de métricas de calidad

**Tabla 4.12. Resumen general de métricas de calidad de software**

| Característica ISO 25010 | Resultado |
| --- | ---: |
| Adecuación funcional | 100% |
| Fiabilidad | 100% |
| Usabilidad | 100% |
| Eficiencia de desempeño | 100% |
| Seguridad | 100% |
| Mantenibilidad | 100% |
| Portabilidad | 100% |

## 4.2.9. Interpretación general

Los resultados obtenidos muestran que SIACOP v3 presenta un nivel satisfactorio de calidad de software dentro del alcance definido para el proyecto de grado. La adecuación funcional evidencia cobertura completa de los requerimientos planteados; la fiabilidad se respalda en escenarios y criterios de verificación documentados; la usabilidad se sustenta en una interfaz orientada a la operación real; la eficiencia se fortalece mediante la precarga y la separación de procesos; la seguridad se consolida con autenticación, permisos y protección de APIs; la mantenibilidad se apoya en una arquitectura modular; y la portabilidad se beneficia del enfoque web híbrido.

En consecuencia, la evaluación basada en `ISO/IEC 25010` permite afirmar que la solución desarrollada no solo cumple una función operativa, sino que además reúne condiciones técnicas consistentes para su uso institucional y su evolución futura.
