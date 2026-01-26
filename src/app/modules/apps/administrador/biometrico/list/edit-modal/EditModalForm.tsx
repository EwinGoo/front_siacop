import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from 'src/_metronic/helpers'
import {initialDispositivoBiometrico, DispositivoBiometrico} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {createDispositivoBiometrico, updateDispositivoBiometrico} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'
import {FormActions} from 'src/app/modules/components/FormActions'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'

// Schema de validación
const dispositivoBiometricoSchema = Yup.object().shape({
  nombre_dispositivo: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .required('El nombre del dispositivo es obligatorio'),
  direccion_ip: Yup.string()
    .matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Debe proporcionar una dirección IP válida'
    )
    .max(50, 'La dirección IP no puede exceder los 50 caracteres')
    .required('La dirección IP es obligatoria'),
  puerto: Yup.number()
    .integer('El puerto debe ser un número entero')
    .min(1, 'El puerto debe ser mayor a 0')
    .max(65535, 'El puerto no puede ser mayor a 65535')
    .required('El puerto es obligatorio'),
  serial: Yup.string()
    .max(50, 'El serial no puede exceder los 50 caracteres')
    .required('El número de serie es obligatorio'),
  ubicacion: Yup.string()
    .max(1000, 'La ubicación no puede exceder los 1000 caracteres')
    .nullable(),
  ubicacion_descripcion: Yup.string()
    .max(100, 'La descripción de ubicación no puede exceder los 100 caracteres')
    .nullable(),
  modelo: Yup.string()
    .max(100, 'El modelo no puede exceder los 100 caracteres')
    .nullable(),
  firmware: Yup.string()
    .max(100, 'El firmware no puede exceder los 100 caracteres')
    .nullable(),
  platform: Yup.string()
    .max(50, 'La plataforma no puede exceder los 50 caracteres')
    .nullable(),
})

type Props = {
  isLoading: boolean
  dispositivoBiometrico: DispositivoBiometrico
  onClose: () => void
}

