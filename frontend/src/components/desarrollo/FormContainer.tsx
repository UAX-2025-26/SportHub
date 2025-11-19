// components/FormContainer/FormContainer.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './FormContainer.module.css';

interface FormContainerProps {
    title: string;
    inputContent: React.ReactNode;
    buttonContent: React.ReactNode;
    className?: string;
    titleClassName?: string;
    contentClassName?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
                                                         title,
                                                         inputContent,
                                                         buttonContent,
                                                         className,
                                                         titleClassName,
                                                         contentClassName,
                                                         onSubmit,
                                                     }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <section className={clsx(styles.container, className)}>
            <header className={clsx(styles.titleBar, titleClassName)}>
                <h2 className={styles.title}>{title}</h2>
            </header>
            <form
                className={clsx(styles.content, contentClassName)}
                onSubmit={handleSubmit}
            >
                <div className={styles.inputSection}>{inputContent}</div>
                <div className={styles.buttonSection}>{buttonContent}</div>
            </form>
        </section>
    );
};

export default React.memo(FormContainer);
