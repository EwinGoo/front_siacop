import axios, { AxiosResponse } from 'axios'
import { ID, Response } from '../../../../../../../_metronic/helpers'
import { Comision, ComisionQueryResponse, BackendResponse, ComisionesBackendData } from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const COMISION_URL = `${API_URL}/boletas-comision`

const getComisiones = (query: string): Promise<ComisionQueryResponse> => {
  return axios
    .get<BackendResponse<ComisionesBackendData>>(`${COMISION_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data
      
      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de comisiones
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching comisiones:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener comisiones',
          errors: { server: [error.message] }
        }
      }
    })
}

const getComisionById = (id: ID): Promise<Comision | undefined> => {
  return axios
    .get(`${COMISION_URL}/${id}`)
    .then((response: AxiosResponse<Response<Comision>>) => response.data)
    .then((response: Response<Comision>) => response.data)
}

const createComision = (comision: Comision): Promise<Comision | undefined> => {
  return axios
    .post(COMISION_URL, comision)
    .then((response: AxiosResponse<Response<Comision>>) => response.data)
    .then((response: Response<Comision>) => response.data)
}

const updateComision = (comision: Comision): Promise<Comision | undefined> => {
  return axios
    .put(`${COMISION_URL}/${comision.id_comision}`, comision)
    .then((response: AxiosResponse<Response<Comision>>) => response.data)
    .then((response: Response<Comision>) => response.data)
}

const deleteComision = (comisionId: ID): Promise<void> => {
  return axios.delete(`${COMISION_URL}/${comisionId}`).then(() => {})
}

const aprobarComision = (comisionId: ID): Promise<void> => {
  return axios.post(`${COMISION_URL}/${comisionId}/aprobar`).then(() => {})
}

const deleteSelectedComisiones = (comisionIds: Array<ID>): Promise<void> => {
  const requests = comisionIds.map((id) => axios.delete(`${COMISION_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const aprobarComisionPorQR = (code: string): Promise<BackendResponse<ComisionesBackendData>> => {
  return axios.post(`${COMISION_URL}/aprobar`, {id: code})
}

export {
  getComisiones,
  deleteComision,
  deleteSelectedComisiones,
  getComisionById,
  createComision,
  updateComision,
  aprobarComisionPorQR,
  aprobarComision
}