import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
// import {getUserByToken} from './_requests'
import {getUserBySession} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'
import {APP_ROLES, PERMISSION_GROUPS, RoleKey} from './roles'
import {useNavigate} from 'react-router-dom'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
  hasRole: (roleKey: RoleKey) => boolean
  hasPermission: (permissionKey: keyof typeof PERMISSION_GROUPS) => boolean
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
  hasRole: (_roleKey) => false,
  hasPermission: (_permissionKey) => false,
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
      // setCurrentUser(auth.user);
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  const hasRole = (roleKey: RoleKey): boolean => {
    return currentUser?.groups?.includes(APP_ROLES[roleKey]) ?? false
  }

  const hasPermission = (permissionKey: keyof typeof PERMISSION_GROUPS): boolean => {
    const allowedRoles = PERMISSION_GROUPS[permissionKey]
    if (!allowedRoles) {
      // No existe ese grupo de permiso
      console.warn(`Permiso no definido: ${permissionKey}`)
      return false
    }
    return currentUser?.groups?.some((group) => allowedRoles.includes(group)) ?? false
  }

  return (
    <AuthContext.Provider
      value={{auth, saveAuth, currentUser, setCurrentUser, logout, hasRole, hasPermission}}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, logout, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const navigate = useNavigate()
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          // Cambiamos esta parte para usar la sesión en lugar del token
          const {data} = await getUserBySession()
          if (data) {
            setCurrentUser(data.user)
            // Creamos un auth model básico para mantener compatibilidad
            const authModel: AuthModel = {
              api_token: 'session-based', // Esto es simbólico
              refreshToken: undefined,
            }
            authHelper.setAuth(authModel)
          }
        }
      } catch (error: any) {
        console.error(error)
        if (error.code === 'ERR_NETWORK') {
          // Redirige a página de error 500
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

    requestUser()
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
