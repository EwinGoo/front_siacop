import {RoleValue} from './roles'

export interface AuthModel {
  api_token: string
  refreshToken?: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}
export interface UserMenuItem {
  type: string // 'mvc' | 'react' u otros
  url: string
  label: string
  icon?: string
}

export interface UserMenuGroup {
  subMenuTitle: string
  icon?: string
  items: UserMenuItem[]
}

export interface UserMenuSection {
  menuSectionTitle: string
  // menus?: UserMenuGroup[] // submenús colapsables
  elements?: UserMenuGroup[] // enlaces directos
}

export type UserMenu = {
  [key: string]: UserMenuSection
}

export interface UserModel {
  id: number
  username: string
  password: string | undefined
  email: string
  first_name: string
  last_name: string
  fullname?: string
  occupation?: string
  companyName?: string
  phone?: string
  roles?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: 'https://keenthemes.com'
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  communication?: UserCommunicationModel
  address?: UserAddressModel
  socialNetworks?: UserSocialNetworksModel
  menu?: UserMenu
  groups?: RoleValue[]
  active_asignacion?: {
    active: boolean
    message?: string
  }
  personal?: {
    tipo_personal: 'ADMINISTRATIVO' | 'DOCENTE'
  }
}

export interface UserCheckRequest {
  authenticated: boolean
  user: UserModel
}
