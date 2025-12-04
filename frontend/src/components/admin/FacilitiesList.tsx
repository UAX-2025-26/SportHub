"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { facilitiesService } from "@/lib/api/facilities.service";
import { useAuth } from "@/lib/auth";
import styles from "./FacilitiesList.module.css";

interface Facility {
  id: string;
  nombre: string;
  tipo: string;
  capacidad?: number;
  precio_hora?: number;
  activo?: boolean;
  created_at?: string;
}

interface FacilitiesListProps {
  centerId: string;
}

const FacilitiesList: React.FC<FacilitiesListProps> = ({ centerId }) => {
  const { token, isAuthenticated } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const loadFacilities = async () => {
      try {
        setLoading(true);
        const response = await facilitiesService.getFacilitiesByCenter(centerId);
        if (response.data) {
          setFacilities(response.data);
        } else {
          setError(response.error || "Error al cargar las instalaciones");
        }
      } catch (err) {
        console.error("Error loading facilities:", err);
        setError("Error al cargar las instalaciones");
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, [centerId, token, isAuthenticated]);

  if (loading) {
    return <div className={styles.container}><p>Cargando instalaciones...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Instalaciones</h2>
        <Link href={`/admin/centers/${centerId}/facilities/new`} className={styles.createButton}>
          + Crear Instalación
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay instalaciones registradas en este centro</p>
          <Link href={`/admin/centers/${centerId}/facilities/new`} className={styles.createButtonEmpty}>
            Crear primera instalación
          </Link>
        </div>
      ) : (
        <div className={styles.facilitiesTable}>
          <table>
            <thead className={styles.tableHead}>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Precio/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {facilities.map((facility) => (
                <tr key={facility.id}>
                  <td className={styles.boldText}>{facility.nombre}</td>
                  <td>{facility.tipo}</td>
                  <td>{facility.capacidad || "-"}</td>
                  <td>${facility.precio_hora || "0.00"}</td>
                  <td>
                    <span className={`${styles.status} ${facility.activo ? styles.active : styles.inactive}`}>
                      {facility.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacilitiesList;

