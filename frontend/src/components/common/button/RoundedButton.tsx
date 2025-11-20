"use client";

import React from "react";
import clsx from "clsx";
import styles from "./RoundedButton.module.css";

interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string; // Text to display on the button
    size?: "small" | "medium" | "large"; // Button size options
    color?: "blue" | "green" | "red"; // Color variants
}

const RoundedButton: React.FC<RoundedButtonProps> = ({
    label,
    size = "medium", // Default size
    color = "blue", // Default color
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(styles.roundedButton, styles[size], styles[color], className)}
            {...props}
        >
            {label}
        </button>
    );
};

export default React.memo(RoundedButton); // Memoized for performance
