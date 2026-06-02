# Figura 3.5. Estructura General del Frontend React

Esta guía define qué debe mostrarse en la figura:

`Figura 3.5. Estructura general del frontend React`

La figura no debe ser un árbol completo de todas las carpetas del proyecto, sino una
representación estructurada de la arquitectura del frontend. El objetivo es mostrar
cómo se organizó la aplicación React, cuáles son sus carpetas base, cómo se distribuyen
los módulos funcionales y de qué manera se conectan con el enrutamiento, la autenticación
y los servicios compartidos.

## 1. Qué debe mostrar la figura

La figura debe reflejar la estructura general del frontend con un nivel intermedio de
detalle. Eso significa que sí deben aparecer las carpetas principales y los módulos más
importantes, pero no es necesario dibujar todos los archivos internos.

Se recomienda que la figura muestre al menos:

- `src`
- `app`
- `routing`
- `modules`
- `config`
- `services`
- `_metronic`
- `pages` o vistas principales, si corresponde
- componentes o utilitarios compartidos, si ayudan a comprender la arquitectura

## 2. Qué nivel de detalle usar

Para esta figura conviene usar una estructura jerárquica de tres niveles:

1. Nivel raíz del frontend.
2. Nivel de carpetas base de la aplicación.
3. Nivel de módulos funcionales principales.

No conviene que esta figura entre al detalle de clases, hooks específicos o archivos
menores, porque eso hará que el diagrama se vea saturado. Ese tipo de detalle puede
mostrarse después en diagramas específicos por módulo.

## 3. Carpetas base que sí deberían aparecer

En esta figura sí conviene incluir las carpetas base del frontend, porque ayudan a
explicar cómo fue organizada la aplicación React. La estructura puede representarse
de forma similar a esta:

```text
src/
 ├── app/
 │   ├── routing/
 │   ├── modules/
 │   ├── config/
 │   ├── services/
 │   ├── store/ o context/ (si aplica)
 │   └── pages/ o layouts/ (si aplica)
 ├── _metronic/
 ├── assets/
 └── main files
```

La figura puede simplificarse si algunas carpetas no son relevantes para la explicación
del proyecto de grado.

## 4. Si deben aparecer los módulos

Sí, deben aparecer los módulos funcionales principales, porque son parte central del
desarrollo del sistema. Dentro de `modules` conviene mostrar solo los módulos más
importantes, por ejemplo:

- autenticación
- biométricos
- boletas de comisión
- declaratoria en comisión
- permisos
- asignaciones administrativas
- guardias de seguridad
- planilla de asistencia
- vacaciones

No es necesario mostrar cada subcarpeta interna de todos los módulos en esta figura
general. Basta con que se vea que el frontend fue modularizado.

## 5. Si debe aparecer autenticación y permisos

Sí, conviene que aparezca la autenticación como parte de la estructura general, porque
es una pieza transversal del sistema. También es válido mostrar el control de acceso
o protección de rutas, pero de manera resumida.

Lo recomendable es reflejarlo así:

- `auth` o módulo de autenticación
- `routing` con rutas públicas y privadas
- servicios de sesión o cliente HTTP autenticado

No hace falta dibujar toda la lógica interna del login. En esta figura basta con dejar
claro que:

- existe un módulo de autenticación
- las rutas privadas dependen del estado de sesión
- los módulos funcionales se consumen mediante servicios autenticados

## 6. Si debe aparecer la estructura base de un módulo

Sí, pero solo como ejemplo representativo, no para todos los módulos al mismo tiempo.

Lo más profesional es que la figura general muestre:

- la carpeta `modules`
- los nombres de los módulos principales
- y, de forma opcional, un ejemplo resumido de la estructura interna de un módulo

Por ejemplo, puedes mostrar la estructura tipo de un módulo así:

```text
modules/
 ├── administrador/
 │   └── biometrico/
 │       ├── list/
 │       ├── components/
 │       ├── core/
 │       └── routes/
 ├── control-personal/
 │   ├── permisos/
 │   ├── comisiones/
 │   ├── declaratoria-comision/
 │   ├── guardias-seguridad/
 │   └── planilla-asistencia/
```

Esto ayuda a demostrar que la aplicación siguió una organización modular reutilizable.

## 7. Qué no conviene poner en esta figura

Para evitar sobrecargar la imagen, no conviene incluir:

- todos los archivos `.tsx`, `.ts` y `.scss`
- todas las pantallas secundarias
- detalles completos de formularios
- lógica de hooks internos
- detalle completo de Redux, Query o estados locales, salvo que sea imprescindible

Esos elementos pueden explicarse después en el texto o en diagramas más específicos.

## 8. Cómo debería verse profesionalmente

La figura debería mostrar la arquitectura del frontend en bloques. Una opción
recomendada es dividir el diagrama en estas partes:

- `Base del frontend`
- `Capa de navegación`
- `Capa modular funcional`
- `Capa de servicios y configuración`
- `Plantilla visual o componentes compartidos`

Ejemplo conceptual:

```text
Frontend React
 ├── Configuración general
 │   ├── apiRoutes
 │   ├── auth config
 │   └── constants
 ├── Routing
 │   ├── PublicRoutes
 │   └── PrivateRoutes
 ├── Servicios
 │   ├── axiosClient
 │   └── helpers
 ├── Módulos
 │   ├── Auth
 │   ├── Biométrico
 │   ├── Permisos
 │   ├── Comisiones
 │   ├── Declaratoria
 │   ├── Guardias
 │   ├── Asignaciones
 │   └── Planilla Asistencia
 └── Plantilla UI
     └── Metronic
```

## 9. Recomendación para tu documento

Para tu tesis, esta figura debería representar:

- la estructura general del frontend
- la organización modular del sistema
- la separación entre navegación, servicios, configuración y módulos
- la existencia de autenticación y control de acceso
- el uso de una plantilla base como `Metronic`

En otras palabras, no debe ser solo una captura simple del explorador de archivos,
sino una figura interpretada y ordenada académicamente.

## 10. Archivos sugeridos para guardar en este directorio

Se recomienda guardar aquí:

- `figura_3_5_estructura_frontend.png`
- `figura_3_5_estructura_frontend.jpg`
- `figura_3_5_estructura_frontend.drawio`
- `figura_3_5_estructura_frontend.vsdx`
- `figura_3_5_estructura_frontend_editable.svg`
- `figura_3_5_estructura_frontend_borrador.md`

## 11. Recomendación final

Sí, en tu caso conviene que la figura incluya:

- carpetas base del frontend
- módulos principales
- autenticación
- rutas públicas y privadas
- servicios compartidos
- un ejemplo resumido de la estructura interna de un módulo

No conviene que sea únicamente una captura literal de carpetas sin explicación visual.
Lo ideal es que sea un diagrama limpio, jerárquico y orientado a mostrar la arquitectura
del frontend del sistema.
