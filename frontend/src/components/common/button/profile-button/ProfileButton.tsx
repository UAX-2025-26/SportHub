import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from '@/components/common/button/Button';
import styles from './ProfileButton.module.css';

const ProfileButton = ({ className, children, ...props }: ButtonProps) => {
    return (
        <Button
            {...props}
            className={clsx(styles.profButton, className)}
        >
            {children}
        </Button>
    );
};

export default React.memo(ProfileButton);
