import {FC, useState, useEffect} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../../_metronic/helpers'
import {initialFeriadoAsueto, FeriadoAsueto} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ListLoading} from '../components/loading/ListLoading'
import {createFeriadoAsueto, updateFeriadoAsueto} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import Select from 'react-select'
import {FieldsAsueto} from './FieldsAsueto'
import {FieldsFeriado} from './FieldsFeriado'

type Props = {
  isFeriadoAsuetoLoading: boolean
  feriadoAsueto: FeriadoAsueto
  onClose: () => void
}
const opciones = [
  { label: 'Asueto', value: 'ASUETO' },
  { label: 'Feriado', value: 'FERIADO' },
]

const editFeriadoAsuetoSchema = Yup.object().shape({
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

const EditModalForm: FC<Props> = ({feriadoAsueto, isFeriadoAsuetoLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [feriadoAsuetoForEdit] = useState<FeriadoAsueto>({
    ...feriadoAsueto,
    nombre_evento: feriadoAsueto.nombre_evento || initialFeriadoAsueto.nombre_evento,
    tipo_evento: feriadoAsueto.tipo_evento || initialFeriadoAsueto.tipo_evento,
    fecha_evento: feriadoAsueto.fecha_evento || initialFeriadoAsueto.fecha_evento,
    fecha_inicio: feriadoAsueto.fecha_inicio || initialFeriadoAsueto.fecha_inicio,
    fecha_fin: feriadoAsueto.fecha_fin || initialFeriadoAsueto.fecha_fin,
    hora_inicio: feriadoAsueto.hora_inicio || initialFeriadoAsueto.hora_inicio,
    hora_fin: feriadoAsueto.hora_fin || initialFeriadoAsueto.hora_fin,
    aplicado_a: feriadoAsueto.aplicado_a || initialFeriadoAsueto.aplicado_a,
  })

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: feriadoAsuetoForEdit,
    validationSchema: editFeriadoAsuetoSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({})

      try {
        if (isNotEmpty(values.id_asistencia_feriado_asueto)) {
          await updateFeriadoAsueto(values)
          toast.success('Feriado/Asueto actualizado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createFeriadoAsueto(values)
          toast.success('Feriado/Asueto creado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        }
        cancel(true)
        onClose()
      } catch (error: any) {
        console.error(error)
        if (error.response?.status === 422 && error.response.data?.validation_errors) {
          setBackendErrors(error.response.data.validation_errors)
          await Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: Object.entries(error.response.data.validation_errors)
              .map(([field, message]) => `<li>${message}</li>`)
              .join(''),
          })
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al procesar la solicitud',
          })
        }
      } finally {
        setSubmitting(false)
      }
    },
  })

  const getFieldError = (fieldName: string) => {
    return formik.errors[fieldName] || backendErrors[fieldName]
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(fieldName))
  }

  useEffect(() => {
    // Limpiar campos cuando cambia el tipo de evento
    if (formik.values.tipo_evento === 'ASUETO') {
      formik.setFieldValue('fecha_inicio', feriadoAsuetoForEdit.fecha_inicio)
      formik.setFieldValue('fecha_fin', feriadoAsuetoForEdit.fecha_fin)
    } else if (formik.values.tipo_evento === 'FERIADO') {
      formik.setFieldValue('fecha_evento', feriadoAsuetoForEdit.fecha_evento)
      formik.setFieldValue('hora_inicio', feriadoAsuetoForEdit.hora_inicio)
      formik.setFieldValue('hora_fin', feriadoAsuetoForEdit.hora_fin)
      formik.setFieldValue('aplicado_a', feriadoAsuetoForEdit.aplicado_a)
    }
  }, [formik.values.tipo_evento])

  return (
    <>
      <form id='kt_modal_add_feriado_asueto_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {/* Nombre del Evento */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Nombre del Evento</label>
            <input
              {...formik.getFieldProps('nombre_evento')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('nombre_evento'),
                'is-valid': formik.touched.nombre_evento && isFieldValid('nombre_evento'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('nombre_evento') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('nombre_evento')}</span>
              </div>
            )}
          </div>

          {/* Tipo de Evento */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Tipo de Evento</label>
            <Select
            className="react-select-styled react-select-solid bg-gray"
            classNamePrefix="react-select"
            value={opciones.find(op => op.value === formik.values.tipo_evento) || null}
            onChange={(selectedOption) =>{
              if(selectedOption){
                formik.setFieldValue('tipo_evento',selectedOption.value)
              }
            }}
            options={opciones}
            placeholder="Seleccione un tipo de evento"
            isDisabled={formik.isSubmitting}
            styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: !isFieldValid('tipo_evento')
                    ? '#F64E60'
                    : formik.touched.tipo_evento && isFieldValid('tipo_evento')
                    ? '#1BC5BD'
                    : base.borderColor,
                  boxShadow: 'none',
                  minHeight: '44px',
                  border: 'none',
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '0.475rem',
                }),
              }}
            
            />
            {/* <select
              {...formik.getFieldProps('tipo_evento')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('tipo_evento'),
                'is-valid': formik.touched.tipo_evento && isFieldValid('tipo_evento'),
              })}
              disabled={formik.isSubmitting}
            >
              <option value='ASUETO'>Asueto</option>
              <option value='FERIADO'>Feriado</option>
            </select> */}
            {!isFieldValid('tipo_evento') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('tipo_evento')}</span>
              </div>
            )}
          </div>

          {/* Campos para ASUETO */}
          {formik.values.tipo_evento === 'ASUETO' && (
            <>
              <div className='fv-row mb-7 px-1'>
                <label className='required fw-bold fs-6 mb-2'>Fecha del Evento</label>
                <Flatpickr
                  value={formik.values.fecha_evento ? new Date(formik.values.fecha_evento) : undefined}
                  onChange={([date]) => formik.setFieldValue('fecha_evento', date)}
                  options={{
                    dateFormat: 'Y-m-d',
                    locale: Spanish,
                    monthSelectorType: "static"
                  }}
                  className={clsx('d-block form-control form-control-solid', {
                    'is-invalid': !isFieldValid('fecha_evento'),
                    'is-valid': formik.touched.fecha_evento && isFieldValid('fecha_evento'),
                  })}
                  disabled={formik.isSubmitting}
                />
                {!isFieldValid('fecha_evento') && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{getFieldError('fecha_evento')}</span>
                  </div>
                )}
              </div>

              <div className='row mb-7'>
                <div className='col-md-6 fv-row'>
                  <label className='required fw-bold fs-6 mb-2'>Hora Inicio</label>
                  <input
                    type='time'
                    {...formik.getFieldProps('hora_inicio')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': !isFieldValid('hora_inicio'),
                      'is-valid': formik.touched.hora_inicio && isFieldValid('hora_inicio'),
                    })}
                    disabled={formik.isSubmitting}
                  />
                  {!isFieldValid('hora_inicio') && (
                    <div className='fv-plugins-message-container'>
                      <span role='alert'>{getFieldError('hora_inicio')}</span>
                    </div>
                  )}
                </div>
                <div className='col-md-6 fv-row'>
                  <label className='required fw-bold fs-6 mb-2'>Hora Fin</label>
                  <input
                    type='time'
                    {...formik.getFieldProps('hora_fin')}
                    className={clsx('form-control form-control-solid', {
                      'is-invalid': !isFieldValid('hora_fin'),
                      'is-valid': formik.touched.hora_fin && isFieldValid('hora_fin'),
                    })}
                    disabled={formik.isSubmitting}
                  />
                  {!isFieldValid('hora_fin') && (
                    <div className='fv-plugins-message-container'>
                      <span role='alert'>{getFieldError('hora_fin')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className='fv-row mb-7 px-1'>
                <label className='required fw-bold fs-6 mb-2'>Aplicado a</label>
                <select
                  {...formik.getFieldProps('aplicado_a')}
                  className={clsx('form-control form-control-solid', {
                    'is-invalid': !isFieldValid('aplicado_a'),
                    'is-valid': formik.touched.aplicado_a && isFieldValid('aplicado_a'),
                  })}
                  disabled={formik.isSubmitting}
                >
                  <option value='TODOS'>Todos</option>
                  <option value='MASCULINO'>Masculino</option>
                  <option value='FEMENINO'>Femenino</option>
                </select>
                {!isFieldValid('aplicado_a') && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{getFieldError('aplicado_a')}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Campos para FERIADO */}
          {formik.values.tipo_evento === 'FERIADO' && (
            <div className='row mb-7'>
              <div className='col-md-6 fv-row'>
                <label className='required fw-bold fs-6 mb-2'>Fecha Inicio</label>
                <Flatpickr
                  value={formik.values.fecha_fin ? new Date(formik.values.fecha_fin) : undefined}
                  onChange={([date]) => formik.setFieldValue('fecha_inicio', date)}
                  options={{dateFormat: 'Y-m-d', locale: Spanish, monthSelectorType: "static"}}
                  className={clsx('form-control form-control-solid', {
                    'is-invalid': !isFieldValid('fecha_inicio'),
                    'is-valid': formik.touched.fecha_inicio && isFieldValid('fecha_inicio'),
                  })}
                  disabled={formik.isSubmitting}
                />
                {!isFieldValid('fecha_inicio') && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{getFieldError('fecha_inicio')}</span>
                  </div>
                )}
              </div>
              <div className='col-md-6 fv-row'>
                <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
                <Flatpickr
                  value={formik.values.fecha_fin ? new Date(formik.values.fecha_fin) : undefined}
                  onChange={([date]) => formik.setFieldValue('fecha_fin', date)}
                  options={{dateFormat: 'Y-m-d', locale: Spanish, monthSelectorType: "static"}}
                  className={clsx('form-control form-control-solid', {
                    'is-invalid': !isFieldValid('fecha_fin'),
                    'is-valid': formik.touched.fecha_fin && isFieldValid('fecha_fin'),
                  })}
                  disabled={formik.isSubmitting}
                />
                {!isFieldValid('fecha_fin') && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{getFieldError('fecha_fin')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detalle (compartido para ambos tipos) */}
          {/* <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Detalle (Opcional)</label>
            <textarea
              {...formik.getFieldProps('detalle')}
              className='form-control form-control-solid'
              rows={3}
              disabled={formik.isSubmitting}
            />
          </div> */}
        </div>

        {/* Actions (se mantiene igual) */}
        <div className='text-center pt-5'>
          <Button variant='light' onClick={onClose} className='me-3' disabled={formik.isSubmitting}>
            <KTIcon iconName='cross' className='fs-2' />
            Cancelar
          </Button>

          <Button
            variant='primary'
            type='submit'
            disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            {formik.isSubmitting ? (
              <>
                Procesando... <span className='spinner-border spinner-border-sm ms-2' />
              </>
            ) : (
              <>
                <KTIcon iconName='check' className='fs-2 me-1' />
                {feriadoAsueto.id_asistencia_feriado_asueto ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </div>
      </form>
      {(formik.isSubmitting || isFeriadoAsuetoLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
