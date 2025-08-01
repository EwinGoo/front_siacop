import * as Yup from 'yup'

export const ObservarSchema = Yup.object().shape({
  observacion: Yup.string()
    .min(5, 'Debe tener al menos 5 caracteres')
    .max(500, 'Máximo 500 caracteres')
    .required('La observación es obligatoria'),
})