import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from 'src/_metronic/helpers'
import {
  initialDeclaratoriaComision as initialData,
  DeclaratoriaComision,
  TipoViatico,
} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {useAuth} from 'src/app/modules/auth'
import {ListLoading} from '../components/loading/ListLoading'
import {createDeclaratoriaComision, updateDeclaratoriaComision} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {toast} from 'react-toastify'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'
import {FormActions} from 'src/app/modules/components/FormActions'
import {ValidationError} from 'src/app/utils/httpErrors'
import {parseTipoViaticoFromApi, parseTipoViaticoToApi} from '../helpers/viatico'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import AsyncSelectField from '../../../comision/comision-list/comision-edit-modal/components/AsyncSelectField'
import {getPersonaAutocomplete} from '../../../comision/comision-list/core/_requests'

type Props = {
  isDeclaratoriaLoading: boolean
  declaratoria: DeclaratoriaComision
  onClose: () => void
}

interface OptionType {
  value: number
  label: string
  id_asignacion_administrativo?: number // Agregar este campo
}

const declaratoriaComisionSchema = Yup.object().shape({
  id_asignacion_administrativo: Yup.number().required('Asignación administrativa es requerida'),
  fecha_elaboracion: Yup.date().required('Fecha de elaboración es requerida'),
  rrhh_hoja_ruta_numero: Yup.string()
    .required('Número de hoja de ruta es requerido')
    .min(3, 'Mínimo 3 caracteres'),
  rrhh_hoja_ruta_fecha: Yup.date().required('Fecha de hoja de ruta es requerida'),
  // tipo_viatico: Yup.string()
  //   .oneOf(['con_viatico', 'sin_viatico'], 'Tipo de viático inválido')
  //   .required('Tipo de viático es requerido'),
  fecha_inicio: Yup.date()
    .required('Fecha de inicio es requerida')
    .min(Yup.ref('fecha_elaboracion')), // Fecha inicio no puede ser anterior a elaboración
  fecha_fin: Yup.date()
    .required('Fecha de fin es requerida')
    .min(Yup.ref('fecha_inicio'), 'Fecha fin no puede ser anterior a fecha inicio'),
  destino: Yup.string()
    .required('Destino es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  motivo: Yup.string()
    .required('Motivo es requerido')
    .min(10, 'Mínimo 10 caracteres')
    .max(555, 'Máximo 555 caracteres'),
})

const EditModalForm: FC<Props> = ({declaratoria, isDeclaratoriaLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser} = useAuth()
  const {apiErrors, setApiErrors, getFieldError, clearFieldError} = useApiFieldErrors()
  const {isAdminComision} = usePermissions()
  const [declaratoriaForEdit] = useState<DeclaratoriaComision>({
    ...declaratoria,
    id_asignacion_administrativo:
      declaratoria.id_asignacion_administrativo || initialData.id_asignacion_administrativo,
    id_usuario: currentUser?.id || initialData.id_usuario,
    fecha_elaboracion: declaratoria.fecha_elaboracion || initialData.fecha_elaboracion,
    rrhh_hoja_ruta_numero: declaratoria.rrhh_hoja_ruta_numero || initialData.rrhh_hoja_ruta_numero,
    rrhh_hoja_ruta_fecha: declaratoria.rrhh_hoja_ruta_fecha || initialData.rrhh_hoja_ruta_fecha,
    tipo_viatico: declaratoria.tipo_viatico || initialData.tipo_viatico,
    fecha_inicio: declaratoria.fecha_inicio || initialData.fecha_inicio,
    fecha_fin: declaratoria.fecha_fin || initialData.fecha_fin,
    destino: declaratoria.destino || initialData.destino,
    motivo: declaratoria.motivo || initialData.motivo,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: declaratoriaForEdit,
    validationSchema: declaratoriaComisionSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})

      try {
        const preparePayload = (values: DeclaratoriaComision) => {
          const tipoViaticoBool =
            typeof values.tipo_viatico === 'string'
              ? parseTipoViaticoFromApi(values.tipo_viatico)
              : values.tipo_viatico

          return {
            ...values,
            tipo_viatico: parseTipoViaticoToApi(tipoViaticoBool) as TipoViatico,
          }
        }

        if (isNotEmpty(values.id_declaratoria_comision)) {
          await updateDeclaratoriaComision(preparePayload(values))
          toast.success('Declaratoria actualizada correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createDeclaratoriaComision(preparePayload(values))
          toast.success('Declaratoria creada correctamente', {
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

  const handleChange = (fieldName: keyof DeclaratoriaComision) => (value: any) => {
    formik.setFieldValue(fieldName, value)
    clearFieldError(fieldName)
  }

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)

  const fetchPersonaOptions = async (input: string): Promise<OptionType[]> => {
    const response = await getPersonaAutocomplete(input)

    return response.sugerencias.map((item) => ({
      value: item.id,
      label: item.texto,
      id_asignacion_administrativo: item.id_asignacion_administrativo
    }))
  }

  return (
    <>
      <form id='kt_modal_add_declaratoria_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {isAdminComision && (
            <div className='fv-row mb-7 px-1'>
              <label className='required fw-bold fs-6 mb-2'>Solicitante:</label>
              {declaratoria.id_declaratoria_comision ? (
                // Modo edición - mostrar campo readonly
                <input
                  type='text'
                  className='form-control form-control-solid'
                  readOnly
                  value={`${declaratoria.ci || ''} - ${declaratoria.nombre_generador || ''}`}
                />
              ) : (
                <AsyncSelectField
                  value={selectedOption}
                  onChange={(selected) => {
                    setSelectedOption(selected)
                    formik.setFieldValue('id_usuario_generador', selected?.value ?? '')
                    formik.setFieldValue('id_asignacion_administrativo', selected?.id_asignacion_administrativo ?? '')
                  }}
                  onBlur={() => formik.setFieldTouched('id_usuario_generador', true)}
                  fetchOptions={fetchPersonaOptions}
                  isInvalid={!isFieldValid('id_usuario_generador')}
                />
              )}
              {!isFieldValid('id_usuario_generador') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'id_usuario_generador')}</span>
                </div>
              )}
            </div>
          )}
          {/* Fechas importantes */}
          <div className='row mb-7'>
            <div className='col-md-4 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Elaboración</label>
              <DatePickerField
                field={formik.getFieldProps('fecha_elaboracion')}
                form={formik}
                isFieldValid={isFieldValid('fecha_elaboracion')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_elaboracion')}
              />

              {!isFieldValid('fecha_elaboracion') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_elaboracion')}</span>
                </div>
              )}
            </div>

            <div className='col-md-4 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Inicio</label>
              <DatePickerField
                field={formik.getFieldProps('fecha_inicio')}
                form={formik}
                isFieldValid={isFieldValid('fecha_inicio')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_inicio')}
              />
              {!isFieldValid('fecha_inicio') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_inicio')}</span>
                </div>
              )}
            </div>

            <div className='col-md-4 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
              <DatePickerField
                field={formik.getFieldProps('fecha_fin')}
                form={formik}
                isFieldValid={isFieldValid('fecha_fin')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_fin')}
              />
              {!isFieldValid('fecha_fin') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_fin')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hoja de ruta */}
          <div className='row mb-7'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>N° Hoja de Ruta</label>
              <input
                type='text'
                {...formik.getFieldProps('rrhh_hoja_ruta_numero')}
                className={clsx('form-control form-control-solid', {
                  'is-invalid': !isFieldValid('rrhh_hoja_ruta_numero'),
                  'is-valid':
                    formik.touched.rrhh_hoja_ruta_numero && isFieldValid('rrhh_hoja_ruta_numero'),
                })}
                disabled={formik.isSubmitting}
              />
              {!isFieldValid('rrhh_hoja_ruta_numero') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'rrhh_hoja_ruta_numero')}</span>
                </div>
              )}
            </div>

            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Hoja de Ruta</label>
              <DatePickerField
                field={formik.getFieldProps('rrhh_hoja_ruta_fecha')}
                form={formik}
                isFieldValid={isFieldValid('rrhh_hoja_ruta_fecha')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('rrhh_hoja_ruta_fecha')}
              />
              {!isFieldValid('rrhh_hoja_ruta_fecha') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'rrhh_hoja_ruta_fecha')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Destino */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Destino</label>
            <input
              type='text'
              {...formik.getFieldProps('destino')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('destino'),
                'is-valid': formik.touched.destino && isFieldValid('destino'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('destino') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'destino')}</span>
              </div>
            )}
          </div>

          {/* Motivo */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Motivo</label>
            <textarea
              {...formik.getFieldProps('motivo')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('motivo'),
                'is-valid': formik.touched.motivo && isFieldValid('motivo'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('motivo') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'motivo')}</span>
              </div>
            )}
          </div>

          {/* Nota interna (opcional) */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Nota Interna (Opcional)</label>
            <input
              type='text'
              {...formik.getFieldProps('nota_interna')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('nota_interna'),
                'is-valid': formik.touched.nota_interna && isFieldValid('nota_interna'),
              })}
              disabled={formik.isSubmitting}
            />
            {!isFieldValid('nota_interna') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'nota_interna')}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-3'>¿La comisión incluye viático?</label>
            <div className='form-check form-switch form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                id='requiereHojaRutaSwitch'
                checked={!!formik.values.tipo_viatico} // si hay tipo_viatico => check activado
                onChange={() => {
                  formik.setFieldValue('tipo_viatico', !formik.values.tipo_viatico)
                }}
                disabled={formik.isSubmitting}
              />
              <label className='form-check-label' htmlFor='requiereHojaRutaSwitch'>
                {formik.values.tipo_viatico ? 'Con viatico' : 'Sin viatico'}
              </label>
            </div>
            <div className='text-muted fs-7 mt-1'>
              {formik.values.tipo_viatico
                ? 'Esta comisión será financiada con viático'
                : 'Esta comisión no incluye viático'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          isValid={formik.isValid}
          isEdit={!!declaratoria.id_declaratoria_comision}
        />
      </form>
      {(formik.isSubmitting || isDeclaratoriaLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
