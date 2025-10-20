import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="space-y-8">
      {/* Hero llamativo */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">Acerca de SportHub</h1>
        <p className="mt-2 text-white/90 max-w-2xl">Una SPA moderna construida con React + TypeScript, estilizada con Tailwind, enrutada con React Router y con datos gestionados por TanStack Query.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/" className="btn bg-white text-rose-700 hover:bg-rose-100">Ir a Inicio</Link>
          <a href="https://tailwindcss.com/" target="_blank" className="btn bg-rose-900/30 hover:bg-rose-900/50 text-white" rel="noreferrer">Tailwind</a>
        </div>
      </div>

      {/* Grilla informativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tecnologías */}
        <div className="rounded-xl border shadow-sm p-5 bg-violet-50 border-violet-200">
          <h2 className="font-semibold text-violet-900 mb-3">Tecnologías</h2>
          <ul className="flex flex-wrap gap-2">
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">React</li>
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">TypeScript</li>
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">Vite</li>
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">Tailwind CSS</li>
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">React Router</li>
            <li className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm">TanStack Query</li>
          </ul>
        </div>

        {/* Objetivos */}
        <div className="rounded-xl border shadow-sm p-5 bg-emerald-50 border-emerald-200">
          <h2 className="font-semibold text-emerald-900 mb-2">Objetivos</h2>
          <ul className="list-disc list-inside text-emerald-900/90 space-y-1">
            <li>Arquitectura clara y extensible</li>
            <li>UI rápida con utilidades Tailwind</li>
            <li>Datos cacheados y fáciles de sincronizar</li>
            <li>Enrutamiento declarativo y simple</li>
          </ul>
        </div>

        {/* Equipo */}
        <div className="rounded-xl border shadow-sm p-5 bg-sky-50 border-sky-200">
          <h2 className="font-semibold text-sky-900 mb-3">Equipo</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sky-300 flex items-center justify-center text-sky-900 font-semibold">A</div>
              <div>
                <p className="font-medium text-sky-900">Analista</p>
                <p className="text-sky-900/70 text-sm">Requisitos y UX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sky-300 flex items-center justify-center text-sky-900 font-semibold">D</div>
              <div>
                <p className="font-medium text-sky-900">Desarrollador</p>
                <p className="text-sky-900/70 text-sm">Frontend & APIs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sky-300 flex items-center justify-center text-sky-900 font-semibold">Q</div>
              <div>
                <p className="font-medium text-sky-900">QA</p>
                <p className="text-sky-900/70 text-sm">Pruebas y calidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-lg">Explora el código</h3>
            <p className="text-white/90">Revisa las páginas Home y About para ver ejemplos de Router, Context y React Query.</p>
          </div>
          <Link to="/" className="btn bg-white text-fuchsia-700 hover:bg-fuchsia-50">Volver a Inicio</Link>
        </div>
      </div>
    </section>
  )
}
