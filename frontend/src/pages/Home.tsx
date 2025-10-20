import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../app/providers/AppProvider'

export default function Home() {
  const { state, setTheme } = useApp()

  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const base = import.meta.env.VITE_API_BASE_URL ?? ''
      const res = await fetch(`${base}/api/v1/health`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json = (await res.json()) as { data: { status: string; uptime: number; timestamp: string; env: string } }
      return json.data
    },
    refetchOnWindowFocus: false,
  })

  return (
    <section className="space-y-8">
      {/* Hero con gradiente llamativo */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">SportHub</h1>
        <p className="mt-2 text-white/90 max-w-2xl">SPA con React + TypeScript + Tailwind. Enrutamiento con React Router y datos con TanStack Query.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/about" className="btn bg-white text-violet-700 hover:bg-violet-100">Saber más</Link>
          <button onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')} className="btn bg-indigo-900/30 hover:bg-indigo-900/50 text-white">
            Alternar tema
          </button>
          <button onClick={() => refetch()} disabled={isFetching} className="btn bg-emerald-400 hover:bg-emerald-300 text-emerald-950">
            {isFetching ? 'Actualizando…' : 'Refetch'}
          </button>
        </div>
      </div>

      {/* Grid de contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navegación */}
        <div className="rounded-xl border shadow-sm p-5 bg-amber-50 border-amber-200">
          <h2 className="font-semibold text-amber-900 mb-1">Navegación</h2>
          <p className="text-amber-900/80 mb-3">React Router permite cambiar de ruta sin recargar la página.</p>
          <div className="flex gap-3">
            <Link to="/" className="btn bg-amber-600 text-white hover:bg-amber-500">Inicio</Link>
            <Link to="/about" className="btn bg-amber-100 text-amber-900 hover:bg-amber-200">Acerca</Link>
            <Link to="/status" className="btn bg-amber-100 text-amber-900 hover:bg-amber-200">Estado</Link>
          </div>
        </div>

        {/* Fetch (React Query) */}
        <div className="rounded-xl border shadow-sm p-5 bg-emerald-50 border-emerald-200 md:col-span-1">
          <h2 className="font-semibold text-emerald-900 mb-2">Salud del backend</h2>
          <div className="flex items-center gap-2 mb-3">
            <button className="btn bg-emerald-600 text-white hover:bg-emerald-500" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Actualizando…' : 'Refetch'}
            </button>
            <span className="text-emerald-900/70 text-sm">queryKey: ["backend-health"]</span>
          </div>
          {isPending && <p className="text-sm text-emerald-900/70">Cargando…</p>}
          {error && <p className="text-sm text-red-600">Error: {(error as Error).message}</p>}
          {data && (
            <pre className="text-xs bg-white p-3 rounded border border-emerald-200 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      </div>

      {/* CTA final */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-lg">¿Listo para construir?</h3>
            <p className="text-white/90">Conecta tus propios endpoints en el backend.</p>
          </div>
          <Link to="/status" className="btn bg-white text-blue-700 hover:bg-blue-50">Ver estado</Link>
        </div>
      </div>
    </section>
  )
}
