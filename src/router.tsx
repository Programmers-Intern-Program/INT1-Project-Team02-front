import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { getMe } from "./api/flodi";
import { AppLayout } from "./components/layout/AppLayout";
import { ChannelDashboardPage } from "./pages/ChannelDashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MeetingDetailPage } from "./pages/MeetingDetailPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

function AuthGuard() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  if (meQuery.isPending) return null;
  if (meQuery.isError) return <Navigate to="/login" replace />;
  return <Outlet />;
}

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
          { index: true, element: <HomePage /> },
          { path: "channels/:channelId/dashboard", element: <ChannelDashboardPage /> },
          { path: "projects", element: <ProjectsPage /> },
          { path: "projects/:projectId", element: <ProjectDetailPage /> },
          { path: "meetings/:meetingId", element: <MeetingDetailPage /> },
        ],
      },
    ],
  },
]);
