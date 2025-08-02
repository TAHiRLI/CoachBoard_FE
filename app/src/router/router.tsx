import { AdminPage, SharedPage } from "@/pages/testPages/testPages";

import ClubsPage from "@/pages/clubs/clubsPage";
import ForgotPasswordPage from "@/pages/login/forgotPassword";
import HomePage from "@/pages/home/homePage";
import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login/loginPage";
import MatchDetailsPage from "@/pages/matches/matchDetails";
import MatchesPage from "@/pages/matches/matchesPage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";
import PlayersPage from "@/pages/players/PlayersPage";
import PrivateRoute from "@/components/PrivateRoute/privateRoute";
import RegisterPage from "@/pages/login/registerPage";
import ResetPasswordPage from "@/pages/login/resetPassword";
import { Routes } from "./routes";
import SeasonsPage from "@/pages/seasons/seasonsPage";
import TeamsPage from "@/pages/teams/teamsPage";
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
          <Layout pageTitle="Matches">
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
          <Layout pageTitle="Clubs">
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
          <Layout pageTitle="Teams">
            <TeamsPage />
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
          <Layout pageTitle="Teams">
            <PlayersPage />
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
          <Layout pageTitle="Seasons">
            <SeasonsPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Shard,
    element: (
      <>
        <PrivateRoute>
          <Layout>
            <SharedPage />
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
        <PrivateRoute redirectUrl={Routes.Base}>
          <Layout>
            <HomePage />
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
