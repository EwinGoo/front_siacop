import {FC} from 'react'
import {toAbsoluteUrl} from '../../_metronic/helpers'

const AccessDeniedPage: FC = () => {
  return (
    <div className="d-flex flex-column flex-center text-center p-10">
      {/* Imagen o ilustración */}
      <div className="mb-5">
        <img
          src={toAbsoluteUrl('/media/illustrations/sketchy-1/5.png')}
          alt="Access Denied"
          className="mw-300px"
        />
      </div>

      {/* Título */}
      <h1 className="fw-bold text-danger mb-3">
        🚫 Acceso Denegado
      </h1>

      {/* Mensaje */}
      <p className="fs-5 text-gray-600 mb-5">
        No tienes permisos para acceder a esta sección.  
        Si crees que esto es un error, contacta al administrador.
      </p>

      {/* Botón de regreso */}
      <a href="/" className="btn btn-primary">
        Volver al inicio
      </a>
    </div>
  )
}

export default AccessDeniedPage
