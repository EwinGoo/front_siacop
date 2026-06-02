# CAPÍTULO IV ESTIMACIÓN DE COSTOS DEL SOFTWARE

## 4.1. Introducción

En el presente capítulo se desarrolla la estimación de costos del software implementado en el proyecto de grado, con el propósito de obtener una valoración técnica referencial del esfuerzo, tiempo y costo de desarrollo del sistema. Para ello se aplica el modelo `COCOMO II`, en su variante `Post-Architecture`, por corresponder a una solución que ya cuenta con arquitectura definida, módulos implementados, reglas de negocio consolidadas e integración entre varias capas tecnológicas.

La estimación no debe interpretarse como el presupuesto exacto desembolsado durante la construcción del sistema, sino como una aproximación académica del valor técnico-económico equivalente del desarrollo realizado.

## 4.2. Análisis de costos

La estimación se efectuó sobre el núcleo funcional realmente desarrollado en la versión 3 de SIACOP, evitando incluir componentes heredados del sistema anterior que no forman parte directa del trabajo implementado en esta etapa.

El alcance considerado comprende los siguientes módulos funcionales:

- permisos
- comisiones
- declaratoria en comisión
- guardias
- asignaciones administrativas
- planilla de asistencia
- bono refrigerio

Asimismo, se consideraron los componentes técnicos transversales necesarios para su operación:

- frontend desarrollado en React
- backend modular `ApiSiacop`
- API institucional `api_base_upea`
- endpoints de persona y asignación administrativa
- seguridad de endpoints mediante `API Key`, permisos por endpoint y control de campos
- reportes PDF
- modelos, controladores y servicios de negocio
- scripts y ajustes de base de datos
- integración entre frontend, backend y API institucional
- arquitectura híbrida entre el sistema legado MVC y la nueva SPA React

No se consideraron librerías externas, dependencias de terceros ni componentes heredados que ya existían previamente y que no fueron desarrollados dentro del proyecto de grado.

## 4.3. Estimación de costos mediante COCOMO II

Para la presente estimación se emplea el modelo `COCOMO II Post-Architecture`, debido a que el sistema cuenta con una arquitectura híbrida definida, módulos funcionales implementados, integración con servicios institucionales y procesos de cálculo consolidados.

La ecuación general utilizada para el esfuerzo es la siguiente:

```text
PM = A x (Size)^E x PROD(EMi)
```

Donde:

- `PM` = esfuerzo en persona-mes
- `A` = 2.94
- `Size` = tamaño del software en KSLOC
- `E` = exponente de escala
- `PROD(EMi)` = producto de multiplicadores de esfuerzo

## 4.3.1. Tamaño del software considerado

El tamaño del software se determinó a partir del conteo del código correspondiente al alcance funcional y técnico definido para esta estimación.

**Tabla 4.1. Base estructural del software considerado**

| Componente | LOC |
| --- | ---: |
| Frontend React de los módulos considerados | 21,228 |
| Backend `ApiSiacop` del alcance definido | 14,692 |
| `api_base_upea` vinculada al alcance | 3,501 |
| Scripts SQL y estructura relacionada | 3,018 |
| **Total** | **42,439** |

La conversión a miles de líneas de código es:

```text
KSLOC = LOC / 1000
KSLOC = 42,439 / 1000
KSLOC = 42.439
```

## 4.3.2. Factores de escala

Para mantener consistencia metodológica con el análisis técnico del sistema, se adoptan los siguientes factores de escala:

**Tabla 4.2. Factores de escala adoptados**

| Factor | Valor |
| --- | ---: |
| `PREC` | 3.72 |
| `FLEX` | 3.04 |
| `RESL` | 4.24 |
| `TEAM` | 3.29 |
| `PMAT` | 4.68 |
| **Suma** | **18.97** |

El exponente de escala se obtiene mediante:

```text
E = 0.91 + 0.01 x SUM(SFj)
E = 0.91 + 0.01 x 18.97
E = 1.0997
```

## 4.3.3. Multiplicadores de esfuerzo

Se adoptan los multiplicadores de esfuerzo más representativos para el contexto del proyecto.

**Tabla 4.3. Multiplicadores de esfuerzo adoptados**

