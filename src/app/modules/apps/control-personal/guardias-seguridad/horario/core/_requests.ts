import axios from 'axios'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {HorarioSemanalResponse, ConfiguracionCiclo} from './_models'

const BASE_URL = `${API_ROUTES.GUARDIAS}/horario`

export const getHorarioSemana = (fechaInicio?: string): Promise<HorarioSemanalResponse> => {
  const params = fechaInicio ? `?fecha_inicio=${fechaInicio}` : ''
  return axios.get(`${BASE_URL}/semana${params}`).then((res) => res.data.data)
}

export const generarSemana = (fechaInicio: string): Promise<{asignaciones_creadas: number}> => {
  return axios.post(`${BASE_URL}/generar-semana`, {fecha_inicio: fechaInicio}).then((res) => res.data.data)
}

export const getConfiguracion = (): Promise<ConfiguracionCiclo | null> => {
  return axios.get(`${BASE_URL}/configuracion`).then((res) => res.data.data)
}

export const saveConfiguracion = (cfg: ConfiguracionCiclo): Promise<ConfiguracionCiclo> => {
  return axios.post(`${BASE_URL}/configuracion`, cfg).then((res) => res.data.data)
}
