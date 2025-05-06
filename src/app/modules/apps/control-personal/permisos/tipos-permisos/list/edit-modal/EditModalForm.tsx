import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../../../_metronic/helpers'
import {initialTipoPermiso, TipoPermiso} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ListLoading} from '../components/loading/ListLoading'
import {createTipoPermiso, updateTipoPermiso} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'

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
  descripcion: Yup.string()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),
})

const EditModalForm: FC<Props> = ({tipoPermiso, isLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [tipoPermisoForEdit] = useState<TipoPermiso>({
    ...tipoPermiso,
    nombre: tipoPermiso.nombre || initialTipoPermiso.nombre,
    descripcion: tipoPermiso.descripcion || initialTipoPermiso.descripcion,
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
        </div>

        {/* Actions */}
        <div className='text-center pt-5'>
          <Button
            variant='light'
            onClick={onClose}
            className='me-3'
            disabled={formik.isSubmitting}
          >
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
                {tipoPermiso.id_tipo_permiso ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </div>
      </form>
      {(formik.isSubmitting || isLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}