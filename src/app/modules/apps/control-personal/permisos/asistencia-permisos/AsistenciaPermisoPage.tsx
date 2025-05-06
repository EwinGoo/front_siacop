import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../../_metronic/layout/core'
import {AsistenciaPermisoListWrapper} from './list/AsistenciaPermisoList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion de Tipo de Permisos',
    path: '/apps/asistencias-permisos/listar',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '', 
    isSeparator: true,
    isActive: false,
  },
]

const AsistenciaPermisoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Permisos</PageTitle>
              <AsistenciaPermisoListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/asistencias-permisos/listar' />} />
    </Routes>
  )
}

export default AsistenciaPermisoPage
