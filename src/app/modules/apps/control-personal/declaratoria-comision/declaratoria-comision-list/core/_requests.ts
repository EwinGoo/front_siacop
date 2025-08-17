import {ApiResponse, ID, Response} from 'src/_metronic/helpers'
import {
  DeclaratoriaComision,
  DeclaratoriaComisionQueryResponse,
  BackendResponse,
  DeclaratoriasComisionBackendData,
  PDFResponse,
  Unidad,
} from './_models'
import axiosClient from 'src/app/services/axiosClient'
import {ValidationError} from 'src/app/utils/httpErrors'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import { AxiosResponse } from 'axios'

export const DECLARATORIA_URL = API_ROUTES.CONTROL_PERSONAL + '/declaratoria-comision'

const getDeclaratoriasComision = (query: string): Promise<DeclaratoriaComisionQueryResponse> => {
  return axiosClient
    .get<BackendResponse<DeclaratoriasComisionBackendData>>(`${DECLARATORIA_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data

      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de declaratorias
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination,
        },
      }
    })
    .catch((error) => {
      console.error('Error fetching declaratorias:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener declaratorias',
          errors: {server: [error.message]},
        },
      }
    })
}

const getDeclaratoriaComisionById = (id: ID): Promise<DeclaratoriaComision | undefined> => {
  return axiosClient
    .get(`${DECLARATORIA_URL}/${id}`)
    .then((response: AxiosResponse<Response<DeclaratoriaComision>>) => response.data)
    .then((response: Response<DeclaratoriaComision>) => response.data)
}

const createDeclaratoriaComision = async (
  declaratoria: DeclaratoriaComision
): Promise<DeclaratoriaComision> => {
  try {
    const response = await axiosClient.post(DECLARATORIA_URL, declaratoria)
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

const updateDeclaratoriaComision = async (
  declaratoria: DeclaratoriaComision
): Promise<DeclaratoriaComision> => {
  try {
    const response = await axiosClient.put(
      `${DECLARATORIA_URL}/${declaratoria.id_declaratoria_comision}`,
      declaratoria
    )
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

const deleteDeclaratoriaComision = (declaratoriaId: ID): Promise<void> => {
  return axiosClient.delete(`${DECLARATORIA_URL}/${declaratoriaId}`).then(() => {})
}

const getUnidades = async (): Promise<Unidad[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Unidad[]>> = await axiosClient.get(
      `${DECLARATORIA_URL}/unidades`
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching tipos permiso:', error)
    return []
  }
}

// const deleteSelectedDeclaratorias = (declaratoriaIds: Array<ID>): Promise<void> => {
//   const requests = declaratoriaIds.map((id) => axiosClient.delete(`${DECLARATORIA_URL}/${id}`))
//   return axiosClient.all(requests).then(() => {})
//}

// const imprimirDeclaratoriaComision = (id: ID): Promise<Blob> => {
//   return axiosClient
//     .get(`${DECLARATORIA_URL}/imprimir/${id}`, {responseType: 'blob'})
//     .then((response) => response.data)
// }

const imprimirDeclaratoriaComision = async (id: ID): Promise<PDFResponse> => {
  try {
    const response = await axiosClient.get<BackendResponse<PDFResponse>>(
      `${DECLARATORIA_URL}/reporte/${id}`
    )
    return response.data.data
  } catch (error: any) {
    console.error('Error al imprimir declaratoria:', error)
    throw error
  }
}

export {
  getDeclaratoriasComision,
  deleteDeclaratoriaComision,
  getDeclaratoriaComisionById,
  createDeclaratoriaComision,
  updateDeclaratoriaComision,
  imprimirDeclaratoriaComision,
  getUnidades,
}
