import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, KTIcon} from '../../../../../../_metronic/helpers'
import {initialPersona, Persona} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ListLoading} from '../components/loading/ListLoading'
import {createPersona, updatePersona} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'

// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

type Props = {
  isPersonaLoading: boolean
  persona: Persona
  onClose: () => void
}

const editPersonaSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de email incorrecto')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .required('El email es requerido'),
  nombre: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .required('El nombre es requerido'),
  apellido: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .required('El apellido es requerido'),
  telefono: Yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(8, 'Máximo 8 caracteres')
    .required('El teléfono es requerido'),
  estado: Yup.string()
    .oneOf(['activo', 'inactivo'], 'El estado debe ser "activo" o "inactivo"')
    .required('El estado es requerido'),
})

const EditModalForm: FC<Props> = ({persona, isPersonaLoading, onClose}) => {
  const {setItemIdForUpdate, setIsShow} = useListView()
  const {refetch} = useQueryResponse()

  const [personaForEdit] = useState<Persona>({
    ...persona,
    nombre: persona.nombre || initialPersona.nombre,
    apellido: persona.apellido || initialPersona.apellido,
    email: persona.email || initialPersona.email,
    telefono: persona.telefono || initialPersona.telefono,
    estado: persona.estado || initialPersona.estado,
  })

  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: personaForEdit,
    validationSchema: editPersonaSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setBackendErrors({}) // Limpiar errores anteriores

      try {
        if (isNotEmpty(values.id)) {
          await updatePersona(values)
          toast.success('Persona actualizada correctamente', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        } else {
          await createPersona(values)
          toast.success('Persona creada correctamente', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        }
        // Mostrar mensaje de éxito
        cancel(true)
        onClose()
      } catch (error: any) {
        console.error(error)

        if (error.response?.status === 422 && error.response.data?.validation_errors) {
          // Manejar errores de validación del backend
          setBackendErrors(error.response.data.validation_errors)

          // Mostrar SweetAlert con los errores
          let errorMessage = 'Por favor corrige los siguientes errores:<ul>'
          Object.entries(error.response.data.validation_errors).forEach(([field, message]) => {
            errorMessage += `<li>${message}</li>`
          })
          errorMessage += '</ul>'

          await Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: errorMessage,
          })
        } else {
          // Error genérico
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Ocurrió un error al procesar la solicitud',
          })
        }
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Combina errores de formik y del backend
  const getFieldError = (fieldName: string) => {
    return formik.errors[fieldName] || backendErrors[fieldName]
  }

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && (formik.errors[fieldName] || backendErrors[fieldName]))
  }

  // if(isPersonaLoading){
  //   return (
  //     <>
  //         <Skeleton height={30} className="mb-3" /> {/* Nombre */}
  //         <Skeleton height={30} className="mb-3" /> {/* Apellido */}
  //         <Skeleton height={30} className="mb-3" /> {/* Email */}
  //         <Skeleton height={30} className="mb-3" /> {/* Teléfono */}
  //         <Skeleton height={30} width={100} />      {/* Estado */}
  //       </>
  //   )
  // }

  return (
    <>
      <form
        id='kt_modal_add_persona_form'
        className='form'
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* begin::Scroll */}

        <div
          className='d-flex flex-column scroll-y me-n7 pe-7 pt-5'
          id='kt_modal_add_persona_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_persona_header'
          data-kt-scroll-wrappers='#kt_modal_add_persona_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group - Nombre */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Nombre</label>
            <input
              placeholder='Nombre'
              {...formik.getFieldProps('nombre')}
              type='text'
              name='nombre'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.nombre && formik.errors.nombre},
                {'is-valid': formik.touched.nombre && !formik.errors.nombre}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isPersonaLoading}
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.nombre}</span>
              </div>
            )}
          </div>
          {/* end::Input group - Nombre */}

          {/* begin::Input group - Apellido */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Apellido</label>
            <input
              placeholder='Apellido'
              {...formik.getFieldProps('apellido')}
              type='text'
              name='apellido'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.apellido && formik.errors.apellido},
                {'is-valid': formik.touched.apellido && !formik.errors.apellido}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isPersonaLoading}
            />
            {formik.touched.apellido && formik.errors.apellido && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.apellido}</span>
              </div>
            )}
          </div>
          {/* end::Input group - Apellido */}

          {/* begin::Input group - Email */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              type='email'
              name='email'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': !isFieldValid('email')},
                {'is-valid': formik.touched.email && isFieldValid('email')}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isPersonaLoading}
            />
            {!isFieldValid('email') && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{getFieldError('email')}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Input group - Email */}

          {/* begin::Input group - Teléfono */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Teléfono</label>
            <input
              placeholder='Teléfono'
              {...formik.getFieldProps('telefono')}
              type='text'
              name='telefono'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.telefono && formik.errors.telefono},
                {'is-valid': formik.touched.telefono && !formik.errors.telefono}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isPersonaLoading}
            />
            {formik.touched.telefono && formik.errors.telefono && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.telefono}</span>
              </div>
            )}
          </div>
          {/* end::Input group - Teléfono */}

          {/* begin::Input group - Estado */}
          <div className='fv-row mb-7 px-1'>
            <label className='required fw-bold fs-6 mb-2'>Estado</label>
            <select
              {...formik.getFieldProps('estado')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.estado && formik.errors.estado},
                {'is-valid': formik.touched.estado && !formik.errors.estado}
              )}
              disabled={formik.isSubmitting || isPersonaLoading}
            >
              <option value='activo'>Activo</option>
              <option value='inactivo'>Inactivo</option>
            </select>
            {formik.touched.estado && formik.errors.estado && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.estado}</span>
              </div>
            )}
          </div>
          {/* end::Input group - Estado */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-5'>
          <Button
            variant='light'
            onClick={onClose}
            className='me-3'
            disabled={formik.isSubmitting || isPersonaLoading}
          >
            <KTIcon iconName='cross' className='fs-2' />
            Cancelar
          </Button>

          <Button
            variant='primary'
            type='submit'
            disabled={isPersonaLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            {formik.isSubmitting || isPersonaLoading ? (
              <>
                Por favor, espere... <span className='spinner-border spinner-border-sm ms-2' />
              </>
            ) : (
              <>
                <KTIcon iconName='check' className='fs-2 me-1' />
                Guardar
              </>
            )}
          </Button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isPersonaLoading) && <ListLoading />}
    </>
  )
}

export {EditModalForm}
