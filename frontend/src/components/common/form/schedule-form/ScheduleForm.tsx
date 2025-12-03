"use client";

import React, { useState } from "react";
import FormContainer from "@/components/common/form/FormContainer";
import FormButton from "@/components/common/button/form-button/FormButton";
import styles from "./ScheduleForm.module.css";

const ScheduleForm: React.FC = () => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Horario enviado:", { date, time });
    };

    const inputContent = (
        <>
            <label className={styles.label}>
                Fecha
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={styles.input}
                    required
                />
            </label>
            <label className={styles.label}>
                Hora
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={styles.input}
                    required
                />
            </label>
        </>
    );

    const buttonContent = (
        <FormButton type="submit">Guardar horario</FormButton>
    );

    return (
        <FormContainer
            title="Selecciona tu horario"
            inputContent={inputContent}
            buttonContent={buttonContent}
            onSubmit={handleSubmit}
            className={styles.formContainer}
        />
    );
};

export default ScheduleForm;

