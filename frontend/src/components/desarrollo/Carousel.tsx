import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.css';

interface CarouselProps {
    images?: string[];
}

const defaultImages = [
    '/content.jpg'
];

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const sources = useMemo(() => (images && images.length > 0 ? images : defaultImages), [images]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = sources.length;

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    const handlePrev = () => setCurrentIndex((index) => (index - 1 + total) % total);
    const handleNext = () => setCurrentIndex((index) => (index + 1) % total);

    return (
        <div className={styles.carousel}>
            <button type="button" className={`${styles.arrow} ${styles.arrowLeft}`} onClick={handlePrev} aria-label="Imagen anterior">
                ‹
            </button>

            <div className={styles.viewport}>
                <div className={`${styles.imageWrapper} ${styles.sideImage}`}>
                    <Image src={sources[prevIndex]} alt={`Imagen ${prevIndex + 1}`} className={styles.image} width={160} height={160} sizes="160px" />
                </div>

                <div className={`${styles.imageWrapper} ${styles.activeImage}`}>
                    <Image src={sources[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className={styles.image} width={200} height={200} sizes="200px" priority />
                </div>

                <div className={`${styles.imageWrapper} ${styles.sideImage}`}>
                    <Image src={sources[nextIndex]} alt={`Imagen ${nextIndex + 1}`} className={styles.image} width={160} height={160} sizes="160px" />
                </div>
            </div>

            <button type="button" className={`${styles.arrow} ${styles.arrowRight}`} onClick={handleNext} aria-label="Imagen siguiente">
                ›
            </button>
        </div>
    );
};

export default Carousel;
