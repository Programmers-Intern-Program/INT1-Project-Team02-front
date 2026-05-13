export type Decision = {
  id: number;
  projectId?: number | null;
  meetingId?: number | null;
  content: string;
  decidedAt?: string | null;
};

export type MeetingSummary = {
  id: number;
  summary: string;
  createdAt?: string | null;
};

export type WorkLog = {
  id: number;
  assigneeName?: string | null;
  task: string;
  dueDate?: string | null;
  status?: string | null;
};

export type Utterance = {
  speakerName?: string | null;
  content: string;
  speechStartedAt?: string | null;
};

export type Project = {
  id: number;
  serverId?: number | string | null;
  channelId?: string | null;
  activeMeetingId?: number | null;
  name: string;
  description?: string | null;
  techStack?: string | null;
  createdAt?: string | null;
};

export type ProjectStatusEvent = {
  type: "meeting.started" | "meeting.ended";
  meetingId: number;
  channelId: string | null;
};

export type Meeting = {
  id: number;
  projectId: number;
  title?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  status?: string | null;
};

export type ProjectMemoryContext = {
  meetingId?: number | null;
  projectId: number | null;
  projectName?: string | null;
  description?: string | null;
  techStack?: string | null;
  metadata?: unknown;
  recentDecisions?: Decision[] | null;
  recentSummaries?: MeetingSummary[] | null;
  unresolvedItems?: string | null;
  activeWorkLogs?: WorkLog[] | null;
};

export type MeetingShortTermContext = {
  rollingSummary?: string | null;
  recentUtterances?: Utterance[] | null;
};

export type QuestionContext = {
  decisions?: Decision[] | null;
  pastSummaries?: MeetingSummary[] | null;
};

export type MeetingContext = {
  startContext?: ProjectMemoryContext | null;
  shortTerm?: MeetingShortTermContext | null;
  questionContext?: QuestionContext | null;
};

export type ChannelDashboardData = {
  project: Project | null;
  decisions: Decision[];
};

export type ActiveMeeting = {
  meetingId: number;
  title: string | null;
};

export type ContextSummaryEvent = {
  meetingId: number;
  summary: string;
  version: number;
};

export type AiAnswerStatus = "PENDING" | "COMPLETED" | "FALLBACK";

export type AiAnswerEvent = {
  meetingId: number;
  utteranceId: number;
  speakerDiscordId: string;
  question: string;
  answer: string;
  status: AiAnswerStatus;
  elapsedMs: number;
  createdAt: string;
};

export type CaptionEvent = {
  type: "caption.partial" | "caption.final";
  meetingId: number;
  speakerDiscordId: string;
  speakerName: string;
  text: string;
  isFinal: boolean;
  sequence: number;
  sentAt: string;
};
