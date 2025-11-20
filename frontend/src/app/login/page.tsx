import { FunctionComponent } from 'react';
import styles from "@/components/homepage-layout/body/Homepage-Body.module.css";
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import Login from "@/components/common/form/login-form/Login";

const HomePage: FunctionComponent = () => {
    return (
        <HomepageBody
            bodyClassName={styles.homepageBody}
            titleClassName={styles.authTitle}>
            <div>
                <Login />
            </div>
        </HomepageBody>
    );
};

export default HomePage;
