'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRoleProtection } from '@/lib/hooks/useRoleProtection';
import clsx from 'clsx';
import MainBody from '@/components/main-layout/body/MainBody';
import MainContent from '@/components/main-layout/content/MainContent';
import MainHeader from "@/components/main-layout/header/MainHeader";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import EditCenterForm from '@/components/admin/forms/EditCenterForm';

const EditCenterPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const centerId = params?.centerId as string;
  const { isLoading, isAuthenticated, user } = useRoleProtection(['center_admin']);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.rol !== 'center_admin') {
      router.push('/admin-center');
    }
  }, [isAuthenticated, user, router, isLoading]);

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

  if (!isAuthenticated || user?.rol !== 'center_admin') {
    return null;
  }

  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <EditCenterForm centerId={centerId} />
      </MainContent>
      <div className={clsx(bodyStyles.footer)}>
        <MainDownComponent>
          <h1>Editar Centro</h1>
          <div className={clsx(bodyStyles.footerButtons)}>
            <ProfileButton onClick={() => router.push('/admin-center')}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>←</span>
            </ProfileButton>
          </div>
        </MainDownComponent>
      </div>
    </MainBody>
  );
};

export default EditCenterPage;

