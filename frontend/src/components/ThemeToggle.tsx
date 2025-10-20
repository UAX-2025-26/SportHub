import { useApp } from '../app/providers/AppProvider'

export default function ThemeToggle() {
  const { state, setTheme } = useApp()
  const isDark = state.theme === 'dark'
  return (
    <button
      type="button"
      className="btn btn-ghost"
      aria-label="Cambiar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'}
    >
      {isDark ? '🌙 Oscuro' : '☀️ Claro'}
    </button>
  )
}

