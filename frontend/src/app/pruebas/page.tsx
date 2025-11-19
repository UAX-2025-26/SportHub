'use client';

import React, { useState } from "react";
import FormContainer from "@/components/common/form/FormContainer";
import Input from "@/components/common/input/Input";
import AuthButton from "@/components/common/button/auth-button/AuthButton";
import RegistroForm from "@/components/desarrollo/RegistroForm";

const TestPage: React.FC = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });

    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });
    const [registerErrors, setRegisterErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });

    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
        setLoginErrors({ ...loginErrors, [name]: "" });
    };

    const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterData({ ...registerData, [name]: value });
        setRegisterErrors({ ...registerErrors, [name]: "" });
    };

    const handleLoginSubmit = () => {
        const newErrors = { email: "", password: "" };

        if (!loginData.email.includes("@")) {
            newErrors.email = "Invalid email address.";
        }
        if (loginData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (newErrors.email || newErrors.password) {
            setLoginErrors(newErrors);
        } else {
            console.log("Login submitted:", loginData);
        }
    };

    const handleRegisterSubmit = () => {
        const newErrors = { email: "", password: "", confirmPassword: "", username: "" };

        if (!registerData.email.includes("@")) {
            newErrors.email = "Invalid email address.";
        }
        if (registerData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!registerData.username.trim()) {
            newErrors.username = "Username is required.";
        }

        if (
            newErrors.email ||
            newErrors.password ||
            newErrors.confirmPassword ||
            newErrors.username
        ) {
            setRegisterErrors(newErrors);
        } else {
            console.log("Registration submitted:", registerData);
        }
    };

    return (
        <div>
            <h1>Test Page</h1>

            {/* Login Form */}
            <FormContainer
                title="Login Form"
                inputContent={
                    <>
                        <Input
                            label="Email"
                            name="email"
                            value={loginData.email}
                            error={loginErrors.email}
                            onChange={handleLoginChange}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={loginData.password}
                            error={loginErrors.password}
                            onChange={handleLoginChange}
                        />
                    </>
                }
                buttonContent={
                    <AuthButton label="Login" size="small" onClick={handleLoginSubmit} />
                }
            />

            {/* Registration Form */}
            <FormContainer
                title="Registration Form"
                inputContent={
                    <>
                        <Input
                            label="Email"
                            name="email"
                            value={registerData.email}
                            error={registerErrors.email}
                            onChange={handleRegisterChange}
                        />
                        <Input
                            label="Telefono"
                            name="telefono"
                            value={registerData.email}
                            error={registerErrors.email}
                            onChange={handleRegisterChange}
                        />
                        <Input
                            label="Nombre"
                            name="nombre"
                            value={registerData.username}
                            error={registerErrors.username}
                            onChange={handleRegisterChange}
                        /><Input
                            label="Apellido"
                            name="apellido"
                            value={registerData.username}
                            error={registerErrors.username}
                            onChange={handleRegisterChange}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={registerData.password}
                            error={registerErrors.password}
                            onChange={handleRegisterChange}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={registerData.confirmPassword}
                            error={registerErrors.confirmPassword}
                            onChange={handleRegisterChange}
                        />
                    </>
                }
                buttonContent={
                    <AuthButton label="Register" size="small" onClick={handleRegisterSubmit} />
                }
                className="multiple"
            />

            <RegistroForm />
        </div>
    );
};

export default TestPage;
