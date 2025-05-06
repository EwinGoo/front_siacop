import axios, { AxiosResponse } from 'axios'
import { ID, Response } from '../../../../../../../_metronic/helpers'
import { FeriadoAsueto, FeriadoAsuetoQueryResponse, BackendResponse, FeriadoAsuetoBackendData } from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const FERIADO_ASUETO_URL = `${API_URL}/asistencia-feriado-asueto`

const getFeriadosAsuetos = (query: string): Promise<FeriadoAsuetoQueryResponse> => {
  return axios
    .get<BackendResponse<FeriadoAsuetoBackendData>>(`${FERIADO_ASUETO_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data
      
      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de feriados/asuetos
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching feriados/asuetos:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener feriados/asuetos',
          errors: { server: [error.message] }
        }
      }
    })
}

const getFeriadoAsuetoById = (id: ID): Promise<FeriadoAsueto | undefined> => {
  return axios
    .get(`${FERIADO_ASUETO_URL}/${id}`)
    .then((response: AxiosResponse<Response<FeriadoAsueto>>) => response.data)
    .then((response: Response<FeriadoAsueto>) => response.data)
}

const createFeriadoAsueto = (feriadoAsueto: FeriadoAsueto): Promise<FeriadoAsueto | undefined> => {
  return axios
    .post(FERIADO_ASUETO_URL, feriadoAsueto)
    .then((response: AxiosResponse<Response<FeriadoAsueto>>) => response.data)
    .then((response: Response<FeriadoAsueto>) => response.data)
}

const updateFeriadoAsueto = (feriadoAsueto: FeriadoAsueto): Promise<FeriadoAsueto | undefined> => {
  return axios
    .put(`${FERIADO_ASUETO_URL}/${feriadoAsueto.id_asistencia_feriado_asueto}`, feriadoAsueto)
    .then((response: AxiosResponse<Response<FeriadoAsueto>>) => response.data)
    .then((response: Response<FeriadoAsueto>) => response.data)
}

const deleteFeriadoAsueto = (feriadoAsuetoId: ID): Promise<void> => {
  return axios.delete(`${FERIADO_ASUETO_URL}/${feriadoAsuetoId}`).then(() => {})
}

const deleteSelectedFeriadosAsuetos = (feriadoAsuetoIds: Array<ID>): Promise<void> => {
  const requests = feriadoAsuetoIds.map((id) => axios.delete(`${FERIADO_ASUETO_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

export {
  getFeriadosAsuetos,
  deleteFeriadoAsueto,
  deleteSelectedFeriadosAsuetos,
  getFeriadoAsuetoById,
  createFeriadoAsueto,
  updateFeriadoAsueto
}