"use client"

import { type FunctionComponent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import MainBody from "@/components/main-layout/body/MainBody"
import MainHeader from "@/components/main-layout/header/MainHeader"
import MainContent from "@/components/main-layout/content/MainContent"
import MainFooter from "@/components/main-layout/footer/MainFooter"
import ProfileButton from "@/components/common/button/profile-button/ProfileButton"
import Imagen from "@/components/common/image/Imagen"
import bodyStyles from "@/components/main-layout/body/MainBody.module.css"
import headerStyles from "@/components/main-layout/header/MainHeader.module.css"
import contentStyles from "@/components/main-layout/content/MainContent.module.css"
import { useAuth } from "@/lib/auth/AuthContext"
import { bookingsService, type Booking } from "@/lib/api/bookings.service"
import styles from "./reservas.module.css"

const ReservasPage: FunctionComponent = () => {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, userRole } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Redirigir a admins a sus páginas correspondientes
    if (!isLoading && isAuthenticated && (userRole === 'admin' || userRole === 'center_admin')) {
      if (userRole === 'admin') {
        router.push("/admin")
      } else if (userRole === 'center_admin') {
        router.push("/admin-center")
      }
      return
    }

    if (isAuthenticated && token) {
      loadBookings()
    }
  }, [isLoading, isAuthenticated, token, userRole, router])

  const loadBookings = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const result = await bookingsService.getMyBookings(token)

      if (result.data) {
        setBookings(result.data)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error loading bookings:", err)
      setError("Error al cargar las reservas")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!token || !confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      return
    }

    try {
      setCancellingId(bookingId)
      const result = await bookingsService.cancelBooking(bookingId, token)

      if (result.data?.ok) {
        // Recargar la lista de reservas
        await loadBookings()
      } else if (result.error) {
        alert(`Error al cancelar: ${result.error}`)
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
      alert("Error al cancelar la reserva")
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // HH:MM
  }

  const getEstadoClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "confirmada":
      case "confirmed":
        return styles.estadoConfirmada
      case "pendiente":
      case "pending":
      case "pending_payment":
        return styles.estadoPendiente
      case "cancelada":
      case "cancelled":
        return styles.estadoCancelada
      case "completada":
      case "completed":
        return styles.estadoCompletada
      default:
        return ""
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "confirmed":
        return "Confirmada"
      case "pending":
      case "pending_payment":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      case "completed":
        return "Completada"
      default:
        return estado
    }
  }

  const canCancelBooking = (booking: Booking) => {
    const estado = booking.estado.toLowerCase()
    return (
      estado === "confirmada" ||
      estado === "confirmed" ||
      estado === "pendiente" ||
      estado === "pending" ||
      estado === "pending_payment"
    )
  }

  if (isLoading) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div className={styles.loadingContainer}>
            <p>Cargando...</p>
          </div>
        </MainContent>
      </MainBody>
    )
  }

  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <div className={styles.reservasContainer}>
          <h1 className={styles.title}>Mis Reservas</h1>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Cargando reservas...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={loadBookings} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyMessage}>No tienes reservas todavía</p>
              <button onClick={() => router.push("/home")} className={styles.actionButton}>
                Hacer una reserva
              </button>
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <span className={clsx(styles.estado, getEstadoClass(booking.estado))}>
                      {getEstadoLabel(booking.estado)}
                    </span>
                    <span className={styles.bookingId}>#{booking.id.substring(0, 8)}</span>
                  </div>

                  <div className={styles.bookingDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Fecha:</span>
                      <span className={styles.detailValue}>{formatDate(booking.fecha)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Hora inicio:</span>
                      <span className={styles.detailValue}>{formatTime(booking.hora_inicio)}</span>
                    </div>
                    {booking.hora_fin && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Hora fin:</span>
                        <span className={styles.detailValue}>{formatTime(booking.hora_fin)}</span>
                      </div>
                    )}
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Precio:</span>
                      <span className={styles.detailValue}>{booking.precio_total || booking.price_paid || 0}€</span>
                    </div>
                    {booking.created_at && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Reservado el:</span>
                        <span className={styles.detailValue}>
                          {new Date(booking.created_at).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    )}
                  </div>

                  {canCancelBooking(booking) && (
                    <div className={styles.bookingActions}>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className={styles.cancelButton}
                      >
                        {cancellingId === booking.id ? "Cancelando..." : "Cancelar reserva"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.navigationButtons}>
            <button onClick={() => router.push("/home")} className={styles.backButton}>
              Volver al inicio
            </button>
          </div>
        </div>
      </MainContent>
      <div className={clsx(bodyStyles.footer)}>
        <MainFooter>
          <h1>Mis Reservas</h1>
          <div className={clsx(bodyStyles.footerButtons)}>
            <ProfileButton>
              <Imagen src={"/botones/reservas.svg"} alt={"home"} href={"/home"} />
            </ProfileButton>
            <ProfileButton>
              <Imagen src={"/botones/perfil.svg"} alt={"perfil"} href={"/perfil"} />
            </ProfileButton>
          </div>
        </MainFooter>
      </div>
    </MainBody>
  )
}

export default ReservasPage
