import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from '@/components/common/button/Button';
import styles from './AuthButton.module.css';

const AuthButton = ({ className, children, ...props }: ButtonProps) => {
    return (
        <Button
            {...props}
            className={clsx(styles.authButton, className)}
        >
            {children}
        </Button>
    );
};

export default React.memo(AuthButton); // Memoized for performance
