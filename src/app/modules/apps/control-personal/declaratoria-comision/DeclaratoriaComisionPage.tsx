import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {DeclaratoriaComisionListWrapper} from './declaratoria-comision-list/DeclaratoriaComisionList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Control Personal',
    path: '/apps/declaratoria-comision/listar',
    isSeparator: false,
    isActive: false,
  },
]

const DeclaratoriaComisionPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Declaratorias Comisión</PageTitle>
              <DeclaratoriaComisionListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/comisiones/listar' />} />
    </Routes>
  )
}

export default DeclaratoriaComisionPage
