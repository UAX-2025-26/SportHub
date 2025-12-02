import React from 'react';
import styles from './MainDownComponent.module.css';

interface Props {
    children?: React.ReactNode;
}

const MainDownComponent: React.FC<Props> = ({ children }) => {
    // 1. Define a unique ID for the gradient so the path can find it
    const gradientId = "customGradient";

    const topPathDefinition = `
        M 0 0 
        L 18 0          
        Q 20 0 21 5     
        L 29 35         
        Q 30 40 33 40   
        L 67 40         
        Q 70 40 71 35   
        L 79 5          
        Q 80 0 82 0     
        L 100 0
    `;

    return (
        <div className={styles.container}>
            <svg
                className={styles.bgSvg}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* 2. Define the Gradient Colors here */}
                <defs>
                    {/* x1/y1 to x2/y2 determines direction.
                        0,0 to 0,1 is Top-to-Bottom.
                        0,0 to 1,0 is Left-to-Right. */}
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="grey" />   {/* Start Color */}
                        <stop offset="100%" stopColor="white" /> {/* End Color */}
                    </linearGradient>
                </defs>

                {/* 3. Apply the gradient using url(#ID) */}
                <path
                    className={styles.shapeFill}
                    fill={`url(#${gradientId})`}
                    d={`${topPathDefinition} L 100 100 L 0 100 Z`}
                />

                {/* 4. Top Border (unchanged) */}
                <path
                    className={styles.topBorder}
                    d={topPathDefinition}
                />
            </svg>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

export default React.memo(MainDownComponent);