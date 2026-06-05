// PrivateRoutes.tsx (versión actualizada)
import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {ProtectedRoute} from '../modules/auth/core/ProtectedRoute'
import AccessDeniedPage from '../pages/AccessDeniedPage'
import {GestionQrPage} from '../modules/apps/control-personal/gestion-qr'
import { PERMISSIONS } from '../modules/auth/core/roles/permissions'

const PrivateRoutes = () => {

  const ComisionPage = lazy(() => import('../modules/apps/control-personal/comision/ComisionPage'))
  const GestionGuardiasPage = lazy(() => import('../modules/apps/control-personal/guardias-seguridad/GestionGuardiasPage'))
  const AsistenciaPermisoPage = lazy(() => import('../modules/apps/control-personal/permisos/asistencia-permiso/AsistenciaPermisoPage'))
  const DeclaratoriaComisionPage = lazy(() => import('../modules/apps/control-personal/declaratoria-comision/DeclaratoriaComisionPage'))
  const AsignacionesAdministrativasPage = lazy(() => import('../modules/apps/control-personal/asignaciones-administrativas/AsignacionesAdministrativasPage'))
  const TipoPermisoPage = lazy(() => import('../modules/apps/control-personal/permisos/tipos-permisos/TipoPermisoPage'))
  const FeriadoAsuetoPage = lazy(() => import('../modules/apps/control-personal/feriado-asueto/FeriadoAsuetoPage'))
  const PlanillaAsistenciaPage = lazy(() => import('../modules/apps/control-personal/planilla-asistencia/PlanillaAsistenciaPage'))

  const BiometricoPage = lazy(() => import('../modules/apps/administrador/biometrico/BiometricoPage'))
  const BiometricoAdminPage = lazy(() => import('../modules/apps/administrador/biometrico/admin/BiometricoAdminPage'))
  const VacacionReportePage = lazy(() => import('../modules/apps/control-personal/vacaciones/reporte/VacacionReportePage'))

  const enviroment = process.env.REACT_APP_ENVIRONMENT || ''

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* RUTAS ACTUALIZADAS CON NUEVO SISTEMA DE PERMISOS */}
        
        {/* Feriados y Asuetos - requiere permiso específico */}
        <Route
          path='apps/biometricos/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.FERIADO_ASUETO.VIEW]}>
                <BiometricoPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        <Route
          path='apps/biometricos/:id/administrar'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.FERIADO_ASUETO.VIEW]}>
                <BiometricoAdminPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        <Route
          path='apps/feriados-asuetos/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.FERIADO_ASUETO.VIEW]}>
                <FeriadoAsuetoPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />
        
        {/* Asistencias y Permisos - requiere al menos ver */}
        <Route
          path='apps/asistencias-permisos/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.ASISTENCIA_PERMISO.VIEW]}>
                <AsistenciaPermisoPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />
        
        {/* Tipos de Permisos */}
        <Route
          path='apps/tipos-permisos/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.TIPO_PERMISO.VIEW]}>
                <TipoPermisoPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />
        
        {/* Comisiones */}
        <Route
          path='apps/comisiones/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.COMISION.VIEW]} excludeDocenteAdministrativo={true}>
                <ComisionPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />
        
        {/* Gestión QR */}
        <Route
          path='apps/gestion-qr'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.GESTION_QR.VIEW]}>
                <GestionQrPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        {/* Guardias de Seguridad */}
        <Route
          path='apps/guardias-seguridad/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.GUARDIA_SEGURIDAD.VIEW]}>
                <GestionGuardiasPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        {/* Reporte de Vacaciones */}
        <Route
          path='apps/vacaciones-reporte/*'
          element={
            <SuspensedView>
              <ProtectedRoute requiredSpecificPermissions={[PERMISSIONS.VACACION.VIEW]}>
                <VacacionReportePage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />
        
        {/* Declaratoria de Comisión - requiere múltiples permisos alternativos */}
        <Route
          path='apps/declaratoria-comision/*'
          element={
            <SuspensedView>
              <ProtectedRoute 
                requiredSpecificPermissions={[
                  PERMISSIONS.DECLARATORIA_COMISION.VIEW,
                  PERMISSIONS.DECLARATORIA_COMISION.CREATE
                ]}
                requireAllPermissions={false} // OR logic - al menos uno
              >
                <DeclaratoriaComisionPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        <Route
          path='apps/asignaciones-administrativas/*'
          element={
            <SuspensedView>
              <AsignacionesAdministrativasPage />
            </SuspensedView>
          }
        />

        <Route
          path='apps/planilla-asistencia/*'
          element={
            <SuspensedView>
              <ProtectedRoute
                requiredSpecificPermissions={[
                  PERMISSIONS.PLANILLA_ASISTENCIA.VIEW,
                  PERMISSIONS.PLANILLA_ASISTENCIA.IMPORT,
                  PERMISSIONS.PLANILLA_ASISTENCIA.REVIEW,
                ]}
                requireAllPermissions={false}
              >
                <PlanillaAsistenciaPage />
              </ProtectedRoute>
            </SuspensedView>
          }
        />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
        <Route path='/acceso-denegado' element={<AccessDeniedPage />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary') || '#0d6efd'
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
