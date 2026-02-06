export const Routes = {
  Base: "/",
  Login: "/login",
  Register: "/register",
  ForgotPassword: "/forgotPassword",
  ResetPassword: "/resetPassword",
  Admin: "/admin",
  Shard: "/shared",
  Matches: {
    Base: "/Matches",
    Details: "/Matches/:id",
  },
  Seasons: {
    Base: "/Seasons",
  },
  Clubs: {
    Base: "/Clubs",
  },
  Teams: {
    Base: "/Teams",
  },
  Players: {
    Base: "/Players",
    Details: "/Players/:playerId",
  },
  Coaches: {
    Base: "/Coaches",
  },
  Users: {
    Base: "/Users",
  },
  Clips: {
    Base: "/Clips",
    Details: "/Clips/:id",
  },
  Episodes: {
    Base: "/Episodes",
    Details: "/Episodes/:id",
  },
  Reports: {
    Base: "/Reports",
    PlayerOverview: "/Reports/player-overview", 
    PlayerBmi: "/Reports/player-bmi",
  },
};
