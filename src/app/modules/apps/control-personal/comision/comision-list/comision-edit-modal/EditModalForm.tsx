import {FC, useState, useCallback, useEffect} from 'react'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {isNotEmpty, KTIcon} from 'src/_metronic/helpers'
import {initialComision, Comision} from '../core/_models'
import {useListView} from '../core/ListViewProvider'
import {createComision, getPersonaAutocomplete, updateComision} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {editComisionSchema} from './schemas/editComisionSchema'
import {SelectPickerField} from './components/SelectPickerField'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import {ValidationError} from 'src/app/utils/httpErrors'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'
import {FormActions} from 'src/app/modules/components/FormActions'
import AsyncSelectField from './components/AsyncSelectField'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'

type Props = {
  isLoading: boolean
  comision: Comision
  onClose: () => void
}

const EditModalForm: FC<Props> = ({comision, isLoading, onClose}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {isAdminComision} = usePermissions()
  const {apiErrors, setApiErrors, clearFieldError} = useApiFieldErrors()

  const [comisionForEdit] = useState<Comision>({
    ...comision,
    id_usuario_generador: comision.id_usuario_generador,
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

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: comisionForEdit,
    validationSchema: () => editComisionSchema({isAdmin: isAdminComision}),
    // validationSchema: null, // Elimina el schema de validación
    // validateOnBlur: false, // Desactiva validación al perder foco
    // validateOnChange: false,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})

      try {
        if (isNotEmpty(values.id_comision)) {
          const res = await updateComision(values)
          // console.log(res);
          
          toast.success('Registro actualizada correctamente')
          // toast.success('Comisión actualizada correctamente')
        } else {
          await createComision(values)
          // toast.success('Comisión creada correctamente')
          toast.success('Registro creada correctamente')
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

  // useEffect(() => {
  //   console.log('Formik values:', formik.values)
  // }, [formik.values])

  const getFieldError = (fieldName: string) => {
    return formik.errors[fieldName] || apiErrors[fieldName]
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(fieldName))
  }
  interface OptionType {
    value: number
    label: string
  }

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)
  const fetchPersonaOptions = async (input: string): Promise<OptionType[]> => {
    const response = await getPersonaAutocomplete(input)

    return response.sugerencias.map((item) => ({
      value: item.id,
      label: item.texto,
      id_asignacion_administrativo: item.id_asignacion_administrativo,
    }))
  }

  const handleChange = (fieldName: keyof Comision) => (value: any) => {
    formik.setFieldValue(fieldName, value)
    clearFieldError(fieldName)
  }

  return (
    <>
      <form id='kt_modal_add_comision_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          {isAdminComision && (
            <div className='fv-row mb-7 px-1'>
              <label className='required fw-bold fs-6 mb-2'>Solicitante:</label>
              {comision.id_comision ? (
                // Modo edición - mostrar campo readonly
                <input
                  type='text'
                  className='form-control form-control-solid'
                  readOnly
                  value={`${comision.ci || ''} - ${comision.nombre_generador || ''}`}
                />
              ) : (
                <AsyncSelectField
                  value={selectedOption}
                  onChange={(selected) => {
                    setSelectedOption(selected)
                    // formik.setFieldValue('id_usuario_generador', selected?.value ?? '')
                    formik.setFieldValue(
                      'id_asignacion_administrativo',
                      selected?.id_asignacion_administrativo ?? ''
                    )
                  }}
                  onBlur={() => formik.setFieldTouched('id_asignacion_administrativo', true)}
                  fetchOptions={fetchPersonaOptions}
                  isInvalid={!isFieldValid('id_asignacion_administrativo')}
                />
              )}
              {!isFieldValid('id_asignacion_administrativo') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('id_asignacion_administrativo')}</span>
                </div>
              )}
            </div>
          )}

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
              <option value='PERSONAL'>Comisión</option>
              <option value='TRANSPORTE'>Transporte</option>
              <option value='CAJA SALUD'>Caja de Salud</option>
            </select>
            {!isFieldValid('tipo_comision') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('tipo_comision')}</span>
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>
              Fecha {formik.values.tipo_comision === 'CAJA SALUD' ? '' : 'comisión'}
            </label>
            {isAdminComision ? (
              <DatePickerField
                field={formik.getFieldProps('fecha_comision')}
                form={formik}
                isFieldValid={isFieldValid('fecha_comision')}
                isSubmitting={formik.isSubmitting}
                // onChange={handleChange('fecha_fin_permiso')}
                // onChange={([date]) => handleChange('fecha_comision')(date)}
                onChange={handleChange('fecha_comision')}
                onBlur={() => formik.setFieldTouched('fecha_comision', true)}
              />
            ) : (
              <SelectPickerField
                field={formik.getFieldProps('fecha_comision')}
                form={formik}
                isFieldValid={isFieldValid('fecha_comision')}
                isSubmitting={formik.isSubmitting}
              />
            )}
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

          {formik.values.tipo_comision !== 'CAJA SALUD' && (
            <div className='row mb-7 px-1'>
              <div className='col-md-6 fv-row'>
                <label className='required fw-bold fs-6 mb-2'>Punto de partida (Desde)</label>
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
                <label className='required fw-bold fs-6 mb-2'>Destino final (Hacia)</label>
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
          )}

          {/* Descripción */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>
              {formik.values.tipo_comision === 'CAJA SALUD' ? 'Razón de atención' : 'Motivo de la comisión'}
            </label>
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
          {/* )} */}

          {/* Ruta */}
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          isValid={formik.isValid}
          isEdit={!!comision.id_comision}
        />
      </form>
      {(formik.isSubmitting || isLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
