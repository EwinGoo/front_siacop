# 🔄 Guía de Migración - Sistema Gestión QR v1.0 → v2.0

Esta guía te ayudará a migrar del sistema anterior al nuevo sistema refactorizado.

---

## 📋 Resumen de Cambios

| Concepto | v1.0 (Anterior) | v2.0 (Nuevo) |
|----------|-----------------|--------------|
| **Servicios** | `unifiedService` | `DocumentServiceFactory` |
| **Modales** | SweetAlert2 | Bootstrap 5 Modals |
| **Estado** | Props drilling | Context API |
| **Transformación** | `DataAdapter` estático | Adapters por tipo |
| **Tipos** | Genérico `UnifiedData` | `UnifiedDocument` tipado |

---

## 🚀 Pasos de Migración

### **PASO 1: Actualizar Imports**

#### **Servicios**

```typescript
// ❌ ANTES
import { unifiedService } from './services/unifiedService'
import { comisionService } from './services/comisionService'
import { permisoService } from './services/permisoService'

// ✅ AHORA
import { DocumentServiceFactory } from './core'
import { ComisionStrategy } from './strategies'
import { PermisoStrategy } from './strategies'
```

#### **Tipos**

```typescript
// ❌ ANTES
import { UnifiedData, TipoDocumento } from './types/data.types'

// ✅ AHORA
import { UnifiedDocument, DocumentTypeKey } from './core/types'
```

#### **Componentes**

```typescript
// ❌ ANTES
import { UnifiedModalService } from './components/Process/UnifiedModal'
import { RecepcionProcessorService } from './components/Process/RecepcionProcessor'

// ✅ AHORA
import { DocumentModal, useModalManager } from './components/Modal'
import { useDocumentActions } from './hooks'
```

---

### **PASO 2: Refactorizar Servicios**

#### **Obtener Documento**

```typescript
// ❌ ANTES
const data = await unifiedService.getDataByType(code, tipoPermiso)

// ✅ AHORA
const service = DocumentServiceFactory.createByTipoPermiso(tipoPermiso)
const rawData = await service.getById(code)
const unifiedDoc = service.transformToUnified(rawData)
```

#### **Procesar Recepción**

```typescript
// ❌ ANTES
const result = await unifiedService.procesarRecepcionByType(codigo, fechaHora, tipoPermiso)

// ✅ AHORA
const service = DocumentServiceFactory.createByTipoPermiso(tipoPermiso)
const result = await service.procesarRecepcion(codigo, fechaHora)
```

#### **Aprobar Documento**

```typescript
// ❌ ANTES
await unifiedService.aprobarComisionByType(codigo, tipoPermiso)

// ✅ AHORA
const service = DocumentServiceFactory.createByTipoPermiso(tipoPermiso)
await service.aprobar(codigo)
```

#### **Registrar Observación**

```typescript
// ❌ ANTES
await unifiedService.registrarObservacionByType(codigo, observacion, tipoPermiso)

// ✅ AHORA
const service = DocumentServiceFactory.createByTipoPermiso(tipoPermiso)
await service.registrarObservacion(codigo, observacion)
```

---

### **PASO 3: Migrar Modales**

#### **Modal Principal**

```typescript
// ❌ ANTES (SweetAlert2)
import Swal from 'sweetalert2'
import { UnifiedModalService } from './components/Process/UnifiedModal'

const result = await UnifiedModalService.showUnifiedModal({
  data: unifiedData,
  formatToBolivianDate: formatDate
})

if (result.confirmed) {
  // Procesar acción
}

// ✅ AHORA (Bootstrap 5)
import { DocumentModal, useModalManager } from './components/Modal'

const { modalState, showModal, hideModal } = useModalManager()

// Mostrar modal
showModal(unifiedDocument)

// En el componente:
<DocumentModal
  show={modalState.show}
  document={modalState.document}
  onHide={hideModal}
  onAction={(result) => {
    if (result.confirmed) {
      // Procesar acción
    }
  }}
  formatDate={formatToBolivianDate}
/>
```

#### **Modal de Observación**

