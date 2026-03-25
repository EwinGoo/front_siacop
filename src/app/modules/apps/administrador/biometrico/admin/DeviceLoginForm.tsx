import {FC} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {KTIcon} from 'src/_metronic/helpers'
import {DispositivoBiometrico} from '../list/core/_models'
import {loginBiometrico} from '../list/core/_requests'
import {showToast} from 'src/app/utils/toastHelper'

const schema = Yup.object().shape({
  username: Yup.string().required('El usuario es obligatorio'),
  password: Yup.string().min(1, 'La contraseña es obligatoria').required('La contraseña es obligatoria'),
})

type Props = {
  device: DispositivoBiometrico
  onLoginSuccess: () => void
}

const DeviceLoginForm: FC<Props> = ({device, onLoginSuccess}) => {
  const formik = useFormik({
    initialValues: {username: 'admin', password: ''},
    validationSchema: schema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        const response = await loginBiometrico(
          device.direccion_ip!,
          values.username,
          values.password
        )

        if (response.success) {
          onLoginSuccess()
        } else {
          showToast({
            message: response.message ?? 'Credenciales incorrectas. Verifique usuario y contraseña.',
            type: 'error',
          })
        }
      } catch (err: any) {
        showToast({
          message: err.response?.data?.message ?? 'No se pudo conectar con el dispositivo.',
          type: 'error',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className='row justify-content-center'>
      <div className='col-md-5'>
        <div className='card'>
          <div className='card-body p-10'>
            <div className='text-center mb-8'>
              <div className='symbol symbol-70px mx-auto mb-4'>
                <div className='symbol-label bg-light-primary'>
                  <KTIcon iconName='lock' className='fs-2x text-primary' />
                </div>
              </div>
              <h4 className='fw-bold'>Acceso al Dispositivo</h4>
              <p className='text-muted fs-7 mb-0'>
                Ingrese las credenciales del administrador del biométrico
              </p>
              <div className='badge badge-light-info mt-2 fs-8'>
                {device.direccion_ip}:{device.puerto}
              </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className='fv-row mb-6'>
                <label className='form-label required fw-semibold'>Usuario</label>
                <input
                  {...formik.getFieldProps('username')}
                  className={clsx('form-control form-control-solid', {
                    'is-invalid': formik.touched.username && formik.errors.username,
                  })}
                  placeholder='admin'
                  disabled={formik.isSubmitting}
                  autoComplete='username'
                />
                {formik.touched.username && formik.errors.username && (
                  <div className='invalid-feedback'>{formik.errors.username}</div>
                )}
              </div>

              <div className='fv-row mb-8'>
                <label className='form-label required fw-semibold'>Contraseña</label>
                <input
                  type='password'
                  {...formik.getFieldProps('password')}
                  className={clsx('form-control form-control-solid', {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  })}
                  placeholder='Contraseña del dispositivo'
                  disabled={formik.isSubmitting}
                  autoComplete='current-password'
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='invalid-feedback'>{formik.errors.password}</div>
                )}
              </div>

              <button
                type='submit'
                className='btn btn-primary w-100'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? (
                  <>
                    <span className='spinner-border spinner-border-sm me-2' />
                    Conectando...
                  </>
                ) : (
                  <>
                    <KTIcon iconName='entrance-right' className='fs-4 me-2' />
                    Conectar al dispositivo
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export {DeviceLoginForm}
