import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../../../_metronic/helpers'
import {initialAsistenciaPermiso, AsistenciaPermiso} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ListLoading} from '../components/loading/ListLoading'
import {createAsistenciaPermiso, updateAsistenciaPermiso} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useQuery} from 'react-query';
import {getTiposPermiso} from '../core/_requests';
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'

type Props = {
  isAsistenciaPermisoLoading: boolean
  asistenciaPermiso: AsistenciaPermiso
  onClose: () => void
}

const editAsistenciaPermisoSchema = Yup.object().shape({
  id_persona_administrativo: Yup.number().required('Persona administrativo es requerida'),
  id_tipo_permiso: Yup.number().required('Tipo de permiso es requerido'),
  fecha_inicio_permiso: Yup.date().required('Fecha de inicio es requerida'),
  fecha_fin_permiso: Yup.date()
    .required('Fecha de fin es requerida')
    .min(Yup.ref('fecha_inicio_permiso'), 'La fecha fin no puede ser anterior a la fecha inicio'),
  detalle_permiso: Yup.string()
    .max(555, 'Máximo 555 caracteres')
    .required('Detalle del permiso es requerido'),
  // estado_permiso: Yup.string()
  //   .oneOf(['GENERADO', 'APROBADO'], 'Estado inválido')
  //   .required('Estado es requerido'),
})

const EditModalForm: FC<Props> = ({asistenciaPermiso, isAsistenciaPermisoLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [asistenciaPermisoForEdit] = useState<AsistenciaPermiso>({
    ...asistenciaPermiso,
    id_persona_administrativo:
      asistenciaPermiso.id_persona_administrativo ||
      initialAsistenciaPermiso.id_persona_administrativo,
    id_tipo_permiso: asistenciaPermiso.id_tipo_permiso || initialAsistenciaPermiso.id_tipo_permiso,
    fecha_inicio_permiso:
      asistenciaPermiso.fecha_inicio_permiso || initialAsistenciaPermiso.fecha_inicio_permiso,
    fecha_fin_permiso:
      asistenciaPermiso.fecha_fin_permiso || initialAsistenciaPermiso.fecha_fin_permiso,
    detalle_permiso: asistenciaPermiso.detalle_permiso || initialAsistenciaPermiso.detalle_permiso,
    estado_permiso: asistenciaPermiso.estado_permiso || initialAsistenciaPermiso.estado_permiso,
    numero_documento:
      asistenciaPermiso.numero_documento || initialAsistenciaPermiso.numero_documento,
  })

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: asistenciaPermisoForEdit,
    validationSchema: editAsistenciaPermisoSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({})

      try {
        if (isNotEmpty(values.id_asistencia_permiso)) {
          await updateAsistenciaPermiso(values)
          toast.success('Permiso actualizado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createAsistenciaPermiso(values)
          toast.success('Permiso creado correctamente', {
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
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger',
            },
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

  const {data: tiposPermiso = [], isLoading: isLoadingTiposPermiso} = useQuery(
    'tipos-permiso',
    getTiposPermiso,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
    }
  );
  

  return (
    <>
      <form
        id='kt_modal_add_asistencia_permiso_form'
        className='form'
        onSubmit={formik.handleSubmit}
      >
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {/* Persona Administrativo */}
          {/* <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Persona Administrativo</label>
            <input
              type='number'
              {...formik.getFieldProps('id_persona_administrativo')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('id_persona_administrativo'),
                'is-valid':
                  formik.touched.id_persona_administrativo &&
                  isFieldValid('id_persona_administrativo'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('id_persona_administrativo') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('id_persona_administrativo')}</span>
              </div>
            )}
          </div> */}

          {/* Tipo de Permiso */}
          {/* <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Tipo de Permiso</label>
            <input
              type='number'
              {...formik.getFieldProps('id_tipo_permiso')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('id_tipo_permiso'),
                'is-valid': formik.touched.id_tipo_permiso && isFieldValid('id_tipo_permiso'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('id_tipo_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('id_tipo_permiso')}</span>
              </div>
            )}
          </div> */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Tipo de Permiso</label>
            <select
              {...formik.getFieldProps('id_tipo_permiso')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('id_tipo_permiso'),
                'is-valid': formik.touched.id_tipo_permiso && isFieldValid('id_tipo_permiso'),
              })}
              disabled={formik.isSubmitting || isLoadingTiposPermiso}
            >
              <option value=''>Seleccione un tipo de permiso</option>
              {tiposPermiso.map((tipo) => (
                <option key={tipo.id_tipo_permiso} value={tipo.id_tipo_permiso}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {!isFieldValid('id_tipo_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('id_tipo_permiso')}</span>
              </div>
            )}
          </div>

          {/* Fechas con Flatpickr */}
          <div className='row mb-7'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Inicio</label>
              <Flatpickr
                value={formik.values.fecha_inicio_permiso}
                onChange={([date]) => formik.setFieldValue('fecha_inicio_permiso', date)}
                options={{dateFormat: 'Y-m-d', locale: Spanish, static: true}}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('fecha_inicio_permiso'),
                  'is-valid':
                    formik.touched.fecha_inicio_permiso && isFieldValid('fecha_inicio_permiso'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('fecha_inicio_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('fecha_inicio_permiso')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
              <Flatpickr
                value={formik.values.fecha_fin_permiso}
                onChange={([date]) => formik.setFieldValue('fecha_fin_permiso', date)}
                options={{dateFormat: 'Y-m-d', locale: Spanish, static: true}}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('fecha_fin_permiso'),
                  'is-valid': formik.touched.fecha_fin_permiso && isFieldValid('fecha_fin_permiso'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('fecha_fin_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('fecha_fin_permiso')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Estado del Permiso */}
          {/* <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Estado</label>
            <select
              {...formik.getFieldProps('estado_permiso')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('estado_permiso'),
                'is-valid': formik.touched.estado_permiso && isFieldValid('estado_permiso'),
              })}
              disabled={formik.isSubmitting}
            >
              <option value='GENERADO'>Generado</option>
              <option value='APROBADO'>Aprobado</option>
            </select>
            {!isFieldValid('estado_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('estado_permiso')}</span>
              </div>
            )}
          </div> */}

          {/* Detalle del Permiso */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Detalle</label>
            <textarea
              {...formik.getFieldProps('detalle_permiso')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('detalle_permiso'),
                'is-valid': formik.touched.detalle_permiso && isFieldValid('detalle_permiso'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('detalle_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('detalle_permiso')}</span>
              </div>
            )}
          </div>

          {/* Número de Documento (Opcional) */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Número de Documento (Opcional)</label>
            <input
              {...formik.getFieldProps('numero_documento')}
              className='form-control form-control-solid'
              disabled={formik.isSubmitting}
            />
          </div>
        </div>

        {/* Actions */}
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
                {asistenciaPermiso.id_asistencia_permiso ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </div>
      </form>
      {(formik.isSubmitting || isAsistenciaPermisoLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
