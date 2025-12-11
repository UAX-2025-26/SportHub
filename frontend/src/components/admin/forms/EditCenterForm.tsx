"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "@/components/common/form/FormContainer";
import FormButton from "@/components/common/button/form-button/FormButton";
import { centersService } from "@/lib/api/centers.service";
import { useAuth } from "@/lib/auth";
import styles from "./CreateCenterForm.module.css";

interface FormData {
  nombre: string;
  direccion: string;
  ciudad: string;
  horario_apertura?: string;
  horario_cierre?: string;
}

interface FormErrors {
  nombre?: string;
  direccion?: string;
  ciudad?: string;
}

interface EditCenterFormProps {
  centerId: string;
}

const EditCenterForm: React.FC<EditCenterFormProps> = ({ centerId }) => {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    direccion: "",
    ciudad: "",
    horario_apertura: "",
    horario_cierre: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Cargar datos del centro
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }

    const loadCenter = async () => {
      if (!token || !centerId) return;

      try {
        setLoadingData(true);
        const result = await centersService.getCenterById(centerId);

        if (result.data) {
          setFormData({
            nombre: result.data.nombre || "",
            direccion: result.data.direccion || "",
            ciudad: result.data.ciudad || "",
            horario_apertura: result.data.horario_apertura || "",
            horario_cierre: result.data.horario_cierre || "",
          });
        } else {
          setApiError(result.error || "Error al cargar el centro");
        }
      } catch (error) {
        console.error("Error loading center:", error);
        setApiError("Error al cargar el centro");
      } finally {
        setLoadingData(false);
      }
    };

    loadCenter();
  }, [isAuthenticated, router, token, centerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      newErrors.nombre = "El nombre del centro es requerido";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es requerida";
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
      setApiError("No tienes permiso para editar centros");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await centersService.updateCenter(centerId, formData, token);

      if (result.data) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setApiError(result.error || "Error al actualizar el centro");
      }
    } catch (error) {
      console.error("Error updating center:", error);
      setApiError("Error al actualizar el centro. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.formContainer}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando datos del centro...</p>
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
          ¡Centro actualizado exitosamente! Redirigiendo...
        </div>
      )}

      <label className={styles.label}>
        <span>Nombre del Centro *</span>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Centro Deportivo Municipal"
          disabled={loading}
        />
        {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
      </label>

      <label className={styles.label}>
        <span>Dirección *</span>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Calle Mayor 123"
          disabled={loading}
        />
        {errors.direccion && <span className={styles.error}>{errors.direccion}</span>}
      </label>

      <label className={styles.label}>
        <span>Ciudad *</span>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Madrid"
          disabled={loading}
        />
        {errors.ciudad && <span className={styles.error}>{errors.ciudad}</span>}
      </label>

      <label className={styles.label}>
        <span>Horario de Apertura</span>
        <input
          type="time"
          name="horario_apertura"
          value={formData.horario_apertura}
          onChange={handleChange}
          className={styles.input}
          disabled={loading}
        />
      </label>

      <label className={styles.label}>
        <span>Horario de Cierre</span>
        <input
          type="time"
          name="horario_cierre"
          value={formData.horario_cierre}
          onChange={handleChange}
          className={styles.input}
          disabled={loading}
        />
      </label>
    </>
  );

  const buttonContent = (
    <FormButton disabled={loading}>
      {loading ? "Actualizando..." : "Actualizar Centro"}
    </FormButton>
  );

  return (
    <FormContainer
      title="Editar Centro Deportivo"
      inputContent={inputContent}
      buttonContent={buttonContent}
      onSubmit={handleSubmit}
      className={styles.formContainer}
    />
  );
};

export default EditCenterForm;

