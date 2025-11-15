export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  COACH = "Coach",
  ANALYST = "Analyst",
  PLAYER = "Player",
  GUEST = "Guest",
  VIDEO_TRIMMER = "coachboard-videoTrimRequests-create-1",
}
export enum Permission {
  // Report permissions
  VIEW_REPORTS = "view_reports",
  GENERATE_REPORTS = "generate_reports",
  DELETE_REPORTS = "delete_reports",
  SCHEDULE_REPORTS = "schedule_reports",
  COMPARE_REPORTS = "compare_reports",
  TRIM_VIDEO = "coachboard-videoTrimRequests-create-1",

  // Data access permissions
  VIEW_ALL_PLAYERS = "view_all_players",
  VIEW_OWN_DATA = "view_own_data",
  VIEW_TEAM_DATA = "view_team_data",

  // Future permissions
  SHARE_REPORTS = "share_reports",
  EXPORT_DATA = "export_data",
  MANAGE_USERS = "manage_users",
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.DELETE_REPORTS,
    Permission.SCHEDULE_REPORTS,
    Permission.COMPARE_REPORTS,
    Permission.VIEW_ALL_PLAYERS,
    Permission.VIEW_TEAM_DATA,
    Permission.SHARE_REPORTS,
    Permission.EXPORT_DATA,
    Permission.TRIM_VIDEO,
    Permission.MANAGE_USERS,
  ],
  [UserRole.MANAGER]: [
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.SCHEDULE_REPORTS,
    Permission.COMPARE_REPORTS,
    Permission.VIEW_ALL_PLAYERS,
    Permission.VIEW_TEAM_DATA,
    Permission.EXPORT_DATA,
  ],

  [UserRole.COACH]: [
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.SCHEDULE_REPORTS,
    Permission.COMPARE_REPORTS,
    Permission.VIEW_ALL_PLAYERS,
    Permission.VIEW_TEAM_DATA,
    Permission.EXPORT_DATA,
  ],

  [UserRole.ANALYST]: [
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.COMPARE_REPORTS,
    Permission.VIEW_TEAM_DATA,
    Permission.EXPORT_DATA,
  ],
  [UserRole.VIDEO_TRIMMER]: [Permission.TRIM_VIDEO],

  [UserRole.PLAYER]: [Permission.VIEW_REPORTS, Permission.VIEW_OWN_DATA],

  [UserRole.GUEST]: [Permission.VIEW_REPORTS, Permission.VIEW_TEAM_DATA],
};
