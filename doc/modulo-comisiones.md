# Modulo de comisiones - Frontend

## Proposito

El modulo de comisiones permite listar, crear, editar, enviar, recepcionar, aprobar, observar, eliminar e imprimir boletas de comision/permisos. Tambien permite generar reportes PDF y trabajar con datos de solicitantes que vienen desde ApiSiacop, que a su vez consulta ApiBaseUpea.

Ruta principal:

```text
/apps/comisiones/listar
```

Archivo de entrada:

```text
src/app/modules/apps/control-personal/comision/ComisionPage.tsx
```

## Estructura principal

```text
comision/
  ComisionPage.tsx
  comision-list/
    ComisionList.tsx
    core/
      _requests.ts
      _models.ts
      QueryRequestProvider.tsx
      QueryResponseProvider.tsx
      ListViewProvider.tsx
    components/header/
      ListHeader.tsx
      ListSearchComponent.tsx
      ListToolbar.tsx
      ListFilter.tsx
      ListGrouping.tsx
    table/
      ComisionTable.tsx
      ComisionCards.tsx
      columns/
        _columns.tsx
        ActionsCell.tsx
        InfoCell.tsx
        DateCell.tsx
        EstadoBadge.tsx
    comision-edit-modal/
    comision-report-modal/
    pdf-modal/
```

## Flujo de listado

El listado usa React Query.

1. `QueryRequestProvider.tsx` guarda el estado de consulta: pagina, busqueda, filtros y orden.
2. `QueryResponseProvider.tsx` convierte ese estado a query string con `stringifyRequestQuery`.
3. `getComisiones()` en `_requests.ts` llama:

```text
GET /api/v1/control-personal/boletas-comision
```

4. La respuesta se normaliza a:

```ts
{
  data: Comision[],
  payload: { pagination },
  warning?: string
}
```

5. `ComisionTable.tsx` o `ComisionCards.tsx` muestran la informacion segun el modo de vista.

## Buscador de tabla

Archivo:

```text
components/header/ListSearchComponent.tsx
```

El buscador actualiza `search` en el estado global de consulta. Usa debounce de `500ms` para evitar disparar peticiones por cada tecla.

El backend interpreta ese `search` y permite buscar por:

- Codigo visible, ejemplo `C123`.
- ID numerico, ejemplo `123`.
- `nro_correlativo` y `correlativo`.
- Tipo, ejemplo `COMISION`, `TRANSPORTE`, `CAJA SALUD`, `FISIOTERAPIA`.
- Estado, ejemplo `GENERADO`, `ENVIADO`, `RECEPCIONADO`, `APROBADO`.
- Fecha en formato `YYYY-MM-DD`, `DD/MM/YYYY` o `DD-MM-YYYY`.
- Motivo o descripcion.
- Solicitante por nombre o CI mediante ApiBaseUpea.

Importante: el frontend solo envia `search`; la logica inteligente vive en el backend.

## Filtro por estado

Archivo:

```text
components/header/ListFilter.tsx
```

Permite filtrar por estado de boleta:

```text
GENERADO
ENVIADO
RECEPCIONADO
APROBADO
OBSERVADO
```

El filtro viaja al backend como parte del query string y se aplica sobre `estado_boleta_comision`.

## Creacion y edicion

Archivo principal:

```text
comision-edit-modal/EditModalForm.tsx
```

Endpoints usados:

```text
POST /api/v1/control-personal/boletas-comision
PUT  /api/v1/control-personal/boletas-comision/{id}
GET  /api/v1/control-personal/boletas-comision/{id}
```

### Solicitante

Si el usuario puede gestionar comisiones, el formulario muestra un buscador asincrono de solicitante:

```text
comision-edit-modal/components/AsyncSelectField.tsx
```

Ese selector llama:

```text
GET /api/v1/persona/autocompletar?termino=...
```

El valor importante para guardar la boleta no es el nombre de persona, sino:

```text
id_asignacion_administrativo
```

Ese ID es la relacion estable entre la boleta de comision y la asignacion activa del administrativo en Base UPEA.

Si el usuario no puede gestionar, el backend usa la asignacion activa del usuario autenticado.

### Campos por tipo

El formulario cambia etiquetas y campos segun el tipo:

- `PERSONAL` y `TRANSPORTE`: muestran recorrido desde/hacia.
- `CAJA SALUD`: muestra sucursal de caja de salud.
- `FISIOTERAPIA`: muestra fecha inicio y fecha fin, y sucursal.

