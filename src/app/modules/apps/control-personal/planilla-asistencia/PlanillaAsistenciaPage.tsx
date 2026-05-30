import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from 'src/_metronic/layout/core'
import ImportacionesPage from './importaciones/ImportacionesPage'
import ProcesosPage from './procesos/ProcesosPage'
import ResultadosDiariosPage from './resultados-diarios/ResultadosDiariosPage'
import ResultadosMensualesPage from './resultados-mensuales/ResultadosMensualesPage'

const breadcrumbs: Array<PageLink> = [
  {
    title: 'Control Personal',
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

const PlanillaAsistenciaPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/importaciones'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Planilla de Asistencia: Importaciones</PageTitle>
              <ImportacionesPage />
            </>
          }
        />
        <Route
          path='/procesos'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Planilla de Asistencia: Procesos</PageTitle>
              <ProcesosPage />
            </>
          }
        />
        <Route
          path='/resultados-diarios'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Planilla de Asistencia: Resultados Diarios</PageTitle>
              <ResultadosDiariosPage />
            </>
          }
        />
        <Route
          path='/resultados-mensuales'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Planilla de Asistencia: Resultado Mensual</PageTitle>
              <ResultadosMensualesPage />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/planilla-asistencia/importaciones' />} />
    </Routes>
  )
}

export default PlanillaAsistenciaPage
