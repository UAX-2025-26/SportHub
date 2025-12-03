'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5',
                    padding: '2rem',
                    borderRadius: '8px'
                }}>
                    <h1>Dashboard</h1>
                    <p>Bienvenido, {user?.email}!</p>
                    <div style={{ marginTop: '2rem' }}>
                        <h2>Información del Usuario</h2>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>ID:</strong> {user?.id}</p>
                        {user?.user_metadata?.nombre && (
                            <p><strong>Nombre:</strong> {user.user_metadata.nombre} {user.user_metadata.apellidos}</p>
                        )}
                        {user?.user_metadata?.telefono && (
                            <p><strong>Teléfono:</strong> {user.user_metadata.telefono}</p>
                        )}
                        {user?.user_metadata?.ciudad && (
                            <p><strong>Ciudad:</strong> {user.user_metadata.ciudad}</p>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}

