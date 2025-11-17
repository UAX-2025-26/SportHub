// Archivo: Input.tsx
import React from 'react';
import styles from './Input.module.css';

// 1. Definimos la interfaz de las Props
export interface InputProps {
    name: string; // Para el 'name' del input, vital para el formulario
    type: 'text' | 'email' | 'password' | 'tel'; // Tipos permitidos
    placeholder: string; // El texto a mostrar
    value: string; // El valor (para un componente controlado)
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // El manejador
}

// 2. Creamos el componente funcional
const Input: React.FC<InputProps> = ({
                                         name,
                                         type,
                                         placeholder,
                                         value,
                                         onChange,
                                     }) => {
    return (
        <input
            type={type}
            name={name}
            id={name} // Usamos name como id para la <label> si la hubiera
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={styles["custom-input"]} // Corrected className reference
            required
        />
    );
};

export default Input;