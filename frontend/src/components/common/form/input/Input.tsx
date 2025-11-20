// Archivo: Input.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

// 1. Definimos la interfaz de las Props
export interface InputProps {
    name: string; // Para el 'name' del input, vital para el formulario
    type: 'text' | 'email' | 'password' | 'tel'; // Tipos permitidos
    placeholder: string; // El texto a mostrar
    value: string; // El valor (para un componente controlado)
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // El manejador
    className?: string; // Added optional className for flexibility
}

// 2. Creamos el componente funcional
const Input: React.FC<InputProps> = ({
                                         name,
                                         type,
                                         placeholder,
                                         value,
                                         onChange,
                                         className,
                                     }) => {
    return (
        <input
            type={type}
            name={name}
            id={name} // Usamos name como id para la <label> si la hubiera
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={clsx(styles["custom-input"], className)} // Dynamic class names
            required
        />
    );
};

export default React.memo(Input); // Memoized for performance
