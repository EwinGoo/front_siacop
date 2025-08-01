export const COMISION_ESTADOS = [
  'GENERADO',
  'ENVIADO',
  'RECEPCIONADO',
  'APROBADO',
  'OBSERVADO',
] as const
export type EstadoComision = typeof COMISION_ESTADOS[number]

interface PermisosComisionOptions {
  estado: EstadoComision
  puedeGestionar: boolean
}

export const getPermisosComision = ({estado, puedeGestionar}: PermisosComisionOptions) => {
  return {
    puedeEditar: estado !== 'APROBADO' && (puedeGestionar || estado === 'GENERADO'),
    puedeEliminar: estado === 'GENERADO' || (puedeGestionar && ['GENERADO', 'ENVIADO'].includes(estado)),
    puedeAprobar: puedeGestionar && !['APROBADO', 'GENERADO', 'ENVIADO'].includes(estado),
    puedeRecepcionar: puedeGestionar && !['APROBADO', 'RECEPCIONADO', 'OBSERVADO'].includes(estado),
    puedeObservar: puedeGestionar && !['APROBADO', 'GENERADO', 'ENVIADO'].includes(estado),
  }
}
