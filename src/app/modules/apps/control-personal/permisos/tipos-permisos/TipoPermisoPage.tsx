import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../../_metronic/layout/core'
import {TipoPermisoListWrapper} from './list/TipoPermisoList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion de Tipo de Permisos',
    path: '/apps/tipos-permisos/listar',
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

const TipoPermisoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Tipo Permisos</PageTitle>
              <TipoPermisoListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/tipos-permisos/listar' />} />
    </Routes>
  )
}

export default TipoPermisoPage
