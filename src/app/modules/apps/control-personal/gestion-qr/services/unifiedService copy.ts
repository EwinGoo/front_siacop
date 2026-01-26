import { TipoPermiso, UnifiedData } from '../types'
import { comisionService } from './comisionService'
import { permisoService } from './permisoService'
import { DataAdapter } from './dataAdapter'

export class UnifiedComisionService {
  async getDataByType(code: number, tipoPermiso: TipoPermiso): Promise<UnifiedData | null> {
    try {
      if (tipoPermiso === 'dia') {
        // Obtener datos de permiso
        return await permisoService.getPermisoById(code)
      } else {
        // Obtener datos de comisión y convertir al formato unificado
        const comisionData = await comisionService.getComisionById(code)
        if (!comisionData) return null
        
        return DataAdapter.fromComision(comisionData)
      }
    } catch (error) {
      // console.error(`Error al obtener datos para tipo ${tipoPermiso}:`, error)
      throw error
    }
  }

  async procesarRecepcionByType(codigo: string, fechaHora: string, tipoPermiso: TipoPermiso) {
    
    try {
      if (tipoPermiso === 'dia') {
        return await permisoService.procesarRecepcion(codigo, fechaHora, tipoPermiso)
      } else {
        return await comisionService.procesarRecepcion(codigo, fechaHora, tipoPermiso)
      }
    } catch (error) {
      // console.error(`Error al procesar recepción para tipo ${tipoPermiso}:`, error)
      throw error
    }
  }

  async aprobarComisionByType(codigo: string, tipoPermiso: TipoPermiso) {
    try {
      if (tipoPermiso === 'dia') {
        return await permisoService.aprobarPermiso(codigo)
      } else {
        return await comisionService.aprobarComision(codigo)
      }
    } catch (error) {
      // console.error(`Error al aprobar para tipo ${tipoPermiso}:`, error)
      throw error
    }
  }

  async registrarObservacionByType(codigo: string, observacion: string, tipoPermiso: TipoPermiso) {
    try {
      if (tipoPermiso === 'dia') {
        return await permisoService.registrarObservacion(codigo, observacion)
      } else {
        return await comisionService.registrarObservacion(codigo, observacion)
      }
    } catch (error) {
      // console.error(`Error al registrar observación para tipo ${tipoPermiso}:`, error)
      throw error
    }
  }

  getTypeConfig(tipoPermiso: TipoPermiso) {
    if (tipoPermiso === 'dia') {
      return {
        serviceName: 'Licencias Especiales',
        icon: 'bi-calendar-check',
        color: 'warning',
        description: 'Procesando permiso de asistencia'
      }
    } else {
      return {
        serviceName: 'Comisiones',
        icon: 'bi-briefcase',
        color: 'primary',
        description: 'Procesando comisión por horas'
      }
    }
  }
}

export const unifiedService = new UnifiedComisionService()