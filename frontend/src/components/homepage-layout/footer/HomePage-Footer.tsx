"use client";

import AuthButton from "@/components/buttons/auth-button/AuthButton";
import styles from "./HomePage-Footer.module.css";

const HomePageFooter = () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <AuthButton label="Register" />
                <AuthButton label="Login" />
            </div>
        </footer>
    );
}

export default HomePageFooter;