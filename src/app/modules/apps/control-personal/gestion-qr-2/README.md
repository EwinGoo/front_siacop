# 📱 Sistema de Gestión por QR - Refactorizado

Sistema profesional y escalable para gestionar documentos (Comisiones, Permisos, Vacaciones) mediante códigos QR.

## 🎯 Características Principales

✅ **Arquitectura basada en Strategy Pattern** - Fácil extensión  
✅ **Factory Pattern** - Creación centralizada de servicios  
✅ **Context API** - Estado global sin Redux  
✅ **Modales Bootstrap 5** - UI consistente con Metronic  
✅ **TypeScript** - Type-safe  
✅ **Config-driven** - Agregar tipos sin tocar lógica  

---

## 📂 Estructura del Proyecto

```
gestion-qr/
├── config/
│   └── documentTypes.config.ts          # ⚙️ Configuración declarativa
├── core/
│   ├── types/                           # 📝 Tipos base
│   ├── BaseDocumentService.ts           # 🔧 Clase abstracta
│   └── DocumentServiceFactory.ts        # 🏭 Factory pattern
├── strategies/
│   ├── ComisionStrategy.ts              # 💼 Lógica comisiones
│   ├── PermisoStrategy.ts               # 📅 Lógica permisos
│   └── VacacionStrategy.ts              # ☀️ Lógica vacaciones (NUEVA)
├── adapters/
│   ├── ComisionAdapter.ts               # 🔄 Transformación comisiones
│   ├── PermisoAdapter.ts                # 🔄 Transformación permisos
│   └── VacacionAdapter.ts               # 🔄 Transformación vacaciones (NUEVA)
├── components/
│   ├── Modal/                           # 🖼️ Sistema de modales BS5
│   ├── Cards/                           # 📊 Tarjetas de información
│   ├── ControlPanel/                    # 🎛️ Panel de control
│   └── QRScanner/                       # 📷 Escáner QR
├── context/
│   └── DocumentProcessorContext.tsx     # 🌐 Estado global
├── hooks/
│   ├── useDocumentActions.ts            # ⚡ Acciones CRUD
│   └── useQRScanner.ts                  # 📱 Hook principal
├── utils/
│   └── qrUtils.ts                       # 🛠️ Utilidades QR
├── GestionQrPage.tsx                    # 📄 Página principal
└── index.ts                             # 📦 Exports
```

---

## 🚀 Cómo Agregar un Nuevo Tipo de Documento

### Ejemplo: Agregar "Becas"

#### **1. Crear Strategy (2 minutos)**

```typescript
// strategies/BecaStrategy.ts
import { BaseDocumentService } from '../core/BaseDocumentService'
import { ActionResponse, ProcessStateParams, UnifiedDocument } from '../core/types'
import { BecaAdapter } from '../adapters/BecaAdapter'
import { getBecaById, procesarEstadoBeca } from '../../becas/core/_requests'

export class BecaStrategy extends BaseDocumentService {
  private adapter = new BecaAdapter()

  async getById(id: ID): Promise<any> {
    return await getBecaById(id)
  }

  async procesarRecepcion(codigo: string, fechaHora: string): Promise<ActionResponse> {
    const response = await procesarEstadoBeca({ id, action: 'receive', fecha: fechaHora })
    return { success: true, message: 'Beca recepcionada', nro_correlativo: response.data.data }
  }

  async aprobar(codigo: string): Promise<ActionResponse> {
    await procesarEstadoBeca({ id, action: 'approve' })
    return { success: true, message: 'Beca aprobada' }
  }

  async registrarObservacion(codigo: string, observacion: string): Promise<ActionResponse> {
    await procesarEstadoBeca({ id, action: 'observe', observacion })
    return { success: true, message: 'Observación registrada' }
  }

  async procesarEstado(params: ProcessStateParams): Promise<ActionResponse> {
    const response = await procesarEstadoBeca(params)
    return { success: true, message: 'Estado procesado', data: response.data }
  }

  transformToUnified(data: any): UnifiedDocument {
    return this.adapter.transform(data)
  }
}
```

