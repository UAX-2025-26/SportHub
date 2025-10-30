@startuml
' Diagrama de Secuencia - Realizar una Reserva (Corregido)

title Secuencia Detallada para Crear una Reserva

actor Jugador
participant "Frontend (React)" as Frontend
participant "Backend (Node/Express)" as Backend
database "BBDD (Supabase/Postgres)" as DB

autonumber

Jugador -> Frontend: Selecciona instalación y horario, y pulsa "Reservar"
activate Frontend

Frontend -> Backend: POST /api/reservas\n(Authorization: Bearer <JWT>, {facilityId, date, time})
activate Backend

Backend -> Backend: **Validar firma y expiración del JWT**
note right: Asegura que el usuario está autenticado y tiene permisos.

Backend -> DB: **INSERT INTO bookings (facility_id, user_id, fecha, hora_inicio) VALUES (...)**
activate DB
note right: La tabla 'bookings' tiene una restricción UNIQUE\n a nivel de BBDD para prevenir dobles reservas[cite: 183].

alt Transacción Exitosa
    DB --> Backend: Confirmación de Inserción (OK)
    Backend --> Frontend: **HTTP 201 Created**\n{ "status": "Reserva confirmada" }
    Frontend -> Jugador: Muestra mensaje de éxito en la UI
else Conflicto de Concurrencia (Doble Reserva)
    DB --> Backend: **Error de Violación de Constraint UNIQUE**
    deactivate DB
    Backend --> Frontend: **HTTP 409 Conflict**\n{ "error": "Este horario ya no está disponible" }
    Frontend -> Jugador: Muestra mensaje de error en la UI
end

deactivate Backend
deactivate Frontend

@enduml
