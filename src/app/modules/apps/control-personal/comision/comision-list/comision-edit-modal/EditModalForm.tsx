import {FC, useState, useCallback, useEffect, useMemo} from 'react'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {ID, isNotEmpty, KTIcon} from 'src/_metronic/helpers'
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
  tipoPermiso?: any // El objeto completo del tipo de permiso
}

const EditModalForm: FC<Props> = ({comision, isLoading, onClose, tipoPermiso}) => {
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
    fecha_comision_fin: comision.fecha_comision_fin || initialComision.fecha_comision_fin,
    hora_salida: comision.hora_salida || initialComision.hora_salida,
    hora_retorno: comision.hora_retorno || initialComision.hora_retorno,
    id_tipo_permiso: comision.id_tipo_permiso || initialComision.id_tipo_permiso,
    estado_boleta_comision: comision.estado_boleta_comision || initialComision.estado_boleta_comision,
  })

  // Determinar el tipo actual basado en tipoPermiso
  const tipoActual = useMemo(() => {
    if (tipoPermiso?.nombre) {
      return tipoPermiso.nombre
    }
    if (comision.tipo_comision) {
      return comision.tipo_comision
    }
    return 'PERSONAL' // Valor por defecto
  }, [tipoPermiso, comision.tipo_comision])


  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: {
      ...comisionForEdit,
      tipo_comision: tipoActual,
      id_tipo_permiso: tipoPermiso?.id_tipo_permiso || comisionForEdit.id_tipo_permiso
    },
    validationSchema: () => editComisionSchema({isAdmin: isAdminComision, tipoPermiso: tipoActual}),
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})

      try {
        // Asegurar que se envíen los valores correctos del tipo
        const dataToSend = {
          ...values,
          tipo_comision: tipoActual,
          id_tipo_permiso: tipoPermiso?.id_tipo_permiso || values.id_tipo_permiso
        }

        if (isNotEmpty(values.id_comision)) {
          const res = await updateComision(dataToSend)
          toast.success('Registro actualizado correctamente')
        } else {
          await createComision(dataToSend)
          toast.success('Registro creado correctamente')
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

  const getFieldError = (fieldName: string) => {
    return formik.errors[fieldName] || apiErrors[fieldName]
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(fieldName))
  }

  interface OptionType {
    value: number
    label: string
    id_asignacion_administrativo?: ID
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

  // Funciones para determinar qué campos mostrar según el tipo
  const esTipoPersonalOTransporte = () => {
    return tipoActual === 'PERSONAL' || tipoActual === 'TRANSPORTE'
  }

  const esTipoCajaSalud = () => {
    return tipoActual === 'CAJA SALUD'
  }

  const esTipoFisioterapia = () => {
    return tipoActual === 'FISIOTERAPIA'
  }

  const mostrarRecorrido = () => {
    return esTipoPersonalOTransporte()
  }

  const mostrarFechaFin = () => {
    return esTipoFisioterapia()
  }

  // Funciones para obtener labels dinámicos
  const getLabelFecha = () => {
    if (esTipoCajaSalud()) return 'Fecha de atención'
    if (esTipoFisioterapia()) return 'Fecha inicio'
    return 'Fecha comisión'
  }

  const getLabelHoraSalida = () => {
    if (esTipoFisioterapia()) return 'Hora llegada'
    return 'Hora salida'
  }

  const getLabelHoraRetorno = () => {
    if (esTipoFisioterapia()) return 'Hora salida'
    return 'Hora retorno'
  }

  const getLabelDescripcion = () => {
    if (esTipoCajaSalud()) return 'Razón de atención'
    if (esTipoFisioterapia()) return 'Motivo de fisioterapia'
    return 'Motivo de la comisión'
  }

  // Establecer opción seleccionada en modo edición
  useEffect(() => {
    if (comision.id_comision && comision.id_usuario_generador && comision.nombre_generador) {
      setSelectedOption({
        value: comision.id_usuario_generador,
        label: `${comision.ci || ''} - ${comision.nombre_generador}`,
        id_asignacion_administrativo: comision.id_asignacion_administrativo
      })
    }
  }, [comision])

  return (
    <>
      <form id='kt_modal_add_comision_form' className='form' onSubmit={formik.handleSubmit}>
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
          
          {/* Mostrar información del tipo seleccionado */}
          {/* {tipoPermiso && (
            <div className='alert alert-light-primary d-flex align-items-center p-5 mb-7'>
              <KTIcon iconName='information-5' className='fs-2hx text-primary me-4' />
              <div className='d-flex flex-column'>
                <h5 className='fw-bold mb-1'>Tipo seleccionado: {tipoPermiso.nombre}</h5>
                <span className='text-muted fs-7'>
                  {tipoPermiso.tipo_permiso} 
                  {tipoPermiso.requiere_hoja_ruta === '1' && ' • Requiere hoja de ruta'}
                </span>
              </div>
            </div>
          )} */}

          {isAdminComision && (
            <div className='fv-row mb-7 px-1'>
              <label className='required fw-bold fs-6 mb-2'>Solicitante:</label>
              {comision.id_comision ? (
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
                    formik.setFieldValue('id_usuario_generador', selected?.value ?? '')
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

          {/* Campos ocultos para el tipo */}
          <input
            type='hidden'
            name='tipo_comision'
            value={tipoActual}
          />
          <input
            type='hidden'
            name='id_tipo_permiso'
            value={tipoPermiso?.id_tipo_permiso || ''}
          />

          {/* Fecha de inicio */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>{getLabelFecha()}</label>
            {isAdminComision || mostrarFechaFin()? (
              <DatePickerField
                field={formik.getFieldProps('fecha_comision')}
                form={formik}
                isFieldValid={isFieldValid('fecha_comision')}
                isSubmitting={formik.isSubmitting}
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

          {/* Fecha fin - Solo para fisioterapia */}
          {mostrarFechaFin() && (
            <div className='fv-row mb-7 px-1'>
              <label className='required fw-bold fs-6 mb-2'>Fecha fin</label>
              {isAdminComision || mostrarFechaFin()? (
                <DatePickerField
                  field={formik.getFieldProps('fecha_comision_fin')}
                  form={formik}
                  isFieldValid={isFieldValid('fecha_comision_fin')}
                  isSubmitting={formik.isSubmitting}
                  onChange={handleChange('fecha_comision_fin')}
                  onBlur={() => formik.setFieldTouched('fecha_comision_fin', true)}
                />
              ) : (
                <SelectPickerField
                  field={formik.getFieldProps('fecha_comision_fin')}
                  form={formik}
                  isFieldValid={isFieldValid('fecha_comision_fin')}
                  isSubmitting={formik.isSubmitting}
                />
              )}
              {!isFieldValid('fecha_comision_fin') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError('fecha_comision_fin')}</span>
                </div>
              )}
            </div>
          )}

          {/* Horarios */}
          <div className='row mb-7 px-1'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>{getLabelHoraSalida()}</label>
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
              <label className='required fw-bold fs-6 mb-2'>{getLabelHoraRetorno()}</label>
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

          {/* Recorrido - Solo para PERSONAL y TRANSPORTE */}
          {mostrarRecorrido() && (
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
                  placeholder='Ej: Oficina central, Hospital, etc.'
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
                  placeholder='Ej: Banco, Municipio, Cliente, etc.'
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
            <label className='required fw-bold fs-6 mb-2'>{getLabelDescripcion()}</label>
            <textarea
              {...formik.getFieldProps('descripcion_comision')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('descripcion_comision'),
                'is-valid':
                  formik.touched.descripcion_comision && isFieldValid('descripcion_comision'),
              })}
              rows={3}
              disabled={formik.isSubmitting}
              placeholder={
                esTipoCajaSalud() 
                  ? 'Describa la razón de la atención médica...'
                  : esTipoFisioterapia()
                  ? 'Describa el motivo de la fisioterapia...'
                  : 'Describa el motivo de la comisión...'
              }
            />
            {!isFieldValid('descripcion_comision') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError('descripcion_comision')}</span>
              </div>
            )}
          </div>

          {/* Mostrar instrucciones según el tipo */}
          {/* {tipoPermiso?.instruccion && (
            <div className='fv-row mb-7 px-1'>
              <div className='alert alert-warning'>
                <h6 className='fw-bold mb-2'>
                  <KTIcon iconName='information-5' className='fs-6 me-2' />
                  Instrucciones importantes:
                </h6>
                <div dangerouslySetInnerHTML={{ __html: tipoPermiso.instruccion }} />
              </div>
            </div>
          )} */}
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          // isValid={formik.isValid}
          isValid={true}
          isEdit={!!comision.id_comision}
        />
      </form>
      {(formik.isSubmitting || isLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}