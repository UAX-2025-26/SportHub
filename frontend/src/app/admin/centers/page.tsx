'use client';

import React from 'react';
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
import CentersList from '@/components/admin/CentersList';

const AdminCentersPage: React.FC = () => {
  const router = useRouter();
  const { userRole, isAuthenticated, user, isLoading } = useAuth();
  const [showDebug, setShowDebug] = React.useState(false);

  // Log para depuración (solo en desarrollo)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔐 Auth Debug:', {
        isAuthenticated,
        userRole,
        user,
        isLoading
      });
    }
  }, [isAuthenticated, userRole, user, isLoading]);

  // Redirigir si no es admin
  React.useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return;

    if (!isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a /login');
      router.push('/login');
    } else if (userRole !== 'admin') {
      console.log('❌ Usuario no es admin (rol actual:', userRole, '), redirigiendo a /home');
      router.push('/home');
    }
  }, [isAuthenticated, userRole, router, isLoading]);

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

  // Si no es admin, mostrar mensaje antes de redirigir
  if (!isAuthenticated || userRole !== 'admin') {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            {!isAuthenticated ? (
              <p>Necesitas estar autenticado. Redirigiendo...</p>
            ) : (
              <div>
                <p>⚠️ Acceso denegado. Solo administradores pueden acceder.</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                  Tu rol actual: <strong>{userRole || 'No definido'}</strong>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                  Para convertirte en admin, ejecuta en tu BD:
                </p>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}>
                  {`UPDATE profiles SET rol = 'admin' WHERE email = '${user?.email}';`}
                </pre>
                <button
                  onClick={() => setShowDebug(!showDebug)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {showDebug ? 'Ocultar Debug' : 'Mostrar Debug Info'}
                </button>
                {showDebug && (
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    marginTop: '1rem',
                    textAlign: 'left'
                  }}>
                    {JSON.stringify({ user, userRole, isAuthenticated }, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </MainContent>
      </MainBody>
    );
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
              ←
            </ProfileButton>
          </div>
        </MainDownComponent>
      </div>
    </MainBody>
  );
};

export default AdminCentersPage;

