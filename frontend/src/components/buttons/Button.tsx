'use client'

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button: React.FC<ButtonProps> = ({ label, className, onClick, ...props }) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <button className={`${styles.button} ${className}`} onClick={handleClick} {...props}>
            <span className={styles.label}>{label}</span>
        </button>
    );
};

export default Button;
