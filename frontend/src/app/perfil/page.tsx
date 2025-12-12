"use client";

import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from "clsx";
import MainBody from "@/components/main-layout/body/MainBody";
import MainHeader from "@/components/main-layout/header/MainHeader";
import MainContent from "@/components/main-layout/content/MainContent";
import MainFooter from "@/components/main-layout/footer/MainFooter";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import { useAuth } from "@/lib/auth/AuthContext";
import { usersService, User, UpdateUserData } from "@/lib/api/users.service";
import styles from './perfil.module.css';

const PerfilPage: FunctionComponent = () => {
    const router = useRouter();
    const { user: authUser, token, isAuthenticated, isLoading, logout } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<UpdateUserData>({
        nombre: '',
        apellidos: '',
        telefono: '',
        ciudad: '',
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && token) {
            loadUserProfile();
        }
    }, [isLoading, isAuthenticated, token, router]);

    const loadUserProfile = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError(null);
            const result = await usersService.getCurrentUser(token);

            if (result.data) {
                setUser(result.data);
                setFormData({
                    nombre: result.data.nombre || '',
                    apellidos: result.data.apellidos || '',
                    telefono: result.data.telefono || '',
                    ciudad: result.data.ciudad || '',
                });
            } else if (result.error) {
                setError(result.error);
            }
        } catch (err) {
            console.error("Error loading user profile:", err);
            setError("Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                apellidos: user.apellidos || '',
                telefono: user.telefono || '',
                ciudad: user.ciudad || '',
            });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!token) return;

        try {
            setSaving(true);
            setError(null);
            const result = await usersService.updateCurrentUser(formData, token);

            if (result.data) {
                setUser(result.data);
                setIsEditing(false);
            } else if (result.error) {
                setError(result.error);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Error al actualizar el perfil");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            logout();
            router.push('/login');
        }
    };

    if (isLoading || loading) {
        return (
            <MainBody bodyClassName={clsx(bodyStyles.content)}>
                <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
                <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
                    <div className={styles.loadingContainer}>
                        <p>Cargando perfil...</p>
                    </div>
                </MainContent>
            </MainBody>
        );
    }

    if (!user) {
        return (
            <MainBody bodyClassName={clsx(bodyStyles.content)}>
                <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
                <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>No se pudo cargar el perfil</p>
                        <button onClick={() => router.push('/home')} className={styles.actionButton}>
                            Volver al inicio
                        </button>
                    </div>
                </MainContent>
            </MainBody>
        );
    }

    return (
        <MainBody bodyClassName={clsx(bodyStyles.content)}>
            <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
            <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
                <div className={styles.perfilContainer}>
                    <h1 className={styles.title}>Mi Perfil</h1>

                    {error && (
                        <div className={styles.errorBanner}>
                            {error}
                        </div>
                    )}

                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>
                                {user.nombre?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className={styles.headerInfo}>
                                <h2>{user.nombre} {user.apellidos}</h2>
                                <p className={styles.email}>{user.email}</p>
                                <span className={styles.rolBadge}>{user.rol}</span>
                            </div>
                        </div>

                        <div className={styles.profileBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.value}>{user.nombre || '-'}</p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Apellidos</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.value}>{user.apellidos || '-'}</p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <p className={styles.value}>{user.email}</p>
                                <span className={styles.hint}>No se puede modificar</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Teléfono</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.value}>{user.telefono || '-'}</p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Ciudad</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                ) : (
                                    <p className={styles.value}>{user.ciudad || '-'}</p>
                                )}
                            </div>

                            {user.created_at && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Miembro desde</label>
                                    <p className={styles.value}>
                                        {new Date(user.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className={styles.profileActions}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={styles.saveButton}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar cambios'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className={styles.cancelButton}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className={styles.editButton}>
                                    Editar perfil
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.navigationButtons}>
                        <button
                            onClick={() => router.push('/reservas')}
                            className={styles.secondaryButton}
                        >
                            Mis Reservas
                        </button>
                        <button
                            onClick={() => router.push('/home')}
                            className={styles.secondaryButton}
                        >
                            Volver al inicio
                        </button>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </MainContent>
            <div className={clsx(bodyStyles.footer)}>
                <MainFooter>
                </MainFooter>
            </div>
        </MainBody>
    );
};

export default PerfilPage;

