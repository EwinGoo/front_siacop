# 🏗️ Arquitectura del Sistema

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GESTION QR PAGE                                 │
│                   (DocumentProcessorProvider)                            │
└───────────────────┬──────────────────────────────┬──────────────────────┘
                    │                              │
        ┌───────────▼──────────┐      ┌───────────▼──────────┐
        │   QRScannerPanel     │      │   ControlPanel       │
        │   - Escáner QR       │      │   - Modo Recepción   │
        │   - Validación       │      │   - Tipo Permiso     │
        │   - Cache            │      │   - Fecha/Hora       │
        └──────────┬───────────┘      └──────────────────────┘
                   │
                   │ QR Detected
                   │
        ┌──────────▼───────────┐
        │   useQRScanner       │ ◄──────┐
        │   - handleQRDetected │        │
        │   - handleModal      │        │
        │   - handleActions    │        │
        └──────────┬───────────┘        │
                   │                    │
                   │                    │ Context
        ┌──────────▼───────────┐        │
        │  useDocumentActions  │        │
        │  - fetchDocument     │        │
        │  - executeAction     │        │
        └──────────┬───────────┘        │
                   │                    │
                   │                    │
        ┌──────────▼───────────────────▼─────────┐
        │  DocumentServiceFactory                │
        │  - createByCode('C')  → ComisionStrategy│
        │  - createByCode('P')  → PermisoStrategy │
        │  - createByCode('V')  → VacacionStrategy│
        └──────────┬─────────────────────────────┘
                   │
       ┌───────────┴──────────┬───────────────┐
       │                      │               │
┌──────▼──────┐      ┌───────▼──────┐  ┌────▼──────┐
│ Comision    │      │  Permiso     │  │ Vacacion  │
│ Strategy    │      │  Strategy    │  │ Strategy  │
│             │      │              │  │           │
│ - getById   │      │  - getById   │  │ - getById │
│ - procesar  │      │  - procesar  │  │ - procesar│
│ - aprobar   │      │  - aprobar   │  │ - aprobar │
└──────┬──────┘      └───────┬──────┘  └────┬──────┘
       │                     │               │
       │ uses                │ uses          │ uses
       │                     │               │
┌──────▼──────┐      ┌───────▼──────┐  ┌────▼──────┐
│ Comision    │      │  Permiso     │  │ Vacacion  │
│ Adapter     │      │  Adapter     │  │ Adapter   │
│             │      │              │  │           │
│ transform() │      │ transform()  │  │transform()│
└─────────────┘      └──────────────┘  └───────────┘
       │                     │               │
       └─────────────────────┴───────────────┘
                             │
                             │ Returns
                             │
                    ┌────────▼──────────┐
                    │  UnifiedDocument  │
                    │  - tipo_documento │
                    │  - estado         │
                    │  - nombre_generador│
                    │  - fecha_inicio   │
                    │  - ...            │
                    └────────┬──────────┘
                             │
                             │ Displayed in
                             │
                    ┌────────▼──────────┐
                    │  DocumentModal    │
                    │  (Bootstrap 5)    │
                    │  - Header         │
                    │  - Body           │
                    │  - Footer         │
                    └───────────────────┘
```

---

## Flujo de Datos

```
┌──────────┐
│ QR Scan  │
└─────┬────┘
      │
      │ 1. Code: "C123"
      ▼
┌─────────────┐
│ Validation  │  ◄──── QRCodeCache (evita duplicados)
└─────┬───────┘
      │
      │ 2. Valid Code
      ▼
┌──────────────┐
│ Parse Code   │  parseCode("C123") → tipoPermiso: 'hora'
└─────┬────────┘
      │
      │ 3. tipoPermiso: 'hora'
      ▼
┌────────────────────┐
│ Factory.create     │  createByTipoPermiso('hora')
└─────┬──────────────┘
      │
      │ 4. ComisionStrategy instance
      ▼
┌─────────────────┐
│ getById(123)    │  ◄──── API Request
└─────┬───────────┘
      │
      │ 5. Raw Comision data
      ▼
┌──────────────────┐
│ Adapter.transform │
└─────┬────────────┘
      │
      │ 6. UnifiedDocument
      ▼
┌──────────────┐
│ Modal.show() │  ◄──── User sees document details
└─────┬────────┘
      │
      │ 7. User clicks "Recepcionar"
      ▼
┌─────────────────────┐
│ executeAction()     │
│ - action: reception │
│ - fechaHora         │
└─────┬───────────────┘
      │
      │ 8. Call strategy.procesarRecepcion()
      ▼
┌────────────────┐
│ API Request    │  ◄──── procesarEstadoComision()
└─────┬──────────┘
      │
      │ 9. Success Response
      ▼
