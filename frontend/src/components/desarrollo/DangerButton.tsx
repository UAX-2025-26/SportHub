// DangerButton.tsx
import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from './Button'; // Importamos el base
import styles from './DangerButton.module.css'; // Importamos los estilos nuevos

// Extendemos la interfaz base
export const DangerButton = ({ className, children, ...props }: ButtonProps) => {
    return (
        <Button
            {...props}
            // Mezclamos la clase nueva (.danger) con las que vengan de fuera
            className={clsx(styles.danger, className)}
        >
            {children}
        </Button>
    );
};