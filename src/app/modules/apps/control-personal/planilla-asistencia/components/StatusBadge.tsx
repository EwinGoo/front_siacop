interface Props {
  value?: string | null
}

const mapClass = (value?: string | null) => {
  switch ((value || '').toUpperCase()) {
    case 'COMPLETADO':
    case 'PRESENTE':
      return 'badge-light-success'
    case 'PROCESANDO':
      return 'badge-light-primary'
    case 'ATRASO':
    case 'OBSERVADO':
      return 'badge-light-warning'
    case 'ERROR':
    case 'ERROR_REVERTIDO':
    case 'FALTA':
    case 'ABANDONO':
      return 'badge-light-danger'
    default:
      return 'badge-light-secondary'
  }
}

const StatusBadge = ({value}: Props) => {
  return <span className={`badge ${mapClass(value)}`}>{value || 'SIN ESTADO'}</span>
}

export {StatusBadge}
