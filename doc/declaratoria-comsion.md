# Flujo de PDF en declaratoria comisión

## Resumen

El módulo `declaratoria-comision` genera el PDF desde backend y lo muestra en frontend dentro de un modal. El flujo principal no abre directamente una URL con `target="_blank"` desde la tabla; primero solicita el reporte, recibe el PDF en base64 y luego lo renderiza en un `iframe`.

## Archivos principales

- `declaratoria-comision-list/table/columns/ActionsCell.tsx`
- `declaratoria-comision-list/core/_requests.ts`
- `declaratoria-comision-list/hooks/useModalManager.ts`
- `declaratoria-comision-list/DeclaratoriaComisionList.tsx`
- `declaratoria-comision-list/pdf-modal/PDFModal.tsx`

## Flujo actual

1. En `ActionsCell.tsx`, al seleccionar la acción `Imprimir`, se ejecuta:

```ts
imprimirDeclaratoriaComision(declaratoria.hash)
```

2. La función `imprimirDeclaratoriaComision` está en `_requests.ts` y consume el endpoint:

```ts
GET /declaratoria-comision/reporte/{id}
```

3. El backend responde con una estructura que incluye:

```ts
{
  pdf_base64: string
  filename: string
}
```

4. Cuando la petición termina correctamente, `ActionsCell.tsx` envía los datos al manejador del modal:

```ts
onShowPDF({
  base64: response.pdf_base64,
  filename: response.filename,
  declaratoria: declaratoria,
})
```

5. `useModalManager.ts` guarda el PDF actual en estado y abre el modal:

```ts
setCurrentPDFData(pdfData)
setShowPDFModal(true)
```

6. `DeclaratoriaComisionList.tsx` mantiene una sola instancia global del modal:

```tsx
<PDFModal {...pdfModalProps} />
```

7. `PDFModal.tsx` convierte el `base64` a `Blob`, crea un `ObjectURL` y lo muestra:

```ts
const byteCharacters = atob(pdfBase64)
const byteArray = new Uint8Array(byteNumbers)
const blob = new Blob([byteArray], {type: 'application/pdf'})
const url = URL.createObjectURL(blob)
```

En desktop, el PDF se renderiza dentro de:

```tsx
<iframe src={pdfUrl} />
```

En mobile, muestra una vista simplificada recomendando descargar el PDF.

## Funciones disponibles en el modal

El modal `PDFModal.tsx` permite:

- Ver el PDF en un `iframe` en desktop.
- Abrir el PDF en una nueva pestaña.
- Descargar el archivo.
- Imprimir el PDF.
- Liberar el `ObjectURL` con `URL.revokeObjectURL`.

## Observaciones

El flujo es recomendable cuando se necesita controlar la experiencia del usuario dentro del sistema, porque evita sacar al usuario inmediatamente a otra pestaña y permite mostrar acciones como descargar, imprimir o cerrar desde el mismo modal.

También es útil cuando el backend genera el PDF dinámicamente y no se quiere exponer una URL pública directa del archivo.

## Riesgos o puntos a mejorar

- Enviar PDF como base64 aumenta el tamaño de la respuesta aproximadamente un 33% frente a un `Blob` binario.
- Para PDFs grandes, el uso de `atob` y la conversión manual pueden consumir memoria y bloquear un poco la UI.
- El `ObjectURL` debe limpiarse correctamente para evitar fugas de memoria. El modal ya intenta hacerlo con `URL.revokeObjectURL`.
- En móviles, los `iframe` con PDF suelen ser poco confiables; por eso la vista móvil de descarga es una buena decisión.
- Hay un pequeño riesgo de que el `cleanup` del `useEffect` use un `pdfUrl` anterior por cierre de estado. Sería más robusto revocar la URL creada dentro del mismo efecto.

## Recomendación técnica

Para PDFs pequeños o medianos, este flujo está bien y da una experiencia profesional.

Para PDFs pesados o de uso muy frecuente, sería mejor que el endpoint retorne `application/pdf` como `Blob` y que el frontend use `responseType: 'blob'`. Eso reduce memoria, evita base64 y simplifica la conversión.

Una alternativa intermedia es mantener el modal, pero cambiar el request para recibir binario:

```ts
axiosClient.get(url, {responseType: 'blob'})
```

Luego se puede crear el `ObjectURL` directamente:

```ts
const url = URL.createObjectURL(response.data)
```

Así se conserva la misma UI del modal, pero con un flujo más eficiente.
