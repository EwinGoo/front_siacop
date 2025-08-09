import * as Yup from 'yup'

// export const asistenciaPermisoSchema = ({isAdmin = false}: {isAdmin: boolean}) =>
export const asistenciaPermisoSchema = ({isAdmin}: {isAdmin: boolean}) =>
  Yup.object().shape({
    id_asignacion_administrativo: Yup.number().when([], {
      is: () => isAdmin,
      then: (schema) => schema.required('El solicitante es requerido'),
      otherwise: (schema) => schema.notRequired(),
    }),
    // id_asignacion_administrativo: Yup.number()
    //   .required('El solicitante es requerido')
    //   .test('is-required-if-not-admin', 'El solicitante es requerido', function (value) {
    //     console.log(isAdmin);
    //     if (isAdmin) {
    //       return value !== null && value !== undefined
    //     }
    //     return true
    //   }),
    id_tipo_permiso: Yup.number().required('Tipo de permiso es requerido'),
    fecha_inicio_permiso: Yup.date().required('Fecha de inicio es requerida'),
    fecha_fin_permiso: Yup.date()
      .required('Fecha de fin es requerida')
      .min(Yup.ref('fecha_inicio_permiso'), 'La fecha fin no puede ser anterior a la fecha inicio'),
    // detalle_permiso: Yup.string()
    //   .max(555, 'Máximo 555 caracteres')
    //   .required('Detalle del permiso es requerido'),
  })
