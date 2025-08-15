import {FC, useState, useRef, useEffect} from 'react'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'

import {isNotEmpty} from '../../../../../../../../_metronic/helpers'

import {useListView} from '../core/ListViewProvider'
import {useQueryResponse} from '../core/QueryResponseProvider'

import {initialAsistenciaPermiso, AsistenciaPermiso} from '../core/_models'
import {TipoPermiso} from '../../../tipos-permisos/list/core/_models'

import {createAsistenciaPermiso, updateAsistenciaPermiso} from '../core/_requests'

import {asistenciaPermisoSchema} from '../../schemas/asistenciaPermisoSchema'

import {ListLoading} from '../components/loading/ListLoading'
import {SelectField} from 'src/app/modules/components/SelectField'
import {ValidationError} from 'src/app/utils/httpErrors'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'
import {FormActions} from 'src/app/modules/components/FormActions'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'
import AsyncSelectField from '../../../../comision/comision-list/comision-edit-modal/components/AsyncSelectField'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import {getPersonaAutocomplete} from '../../../../comision/comision-list/core/_requests'

type Props = {
  isAsistenciaPermisoLoading: boolean
  asistenciaPermiso: AsistenciaPermiso
  tiposPermisos: TipoPermiso[]
  onClose: () => void
}

interface OptionType {
  value: number
  label: string
}

const EditModalForm: FC<Props> = ({
  asistenciaPermiso,
  isAsistenciaPermisoLoading,
  tiposPermisos,
  onClose,
}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {isAdminComision} = usePermissions()
  const {setApiErrors, getFieldError, clearFieldError} = useApiFieldErrors()
  const [limiteDias, setLimiteDias] = useState<number | null>(null)

  const [asistenciaPermisoForEdit] = useState<AsistenciaPermiso>({
    ...asistenciaPermiso,
    // id_persona_administrativo:
    //   asistenciaPermiso.id_persona_administrativo ||
    //   initialAsistenciaPermiso.id_persona_administrativo,
    id_tipo_permiso: asistenciaPermiso.id_tipo_permiso || initialAsistenciaPermiso.id_tipo_permiso,
    fecha_inicio_permiso:
      asistenciaPermiso.fecha_inicio_permiso || initialAsistenciaPermiso.fecha_inicio_permiso,
    fecha_fin_permiso:
      asistenciaPermiso.fecha_fin_permiso || initialAsistenciaPermiso.fecha_fin_permiso,
    detalle_permiso: asistenciaPermiso.detalle_permiso || initialAsistenciaPermiso.detalle_permiso,
    estado_permiso: asistenciaPermiso.estado_permiso || initialAsistenciaPermiso.estado_permiso,
    // hoja_ruta: asistenciaPermiso.hoja_ruta || initialAsistenciaPermiso.hoja_ruta,
    // id_usuario_generador: currentUser?.id || null,
  })

  // const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [uploadProgress, setUploadProgress] = useState<number>(0)
  // const [isUploading, setIsUploading] = useState<boolean>(false)

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: asistenciaPermisoForEdit,
    validationSchema: asistenciaPermisoSchema({
      isAdmin: isAdminComision,
      limiteDias,
    }),
    // validationSchema: null,
    // validateOnBlur: false,
    // validateOnChange: false,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setApiErrors({})
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

  useEffect(() => {
    const permiso = tiposPermisos.find(
      (tipo) => tipo.id_tipo_permiso?.toString() === formik.values.id_tipo_permiso?.toString()
    )
    if (permiso) {
      setLimiteDias(permiso.limite_dias ?? null)
    } else {
      setLimiteDias(null)
    }
  }, [formik.values.id_tipo_permiso, tiposPermisos])

  // useEffect(() => {
  //   console.log('Formik errors:', formik.errors)
  // }, [formik.errors])

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)

  const fetchPersonaOptions = async (input: string): Promise<OptionType[]> => {
    const response = await getPersonaAutocomplete(input)

    return response.sugerencias.map((item) => ({
      value: item.id,
      label: item.texto,
      id_asignacion_administrativo: item.id_asignacion_administrativo,
    }))
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(formik.errors, fieldName))
  }

  const handleChange = (fieldName: keyof AsistenciaPermiso) => (value: any) => {
    formik.setFieldValue(fieldName, value)
    clearFieldError(fieldName)
  }

  return (
    <>
      <form
        id='kt_modal_add_asistencia_permiso_form'
        className='form'
        onSubmit={formik.handleSubmit}
      >
        <div className='me-n7 pe-7 pt-5'>
          {isAdminComision && (
            <div className='fv-row mb-7 px-1'>
              <label className='required fw-bold fs-6 mb-2'>Solicitante:</label>
              {asistenciaPermiso.id_asistencia_permiso ? (
                // Modo edición - mostrar campo readonly
                <input
                  type='text'
                  className='form-control form-control-solid'
                  readOnly
                  value={`${asistenciaPermiso.ci || ''} - ${
                    asistenciaPermiso.nombre_generador || ''
                  }`}
                />
              ) : (
                <AsyncSelectField
                  value={selectedOption}
                  onChange={(selected) => {
                    setSelectedOption(selected)
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
                  <span role='alert'>
                    {getFieldError(formik.errors, 'id_asignacion_administrativo')}
                  </span>
                </div>
              )}
            </div>
          )}
          {/* Tipo de Permiso */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Tipo de Permiso</label>
            <SelectField
              field={formik.getFieldProps('id_tipo_permiso')}
              form={formik}
              isFieldValid={isFieldValid('id_tipo_permiso')}
              clearFieldError={clearFieldError}
              isSubmitting={formik.isSubmitting}
              placeholder='Seleccione un tipo de permiso'
              options={tiposPermisos.map((tipo) => ({
                label: tipo.nombre,
                value: tipo.id_tipo_permiso!.toString(),
              }))}
            />
            {!isFieldValid('id_tipo_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'id_tipo_permiso')}</span>
              </div>
            )}
          </div>

          {/* Fechas con Flatpickr */}
          <div className='row mb-7'>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Inicio</label>
              <DatePickerField
                field={formik.getFieldProps('fecha_inicio_permiso')}
                form={formik}
                isFieldValid={isFieldValid('fecha_inicio_permiso')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_inicio_permiso')}
                onBlur={() => formik.setFieldTouched('fecha_inicio_permiso', true)}
              />
              {!isFieldValid('fecha_inicio_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_inicio_permiso')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
              <DatePickerField
                field={formik.getFieldProps('fecha_fin_permiso')}
                form={formik}
                isFieldValid={isFieldValid('fecha_fin_permiso')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_fin_permiso')}
                onBlur={() => formik.setFieldTouched('fecha_fin_permiso', true)}
              />
              {!isFieldValid('fecha_fin_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_fin_permiso')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          // isUploading={isUploading}
          isValid={formik.isValid}
          isEdit={!!asistenciaPermiso.id_asistencia_permiso}
        />
      </form>
      {/* {(formik.isSubmitting || isAsistenciaPermisoLoading || isUploading) && <ListLoading />} */}
      {(formik.isSubmitting || isAsistenciaPermisoLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
