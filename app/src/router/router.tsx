import { AdminPage } from "@/pages/testPages/testPages";
import ClipDetailsPage from "@/pages/clips/clipDetailsPage";
import ClubsPage from "@/pages/clubs/clubsPage";
import CoachesPage from "@/pages/coaches/CoachesPage";
import EpisodesPage from "@/pages/episodes/episodesPage";
import ForgotPasswordPage from "@/pages/login/forgotPassword";
import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login/v2/loginPage";
import MatchDetailsPage from "@/pages/matches/matchDetails";
import MatchesPage from "@/pages/matches/matchesPage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";
import PlayerDetailsPage from "@/pages/players/PlayerDetailsPage";
import PlayersPage from "@/pages/players/PlayersPage";
import PrivateRoute from "@/components/auth/PrivateRoute/v2/privateRoute";
import RegisterPage from "@/pages/login/registerPage";
import ReportsPage from "@/pages/reportsPage/reportsPage";
import ResetPasswordPage from "@/pages/login/resetPassword";
import { Routes } from "./routes";
import SeasonsPage from "@/pages/seasons/seasonsPage";
import TeamsPage from "@/pages/teams/teamsPage";
import UsersPage from "@/pages/Users/UsersPage";
// router.tsx
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: Routes.Admin,
    element: (
      <>
        <PrivateRoute roles={["admin"]}>
          <Layout>
            <AdminPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },

  {
    path: Routes.Matches.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.matches">
            <MatchesPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Matches.Details,
    element: (
      <>
        <PrivateRoute>
          <Layout>
            <MatchDetailsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Clubs.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.clubs">
            <ClubsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Teams.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.teams">
            <TeamsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Coaches.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.coaches">
            <CoachesPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Players.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.players">
            <PlayersPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Players.Details,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.player">
            <PlayerDetailsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Seasons.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.seasons">
            <SeasonsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Clips.Details,
    element: (
      <>
        <PrivateRoute>
          <Layout>
            <ClipDetailsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Episodes.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.episodes">
            <EpisodesPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Reports.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.reports">
            <ReportsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Users.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.users">
            <UsersPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Login,
    element: <LoginPage />,
  },
  {
    path: Routes.Register,
    element: <RegisterPage />,
  },
  {
    path: Routes.ForgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: Routes.ResetPassword,
    element: <ResetPasswordPage />,
  },
  {
    path: Routes.Base,
    element: (
      <>
        <PrivateRoute>
          <Layout pageTitle="static.matches">
            {/* <HomePage /> */}
            <MatchesPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
