import * as Yup from 'yup'
import {validarDuracion} from '../../../helpers/validations'

export const editComisionSchema = Yup.object().shape({
  id_usuario_generador: Yup.string().required('Solicitante es requerido'),
  fecha_comision: Yup.date().required('Fecha es requerida'),
  hora_salida: Yup.string().required('Hora de salida es requerida'),
  hora_retorno: Yup.string()
    .required('Hora de retorno es requerida')
    .test('duracion-valida', 'Duración no permitida', function (horaRetorno) {
      const {hora_salida, tipo_comision} = this.parent
      const resultado = validarDuracion(hora_salida, horaRetorno, tipo_comision)
      if (resultado !== true) {
        return this.createError({message: resultado})
      }
      return true
    }),
  tipo_comision: Yup.string()
    .oneOf(['PERSONAL', 'TRANSPORTE'], 'Tipo inválido')
    .required('Tipo es requerido'),
  descripcion_comision: Yup.string().when(
    'tipo_comision',
    (tipo_comision: string[], schema: Yup.StringSchema) => {
      return tipo_comision[0] === 'PERSONAL'
        ? schema
            .min(10, 'Mínimo 10 caracteres')
            .max(255, 'Máximo 255 caracteres')
            .required('La descripción es requerida')
        : schema.nullable()
    }
  ),

  // Campos condicionales para TRANSPORTE
  recorrido_de: Yup.string().when(
    'tipo_comision',
    (tipo_comision: string[], schema: Yup.StringSchema) => {
      return tipo_comision[0] === 'TRANSPORTE'
        ? schema
            .min(3, 'Mínimo 3 caracteres')
            .max(55, 'Máximo 55 caracteres')
            .required('Origen es requerido para transporte')
        : schema.nullable()
    }
  ),

  recorrido_a: Yup.string().when(
    'tipo_comision',
    (tipo_comision: string[], schema: Yup.StringSchema) => {
      return tipo_comision[0] === 'TRANSPORTE'
        ? schema
            .min(3, 'Mínimo 3 caracteres')
            .max(55, 'Máximo 55 caracteres')
            .required('Destino es requerido para transporte')
        : schema.nullable()
    }
  ),
})
