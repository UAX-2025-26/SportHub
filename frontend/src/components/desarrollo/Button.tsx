import React from 'react';
import clsx from 'clsx'; // 1. Importamos la librería
import styles from './Button.module.css';

interface CustomProps {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean; // 2. Nueva prop opcional (booleana)
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CustomProps {}

export const Button = ({
                           variant = 'primary',
                           fullWidth,
                           className,
                           children,
                           ...props
                       }: ButtonProps) => {

    return (
        <button
            // 3. Uso de clsx
            className={clsx(
                // A. Clase base siempre presente
                styles.base,

                // B. Variante dinámica (styles.primary o styles.secondary)
                styles[variant],

                // C. Condicional: Si fullWidth es true, aplica styles.fullWidth
                {
                    [styles.fullWidth]: fullWidth,
                },

                // D. Clases externas (siempre al final para permitir sobrescritura)
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

