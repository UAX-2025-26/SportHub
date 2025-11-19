// pages/RegistroForm.tsx (o donde lo necesites)
"use client";

import React, { useState } from "react";
import Button from "@/components/desarrollo/FormButton";
import Link from "@/components/desarrollo/Link";
import Input from "@/components/desarrollo/Input";
import FormContainer from "@/components/desarrollo/FormContainer";
import styles from "./RegistroForm.module.css";

interface FormData {
    email: string;
    telefono: string;
    nombre: string;
    apellidos: string;
    ciudad: string;
    contraseña: string;
}

interface FormErrors {
    email?: string;
    telefono?: string;
    nombre?: string;
    apellidos?: string;
    ciudad?: string;
    contraseña?: string;
}

export default function RegistroForm() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        telefono: "",
        nombre: "",
        apellidos: "",
        ciudad: "",
        contraseña: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Maneja cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpia el error del campo al escribir
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Validación básica
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = "El email es requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.telefono) {
            newErrors.telefono = "El teléfono es requerido";
        } else if (!/^\d{9,}$/.test(formData.telefono)) {
            newErrors.telefono = "Teléfono inválido (mínimo 9 dígitos)";
        }

        if (!formData.nombre) {
            newErrors.nombre = "El nombre es requerido";
        }

        if (!formData.apellidos) {
            newErrors.apellidos = "Los apellidos son requeridos";
        }

        if (!formData.ciudad) {
            newErrors.ciudad = "La ciudad es requerida";
        }

        if (!formData.contraseña) {
            newErrors.contraseña = "La contraseña es requerida";
        } else if (formData.contraseña.length < 6) {
            newErrors.contraseña = "Mínimo 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Maneja el submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            // Aquí iría tu lógica de registro (API call)
            console.log("Datos del formulario:", formData);

            // Simula una llamada API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            alert("¡Registro exitoso!");
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Error al registrar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // Contenido de los inputs (grid 2 columnas)
    const inputContent = (
        <>
            <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />
            <Input
                label="Telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                error={errors.telefono}
            />
            <Input
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
            />
            <Input
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={errors.apellidos}
            />
            <Input
                label="Ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                error={errors.ciudad}
            />
            <Input
                label="Contraseña"
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                error={errors.contraseña}
            />
        </>
    );

    // Contenido de botones y links
    const buttonContent = (
        <div className={styles.actionSection}>
            <Button
                type="submit" // ⬅️ Cambio importante
                variant="primary"
                loading={loading}
            >
                Registrarse
            </Button>
            <Link variant="muted" href="/login">
                Click to login
            </Link>
        </div>
    );


    return (
        <div className={styles.pageContainer}>
            <FormContainer
                title="Registro"
                inputContent={inputContent}
                buttonContent={buttonContent}
                onSubmit={handleSubmit} // ⬅️ Pasa el handler directamente
            />

        </div>
    );
}
