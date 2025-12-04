import React, { FunctionComponent } from 'react';
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import clsx from "clsx";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import MainHeader from "@/components/main-layout/header/MainHeader";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import MainContent from "@/components/main-layout/content/MainContent";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import Imagen from "@/components/common/image/Imagen";
import MainBody from "@/components/main-layout/body/MainBody";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";


const HomePage: FunctionComponent = () => {
    return (
        <MainBody bodyClassName={clsx(bodyStyles.content)}>
            <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
            <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
                <div className={clsx(contentStyles.flexContainer)}>
                    <Imagen src={"/deportes/archery.jpg"} alt={"archery"} />
                    <Imagen src={"/deportes/basketball.jpg"} alt={"basketball"} />
                    <Imagen src={"/deportes/golf.jpg"} alt={"golf"} />
                    <Imagen src={"/deportes/volleyball.jpg"} alt={"volleyball"} />
                    <Imagen src={"/deportes/boxing.jpg"} alt={"boxing"} />
                    <Imagen src={"/deportes/rock-climbing.jpg"} alt={"rock-climbing"} />
                    <Imagen src={"/deportes/swimming.jpg"} alt={"swimming"} />
                    <Imagen src={"/deportes/trampolining.jpg"} alt={"trampolining"} />
                    <Imagen src={"/deportes/equitation.jpg"} alt={"equitation"} />
                    <Imagen src={"/deportes/bowling.jpg"} alt={"bowling"} />
                    <Imagen src={"/deportes/baseball.jpg"} alt={"baseball"} />
                    <Imagen src={"/deportes/tennis.jpg"} alt={"tennis"} />
                </div>
            </MainContent>
            <div className={clsx(bodyStyles.footer)}>
            <MainDownComponent>
                <h1>Elige tu deporte</h1>
                <div className={clsx(bodyStyles.footerButtons)}>
                    <ProfileButton>
                        <Imagen src={"/reservas.svg"} alt={"reservas"} href={"/reservas"}/>
                    </ProfileButton>
                    <ProfileButton>
                        <Imagen src={"/perfil.svg"} alt={"perfil"} href={"/perfil"}/>
                    </ProfileButton>
                </div>
            </MainDownComponent>
            </div>

        </MainBody>
    );
};

export default HomePage;
