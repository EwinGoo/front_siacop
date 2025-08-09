import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {ComisionListWrapper} from './comision-list/ComisionList'
import {RecepcionPorQrView} from './RecepcionPorQrView'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import { GestionComisionQR } from './comision-gestion-qr'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestión de Permisos',
    path: '/apps/comisiones/listar',
    isSeparator: false,
    isActive: false,
  },
]
// const aprobarBreadcrumbs: Array<PageLink> = [
//   {
//     title: 'Gestion de Permisos',
//     path: '/apps/comisiones/recepcion-qr',  
//     isSeparator: false,
//     isActive: false,
//   },
// ]

const gestionQRBreadcrumbs: Array<PageLink> = [
  {
    title: 'Control Personal',
    path: '/apps/comisiones/gestion-qr',
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
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Permisos</PageTitle>
              <ComisionListWrapper />
            </>
          }
        />

        <Route
          path='/gestion-qr'  // Cambia la ruta
          element={
            <>
              <PageTitle breadcrumbs={gestionQRBreadcrumbs}>Gestión por QR</PageTitle> {/* Actualiza el título */}
              <RecepcionPorQrView />
              {/* <GestionComisionQR /> */}
              {/* <CameraTestComponent /> */}
            </>
          }
        />
        {/* <Route
          path='/recepcion-qr'
          element={
            <>
              <PageTitle breadcrumbs={aprobarBreadcrumbs}>Recepcionar por QR</PageTitle>
              <RecepcionPorQrView />
            </>
          }
        /> */}
      </Route>
      <Route index element={<Navigate to='/apps/comisiones/listar' />} />
    </Routes>
  )
}

export default ComisionPage
