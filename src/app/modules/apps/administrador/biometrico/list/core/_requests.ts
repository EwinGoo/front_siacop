import axios, {AxiosResponse} from 'axios'
import {ID, Response} from 'src/_metronic/helpers'
import {
  DispositivoBiometrico,
  DispositivoBiometricoQueryResponse,
  BackendResponse,
  DispositivoBiometricoBackendData,
  ZktecoLoginResponse,
  LogoutResponse,
  DeviceUsersResponse,
  DeviceInfoResponse,
  DeviceUser,
} from './_models'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import axiosClient from 'src/app/services/axiosClient'

const BIOMETRICO_URL = API_ROUTES.ADMINISTRADOR + '/biometrico'
const ZKTECO_URL = API_ROUTES.ADMINISTRADOR + '/zkteco'

const getDispositivosBiometricos = (query: string): Promise<DispositivoBiometricoQueryResponse> => {
  return axios
    .get<BackendResponse<DispositivoBiometricoBackendData>>(`${BIOMETRICO_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data

      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de dispositivos biométricos
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination,
        },
      }
    })
    .catch((error) => {
      console.error('Error fetching dispositivos biométricos:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener dispositivos biométricos',
          errors: {server: [error.message]},
        },
      }
    })
}

const getDispositivoBiometricoById = (id: ID): Promise<DispositivoBiometrico | undefined> => {
  return axios
    .get(`${BIOMETRICO_URL}/${id}`)
    .then((response: AxiosResponse<Response<DispositivoBiometrico>>) => response.data)
    .then((response: Response<DispositivoBiometrico>) => response.data)
}

const getDispositivoBiometricoBySerial = (
  serial: string
): Promise<DispositivoBiometrico | undefined> => {
  return axios
    .get(`${BIOMETRICO_URL}/serial/${serial}`)
    .then((response: AxiosResponse<Response<DispositivoBiometrico>>) => response.data)
    .then((response: Response<DispositivoBiometrico>) => response.data)
}

const createDispositivoBiometrico = (
  dispositivo: DispositivoBiometrico
): Promise<DispositivoBiometrico | undefined> => {
  return axios
    .post(BIOMETRICO_URL, dispositivo)
    .then((response: AxiosResponse<Response<DispositivoBiometrico>>) => response.data)
    .then((response: Response<DispositivoBiometrico>) => response.data)
}

const updateDispositivoBiometrico = (
  dispositivo: DispositivoBiometrico
): Promise<DispositivoBiometrico | undefined> => {
  return axios
    .put(`${BIOMETRICO_URL}/${dispositivo.id_biometrico}`, dispositivo)
    .then((response: AxiosResponse<Response<DispositivoBiometrico>>) => response.data)
    .then((response: Response<DispositivoBiometrico>) => response.data)
}

const deleteDispositivoBiometrico = (dispositivoId: ID): Promise<void> => {
  return axios.delete(`${BIOMETRICO_URL}/${dispositivoId}`).then(() => {})
}

const deleteSelectedDispositivosBiometricos = (dispositivoIds: Array<ID>): Promise<void> => {
  const requests = dispositivoIds.map((id) => axios.delete(`${BIOMETRICO_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const testDeviceConnection = (id: ID): Promise<{status: string; message: string} | undefined> => {
  return axiosClient
    .get(`${ZKTECO_URL}/${id}/ping`)
    .then((response: AxiosResponse<Response<{status: string; message: string}>>) => response.data)
    .then((response: Response<{status: string; message: string}>) => response.data)
}

const loginBiometrico = (
  device_ip: string,
  username: string,
  password: string
): Promise<ZktecoLoginResponse> => {
  return axiosClient
    .post<Promise<ZktecoLoginResponse>>(`${ZKTECO_URL}/login`, {
      device_ip, // 👈 enviamos la IP del dispositivo
      username,
      password,
    })
    .then((res) => res.data)
}

const logoutBiometrico = async (): Promise<LogoutResponse> => {
  const {data} = await axiosClient.post<LogoutResponse>(`${ZKTECO_URL}/logout`)
  return data
}

// Obtener usuarios del dispositivo
const getDeviceUsers = async (): Promise<DeviceUsersResponse> => {
  try {
    const {data} = await axiosClient.get<DeviceUsersResponse>(`${ZKTECO_URL}/users`)
    return data
  } catch (error: any) {
    console.error('Error al obtener usuarios del dispositivo:', error)
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios del dispositivo')
  }
}

// Obtener información del dispositivo
const getDeviceInfo = async (): Promise<DeviceInfoResponse> => {
  try {
    const {data} = await axiosClient.get<DeviceInfoResponse>(`${ZKTECO_URL}/device-info`)
    return data
  } catch (error: any) {
    console.error('Error al obtener información del dispositivo:', error)
    throw new Error(error.response?.data?.message || 'Error al obtener información del dispositivo')
  }
}

// Obtener un usuario específico del dispositivo
const getDeviceUser = async (uid: number): Promise<{success: boolean; data: DeviceUser}> => {
  try {
    const {data} = await axiosClient.get<{success: boolean; data: DeviceUser}>(
      `${ZKTECO_URL}/users/${uid}`
    )
    return data
  } catch (error: any) {
    console.error('Error al obtener usuario del dispositivo:', error)
    throw new Error(error.response?.data?.message || 'Error al obtener usuario del dispositivo')
  }
}

export {
  getDispositivosBiometricos,
  deleteDispositivoBiometrico,
  deleteSelectedDispositivosBiometricos,
  getDispositivoBiometricoById,
  getDispositivoBiometricoBySerial,
  createDispositivoBiometrico,
  updateDispositivoBiometrico,
  testDeviceConnection,
  loginBiometrico,
  logoutBiometrico,
  getDeviceUsers,
  getDeviceInfo,
  getDeviceUser,
}
