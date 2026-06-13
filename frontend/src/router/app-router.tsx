import { createBrowserRouter } from "react-router-dom";
import { CommunityReportsPage } from "@/pages/community-reports-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { LandingPage } from "@/pages/landing-page";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { ScanResultPage } from "@/pages/scan-result-page";
import { ProtectedRoute } from "./protected-route";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/reports",
    element: <CommunityReportsPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />
      },
      {
        path: "/scan/:id",
        element: <ScanResultPage />
      }
    ]
  }
]);
