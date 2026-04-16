import {lazy, Suspense} from 'react'
import {Route, Routes, Outlet, Navigate, NavLink} from 'react-router-dom'
import {PageLink, PageTitle} from 'src/_metronic/layout/core'
import {KTIcon, WithChildren} from 'src/_metronic/helpers'
import {usePermissions} from 'src/app/modules/auth/hooks/usePermissions'

const BloqueListWrapper = lazy(() =>
  import('./bloques/bloque-list/BloqueList').then((m) => ({default: m.BloqueListWrapper}))
)
const GrupoListWrapper = lazy(() =>
  import('./grupos/grupo-list/GrupoList').then((m) => ({default: m.GrupoListWrapper}))
)
const HorarioPage = lazy(() =>
  import('./horario/HorarioPage').then((m) => ({default: m.HorarioPage}))
)

const breadcrumbs: PageLink[] = [
  {title: 'Control de Personal', path: '/apps/guardias-seguridad', isSeparator: false, isActive: false},
  {title: '', path: '', isSeparator: true, isActive: false},
]

const TabLink = ({to, icon, label}: {to: string; icon: string; label: string}) => (
  <NavLink
    to={to}
    className={({isActive}) =>
      `nav-link fw-semibold px-4 py-3 me-2 ${isActive ? 'active text-primary border-bottom border-2 border-primary' : 'text-muted'}`
    }
  >
    <KTIcon iconName={icon} className='fs-4 me-2' />
    {label}
  </NavLink>
)

const SuspenseView = ({children}: WithChildren) => (
  <Suspense fallback={<div className='d-flex justify-content-center py-15'><span className='spinner-border text-primary'></span></div>}>
    {children}
  </Suspense>
)

const GestionGuardiasPage = () => {
  const {guardiaSeguridad} = usePermissions()

  return (
    <Routes>
      <Route
        element={
          <>
            {/* Cabecera con tabs */}
            <div className='card mb-5 mb-xl-10'>
              <div className='card-body pt-9 pb-0'>
                <div className='d-flex align-items-center mb-5'>
                  <div className='symbol symbol-60px symbol-circle me-5'>
                    <div className='symbol-label bg-light-primary'>
                      <KTIcon iconName='shield-tick' className='fs-2x text-primary' />
                    </div>
                  </div>
                  <div>
                    <h1 className='fw-bolder text-dark mb-1'>Guardias de Seguridad</h1>
                    <div className='text-muted fw-semibold fs-6'>
                      Gestión de turnos rotativos, grupos y horarios semanales
                    </div>
                  </div>
                </div>

                {/* Nav Tabs */}
                <div className='d-flex overflow-auto border-bottom' style={{gap: '0'}}>
                  <TabLink to='horario'    icon='calendar'    label='Horario Semanal' />
                  <TabLink to='grupos'     icon='people'      label='Grupos de Rotación' />
                  <TabLink to='bloques'    icon='geolocation' label='Bloques / Áreas' />
                </div>
              </div>
            </div>

            <Outlet />
          </>
        }
      >
        {/* Horario semanal */}
        <Route
          path='horario'
          element={
            <SuspenseView>
              <PageTitle breadcrumbs={breadcrumbs}>Horario Semanal</PageTitle>
              <HorarioPage />
            </SuspenseView>
          }
        />

        {/* Grupos de rotación */}
        <Route
          path='grupos'
          element={
            <SuspenseView>
              <PageTitle breadcrumbs={breadcrumbs}>Grupos de Rotación</PageTitle>
              <GrupoListWrapper />
            </SuspenseView>
          }
        />

        {/* Bloques / áreas */}
        <Route
          path='bloques'
          element={
            <SuspenseView>
              <PageTitle breadcrumbs={breadcrumbs}>Bloques y Áreas</PageTitle>
              <BloqueListWrapper />
            </SuspenseView>
          }
        />

        {/* Redirect por defecto */}
        <Route index element={<Navigate to='horario' />} />
        <Route path='*' element={<Navigate to='horario' />} />
      </Route>
    </Routes>
  )
}

export default GestionGuardiasPage
