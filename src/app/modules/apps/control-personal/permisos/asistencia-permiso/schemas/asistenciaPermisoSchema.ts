import * as Yup from 'yup'

// export const asistenciaPermisoSchema = ({isAdmin = false}: {isAdmin: boolean}) =>
export const asistenciaPermisoSchema = ({
  isAdmin,
  limiteDias,
}: {
  isAdmin: boolean
  limiteDias?: number | null
}) => {

  return Yup.object().shape({
    id_asignacion_administrativo: Yup.number().when([], {
      is: () => isAdmin,
      then: (schema) => schema.required('El solicitante es requerido'),
      otherwise: (schema) => schema.notRequired(),
    }),
    id_tipo_permiso: Yup.number().required('Tipo de permiso es requerido'),
    fecha_inicio_permiso: Yup.date().required('Fecha de inicio es requerida'),
    fecha_fin_permiso: Yup.date()
      .required('Fecha de fin es requerida')
      .min(Yup.ref('fecha_inicio_permiso'), 'La fecha fin no puede ser anterior a la fecha inicio')
      .test(
        'limite-dias',
        ({value, path, parent}) => {
          if (!limiteDias) return '' // si no hay límite configurado, no mostramos error
          return `La duración del permiso no puede exceder ${limiteDias} días`
        },
        function (value) {
          if (!limiteDias) return true // sin límite, validación pasa
          if (!value || !this.parent.fecha_inicio_permiso) return true

          const fechaInicio = new Date(this.parent.fecha_inicio_permiso)
          const fechaFin = new Date(value)
          const diffTime = fechaFin.getTime() - fechaInicio.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 para contar ambos días
          return diffDays <= limiteDias
        }
      ),
  })
}
