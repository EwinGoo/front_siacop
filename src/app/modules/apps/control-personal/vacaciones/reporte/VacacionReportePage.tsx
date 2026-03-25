import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from 'src/_metronic/layout/core'
import {VacacionReporteListWrapper} from './vacacion-reporte-list/VacacionReporteList'

const breadcrumbs: Array<PageLink> = [
  {
    title: 'Reporte de Vacaciones',
    path: '/apps/vacaciones-reporte/listar',
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

const VacacionReportePage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Reporte de Vacaciones</PageTitle>
              <VacacionReporteListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/vacaciones-reporte/listar' />} />
    </Routes>
  )
}

export default VacacionReportePage
