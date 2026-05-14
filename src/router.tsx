import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { ChannelDashboardPage } from "./pages/ChannelDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MeetingDetailPage } from "./pages/MeetingDetailPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/projects" replace /> },
          {
            path: "channels/:channelId/dashboard",
            element: <ChannelDashboardPage />,
          },
          { path: "projects", element: <ProjectsPage /> },
          { path: "projects/:projectId", element: <ProjectDetailPage /> },
          { path: "meetings/:meetingId", element: <MeetingDetailPage /> },
        ],
      },
    ],
  },
]);
