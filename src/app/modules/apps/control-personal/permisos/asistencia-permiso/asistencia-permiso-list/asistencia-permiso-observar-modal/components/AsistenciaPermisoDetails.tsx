import { EstadoBadge } from 'src/app/modules/components/EstadoBadge'
import { AsistenciaPermiso } from '../../core/_models'
import useDateFormatter from 'src/app/hooks/useDateFormatter'

interface Props {
  asistenciaPermiso: AsistenciaPermiso
}

export const AsistenciaPermisoDetails: React.FC<Props> = ({ asistenciaPermiso }) => {
  const { formatLongDate } = useDateFormatter()

  return (
    <div className='bg-primary bg-opacity-10 p-4 rounded mb-4'>
      <h6 className='text-primary mb-3 fw-semibold'>
        <i className='bi bi-geo-alt me-2'></i>
        Detalles del permiso
      </h6>
      <p className='mb-1'>
        <strong>Código:</strong> {asistenciaPermiso.id_asistencia_permiso || 'N/D'}
      </p>
      <p className='mb-1'>
        <strong>Generado por:</strong> {asistenciaPermiso.nombre_generador || 'N/D'}
      </p>
      <p className='mb-1'>
        <strong>Fecha inicio:</strong>{' '}
        {asistenciaPermiso.fecha_inicio_permiso
          ? formatLongDate(asistenciaPermiso.fecha_inicio_permiso)
          : 'N/D'}
      </p>
      <p className='mb-1'>
        <strong>Fecha fin:</strong>{' '}
        {asistenciaPermiso.fecha_fin_permiso
          ? formatLongDate(asistenciaPermiso.fecha_fin_permiso)
          : 'N/D'}
      </p>
      <div className='separator separator-dashed border-secondary my-1'></div>
      <p className='mb-0'>
        <strong>Estado:</strong>{' '}
        <EstadoBadge estado={asistenciaPermiso.estado_permiso} />
      </p>
    </div>
  )
}
