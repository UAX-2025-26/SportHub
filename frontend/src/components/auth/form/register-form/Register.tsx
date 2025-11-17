'use client'

import React, { useState } from 'react';

import FormContainer from "@/components/auth/form/FormContainer";
import Input from "@/components/auth/form/input/Input"; // Estilos específicos para el layout del formulario
import styles from './Register.module.css'; // Updated to use CSS modules

// Interfaz para el estado del formulario
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        // Aquí iría la llamada a la API para registrar al usuario
    };

    return (
        <FormContainer title="Registro">
            <form onSubmit={handleSubmit} className={styles["registro-form"]}> {/* Updated className */}
                {/* Usamos CSS Grid para el layout de 2 columnas */}

                {/* Fila 1 */}
                <div className={styles["grid-item"]}> {/* Updated className */}
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles["grid-item"]}> {/* Updated className */}
                    <Input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                </div>

                {/* Fila 2 */}
                <div className={styles["grid-item"]}> {/* Updated className */}
                    <Input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles["grid-item"]}> {/* Updated className */}
                    <Input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                    />
                </div>

                {/* Fila 3 (Ancho completo) */}
                <div className={styles["grid-item"] + ' ' + styles["span-two"]}> {/* Updated className */}
                    <Input
                        type="text"
                        name="ciudad"
                        placeholder="Ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                    />
                </div>

                {/* Fila 4 (Ancho completo) */}
                <div className={styles["grid-item"] + ' ' + styles["span-two"]}> {/* Updated className */}
                    <Input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Botón (Ancho completo) */}
                <button type="submit" className={styles["submit-button"] + ' ' + styles["span-two"]}> {/* Updated className */}
                    Registrarse
                </button>
            </form>

            <a href="/login" className={styles["login-link"]}> {/* Updated className */}
                Click to login
            </a>
        </FormContainer>
    );
};

export default Registro;