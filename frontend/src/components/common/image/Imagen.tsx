'use client'

import React from 'react';
import styles from './Imagen.module.css';
import Link from "next/link";

type ImagenProps = {
    src: string;
    alt: string;
    href?: string;
};

const Imagen: React.FC<ImagenProps> = ({ src, alt, href }) => {
    const dynamicHref = href || `/centers/${alt.toLowerCase()}`;

    return (
        <div className={styles.imagenContainer}>
            <Link href={dynamicHref} className={styles.imagen}>
                <img src={src} alt={alt} className={styles.imagen} />
            </Link>
        </div>
    );
}

export default React.memo(Imagen);