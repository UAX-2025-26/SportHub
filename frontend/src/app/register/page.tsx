import { FunctionComponent } from 'react';
import styles from "@/components/homepage-layout/body/Homepage-Body.module.css";
import HomepageBody from "@/components/homepage-layout/body/Homepage-Body";
import RegistroForm from "@/components/common/form/register-form/RegistroForm";

const HomePage: FunctionComponent = () => {
    return (
        <HomepageBody
            bodyClassName={styles.homepageBody}
            titleClassName={styles.authTitle}>
            <div>
                <RegistroForm/>
            </div>
        </HomepageBody>
    );
};

export default HomePage;
