'use client';

import React from "react";
import clsx from "clsx";
import MainPageBody from "@/components/main-layout/body/MainBody";
import MainHeader from "@/components/main-layout/header/MainHeader";
import headerStyles from "@/components/main-layout/header/MainHeader.module.css";
import bodyStyles from "@/components/main-layout/body/MainBody.module.css";
import Imagen from "@/components/desarrollo/Imagen";
import MainBody from "@/components/main-layout/body/MainBody";
import MainContent from "@/components/main-layout/content/MainContent";
import contentStyles from "@/components/main-layout/content/MainContent.module.css";
import MainDownComponent from "@/components/desarrollo/MainDownComponent";
import RoundedButton from "@/components/common/button/profile-button/RoundedButton";

const TestPage: React.FC = () => {
    return (
        <RoundedButton label={"A"}/>
    );
};

export default TestPage;
