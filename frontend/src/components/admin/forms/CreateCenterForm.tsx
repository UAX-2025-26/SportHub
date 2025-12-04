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

const CreateCenterForm: React.FC = () => {
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
  const [apiError, setApiError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Redirigir si no es admin
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores al escribir
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
      setApiError("No tienes permiso para crear centros");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await centersService.createCenter(formData, token);

      if (result.data) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          nombre: "",
          direccion: "",
          ciudad: "",
          horario_apertura: "",
          horario_cierre: "",
        });
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push("/admin/centers");
        }, 2000);
      } else {
        setApiError(result.error || "Error al crear el centro");
      }
    } catch (error) {
      console.error("Error creating center:", error);
      setApiError("Error al crear el centro. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
          ¡Centro creado exitosamente!
        </div>
      )}
      <label className={styles.label}>
        Nombre del Centro *
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Centro de Deportes Madrid"
          required
        />
        {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
      </label>

      <label className={styles.label}>
        Dirección *
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Calle Principal 123"
          required
        />
        {errors.direccion && <span className={styles.error}>{errors.direccion}</span>}
      </label>

      <label className={styles.label}>
        Ciudad *
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={styles.input}
          placeholder="Ej: Madrid"
          required
        />
        {errors.ciudad && <span className={styles.error}>{errors.ciudad}</span>}
      </label>

      <label className={styles.label}>
        Horario de Apertura
        <input
          type="time"
          name="horario_apertura"
          value={formData.horario_apertura}
          onChange={handleChange}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Horario de Cierre
        <input
          type="time"
          name="horario_cierre"
          value={formData.horario_cierre}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
    </>
  );

  const buttonContent = (
    <FormButton type="submit" disabled={loading || success}>
      {loading ? "Creando..." : success ? "¡Creado!" : "Crear Centro"}
    </FormButton>
  );

  return (
    <FormContainer
      title="Crear Nuevo Centro Deportivo"
      inputContent={inputContent}
      buttonContent={buttonContent}
      onSubmit={handleSubmit}
      className={styles.formContainer}
    />
  );
};

export default CreateCenterForm;

