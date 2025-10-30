@startuml
' Diagrama de Casos de Uso para SportHub

left to right direction

actor "Jugador" as Player
actor "Admin de Centro" as CenterAdmin
actor "Admin Global" as GlobalAdmin

rectangle "SportHub" {
  usecase "Gestionar Perfil Propio" as ManageProfile
  usecase "Buscar Centros y Consultar Disponibilidad" as Browse
  usecase "Realizar Reserva" as CreateBooking
  usecase "Cancelar Reserva" as CancelBooking
  usecase "Ver Mis Reservas" as ViewBookings

  usecase "Gestionar Instalaciones" as ManageFacilities
  usecase "Gestionar Horarios y Bloqueos" as ManageSchedules
  usecase "Ver Todas las Reservas del Centro" as ViewCenterBookings
  usecase "Gestionar Personal del Centro" as ManageStaff

  usecase "Gestionar Usuarios y Roles" as ManageUsers
  usecase "Gestionar Promociones Globales" as ManagePromotions
  usecase "Ver Estadísticas Globales" as ViewStats

  Player -- ManageProfile
  Player -- Browse
  Player -- CreateBooking
  Player -- CancelBooking
  Player -- ViewBookings

  CenterAdmin -- ManageFacilities
  CenterAdmin -- ManageSchedules
  CenterAdmin -- ViewCenterBookings
  CenterAdmin -- ManageStaff

  GlobalAdmin -- ManageUsers
  GlobalAdmin -- ManagePromotions
  GlobalAdmin -- ViewStats
}

@enduml
