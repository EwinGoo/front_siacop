import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'

const ListLoading = () => {
  const {mode} = useThemeMode()

  const isDark = mode === 'dark'

  const styles = {
    borderRadius: '0.475rem',
    boxShadow: isDark
      ? '0 0 50px 0 rgba(0, 0, 0, 0.3)'
      : '0 0 50px 0 rgb(82 63 105 / 15%)',
    backgroundColor: isDark ? '#1e1e2d' : '#fff',
    color: isDark ? '#a1a5b7' : '#7e8299',
    fontWeight: 500,
    margin: 0,
    width: 'auto',
    padding: '1rem 2rem',
    top: 'calc(50% - 2rem)',
    left: 'calc(50% - 4rem)',
    position: 'absolute' as const,
    textAlign: 'center' as const,
  }

  return <div style={styles}>Cargando...</div>
}

export {ListLoading}
