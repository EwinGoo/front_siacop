import * as Yup from 'yup'
import {validarDuracion} from '../../../helpers/validations'

export const editComisionSchema = ({isAdmin}: {isAdmin: boolean}) =>
  Yup.object().shape({
    id_asignacion_administrativo: isAdmin
      ? Yup.string().required('El solicitante es requerido')
      : Yup.string().nullable().notRequired(),
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
    descripcion_comision: Yup.string()
      .min(10, 'Mínimo 10 caracteres')
      .max(255, 'Máximo 255 caracteres')
      .required('El motivo es requerido'),
    recorrido_de: Yup.string()
      .min(3, 'Mínimo 3 caracteres')
      .max(55, 'Máximo 55 caracteres')
      .required('El punto de partida es requerido'),
    recorrido_a: Yup.string()
      .min(3, 'Mínimo 3 caracteres')
      .max(55, 'Máximo 55 caracteres')
      .required('El destino final es requerido'),
  })
