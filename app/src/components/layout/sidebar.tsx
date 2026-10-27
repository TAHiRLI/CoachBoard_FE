import {
  AccountCircleOutlined,
  ApartmentOutlined,
  AssessmentOutlined,
  BadgeOutlined,
  CalendarMonthOutlined,
  CategoryOutlined,
  GroupsOutlined,
  OndemandVideoOutlined,
  PersonOutlined,
  SportsSoccer,
  SportsSoccerOutlined,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

import { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/PermissionGuard/PermissionGuard";
import { Routes } from "@/router/routes";
import { UserRole } from "@/lib/types/permissionTypes";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  roles?: UserRole[];
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // Grouped by what a coach is doing: analysing games, managing the squad, or configuring the club.
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: t("static.navAnalysis"),
      items: [
        { id: "matches", label: t("static.matches"), icon: <SportsSoccerOutlined />, href: Routes.Base },
        { id: "clips", label: t("static.clips"), icon: <OndemandVideoOutlined />, href: Routes.Clips.Base },
        { id: "reports", label: t("static.reports"), icon: <AssessmentOutlined />, href: Routes.Reports.Base },
      ],
    },
    {
      label: t("static.navSquad"),
      items: [
        { id: "players", label: t("static.players"), icon: <PersonOutlined />, href: Routes.Players.Base },
        { id: "teams", label: t("static.teams"), icon: <GroupsOutlined />, href: Routes.Teams.Base },
        { id: "coaches", label: t("static.coaches"), icon: <BadgeOutlined />, href: Routes.Coaches.Base },
      ],
    },
    {
      label: t("static.navSetup"),
      items: [
        { id: "seasons", label: t("static.seasons"), icon: <CalendarMonthOutlined />, href: Routes.Seasons.Base },
        { id: "episodes", label: t("static.episodes"), icon: <CategoryOutlined />, href: Routes.Episodes.Base },
        { id: "clubs", label: t("static.clubs"), icon: <ApartmentOutlined />, href: Routes.Clubs.Base },
        {
          id: "users",
          label: t("static.users"),
          icon: <AccountCircleOutlined />,
          href: Routes.Users.Base,
          roles: [UserRole.ADMIN],
        },
      ],
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname.toLowerCase().startsWith("/matches");
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderItem = (item: NavItem) => {
    const active = isActiveRoute(item.href);
    const link = (
      <li key={item.id} className="nav-item">
        <Link
          to={item.href}
          className={`nav-link capitalize ${active ? "active" : ""}`}
          aria-current={active ? "page" : undefined}
          onClick={onClose}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </li>
    );

    return item.roles ? (
      <RoleGuard key={item.id} roles={item.roles}>
        {link}
      </RoleGuard>
    ) : (
      link
    );
  };

  return (
    <>
      {visible && <div className="mobile-overlay" onClick={onClose} />}
      <nav className={`sidebar ${visible ? "visible" : ""}`} aria-label={t("app.name")}>
        <div className="logo">
          <div className="logo-icon">
            <SportsSoccer fontSize="small" />
          </div>
          <h3>CoachBoard</h3>
        </div>

        <div className="nav-scroll">
          {groups.map((group) => (
            <div key={group.label} className="nav-group">
              <div className="nav-group-label">{group.label}</div>
              <ul className="nav-menu">{group.items.map(renderItem)}</ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
