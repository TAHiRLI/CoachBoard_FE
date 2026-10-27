import { Avatar, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined, Logout, Menu as MenuIcon } from "@mui/icons-material";
import React, { ReactNode, useEffect, useState } from "react";

import { KeycloakUserInfo } from "@/lib/types/authTypes";
import LangSelect from "../langSelect/langSelect";
import { PageActionsContext } from "./pageActionsContext";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import keycloak from "@/API/Services/keycloak.service";
import { logoutKeycloak } from "@/store/slices/keycloak.slice";
import { useAppDispatch } from "@/store/store";
import { minioUrl } from "@/lib/constants/constants";
import { useColorMode } from "@/context/colorMode.context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: Breadcrumb[];
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, subtitle, actions, breadcrumbs = [] }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode, colorMode } = useColorMode();
  const user = (keycloak.userInfo ?? {}) as KeycloakUserInfo;
  const profile = useCurrentUser();
  const club = profile?.club;
  const contextLine = [club?.name, profile?.team?.name].filter(Boolean).join(" / ");
  const initial = (user.name?.[0] || user.preferred_username?.[0] || "?").toUpperCase();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeLabel = mode === "light" ? t("static.darkMode") : t("static.lightMode");

  return (
    <div className="dashboard-container">
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <IconButton
              className="menu-toggle"
              aria-label={t("static.openNavigation")}
              onClick={() => setSidebarVisible((v) => !v)}
            >
              <MenuIcon />
            </IconButton>

            {breadcrumbs.length > 0 && (
              <nav className="breadcrumb" aria-label="breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {crumb.href ? <Link to={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                    {index < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>

          <div className="topbar-right">
            <LangSelect />
            <Tooltip title={themeLabel}>
              <IconButton aria-label={themeLabel} onClick={colorMode.toggleColorMode}>
                {mode === "light" ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}
              </IconButton>
            </Tooltip>

            <button
              type="button"
              className="coach-profile"
              aria-haspopup="menu"
              aria-expanded={Boolean(accountAnchor)}
              onClick={(e) => setAccountAnchor(e.currentTarget)}
            >
              <Avatar sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 600, bgcolor: "primary.main" }}>
                {initial}
              </Avatar>
              <div className="coach-info">
                <h4>{user.name || user.preferred_username}</h4>
                <p>{club?.name ?? user.preferred_username}</p>
              </div>
            </button>
            <Menu
              anchorEl={accountAnchor}
              open={Boolean(accountAnchor)}
              onClose={() => setAccountAnchor(null)}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5 } } }}
            >
              <MenuItem disabled sx={{ opacity: "1 !important", gap: 1.5 }}>
                {club && (
                  <Avatar
                    src={club.logo ? minioUrl + club.logo : undefined}
                    variant="rounded"
                    sx={{ width: 36, height: 36, bgcolor: "action.hover", color: "text.secondary", "& img": { objectFit: "contain" } }}
                  >
                    {club.name[0]}
                  </Avatar>
                )}
                <ListItemText
                  primary={user.name || user.preferred_username}
                  secondary={contextLine || user.email}
                />
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  setAccountAnchor(null);
                  dispatch(logoutKeycloak());
                  navigate("/login");
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("static.logout")}</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </header>

        <div className="page-content">
          {(pageTitle || actions) && (
            <div className="page-header">
              <div>
                {pageTitle && <h1 className="page-title">{t(pageTitle)}</h1>}
                {subtitle && <p className="page-subtitle">{t(subtitle)}</p>}
              </div>
              <div className="header-actions" ref={setActionsSlot}>
                {actions}
              </div>
            </div>
          )}
          <PageActionsContext.Provider value={actionsSlot}>{children}</PageActionsContext.Provider>
        </div>
      </main>
    </div>
  );
};

export default Layout;
