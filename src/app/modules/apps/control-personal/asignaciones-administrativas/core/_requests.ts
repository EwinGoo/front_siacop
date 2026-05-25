import axiosClient from 'src/app/services/axiosClient'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {AsignacionAdministrativa, AsignacionAdministrativaListResponse} from './_models'

const ASIGNACION_ADMINISTRATIVO_URL = API_ROUTES.ASIGNACION_ADMINISTRATIVO

type BackendEnvelope<T> = {
  status: string
  data: T
  message: string
  timestamp: string
}

export const listarAsignacionesAdministrativas = async (
  search: string,
  page: number,
  limit: number
): Promise<AsignacionAdministrativaListResponse> => {
  const response = await axiosClient.get<BackendEnvelope<AsignacionAdministrativaListResponse>>(
    ASIGNACION_ADMINISTRATIVO_URL,
    {
      params: {search, page, limit},
    }
  )

  return response.data.data
}

export const obtenerAsignacionAdministrativa = async (
  id: number
): Promise<AsignacionAdministrativa> => {
  const response = await axiosClient.get<BackendEnvelope<AsignacionAdministrativa>>(
    `${ASIGNACION_ADMINISTRATIVO_URL}/${id}`
  )

  return response.data.data
}

export const crearAsignacionAdministrativa = async (
  payload: AsignacionAdministrativa
): Promise<AsignacionAdministrativa> => {
  const response = await axiosClient.post<BackendEnvelope<AsignacionAdministrativa>>(
    ASIGNACION_ADMINISTRATIVO_URL,
    payload
  )

  return response.data.data
}

export const actualizarAsignacionAdministrativa = async (
  id: number,
  payload: AsignacionAdministrativa
): Promise<AsignacionAdministrativa> => {
  const response = await axiosClient.put<BackendEnvelope<AsignacionAdministrativa>>(
    `${ASIGNACION_ADMINISTRATIVO_URL}/${id}`,
    payload
  )

  return response.data.data
}

export const eliminarAsignacionAdministrativa = async (id: number): Promise<void> => {
  await axiosClient.delete(`${ASIGNACION_ADMINISTRATIVO_URL}/${id}`)
}