```typescript
// ❌ ANTES (SweetAlert2)
const { value: observacion } = await Swal.fire({
  title: 'Registrar Observación',
  input: 'textarea',
  // ... config
})

// ✅ AHORA (Bootstrap 5)
const [showObservacionModal, setShowObservacionModal] = useState(false)

<ObservacionModal
  show={showObservacionModal}
  document={currentDocument}
  onConfirm={(observacion) => {
    // Procesar observación
    setShowObservacionModal(false)
  }}
  onCancel={() => setShowObservacionModal(false)}
/>
```

#### **Modales de Feedback**

```typescript
// ❌ ANTES
import { showSuccessModal, showErrorModal } from './utils/swalConfig'

await showSuccessModal('Éxito', 'Operación completada')
await showErrorModal('Error', 'Algo salió mal')

// ✅ AHORA
const [feedbackModal, setFeedbackModal] = useState({
  success: false,
  error: false,
  title: '',
  message: ''
})

<SuccessModal
  show={feedbackModal.success}
  title={feedbackModal.title}
  message={feedbackModal.message}
  onClose={() => setFeedbackModal({ success: false, error: false, title: '', message: '' })}
/>

<ErrorModal
  show={feedbackModal.error}
  title={feedbackModal.title}
  message={feedbackModal.message}
  onClose={() => setFeedbackModal({ success: false, error: false, title: '', message: '' })}
/>
```

---

### **PASO 4: Implementar Context API**

#### **Envolver con Provider**

```typescript
// ❌ ANTES
const GestionQrPage = () => {
  const [tipoPermiso, setTipoPermiso] = useState('hora')
  const [modoRecepcion, setModoRecepcion] = useState('automatico')
  // ... más estados

  return (
    <div>
      <ControlPanel
        tipoPermiso={tipoPermiso}
        setTipoPermiso={setTipoPermiso}
        modoRecepcion={modoRecepcion}
        setModoRecepcion={setModoRecepcion}
        // ... más props
      />
    </div>
  )
}

// ✅ AHORA
import { DocumentProcessorProvider, useDocumentProcessor } from './context'

const GestionQrPage = () => (
  <DocumentProcessorProvider>
    <GestionQrPageContent />
  </DocumentProcessorProvider>
)

const GestionQrPageContent = () => {
  const {
    tipoPermiso,
    setTipoPermiso,
    modoRecepcion,
    setModoRecepcion,
    // ... todo disponible desde context
  } = useDocumentProcessor()

  return (
    <div>
      <ControlPanel
        tipoPermiso={tipoPermiso}
        onTipoPermisoChange={setTipoPermiso}
        modoRecepcion={modoRecepcion}
        onModoRecepcionChange={setModoRecepcion}
      />
    </div>
  )
}
```

---

### **PASO 5: Usar Hooks Especializados**

#### **Hook Principal `useQRScanner`**

```typescript
// ❌ ANTES
const GestionQrPageContent = () => {
  const [loading, setLoading] = useState(false)
  const [lastScanned, setLastScanned] = useState(null)
  // ... muchos estados

  const handleQRDetected = async (result) => {
    setLoading(true)
    try {
      const data = await unifiedService.getDataByType(code, tipoPermiso)
      // ... lógica compleja
    } catch (error) {
      // ... manejo de error
    }
    setLoading(false)
  }

  return <QRScanner onQRDetected={handleQRDetected} />
}

// ✅ AHORA
const GestionQrPageContent = () => {
  const scanner = useQRScanner()

  return (
    <>
      <QRScanner onQRDetected={scanner.handleQRDetected} />
      
      <DocumentModal
        show={scanner.modalState.show}
        document={scanner.modalState.document}
        onHide={scanner.hideModal}
        onAction={scanner.handleModalAction}
      />
      
      <LoadingModal show={scanner.feedbackModal.loading} />
      <SuccessModal show={scanner.feedbackModal.success} {...} />
      <ErrorModal show={scanner.feedbackModal.error} {...} />
    </>
  )
}
```

#### **Hook de Acciones `useDocumentActions`**

```typescript
// ❌ ANTES
const handleAction = async (action, document) => {
  const service = tipoPermiso === 'dia' ? permisoService : comisionService
  
  if (action === 'reception') {
    await service.procesarRecepcion(document.codigo, fechaHora)
  } else if (action === 'approve') {
    await service.aprobar(document.codigo)
  }
  // ... más lógica
}

// ✅ AHORA
const { executeAction } = useDocumentActions()

const handleAction = async (action, document) => {
  await executeAction(action, document, {
    fechaHora: context.fechaHora,
    observacion: observacionText
  })
}
```

