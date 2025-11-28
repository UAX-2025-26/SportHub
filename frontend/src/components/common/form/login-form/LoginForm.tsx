// pages/RegistroForm.tsx (o donde lo necesites)
"use client";

import React, { useState } from "react";
import Button from "@/components/common/button/form-button/FormButton";
import Link from "@/components/common/link/Link";
import Input from "@/components/common/input/Input";
import FormContainer from "@/components/common/form/FormContainer";
import styles from "./LoginForm.module.css";

interface FormData {
    email: string;
    contraseña: string;
}

interface FormErrors {
    email?: string;
    contraseña?: string;
}

export default function LoginForm() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
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

        try {
            // Aquí iría tu lógica de registro (API call)
            console.log("Datos del formulario:", formData);

            // Simula una llamada API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            alert("¡Inicio de sesión exitoso!");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

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
                label="Contraseña"
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                error={errors.contraseña}
            />
        </>
    );

    const buttonContent = (
        <div className={styles.actionSection}>
            <Button type="submit">
                Registrarse
            </Button>
            <Link variant="muted" href="/register">
                Click to register
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
