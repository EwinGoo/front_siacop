# Flujo de PDF en boleta comisión

## Resumen

El módulo de comisiones muestra la boleta PDF dentro de un modal en desktop y ofrece descarga directa en mobile. A diferencia del flujo anterior, ya no abre el formulario directamente con `window.open(..., '_blank')` desde la acción principal.

El PDF se solicita como `Blob`, no como `base64`. Esto evita convertir texto base64 a bytes en frontend y reduce el consumo de memoria para archivos PDF.

## Archivos principales

- `comision-list/core/_requests.ts`
- `comision-list/core/_models.ts`
- `comision-list/hooks/useComisionPDFModal.ts`
- `comision-list/pdf-modal/PDFModal.tsx`
- `comision-list/ComisionList.tsx`
- `comision-list/table/ComisionTable.tsx`
- `comision-list/table/ComisionCards.tsx`
- `comision-list/table/columns/ActionsCell.tsx`
- `comision-list/table/columns/_columns.tsx`

## Flujo implementado

1. La acción `Imprimir` se ejecuta desde `ActionsCell.tsx`.

2. Si la comisión está en estado `GENERADO`, primero muestra una confirmación. Si el usuario confirma, se envía la comisión con:

```ts
procesarEstadoComision({code: id, action: 'send'})
```

3. Luego se solicita el PDF como binario:

```ts
imprimirComisionFormulario(hash)
```

4. La función está en `_requests.ts` y consume el endpoint existente:

```ts
GET /api/v1/control-personal/boletas-comision/reporte/{hash}
```

con:

```ts
responseType: 'blob'
```

5. El nombre del archivo se arma desde el carnet/CI de la comisión:

```ts
BOLETA_COMISION_<CARNET>.PDF
```

Ejemplo:

```text
BOLETA_COMISION_1234567.PDF
```

6. El resultado se envía al modal global:

```ts
onShowPDF({
  blob: response.data,
  filename,
})
```

7. `useComisionPDFModal.ts` guarda el `Blob` actual y abre el modal.

8. `PDFModal.tsx` crea una URL temporal:

```ts
const url = URL.createObjectURL(pdfBlob)
```

9. En desktop, el PDF se muestra en:

```tsx
<iframe src={pdfUrl} />
```

10. En mobile, no se intenta visualizar el PDF embebido porque los navegadores móviles suelen manejar mal los PDF dentro de `iframe`. En su lugar, se muestra una pantalla simple con botón para descargar.

## Ventajas de Blob sobre base64

- `Blob` representa el archivo binario real.
- `base64` aumenta el tamaño de la respuesta aproximadamente 33%.
- `Blob` evita usar `atob`, `Uint8Array` y conversiones manuales.
- `Blob` escala mejor para PDFs medianos o grandes.
- `Blob` se conecta directamente con `URL.createObjectURL`.

## Comportamiento por dispositivo

Desktop:

- Abre modal grande.
- Muestra el PDF en `iframe`.
- Permite abrir en nueva pestaña.
- Permite descargar.
- Permite imprimir.

Mobile:

- Abre modal adaptado.
- No renderiza `iframe`.
- Muestra botón `Descargar PDF`.

## Observaciones

El flujo es recomendable para boletas de comisión porque conserva al usuario dentro del sistema y evita saltar inmediatamente a otra pestaña. Además, al usar `Blob`, el frontend trabaja con el formato natural del PDF.

El endpoint debe responder con un PDF válido y `Content-Type: application/pdf`. El frontend no depende del `Content-Disposition` para nombrar el archivo; usa el formato `BOLETA_COMISION_<CARNET>.PDF`.

Si Base UPEA no devuelve los datos personales completos, el backend responde:

```text
Datos personales no disponibles. Intente más tarde.
```

En ese caso el frontend no abre el modal PDF y muestra el mensaje al usuario.

## Nota sobre reporte general

El reporte general de comisiones usa el mismo flujo de modal PDF.

El formulario `comision-report-modal/ReportModalFormWrapper.tsx` ya no crea un formulario HTML con `target='_blank'`. Ahora envía los filtros como `FormData` al endpoint modular:

```text
POST /api/v1/control-personal/boletas-comision/reporte-general
```

La respuesta se recibe como `Blob` y se abre en el mismo `PDFModal`. En mobile también se ofrece descarga del PDF en lugar de visor embebido.
