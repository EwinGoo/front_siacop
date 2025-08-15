import * as Yup from 'yup'

export const feriadoAsuetoSchema = () =>
  Yup.object().shape({
    nombre_evento: Yup.string()
      .min(3, 'Mínimo 3 caracteres')
      .max(255, 'Máximo 255 caracteres')
      .required('Nombre del evento es requerido'),

    tipo_evento: Yup.string()
      .oneOf(['ASUETO', 'FERIADO'], 'Tipo inválido')
      .required('Tipo es requerido'),

    // **Campos condicionales**
    fecha_evento: Yup.date().when('tipo_evento', {
      is: 'ASUETO', // Si el tipo es ASUETO
      then: (schema) => schema.required('Fecha del evento es requerida para asueto'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    fecha_inicio: Yup.date().when('tipo_evento', {
      is: 'FERIADO', // Si el tipo es FERIADO
      then: (schema) => schema.required('Fecha de inicio es requerida para feriado'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    fecha_fin: Yup.date().when('tipo_evento', {
      is: 'FERIADO',
      then: (schema) =>
        schema
          .required('Fecha de fin es requerida para feriado')
          .min(Yup.ref('fecha_inicio'), 'La fecha fin no puede ser anterior a la fecha inicio'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    hora_inicio: Yup.string().when('tipo_evento', {
      is: 'ASUETO',
      then: (schema) => schema.required('Hora de inicio es requerida para asueto'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    hora_fin: Yup.string().when('tipo_evento', {
      is: 'ASUETO',
      then: (schema) => schema.required('Hora de fin es requerida para asueto'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    aplicado_a: Yup.string().when('tipo_evento', {
      is: 'ASUETO',
      then: (schema) =>
        schema
          .oneOf(['MASCULINO', 'FEMENINO', 'TODOS'], 'Valor inválido')
          .required('Aplicado a es requerido para asueto'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    detalle: Yup.string().notRequired().nullable(),
  })
