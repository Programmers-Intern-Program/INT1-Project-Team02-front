import type { ActiveMeeting, Decision, Meeting, MeetingContext, Project, WorkLog } from "../api/types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: 2,
    serverId: "111",
    serverName: "입코더",
    channelId: "1482898357507719209",
    channelName: "입코더-테스트",
    name: "입코더 테스트",
    description: "입토더 테스트",
    techStack: "Java",
    createdAt: "2026-05-14T01:39:35.346127104",
  },
  {
    id: 3,
    serverId: "111",
    serverName: "입코더",
    channelId: "bbb",
    channelName: "프론트-개발",
    name: "Flodi Frontend",
    description: "React + Vite 프론트엔드.",
    techStack: "TypeScript",
    createdAt: "2026-05-14T02:26:22.909345438",
    activeMeetingId: 99,
  },
];

export const MOCK_DECISIONS: Decision[] = [
  { id: 1, projectId: 2, meetingId: 1, content: "API 응답 형식을 envelope 패턴으로 통일한다.", decidedAt: "2026-05-14T02:26:22.909345438" },
  { id: 2, projectId: 2, meetingId: 1, content: "인증은 Discord OAuth2 + 세션 쿠키 방식으로 진행한다.", decidedAt: "2026-05-14T04:06:15.157031743" },
  { id: 3, projectId: 2, meetingId: 2, content: "WebSocket은 STOMP 프로토콜을 사용한다.", decidedAt: "2026-05-14T04:13:43.375427047" },
];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 1, projectId: 2, title: "킥오프 회의", startedAt: "2026-05-14T01:39:35.346127104", endedAt: "2026-05-14T02:26:22.909345438", status: "ENDED" },
  { id: 2, projectId: 2, title: "기술 스택 결정", startedAt: "2026-05-14T02:49:29.721547501", endedAt: "2026-05-14T04:06:15.157031743", status: "ENDED" },
  { id: 3, projectId: 2, title: "배포 전략 논의", startedAt: "2026-05-14T04:13:43.375427047", endedAt: null, status: "IN_PROGRESS" },
];

export const MOCK_WORK_LOGS: WorkLog[] = [
  { id: 1, assigneeName: "chan", task: "Discord OAuth 로그인 구현", dueDate: "2026-05-15T00:00:00Z", status: "IN_PROGRESS" },
  { id: 2, assigneeName: "팀원A", task: "WebSocket STOMP 연동", dueDate: "2026-05-14T00:00:00Z", status: "DONE" },
  { id: 3, assigneeName: "팀원B", task: "AI 요약 API 연동", dueDate: "2026-05-16T00:00:00Z", status: "TODO" },
  { id: 4, assigneeName: "chan", task: "Vercel 배포 설정", dueDate: "2026-05-14T00:00:00Z", status: "DONE" },
  { id: 5, assigneeName: "팀원B", task: "Notion 연동 기능", dueDate: "2026-05-13T00:00:00Z", status: "CANCELLED" },
  { id: 6, assigneeName: "팀원A", task: "Slack 알림 봇 연동", dueDate: "2026-05-13T00:00:00Z", status: "CANCELLED" },
];

export const MOCK_ACTIVE_MEETING: ActiveMeeting = {
  meetingId: 99,
  title: "스프린트 데일리",
};

export const MOCK_MEETING_CONTEXT: MeetingContext = {
  startContext: {
    projectId: 2,
    projectName: "입코더 테스트",
    description: "입토더 테스트",
    techStack: "Java",
    recentDecisions: MOCK_DECISIONS,
    recentSummaries: [
      { id: 1, summary: "팀원 모두 킥오프 미팅에 참여해 프로젝트 목표와 일정을 공유했습니다. 백엔드는 Spring Boot, 프론트는 React로 결정했습니다.", createdAt: "2026-05-14T02:26:22.909345438" },
    ],
    activeWorkLogs: MOCK_WORK_LOGS,
  },
  shortTerm: {
    rollingSummary: "현재 회의에서는 배포 전략과 CI/CD 파이프라인 구성에 대해 논의 중입니다. GitHub Actions + Vercel 조합으로 프론트를 배포하고, 백엔드는 AWS EC2 + Docker Blue/Green 배포로 진행하기로 했습니다.",
    recentUtterances: [
      { speakerName: "chan", content: "Vercel에 환경변수 설정하면 배포 끝나죠?", speechStartedAt: "2026-05-14T04:05:00" },
      { speakerName: "팀원A", content: "네, VITE_API_BASE_URL만 넣으면 자동으로 빌드해요.", speechStartedAt: "2026-05-14T04:05:30" },
      { speakerName: "팀원B", content: "백엔드 HTTPS는 Nginx Proxy Manager로 처리하면 될 것 같아요.", speechStartedAt: "2026-05-14T04:06:00" },
    ],
  },
};
