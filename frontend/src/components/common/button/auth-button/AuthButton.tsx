'use client';

import React from 'react';
import clsx from 'clsx';
import Button from '@/components/common/button/Button';
import styles from './AuthButton.module.css';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: 'primary' | 'secondary'; // Added variant for styling
    size?: 'small' | 'medium' | 'large'; // Added size for styling
}

const AuthButton: React.FC<AuthButtonProps> = ({
    label,
    variant = 'primary', // Default variant
    size = 'medium', // Default size
    className,
    ...props
}) => {
    return (
        <Button
            label={label}
            className={clsx(styles.authButton, styles[variant], styles[size], className)}
            {...props}
        />
    );
};

export default React.memo(AuthButton); // Memoized for performance
