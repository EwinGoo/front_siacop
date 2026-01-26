import { parseIDNumeric } from 'src/app/utils/parseID'
import { getAsistenciaPermisoById, procesarEstadoPermiso } from '../../permisos/asistencia-permiso/asistencia-permiso-list/core/_requests'
import { TipoPermiso, UnifiedData } from '../types'
import { DataAdapter } from './dataAdapter'

export class PermisoService {
  async getPermisoById(id: number): Promise<UnifiedData | null> {
    try {
      // console.log(`Obteniendo permiso con ID: ${id}`)
      
      const response = await getAsistenciaPermisoById(id)
      
      if (!response) {
        console.warn(`No se encontró permiso con ID: ${id}`)
        return null
      }

      // Convertir al formato unificado
      const unifiedData = DataAdapter.fromPermiso(response)
      
      // console.log(`Permiso obtenido: ${unifiedData.tipo_permiso_nombre}`)
      return unifiedData
    } catch (error) {
      console.error('Error al obtener permiso:', error)
      throw error
    }
  }

  async procesarRecepcion(codigo: string, fechaHora: string, tipoPermiso: TipoPermiso) {
    try {
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'receive',
        fecha: fechaHora,
      })

      return {
        nro_correlativo: response.data.data,
        message: `Permiso recepcionado correctamente el ${new Date(fechaHora).toLocaleDateString('es-BO')}`
      }
    } catch (error) {
      console.error('Error al procesar recepción de permiso:', error)
      throw error
    }
  }

  async aprobarPermiso(codigo: string) {
    try {
      // console.log(`Aprobando permiso: ${codigo}`)
      
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'approve'
      })

      return {
        message: `Permiso ${codigo} aprobado exitosamente`
      }
    } catch (error) {
      console.error('Error al aprobar permiso:', error)
      throw error
    }
  }

  async registrarObservacion(codigo: string, observacion: string) {
    try {
      // console.log(`Registrando observación para permiso: ${codigo}`)
      
      const response = await procesarEstadoPermiso({
        code: parseIDNumeric(codigo),
        action: 'observe',
        observacion: observacion
      })


      return {
        message: `Observación registrada para permiso ${codigo}`
      }
    } catch (error) {
      console.error('Error al registrar observación de permiso:', error)
      throw error
    }
  }
}

export const permisoService = new PermisoService()