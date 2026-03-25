import axiosClient from 'src/app/services/axiosClient'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {VacacionQueryResponse} from 'src/app/modules/apps/control-personal/vacaciones/core/_models'

export const VACACION_URL = API_ROUTES.CONTROL_PERSONAL + '/vacacion'

export const getVacacionesReporte = async (query: string): Promise<VacacionQueryResponse> => {
  try {
    const response = await axiosClient.get(`${VACACION_URL}?${query}`)
    const result = response.data
    return {
      data: result.data?.data || [],
      payload: {
        message: result.message,
        pagination: result.data?.payload?.pagination,
      },
    }
  } catch (error: any) {
    return {
      data: [],
      payload: {message: error.message, errors: {server: [error.message]}},
    }
  }
}
