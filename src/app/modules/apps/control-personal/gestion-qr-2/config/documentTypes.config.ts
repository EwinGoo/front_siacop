/**
 * Configuración Declarativa de Tipos de Documentos
 * 
 * Para agregar un nuevo tipo de documento (ej: Becas):
 * 1. Crear BecaStrategy.ts en strategies/
 * 2. Crear BecaAdapter.ts en adapters/
 * 3. Agregar entrada BECA en este config
 * 4. Listo! El sistema lo reconocerá automáticamente
 */

import { ComisionStrategy } from '../strategies/ComisionStrategy'
import { PermisoStrategy } from '../strategies/PermisoStrategy'
import { VacacionStrategy } from '../strategies/VacacionStrategy'
import { ComisionAdapter } from '../adapters/ComisionAdapter'
import { PermisoAdapter } from '../adapters/PermisoAdapter'
import { VacacionAdapter } from '../adapters/VacacionAdapter'
import { DocumentTypeConfig, DocumentTypeKey } from '../core/types/document.types'

/**
 * Configuración centralizada de tipos de documentos
 */
export const DOCUMENT_TYPES_CONFIG: Record<DocumentTypeKey, DocumentTypeConfig> = {
  COMISION: {
    key: 'COMISION',
    code: 'C', // Código QR: C123
    label: 'Comisión',
    labelPlural: 'Comisiones',
    description: 'Permisos por hora',
    icon: 'bi-briefcase',
    color: 'info',
    badgeColor: 'badge-light-info',
    tipoPermiso: 'hora',
    strategyClass: ComisionStrategy,
    adapterClass: ComisionAdapter,
    states: {
      GENERADO: { label: 'Generado', color: 'secondary', action: 'reception' },
      ENVIADO: { label: 'Enviado', color: 'warning', action: 'reception' },
      RECEPCIONADO: { label: 'Recepcionado', color: 'info', action: 'approve' },
      APROBADO: { label: 'Aprobado', color: 'success', action: 'view' },
      // OBSERVADO: { label: 'Observado', color: 'danger', action: 'view' }, // Descomentar si se necesita
    }
  },
  
  PERMISO: {
    key: 'PERMISO',
    code: 'P', // Código QR: P456
    label: 'Permiso',
    labelPlural: 'Permisos',
    description: 'Licencias especiales por día',
    icon: 'bi-calendar-check',
    color: 'primary',
    badgeColor: 'badge-light-primary',
    tipoPermiso: 'dia',
    strategyClass: PermisoStrategy,
    adapterClass: PermisoAdapter,
    states: {
      GENERADO: { label: 'Generado', color: 'secondary', action: 'reception' },
      ENVIADO: { label: 'Enviado', color: 'warning', action: 'reception' },
      RECEPCIONADO: { label: 'Recepcionado', color: 'info', action: 'approve' },
      APROBADO: { label: 'Aprobado', color: 'success', action: 'view' },
      // OBSERVADO: { label: 'Observado', color: 'danger', action: 'view' }, // Descomentar si se necesita
    }
  },

  VACACION: {
    key: 'VACACION',
    code: 'V', // Código QR: V789
    label: 'Vacación',
    labelPlural: 'Vacaciones',
    description: 'Solicitudes de vacaciones',
    icon: 'bi-sun',
    color: 'warning',
    badgeColor: 'badge-light-warning',
    tipoPermiso: 'vacacion',
    strategyClass: VacacionStrategy,
    adapterClass: VacacionAdapter,
    states: {
      GENERADO: { label: 'Generado', color: 'secondary', action: 'reception' },
      ENVIADO: { label: 'Enviado', color: 'warning', action: 'reception' },
      RECEPCIONADO: { label: 'Recepcionado', color: 'info', action: 'approve' },
      APROBADO: { label: 'Aprobado', color: 'success', action: 'view' },
      // OBSERVADO: { label: 'Observado', color: 'danger', action: 'view' }, // Descomentar si se necesita
    }
  }
}

/**
 * Obtiene la configuración de un tipo de documento por su código QR
 * @param code Código QR (ej: 'C', 'P', 'V')
 */
export const getDocumentTypeByCode = (code: string): DocumentTypeConfig | null => {
  const upperCode = code.toUpperCase()
  const entry = Object.values(DOCUMENT_TYPES_CONFIG).find(config => config.code === upperCode)
  return entry || null
}

/**
 * Obtiene la configuración de un tipo de documento por su key
 * @param key Key del tipo (ej: 'COMISION', 'PERMISO', 'VACACION')
 */
export const getDocumentTypeByKey = (key: DocumentTypeKey): DocumentTypeConfig => {
  return DOCUMENT_TYPES_CONFIG[key]
}

/**
 * Lista todos los tipos de documentos disponibles
 */
export const getAllDocumentTypes = (): DocumentTypeConfig[] => {
  return Object.values(DOCUMENT_TYPES_CONFIG)
}
