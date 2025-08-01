import axios, { AxiosResponse } from 'axios';
import { ID, Response } from '../../../../../../../../_metronic/helpers';
import { TipoPermiso, TipoPermisoQueryResponse, BackendResponse, TipoPermisoBackendData } from './_models';
import { API_ROUTES } from 'src/app/config/apiRoutes';

export const TIPO_PERMISO_URL = API_ROUTES.CONTROL_PERSONAL + '/tipos-permiso'

const getTiposPermiso = (query: string): Promise<TipoPermisoQueryResponse> => {
  return axios
    .get<BackendResponse<TipoPermisoBackendData>>(`${TIPO_PERMISO_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data;
      
      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida');
      }

      return {
        data: backendData.data, // Array de tipos de permiso
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination
        }
      };
    })
    .catch((error) => {
      console.error('Error fetching tipos de permiso:', error);
      return {
        data: [],
        payload: {
          message: 'Error al obtener tipos de permiso',
          errors: { server: [error.message] }
        }
      };
    });
};

const getTipoPermisoById = (id: ID): Promise<TipoPermiso | undefined> => {
  return axios
    .get(`${TIPO_PERMISO_URL}/${id}`)
    .then((response: AxiosResponse<Response<TipoPermiso>>) => response.data)
    .then((response: Response<TipoPermiso>) => response.data);
};

const createTipoPermiso = (tipoPermiso: TipoPermiso): Promise<TipoPermiso | undefined> => {
  return axios
    .post(TIPO_PERMISO_URL, tipoPermiso)
    .then((response: AxiosResponse<Response<TipoPermiso>>) => response.data)
    .then((response: Response<TipoPermiso>) => response.data);
};

const updateTipoPermiso = (tipoPermiso: TipoPermiso): Promise<TipoPermiso | undefined> => {
  return axios
    .put(`${TIPO_PERMISO_URL}/${tipoPermiso.id_tipo_permiso}`, tipoPermiso)
    .then((response: AxiosResponse<Response<TipoPermiso>>) => response.data)
    .then((response: Response<TipoPermiso>) => response.data);
};

const deleteTipoPermiso = (tipoPermisoId: ID): Promise<void> => {
  return axios.delete(`${TIPO_PERMISO_URL}/${tipoPermisoId}`).then(() => {});
};

const deleteSelectedTiposPermiso = (tipoPermisoIds: Array<ID>): Promise<void> => {
  const requests = tipoPermisoIds.map((id) => axios.delete(`${TIPO_PERMISO_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const toggleTipoPermisoStatus = (id: ID): Promise<TipoPermiso | undefined> => {
  return axios
    .patch(`${TIPO_PERMISO_URL}/${id}/toggle-status`)
    .then((response: AxiosResponse<Response<TipoPermiso>>) => response.data)
    .then((response: Response<TipoPermiso>) => response.data);
};

export {
  getTiposPermiso,
  deleteTipoPermiso,
  deleteSelectedTiposPermiso,
  getTipoPermisoById,
  createTipoPermiso,
  updateTipoPermiso,
  toggleTipoPermisoStatus
};
