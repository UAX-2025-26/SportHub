import { FunctionComponent } from 'react';
import styles from "@/components/homepage-layout/body/Homepage-Body.module.css";
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import Registro from "@/components/auth/form/register-form/Register";

const HomePage: FunctionComponent = () => {
    return (
        <HomepageBody
            bodyClassName={styles.homepageBody}
            titleClassName={styles.authTitle}>
            <div>
                <Registro />
            </div>
        </HomepageBody>
    );
};

export default HomePage;
