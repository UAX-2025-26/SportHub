"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

const CreateFacilityForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const centerId = params?.centerId as string;
  const { token } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    tipo: "",
    capacidad: "",
    precio_hora: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [success, setSuccess] = useState(false);

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
      setApiError("No tienes permiso para crear instalaciones");
      return;
    }

    if (!centerId) {
      setApiError("Centro no especificado");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : undefined,
        precio_hora: parseFloat(formData.precio_hora),
      };

      const result = await facilitiesService.createFacility(centerId, payload, token);

      if (result.data) {
        setSuccess(true);
        setFormData({
          nombre: "",
          tipo: "",
          capacidad: "",
          precio_hora: "",
        });
        setTimeout(() => {
          router.push(`/admin/${centerId}/facilities`);
        }, 2000);
      } else {
        setApiError(result.error || "Error al crear la instalación");
      }
    } catch (error) {
      console.error("Error creating facility:", error);
      setApiError("Error al crear la instalación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const facilityTypes = [
    "Archery Range",
    "Basketball Court",
    "Golf Course",
    "Volleyball Court",
    "Boxing Ring",
    "Rock Climbing Wall",
    "Swimming Pool",
    "Trampoline Park",
    "Equestrian Center",
    "Bowling Alley",
    "Baseball Field",
    "Tennis Court",
  ];

  const inputContent = (
    <>
      {apiError && (
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            fontSize: "0.875rem",
            borderLeft: "4px solid #c62828",
          }}
        >
          {apiError}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "4px",
            fontSize: "0.875rem",
            borderLeft: "4px solid #2e7d32",
          }}
        >
          ¡Instalación creada exitosamente!
        </div>
      )}
      <label className={styles.label}>
        Nombre de la Instalación *
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Pista de Tenis 1"
          required
        />
        {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
      </label>

      <label className={styles.label}>
        Tipo de Instalación *
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Selecciona un tipo</option>
          {facilityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
      </label>

      <label className={styles.label}>
        Capacidad (opcional)
        <input
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: 50"
          min="0"
        />
        {errors.capacidad && (
          <span className={styles.error}>{errors.capacidad}</span>
        )}
      </label>

      <label className={styles.label}>
        Precio por Hora ($) *
        <input
          type="number"
          name="precio_hora"
          value={formData.precio_hora}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: 50.00"
          min="0"
          step="0.01"
          required
        />
        {errors.precio_hora && (
          <span className={styles.error}>{errors.precio_hora}</span>
        )}
      </label>
    </>
  );

  const buttonContent = (
    <FormButton type="submit" disabled={loading || success}>
      {loading ? "Creando..." : success ? "¡Creada!" : "Crear Instalación"}
    </FormButton>
  );

  return (
    <FormContainer
      title="Crear Nueva Instalación"
      inputContent={inputContent}
      buttonContent={buttonContent}
      onSubmit={handleSubmit}
      className={styles.formContainer}
    />
  );
};

export default CreateFacilityForm;

