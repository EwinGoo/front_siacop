import React, {useCallback, useState, useRef} from 'react'
import AsyncSelect from 'react-select/async'
import {debounce} from 'lodash'
import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { ID } from 'src/_metronic/helpers'

interface OptionType {
  value: number
  label: string
  tipo?: string
  id_asignacion_administrativo?: number | null
}

interface AsyncSelectFieldProps {
  value: OptionType | null
  onChange: (selected: OptionType | null) => void
  onBlur?: () => void
  fetchOptions: (input: string) => Promise<OptionType[]>
  placeholder?: string
  isInvalid?: boolean
}

const AsyncSelectFieldDebug: React.FC<AsyncSelectFieldProps> = ({
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
      console.log('🔍 Iniciando búsqueda para:', inputValue)
      
      // Verificar si es la misma búsqueda que ya se procesó
      if (lastRequestRef.current === inputValue) {
        console.log('⏭️ Saltando búsqueda duplicada para:', inputValue)
        return
      }

      try {
        setIsLoading(true)
        
        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
          console.log('❌ Cancelando petición anterior')
          abortControllerRef.current.abort()
        }
        
        // Crear nuevo AbortController para esta petición
        abortControllerRef.current = new AbortController()
        const currentRequestId = ++requestIdRef.current
        
        // Actualizar último término buscado
        lastRequestRef.current = inputValue
        
        console.log('📡 Llamando fetchOptions para:', inputValue)
        const options = await fetchOptions(inputValue)
        console.log('✅ Opciones recibidas:', options)
        
        // Verificar si esta petición sigue siendo relevante
        if (currentRequestId === requestIdRef.current && !abortControllerRef.current.signal.aborted) {
          console.log('🎯 Aplicando opciones:', options)
          console.log('📊 Cantidad de opciones:', options.length)
          console.log('🔍 Primera opción:', options[0])
          console.log('💾 Estado del requestId:', { currentRequestId, latest: requestIdRef.current })
          
          // Forzar que el callback siempre reciba un array válido
          const validOptions = Array.isArray(options) ? options : []
          console.log('✅ Enviando al callback:', validOptions)
          callback(validOptions)
        } else {
          console.log('🚫 Descartando respuesta obsoleta', { 
            currentRequestId, 
            latest: requestIdRef.current, 
            aborted: abortControllerRef.current?.signal.aborted 
          })
        }
      } catch (error) {
        console.error('❗ Error en búsqueda:', error)
        // Solo mostrar error si no fue cancelada la petición
        if (!abortControllerRef.current?.signal.aborted) {
          callback([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [fetchOptions]
  )

  const loadOptions = useCallback((inputValue: string, callback: (options: OptionType[]) => void) => {
    console.log('🔄 loadOptions llamado con:', inputValue)
    console.log('📞 Callback recibido:', typeof callback)
    
    if (inputValue.length < 2) {
      console.log('⚠️ Input muy corto, retornando array vacío')
      callback([])
      lastRequestRef.current = ''
      return
    }

    // Si el input cambió, resetear el último request para permitir nueva búsqueda
    if (lastRequestRef.current !== inputValue) {
      console.log('🔄 Input cambió, reseteando lastRequest')
      lastRequestRef.current = ''
    }

    console.log('⏳ Llamando debouncedFetcher...')
    debouncedFetcher(inputValue, (receivedOptions) => {
      console.log('📥 Callback ejecutado con opciones:', receivedOptions)
      console.log('📊 Tipo de opciones recibidas:', typeof receivedOptions, Array.isArray(receivedOptions))
      callback(receivedOptions)
    })
  }, [debouncedFetcher])

  // Limpiar al desmontar componente
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      debouncedFetcher.cancel()
    }
  }, [debouncedFetcher])

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? '#1e1e2d' : '#fff',
      borderColor: isInvalid 
        ? '#f1416c' 
        : state.isFocused 
          ? (isDark ? '#4f46e5' : '#0d6efd')
          : (isDark ? '#2D2D43' : '#ced4da'),
      color: isDark ? '#fff' : '#000',
      minHeight: '38px',
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
      zIndex: 99999, // Z-index muy alto
      position: 'absolute', // Asegurar posicionamiento
      border: '2px solid red', // BORDER ROJO PARA DEBUG
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)', // Sombra visible
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? '#ff0000' // ROJO BRILLANTE para debug
        : state.isSelected
          ? '#00ff00' // VERDE para seleccionado
          : isDark ? '#1e1e2d' : '#fff',
      color: '#000', // TEXTO NEGRO SIEMPRE VISIBLE
      padding: '12px', // PADDING GRANDE
      border: '1px solid blue', // BORDER AZUL PARA DEBUG
      fontSize: '16px', // TEXTO GRANDE
    }),
  }

  const noOptionsMessage = useCallback(({inputValue}: {inputValue: string}) => {
    if (inputValue.length < 2) {
      return 'Escribe al menos 2 caracteres'
    }
    if (isLoading) {
      return 'Buscando...'
    }
    return 'No se encontraron resultados'
  }, [isLoading])

  const loadingMessage = useCallback(() => {
    console.log('⏳ Mostrando mensaje de carga')
    return 'Buscando...'
  }, [])

  // Debug del valor actual
  React.useEffect(() => {
    console.log('🔄 Valor actual del AsyncSelect:', value)
  }, [value])

  return (
    <>
      <AsyncSelect
        cacheOptions={false}
        defaultOptions={false}
        placeholder={placeholder}
        value={value}
        onChange={(selected) => {
          console.log('🎯 Opción seleccionada:', selected)
          onChange(selected)
        }}
        onBlur={onBlur}
        loadOptions={loadOptions}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
        styles={customStyles}
        isClearable
        isSearchable
        menuPortalTarget={null} // CAMBIAR: renderizar en el contenedor padre
        menuPosition="absolute" // CAMBIAR: posición absoluta
        onInputChange={(inputValue, actionMeta) => {
          console.log('⌨️ Input cambió:', inputValue, 'Acción:', actionMeta.action)
          if (actionMeta.action === 'input-change') {
            console.log('🔤 Usuario está escribiendo:', inputValue)
          }
        }}
        onMenuOpen={() => {
          console.log('📂 Menu abierto')
        }}
        onMenuClose={() => {
          console.log('📁 Menu cerrado')
        }}
        filterOption={() => true} // Desactivar filtrado interno
        isLoading={isLoading}
        // loadingMessage={loadingMessage}
        components={{
          Option: (props) => {
            console.log('🎨 Renderizando opción:', props.data)
            return (
              <div 
                {...props.innerProps}
                style={{
                  ...props.getStyles('option', props),
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                {props.data.label}
              </div>
            )
          }
        }}
      />
      
      {/* Panel de debug */}
      {/* <div style={{
        marginTop: '8px',
        padding: '8px',
        backgroundColor: isDark ? '#2a2a3c' : '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div><strong>Debug Info:</strong></div>
        <div>Value: {value ? JSON.stringify(value) : 'null'}</div>
        <div>IsLoading: {isLoading.toString()}</div>
        <div>LastRequest: {lastRequestRef.current}</div>
      </div> */}
    </>
  )
}

export default AsyncSelectFieldDebug