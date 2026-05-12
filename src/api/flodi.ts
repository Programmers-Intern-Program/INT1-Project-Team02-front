import { apiBaseUrl, apiRequest } from "./client";
import type { ActiveMeeting, ChannelDashboardData, Decision, Meeting, MeetingContext, Project } from "./types";

export type MeResponse = {
  userId: string;
  guildIds: string[];
};

export function getMe() {
  return apiRequest<MeResponse>("/auth/v1/me");
}

export async function logout() {
  await fetch(`${apiBaseUrl}/auth/v1/logout`, {
    method: "POST",
    credentials: "include",
  });
}

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

export function getProjectMeetings(projectId: string | number) {
  return apiRequest<Meeting[]>(`/api/v1/projects/${projectId}/meetings`);
}

export function getMeeting(meetingId: string | number) {
  return apiRequest<Meeting>(`/api/v1/meetings/${meetingId}`);
}

export function getMeetingContext(meetingId: string | number, question?: string) {
  const params = question ? `?question=${encodeURIComponent(question)}` : "";
  return apiRequest<MeetingContext | null>(`/internal/v1/meetings/${meetingId}/context${params}`);
}

export function getActiveMeeting(channelId: string) {
  return apiRequest<ActiveMeeting | null>(`/api/v1/channels/${channelId}/active-meeting`);
}

export function getRollingSummary(meetingId: number) {
  return apiRequest<{ meetingId: number; summary: string; version: number } | null>(
    `/api/v1/meetings/${meetingId}/rolling-summary`,
  );
}

export async function getChannelDashboard(channelId: string): Promise<ChannelDashboardData> {
  const project = await getProjectByChannel(channelId);
  if (!project) {
    return { project: null, decisions: [] };
  }

  const decisions = await getProjectDecisions(project.id).catch(() => []);
  return { project, decisions };
}
