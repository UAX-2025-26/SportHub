'use client';

import React, { useState } from 'react';
import FormContainer from "@/components/common/form/FormContainer";
import Input from "@/components/common/form/input/Input";
import styles from "./Login.module.css";

interface LoginState {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginState>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Login data:', formData);
        // Add API call for login here
    };

    return (
        <FormContainer title="Login">
            <form onSubmit={handleSubmit} className={styles["login-form"]}>
                {Object.keys(formData).map((key) => (
                    <Input
                        key={key}
                        name={key}
                        type={key === 'password' ? 'password' : 'email'}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={formData[key as keyof LoginState]}
                        onChange={handleChange}
                    />
                ))}
                <button type="submit" className={styles["submit-button"]}>Login</button>
            </form>
        </FormContainer>
    );
};

export default React.memo(Login);
