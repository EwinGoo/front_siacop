import React, {useCallback, useState, useRef} from 'react'
import AsyncSelect from 'react-select/async'
import {debounce} from 'lodash'
import clsx from 'clsx'
import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {ID} from 'src/_metronic/helpers'

interface OptionType {
  value: number
  label: string
  id_asignacion_administrativo?: ID // Agregar este campo
  id_persona?: ID
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

  // Estados para control de peticiones
  const [isLoading, setIsLoading] = useState(false)
  const lastRequestRef = useRef<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef<number>(0)

  const debouncedFetcher = useCallback(
    debounce(async (inputValue: string, callback: (options: OptionType[]) => void) => {
      // Verificar si es la misma búsqueda que ya se procesó

      if (lastRequestRef.current === inputValue) {
        return
      }

      try {
        setIsLoading(true)

        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Crear nuevo AbortController para esta petición
        abortControllerRef.current = new AbortController()
        const currentRequestId = ++requestIdRef.current

        // Actualizar último término buscado
        lastRequestRef.current = inputValue

        const options = await fetchOptions(inputValue)

        // Verificar si esta petición sigue siendo relevante
        if (
          currentRequestId === requestIdRef.current &&
          !abortControllerRef.current.signal.aborted
        ) {
          console.log('entro')

          const validOptions = Array.isArray(options) ? options : []
          console.log('✅ Enviando al callback:', validOptions)
          callback(validOptions)

          // callback(options)
        }
        console.log('entro else')
      } catch (error) {
        // Solo mostrar error si no fue cancelada la petición
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error al cargar opciones:', error)
          callback([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [fetchOptions]
  )

  const loadOptions = useCallback(
    (inputValue: string, callback: (options: OptionType[]) => void) => {
      if (inputValue.length < 2) {
        callback([])
        lastRequestRef.current = '' // Reset cuando no cumple mínimo
        return
      }

      // Si el input cambió, resetear el último request para permitir nueva búsqueda
      if (lastRequestRef.current !== inputValue) {
        lastRequestRef.current = '' // Permitir nueva búsqueda
      }

      debouncedFetcher(inputValue, callback)
    },
    [debouncedFetcher]
  )

  // Limpiar al desmontar componente
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      debouncedFetcher.cancel()
    }
  }, [debouncedFetcher])

  // const loadOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
  //   if (inputValue.length < 2) {
  //     callback([])
  //     return
  //   }
  //   debouncedFetcher(inputValue, callback)
  // }

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1e1e2d' : '#fff',
      borderColor: isInvalid
        ? '#f1416c'
        : state.isFocused
        ? isDark
          ? '#4f46e5'
          : '#0d6efd'
        : isDark
        ? '#2D2D43'
        : '#ced4da',
      color: isDark ? '#fff' : '#000',
      boxShadow: state.isFocused
        ? `0 0 0 0.2rem ${isInvalid ? 'rgba(241, 65, 108, 0.25)' : 'rgba(13, 110, 253, 0.25)'}`
        : undefined,
      '&:hover': {
        borderColor: isInvalid ? '#f1416c' : isDark ? '#4f46e5' : '#0d6efd',
      },
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
      zIndex: 99999,
      position: 'absolute',
      borderColor: isDark ? '#2D2D43' : '#ced4da',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? '#2a2a3c'
          : '#f0f0f0'
        : state.isSelected
        ? isDark
          ? '#4f46e5'
          : '#0d6efd'
        : 'transparent',
      color: state.isSelected ? '#fff' : isDark ? '#fff' : '#000',
      '&:active': {
        backgroundColor: isDark ? '#4f46e5' : '#0d6efd',
      },
    }),
    loadingIndicator: (provided: any) => ({
      ...provided,
      color: isDark ? '#fff' : '#000',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#2D2D43' : '#ced4da',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDark ? '#fff' : '#000',
    }),
  }

  const noOptionsMessage = useCallback(
    ({inputValue}: {inputValue: string}) => {
      if (inputValue.length < 2) {
        return 'Escribe al menos 2 caracteres'
      }
      if (isLoading) {
        return 'Buscando...'
      }
      return 'No se encontraron resultados'
    },
    [isLoading]
  )

  const loadingMessage = useCallback(() => 'Buscando...', [])

  return (
    <AsyncSelect
      cacheOptions={false} // Desactivar cache para evitar conflictos
      defaultOptions={false} // No cargar opciones por defecto
      placeholder={placeholder}
      value={value}
      isClearable
      isSearchable
      onChange={(selected) => {
        console.log('🎯 Opción seleccionada:', selected)
        onChange(selected)
      }}
      onInputChange={(inputValue, actionMeta) => {
        console.log('⌨️ Input cambió:', inputValue, 'Acción:', actionMeta.action)
        if (actionMeta.action === 'input-change') {
          console.log('🔤 Usuario está escribiendo:', inputValue)
        }
      }}
      onBlur={onBlur}
      loadOptions={loadOptions}
      noOptionsMessage={noOptionsMessage}
      filterOption={() => true}
      loadingMessage={loadingMessage}
      isLoading={isLoading}
      styles={customStyles}
      menuPortalTarget={document.body} // Evitar problemas de z-index
      menuPosition='absolute'
      // Configuraciones adicionales para mejor UX
      blurInputOnSelect={false}
      openMenuOnClick={false}
      openMenuOnFocus={false}
      minMenuHeight={50}
      maxMenuHeight={200}
    />
  )
}

export default AsyncSelectField
