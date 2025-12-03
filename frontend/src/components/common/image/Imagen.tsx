'use client'

import React from 'react';
import styles from './Imagen.module.css';
import Link from "next/link";

const Imagen: React.FC = () => {
    return (
        <div className={styles.imagenContainer}>
            <Link href="/frontend/public" className={styles.imagen}>
                <img src={"imagen1.svg"} alt="Imagen de desarrollo" className={styles.imagen} />
            </Link>
        </div>
    );
}

export default React.memo(Imagen);