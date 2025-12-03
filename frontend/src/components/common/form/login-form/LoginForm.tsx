// pages/RegistroForm.tsx (o donde lo necesites)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button/form-button/FormButton";
import Link from "@/components/common/link/Link";
import Input from "@/components/common/input/Input";
import FormContainer from "@/components/common/form/FormContainer";
import styles from "./LoginForm.module.css";
import { useAuth } from "@/lib/auth";

interface FormData {
    email: string;
    contraseña: string;
}

interface FormErrors {
    email?: string;
    contraseña?: string;
}

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading: authLoading } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: "",
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
            const result = await login(formData.email, formData.contraseña);

            if (!result.success) {
                setApiError(result.error || "Error al iniciar sesión");
                return;
            }

            // Redirigir a la página principal o home
            router.push('/home');
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setApiError("Error al iniciar sesión. Por favor, intenta de nuevo.");
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
                {isFormLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <Link variant="muted" href="/register">
                ¿No tienes cuenta? Regístrate aquí
            </Link>
        </div>
    );


    return (
        <div>
            <FormContainer
                title="Inicio de sesión"
                inputContent={inputContent}
                buttonContent={buttonContent}
                onSubmit={handleSubmit}
                inputSectionClassName={styles.inputSection} // Añadido para estilos específicos
            />

        </div>
    );
}
