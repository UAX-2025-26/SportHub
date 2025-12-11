'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import clsx from 'clsx';
import MainBody from '@/components/main-layout/body/MainBody';
import MainContent from '@/components/main-layout/content/MainContent';
import MainHeader from "@/components/main-layout/header/MainHeader";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import CenterAdminPanel from '@/components/admin/CenterAdminPanel';

const CenterAdminPage: React.FC = () => {
  const router = useRouter();
  const { userRole, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
    } else if (userRole !== 'center_admin') {
      router.push('/home');
    }
  }, [isAuthenticated, userRole, router, isLoading]);

  if (isLoading) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Cargando...</p>
          </div>
        </MainContent>
      </MainBody>
    );
  }

  if (!isAuthenticated || userRole !== 'center_admin') {
    return null;
  }

  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <CenterAdminPanel />
      </MainContent>
      <div className={clsx(bodyStyles.footer)}>
        <MainDownComponent>
          <h1>Panel Admin Centro</h1>
          <div className={clsx(bodyStyles.footerButtons)}>
            <ProfileButton onClick={() => router.push('/home')}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>←</span>
            </ProfileButton>
          </div>
        </MainDownComponent>
      </div>
    </MainBody>
  );
};

export default CenterAdminPage;

