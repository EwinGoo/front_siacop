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
import {ValidationError} from 'src/app/utils/httpErrors'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'
import {SelectField} from 'src/app/modules/components/SelectField'

type Props = {
  isLoading: boolean
  tipoPermiso: TipoPermiso
  onClose: () => void
}

const permisoOptions = [
  {label: 'PERMISO', value: 'PERMISO'},
  {label: 'COMISIÓN', value: 'COMISION'},
]

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
  const {apiErrors, setApiErrors, getFieldError, clearFieldError} = useApiFieldErrors()

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

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: tipoPermisoForEdit,
    validationSchema: editTipoPermisoSchema,
    // validationSchema: null,
    // validateOnBlur: false,
    // validateOnChange: false,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})

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
        if (error instanceof ValidationError) {
          setApiErrors(error.validationErrors)
          toast.error(error.message)
        } else {
          console.log(error)
          toast.error('Error inesperado: ' + error.message)
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
      <form id='kt_modal_add_tipo_permiso_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {/* Nombre */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Nombre</label>
            <input
              {...formik.getFieldProps('nombre')}
              onChange={(value) => {
                clearFieldError('nombre')
                formik.handleChange(value)
              }}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('nombre'),
                'is-valid': formik.touched.nombre && isFieldValid('nombre'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('nombre') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'nombre')}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Descripción</label>
            <textarea
              {...formik.getFieldProps('descripcion')}
              onChange={(value) => {
                clearFieldError('descripcion')
                formik.handleChange(value)
              }}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('descripcion'),
                'is-valid': formik.touched.descripcion && isFieldValid('descripcion'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('descripcion') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'descripcion')}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-5'>Tipo de Permiso</label>
            <SelectField
              field={formik.getFieldProps('tipo_permiso')}
              form={formik}
              isFieldValid={isFieldValid('tipo_permiso')}
              clearFieldError={clearFieldError}
              isSubmitting={formik.isSubmitting}
              placeholder='Seleccione el tipo de permiso'
              options={permisoOptions}
            />
            {!isFieldValid('tipo_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'tipo_permiso')}</span>
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
                  clearFieldError('instruccion')
                }}
                onBlur={() => formik.setFieldTouched('instruccion', true)}
                config={{
                  placeholder: 'Escriba los requisitos aquí...',
                  toolbar: ['undo', 'redo', 'bold', 'numberedList', 'bulletedList'],
                }}
              />
            </div>
            {!isFieldValid('instruccion') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'instruccion')}</span>
              </div>
            )}
          </div>

          {/* Límite de días */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Límite de días (opcional)</label>
            <input
              type='number'
              {...formik.getFieldProps('limite_dias')}
              value={formik.values.limite_dias ?? ''}
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
                <span role='alert'>{getFieldError(formik.errors, 'limite_dias')}</span>
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
