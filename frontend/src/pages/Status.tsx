import { useQuery } from '@tanstack/react-query'

export type HealthStatus = {
  status: 'ok'
  uptime: number
  timestamp: string
  env: string
}

async function fetchHealth(): Promise<HealthStatus> {
  const base = import.meta.env.VITE_API_BASE_URL ?? ''
  const res = await fetch(`${base}/api/v1/health`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  const json = (await res.json()) as { data: HealthStatus }
  return json.data
}

export default function Status() {
  const { data, error, isPending, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchOnWindowFocus: false,
  })

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Estado del sistema</h1>
      <div className="card space-y-2">
        <div className="text-sm text-muted">Backend base URL: <code className="font-mono">{baseUrl || '(no configurado)'}</code></div>
        <button className="btn btn-primary" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Consultando…' : 'Comprobar estado'}
        </button>
        {isPending && <p className="text-sm">Cargando…</p>}
        {error && <p className="text-sm text-red-600">Error: {(error as Error).message}</p>}
        {data && (
          <div className="text-sm">
            <p>API: <span className="font-mono">{data.status}</span></p>
            <p>Entorno: <span className="font-mono">{data.env}</span></p>
            <p>Uptime (s): <span className="font-mono">{data.uptime.toFixed(2)}</span></p>
            <p>Timestamp: <span className="font-mono">{new Date(data.timestamp).toLocaleString()}</span></p>
          </div>
        )}
      </div>
    </section>
  )
}
