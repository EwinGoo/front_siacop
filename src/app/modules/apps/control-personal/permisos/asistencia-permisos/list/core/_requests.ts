import axios, { AxiosResponse } from 'axios';
import { ID, Response } from '../../../../../../../../_metronic/helpers';
import { 
  AsistenciaPermiso, 
  AsistenciaPermisoQueryResponse, 
  BackendResponse, 
  AsistenciaPermisoBackendData,
  AsistenciaTipoPermisoQueryResponseData 
} from './_models';

const API_URL = process.env.REACT_APP_THEME_API_URL;
const ASISTENCIA_PERMISO_URL = `${API_URL}/permisos`;

const getAsistenciasPermiso = (query: string): Promise<AsistenciaPermisoQueryResponse> => {
  return axios
    .get<BackendResponse<AsistenciaPermisoBackendData>>(`${ASISTENCIA_PERMISO_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data;
      
      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida');
      }

      return {
        data: backendData.data,
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination
        }
      };
    })
    .catch((error) => {
      console.error('Error fetching asistencias permiso:', error);
      return {
        data: [],
        payload: {
          message: 'Error al obtener asistencias permiso',
          errors: { server: [error.message] }
        }
      };
    });
};

const getAsistenciaPermisoById = (id: ID): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .get(`${ASISTENCIA_PERMISO_URL}/${id}`)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data);
};

const createAsistenciaPermiso = (asistenciaPermiso: AsistenciaPermiso): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .post(ASISTENCIA_PERMISO_URL, asistenciaPermiso)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data);
};

const updateAsistenciaPermiso = (asistenciaPermiso: AsistenciaPermiso): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .put(`${ASISTENCIA_PERMISO_URL}/${asistenciaPermiso.id_asistencia_permiso}`, asistenciaPermiso)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data);
};

const deleteAsistenciaPermiso = (asistenciaPermisoId: ID): Promise<void> => {
  return axios.delete(`${ASISTENCIA_PERMISO_URL}/${asistenciaPermisoId}`).then(() => {});
};

const deleteSelectedAsistenciasPermiso = (asistenciaPermisoIds: Array<ID>): Promise<void> => {
  const requests = asistenciaPermisoIds.map((id) => axios.delete(`${ASISTENCIA_PERMISO_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const toggleAsistenciaPermisoStatus = (id: ID): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .patch(`${ASISTENCIA_PERMISO_URL}/${id}/toggle-status`)
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data);
};

// Función adicional para aprobar/rechazar permisos
const cambiarEstadoPermiso = (id: ID, estado: 'APROBADO' | 'RECHAZADO'): Promise<AsistenciaPermiso | undefined> => {
  return axios
    .patch(`${ASISTENCIA_PERMISO_URL}/${id}/cambiar-estado`, { estado })
    .then((response: AxiosResponse<Response<AsistenciaPermiso>>) => response.data)
    .then((response: Response<AsistenciaPermiso>) => response.data);
};

const getTiposPermiso = (): Promise<Array<{id_tipo_permiso: number, nombre: string}>  | undefined> => {
  return axios
    .get(`${ASISTENCIA_PERMISO_URL}/tipos-permiso`)
    .then((response: AxiosResponse<Response<Array<{id_tipo_permiso: number, nombre: string}>>>) => response.data.data)
    .catch((error) => {
      console.error('Error fetching tipos permiso:', error);
      return [];
    });
};

export {
  getAsistenciasPermiso,
  deleteAsistenciaPermiso,
  deleteSelectedAsistenciasPermiso,
  getAsistenciaPermisoById,
  createAsistenciaPermiso,
  updateAsistenciaPermiso,
  toggleAsistenciaPermisoStatus,
  cambiarEstadoPermiso,
  getTiposPermiso
};