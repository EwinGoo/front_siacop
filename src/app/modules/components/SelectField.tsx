import React from 'react'
import Select from 'react-select'
import clsx from 'clsx'
import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {getSelectStyles} from './selectStyles'
import { ID } from 'src/_metronic/helpers'

interface SelectFieldProps {
  field: any
  form: any
  isFieldValid?: boolean
  isSubmitting?: boolean
  options: Array<{value: string | number | ID; label: string}>
  placeholder?: string
  className?: string
  clearFieldError?: (fieldName: string) => void
  // onChange?: (option: {value: string | number; label: string}) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  form,
  isFieldValid = true,
  isSubmitting = false,
  options,
  clearFieldError,
  placeholder = 'Seleccionar...',
  className,
}) => {
  const {mode} = useThemeMode()
  const selectedOption = options.find((option) => option.value === field.value) || null
  const styles = getSelectStyles(mode, isFieldValid)

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      form.setFieldValue(field.name, selectedOption.value)
      form.setFieldTouched(field.name, true, false)
      if (clearFieldError) {
        clearFieldError(field.name)
      }
    }
  }

  return (
    <Select
      className={clsx(
        'react-select-styled',
        {
          'is-invalid': !isFieldValid,
          'is-valid': isFieldValid && field.value,
        },
        className
      )}
      classNamePrefix='react-select'
      value={selectedOption}
      onChange={handleChange}
      onBlur={() => form.setFieldTouched(field.name, true)}
      options={options}
      placeholder={placeholder}
      isDisabled={isSubmitting}
      styles={styles}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: mode === 'dark' ? '#3699FF' : '#1BC5BD',
          primary25: mode === 'dark' ? '#2D2D43' : '#F5F5F5',
          neutral0: mode === 'dark' ? '#1e1e2d' : '#ffffff',
          neutral80: mode === 'dark' ? '#FFFFFF' : '#3F4254',
        },
      })}
    />
  )
}
