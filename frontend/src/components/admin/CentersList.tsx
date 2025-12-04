"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/lib/api/admin.service";
import { useAuth } from "@/lib/auth";
import styles from "./CentersList.module.css";

interface Center {
  id: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  created_at?: string;
}

const CentersList: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const loadCenters = async () => {
      try {
        setLoading(true);
        const response = await adminService.listCenters(token);
        if (response.data) {
          setCenters(response.data);
        } else {
          setError(response.error || "Error al cargar los centros");
        }
      } catch (err) {
        console.error("Error loading centers:", err);
        setError("Error al cargar los centros");
      } finally {
        setLoading(false);
      }
    };

    loadCenters();
  }, [token, isAuthenticated]);

  if (loading) {
    return <div className={styles.container}><p>Cargando centros...</p></div>;
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
        <h2>Centros Deportivos</h2>
        <Link href="/admin/centers/new" className={styles.createButton}>
          + Crear Centro
        </Link>
      </div>

      {centers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay centros registrados</p>
          <Link href="/admin/centers/new" className={styles.createButtonEmpty}>
            Crear primer centro
          </Link>
        </div>
      ) : (
        <div className={styles.centersTable}>
          <table>
            <thead className={styles.tableHead}>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Horario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {centers.map((center) => (
                <tr key={center.id}>
                  <td className={styles.boldText}>{center.nombre}</td>
                  <td>{center.ciudad}</td>
                  <td>{center.direccion || "-"}</td>
                  <td>
                    {center.horario_apertura && center.horario_cierre
                      ? `${center.horario_apertura} - ${center.horario_cierre}`
                      : "-"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/centers/${center.id}/facilities`} className={styles.linkButton}>
                        Instalaciones
                      </Link>
                      <Link href={`/admin/centers/${center.id}`} className={styles.linkButton}>
                        Editar
                      </Link>
                    </div>
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

export default CentersList;

