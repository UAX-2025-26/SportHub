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
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                    <Imagen />
                </div>
            </MainContent>
            <div className={clsx(bodyStyles.footer)}>
            <MainDownComponent>
                <h1>Elige tu deporte</h1>
                <div className={clsx(bodyStyles.footerButtons)}>
                    <ProfileButton>SH</ProfileButton>
                    <ProfileButton>
                        <img src={"/perfil.svg"} alt={"logo"}/>
                    </ProfileButton>
                </div>
            </MainDownComponent>
            </div>

        </MainBody>
    );
};

export default HomePage;
