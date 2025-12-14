"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/components/common/form/FormContainer";
import FormButton from "@/components/common/button/form-button/FormButton";
import { bookingsService } from "@/lib/api/bookings.service";
import { facilitiesService, Facility } from "@/lib/api/facilities.service";
import { useAuth } from "@/lib/auth";
import styles from "./ScheduleForm.module.css";

interface ScheduleFormProps {
  sport?: string;
  centerId?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ sport, centerId }) => {
    const router = useRouter();
    const { isAuthenticated, token } = useAuth();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState(false);

    // Cargar instalaciones si es parte del flujo de booking
    useEffect(() => {
        if (centerId && sport) {
            const loadFacilities = async () => {
                try {
                    const response = await facilitiesService.getFacilitiesByCenter(centerId);
                    if (response.data) {
                        // Filtrar por deporte
                        const filtered = response.data.filter(f =>
                            f.tipo.toLowerCase().includes(sport.toLowerCase()) ||
                            f.nombre.toLowerCase().includes(sport.toLowerCase())
                        );
                        setFacilities(filtered);
                        if (filtered.length > 0) {
                            setSelectedFacility(filtered[0].id);
                        }
                    }
                } catch (err) {
                    console.error('Error loading facilities:', err);
                    setError('Error al cargar las instalaciones');
                }
            };
            loadFacilities();
        }
    }, [centerId, sport]);

    // Calcular precio estimado cuando cambian las horas o instalación
    useEffect(() => {
        if (time && endTime && selectedFacility) {
            const facility = facilities.find(f => f.id === selectedFacility);
            if (facility && facility.precio_hora) {
                // Calcular duración en horas
                const [startHour, startMinute] = time.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                let startTotalMinutes = startHour * 60 + startMinute;
                let endTotalMinutes = endHour * 60 + endMinute;

                if (endTotalMinutes <= startTotalMinutes) {
                    endTotalMinutes += 24 * 60; // Suma un día si la hora de fin es menor
                }

                const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
                const price = facility.precio_hora * durationHours;
                setEstimatedPrice(Math.max(0, price));
            }
        } else {
            setEstimatedPrice(0);
        }
    }, [time, endTime, selectedFacility, facilities]);

    // Validar autenticación en flujo de booking
    useEffect(() => {
        if (centerId && sport && !isAuthenticated) {
            router.push('/login');
        }
    }, [centerId, sport, isAuthenticated, router]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validación básica
        if (!date || !time || !endTime) {
            setError("Por favor completa todos los campos");
            return;
        }

        if (time >= endTime) {
            setError("La hora de fin debe ser posterior a la hora de inicio");
            return;
        }

        // Si es en contexto de booking
        if (centerId && sport && selectedFacility) {
            if (!isAuthenticated || !token) {
                setError("Debes estar autenticado para hacer una reserva");
                return;
            }

            setLoading(true);
            setError("");

            try {
                const bookingData = {
                    facility_id: selectedFacility,
                    fecha: date,
                    hora_inicio: time,
                    hora_fin: endTime,
                };

                const result = await bookingsService.createBooking(bookingData, token);

                if (result.data) {
                    setSuccess(true);
                    console.log("Reserva creada:", result.data);
                    // Redirigir a página de confirmación o mis reservas
                    setTimeout(() => {
                        router.push('/reservas');
                    }, 2000);
                } else {
                    setError(result.error || "Error al crear la reserva");
                }
            } catch (err) {
                console.error("Error creating booking:", err);
                setError("Error al crear la reserva. Por favor intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        } else {
            // Flujo simple sin booking
            console.log("Horario enviado:", { date, time, endTime });
            setSuccess(true);
            setDate("");
            setTime("");
            setEndTime("");
        }
    };

    const isBokingFlow = !!(centerId && sport && selectedFacility);

    const inputContent = (
        <>
            {error && (
                <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    borderLeft: '4px solid #c62828'
                }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    borderLeft: '4px solid #2e7d32'
                }}>
                    ¡Reserva creada exitosamente!
                </div>
            )}
            {isBokingFlow && facilities.length > 0 && (
                <label className={styles.label}>
                    Instalación
                    <select
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}
                        className={styles.input}
                        required
                    >
                        {facilities.map((facility) => (
                            <option key={facility.id} value={facility.id}>
                                {facility.nombre}
                                {facility.precio_hora && ` - $${facility.precio_hora}/hora`}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            <label className={styles.label}>
                Fecha
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={styles.input}
                    required
                />
            </label>
            <label className={styles.label}>
                Hora de inicio
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={styles.input}
                    required
                />
            </label>
            <label className={styles.label}>
                Hora de fin
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={styles.input}
                    required
                />
            </label>
            {isBokingFlow && estimatedPrice > 0 && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '4px',
                    border: '1px solid #90caf9',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#1565c0',
                        fontWeight: 600
                    }}>
                        <span>Precio estimado:</span>
                        <span style={{ fontSize: '1.2em' }}>${estimatedPrice.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </>
    );

    const buttonContent = (
        <FormButton
            type="submit"
            disabled={loading || success}
        >
            {loading ? "Guardando..." : success ? "¡Guardado!" : isBokingFlow ? "Confirmar reserva" : "Guardar horario"}
        </FormButton>
    );

    return (
        <FormContainer
            title={isBokingFlow ? "Elige tu horario de reserva" : "Selecciona tu horario"}
            inputContent={inputContent}
            buttonContent={buttonContent}
            onSubmit={handleSubmit}
            className={styles.formContainer}
        />
    );
};

export default ScheduleForm;
