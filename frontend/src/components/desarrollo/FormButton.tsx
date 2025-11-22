// components/Button/Button.tsx
"use client";

import React from "react";
import clsx from "clsx";
import styles from "@/components/desarrollo/FormButton.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
}

const FormButton: React.FC<ButtonProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(
                styles.formButton,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default React.memo(FormButton);
