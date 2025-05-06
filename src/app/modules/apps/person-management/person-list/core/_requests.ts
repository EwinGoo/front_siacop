import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Persona, PersonaQueryResponse, BackendResponse, PersonasBackendData} from './_models'

const API_URL = process.env.REACT_APP_THEME_API_URL
const PERSONA_URL = `${API_URL}/persona`

const getPersonas = (query: string): Promise<PersonaQueryResponse> => {
  return axios
    .get<BackendResponse<PersonasBackendData>>(`${PERSONA_URL}?${query}`)
    .then((response) => {
      const backendData = response.data.data // Accedemos a la propiedad data del backend
      
      if (!backendData?.data || !Array.isArray(backendData.data)) {
        throw new Error('Estructura de datos inválida')
      }

      return {
        data: backendData.data, // Array de personas
        payload: {
          message: response.data.message,
          pagination: backendData.payload?.pagination
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching personas:', error)
      return {
        data: [],
        payload: {
          message: 'Error al obtener personas',
          errors: { server: [error.message] }
        }
      }
    })
}

// const getPersonas = (query: string): Promise<PersonaQueryResponse> => {
//   return axios.get(`${PERSONA_URL}?${query}`).then((d: AxiosResponse<PersonaQueryResponse>) => {
//     return d.data
//   })
// }

// const getUsers = (query: string): Promise<UsersQueryResponse> => {
//   return axios
//     .get(`${GET_USERS_URL}?${query}`)
//     .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
// }

const getPersonaById = (id: ID): Promise<Persona | undefined> => {
  return axios
    .get(`${PERSONA_URL}/${id}`)
    .then((response: AxiosResponse<Response<Persona>>) => response.data)
    .then((response: Response<Persona>) => response.data)
}

const createPersona = (persona: Persona): Promise<Persona | undefined> => {
  return axios
    .post(PERSONA_URL, persona)
    .then((response: AxiosResponse<Response<Persona>>) => response.data)
    .then((response: Response<Persona>) => response.data)
}

const updatePersona = (persona: Persona): Promise<Persona | undefined> => {
  return axios
    .put(`${PERSONA_URL}/${persona.id}`, persona)
    .then((response: AxiosResponse<Response<Persona>>) => response.data)
    .then((response: Response<Persona>) => response.data)
}

const deletePersona = (personaId: ID): Promise<void> => {
  return axios.delete(`${PERSONA_URL}/${personaId}`).then(() => {})
}

const deleteSelectedPersona = (personaIds: Array<ID>): Promise<void> => {
  const requests = personaIds.map((id) => axios.delete(`${PERSONA_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

export {
  getPersonas,
  deletePersona,
  deleteSelectedPersona,
  getPersonaById,
  createPersona,
  updatePersona,
}
