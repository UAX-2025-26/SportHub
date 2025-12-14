"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/components/common/form/FormContainer";
import FormButton from "@/components/common/button/form-button/FormButton";
import { facilitiesService } from "@/lib/api/facilities.service";
import { useAuth } from "@/lib/auth";
import styles from "./CreateFacilityForm.module.css";

interface FormData {
  nombre: string;
  tipo: string;
  capacidad: string;
  precio_hora: string;
}

interface FormErrors {
  nombre?: string;
  tipo?: string;
  capacidad?: string;
  precio_hora?: string;
}

interface EditFacilityFormProps {
  centerId: string;
  facilityId: string;
}

const EditFacilityForm: React.FC<EditFacilityFormProps> = ({ centerId, facilityId }) => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    tipo: "",
    capacidad: "",
    precio_hora: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Cargar datos de la instalación
  useEffect(() => {
    const loadFacility = async () => {
      // Esperar a que termine de cargar el auth context
      if (authLoading) {
        console.log('[EDIT FACILITY] Waiting for auth context...');
        return;
      }

      if (!token) {
        console.log('[EDIT FACILITY] No token provided');
        setApiError('No tienes permiso para editar esta instalación');
        setLoadingData(false);
        return;
      }

      if (!facilityId) {
        console.log('[EDIT FACILITY] No facility ID provided');
        setApiError('ID de instalación no proporcionado');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        console.log('[EDIT FACILITY] Loading facility with ID:', facilityId);
        console.log('[EDIT FACILITY] Token:', token ? 'Present' : 'Missing');

        const result = await facilitiesService.getFacilityById(facilityId);

        if (result.data) {
          console.log('[EDIT FACILITY] Facility data loaded:', result.data);
          setFormData({
            nombre: result.data.nombre || "",
            tipo: result.data.tipo || "",
            capacidad: result.data.capacidad?.toString() || "",
            precio_hora: result.data.precio_hora?.toString() || "",
          });
        } else {
          console.error('[EDIT FACILITY] Error loading facility:', result.error);
          setApiError(result.error || "Error al cargar la instalación");
        }
      } catch (error) {
        console.error('[EDIT FACILITY] Unexpected error loading facility:', error);
        setApiError("Error al cargar la instalación");
      } finally {
        setLoadingData(false);
      }
    };

    loadFacility();
  }, [token, facilityId, authLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la instalación es requerido";
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = "El tipo de instalación es requerido";
    }

    if (formData.capacidad && isNaN(parseInt(formData.capacidad))) {
      newErrors.capacidad = "La capacidad debe ser un número";
    }

    if (!formData.precio_hora) {
      newErrors.precio_hora = "El precio por hora es requerido";
    } else if (isNaN(parseFloat(formData.precio_hora))) {
      newErrors.precio_hora = "El precio debe ser un número";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!token) {
      setApiError("No tienes permiso para editar instalaciones");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const dataToSend = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : undefined,
        precio_hora: parseFloat(formData.precio_hora),
        center_id: centerId,
      };

      const result = await facilitiesService.updateFacility(facilityId, dataToSend, token);

      if (result.data) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin-center/${centerId}`);
        }, 2000);
      } else {
        setApiError(result.error || "Error al actualizar la instalación");
      }
    } catch (error) {
      console.error("Error updating facility:", error);
      setApiError("Error al actualizar la instalación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className={styles.formContainer}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando datos de la instalación...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.formContainer}>
        <div style={{
          padding: "1rem",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "4px",
          fontSize: "0.875rem",
          borderLeft: "4px solid #c62828",
        }}>
          No tienes permiso para editar esta instalación. Por favor, inicia sesión.
        </div>
      </div>
    );
  }

  const inputContent = (
    <>
      {apiError && (
        <div style={{
          padding: "0.75rem 1rem",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "4px",
          fontSize: "0.875rem",
          borderLeft: "4px solid #c62828",
        }}>
          {apiError}
        </div>
      )}
      {success && (
        <div style={{
          padding: "0.75rem 1rem",
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          borderRadius: "4px",
          fontSize: "0.875rem",
          borderLeft: "4px solid #2e7d32",
        }}>
          ¡Instalación actualizada exitosamente! Redirigiendo...
        </div>
      )}

      <label className={styles.label}>
        <span>Nombre de la Instalación *</span>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Cancha Principal"
          disabled={loading}
        />
        {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
      </label>

      <label className={styles.label}>
        <span>Tipo de Instalación *</span>
        <input
          type="text"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Cancha de Tenis"
          disabled={loading}
        />
        {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
      </label>

      <label className={styles.label}>
        <span>Capacidad (personas)</span>
        <input
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: 20"
          disabled={loading}
        />
        {errors.capacidad && <span className={styles.error}>{errors.capacidad}</span>}
      </label>

      <label className={styles.label}>
        <span>Precio por Hora ($) *</span>
        <input
          type="number"
          step="0.01"
          name="precio_hora"
          value={formData.precio_hora}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: 25.00"
          disabled={loading}
        />
        {errors.precio_hora && <span className={styles.error}>{errors.precio_hora}</span>}
      </label>
    </>
  );

  const buttonContent = (
    <FormButton disabled={loading}>
      {loading ? "Actualizando..." : "Actualizar Instalación"}
    </FormButton>
  );

  return (
    <FormContainer
      title="Editar Instalación"
      inputContent={inputContent}
      buttonContent={buttonContent}
      onSubmit={handleSubmit}
      className={styles.formContainer}
    />
  );
};

export default EditFacilityForm;

