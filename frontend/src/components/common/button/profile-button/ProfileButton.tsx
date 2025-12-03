import React from 'react';
import clsx from 'clsx';
import { Button, ButtonProps } from '@/components/common/button/Button';
import styles from './ProfileButton.module.css';

const ProfileButton = ({ className, children, ...props }: ButtonProps) => {
    const gradientId = "profileButtonGradient";

    return (
        <div className={styles.container}>
            <svg
                className={styles.bgSvg}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="grey" />
                        <stop offset="100%" stopColor="white" />
                    </linearGradient>
                </defs>

                <circle
                    className={styles.shapeFill}
                    fill={`url(#${gradientId})`}
                    cx="50"
                    cy="50"
                    r="50"
                />

                <circle
                    className={styles.topBorder}
                    fill="none"
                    stroke="#34BEED"
                    strokeWidth="5"
                    cx="50"
                    cy="50"
                    r="47.5"
                />
            </svg>

            <Button
                {...props}
                className={clsx(styles.profButton, className)}
            >
                {children}
            </Button>
        </div>
    );
};

export default React.memo(ProfileButton);
