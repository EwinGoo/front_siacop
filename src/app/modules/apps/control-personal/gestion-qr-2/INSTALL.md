# 📦 Instrucciones de Instalación

## Requisitos Previos

- Node.js 16+
- React 18+
- React Bootstrap 5
- TypeScript 4.5+

## Instalación

### **Paso 1: Extraer Archivos**

```bash
# Extraer el ZIP
unzip gestion-qr-refactored.zip

# Navegar al directorio
cd gestion-qr-refactored
```

### **Paso 2: Integrar en tu Proyecto**

#### **Opción A: Reemplazar módulo existente**

```bash
# Hacer backup del módulo anterior
mv src/app/modules/apps/control-personal/gestion-qr src/app/modules/apps/control-personal/gestion-qr.backup

# Copiar nuevo módulo
cp -r gestion-qr-refactored src/app/modules/apps/control-personal/gestion-qr
```

#### **Opción B: Instalación nueva**

```bash
# Copiar al directorio de módulos
cp -r gestion-qr-refactored src/app/modules/apps/control-personal/gestion-qr
```

### **Paso 3: Instalar Dependencias**

Las siguientes dependencias deben estar instaladas en tu proyecto:

```bash
npm install react-bootstrap bootstrap
# O
yarn add react-bootstrap bootstrap
```

### **Paso 4: Importar Bootstrap CSS**

En tu archivo principal (ej: `index.tsx` o `App.tsx`):

```typescript
import 'bootstrap/dist/css/bootstrap.min.css'
```

### **Paso 5: Verificar Rutas de Imports**

Asegúrate de que las siguientes rutas estén disponibles en tu proyecto:

```typescript
// En todos los archivos del módulo
'src/_metronic/helpers'           // ID, Response, PaginationState, etc.
'src/_metronic/layout/core'       // PageLink, PageTitle
'src/app/utils/parseID'           // parseCode, parseIDNumeric
'src/app/utils/dateTimeFormater'  // formatToBolivianDate, formatTimeFromString
'src/app/utils/textUtils'         // truncateText
'src/app/utils/DeviceDetectop'    // DeviceDetector
'src/app/services/axiosClient'    // axiosClient
'src/app/config/apiRoutes'        // API_ROUTES
```

Si alguna ruta no existe, deberás ajustarlas o crear los archivos necesarios.

### **Paso 6: Configurar Rutas de API**

Verifica que los endpoints de API estén configurados en `src/app/config/apiRoutes.ts`:

```typescript
export const API_ROUTES = {
  CONTROL_PERSONAL: '/api/control-personal',
  // ... otros routes
}
```

### **Paso 7: Actualizar Routing**

En tu archivo de rutas (ej: `PrivateRoutes.tsx`):

```typescript
import { GestionQrPage } from './modules/apps/control-personal/gestion-qr'

// En tus routes:
<Route path="gestion-qr" element={<GestionQrPage />} />
```

---

## ✅ Verificación de Instalación

### **Test 1: Compilación**

```bash
npm run build
# O
yarn build
```

Debe compilar sin errores.

### **Test 2: Arrancar Servidor**

```bash
npm run dev
# O
yarn dev
```

Navega a `/gestion-qr` y verifica que la página cargue.

### **Test 3: Funcionalidad Básica**

1. Verificar que el panel de control se muestre
2. Verificar que el escáner QR se inicialice
3. Probar ingreso manual (Ctrl + M)
4. Escanear un código QR de prueba
5. Verificar que los modales se muestren correctamente

---

## 🔧 Configuración Adicional

### **Cambiar Tipos de Documentos Soportados**

Edita `config/documentTypes.config.ts`:

```typescript
export const DOCUMENT_TYPES_CONFIG = {
  COMISION: { /* ... */ },
  PERMISO: { /* ... */ },
  VACACION: { /* ... */ },
  // Agregar nuevo tipo aquí
}
```

### **Personalizar Estados**

En el mismo archivo, edita `states`:

```typescript
states: {
  GENERADO: { label: 'Generado', color: 'secondary', action: 'reception' },
  // Agregar más estados aquí
}
```

### **Cambiar Tiempo de Cache QR**

En `hooks/useQRScanner.ts`:

```typescript
const [qrCache] = useState(() => new QRCodeCache(5000)) // 5 segundos

// Cambiar a:
const [qrCache] = useState(() => new QRCodeCache(10000)) // 10 segundos
```

---

## 🐛 Troubleshooting

### **Error: "Cannot find module 'src/_metronic/helpers'"**

**Solución:** Verifica que la ruta sea correcta para tu proyecto. Puede ser:
- `@/_metronic/helpers`
- `../_metronic/helpers`

Ajusta los imports en todos los archivos.

### **Error: "Module not found: Can't resolve 'react-bootstrap'"**

**Solución:** Instala React Bootstrap:

```bash
npm install react-bootstrap bootstrap
```

### **Error: "useDocumentProcessor must be used within DocumentProcessorProvider"**

**Solución:** Asegúrate de que `GestionQrPage` esté envuelto con el Provider. Ya está implementado en `GestionQrPage.tsx`.

### **Modales no se muestran**

**Solución:** Verifica que Bootstrap CSS esté importado:

```typescript
import 'bootstrap/dist/css/bootstrap.min.css'
```

### **Error de CORS en API**

**Solución:** Configura CORS en tu backend o ajusta `axiosClient`:

```typescript
// En src/app/services/axiosClient.ts
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
})
```

---

## 📱 Integración con QR Scanner

El módulo usa `html5-qrcode` para escaneo QR. Asegúrate de tenerlo instalado:

```bash
npm install html5-qrcode
# O
yarn add html5-qrcode
```

Si necesitas un componente QR específico, crea `QRReaderAlternative.tsx` en `components/QRReaderAlternative/`.

---

## 🎨 Personalización de Estilos

Los componentes usan clases de Bootstrap y Metronic. Puedes personalizar:

### **Colores de Tipos de Documentos**

En `config/documentTypes.config.ts`:

```typescript
COMISION: {
  color: 'info',       // Cambiar a 'primary', 'success', etc.
  badgeColor: 'badge-light-info',  // Cambiar badge
  // ...
}
```

### **Tamaños de Modales**

En los componentes de Modal:

```typescript
<Modal size="lg">  // Cambiar a 'sm', 'md', 'lg', 'xl'
```

---

## 📞 Soporte

Si encuentras problemas:

1. Lee el `README.md` para documentación completa
2. Revisa el `MIGRATION_GUIDE.md` si estás migrando
3. Consulta el `CHANGELOG.md` para cambios recientes

---

## ✅ Checklist Post-Instalación

- [ ] Proyecto compila sin errores
- [ ] Página carga correctamente
- [ ] Escáner QR funciona
- [ ] Ingreso manual funciona (Ctrl + M)
- [ ] Modales se muestran correctamente
- [ ] Puede escanear códigos C, P, V
- [ ] Recepción funciona
- [ ] Aprobación funciona
- [ ] Observaciones funcionan
- [ ] Historial se actualiza

---

**¡Instalación completada! 🎉**

Para comenzar a usar el sistema, lee el `README.md` para ejemplos y el `MIGRATION_GUIDE.md` si vienes de una versión anterior.
