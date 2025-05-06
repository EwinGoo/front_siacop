import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {ComisionListWrapper} from './comision-list/ComisionList'
import {AprobarPorQrView} from './AprobarPorQrView'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion de Comisiones',
    path: '/apps/comisiones/listar',
    isSeparator: false,
    isActive: false,
  },
]
const aprobarBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion de Comisiones',
    path: '/apps/comisiones/aprobar-qr',  
    isSeparator: false,
    isActive: false,
  },
]

const ComisionPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Comisiones</PageTitle>
              <ComisionListWrapper />
            </>
          }
        />
        <Route
          path='/aprobar-qr'
          element={
            <>
              <PageTitle breadcrumbs={aprobarBreadcrumbs}>Aprobar por QR</PageTitle>
              <AprobarPorQrView />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/comisiones/listar' />} />
    </Routes>
  )
}

export default ComisionPage
