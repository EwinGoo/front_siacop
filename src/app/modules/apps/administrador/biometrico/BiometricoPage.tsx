import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {BiometricoListWrapper} from './list/BiometricoList' 

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Adminitrador',
    path: '#',
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

const BiometricoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de Dispositivos Biometricos</PageTitle>
              <BiometricoListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/feriados-asueto/listar' />} />
    </Routes>
  )
}

export default BiometricoPage
