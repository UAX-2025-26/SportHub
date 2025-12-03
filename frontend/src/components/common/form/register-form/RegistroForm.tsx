// pages/RegistroForm.tsx (o donde lo necesites)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button/form-button/FormButton";
import Link from "@/components/common/link/Link";
import Input from "@/components/common/input/Input";
import FormContainer from "@/components/common/form/FormContainer";
import styles from "./RegistroForm.module.css";
import { useAuth } from "@/lib/auth";

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
    const router = useRouter();
    const { register, isLoading: authLoading } = useAuth();
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
    const [apiError, setApiError] = useState<string>("");

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

        // Limpia el error de la API
        if (apiError) {
            setApiError("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setApiError("");

        try {
            const result = await register({
                email: formData.email,
                password: formData.contraseña,
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                telefono: formData.telefono,
                ciudad: formData.ciudad,
            });

            if (!result.success) {
                setApiError(result.error || "Error al registrar");
                return;
            }

            // Redirigir a la página principal o home
            router.push('/home');
        } catch (error) {
            console.error("Error al registrar:", error);
            setApiError("Error al registrar. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const isFormLoading = loading || authLoading;

    const inputContent = (
        <>
            {apiError && (
                <div className={styles.errorMessage}>
                    {apiError}
                </div>
            )}
            <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isFormLoading}
            />
            <Input
                label="Telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                error={errors.telefono}
                disabled={isFormLoading}
            />
            <Input
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                disabled={isFormLoading}
            />
            <Input
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={errors.apellidos}
                disabled={isFormLoading}
            />
            <Input
                label="Ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                error={errors.ciudad}
                disabled={isFormLoading}
            />
            <Input
                label="Contraseña"
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                error={errors.contraseña}
                disabled={isFormLoading}
            />
        </>
    );

    const buttonContent = (
        <div className={styles.actionSection}>
            <Button type="submit" disabled={isFormLoading}>
                {isFormLoading ? "Registrando..." : "Registrarse"}
            </Button>
            <Link variant="muted" href="/login">
                ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
        </div>
    );


    return (
        <div>
            <FormContainer
                title="Registro"
                inputContent={inputContent}
                buttonContent={buttonContent}
                onSubmit={handleSubmit}
                inputSectionClassName={styles.inputSection} // Añadido para estilos específicos
            />

        </div>
    );
}
