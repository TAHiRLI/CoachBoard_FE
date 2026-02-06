import { AccountBox, AccountCircle, Apartment, Category, Groups, Loop, OndemandVideo } from "@mui/icons-material";

import { Link } from "react-router-dom";
import { Routes } from "@/router/routes";
import { RoleGuard } from "@/components/auth/PermissionGuard/PermissionGuard";
import { UserRole } from "@/lib/types/permissionTypes";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  const navigationItems = [
    { id: "matches", label: t("static.matches"), icon: "⚽", href: Routes.Base },
    { id: "clips", label: t("static.clips"), icon: <OndemandVideo />, href: Routes.Clips.Base },
    { id: "seasons", label: t("static.seasons"), icon: <Loop />, href: Routes.Seasons.Base },
    { id: "clubs", label: t("static.clubs"), icon: <Apartment />, href: Routes.Clubs.Base },
    { id: "teams", label: t("static.teams"), icon: <Groups />, href: Routes.Teams.Base },
    { id: "coaches", label: t("static.coaches"), icon: <AccountBox />, href: Routes.Coaches.Base },
    { id: "players", label: t("static.players"), icon: "👥", href: Routes.Players.Base },
    { id: "episodes", label: t("static.episodes"), icon: <Category />, href: Routes.Episodes.Base },
    { id: "reports", label: t("static.reports"), icon: "📋", href: Routes.Reports.Base },
    { id: "users", label: t("static.users"), icon: <AccountCircle />, href: Routes.Users.Base },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {visible && <div className="mobile-overlay active" onClick={onClose} />}
      <nav className={`sidebar ${visible ? "visible" : ""}`}>
        <div className="logo">
          <div className="logo-icon">⚽</div>
          <h3>CoachBoard</h3>
        </div>

        <ul className="nav-menu">
          {navigationItems.map((item) => {
            const content = (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.href}
                  className={`nav-link capitalize ${isActiveRoute(item.href) ? "active" : ""}`}
                  onClick={onClose}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );

            if (item.id === "users") {
              return (
                <RoleGuard key={item.id} roles={[UserRole.ADMIN]}>
                  {content}
                </RoleGuard>
              );
            }

            return content;
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
