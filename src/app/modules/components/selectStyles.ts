import {ThemeModeType} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'

export const getSelectStyles = (mode: ThemeModeType, isValid?: boolean) => ({
  control: (base: any, {isFocused}: {isFocused: boolean}) => ({
    ...base,
    minHeight: '44px',
    backgroundColor: mode === 'dark' ? '#1e1e2d' : '#f9f9f9',
    borderColor: getBorderColor(mode, isFocused, isValid),
    boxShadow: 'none',
    '&:hover': {
      borderColor: getHoverBorderColor(mode, isValid)
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: mode === 'dark' ? '#1e1e2d' : '#ffffff',
    borderColor: mode === 'dark' ? '#2D2D43' : '#E4E6EF',
    zIndex: 9999
  }),
  option: (base: any, {isSelected, isFocused}: any) => ({
    ...base,
    backgroundColor: getOptionBgColor(mode, isSelected, isFocused),
    color: getOptionTextColor(mode, isSelected),
    '&:hover': {
      color: mode === 'dark' ? '#FFFFFF' : '#3F4254'
    }
  }),
  singleValue: (base: any) => ({
    ...base,
    color: mode === 'dark' ? '#FFFFFF' : '#3F4254'
  }),
})

// Funciones helper para colores
const getBorderColor = (mode: ThemeModeType, isFocused: boolean, isValid?: boolean) => {
  if (isValid === false) return '#F64E60'
  if (isFocused) return mode === 'dark' ? '#3699FF' : '#1BC5BD'
  return mode === 'dark' ? '#2D2D43' : '#E4E6EF'
}

const getHoverBorderColor = (mode: ThemeModeType, isValid?: boolean) => {
  if (isValid === false) return '#F64E60'
  return mode === 'dark' ? '#3699FF' : '#1BC5BD'
}

const getOptionBgColor = (mode: ThemeModeType, isSelected: boolean, isFocused: boolean) => {
  if (isSelected) return mode === 'dark' ? '#3699FF' : '#1BC5BD'
  if (isFocused) return mode === 'dark' ? '#2D2D43' : '#F5F5F5'
  return 'transparent'
}

const getOptionTextColor = (mode: ThemeModeType, isSelected: boolean) => {
  if (isSelected) return '#FFFFFF'
  return mode === 'dark' ? '#92929F' : '#3F4254'
}