import {NavLink} from 'react-router-dom'

const links = [
  {to: '/apps/planilla-asistencia/importaciones', label: 'Importaciones', icon: 'bi-upload'},
  {to: '/apps/planilla-asistencia/procesos', label: 'Procesos', icon: 'bi-diagram-3'},
  {to: '/apps/planilla-asistencia/resultados-diarios', label: 'Resultados diarios', icon: 'bi-calendar3'},
  {to: '/apps/planilla-asistencia/resultados-mensuales', label: 'Planilla mensual', icon: 'bi-table'},
]

const PlanillaModuleNav = () => {
  return (
    <div className='card mb-7'>
      <div className='card-body py-5'>
        <div className='d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4'>
          <div>
            <div className='text-gray-900 fw-bolder fs-4 mb-1'>Motor de Planilla de Asistencia</div>
            <div className='text-muted fs-6'>
              Flujo operativo: importar, procesar, auditar y consolidar resultados mensuales.
            </div>
          </div>
          <div className='d-flex flex-wrap gap-2'>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({isActive}) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-light-primary'}`
                }
              >
                <i className={`bi ${link.icon} me-2`} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export {PlanillaModuleNav}
