"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import clsx from "clsx"
import MainBody from "@/components/main-layout/body/MainBody"
import MainContent from "@/components/main-layout/content/MainContent"
import MainHeader from "@/components/main-layout/header/MainHeader"
import MainDownComponent from "@/components/main-layout/footer/MainFooter"
import ProfileButton from "@/components/common/button/profile-button/ProfileButton"
import Imagen from "@/components/common/image/Imagen"
import bodyStyles from "@/components/main-layout/body/MainBody.module.css"
import headerStyles from "@/components/main-layout/header/MainHeader.module.css"
import contentStyles from "@/components/main-layout/content/MainContent.module.css"
import CreateCenterForm from "@/components/admin/forms/CreateCenterForm"

const CreateCenterPage: React.FC = () => {
  const router = useRouter()
  const { userRole, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login")
    } else if (userRole !== "admin") {
      router.push("/home")
    }
  }, [isAuthenticated, userRole, router])

  return (
    <MainBody bodyClassName={clsx(bodyStyles.content)}>
      <MainHeader bodyClassName={clsx(headerStyles.container, headerStyles.title, bodyStyles.header)} />
      <MainContent bodyClassName={clsx(contentStyles.container, bodyStyles.body)}>
        <CreateCenterForm />
      </MainContent>
      <div className={clsx(bodyStyles.footer)}>
        <MainDownComponent>
          <h1>Crear Centro Deportivo</h1>
          <div className={clsx(bodyStyles.footerButtons)}>
            <ProfileButton>
              <Imagen src={"/botones/reservas.svg"} alt={"home"} href={"/home"} />
            </ProfileButton>
            <ProfileButton>
              <Imagen src={"/botones/perfil.svg"} alt={"perfil"} href={"/perfil"} />
            </ProfileButton>
          </div>
        </MainDownComponent>
      </div>
    </MainBody>
  )
}

export default CreateCenterPage
