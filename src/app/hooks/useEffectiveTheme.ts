// hooks/useEffectiveTheme.ts
import { useState, useEffect } from 'react'
import { useThemeMode } from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'

export const useEffectiveTheme = () => {
  const { mode } = useThemeMode()
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (mode === 'dark') {
        setEffectiveTheme('dark')
      } else if (mode === 'light') {
        setEffectiveTheme('light')
      } else if (mode === 'system') {
        // Detectar preferencia del sistema
        const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches
        setEffectiveTheme(isDarkSystem ? 'dark' : 'light')
      } else {
        setEffectiveTheme('light') // fallback
      }
    }

    // Ejecutar inicialmente
    updateEffectiveTheme()

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = () => {
      if (mode === 'system') {
        updateEffectiveTheme()
      }
    }

    // Agregar listener para cambios en el sistema
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [mode])

  return {
    effectiveTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light'
  }
}
