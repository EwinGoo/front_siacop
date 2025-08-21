import {FC, useState, useRef} from 'react'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {toast} from 'react-toastify'

import {isNotEmpty, KTIcon} from '../../../../../../../../_metronic/helpers'
import {useAuth} from '../../../../../../auth'

import {useListView} from '../core/ListViewProvider'
import {useQueryResponse} from '../core/QueryResponseProvider'

import {initialAsistenciaPermiso, AsistenciaPermiso} from '../core/_models'
import {TipoPermiso} from '../../../tipos-permisos/list/core/_models'

import {
  createAsistenciaPermiso,
  updateAsistenciaPermiso,
  uploadFile,
} from '../core/_requests'

import {asistenciaPermisoSchema} from '../../schemas/asistenciaPermisoSchema'

import {SelectField} from 'src/app/modules/components/SelectField'
import {ValidationError} from 'src/app/utils/httpErrors'
import {useApiFieldErrors} from 'src/app/hooks/useApiFieldErrors'
import {FormActions} from 'src/app/modules/components/FormActions'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'
import AsyncSelectField from '../../../../comision/comision-list/comision-edit-modal/components/AsyncSelectField'
import {usePermissions} from 'src/app/modules/auth/core/usePermissions'
import {getPersonaAutocomplete} from '../../../../comision/comision-list/core/_requests'
import { ListLoading } from 'src/app/modules/components/loading/ListLoading'

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
  const {apiErrors, setApiErrors, getFieldError, clearFieldError} = useApiFieldErrors()

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

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no puede ser mayor a 10MB')
        return
      }

      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]

      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de archivo no permitido. Solo se permiten: PDF, DOC, DOCX, JPG, PNG')
        return
      }

      setSelectedFile(file)
    }
  }

  const uploadFileToServer = async (file: File): Promise<number | null> => {
    const formData = new FormData()
    formData.append('file', file)
    // formData.append('id_usuario', currentUser!.id.toString())

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const response = await uploadFile(formData, (progressEvent) => {
        // Manejo seguro de progressEvent.total
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        )
        setUploadProgress(percentCompleted)
      })

      // Verificación en cascada para response.data.data
      if (!response?.data?.data?.id_multimedia) {
        throw new Error('No se recibió un ID multimedia válido del servidor')
      }

      return response.data.data.id_multimedia
    } catch (error) {
      console.error('Error al subir archivo:', error)
      toast.error('Error al subir el archivo')
      return null
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formik = useFormik({
    initialValues: asistenciaPermisoForEdit,
    validationSchema: asistenciaPermisoSchema({isAdmin: isAdminComision}),
    // validationSchema: null,
    // validateOnBlur: false,
    // validateOnChange: false,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({})

      try {
        let multimediaId = values.id_multimedia

        // Si hay un archivo seleccionado, subirlo primero
        if (selectedFile) {
          multimediaId = await uploadFileToServer(selectedFile)
          if (!multimediaId) {
            throw new Error('Error al subir el archivo')
          }
        }

        const finalValues = {
          ...values,
          id_multimedia: multimediaId,
        }

        if (isNotEmpty(values.id_asistencia_permiso)) {
          await updateAsistenciaPermiso(finalValues)
          toast.success('Permiso actualizado correctamente', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          await createAsistenciaPermiso(finalValues)
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

  // const getFieldError = (fieldName: string) => {
  //   return formik.errors[fieldName] || apiErrors[fieldName]
  // }

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)

  const fetchPersonaOptions = async (input: string): Promise<OptionType[]> => {
    const response = await getPersonaAutocomplete(input)

    return response.sugerencias.map((item) => ({
      value: item.id,
      label: item.texto,
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
        <div className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'>
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
                    formik.setFieldValue('id_usuario_generador', selected?.value ?? '')
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
              {/* <DatePickerField
                field={formik.getFieldProps('fecha_inicio_permiso')}
                form={formik}
                isFieldValid={isFieldValid('fecha_inicio_permiso')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_inicio_permiso')}
              /> */}
              {!isFieldValid('fecha_inicio_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_inicio_permiso')}</span>
                </div>
              )}
            </div>
            <div className='col-md-6 fv-row'>
              <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
              {/* <DatePickerField
                field={formik.getFieldProps('fecha_fin_permiso')}
                form={formik}
                isFieldValid={isFieldValid('fecha_fin_permiso')}
                isSubmitting={formik.isSubmitting}
                onChange={handleChange('fecha_fin_permiso')}
              /> */}
              {!isFieldValid('fecha_fin_permiso') && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{getFieldError(formik.errors, 'fecha_fin_permiso')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalle del Permiso */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Motivo</label>
            <textarea
              {...formik.getFieldProps('detalle_permiso')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('detalle_permiso'),
                'is-valid': formik.touched.detalle_permiso && isFieldValid('detalle_permiso'),
              })}
              rows={3}
              // onChange={() => handleChange('detalle_permiso')}
              onChange={(e) => {
                formik.setFieldValue('detalle_permiso', e.target.value)
                clearFieldError('detalle_permiso') // limpia error backend cuando el usuario edita
              }}
              disabled={formik.isSubmitting}
              placeholder='Describa los detalles del permiso'
            />
            {!isFieldValid('detalle_permiso') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{getFieldError(formik.errors, 'detalle_permiso')}</span>
              </div>
            )}
          </div>

          {/* Hoja de Ruta */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Hoja de Ruta (Opcional)</label>
            <input
              {...formik.getFieldProps('hoja_ruta')}
              className='form-control form-control-solid'
              disabled={formik.isSubmitting}
              placeholder='Número de hoja de ruta'
            />
          </div>

          {/* Upload de Archivo */}
          <div className='fv-row mb-7 px-1'>
            <label className='fw-bold fs-6 mb-2'>Documento de Respaldo (Opcional)</label>
            <div className='d-flex align-items-center gap-3'>
              <input
                ref={fileInputRef}
                type='file'
                onChange={handleFileSelect}
                className='form-control form-control-solid'
                accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                disabled={formik.isSubmitting || isUploading}
              />
              {selectedFile && (
                <div className='d-flex align-items-center gap-2'>
                  <KTIcon iconName='document' className='fs-3 text-success' />
                  <span className='text-muted fs-7'>{selectedFile.name}</span>
                  <button
                    type='button'
                    className='btn btn-sm btn-icon btn-light-danger'
                    onClick={() => {
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    disabled={formik.isSubmitting || isUploading}
                  >
                    <KTIcon iconName='cross' className='fs-4' />
                  </button>
                </div>
              )}
            </div>
            {isUploading && (
              <div className='mt-3'>
                <div className='progress mb-2' style={{height: '6px'}}>
                  <div
                    className='progress-bar bg-primary'
                    role='progressbar'
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
                <small className='text-muted'>Subiendo archivo... {uploadProgress}%</small>
              </div>
            )}
            <div className='form-text'>
              Formatos permitidos: PDF, DOC, DOCX, JPG, PNG. Tamaño máximo: 10MB
            </div>
          </div>
        </div>

        {/* Actions */}
        <FormActions
          onClose={onClose}
          isSubmitting={formik.isSubmitting}
          isUploading={isUploading}
          isValid={formik.isValid}
          isEdit={!!asistenciaPermiso.id_asistencia_permiso}
        />
      </form>
      {(formik.isSubmitting || isAsistenciaPermisoLoading || isUploading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
