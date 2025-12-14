// components/Link/Link.tsx
"use client";

import React from "react";
import clsx from "clsx";
import styles from "./Link.module.css";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: "default" | "muted";
}

const Link: React.FC<LinkProps> = ({ children, variant = "default", className, ...props }) => {
    return (
        <a className={clsx(styles.link, styles[variant], className)} {...props} >
            {children}
        </a>
    );
};

export default React.memo(Link);
