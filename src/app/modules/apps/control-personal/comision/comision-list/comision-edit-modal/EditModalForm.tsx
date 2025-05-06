import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../../_metronic/helpers'
import {initialComision, Comision} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ListLoading} from '../components/loading/ListLoading'
import {createComision, updateComision} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import Select from 'react-select'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

type Props = {
  isComisionLoading: boolean
  comision: Comision
  onClose: () => void
}

// Función para formatear la fecha
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('es-ES', options).format(date)
}

// Función para generar las opciones de fecha
const generateDateOptions = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {date: yesterday, label: formatDate(yesterday), value: yesterday.toISOString().split('T')[0]},
    {date: today, label: formatDate(today), value: today.toISOString().split('T')[0]},
    {date: tomorrow, label: formatDate(tomorrow), value: tomorrow.toISOString().split('T')[0]},
  ]
}

const editComisionSchema = Yup.object().shape({
  descripcion_comision: Yup.string()
    .min(10, 'Mínimo 10 caracteres')
    .max(255, 'Máximo 255 caracteres')
    .required('La descripción es requerida'),
  recorrido_de: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(55, 'Máximo 55 caracteres')
    .required('Origen es requerido'),
  recorrido_a: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(55, 'Máximo 55 caracteres')
    .required('Destino es requerido'),
  fecha_comision: Yup.date().required('Fecha es requerida'),
  hora_salida: Yup.string().required('Hora de salida es requerida'),
  hora_retorno: Yup.string().required('Hora de retorno es requerida'),
  tipo_comision: Yup.string()
    .oneOf(['COMISION', 'TRANSPORTE'], 'Tipo inválido')
    .required('Tipo es requerido'),
})

const EditModalForm: FC<Props> = ({comision, isComisionLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [comisionForEdit] = useState<Comision>({
    ...comision,
    descripcion_comision: comision.descripcion_comision || initialComision.descripcion_comision,
    recorrido_de: comision.recorrido_de || initialComision.recorrido_de,
    recorrido_a: comision.recorrido_a || initialComision.recorrido_a,
    fecha_comision: comision.fecha_comision || initialComision.fecha_comision,
    hora_salida: comision.hora_salida || initialComision.hora_salida,
    hora_retorno: comision.hora_retorno || initialComision.hora_retorno,
    tipo_comision: comision.tipo_comision || initialComision.tipo_comision,
    estado_boleta_comision:
      comision.estado_boleta_comision || initialComision.estado_boleta_comision,
  })

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: comisionForEdit,
    validationSchema: editComisionSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({})

      try {
        if (isNotEmpty(values.id_comision)) {
          await updateComision(values)
          toast.success('Comisión actualizada correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createComision(values)
          toast.success('Comisión creada correctamente', {
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

  const generateDateOptions = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return [
      {
        value: yesterday.toISOString().split('T')[0],
        label: formatDate(yesterday),
        data: yesterday,
      },
      {
        value: today.toISOString().split('T')[0],
        label: formatDate(today),
        data: today,
      },
      {
        value: tomorrow.toISOString().split('T')[0],
        label: formatDate(tomorrow),
        data: tomorrow,
      },
    ]
  }

  const dateOptions = generateDateOptions()

  // Encontrar la opción seleccionada actualmente
  const selectedDate =
    dateOptions.find((option) => option.value === formik.values.fecha_comision) || null

  return (
    <>
      <form id='kt_modal_add_comision_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {/* Tipo de Comisión */}
          <div className='fv-row mb-7 px-1 d-none'>
            <label className='required fw-bold fs-6 mb-2'>Tipo Comisión</label>
            <select
              {...formik.getFieldProps('tipo_comision')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('tipo_comision'),
                'is-valid': formik.touched.tipo_comision && isFieldValid('tipo_comision'),
              })}
              // disabled={formik.isSubmitting}
            >
              <option value='COMISION'>Comisión</option>
              <option value='TRANSPORTE'>Transporte</option>
            </select>
            {!isFieldValid('tipo_comision') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('tipo_comision')}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Descripción</label>
            <textarea
              {...formik.getFieldProps('descripcion_comision')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('descripcion_comision'),
                'is-valid':
                  formik.touched.descripcion_comision && isFieldValid('descripcion_comision'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('descripcion_comision') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('descripcion_comision')}</span>
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Fecha comisión</label>
            <Select
              className='react-select-styled react-select-solid bg-gray'
              classNamePrefix='react-select'
              value={selectedDate}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  formik.setFieldValue('fecha_comision', selectedOption.value)
                }
              }}
              options={dateOptions}
              placeholder='Seleccione una fecha'
              isDisabled={formik.isSubmitting}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: !isFieldValid('fecha_comision')
                    ? '#F64E60'
                    : formik.touched.fecha_comision && isFieldValid('fecha_comision')
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
            {!isFieldValid('fecha_comision') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('fecha_comision')}</span>
              </div>
            )}
          </div>

          {/* Horarios */}
          <div className='row mb-7 px-1'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Hora Salida</label>
              <input
                type='time'
                {...formik.getFieldProps('hora_salida')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('hora_salida'),
                  'is-valid': formik.touched.hora_salida && isFieldValid('hora_salida'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('hora_salida') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('hora_salida')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Hora Retorno</label>
              <input
                type='time'
                {...formik.getFieldProps('hora_retorno')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('hora_retorno'),
                  'is-valid': formik.touched.hora_retorno && isFieldValid('hora_retorno'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('hora_retorno') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('hora_retorno')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ruta */}
          <div className='row mb-7 px-1'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Origen</label>
              <input
                {...formik.getFieldProps('recorrido_de')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('recorrido_de'),
                  'is-valid': formik.touched.recorrido_de && isFieldValid('recorrido_de'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('recorrido_de') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('recorrido_de')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Destino</label>
              <input
                {...formik.getFieldProps('recorrido_a')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('recorrido_a'),
                  'is-valid': formik.touched.recorrido_a && isFieldValid('recorrido_a'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('recorrido_a') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('recorrido_a')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='text-center pt-5 mb-6'>
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
                {comision.id_comision ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </div>
      </form>
      {(formik.isSubmitting || isComisionLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
