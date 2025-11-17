'use client';

import React from 'react';
import styles from './AuthButton.module.css';
import Button from '../Button';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, ...props }) => {
    const handleRegisterClick = () => {
        console.log("Register button clicked");
    };

    const handleLoginClick = () => {
        console.log("Login button clicked");
    };

    const handleClick = label === "Register" ? handleRegisterClick : handleLoginClick;

    return (
        <Button className={`${styles.authButton}`} label={label} onClick={handleClick} {...props} />
    );
};

export default AuthButton;
