// Archivo: FormContainer.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './FormContainer.module.css';

// Define the Props for the FormContainer
interface FormContainerProps {
    title: string; // Title to display in the header bar
    inputContent: React.ReactNode; // Inputs section
    buttonContent: React.ReactNode; // Button section
    className?: string; // Optional className for additional styling
    titleClassName?: string; // Optional className for the title bar
    contentClassName?: string; // Optional className for the content area
}

// Create the FormContainer component
const FormContainer: React.FC<FormContainerProps> = ({
    title,
    inputContent,
    buttonContent,
    className,
    titleClassName,
    contentClassName,
}) => {
    return (
        <section className={clsx(styles.container, className)}>
            <header className={clsx(styles.titleBar, titleClassName)}>
                <h2 className={clsx(styles.title)}>{title}</h2>
            </header>
            <main className={clsx(styles.content, contentClassName)}>
                <div className={clsx(styles.inputSection)}>{inputContent}</div>
                <div className={clsx(styles.buttonSection)}>{buttonContent}</div>
            </main>
        </section>
    );
};

export default React.memo(FormContainer);