const EditModalForm: FC<Props> = ({dispositivoBiometrico, isLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {apiErrors, setApiErrors, getFieldError, clearFieldError} = useApiFieldErrors()
  
  const [dispositivoBiometricoForEdit] = useState<DispositivoBiometrico>({
    ...dispositivoBiometrico,
    nombre_dispositivo: dispositivoBiometrico.nombre_dispositivo || initialDispositivoBiometrico.nombre_dispositivo,
    direccion_ip: dispositivoBiometrico.direccion_ip || initialDispositivoBiometrico.direccion_ip,
    puerto: dispositivoBiometrico.puerto || initialDispositivoBiometrico.puerto,
    serial: dispositivoBiometrico.serial || initialDispositivoBiometrico.serial,
    ubicacion: dispositivoBiometrico.ubicacion || initialDispositivoBiometrico.ubicacion,
    ubicacion_descripcion: dispositivoBiometrico.ubicacion_descripcion || initialDispositivoBiometrico.ubicacion_descripcion,
    modelo: dispositivoBiometrico.modelo || initialDispositivoBiometrico.modelo,
    firmware: dispositivoBiometrico.firmware || initialDispositivoBiometrico.firmware,
    platform: dispositivoBiometrico.platform || initialDispositivoBiometrico.platform,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: dispositivoBiometricoForEdit,
    validationSchema: dispositivoBiometricoSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})
      try {
        if (isNotEmpty(values.id_biometrico)) {
          await updateDispositivoBiometrico(values)
          toast.success('Dispositivo biométrico actualizado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createDispositivoBiometrico(values)
          toast.success('Dispositivo biométrico creado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        }
        cancel(true)
        onClose()
      } catch (error: any) {
        console.error(error)
        if (error.response?.status === 422 && error.response.data?.validation_errors) {
          setApiErrors(error.response.data.validation_errors)
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

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(formik.errors, fieldName))
  }

  return (
    <>
      <form id='kt_modal_add_dispositivo_biometrico_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column me-n7 pe-7 pt-5'>
          
          {/* Nombre del Dispositivo */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Nombre del Dispositivo</label>
            <input
              {...formik.getFieldProps('nombre_dispositivo')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('nombre_dispositivo'),
                'is-valid': formik.touched.nombre_dispositivo && isFieldValid('nombre_dispositivo'),
              })}
              disabled={formik.isSubmitting}
              placeholder='Ingrese el nombre del dispositivo'
            />
            {!isFieldValid('nombre_dispositivo') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'nombre_dispositivo')}</span>
              </div>
            )}
          </div>

          {/* Dirección IP y Puerto */}
          <div className='row mb-7 px-1'>
            <div className='col-md-8 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Dirección IP</label>
              <input
                {...formik.getFieldProps('direccion_ip')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('direccion_ip'),
                  'is-valid': formik.touched.direccion_ip && isFieldValid('direccion_ip'),
                })}
                disabled={formik.isSubmitting}
                placeholder='192.168.1.100'
              />
              {!isFieldValid('direccion_ip') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'direccion_ip')}</span>
                </div>
              )}
            </div>
            <div className='col-md-4 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Puerto</label>
              <input
                type='number'
                {...formik.getFieldProps('puerto')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('puerto'),
                  'is-valid': formik.touched.puerto && isFieldValid('puerto'),
                })}
                disabled={formik.isSubmitting}
                placeholder='4370'
              />
              {!isFieldValid('puerto') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'puerto')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Serial */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Número de Serie</label>
            <input
              {...formik.getFieldProps('serial')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('serial'),
                'is-valid': formik.touched.serial && isFieldValid('serial'),
              })}
              disabled={formik.isSubmitting}
              placeholder='Ingrese el número de serie del dispositivo'
            />
            {!isFieldValid('serial') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'serial')}</span>
              </div>
            )}
          </div>

          {/* Ubicación y Descripción */}
          <div className='row mb-7 px-1'>
            <div className='col-md-6 fv-row'>
              <label className='fw-bold fs-6 mb-2'>Ubicación</label>
              <input
                {...formik.getFieldProps('ubicacion')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('ubicacion'),
                  'is-valid': formik.touched.ubicacion && isFieldValid('ubicacion'),
                })}
                disabled={formik.isSubmitting}
                placeholder='Ubicación del dispositivo'
              />
              {!isFieldValid('ubicacion') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'ubicacion')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='fw-bold fs-6 mb-2'>Descripción de Ubicación</label>
              <input
                {...formik.getFieldProps('ubicacion_descripcion')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('ubicacion_descripcion'),
                  'is-valid': formik.touched.ubicacion_descripcion && isFieldValid('ubicacion_descripcion'),
                })}
                disabled={formik.isSubmitting}
                placeholder='Descripción de la ubicación'
              />
              {!isFieldValid('ubicacion_descripcion') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'ubicacion_descripcion')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modelo, Firmware y Plataforma */}
          <div className='row mb-7 px-1'>
            <div className='col-md-4 fv-row'>
              <label className='fw-bold fs-6 mb-2'>Modelo</label>
              <input
                {...formik.getFieldProps('modelo')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('modelo'),
                  'is-valid': formik.touched.modelo && isFieldValid('modelo'),
                })}
                disabled={formik.isSubmitting}
                placeholder='Modelo del dispositivo'
              />
              {!isFieldValid('modelo') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'modelo')}</span>
                </div>
              )}
            </div>
            <div className='col-md-4 fv-row'>
              <label className='fw-bold fs-6 mb-2'>Firmware</label>
              <input
                {...formik.getFieldProps('firmware')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('firmware'),
                  'is-valid': formik.touched.firmware && isFieldValid('firmware'),
                })}
                disabled={formik.isSubmitting}
                placeholder='Versión del firmware'
              />
              {!isFieldValid('firmware') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'firmware')}</span>
                </div>
              )}
            </div>
            <div className='col-md-4 fv-row'>
              <label className='fw-bold fs-6 mb-2'>Plataforma</label>
              <input
                {...formik.getFieldProps('platform')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('platform'),
                  'is-valid': formik.touched.platform && isFieldValid('platform'),
                })}
                disabled={formik.isSubmitting}
                placeholder='Plataforma del dispositivo'
              />
              {!isFieldValid('platform') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'platform')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          isValid={formik.isValid}
          isEdit={!!dispositivoBiometrico.id_biometrico}
        />
      </form>
      {(formik.isSubmitting || isLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}