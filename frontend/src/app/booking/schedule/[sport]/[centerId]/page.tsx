'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clsx from 'clsx';
import MainBody from '@/components/main-layout/body/MainBody';
import MainContent from '@/components/main-layout/content/MainContent';
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import ScheduleForm from "@/components/common/form/schedule-form/ScheduleForm";
import MainHeader from "@/components/main-layout/header/MainHeader";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import { useBookingContext } from '@/lib/contexts/BookingContext';
import { getSportDisplayName } from '@/lib/constants/sports';

const BookingSchedulePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sport = params?.sport as string;
  const centerId = params?.centerId as string;
  useBookingContext();

    // Validar que tengamos los parámetros necesarios
    useEffect(() => {
        if (!sport || !centerId) {
            router.push('/home');
        }
    }, [sport, centerId, router]);

    if (!sport || !centerId) {
        return null;
    }

    return (
        <MainBody bodyClassName={clsx(bodyStyles.content)}>
            <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
            <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
                <ScheduleForm sport={sport} centerId={centerId} />
            </MainContent>
            <div className={clsx(bodyStyles.footer)}>
                <MainDownComponent>
                    <h1>Reserva para {getSportDisplayName(sport)}</h1>
                    <div className={clsx(bodyStyles.footerButtons)}>
                        <ProfileButton onClick={() => router.back()}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>←</span>
                        </ProfileButton>
                    </div>
                </MainDownComponent>
            </div>
        </MainBody>
    );
};

export default BookingSchedulePage;

