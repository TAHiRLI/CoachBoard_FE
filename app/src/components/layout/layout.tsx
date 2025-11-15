import { AccountBox, AccountCircle, Apartment, Category, Groups, Logout, Loop, Menu } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { KeycloakUserInfo } from "@/lib/types/authTypes";
import LangSelect from "../langSelect/langSelect";
import { Routes } from "@/router/routes";
import keycloak from "@/API/Services/keycloak.service";
import { logoutKeycloak } from "@/store/slices/keycloak.slice";
import { useAppDispatch } from "@/store/store";
import { useTranslation } from "react-i18next";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: Breadcrumb[];
  showSearch?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, breadcrumbs = [] }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = keycloak.userInfo as KeycloakUserInfo;

  const navigationItems = [
    { id: "dashboard", label: t("static.dashboard"), icon: "🏠", href: Routes.Base },
    { id: "matches", label: t("static.matches"), icon: "⚽", href: Routes.Matches.Base },
    { id: "seasons", label: t("static.seasons"), icon: <Loop />, href: Routes.Seasons.Base },
    { id: "Clubs", label: t("static.clubs"), icon: <Apartment />, href: Routes.Clubs.Base },
    { id: "Teams", label: t("static.teams"), icon: <Groups />, href: Routes.Teams.Base },
    { id: "Coaches", label: t("static.coaches"), icon: <AccountBox />, href: Routes.Coaches.Base },
    { id: "players", label: t("static.players"), icon: "👥", href: Routes.Players.Base },
    { id: "Episodes", label: t("static.episodes"), icon: <Category />, href: Routes.Episodes.Base },
    { id: "reports", label: t("static.reports"), icon: "📋", href: Routes.Reports.Base },
    { id: "Users", label: t("static.users"), icon: <AccountCircle />, href: Routes.Users.Base },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="dashboard-container">
      {sidebarVisible && <div className="mobile-overlay active" onClick={() => setSidebarVisible(false)} />}

      <nav className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
        <div className="logo">
          <div className="logo-icon">⚽</div>
          <div>
            <h3>CoachBoard</h3>
          </div>
        </div>
        <ul className="nav-menu">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link to={item.href} className={`nav-link ${isActiveRoute(item.href) ? "active" : ""}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <IconButton className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>
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
              <Avatar className="coach-avatar">{user?.name?.[0] || user?.preferred_username?.[0]}</Avatar>
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
            <div className="header-content">
              <div className="title-section">
                <h1 className="page-title">{pageTitle && t(pageTitle)}</h1>
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
