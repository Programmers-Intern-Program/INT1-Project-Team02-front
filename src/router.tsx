import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ActivityPage } from "./pages/ActivityPage";
import { ChannelDashboardPage } from "./pages/ChannelDashboardPage";
import { HomePage } from "./pages/HomePage";
import { MeetingDetailPage } from "./pages/MeetingDetailPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "activity", element: <ActivityPage /> },
      { path: "channels/:channelId/dashboard", element: <ChannelDashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
      { path: "meetings/:meetingId", element: <MeetingDetailPage /> },
    ],
  },
]);
