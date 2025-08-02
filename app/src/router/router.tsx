import { AdminPage, SharedPage } from "@/pages/testPages/testPages";

import ForgotPasswordPage from "@/pages/login/forgotPassword";
import HomePage from "@/pages/home/homePage";
import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login/loginPage";
import MatchesPage from "@/pages/matches/matchesPage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";
import PrivateRoute from "@/components/PrivateRoute/privateRoute";
import RegisterPage from "@/pages/login/registerPage";
import ResetPasswordPage from "@/pages/login/resetPassword";
import { Routes } from "./routes";
import SeasonsPage from "@/pages/seasons/seasonsPage";
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
        <PrivateRoute roles={["admin", "manager"]}>
          <Layout pageTitle="Matches">
            <MatchesPage />
          </Layout>
        </PrivateRoute>
      </>
    ),
  },
  {
    path: Routes.Seasons.Base,
    element: (
      <>
        <PrivateRoute roles={["admin", "manager"]}>
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
        <PrivateRoute roles={["admin", "manager"]}>
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
