import {FC} from 'react'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'

const Error500: FC = () => {
  return (
    <>
      {/* begin::Title */}
      <h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>Error del Sistema</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className='fw-semibold fs-6 text-gray-500 mb-7'>
        ¡Algo salió mal! Por favor, inténtalo de nuevo más tarde.
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className='mb-11'>
        <img
          src={toAbsoluteUrl('/media/auth/500-error.png')}
          className='mw-100 mh-300px theme-light-show'
          alt='Error 500 - Error interno del servidor'
        />
        <img
          src={toAbsoluteUrl('/media/auth/500-error-dark.png')}
          className='mw-100 mh-300px theme-dark-show'
          alt='Error 500 - Error interno del servidor'
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link */}
      <div className='mb-0'>
        <Link to='/' className='btn btn-sm btn-primary'>
          Volver al Inicio
        </Link>
      </div>
      {/* end::Link */}
    </>
  )
}

export {Error500}