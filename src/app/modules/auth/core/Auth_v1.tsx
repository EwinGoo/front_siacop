import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserBySession} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'
import {APP_ROLES, RoleKey, RoleValue} from './roles'
import {useNavigate} from 'react-router-dom'
import {Permission} from './roles/permissions'
import {ROLE_PERMISSIONS} from './roles/roleDefinitions'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
  hasRole: (roleKey: RoleKey) => boolean
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
  hasRole: (_roleKey) => false,
  hasPermission: (_permission) => false,
  hasAnyPermission: (_permissions) => false,
  hasAllPermissions: (_permissions) => false,
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()

  const saveAuth = useCallback((auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }, [])

  const logout = useCallback(() => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }, [saveAuth])

  // ✅ Función auxiliar para obtener permisos del usuario (no memoizada)
  const getUserPermissions = useCallback((userGroups: string[] | undefined): Permission[] => {
    if (!userGroups) return []
    
    return userGroups.flatMap(
      (role) => ROLE_PERMISSIONS[role as RoleValue] || []
    )
  }, [])

  // ✅ Memoizar solo las funciones principales con dependencias simples
  const hasRole = useCallback(
    (roleKey: RoleKey): boolean => {
      return currentUser?.groups?.includes(APP_ROLES[roleKey]) ?? false
    },
    [currentUser?.groups]
  )

  // ✅ Crear todas las funciones de permisos juntas para evitar dependencias circulares
  const permissionFunctions = useMemo(() => {
    const userPermissions = getUserPermissions(currentUser?.groups)
    
    return {
      hasPermission: (permission: Permission): boolean => {
        return userPermissions.includes(permission)
      },
      
      hasAnyPermission: (permissions: Permission[]): boolean => {
        return permissions.some((permission) => userPermissions.includes(permission))
      },
      
      hasAllPermissions: (permissions: Permission[]): boolean => {
        return permissions.every((permission) => userPermissions.includes(permission))
      }
    }
  }, [currentUser?.groups, getUserPermissions])

  // ✅ Contexto con dependencias más simples
  const contextValue = useMemo(
    () => ({
      auth,
      saveAuth,
      currentUser,
      setCurrentUser,
      logout,
      hasRole,
      ...permissionFunctions
    }),
    [auth, currentUser, saveAuth, logout, hasRole, permissionFunctions]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {logout, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const {data} = await getUserBySession()
          if (data) {
            setCurrentUser(data.user)
            // Creamos un auth model básico para mantener compatibilidad
            const authModel: AuthModel = {
              api_token: 'session-based',
              refreshToken: undefined,
            }
            authHelper.setAuth(authModel)
          }
        }
      } catch (error: any) {
        console.error(error)
        if (error.code === 'ERR_NETWORK') {
          navigate('/error/500')
          return
        }

        if (!didRequest.current) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (!didRequest.current) {
      requestUser()
    }
  }, [logout, setCurrentUser, navigate])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}