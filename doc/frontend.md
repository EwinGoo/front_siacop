# Frontend SIACOP

## Resumen

Este frontend vive en `client/` y es una SPA en React montada sobre Metronic.

Tecnologias principales:

- React 18
- TypeScript
- Metronic `8.2.0`
- Bootstrap 5
- React Router DOM 6
- React Query 3
- Axios
- React Table 7
- Formik + Yup
- React Bootstrap
- MUI
- Sass

Archivo de entrada:

- [src/index.tsx](C:/Users/az232/Desktop/siacop/client/src/index.tsx:1)

## Plantilla y estilo

La base visual usa Metronic.

Recursos cargados en el arranque:

- `style.scss`
- `plugins.scss`
- `style.react.scss`
- `keenicons`
- `fonticon`

Patron visual esperado:

- Desktop: priorizar tabla cuando el modulo tiene muchos datos comparables.
- Mobile: priorizar cards cuando la tabla pierde legibilidad.
- Header del listado: buscador fijo, acciones de alta visibilidad y layout compacto en mobile.
- Controles de mobile: una sola fila siempre que sea posible.
- Botones de mobile: altura estable de `44px`.
- Cards mobile: informacion esencial visible, detalle completo en modal o vista de datos.

## Auth compartida

La autenticacion del frontend no usa bearer token real para operar el sistema diario. Usa sesion compartida con el backend de `server/`.

Piezas clave:

- [Auth.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/Auth.tsx:1)
- [AuthHelpers.ts](C:/Users/az232/Desktop/siacop/client/src/app/modules/auth/core/AuthHelpers.ts:1)
- [AppRoutes.tsx](C:/Users/az232/Desktop/siacop/client/src/app/routing/AppRoutes.tsx:1)
- [apiRoutes.ts](C:/Users/az232/Desktop/siacop/client/src/app/config/apiRoutes.ts:1)

Funcionamiento:

1. React arranca dentro de `AuthProvider`.
2. Axios se configura con `withCredentials = true`.
3. El navegador envia la cookie de sesion de CodeIgniter Shield.
4. El frontend consulta la sesion actual.
5. Si existe usuario, entra a rutas privadas.
6. Si no existe usuario, redirige al login servido por `server/`.

Esto significa:

- La sesion vive en el backend.
- El frontend depende de la cookie `ci_session`.
- No se debe reimplementar auth local por modulo.

## Ruteo

Rutas principales:

- `AppRoutes` decide si el usuario entra a rutas privadas.
- `PrivateRoutes` agrupa los modulos reales del sistema.

Regla operativa:

- Si un modulo es interno del sistema, debe entrar por `PrivateRoutes`.
- Si necesita proteccion, debe asumir sesion activa y permisos desde el backend y desde el contexto de usuario.

## Consumo de APIs

El frontend no llama directamente a `api_base_upea`.

Flujo correcto:

1. Frontend llama a `server`, normalmente bajo `API_ROUTES.CONTROL_PERSONAL`, `API_ROUTES.ADMINISTRADOR`, etc.
2. `server` valida sesion y permisos.
3. `server` consulta `siacop_db`.
4. Si necesita datos de persona/cargo/unidad, `server` llama a `api_base_upea`.

Ventajas:

- El frontend no conoce la API key de Base UPEA.
- La logica de negocio queda en backend.
- Los contratos quedan centralizados en `server`.

## Flujo sugerido para crear un modulo frontend

Patron recomendado:

1. Crear pagina del modulo.
2. Registrar ruta en `PrivateRoutes`.
3. Crear carpeta del modulo dentro de `src/app/modules/apps/...`.
4. Separar el modulo en:
   `list/`, `core/`, `edit-modal/`, `table/`, `components/`.
5. Crear providers:
   `QueryRequestProvider`, `QueryResponseProvider`, `ListViewProvider`.
6. Crear `_models.ts` para tipos.
7. Crear `_requests.ts` para llamadas HTTP.
8. Crear `ListHeader`, `ListSearchComponent`, `ListToolbar`.
9. Crear `Table` y `Cards`.
10. Agregar modal de edicion, vista o reporte si aplica.

Patron comun en listados:

- `ListHeader`
- `ListSearchComponent`
- `ListToolbar`
- `Table`
- `Cards`
- `ListPagination`

## Desktop y mobile

Regla general del proyecto:

- Desktop: tabla.
- Mobile: cards.

Esto ya se usa en modulos como:

- Comisiones
- Declaratoria de comision
- Feriado y asueto

Buenas practicas:

- No meter demasiados campos en la card.
- El detalle largo debe ir en `Ver datos`.
- Acciones principales en mobile deben ser visibles y compactas.
- La tabla no debe forzarse en pantallas pequenas si pierde legibilidad.

## PDF en frontend

Patron actual:

1. El usuario hace clic en imprimir.
2. El backend genera el PDF.
3. El frontend recibe el archivo o base64.
4. Si llega blob, el request puede convertirlo a base64 para el modal.
5. El PDF se muestra en modal con iframe en desktop.
6. En mobile se puede ofrecer apertura externa, descarga o vista simplificada.

Ejemplo de modal PDF:

- [PDFModal.tsx](C:/Users/az232/Desktop/siacop/client/src/app/modules/apps/control-personal/declaratoria-comision/declaratoria-comision-list/pdf-modal/PDFModal.tsx:1)

## Convenciones utiles

- Usar `react-query` para lectura y mutaciones.
- Usar `axiosClient` o patrones existentes del modulo.
- Reutilizar helpers de Metronic antes de inventar wrappers nuevos.
- Mantener `ListHeader` consistente entre modulos.
- Si el modulo tiene comportamiento distinto en mobile, documentarlo en el propio componente.

## Que debe entender cualquier chat nuevo

- Este frontend es una SPA React con Metronic.
- La auth real depende de la sesion Shield del backend `server/`.
- El frontend no habla directo con `api_base_upea`.
- Los listados deben pensar en dualidad `table desktop / cards mobile`.
- Los PDFs se generan en backend.
- Las pantallas internas viven bajo `PrivateRoutes`.
