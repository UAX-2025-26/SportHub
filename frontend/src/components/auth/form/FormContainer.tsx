// Archivo: FormContainer.tsx
import React from 'react';
import styles from './FormContainer.module.css'; // Updated to use CSS modules

// 1. Definimos las Props
interface FormContainerProps {
    title: string; // El título a mostrar en la barra gris
    children: React.ReactNode; // 'children' permite meter otros componentes dentro
}

// 2. Creamos el componente
const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
    return (
        <div className={styles["form-container-box"]}> {/* Updated className */}
            {/* Barra de Título */}
            <div className={styles["form-title-bar"]}> {/* Updated className */}
                <h2>{title}</h2>
            </div>

            {/* Contenido (aquí irá el formulario) */}
            <div className={styles["form-content"]}> {/* Updated className */}
                {children}
            </div>
        </div>
    );
};

export default FormContainer;