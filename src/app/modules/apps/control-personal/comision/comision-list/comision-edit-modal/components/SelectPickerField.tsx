import Select from 'react-select'
import {generateDateOptions, getDateOption} from '../utils/dateUtils'
import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'

export const SelectPickerField = ({field, form, isFieldValid, isSubmitting}) => {
  const dateOptions = generateDateOptions()
  const isDateActive = !!dateOptions.find((option) => option.value === field.value)
  const selectedDate = dateOptions.find((option) => option.value === field.value) || null
  const {mode} = useThemeMode()

  const dateOptionsValid = () => {
    return isDateActive ? dateOptions : getDateOption(field.value)
  }

  // Estilos dinámicos basados en el tema
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: !isFieldValid
        ? '#F64E60' // Rojo para errores
        : form.touched[field.name] && isFieldValid
        ? '#1BC5BD' // Verde para válido
        : mode === 'dark'
        ? '#2B2B40' // Borde oscuro
        : '#E4E6EF', // Borde light
      backgroundColor: mode === 'dark' ? '#1E1E2D' : '#F9F9F9',
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
      boxShadow: 'none',
      minHeight: '44px',
      borderWidth: '1px',
      borderRadius: '0.475rem',
      '&:hover': {
        borderColor: mode === 'dark' ? '#3699FF' : '#5D8DF5',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: mode === 'dark' ? '#1E1E2D' : '#FFFFFF',
      border: mode === 'dark' ? '1px solid #2B2B40' : '1px solid #E4E6EF',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? mode === 'dark'
          ? '#3699FF'
          : '#5D8DF5'
        : state.isFocused
        ? mode === 'dark'
          ? '#2B2B40'
          : '#F5F8FA'
        : 'transparent',
      color: (() => {
        if (state.isSelected) {
          return state.isFocused ? (mode === 'dark' ? '#ffffff' : '#000000') : '#ffffff'
        }
        return mode === 'dark' ? '#FFFFFF' : '#000000'
      })(), // color: mode === 'dark' ? '#FFFFFF' : '#000000' ,
      '&:hover': {
        backgroundColor: mode === 'dark' ? '#2B2B40' : '#F5F8FA',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
    }),
    input: (base) => ({
      ...base,
      color: mode === 'dark' ? '#FFFFFF' : '#000000',
    }),
    placeholder: (base) => ({
      ...base,
      color: mode === 'dark' ? '#92929F' : '#B5B5C3',
    }),
  }

  return (
    <Select
      readonly
      className='react-select-styled'
      classNamePrefix='react-select'
      value={selectedDate ?? getDateOption(field.value)}
      onChange={(selectedOption) => {
        if (selectedOption) {
          form.setFieldValue(field.name, selectedOption.value)
        }
      }}
      options={dateOptionsValid()}
      placeholder='Seleccione una fecha'
      isDisabled={!isDateActive ? true : isSubmitting}
      styles={customStyles}
    />
  )
}
