import {AxiosResponse} from 'axios'
import axiosClient from 'src/app/services/axiosClient'
import {ID, Response} from '../../../../../../../_metronic/helpers'
import {
  Comision,
  ComisionQueryResponse,
  BackendResponse,
  ComisionesBackendData,
  ProcesarComisionParams,
  ApiResponse,
  AutocompleteResponse,
} from './_models'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {ValidationError} from 'src/app/utils/httpErrors'

export const COMISION_URL = API_ROUTES.CONTROL_PERSONAL + '/boletas-comision'

const getComisiones = (query: string): Promise<ComisionQueryResponse> => {
  return axiosClient
    .get<BackendResponse<ComisionesBackendData>>(`${COMISION_URL}?${query}`, {
      // withCredentials: true,
    })
    .then((response) => {
      const backendData = response.data.data

      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de comisiones
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination,
        },
      }
    })
    .catch((error) => {
      console.error('Error fetching comisiones:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener comisiones',
          errors: {server: [error.message]},
        },
      }
    })
}

const getComisionById = async (id: ID): Promise<Comision> => {
  const response = await axiosClient.get<BackendResponse<Comision>>(`${COMISION_URL}/${id}`)
  const data = response.data

  if (data.error) {
    throw new Error(data.message || 'Error desconocido al obtener la comisión')
  }

  if (!data.data) {
    throw new Error('Comisión no encontrada')
  }

  return data.data
}

const createComision = async (comision: Comision): Promise<Comision> => {
  try {
    const response = await axiosClient.post(COMISION_URL, comision)
    return response.data.data
  } catch (error: any) {
    const status = error?.response?.status
    const validationErrors = error?.response?.data?.validation_errors
    const message = error?.response?.data?.message || 'Ocurrió un error'

    if (status === 400 || status === 422) {
      throw new ValidationError(validationErrors || {}, message)
    }

    throw new Error(message)  
  }
}

const updateComision = async (comision: Comision): Promise<Comision> => {
  try {
    const response = await axiosClient.put(`${COMISION_URL}/${comision.id_comision}`, comision)
    // return {message: response.data.message, res: response.data.data}
    return response.data.data
  } catch (error: any) {
    if (error.response?.status === 422 || error.response?.status === 400) {
      throw new ValidationError(
        error.response.data.validation_errors || {},
        error.response.data.message
      )
    }
    throw error 
  }
}

const deleteComision = (comisionId: ID): Promise<void> => {
  return axiosClient.delete(`${COMISION_URL}/${comisionId}`).then(() => {})
}

const aprobarComision = async (comisionId: ID): Promise<void> => {
  // return await axiosClient.post(`${COMISION_URL}/aprobar`).then(() => {})
  return axiosClient.post(`${COMISION_URL}/aprobar`, {id: comisionId})
}
const verficarAsignacion = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(`${COMISION_URL}/verificar-asignacion`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

const getPersonaAutocomplete = async (termino: string): Promise<AutocompleteResponse> => {
  try {
    const response = await axiosClient.get(`${API_ROUTES.PERSONA}/autocompletar?termino=${termino}`)

    const data = response.data

    if (data.error) {
      throw new Error(data.message || 'Error desconocido al obtener la comisión')
    }

    if (!data.sugerencias) {
      throw new Error('No se encontraron sugerencias')
    }

    return data as AutocompleteResponse
  } catch (error: any) {
    console.error('Error en getPersonaAutocomplete:', error)
    throw new Error(error.message || 'Error al obtener datos de autocompletado')
  }
}
const aprobarComisiones = async (): Promise<ApiResponse> => {
  const response = await axiosClient.post(`${COMISION_URL}/aprobar-comisiones-recepcionados`)
  return response.data // <- Esto es lo que espera useMutation
}

const aprobarSelectedComisiones = async (
  comisionIds: ID[]
): Promise<{success: boolean; message: string}> => {
  try {
    const response = await axiosClient.post(`${COMISION_URL}/aprobar-seleccionados`, {
      ids: comisionIds,
    })
    return response.data
  } catch (error) {
    // console.error('Error al aprobar comisiones:', error.response?.data)
    throw error
  }
}
const aprobarComisionPorQR = (code: string): Promise<BackendResponse<ComisionesBackendData>> => {
  return axiosClient.post(`${COMISION_URL}/aprobar`, {id: code})
}

const procesarEstadoComision = (
  params: ProcesarComisionParams
): Promise<BackendResponse<ComisionesBackendData>> => {
  // Estructura los datos según la acción
  // console.log('requst '+params.fecha);
  
  const requestData = {
    id: params.code,
    action: params.action,
    ...(params.action === 'observe' && {observacion: params.observacion}),
    ...((params.action === 'receive') && {fecha: params.fecha}),
  }

  return axiosClient.post(`${COMISION_URL}/comision-qr`, requestData)
}
export {
  getComisiones,
  deleteComision,
  aprobarSelectedComisiones,
  getComisionById,
  createComision,
  updateComision,
  aprobarComisionPorQR,
  aprobarComision,
  procesarEstadoComision,
  aprobarComisiones,
  getPersonaAutocomplete,
  verficarAsignacion,
}
