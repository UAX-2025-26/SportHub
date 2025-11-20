"use client";

import React from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string; // Text to display on the button
    variant?: "primary" | "secondary" | "outline"; // Added "outline" as a valid variant
    size?: "small" | "medium" | "large"; // Button size options
    fullWidth?: boolean; // Added fullWidth prop to allow full-width buttons
}

const Button: React.FC<ButtonProps> = ({
    label,
    variant = "primary", // Default variant
    size = "medium", // Default size
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(styles.button, styles[variant], styles[size], className)}
            {...props}
        >
            {label}
        </button>
    );
};

export default React.memo(Button); // Memoized for performance
