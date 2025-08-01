import * as Yup from 'yup'

// export const asistenciaPermisoSchema = ({isAdmin = false}: {isAdmin: boolean}) =>
export const asistenciaPermisoSchema = ({isAdmin}: {isAdmin: boolean}) =>
  Yup.object().shape({
    // id_persona_administrativo: Yup.number().required('Persona administrativo es requerida'),
    id_tipo_permiso: Yup.number().required('Tipo de permiso es requerido'),
    fecha_inicio_permiso: Yup.date().required('Fecha de inicio es requerida'),
    fecha_fin_permiso: Yup.date()
      .required('Fecha de fin es requerida')
      .min(Yup.ref('fecha_inicio_permiso'), 'La fecha fin no puede ser anterior a la fecha inicio'),
    detalle_permiso: Yup.string()
      .max(555, 'Máximo 555 caracteres')
      .required('Detalle del permiso es requerido'),
    id_usuario_generador: Yup.number()
      .nullable()
      .test('is-required-if-not-admin', 'El solicitante es requerido', function (value) {
        if (isAdmin) {
          return value !== null && value !== undefined
        }
        return true
      }),
  })