---

### **PASO 6: Actualizar Transformación de Datos**

#### **Adapters Específicos**

```typescript
// ❌ ANTES
import { DataAdapter } from './services/dataAdapter'

const unifiedData = DataAdapter.fromComision(comisionData)
const displayInfo = DataAdapter.getDisplayInfo(unifiedData)

// ✅ AHORA
import { ComisionAdapter } from './adapters/ComisionAdapter'
import { getDocumentTypeByKey } from './config/documentTypes.config'

const adapter = new ComisionAdapter()
const unifiedDoc = adapter.transform(comisionData)

const config = getDocumentTypeByKey('COMISION')
const displayInfo = {
  titulo: config.label,
  subtitulo: `TIPO: ${unifiedDoc.tipo_permiso}`,
  icono: config.icon,
  color: config.color
}
```

---

### **PASO 7: Migrar Configuración**

#### **Config Declarativa**

```typescript
// ❌ ANTES (Código disperso)
const getTypeInfo = (tipoPermiso) => {
  if (tipoPermiso === 'dia') {
    return { label: 'Permiso', icon: 'bi-calendar', color: 'primary' }
  } else {
    return { label: 'Comisión', icon: 'bi-briefcase', color: 'info' }
  }
}

// ✅ AHORA (Config centralizada)
import { getDocumentTypeByKey, DOCUMENT_TYPES_CONFIG } from './config/documentTypes.config'

const config = getDocumentTypeByKey('PERMISO')
// config.label, config.icon, config.color, etc.

// O iterar todos los tipos:
const allTypes = Object.values(DOCUMENT_TYPES_CONFIG)
```

---

## 🎯 Checklist de Migración

- [ ] Actualizar imports de servicios
- [ ] Actualizar imports de tipos
- [ ] Reemplazar `unifiedService` con `DocumentServiceFactory`
- [ ] Migrar modales SweetAlert2 a Bootstrap 5
- [ ] Implementar Context API
- [ ] Usar hooks `useQRScanner` y `useDocumentActions`
- [ ] Actualizar transformación con Adapters específicos
- [ ] Migrar config a `documentTypes.config.ts`
- [ ] Probar flujo completo de QR
- [ ] Probar modo automático y manual
- [ ] Probar todos los estados (GENERADO, RECEPCIONADO, APROBADO)
- [ ] Probar observaciones
- [ ] Probar ingreso manual

---

## 🐛 Problemas Comunes

### **Error: "useDocumentProcessor must be used within DocumentProcessorProvider"**

**Solución:** Asegúrate de envolver tu componente con el Provider:

```typescript
<DocumentProcessorProvider>
  <YourComponent />
</DocumentProcessorProvider>
```

### **Error: "Cannot read property 'transform' of undefined"**

**Solución:** Verifica que el adapter esté correctamente instanciado:

```typescript
// ❌ MAL
const adapter = ComisionAdapter
const result = adapter.transform(data)

// ✅ BIEN
const adapter = new ComisionAdapter()
const result = adapter.transform(data)
```

### **Modales no se muestran**

**Solución:** Verifica que React Bootstrap esté importado:

```typescript
import { Modal, Button } from 'react-bootstrap'
```

---

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisa el README.md para ejemplos
2. Consulta el código existente en las strategies
3. Verifica el CHANGELOG.md para cambios breaking

---

## ✅ Validación Post-Migración

Después de migrar, verifica que:

1. ✅ Escaneo QR funciona correctamente
2. ✅ Ingreso manual funciona
3. ✅ Modales se muestran correctamente
4. ✅ Recepción automática funciona
5. ✅ Aprobación funciona
6. ✅ Observaciones funcionan
7. ✅ Historial se actualiza
8. ✅ No hay errores en console
9. ✅ Performance es similar o mejor
10. ✅ Todos los tipos (Comisión, Permiso, Vacación) funcionan

---

**¡Éxito en la migración! 🚀**

*Si todo funciona correctamente, puedes eliminar los archivos deprecated del sistema anterior.*
