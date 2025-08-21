import * as Yup from 'yup'
import {validarDuracion} from '../../../helpers/validations'

export const editComisionSchema = ({isAdmin, tipoPermiso}: {isAdmin: boolean, tipoPermiso: string}) =>
  Yup.object().shape({
    // Solicitante - solo requerido para admins en modo creación
    id_asignacion_administrativo: isAdmin
      ? Yup.string().required('El solicitante es requerido')
      : Yup.string().nullable().notRequired(),

    // Fecha inicio - siempre requerida
    fecha_comision: Yup.date().required('Fecha es requerida'),

    // Fecha fin - solo para fisioterapia
    fecha_comision_fin: Yup.date().when([], {
      is: () => tipoPermiso === 'FISIOTERAPIA',
      then: (schema) => schema
        .required('Fecha fin es requerida')
        .min(Yup.ref('fecha_comision'), 'La fecha fin debe ser posterior a la fecha inicio'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

    // Hora salida - siempre requerida
    hora_salida: Yup.string().required('Hora de salida es requerida'),

    // Hora retorno - siempre requerida
    hora_retorno: Yup.string()
      .required('Hora de retorno es requerida')
      .test('duracion-valida', 'Duración no permitida', function (horaRetorno) {
        const {hora_salida} = this.parent
        const resultado = validarDuracion(hora_salida, horaRetorno, tipoPermiso)
        if (resultado !== true) {
          return this.createError({message: resultado})
        }
        return true
      }),

    // Tipo de permiso - validar contra los tipos permitidos
    tipo_comision: Yup.string()
      .oneOf(['PERSONAL', 'TRANSPORTE', 'CAJA SALUD', 'FISIOTERAPIA'], 'Tipo inválido')
      .required('Tipo es requerido'),

    // ID tipo permiso
    id_tipo_permiso: Yup.string().required('Tipo de permiso es requerido'),

    // Descripción - requerida para todos los tipos
    descripcion_comision: Yup.string()
      .min(10, 'Mínimo 10 caracteres')
      .max(500, 'Máximo 500 caracteres')
      .required('La descripción es requerida'),

    // Recorrido DE - solo para PERSONAL y TRANSPORTE
    recorrido_de: Yup.string().when([], {
      is: () => tipoPermiso === 'PERSONAL' || tipoPermiso === 'TRANSPORTE',
      then: (schema) => schema
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .required('El punto de partida es requerido'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

    // Recorrido A - solo para PERSONAL y TRANSPORTE  
    recorrido_a: Yup.string().when([], {
      is: () => tipoPermiso === 'PERSONAL' || tipoPermiso === 'TRANSPORTE',
      then: (schema) => schema
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .required('El destino final es requerido'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

    // Campos adicionales que podrían ser necesarios
    estado_boleta_comision: Yup.string().nullable().notRequired(),
    id_usuario_generador: Yup.string().nullable().notRequired(),
  })

// Función auxiliar para obtener mensajes personalizados según el tipo
export const getMensajesValidacion = (tipoPermiso: string) => {
  const mensajes = {
    'PERSONAL': {
      descripcion: 'Describa detalladamente el motivo de la comisión personal',
      recorrido_de: 'Indique el punto de partida de la comisión',
      recorrido_a: 'Indique el destino final de la comisión',
      hora_salida: 'Hora de salida de la oficina',
      hora_retorno: 'Hora estimada de retorno a la oficina'
    },
    'TRANSPORTE': {
      descripcion: 'Describa el motivo del uso del transporte institucional',
      recorrido_de: 'Punto de partida del recorrido',
      recorrido_a: 'Destino final del recorrido',
      hora_salida: 'Hora de salida',
      hora_retorno: 'Hora estimada de retorno'
    },
    'CAJA SALUD': {
      descripcion: 'Describa la razón de la atención médica',
      hora_salida: 'Hora de salida para la atención médica',
      hora_retorno: 'Hora estimada de retorno',
      fecha_comision: 'Fecha de la atención médica'
    },
    'FISIOTERAPIA': {
      descripcion: 'Describa el motivo de la fisioterapia',
      hora_salida: 'Hora de llegada a la cita',
      hora_retorno: 'Hora de salida de la cita',
      fecha_comision: 'Fecha inicio del tratamiento',
      fecha_comision_fin: 'Fecha fin del tratamiento'
    }
  }

  return mensajes[tipoPermiso] || mensajes['PERSONAL']
}