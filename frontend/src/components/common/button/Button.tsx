import React from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

interface CustomProps {
    variant?: "primary" | "secondary" | "outline"; // Added "outline" as a valid variant
    size?: "small" | "medium" | "large"; // Button size options
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CustomProps {}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "small", className, children, ...props } :ButtonProps) => {
    return (
        <button
            className={clsx(styles.button, styles[variant], styles[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};