┌─────────────────┐
│ SuccessModal    │  "Comisión recepcionada!"
└─────────────────┘
```

---

## Arquitectura de Capas

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                │
│   (React Components, Modales, UI)           │
├─────────────────────────────────────────────┤
│  • GestionQrPage.tsx                        │
│  • DocumentModal, ObservacionModal, etc.    │
│  • ControlPanel, QRScannerPanel             │
│  • Cards (HistorialCard, UltimoCodigoCard)  │
└──────────────────┬──────────────────────────┘
                   │
                   │ Uses
                   │
┌──────────────────▼──────────────────────────┐
│           APPLICATION LAYER                 │
│   (Hooks, Context, Business Logic)          │
├─────────────────────────────────────────────┤
│  • useQRScanner (Orchestrator)              │
│  • useDocumentActions (CRUD Operations)     │
│  • DocumentProcessorContext (Global State)  │
│  • useModalManager (Modal State)            │
└──────────────────┬──────────────────────────┘
                   │
                   │ Uses
                   │
┌──────────────────▼──────────────────────────┐
│           DOMAIN LAYER                      │
│   (Strategies, Adapters, Core Logic)        │
├─────────────────────────────────────────────┤
│  • DocumentServiceFactory (Factory)         │
│  • ComisionStrategy, PermisoStrategy, etc.  │
│  • ComisionAdapter, PermisoAdapter, etc.    │
│  • UnifiedDocument (Domain Model)           │
└──────────────────┬──────────────────────────┘
                   │
                   │ Uses
                   │
┌──────────────────▼──────────────────────────┐
│           INFRASTRUCTURE LAYER              │
│   (API Calls, External Services)            │
├─────────────────────────────────────────────┤
│  • getComisionById()                        │
│  • procesarEstadoComision()                 │
│  • getAsistenciaPermisoById()               │
│  • procesarEstadoPermiso()                  │
│  • getVacacionById()                        │
│  • procesarEstadoVacacion()                 │
└─────────────────────────────────────────────┘
```

---

## Patrones de Diseño

### **1. Strategy Pattern**

```
BaseDocumentService (Abstract)
        ↑
        ├── ComisionStrategy
        ├── PermisoStrategy
        └── VacacionStrategy

Cada estrategia implementa:
- getById()
- procesarRecepcion()
- aprobar()
- registrarObservacion()
- transformToUnified()
```

### **2. Factory Pattern**

```
DocumentServiceFactory
    │
    ├─ createByCode('C')      → ComisionStrategy
    ├─ createByCode('P')      → PermisoStrategy
    ├─ createByCode('V')      → VacacionStrategy
    │
    ├─ createByKey('COMISION') → ComisionStrategy
    └─ createByTipoPermiso('hora') → ComisionStrategy
```

### **3. Adapter Pattern**

```
Backend Data → Adapter → UnifiedDocument

Comision (Backend)  ─┐
Permiso (Backend)   ─┼→ Adapter.transform() → UnifiedDocument
Vacacion (Backend)  ─┘
```

### **4. Context Pattern**

```
DocumentProcessorProvider
    │
    └─ useDocumentProcessor() hook
        │
        ├─ Global State (tipoPermiso, modoRecepcion, etc.)
        ├─ Actions (setTipoPermiso, addToHistory, etc.)
        └─ Shared across all components
```

---

## Estructura de Tipos

```typescript
// Base Types
EstadoDocumento = 'GENERADO' | 'ENVIADO' | 'RECEPCIONADO' | 'APROBADO' | 'OBSERVADO'
AccionDocumento = 'view' | 'reception' | 'approve' | 'observe'
TipoPermiso = 'hora' | 'dia' | 'vacacion'

// Document Types
DocumentTypeKey = 'COMISION' | 'PERMISO' | 'VACACION'

UnifiedDocument {
  tipo_documento: DocumentTypeKey
  id: ID
  codigo: string
  estado: EstadoDocumento
  // ... más campos
}

DocumentTypeConfig {
  key: DocumentTypeKey
  code: string  // 'C', 'P', 'V'
  label: string
  icon: string
  color: string
  strategyClass: Class
  adapterClass: Class
  states: Record<string, StateConfig>
}
```

---

## Dependencias

```
┌──────────────────┐
│  React 18+       │
│  TypeScript 4.5+ │
└────────┬─────────┘
         │
         │ Requires
         │
┌────────▼─────────┐
│ React Bootstrap  │ ◄─── Para modales
│ Bootstrap 5      │
└────────┬─────────┘
         │
         │ Uses
         │
┌────────▼──────────┐
│ Metronic Theme    │ ◄─── PageTitle, helpers
└────────┬──────────┘
         │
         │ Integrates with
         │
┌────────▼──────────┐
│ Backend API       │ ◄─── CRUD operations
│ - Comisiones      │
│ - Permisos        │
│ - Vacaciones      │
└───────────────────┘
```

---

## Extensibilidad

Para agregar un nuevo tipo (ej: Becas):

```
1. Crear BecaStrategy.ts
   └─ implements BaseDocumentService

2. Crear BecaAdapter.ts
   └─ transform(Beca) → UnifiedDocument

3. Actualizar config/documentTypes.config.ts
   └─ Agregar entrada BECA

4. Actualizar types
   └─ DocumentTypeKey = '...' | 'BECA'
   └─ TipoPermiso = '...' | 'beca'

5. ¡Listo! El sistema reconoce automáticamente códigos B123
```

---

## Performance

### **Optimizaciones**

1. **Singleton Pattern** - Factory crea instancias únicas
2. **QR Cache** - Evita escaneos duplicados (5s)
3. **Context API** - Estado compartido sin re-renders innecesarios
4. **React.memo** - Componentes memorizados donde necesario
5. **Lazy Loading** - Carga bajo demanda (si aplicable)

---

**Esta arquitectura asegura:**
- ✅ Escalabilidad
- ✅ Mantenibilidad
- ✅ Testabilidad
- ✅ Extensibilidad
- ✅ Type Safety
