@startuml
' Diagrama de Actividad - Realizar una Reserva (Corregido)

title Flujo para Realizar una Reserva

start
:El jugador se autentica en el sistema;
:Selecciona un centro deportivo y una instalación;
:Elige una fecha y hora deseadas;
:Sistema consulta la disponibilidad en tiempo real;
:El jugador selecciona un horario disponible;
:Confirma los detalles para crear la reserva;

partition "Proceso del Backend" {
  :Recibe la solicitud de reserva;
  :Verifica que el usuario tenga permisos;
  if (¿El horario sigue libre en la BBDD?) then ([sí, no hay conflicto])
    :Crea el registro de la reserva en la tabla 'bookings';
    note right
      La BBDD tiene un constraint
      'UNIQUE(facility_id, fecha, hora_inicio)'
      para garantizar que no haya dobles reservas[cite: 183].
    end note
    :Envía notificación in-app de confirmación;
    :Muestra mensaje de "Reserva Confirmada" al jugador;
  else ([no, el horario fue ocupado])
    :Rechaza la creación de la reserva;
    :Muestra mensaje de error "El horario ya no está disponible";
  endif
}

stop

@enduml
