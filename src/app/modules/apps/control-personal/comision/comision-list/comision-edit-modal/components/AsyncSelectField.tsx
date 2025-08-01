import React, {useCallback, useState} from 'react'
import AsyncSelect from 'react-select/async'
import {debounce} from 'lodash'
import clsx from 'clsx'
import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface OptionType {
  value: number
  label: string
  id_asignacion_administrativo?: number // Agregar este campo
}

interface AsyncSelectFieldProps {
  value: OptionType | null
  onChange: (selected: OptionType | null) => void
  onBlur?: () => void
  fetchOptions: (input: string) => Promise<OptionType[]>
  placeholder?: string
  isInvalid?: boolean
}

const AsyncSelectField: React.FC<AsyncSelectFieldProps> = ({
  value,
  onChange,
  onBlur,
  fetchOptions,
  placeholder = 'Buscar...',
  isInvalid = false,
}) => {
  const {mode} = useThemeMode()
  const isDark = mode === 'dark'

  const debouncedFetcher = useCallback(
    debounce(async (inputValue: string, callback: (options: OptionType[]) => void) => {
      try {
        const options = await fetchOptions(inputValue)
        callback(options)
      } catch (error) {
        console.error('Error al cargar opciones:', error)
        callback([])
      }
    }, 300),
    []
  )

  const loadOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
    if (inputValue.length < 2) {
      callback([])
      return
    }
    debouncedFetcher(inputValue, callback)
  }

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1e1e2d' : '#fff',
      borderColor: isInvalid ? '#f1416c' : isDark ? '#2D2D43' : '#ced4da',
      color: isDark ? '#fff' : '#000',
      // outline: 'none',
      // boxShadow: isInvalid ? 'none' : undefined
    }),
    input: (provided: any) => ({
      ...provided,
      color: isDark ? '#fff' : '#000',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDark ? '#fff' : '#000',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1e1e2d' : '#fff',
      color: isDark ? '#fff' : '#000',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? '#2a2a3c'
          : '#f0f0f0'
        : 'transparent',
      color: isDark ? '#fff' : '#000',
    }),
  }

  return (
    <>
      <AsyncSelect
        cacheOptions
        defaultOptions
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        loadOptions={loadOptions}
        noOptionsMessage={({inputValue}) =>
          inputValue.length < 2
            ? 'Escribe al menos 2 caracteres'
            : 'No se encontraron resultados'
        }
        loadingMessage={() => 'Buscando...'}
        styles={customStyles}
      />
    </>
  )
}

export default AsyncSelectField
