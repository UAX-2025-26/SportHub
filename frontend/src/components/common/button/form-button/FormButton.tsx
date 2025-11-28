import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from '@/components/common/button/Button';
import styles from './FormButton.module.css';

const FormButton = ({ className, children, ...props }: ButtonProps) => {
    return (
        <Button
            className={clsx(styles.formButton, className)}
            {...props}
        >
            {children}
        </Button>
    );
}

export default React.memo(FormButton);