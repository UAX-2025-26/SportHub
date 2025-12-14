'use client';

import React from "react";
import clsx from "clsx";
import MainBody from "@/components/main-layout/body/MainBody";
import MainHeader from "@/components/main-layout/header/MainHeader";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import CarouselContent from "@/components/main-layout/content/CarouselContent";

const TestPage: React.FC = () => {
    return (
        <MainBody bodyClassName={clsx(bodyStyles.content)}>
            <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
            <CarouselContent bodyClassName={clsx(bodyStyles.body)}>
            </CarouselContent>
            <div className={clsx(bodyStyles.footer)}>
                <MainDownComponent>
                    <h1>Elige tu centro</h1>
                    <div className={clsx(bodyStyles.footerButtons)}>
                        <ProfileButton>SH</ProfileButton>
                        <ProfileButton></ProfileButton>
                    </div>
                </MainDownComponent>
            </div>

        </MainBody>
    );
};

export default TestPage;
