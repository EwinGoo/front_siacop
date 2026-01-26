import { ID } from 'src/_metronic/helpers';
import axiosClient from 'src/app/services/axiosClient';
import { API_ROUTES } from 'src/app/config/apiRoutes';
import { 
  Vacacion, 
  VacacionQueryResponse, 
  BackendResponse, 
  VacacionBackendData 
} from './_models';

export const VACACION_URL = API_ROUTES.CONTROL_PERSONAL + '/vacacion';

/**
 * Obtener lista de vacaciones paginada
 */
export const getVacaciones = async (query: string): Promise<VacacionQueryResponse> => {
  try {
    const response = await axiosClient.get<BackendResponse<VacacionBackendData>>(`${VACACION_URL}?${query}`);
    const result = response.data;

    return {
      data: result.data.data || [],
      payload: {
        message: result.message,
        pagination: result.data.payload?.pagination
      }
    };
  } catch (error: any) {
    return {
      data: [],
      payload: { 
        message: error.message,
        errors: { server: [error.message] } 
      }
    };
  }
};

/**
 * Obtener una vacación por su ID
 */
export const getVacacionById = async (id: ID): Promise<Vacacion> => {
  const response = await axiosClient.get<BackendResponse<Vacacion>>(`${VACACION_URL}/${id}`);
  
  if (response.data.error || !response.data.data) {
    throw new Error(response.data.message || 'No se encontró el registro');
  }

  return response.data.data;
};

/**
 * Procesar estados (Aprobar, Recibir, Observar) desde QR o Listado
 */
export const procesarEstadoVacacion = async (params: {
  id: ID, 
  action: 'approve' | 'observe' | 'receive', 
  fecha?: string, 
  observacion?: string,
  numero_tramite?: string
}): Promise<any> => {
  const response = await axiosClient.post(`${VACACION_URL}/procesar-estado`, params);
  return response.data;
};

/**
 * Eliminar registro
 */
export const deleteVacacion = async (id: ID): Promise<void> => {
  await axiosClient.delete(`${VACACION_URL}/${id}`);
};