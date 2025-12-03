'use client';

import React from "react";
import clsx from "clsx";
import Carousel from "@/components/desarrollo/Carousel";
import styles from "./CarouselContent.module.css";

interface CarouselContentProps {
    bodyClassName?: string;
}

const CarouselContent: React.FC<CarouselContentProps> = ({ bodyClassName }) => {
    const images = [
        "/content.jpg",
        "/home-page.svg",
        "/content.jpg",
        "/home-page.svg",
    ];

    return (
        <div className={clsx(styles.container, bodyClassName)}>
            <Carousel images={images} />
        </div>
    );
};

export default CarouselContent;
