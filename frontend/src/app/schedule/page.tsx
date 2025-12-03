'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import MainBody from '@/components/main-layout/body/MainBody';
import MainContent from '@/components/main-layout/content/MainContent';
import bodyStyles from '@/components/main-layout/body/MainBody.module.css';
import contentStyles from '@/components/main-layout/content/MainContent.module.css';
import styles from './schedule.module.css';
import MainHeader from "@/components/main-layout/header/MainHeader";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import ScheduleForm from "@/components/common/form/schedule-form/ScheduleForm";

const SchedulePage: React.FC = () => {
    return (
        <MainBody bodyClassName={clsx(bodyStyles.content)}>
            <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
            <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body, styles.body)}>
                <ScheduleForm />
            </MainContent>
            <div className={clsx(bodyStyles.footer)}>
                <MainDownComponent>
                    <h1>Elige tu horario</h1>
                    <div className={clsx(bodyStyles.footerButtons)}>
                        <ProfileButton>SH</ProfileButton>
                        <ProfileButton>
                            <Image src="/perfil.svg" alt="logo" width={60} height={60} />
                        </ProfileButton>
                    </div>
                </MainDownComponent>
            </div>

        </MainBody>
    );
};

export default SchedulePage;
