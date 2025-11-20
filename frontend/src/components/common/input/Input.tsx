"use client";

import React, { useState } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string; // Label is now required
    error?: string; // Optional error message
    helperText?: string; // Optional helper text below the input
}

const Input: React.FC<InputProps> = ({ label, error, helperText, className, value, onChange, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            setIsFocused(false);
        }
    };

    return (
        <div className={clsx(styles.inputContainer, className)}>
            <label
                className={clsx(styles.label, {
                    [styles.labelFloating]: isFocused || value,
                    [styles.errorLabel]: error,
                })}
            >
                {label}
            </label>
            <input
                className={clsx(styles.input, { [styles.error]: error })}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onChange={onChange}
                {...props}
            />
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default React.memo(Input);
