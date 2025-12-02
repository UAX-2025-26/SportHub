"use client";

import clsx from "clsx";
import styles from "./HomePage-Footer.module.css";
import React from "react";

interface HomePageFooterProps {
    children: React.ReactNode;
}

const HomePageFooter = ({ children }: HomePageFooterProps) => {
    return (
        <footer className={clsx(styles.footer)}>
            <div className={clsx(styles.inner)}>
                {children}
            </div>
        </footer>
    );
};

export default React.memo(HomePageFooter);
