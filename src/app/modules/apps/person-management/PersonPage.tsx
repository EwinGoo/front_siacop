import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {PersonaListWrapper} from './person-list/PersonaList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion de Personas',
    path: '/apps/gestion-persona/persona',
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

const PersonPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='persona'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Listado de personas</PageTitle>
              <PersonaListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/gestion-persona/persona' />} />
    </Routes>
  )
}

export default PersonPage
