import { FunctionComponent } from 'react';
import styles from "@/components/homepage-layout/body/Homepage-Body.module.css";
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import LoginForm from "@/components/common/form/login-form/LoginForm";

const HomePage: FunctionComponent = () => {
    return (
        <HomepageBody
            bodyClassName={styles.homepageBody}
            titleClassName={styles.authTitle}>
            <div>
                <LoginForm />
            </div>
        </HomepageBody>
    );
};

export default HomePage;
