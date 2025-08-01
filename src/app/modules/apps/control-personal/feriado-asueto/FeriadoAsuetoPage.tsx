import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {FeriadoAsuetoListWrapper} from './list/FeriadoAsuetoList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestión de registros',
    path: '',
    isSeparator: false,
    isActive: false,
  },
]

const FeriadoAsuetoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Feriados y Asuetos</PageTitle>
              <FeriadoAsuetoListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/feriados-asueto/listar' />} />
    </Routes>
  )
}

export default FeriadoAsuetoPage
