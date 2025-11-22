import React from 'react';
import styles from './HomePage.module.css';
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import HomePageFooter from "@/components/homepage-layout/footer/HomePage-Footer";
import AuthButton from "@/components/common/button/auth-button/AuthButton";

interface HomepageProps {
    bodyClassName?: string;
    titleClassName?: string;
}

const Homepage: React.FC<HomepageProps> = ({ bodyClassName, titleClassName }) => {
    return (
        <div className={styles.homePage}>
            <div className={styles.bodyContainer}>
                <HomepageBody
                    bodyClassName={bodyClassName}
                    titleClassName={titleClassName}
                />
            </div>
            <HomePageFooter>
                <AuthButton size="medium"> Register </AuthButton>
                <AuthButton size="medium"> Login </AuthButton>
            </HomePageFooter>
        </div>
    );
};

export default Homepage;
