import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../../../_metronic/helpers'
import {initialTipoPermiso, TipoPermiso, TipoPermisoPayload} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {createTipoPermiso, updateTipoPermiso} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {FormActions} from 'src/app/modules/components/FormActions'

type Props = {
  isLoading: boolean
  tipoPermiso: TipoPermiso
  onClose: () => void
}

const editTipoPermisoSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .required('El nombre es requerido'),
  descripcion: Yup.string().max(255, 'Máximo 255 caracteres').nullable(),
  instruccion: Yup.string()
    .max(1000, 'Máximo 1000 caracteres')
    .required('Los requisitos son obligatorios'),
  limite_dias: Yup.number().min(0, 'El límite no puede ser negativo').nullable(),
})

const EditModalForm: FC<Props> = ({tipoPermiso, isLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [tipoPermisoForEdit] = useState<TipoPermiso>({
    ...tipoPermiso,
    nombre: tipoPermiso.nombre || initialTipoPermiso.nombre,
    descripcion: tipoPermiso.descripcion || initialTipoPermiso.descripcion,
    tipo_permiso: tipoPermiso.tipo_permiso || initialTipoPermiso.tipo_permiso,
    // requiere_hoja_ruta:
    //   tipoPermiso.requiere_hoja_ruta === '1' ||
    //   (tipoPermiso.requiere_hoja_ruta == null && initialTipoPermiso.requiere_hoja_ruta),
    instruccion: tipoPermiso.instruccion || initialTipoPermiso.instruccion,
    limite_dias: tipoPermiso.limite_dias || initialTipoPermiso.limite_dias,
  })

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: tipoPermisoForEdit,
    validationSchema: editTipoPermisoSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({})

      try {
        // const preparePayload = (values: TipoPermiso): TipoPermisoPayload => ({
        //   ...values,
        //   requiere_hoja_ruta: values.requiere_hoja_ruta ? '1' : '0',
        // })
        // const payload = preparePayload(values)

        if (isNotEmpty(values.id_tipo_permiso)) {
          await updateTipoPermiso(values)
          toast.success('Tipo de permiso actualizado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createTipoPermiso(values)
          toast.success('Tipo de permiso creado correctamente', {
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
    return formik.errors[fieldName as keyof typeof formik.errors] || backendErrors[fieldName]
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName as keyof typeof formik.touched] && getFieldError(fieldName))
  }

  // const toggleRequiereHojaRuta = () => {
  //   formik.setFieldValue('requiere_hoja_ruta', !formik.values.requiere_hoja_ruta)
  // }

  return (
    <>
      <form id='kt_modal_add_tipo_permiso_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {/* Nombre */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Nombre</label>
            <input
              {...formik.getFieldProps('nombre')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('nombre'),
                'is-valid': formik.touched.nombre && isFieldValid('nombre'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('nombre') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('nombre')}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Descripción</label>
            <textarea
              {...formik.getFieldProps('descripcion')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('descripcion'),
                'is-valid': formik.touched.descripcion && isFieldValid('descripcion'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('descripcion') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('descripcion')}</span>
              </div>
            )}
          </div>

          {/* Requisito (CKEditor) */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2 required'>Requisitos</label>
            <div
              className={clsx('form-control form-control-solid p-0', {
                'is-invalid': !isFieldValid('instruccion'),
                'is-valid': formik.touched.instruccion && isFieldValid('instruccion'),
              })}
            >
              <CKEditor
                editor={ClassicEditor as any}
                data={formik.values.instruccion || ''}
                onChange={(_, editor) => {
                  const data = editor.getData()
                  formik.setFieldValue('instruccion', data)
                }}
                onBlur={() => formik.setFieldTouched('instruccion', true)}
                config={{
                  placeholder: 'Escriba los requisitos aquí...',
                  toolbar: [
                    'undo',
                    'redo',
                    'bold',
                    'numberedList',
                    'bulletedList',
                  ],
                }}
              />
            </div>
            {!isFieldValid('instruccion') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('instruccion')}</span>
              </div>
            )}
          </div>

          {/* Límite de días */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Límite de días (opcional)</label>
            <input
              type='number'
              {...formik.getFieldProps('limite_dias')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('limite_dias'),
                'is-valid': formik.touched.limite_dias && isFieldValid('limite_dias'),
              })}
              min='0'
              placeholder='Ej: 5'
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('limite_dias') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('limite_dias')}</span>
              </div>
            )}
          </div>
        </div>
        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          isValid={formik.isValid}
          isEdit={!!tipoPermiso.id_tipo_permiso}
        />
      </form>
      {(formik.isSubmitting || isLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
