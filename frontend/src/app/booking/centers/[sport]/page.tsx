'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clsx from 'clsx';
import MainBody from '@/components/main-layout/body/MainBody';
import MainContent from '@/components/main-layout/content/MainContent';
import MainHeader from "@/components/main-layout/header/MainHeader";
import MainDownComponent from "@/components/main-layout/footer/MainFooter";
import ProfileButton from "@/components/common/button/profile-button/ProfileButton";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import FormButton from "@/components/common/button/form-button/FormButton";
import { centersService, Center } from '@/lib/api/centers.service';
import { facilitiesService, Facility } from '@/lib/api/facilities.service';
import { useBookingContext } from '@/lib/contexts/BookingContext';
import { getSportDisplayName } from '@/lib/constants/sports';
import styles from './centers-carousel.module.css';
import Image from 'next/image';

interface CenterWithFacilities {
  center: Center;
  facilities: Facility[];
  image: string;
}

const CenterCarouselPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sport = params?.sport as string;
  const { setSport, setCenter, setFacility } = useBookingContext();

  const [centers, setCenters] = useState<CenterWithFacilities[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const response = await centersService.getCenters();

        if (!response.data) {
          setError('Error al cargar los centros');
          return;
        }

        // Para cada centro, obtener las instalaciones que coincidan con el deporte
        const centersWithFacilities = await Promise.all(
          response.data.map(async (center) => {
            const facilitiesResponse = await facilitiesService.getFacilitiesByCenter(center.id);
            const allFacilities = facilitiesResponse.data || [];
            // Filtrar por tipo de deporte
            const relevantFacilities = allFacilities.filter(f =>
              f.tipo.toLowerCase().includes(sport.toLowerCase()) ||
              f.nombre.toLowerCase().includes(sport.toLowerCase())
            );
            return {
              center,
              facilities: relevantFacilities,
              image: `/content.jpg`,
            };
          })
        );

        // Filtrar solo centros con instalaciones para el deporte
        const filtered = centersWithFacilities.filter(c => c.facilities.length > 0);

        if (filtered.length === 0) {
          setError(`No hay centros disponibles para ${getSportDisplayName(sport)}`);
        } else {
          setCenters(filtered);
          setSport(sport);
        }
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError('Error al cargar los centros');
      } finally {
        setLoading(false);
      }
    };

    if (sport) {
      fetchCenters();
    }
  }, [sport, setSport]);

  const handleSelectCenter = (centerData: CenterWithFacilities) => {
    setCenter(centerData.center);
    if (centerData.facilities.length > 0) {
      setFacility(centerData.facilities[0]);
    }
    router.push(`/booking/schedule/${sport}/${centerData.center.id}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + centers.length) % centers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % centers.length);
  };

  if (loading) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div className={styles.loadingContainer}>
            <p>Cargando centros disponibles...</p>
          </div>
        </MainContent>
      </MainBody>
    );
  }

  if (error) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <FormButton onClick={() => router.back()}>Volver</FormButton>
          </div>
        </MainContent>
      </MainBody>
    );
  }

  if (centers.length === 0) {
    return (
      <MainBody bodyClassName={clsx(bodyStyles.content)}>
        <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
        <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
          <div className={styles.errorContainer}>
            <p>No hay centros disponibles</p>
            <FormButton onClick={() => router.back()}>Volver</FormButton>
          </div>
        </MainContent>
      </MainBody>
    );
  }

  const currentCenter = centers[currentIndex];

  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <div className={styles.carouselContainer}>
          <h2>Selecciona un centro para {getSportDisplayName(sport)}</h2>

          <div className={styles.carouselWrapper}>
            <button
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="Centro anterior"
            >
              ‹
            </button>

            <div className={styles.centerCard}>
              <div className={styles.cardImage}>
                <Image
                  src={currentCenter.image}
                  alt={currentCenter.center.nombre}
                  width={300}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cardContent}>
                <h3>{currentCenter.center.nombre}</h3>
                <p className={styles.location}>
                  {currentCenter.center.ciudad && `${currentCenter.center.ciudad}`}
                  {currentCenter.center.direccion && ` - ${currentCenter.center.direccion}`}
                </p>
                <div className={styles.facilitiesInfo}>
                  <p className={styles.facilitiesCount}>
                    {currentCenter.facilities.length} instalación{currentCenter.facilities.length !== 1 ? 'es' : ''} disponible{currentCenter.facilities.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className={styles.buttonContainer}>
                  <FormButton
                    onClick={() => handleSelectCenter(currentCenter)}
                    type="button"
                  >
                    Seleccionar
                  </FormButton>
                </div>
              </div>
            </div>

            <button
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Centro siguiente"
            >
              ›
            </button>
          </div>

          <div className={styles.paginationDots}>
            {centers.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`Ir al centro ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </MainContent>

      <div className={clsx(bodyStyles.footer)}>
        <MainDownComponent>
          <h1>Centro {currentIndex + 1} de {centers.length}</h1>
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

export default CenterCarouselPage;

