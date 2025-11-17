import React from 'react';
import styles from './HomePage.module.css';
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import HomePageFooter from "@/components/homepage-layout/footer/HomePage-Footer";
import {HomepageProps} from "@/components/homepage-layout/HomepageProps";

const Homepage: React.FC<HomepageProps> = ({ bodyClassName, titleClassName }) => {
    return (
        <div className={styles.homePage}>
            <div className={styles.bodyContainer}>
                <HomepageBody
                    bodyClassName={bodyClassName}
                    titleClassName={titleClassName}
                />
            </div>
            <HomePageFooter />
        </div>
    );
};

export default Homepage;
