import { Apartment, Category, Group, Logout, Loop, Menu } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Routes } from "@/router/routes";
import { logout } from "@/store/slices/auth.slice";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  breadcrumbs?: Breadcrumb[];
  showSearch?: boolean;
  actionButtons?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle = "",
  breadcrumbs = [],
  actionButtons = null,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((x) => x.auth);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", href: Routes.Base },
    { id: "matches", label: "Matches", icon: "⚽", href: Routes.Matches.Base },
    { id: "seasons", label: "Seasons", icon: <Loop />, href: Routes.Seasons.Base },
    { id: "Clubs", label: "Clubs", icon: <Apartment />, href: Routes.Clubs.Base },
    { id: "Teams", label: "Teams", icon: <Group />, href: Routes.Teams.Base },
    { id: "players", label: "Players", icon: "👥", href: Routes.Players.Base },
    { id: "Episodes", label: "Episodes", icon: <Category />, href: Routes.Episodes.Base },
    { id: "reports", label: "Reports", icon: "📋", href: "#" },
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
            <div className="coach-profile">
              <Avatar className="coach-avatar">{user?.fullname?.[0] || user?.username?.[0]}</Avatar>
              <div className="coach-info">
                <h4>{user?.fullname}</h4>
                <p>{user?.username}</p>
              </div>
              <IconButton
                className="logout-button"
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                title="Logout"
              >
                <Logout />
              </IconButton>
            </div>
          </div>
        </header>

        <div className="page-content">
          {pageSubtitle && (
            <div className="page-header">
              <div className="header-content">
                <div className="title-section">
                  <h1 className="page-title">{pageTitle}</h1>
                  {pageSubtitle && <p className="page-subtitle">{pageSubtitle}</p>}
                </div>
                {actionButtons && <div className="header-actions">{actionButtons}</div>}
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
