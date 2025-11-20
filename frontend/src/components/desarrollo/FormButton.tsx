// components/Button/Button.tsx
"use client";

import React from "react";
import clsx from "clsx";
import styles from "@/components/desarrollo/FormButton.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    fullWidth?: boolean;
    loading?: boolean;
}

const FormButton: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    fullWidth = false,
    loading = false,
    className,
    disabled,
    ...props
}) => {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                {
                    [styles.fullWidth]: fullWidth,
                    [styles.loading]: loading,
                },
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? "Cargando..." : children}
        </button>
    );
};

export default React.memo(FormButton);
