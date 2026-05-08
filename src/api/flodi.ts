import { apiRequest } from "./client";
import type { ChannelDashboardData, Decision, Meeting, MeetingContext, Project } from "./types";

export function getProjects() {
  return apiRequest<Project[]>("/api/v1/projects");
}

export function getProject(projectId: string | number) {
  return apiRequest<Project>(`/api/v1/projects/${projectId}`);
}

export function getProjectByChannel(channelId: string) {
  return apiRequest<Project | null>(`/api/v1/projects/channel/${channelId}`);
}

export function getProjectDecisions(projectId: string | number) {
  return apiRequest<Decision[]>(`/api/v1/projects/${projectId}/decisions`);
}

export function getMeeting(meetingId: string | number) {
  return apiRequest<Meeting>(`/api/v1/meetings/${meetingId}`);
}

export function getMeetingContext(meetingId: string | number, question?: string) {
  const params = question ? `?question=${encodeURIComponent(question)}` : "";
  return apiRequest<MeetingContext | null>(`/internal/v1/meetings/${meetingId}/context${params}`);
}

export async function getChannelDashboard(channelId: string): Promise<ChannelDashboardData> {
  const project = await getProjectByChannel(channelId);
  if (!project) {
    return { project: null, decisions: [] };
  }

  const decisions = await getProjectDecisions(project.id).catch(() => []);
  return { project, decisions };
}