Los tipos vienen desde:

```text
GET /api/v1/control-personal/boletas-comision/tipos-permiso
```

Las sucursales vienen desde:

```text
GET /api/v1/control-personal/boletas-comision/caja-salud-sucursales
```

## Acciones por fila

Archivo:

```text
table/columns/ActionsCell.tsx
```

Acciones disponibles segun permisos y estado:

- Ver datos.
- Imprimir.
- Editar.
- Enviar.
- Recepcionar.
- Aprobar.
- Observar.
- Eliminar.

La visibilidad se calcula con:

```text
getPermisosComision()
```

y con los roles del usuario autenticado.

## Ciclo de estados

Estados principales:

```text
GENERADO -> ENVIADO -> RECEPCIONADO -> APROBADO
                         |
                         -> OBSERVADO
```

Acciones:

- Imprimir una boleta en estado `GENERADO` confirma primero y luego la marca como `ENVIADO`.
- Recepcionar cambia a `RECEPCIONADO`.
- Aprobar cambia a `APROBADO`.
- Observar cambia a `OBSERVADO` y requiere observacion.

Endpoint usado para cambios de estado:

```text
POST /api/v1/control-personal/boletas-comision/comision-qr
```

Body general:

```ts
{
  id: number,
  action: 'send' | 'receive' | 'approve' | 'observe',
  fecha?: string,
  observacion?: string
}
```

## Aprobacion masiva

Archivo:

```text
components/header/ListGrouping.tsx
```

Cuando se seleccionan varias filas, aparece la accion:

```text
Aprobar Seleccionados
```

Endpoint:

```text
POST /api/v1/control-personal/boletas-comision/aprobar-seleccionados
```

Body:

```ts
{
  ids: number[]
}
```

El backend solo permite aprobar seleccionados que esten en estado `RECEPCIONADO`.

## Aprobar todas las recepcionadas

Archivo:

```text
components/header/ListToolbar.tsx
```

Boton:

```text
Aprobar
```

Endpoint:

```text
POST /api/v1/control-personal/boletas-comision/aprobar-comisiones-recepcionados
```

Aprueba todas las boletas en estado `RECEPCIONADO`.

## PDF de boleta

Funcion frontend:

```text
imprimirComisionFormulario()
```

Endpoint:

```text
GET /api/v1/control-personal/boletas-comision/reporte/{hash}
```

La respuesta se recibe como `Blob`. En desktop se muestra en modal PDF; en mobile se prioriza descarga.

Hay una documentacion especifica del flujo PDF en:

```text
client/doc/boleta-comsion.md
```

## Reporte general

Archivos:

```text
comision-report-modal/ReportModalFormWrapper.tsx
comision-report-modal/ReportModalForm.tsx
```

Endpoint:

```text
POST /api/v1/control-personal/boletas-comision/reporte-general
```

Se envia `FormData` con:

```text
fechaInicio
fechaFin
estado
tipoComision
```

La respuesta tambien se recibe como `Blob` y se abre en el visor PDF.

## Gestion QR

Hay componentes preparados para lectura QR:

```text
components/QRReaderComponent.tsx
hooks/useQRReader.tsx
```

Actualmente la ruta de recepcion por QR esta comentada en `ComisionPage.tsx`. La funcion disponible para procesar una lectura QR usa el mismo endpoint de cambios de estado:

```text
POST /api/v1/control-personal/boletas-comision/comision-qr
```

## Relacion con ApiBaseUpea

El frontend no consulta ApiBaseUpea directamente. Siempre pasa por ApiSiacop.

Flujo:

```text
React -> ApiSiacop -> ApiBaseUpea -> base_upea
```

Casos principales:

- Autocompletar solicitante.
- Enriquecer listado con nombre, CI, cargo y unidad.
- Obtener datos completos para PDF.
- Obtener sucursales de caja salud.
- Validar asignacion activa del usuario.

## Consideraciones

- No filtrar por nombre en frontend despues de paginar. El filtro debe resolverse en backend antes de paginar.
- El valor clave para comisiones es `id_asignacion_administrativo`, no `id_persona`.
- El buscador de solicitante debe mantener debounce para no saturar ApiBaseUpea.
- Si ApiBaseUpea falla, el listado puede degradar datos personales y mostrar advertencia.
