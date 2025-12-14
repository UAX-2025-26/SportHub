"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import HomePageFooter from "@/components/homepage-layout/footer/HomePage-Footer";
import AuthButton from "@/components/common/button/auth-button/AuthButton";

interface HomepageProps {
    bodyClassName?: string;
    titleClassName?: string;
}

const Homepage: React.FC<HomepageProps> = ({ bodyClassName, titleClassName }) => {
    const router = useRouter();

    const handleRegister = () => {
        router.push('/register');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className={styles.homePage}>
            <div className={styles.bodyContainer}>
                <HomepageBody
                    bodyClassName={bodyClassName}
                    titleClassName={titleClassName}
                />
            </div>
            <HomePageFooter>
                <AuthButton size="medium" onClick={handleRegister}>Register</AuthButton>
                <AuthButton size="medium" onClick={handleLogin}>Login</AuthButton>
            </HomePageFooter>
        </div>
    );
};

export default Homepage;
