import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container-app py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400">SportHub</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Inicio</Link>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">Acerca</Link>
            <Link to="/status" className="hover:text-blue-600 dark:hover:text-blue-400">Estado</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1 container-app py-6">
        <Outlet />
      </main>
      <footer className="border-t bg-white dark:bg-gray-950">
        <div className="container-app py-4 text-xs text-muted">© {new Date().getFullYear()} SportHub</div>
      </footer>
    </div>
  )
}
