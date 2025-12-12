'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { adminService } from '@/lib/api';
import CreateCenterForm from '@/components/admin/forms/CreateCenterForm';

interface CenterData {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  horario_apertura: string;
  horario_cierre: string;
}

interface FacilityData {
  id: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  precio_hora: number;
  activo: boolean;
}

const CenterAdminPanel: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [center, setCenter] = useState<CenterData | null>(null);
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateCenter, setShowCreateCenter] = useState(false);

  useEffect(() => {
    loadCenterData();
  }, [token]);

  const loadCenterData = async () => {
    if (!token) {
      console.log('[CENTER ADMIN] Token no disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[CENTER ADMIN] Iniciando carga de datos del centro...');
      console.log('[CENTER ADMIN] Token disponible:', token.substring(0, 20) + '...');

      const { data, error, status } = await adminService.getMyCenterData(token);

      console.log('[CENTER ADMIN] Respuesta del servidor:', status);

      if (status === 400) {
        console.log('[CENTER ADMIN] Usuario no tiene centro asignado');
        setShowCreateCenter(true);
        setCenter(null);
        setFacilities([]);
        setError('');
        setLoading(false);
        return;
      }

      if (error || status >= 400) {
        console.error('[CENTER ADMIN] Error al cargar datos:', error);
        setError('Error al cargar datos del centro: ' + (error || 'Unknown error'));
        setShowCreateCenter(false);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('[CENTER ADMIN] Datos cargados exitosamente:', data);
        setCenter(data.center);
        setFacilities(data.facilities || []);
        setShowCreateCenter(false);
        setError('');
      }
      setLoading(false);
    } catch (err) {
      console.error('[CENTER ADMIN] Error inesperado:', err);
      setError('Error al cargar los datos del centro');
      setShowCreateCenter(false);
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '600px',
    minWidth: '500px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0',
  };

  const sectionStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '25px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  };

  const headingStyle: React.CSSProperties = {
    margin: '0 0 1.5rem 0',
    color: '#636366',
    fontSize: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: 400,
  };

  const centerInfoStyle: React.CSSProperties = {
    background: '#f8fafc',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid #d1d1d6',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    background: '#34beed',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(52, 190, 237, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  if (loading) {
    return <div style={containerStyle}><p>Cargando...</p></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '1rem 1.5rem',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '15px',
          borderLeft: '4px solid #ee5a52',
          fontWeight: 500,
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!center && showCreateCenter) {
    return <CreateCenterForm onSuccess={() => {
      console.log('[CENTER ADMIN] Centro creado, recargando datos...');
      setShowCreateCenter(false);
      loadCenterData();
    }} />;
  }

  if (!center) {
    return <div style={containerStyle}><p>No tienes un centro asignado</p></div>;
  }

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Mi Centro: {center.nombre}</h2>

        <div style={centerInfoStyle}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#636366', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Ubicación
            </label>
            <p style={{ margin: 0, color: '#1f2933', fontSize: '1rem' }}>{center.direccion}, {center.ciudad}</p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#636366', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Horario
            </label>
            <p style={{ margin: 0, color: '#1f2933', fontSize: '1rem' }}>{center.horario_apertura} - {center.horario_cierre}</p>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => router.push(`/admin/${center.id}`)}
              style={buttonStyle}
            >
              Editar Centro
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ ...headingStyle, fontSize: '1.5rem', margin: '0 0 1rem 0' }}>
            Instalaciones ({facilities.length})
          </h3>

          {facilities.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: '15px',
              border: '2px dashed #d1d1d6',
            }}>
              <p style={{ color: '#636366', margin: '0 0 1rem 0', fontWeight: 500 }}>
                No tienes instalaciones aún
              </p>
              <button
                onClick={() => router.push(`/admin/${center.id}/facilities/new`)}
                style={{ ...buttonStyle, marginTop: '1rem', width: '100%', display: 'block' }}
              >
                + Crear Primera Instalación
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {facilities.map(facility => (
                <div
                  key={facility.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #d1d1d6',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#636366', fontSize: '1.2rem' }}>
                      {facility.nombre}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', color: '#999', fontSize: '0.9rem', fontWeight: 500 }}>
                      {facility.tipo}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#1f2933',
                        padding: '0.4rem 0.8rem',
                        background: 'white',
                        borderRadius: '15px',
                        border: '1px solid #e0e0e0',
                      }}>
                        Capacidad: {facility.capacidad}
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#1f2933',
                        padding: '0.4rem 0.8rem',
                        background: 'white',
                        borderRadius: '15px',
                        border: '1px solid #e0e0e0',
                      }}>
                        ${facility.precio_hora}/h
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '15px',
                        ...(facility.activo ? {
                          background: '#4caf50',
                          color: 'white',
                          border: '1px solid #4caf50',
                        } : {
                          background: '#f44336',
                          color: 'white',
                          border: '1px solid #f44336',
                        }),
                      }}>
                        {facility.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/${center.id}/facilities/${facility.id}`)}
                    style={{ ...buttonStyle, padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Editar
                  </button>
                </div>
              ))}
              <button
                onClick={() => router.push(`/admin/${center.id}/facilities/new`)}
                style={{ ...buttonStyle, marginTop: '1rem', width: '100%', display: 'block' }}
              >
                + Crear Instalación
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #d1d1d6' }}>
          <h3 style={{ ...headingStyle, fontSize: '1.5rem', margin: '0 0 1rem 0' }}>
            Estadísticas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #34beed 0%, #0473a9 100%)',
              color: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(52, 190, 237, 0.3)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                Instalaciones
              </p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                {facilities.length}
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #34beed 0%, #0473a9 100%)',
              color: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(52, 190, 237, 0.3)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                Reservas
              </p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>0</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #34beed 0%, #0473a9 100%)',
              color: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(52, 190, 237, 0.3)',
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                Ingresos
              </p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>$0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterAdminPanel;

