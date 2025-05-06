import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import AsistenciaPermisoPage from '../modules/apps/control-personal/permisos/asistencia-permisos/AsistenciaPermisoPage'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  const PersonPage = lazy(() => import('../modules/apps/person-management/PersonPage'))
  const ComisionPage = lazy(() => import('../modules/apps/control-personal/comision/ComisionPage'))
  const TipoPermisoPage = lazy(() => import('../modules/apps/control-personal/permisos/tipos-permisos/TipoPermisoPage'))
  const FeriadoAsuetoPage = lazy(() => import('../modules/apps/control-personal/feriado-asueto/FeriadoAsuetoPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/gestion-persona/*'
          element={
            <SuspensedView>
              <PersonPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/control-personal/*'
          element={
            <SuspensedView>
              <PersonPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/feriados-asuetos/*'
          element={
            <SuspensedView>
              <FeriadoAsuetoPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/asistencias-permisos/*'
          element={
            <SuspensedView>
              <AsistenciaPermisoPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/tipos-permisos/*'
          element={
            <SuspensedView>
              <TipoPermisoPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/comisiones/*'
          element={
            <SuspensedView>
              <ComisionPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/asistencia/*'
          element={
            <SuspensedView>
              <ComisionPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/biometricos/*'
          element={
            <SuspensedView>
              <ComisionPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  // const baseColor = getCSSVariableValue('--bs-primary')
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
