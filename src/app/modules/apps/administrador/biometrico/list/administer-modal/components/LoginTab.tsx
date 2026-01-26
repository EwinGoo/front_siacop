import {FC} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {KTIcon} from 'src/_metronic/helpers'

type Props = {
  isConnecting: boolean
  isConnected: boolean
  onLogin: (username: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
}

// Schema de validación para credenciales
const credentialsSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'El usuario debe tener al menos 3 caracteres')
    .required('El usuario es obligatorio'),
  password: Yup.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .required('La contraseña es obligatoria'),
})

const LoginTab: FC<Props> = ({isConnecting, isConnected, onLogin, onLogout}) => {
  const formik = useFormik({
    initialValues: {
      username: '1',
      password: '123123',
    },
    validationSchema: credentialsSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      await onLogin(values.username, values.password)
      setSubmitting(false)
    },
  })

  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && formik.errors[fieldName])
  }

  return (
    <div className='tab-pane active'>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col-md-6 fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Usuario</label>
            <input
              {...formik.getFieldProps('username')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('username'),
                'is-valid': formik.touched.username && isFieldValid('username'),
              })}
              disabled={formik.isSubmitting || isConnecting}
              placeholder='admin'
            />
            {!isFieldValid('username') && (
              <div className='invalid-feedback'>{formik.errors.username}</div>
            )}
          </div>

          <div className='col-md-6 fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Contraseña</label>
            <input
              type='password'
              {...formik.getFieldProps('password')}
              className={clsx('form-control form-control-solid', {
                'is-invalid': !isFieldValid('password'),
                'is-valid': formik.touched.password && isFieldValid('password'),
              })}
              disabled={formik.isSubmitting || isConnecting}
              placeholder='Ingrese contraseña'
            />
            {!isFieldValid('password') && (
              <div className='invalid-feedback'>{formik.errors.password}</div>
            )}
          </div>
        </div>

        <div className='d-flex justify-content-end'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={!formik.isValid || formik.isSubmitting || isConnecting}
          >
            <i className='las la-plug fs-5 me-2'></i>
            {isConnecting && <span className='spinner-border spinner-border-sm me-2' />}
            {isConnected ? 'Reconectar' : 'Conectar'}
          </button>
        </div>
      </form>

      {isConnected && (
        <div className='alert alert-success mt-4'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <KTIcon iconName='check-circle' className='fs-2 text-success me-3' />
              <div>
                <strong>Sesión activa</strong>
                <br />
                <small>Conectado como: {formik.values.username}</small>
              </div>
            </div>
            <button type='button' className='btn btn-sm btn-light-warning' onClick={onLogout}>
              <KTIcon iconName='exit-down' className='fs-6 me-1' />
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export {LoginTab}