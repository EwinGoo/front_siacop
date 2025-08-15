import axios, {AxiosResponse, AxiosProgressEvent} from 'axios'
import {ApiResponse, ID, Response} from 'src/_metronic/helpers'
import {
  AsistenciaPermiso,
  AsistenciaPermisoQueryResponse,
  BackendResponse,
  AsistenciaPermisoBackendData,
  AsistenciaTipoPermisoQueryResponseData,
  ProcesarComisionParams,
} from './_models'
import {API_ROUTES, API_BASE_URL} from 'src/app/config/apiRoutes'
import {TipoPermiso} from '../../../tipos-permisos/list/core/_models'
import axiosClient from 'src/app/services/axiosClient'
import {ValidationError} from 'src/app/utils/httpErrors'

export const ASISTENCIA_PERMISO_URL = API_ROUTES.CONTROL_PERSONAL + '/permisos'

const getAsistenciasPermiso = (query: string): Promise<AsistenciaPermisoQueryResponse> => {
  return axios
    .get<BackendResponse<AsistenciaPermisoBackendData>>(`${ASISTENCIA_PERMISO_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data

      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data,
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination,
        },
      }
    })
    .catch((error) => {
      console.error('Error fetching asistencias permiso:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener asistencias permiso',
          errors: {server: [error.message]},
        },
      }
    })
}

const getAsistenciaPermisoById = (id: ID): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .get(`${ASISTENCIA_PERMISO_URL}/${id}`)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data)
}

const createAsistenciaPermiso = async (
  asistenciaPermiso: AsistenciaPermiso
): Promise<AsistenciaPermiso> => {
  try {
    const response = await axiosClient.post(ASISTENCIA_PERMISO_URL, asistenciaPermiso)
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

const updateAsistenciaPermiso = (
  asistenciaPermiso: AsistenciaPermiso
): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .put(`${ASISTENCIA_PERMISO_URL}/${asistenciaPermiso.id_asistencia_permiso}`, asistenciaPermiso)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data)
}

const deleteAsistenciaPermiso = (asistenciaPermisoId: ID): Promise<void> => {
  return axios.delete(`${ASISTENCIA_PERMISO_URL}/${asistenciaPermisoId}`).then(() => {})
}

const deleteSelectedAsistenciasPermiso = (asistenciaPermisoIds: Array<ID>): Promise<void> => {
  const requests = asistenciaPermisoIds.map((id) => axios.delete(`${ASISTENCIA_PERMISO_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const toggleAsistenciaPermisoStatus = (id: ID): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .patch(`${ASISTENCIA_PERMISO_URL}/${id}/toggle-status`)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data)
}

// Función adicional para aprobar/rechazar permisos
const cambiarEstadoPermiso = (
  id: ID,
  estado: 'APROBADO' | 'RECHAZADO'
): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .patch(`${ASISTENCIA_PERMISO_URL}/${id}/cambiar-estado`, {estado})
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data)
}

const getTiposPermiso = async (): Promise<TipoPermiso[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TipoPermiso[]>> = await axios.get(
      `${ASISTENCIA_PERMISO_URL}/tipos-permiso`
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching tipos permiso:', error)
    return []
  }
}
const aprobarComisiones = async (): Promise<ApiResponse<any>> => {
  const response = await axiosClient.post(`${ASISTENCIA_PERMISO_URL}/aprobar-comisiones-recepcionados`)
  return response.data // <- Esto es lo que espera useMutation
}

const uploadFile = (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<Response<{id_multimedia: number}>>> => {
  return axios.post(`${API_BASE_URL}/upload-multimedia`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}

const procesarEstadoComision = (
  params: ProcesarComisionParams
): Promise<BackendResponse<AsistenciaPermisoBackendData>> => {
  // Estructura los datos según la acción
  // console.log('requst '+params.fecha);

  const requestData = {
    id: params.code,
    action: params.action,
    ...(params.action === 'observe' && {observacion: params.observacion}),
    ...(params.action === 'receive' && {fecha: params.fecha}),
  }

  return axiosClient.post(`${ASISTENCIA_PERMISO_URL}/procesar-estado`, requestData)
}


const aprobarSelectedPermisos= async (
  comisionIds: ID[]
): Promise<{success: boolean; message: string}> => {
  try {
    const response = await axiosClient.post(`${ASISTENCIA_PERMISO_URL}/aprobar-seleccionados`, {
      ids: comisionIds,
    })
    return response.data
  } catch (error) {
    // console.error('Error al aprobar comisiones:', error.response?.data)
    throw error
  }
}

export {
  getAsistenciasPermiso,
  deleteAsistenciaPermiso,
  deleteSelectedAsistenciasPermiso,
  getAsistenciaPermisoById,
  createAsistenciaPermiso,
  updateAsistenciaPermiso,
  toggleAsistenciaPermisoStatus,
  cambiarEstadoPermiso,
  getTiposPermiso,
  uploadFile,
  procesarEstadoComision,
  aprobarComisiones,
  aprobarSelectedPermisos
}
