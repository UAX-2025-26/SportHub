'use client';

import React, { useState } from 'react';
import FormContainer from "@/components/common/form/FormContainer";
import Input from "@/components/common/input/Input";
import AuthButton from "@/components/common/button/auth-button/AuthButton";

interface RegistroState {
    email: string;
    telefono: string;
    nombre: string;
    apellidos: string;
    ciudad: string;
    password: string;
}

const Registro: React.FC = () => {
    const [formData, setFormData] = useState<RegistroState>({
        email: '',
        telefono: '',
        nombre: '',
        apellidos: '',
        ciudad: '',
        password: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegistroState, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <FormContainer
            title="Registro"
            inputContent={(
                (Object.keys(formData) as (keyof RegistroState)[]).map((key) => (
                    <Input
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize the label
                        name={key}
                        value={formData[key]}
                        error={errors[key]} // Ensure errors object is optional
                        onChange={handleChange}
                    />
                ))
            )}
            buttonContent={<AuthButton size="small" />}
        />
    );
};

export default React.memo(Registro);
