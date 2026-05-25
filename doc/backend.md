# Backend desde el frontend

## Para que sirve este documento

Este archivo explica el backend desde la perspectiva del frontend: a que endpoints se conecta, como se comparte la auth y que contratos conviene respetar.

## Backend principal

El frontend se conecta principalmente a `server/`.

Base de rutas en cliente:

- [apiRoutes.ts](C:/Users/az232/Desktop/siacop/client/src/app/config/apiRoutes.ts:1)

Rutas comunes:

- `API_ROUTES.CONTROL_PERSONAL`
- `API_ROUTES.ADMINISTRADOR`
- `API_ROUTES.PERSONA`
- `API_ROUTES.REPORTES.*`

## Auth y sesion

Punto importante:

- El frontend trabaja con sesion compartida.
- `axios.defaults.withCredentials = true`.
- La cookie de sesion del backend viaja automaticamente.

Esto significa:

- Si una llamada devuelve `401`, normalmente la sesion caduco o no existe.
- El frontend no debe inventar headers de auth propios para los modulos protegidos.

## Flujo real de una peticion

1. Un modulo llama su `_requests.ts`.
2. `_requests.ts` pega a `server`.
3. `server` valida la sesion con Shield.
4. `server` usa modelos y servicios propios.
5. Si necesita datos institucionales, llama a `api_base_upea`.
6. `server` compone la respuesta final para React.

## Base UPEA

El frontend no debe acoplarse a los endpoints internos de Base UPEA.

Todo acceso a:

- persona
- asignacion
- unidad-sede
- caja-salud-sucursales

debe pasar por `server`, salvo que exista una decision arquitectonica nueva y explicita.

## Reportes y PDFs

Hay dos patrones utiles:

- Endpoint que devuelve PDF inline.
- Endpoint que devuelve datos necesarios para mostrar el PDF en modal.

Cuando el backend devuelve PDF binario:

- el request puede usar `responseType: 'blob'`
- luego convertir a base64 o generar una URL temporal para previsualizar

## Contratos utiles para nuevos modulos

- Listados: respuesta con `data` y, si aplica, `payload.pagination`
- Mutaciones: mensaje claro desde backend para mostrar toast
- Reportes: nombre de archivo estable y contenido PDF consistente
- Errores: usar `message` entendible para el usuario

## Que recordar

- El backend visible para React es `server/`.
- `api_base_upea` es una dependencia de backend, no del navegador.
- La sesion se comparte por cookie.
- Los reportes se generan en backend.