#### **2. Crear Adapter (3 minutos)**

```typescript
// adapters/BecaAdapter.ts
import { Beca } from '../../becas/core/_models'
import { UnifiedDocument } from '../core/types'

export class BecaAdapter {
  transform(beca: Beca): UnifiedDocument {
    return {
      tipo_documento: 'BECA',
      id: beca.id_beca,
      codigo: beca.id_beca.toString(),
      estado: beca.estado_beca,
      nro_correlativo: beca.nro_correlativo,
      
      ci: beca.ci,
      nombre_generador: beca.nombre_estudiante,
      
      fecha_inicio: beca.fecha_inicio_beca,
      fecha_fin: beca.fecha_fin_beca,
      
      tipo_permiso: beca.tipo_beca,
      descripcion: `Beca de ${beca.monto} Bs.`,
      observacion: beca.observacion
    }
  }
}
```

#### **3. Agregar a Config (1 minuto)**

```typescript
// config/documentTypes.config.ts
export const DOCUMENT_TYPES_CONFIG = {
  // ... COMISION, PERMISO, VACACION existentes ...
  
  BECA: {  // ⭐ SOLO AGREGAR ESTO
    key: 'BECA',
    code: 'B',  // Código QR: B123
    label: 'Beca',
    labelPlural: 'Becas',
    description: 'Solicitudes de becas',
    icon: 'bi-book',
    color: 'success',
    badgeColor: 'badge-light-success',
    tipoPermiso: 'beca',  // Nuevo tipo
    strategyClass: BecaStrategy,
    adapterClass: BecaAdapter,
    states: {
      GENERADO: { label: 'Generado', color: 'secondary', action: 'reception' },
      RECEPCIONADO: { label: 'Recepcionado', color: 'info', action: 'approve' },
      APROBADO: { label: 'Aprobado', color: 'success', action: 'view' }
    }
  }
}
```

#### **4. Actualizar Tipos (1 minuto)**

```typescript
// core/types/document.types.ts
export type DocumentTypeKey = 'COMISION' | 'PERMISO' | 'VACACION' | 'BECA'  // ⭐ Agregar BECA

// core/types/base.types.ts
export type TipoPermiso = 'hora' | 'dia' | 'vacacion' | 'beca'  // ⭐ Agregar beca
```

#### **5. ¡Listo! 🎉**

El sistema ahora reconoce automáticamente códigos QR que empiecen con `B` como Becas.

```typescript
// Automáticamente funciona:
const codigo = "B456"  // QR escaneado
// → Factory detecta 'B' → Crea BecaStrategy → Muestra modal con info de beca
```

---

## 🔑 Conceptos Clave

### **1. Strategy Pattern**
Cada tipo de documento tiene su propia estrategia de procesamiento:
- `ComisionStrategy` → Maneja comisiones
- `PermisoStrategy` → Maneja permisos
- `VacacionStrategy` → Maneja vacaciones

### **2. Factory Pattern**
`DocumentServiceFactory` crea el servicio correcto automáticamente:

```typescript
// Por código QR
const service = DocumentServiceFactory.createByCode('C')  // → ComisionStrategy

// Por tipo
const service = DocumentServiceFactory.createByKey('PERMISO')  // → PermisoStrategy
```

### **3. Adapter Pattern**
Transforma datos del backend al formato unificado:

```typescript
// Backend → Adapter → UnifiedDocument
const comision = await getComisionById(id)  // Backend format
const unified = comisionAdapter.transform(comision)  // Unified format
```

### **4. UnifiedDocument**
Formato estándar para todos los documentos:

```typescript
interface UnifiedDocument {
  tipo_documento: 'COMISION' | 'PERMISO' | 'VACACION'
  id: ID
  codigo: string
  estado: EstadoDocumento
  nombre_generador?: string
  fecha_inicio: string
  // ... campos comunes y específicos
}
```

---

## 🎨 Sistema de Modales

### **Modales Disponibles:**

