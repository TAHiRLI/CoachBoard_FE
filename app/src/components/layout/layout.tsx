import { Avatar, IconButton } from "@mui/material";
// Layout.tsx
import { Logout, Menu } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

import { KeycloakUserInfo } from "@/lib/types/authTypes";
import LangSelect from "../langSelect/langSelect";
import Sidebar from "./sidebar";
import keycloak from "@/API/Services/keycloak.service";
import { logoutKeycloak } from "@/store/slices/keycloak.slice";
import { useAppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, breadcrumbs = [] }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = keycloak.userInfo as KeycloakUserInfo;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <main className="main-content bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="topbar">
          <div className="topbar-left">
            <IconButton className="menu-toggle" onClick={() => setSidebarVisible((v) => !v)}>
              <Menu />
            </IconButton>

            {breadcrumbs.length > 0 && (
              <div className="breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span>{crumb.label}</span>}
                    {index < breadcrumbs.length - 1 && <span>→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="topbar-right">
            <LangSelect />
            <div className="coach-profile">
              <Avatar className="coach-avatar">
                {user?.name?.[0] || user?.preferred_username?.[0]}
              </Avatar>
              <div className="coach-info">
                <h4>{user.name}</h4>
                <p>{user?.preferred_username}</p>
              </div>
              <IconButton
                className="logout-button"
                onClick={() => {
                  dispatch(logoutKeycloak());
                  navigate("/login");
                }}
                title={t("static.logout")}
              >
                <Logout />
              </IconButton>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">{pageTitle && t(pageTitle)}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;