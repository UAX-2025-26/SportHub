'use client'

import React, { useState } from 'react';
import FormContainer from "@/components/auth/form/FormContainer";
import Input from "@/components/auth/form/input/Input";
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
                <div className={styles["grid-item"]}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles["grid-item"]}>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className={styles["submit-button"]}>
                    Login
                </button>
            </form>
        </FormContainer>
    );
};

export default Login;