1. **DocumentModal** - Muestra detalles del documento
2. **ObservacionModal** - Registrar observaciones
3. **LoadingModal** - Feedback de carga
4. **SuccessModal** - Confirmación de éxito
5. **ErrorModal** - Manejo de errores
6. **IngresoManualModal** - Ingreso manual de código

### **Uso:**

```typescript
const { modalState, showModal, hideModal } = useModalManager()

// Mostrar modal
showModal(unifiedDocument)

// Ocultar modal
hideModal()
```

---

## 📊 Context API

### **DocumentProcessorContext** provee:

```typescript
{
  // Configuración
  modoRecepcion: 'automatico' | 'manual',
  tipoPermiso: 'hora' | 'dia' | 'vacacion',
  fechaHora: string,
  isPaused: boolean,
  loading: boolean,
  
  // Historial
  lastScanned: { code, tipoPermiso, timestamp },
  scannedHistory: [...],
  
  // Acciones
  setModoRecepcion: (modo) => void,
  setTipoPermiso: (tipo) => void,
  addToHistory: (code, tipo) => void,
  // ... más acciones
}
```

### **Uso:**

```typescript
const GestionQrPage = () => (
  <DocumentProcessorProvider>
    <App />
  </DocumentProcessorProvider>
)

// En cualquier componente hijo:
const { tipoPermiso, setTipoPermiso } = useDocumentProcessor()
```

---

## 🔄 Flujo Completo

```
1. QR Escaneado (ej: "C123")
   ↓
2. extractCodeFromURL("C123") → "C123"
   ↓
3. parseCode("C123") → tipoPermiso: 'hora'
   ↓
4. DocumentServiceFactory.createByTipoPermiso('hora')
   ↓
5. ComisionStrategy creada
   ↓
6. service.getById(123) → Datos del backend
   ↓
7. ComisionAdapter.transform(data) → UnifiedDocument
   ↓
8. showModal(unifiedDocument)
   ↓
9. Usuario elige acción (Recepcionar/Aprobar/Observar)
   ↓
10. service.procesarRecepcion(123, fecha)
    ↓
11. SuccessModal con resultado
```

---

## 🛠️ Utilidades

### **QR Utils:**
- `QRCodeCache` - Evita escaneos duplicados (5 segundos)
- `validateQRCode` - Valida formato
- `extractCodeFromURL` - Extrae código limpio
- `parseQRContent` - Parse JSON o texto

### **Parse Utils:**
- `parseCode(code)` - Determina tipo por prefijo (C/P/V)
- `parseIDNumeric(code)` - Extrae número del código
- `buildCode(id, tipo)` - Construye código completo

---

## 🧪 Testing

### **Agregar Tests:**

```typescript
// __tests__/strategies/BecaStrategy.test.ts
describe('BecaStrategy', () => {
  it('should fetch beca by id', async () => {
    const strategy = new BecaStrategy()
    const beca = await strategy.getById(1)
    expect(beca).toBeDefined()
  })
})
```

---

## 📝 Notas Importantes

### **Estados:**
- `GENERADO` - Documento creado
- `ENVIADO` - Enviado a aprobación
- `RECEPCIONADO` - Recibido por autoridad
- `APROBADO` - Aprobado
- `OBSERVADO` - Con observaciones (comentado por defecto)

### **Acciones:**
- `reception` - Recepcionar documento
- `approve` - Aprobar documento
- `observe` - Registrar observación
- `view` - Solo visualizar

### **Modos:**
- `automatico` - Recepciona automáticamente estados GENERADO/ENVIADO
- `manual` - Siempre muestra modal para confirmar

---

## 🤝 Contribuir

Para agregar un nuevo tipo de documento:

1. Crear Strategy en `strategies/`
2. Crear Adapter en `adapters/`
3. Agregar entrada en `config/documentTypes.config.ts`
4. Actualizar tipos en `core/types/`
5. ¡Listo! El sistema lo reconocerá automáticamente

---

## 📞 Soporte

Si tienes dudas sobre la arquitectura o cómo extender el sistema, consulta este README o revisa los ejemplos en el código.

---

**Desarrollado con ❤️ para UPEA**  
*Versión refactorizada - Enero 2026*
