import axiosClient from 'src/app/services/axiosClient'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {
  BackendEnvelope,
  ImportacionResumenResponse,
  ListadoPaginado,
  ProcesoPlanilla,
  ProcesoPlanillaDetalle,
  ResultadoDiario,
  ResultadoDiarioDetalle,
  ResultadoMensual,
  ResultadoMensualDetalle,
} from './_models'

const BASE_URL = API_ROUTES.PLANILLA_ASISTENCIA

const unwrap = <T,>(response: {data: BackendEnvelope<T>}): T => response.data.data

export const uploadMarcaciones = async (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('archivos[]', file))
  const response = await axiosClient.post<BackendEnvelope<ImportacionResumenResponse>>(
    `${BASE_URL}/importaciones/marcaciones/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return unwrap(response)
}

export const getResumenImportaciones = async () => {
  const response = await axiosClient.get<BackendEnvelope<ImportacionResumenResponse>>(
    `${BASE_URL}/importaciones/marcaciones/resumen`
  )
  return unwrap(response)
}

export const getProcesosPlanilla = async (page = 1, itemsPerPage = 10) => {
  const response = await axiosClient.get<BackendEnvelope<ListadoPaginado<ProcesoPlanilla>>>(
    `${BASE_URL}/procesos`,
    {
      params: {
        page,
        items_per_page: itemsPerPage,
      },
    }
  )
  return unwrap(response)
}

export const createProcesoPlanilla = async (payload: {fecha_inicio: string; fecha_fin: string}) => {
  const response = await axiosClient.post<BackendEnvelope<ProcesoPlanilla>>(`${BASE_URL}/procesos`, payload)
  return unwrap(response)
}

export const ejecutarProcesoPlanilla = async (idProceso: number) => {
  const response = await axiosClient.post<BackendEnvelope<ProcesoPlanilla>>(
    `${BASE_URL}/procesos/${idProceso}/ejecutar`
  )
  return unwrap(response)
}

export const getDetalleProcesoPlanilla = async (idProceso: number) => {
  const response = await axiosClient.get<BackendEnvelope<ProcesoPlanillaDetalle>>(
    `${BASE_URL}/procesos/${idProceso}`
  )
  return unwrap(response)
}

export const getResultadosDiarios = async (idProceso: number, params?: Record<string, unknown>) => {
  const response = await axiosClient.get<BackendEnvelope<ListadoPaginado<ResultadoDiario>>>(
    `${BASE_URL}/procesos/${idProceso}/resultados`,
    {params}
  )
  return unwrap(response)
}

export const getDetalleResultadoDiario = async (
  idProceso: number,
  idPersona: number,
  fecha: string
) => {
  const response = await axiosClient.get<BackendEnvelope<any>>(
    `${BASE_URL}/procesos/${idProceso}/resultados/persona/${idPersona}`,
    {
      params: {fecha},
    }
  )
  const payload = unwrap(response)
  const detalle = payload?.detalle || null

  return {
    ...(payload?.resultado_diario || {}),
    detalle_json: detalle
      ? {
          guardia: detalle?.guardia || null,
          guardias: Array.isArray(detalle?.guardias) ? detalle.guardias : [],
          reemplazos_titular: Array.isArray(detalle?.reemplazos_titular)
            ? detalle.reemplazos_titular
            : [],
          justificativo: detalle?.justificativo || null,
          marcaciones: Array.isArray(detalle?.marcaciones) ? detalle.marcaciones : [],
          marcaciones_sobrantes: Array.isArray(detalle?.marcaciones_sobrantes)
            ? detalle.marcaciones_sobrantes
            : [],
          es_no_descontable: Boolean(detalle?.es_no_descontable),
        }
      : null,
    puntos: Array.isArray(payload?.puntos)
      ? payload.puntos.map((punto: any) => ({
          orden: Number(punto?.orden || 0),
          nombre_punto: punto?.nombre_punto || '-',
          tipo_resultado: punto?.estado_punto || 'SIN_MARCACION',
          codigo_punto: punto?.codigo_punto || null,
          hora_esperada: punto?.hora_esperada || null,
          valor_mostrado: punto?.hora_marcada || punto?.justificativo_punto || null,
          hora_marcada: punto?.hora_marcada || null,
          id_marcacion: punto?.id_marcacion ? Number(punto.id_marcacion) : null,
          fecha_hora_marcacion: punto?.fecha_hora_marcacion || null,
          minutos_atraso:
            (punto?.estado_punto || '').toUpperCase() === 'ATRASO'
              ? Number(punto?.minutos_desfase || 0)
              : 0,
          minutos_desfase: Number(punto?.minutos_desfase || 0),
          justificativo_punto: punto?.justificativo_punto || null,
          observacion: punto?.observacion || null,
        }))
      : [],
  } as ResultadoDiarioDetalle
}

export const getResultadosMensuales = async (idProceso: number, params?: Record<string, unknown>) => {
  const response = await axiosClient.get<BackendEnvelope<ListadoPaginado<ResultadoMensual>>>(
    `${BASE_URL}/procesos/${idProceso}/resultados-mensuales`,
    {params}
  )
  return unwrap(response)
}

export const getDetalleResultadoMensual = async (idProceso: number, idPersona: number) => {
  const response = await axiosClient.get<BackendEnvelope<ResultadoMensualDetalle>>(
    `${BASE_URL}/procesos/${idProceso}/resultados-mensuales/persona/${idPersona}`
  )
  return unwrap(response)
}