| Multiplicador | Factor |
| --- | ---: |
| `RELY` | 1.10 |
| `DATA` | 1.09 |
| `CPLX` | 1.17 |
| `RUSE` | 1.07 |
| `DOCU` | 1.11 |
| `LTEX` | 0.91 |
| `TOOL` | 0.91 |
| **Producto total** | **1.11** |

Por tanto:

```text
PROD(EMi) = 1.11
```

## 4.3.4. Cálculo del esfuerzo

Reemplazando los valores en la ecuación principal:

```text
PM = 2.94 x (42.439)^1.0997 x 1.11
PM = 201.24 persona-mes
```

## 4.3.5. Cálculo del tiempo de desarrollo

Primero se obtiene el factor temporal:

```text
F = 0.28 + 0.2 x (E - B)
F = 0.28 + 0.2 x (1.0997 - 0.91)
F = 0.31794
```

Luego:

```text
TDEV = 3.67 x (PM)^F
TDEV = 3.67 x (201.24)^0.31794
TDEV = 19.82 meses
```

## 4.3.6. Cálculo del personal promedio

```text
PP = PM / TDEV
PP = 201.24 / 19.82
PP = 10.15 personas
```

## 4.3.7. Cálculo de la productividad aproximada

```text
Productividad = LOC / PM
Productividad = 42,439 / 201.24
Productividad = 210.88 LOC/persona-mes
```

## 4.3.8. Cálculo del costo de desarrollo

Para la valoración económica se adopta un costo referencial de `Bs 3,500` por persona-mes, por representar una base más prudente y razonable para fines académicos en el contexto del proyecto.

```text
Costo Total = PM x Costo por Persona-Mes
Costo Total = 201.24 x 3,500
Costo Total = Bs 704,355.13
```

También puede expresarse:

```text
Costo por LOC = 704,355.13 / 42,439
Costo por LOC = Bs 16.60
```

## 4.4. Resultados de la estimación

**Tabla 4.4. Resultados finales de la estimación con COCOMO II**

| Métrica | Resultado |
| --- | ---: |
| Tamaño considerado | 42,439 LOC |
| Tamaño convertido | 42.439 KSLOC |
| Suma de factores de escala | 18.97 |
| Exponente de escala `E` | 1.0997 |
| Producto de multiplicadores `PROD(EMi)` | 1.11 |
| Esfuerzo estimado `PM` | 201.24 persona-mes |
| Tiempo estimado `TDEV` | 19.82 meses |
| Personal promedio estimado | 10.15 personas |
| Productividad aproximada | 210.88 LOC/persona-mes |
| Costo por persona-mes | Bs 3,500 |
| Costo total estimado | Bs 704,355.13 |
| Costo aproximado por LOC | Bs 16.60 |

## 4.5. Interpretación de resultados

Los resultados obtenidos expresan una estimación referencial del valor técnico del software desarrollado y no el tiempo calendario exacto ni el presupuesto histórico desembolsado durante la construcción del sistema.

En este sentido, el resultado evidencia que el proyecto no corresponde a un módulo aislado ni a una aplicación CRUD elemental, sino a una solución institucional de complejidad media-alta, con integración entre frontend, backend, API institucional, base de datos, seguridad de endpoints, reportes y reglas de negocio asociadas al procesamiento mensual de asistencia y bono refrigerio.

Asimismo, la magnitud estimada refleja que una parte importante del esfuerzo no solo estuvo en la construcción de pantallas, sino también en la implementación de la arquitectura híbrida que permitió mantener operativa la versión anterior del sistema en MVC, mientras la nueva versión 3 en React fue incorporada progresivamente sin interrumpir la continuidad funcional del SIACOP.

## 4.6. Conclusión del análisis de costos

La aplicación del modelo `COCOMO II Post-Architecture` permitió estimar de manera consistente el esfuerzo, tiempo y costo del núcleo funcional desarrollado en el proyecto de grado. A partir de un tamaño base de `42.439 KSLOC`, se obtuvo un esfuerzo estimado de `201.24 persona-mes`, un tiempo de desarrollo equivalente de `19.82 meses` y un costo referencial de `Bs 704,355.13`.

Estos resultados respaldan académicamente que el trabajo realizado posee una magnitud técnica significativa y que el desarrollo implementado en SIACOP v3 representa una solución institucional compleja, integrada y sostenida sobre varios componentes funcionales y arquitectónicos construidos en el marco del proyecto.
