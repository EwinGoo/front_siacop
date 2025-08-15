export const validarDuracion = (
  hora_salida: string, 
  hora_retorno: string, 
  tipo_comision: string
): true | string => {
  if (!hora_salida || !hora_retorno || !tipo_comision) return true

  const [hs, ms] = hora_salida.split(':').map(Number)
  const [hr, mr] = hora_retorno.split(':').map(Number)

  const salida = new Date(0, 0, 0, hs, ms)
  const retorno = new Date(0, 0, 0, hr, mr)

  const diffMs = retorno.getTime() - salida.getTime()
  const diffHrs = diffMs / (1000 * 60 * 60)

  if (diffHrs < 0) return 'La hora de retorno debe ser posterior a la salida'
  // if (tipo_comision === 'TRANSPORTE' && diffHrs > 8) return 'Máximo 8 horas para transporte'
  if (tipo_comision === 'PERSONAL' && diffHrs > 4) return 'Máximo 4 horas para comisión'

  return true
}
