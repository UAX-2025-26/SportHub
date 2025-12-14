"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { adminService } from "@/lib/api"
import CreateCenterForm from "@/components/admin/forms/CreateCenterForm"
import styles from "./center-admin.module.css"

interface CenterData {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  horario_apertura: string
  horario_cierre: string
}

interface FacilityData {
  id: string
  nombre: string
  tipo: string
  capacidad: number
  precio_hora: number
  activo: boolean
}

interface BookingData {
  id: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  usuario: string
  instalacion: string
  total_precio: number
  estado: string
}

const CenterAdminPanel: React.FC = () => {
  const router = useRouter()
  const { token } = useAuth()
  const [center, setCenter] = useState<CenterData | null>(null)
  const [facilities, setFacilities] = useState<FacilityData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showCreateCenter, setShowCreateCenter] = useState(false)

  const getStatusLabel = (estado: string): string => {
    const statusMap: { [key: string]: string } = {
      PENDIENTE_PAGO: "Pendiente de Pago",
      CONFIRMADA: "Confirmada",
      CANCELADA: "Cancelada",
      COMPLETADA: "Completada",
      confirmada: "Confirmada",
      cancelada: "Cancelada",
      pendiente: "Pendiente",
      CONFIRMED: "Confirmada",
      CANCELLED: "Cancelada",
      COMPLETED: "Completada",
      PENDING_PAYMENT: "Pendiente de Pago",
    }
    return statusMap[estado] || estado
  }

  useEffect(() => {
    loadCenterData()
  }, [token])

  const loadCenterData = async () => {
    if (!token) {
      console.log("[CENTER ADMIN] Token no disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("[CENTER ADMIN] Iniciando carga de datos del centro...")
      console.log("[CENTER ADMIN] Token disponible:", token.substring(0, 20) + "...")

      const { data, error, status } = await adminService.getMyCenterData(token)

      console.log("[CENTER ADMIN] Respuesta del servidor:", status)

      if (status === 400) {
        console.log("[CENTER ADMIN] Usuario no tiene centro asignado")
        setShowCreateCenter(true)
        setCenter(null)
        setFacilities([])
        setBookings([])
        setError("")
        setLoading(false)
        return
      }

      if (error || status >= 400) {
        console.error("[CENTER ADMIN] Error al cargar datos:", error)
        setError("Error al cargar datos del centro: " + (error || "Unknown error"))
        setShowCreateCenter(false)
        setLoading(false)
        return
      }

      if (data) {
        console.log("[CENTER ADMIN] Datos cargados exitosamente:", data)
        setCenter(data.center)
        setFacilities(data.facilities || [])
        setBookings(data.bookings || [])
        setShowCreateCenter(false)
        setError("")
      }
      setLoading(false)
    } catch (err) {
      console.error("[CENTER ADMIN] Error inesperado:", err)
      setError("Error al cargar los datos del centro")
      setShowCreateCenter(false)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    )
  }

  if (!center && showCreateCenter) {
    return (
      <CreateCenterForm
        onSuccess={() => {
          console.log("[CENTER ADMIN] Centro creado, recargando datos...")
          setShowCreateCenter(false)
          loadCenterData()
        }}
      />
    )
  }

  if (!center) {
    return (
      <div className={styles.container}>
        <p>No tienes un centro asignado</p>
      </div>
    )
  }

  return (
    <div className={styles.panelWrapper}>
      {/* Left column: Center info, facilities, stats */}
      <div className={styles.mainColumn}>
        <div className={styles.section}>
          <h2 className={styles.heading}>Mi Centro: {center.nombre}</h2>

          <div className={styles.centerInfo}>
            <div className={styles.infoGroup}>
              <label>Ubicación</label>
              <p>
                {center.direccion}, {center.ciudad}
              </p>
            </div>
            <div className={styles.infoGroup}>
              <label>Horario</label>
              <p>
                {center.horario_apertura} - {center.horario_cierre}
              </p>
            </div>
            <div className={styles.actions}>
              <button onClick={() => router.push(`/admin-center/${center!.id}`)} className={styles.editButton}>
                Editar Centro
              </button>
            </div>
          </div>

          <div className={styles.facilitiesSection}>
            <h3>Instalaciones ({facilities.length})</h3>

            {facilities.length === 0 ? (
              <div className={styles.empty}>
                <p>No tienes instalaciones aún</p>
                <button
                  onClick={() => router.push(`/admin-center/${center!.id}/facilities/new`)}
                  className={styles.createButton}
                >
                  + Crear Primera Instalación
                </button>
              </div>
            ) : (
              <div className={styles.facilitiesList}>
                {facilities.map((facility) => (
                  <div key={facility.id} className={styles.facilityCard}>
                    <div className={styles.facilityInfo}>
                      <h4>{facility.nombre}</h4>
                      <p className={styles.facilityType}>{facility.tipo}</p>
                      <div className={styles.details}>
                        <span>Capacidad: {facility.capacidad}</span>
                        <span>${facility.precio_hora}/h</span>
                        <span className={facility.activo ? styles.active : styles.inactive}>
                          {facility.activo ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/admin-center/${center!.id}/facilities/${facility.id}`)}
                      className={styles.smallButton}
                    >
                      Editar
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => router.push(`/admin-center/${center!.id}/facilities/new`)}
                  className={styles.createButton}
                >
                  + Crear Instalación
                </button>
              </div>
            )}
          </div>

          <div className={styles.statsSection}>
            <h3>Estadísticas</h3>
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Instalaciones</p>
                <p className={styles.statValue}>{facilities.length}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Reservas</p>
                <p className={styles.statValue}>{bookings.length}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Ingresos</p>
                <p className={styles.statValue}>
                  ${bookings.reduce((sum, b) => sum + (b.total_precio || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Recent bookings */}
      {bookings.length > 0 && (
        <div className={styles.bookingsColumn}>
          <div className={styles.section}>
            <h3>Reservas Recientes ({bookings.length})</h3>
            <div className={styles.bookingsList}>
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <span className={styles.bookingFacility}>{booking.instalacion}</span>
                    <span
                      className={styles.bookingStatus}
                      style={{
                        backgroundColor:
                          booking.estado === "CONFIRMADA"
                            ? "#4caf50"
                            : booking.estado === "CANCELADA"
                              ? "#f44336"
                              : "#ff9800",
                      }}
                    >
                      {getStatusLabel(booking.estado)}
                    </span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <p>
                      <strong>Usuario:</strong> {booking.usuario}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {new Date(booking.fecha).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Hora:</strong> {booking.hora_inicio} - {booking.hora_fin}
                    </p>
                    <p className={styles.bookingPrice}>${booking.total_precio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CenterAdminPanel
