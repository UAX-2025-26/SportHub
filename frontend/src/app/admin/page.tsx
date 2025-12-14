'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import CentersList from '@/components/admin/CentersList';

const AdminCentersPage: React.FC = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useRoleProtection(['admin']);

  // Mientras carga, mostrar loading
  if (isLoading) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Verificando permisos...</p>
          </div>
        </MainContent>
      </MainBody>
    );
  }

  // Si no está autenticado o no tiene el rol correcto, mostrar null
  // (el hook ya se encarga de redirigir)
  if (!isAuthenticated || user?.rol !== 'admin') {
    return null;
  }

  // Usuario es admin, mostrar contenido
  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <CentersList />
      </MainContent>
      <div className={clsx(bodyStyles.footer)}>
        <MainDownComponent>
          <h1>Administración de Centros</h1>
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

export default AdminCentersPage;

