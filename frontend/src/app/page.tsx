import { FunctionComponent } from 'react';
import Homepage from "@/components/homepage-layout/Homepage";
import styles from "@/components/homepage-layout/body/Homepage-Body.module.css";

const HomePage: FunctionComponent = () => {
    return (
        <Homepage
            bodyClassName={styles.homepageBody}
            titleClassName={styles.title}
        />
    );
};

export default HomePage;
