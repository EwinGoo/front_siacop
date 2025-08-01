import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../../_metronic/helpers'
import {
  DeclaratoriaComision,
  DeclaratoriaComisionQueryResponse,
  BackendResponse,
  DeclaratoriasComisionBackendData,
} from './_models'
import axiosClient from 'src/app/services/axiosClient'
import { ValidationError } from 'src/app/utils/httpErrors'
import { API_ROUTES } from 'src/app/config/apiRoutes'

export const DECLARATORIA_URL = API_ROUTES.CONTROL_PERSONAL + '/declaratoria-comision'


const getDeclaratoriasComision = (query: string): Promise<DeclaratoriaComisionQueryResponse> => {
  return axios
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
  return axios
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

const updateDeclaratoriaComision = (
  declaratoria: DeclaratoriaComision
): Promise<DeclaratoriaComision | undefined> => {
  return axios
    .put(`${DECLARATORIA_URL}/${declaratoria.id_declaratoria_comision}`, declaratoria)
    .then((response: AxiosResponse<Response<DeclaratoriaComision>>) => response.data)
    .then((response: Response<DeclaratoriaComision>) => response.data)
}

const deleteDeclaratoriaComision = (declaratoriaId: ID): Promise<void> => {
  return axios.delete(`${DECLARATORIA_URL}/${declaratoriaId}`).then(() => {})
}

const deleteSelectedDeclaratorias = (declaratoriaIds: Array<ID>): Promise<void> => {
  const requests = declaratoriaIds.map((id) => axios.delete(`${DECLARATORIA_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const imprimirDeclaratoriaComision = (id: ID): Promise<Blob> => {
  return axios
    .get(`${DECLARATORIA_URL}/imprimir/${id}`, {responseType: 'blob'})
    .then((response) => response.data)
}

export {
  getDeclaratoriasComision,
  deleteDeclaratoriaComision,
  deleteSelectedDeclaratorias,
  getDeclaratoriaComisionById,
  createDeclaratoriaComision,
  updateDeclaratoriaComision,
  imprimirDeclaratoriaComision,
}
