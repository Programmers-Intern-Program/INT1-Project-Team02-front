import type { ActiveMeeting, Decision, Meeting, MeetingContext, Project, WorkLog } from "../api/types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    serverId: "111",
    serverName: "팀02 서버",
    channelId: "1482898357507719209",
    channelName: "백엔드-개발",
    name: "Flodi Backend",
    description: "Spring Boot 백엔드 API 서버. Discord 봇 연동 및 AI 요약 기능을 담당합니다.",
    techStack: "Java",
    createdAt: "2026-05-13T01:00:00Z",
  },
  {
    id: 2,
    serverId: "111",
    serverName: "팀02 서버",
    channelId: "bbb",
    channelName: "프론트-개발",
    name: "Flodi Frontend",
    description: "React + Vite 프론트엔드. 실시간 자막, 채널 대시보드 등을 제공합니다.",
    techStack: "TypeScript",
    createdAt: "2026-05-13T02:00:00Z",
    activeMeetingId: 99,
  },
  {
    id: 3,
    serverId: "222",
    serverName: "테스트 서버",
    channelId: "ddd",
    channelName: "general",
    name: "테스트 프로젝트",
    description: "기능 테스트용 프로젝트입니다.",
    techStack: "TEST",
    createdAt: "2026-05-13T04:00:00Z",
  },
];

export const MOCK_DECISIONS: Decision[] = [
  { id: 1, projectId: 1, meetingId: 1, content: "API 응답 형식을 envelope 패턴으로 통일한다.", decidedAt: "2026-05-12T10:00:00Z" },
  { id: 2, projectId: 1, meetingId: 1, content: "인증은 Discord OAuth2 + 세션 쿠키 방식으로 진행한다.", decidedAt: "2026-05-12T10:15:00Z" },
  { id: 3, projectId: 1, meetingId: 2, content: "WebSocket은 STOMP 프로토콜을 사용한다.", decidedAt: "2026-05-13T09:00:00Z" },
  { id: 4, projectId: 1, meetingId: 2, content: "AI 요약은 rolling summary 방식으로 5분마다 갱신한다.", decidedAt: "2026-05-13T09:30:00Z" },
];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 1, projectId: 1, title: "킥오프 회의", startedAt: "2026-05-12T09:00:00Z", endedAt: "2026-05-12T11:00:00Z", status: "ENDED" },
  { id: 2, projectId: 1, title: "기술 스택 결정 회의", startedAt: "2026-05-13T09:00:00Z", endedAt: "2026-05-13T10:30:00Z", status: "ENDED" },
  { id: 3, projectId: 1, title: "배포 전략 회의", startedAt: "2026-05-13T14:00:00Z", endedAt: null, status: "IN_PROGRESS" },
];

export const MOCK_WORK_LOGS: WorkLog[] = [
  { id: 1, assigneeName: "chan", task: "Discord OAuth 로그인 구현", dueDate: "2026-05-15T00:00:00Z", status: "IN_PROGRESS" },
  { id: 2, assigneeName: "팀원A", task: "WebSocket STOMP 연동", dueDate: "2026-05-14T00:00:00Z", status: "DONE" },
  { id: 3, assigneeName: "팀원B", task: "AI 요약 API 연동", dueDate: "2026-05-16T00:00:00Z", status: "TODO" },
  { id: 4, assigneeName: "chan", task: "프론트 Vercel 배포 설정", dueDate: "2026-05-14T00:00:00Z", status: "DONE" },
];

export const MOCK_ACTIVE_MEETING: ActiveMeeting = {
  meetingId: 99,
  title: "스프린트 데일리",
};

export const MOCK_MEETING_CONTEXT: MeetingContext = {
  startContext: {
    projectId: 1,
    projectName: "Flodi Backend",
    description: "Spring Boot 백엔드 API 서버.",
    techStack: "Java",
    recentDecisions: MOCK_DECISIONS,
    recentSummaries: [
      { id: 1, summary: "팀원 모두 킥오프 미팅에 참여했으며, 프로젝트 목표와 일정을 공유했습니다. 백엔드는 Spring Boot, 프론트는 React로 결정했습니다.", createdAt: "2026-05-12T11:00:00Z" },
    ],
    activeWorkLogs: MOCK_WORK_LOGS,
  },
  shortTerm: {
    rollingSummary: "현재 회의에서는 배포 전략과 CI/CD 파이프라인 구성에 대해 논의 중입니다. GitHub Actions + Vercel 조합으로 프론트를 배포하고, 백엔드는 AWS EC2 + Docker로 Blue/Green 배포를 진행하기로 했습니다.",
    recentUtterances: [
      { speakerName: "chan", content: "Vercel에 환경변수 설정하면 배포 끝나죠?", speechStartedAt: "2026-05-13T14:05:00Z" },
      { speakerName: "팀원A", content: "네, VITE_API_BASE_URL만 넣으면 자동으로 빌드해요.", speechStartedAt: "2026-05-13T14:05:30Z" },
      { speakerName: "팀원B", content: "백엔드 HTTPS는 Nginx Proxy Manager로 처리하면 될 것 같아요.", speechStartedAt: "2026-05-13T14:06:00Z" },
      { speakerName: "chan", content: "그럼 도메인 연결은 누가 담당할까요?", speechStartedAt: "2026-05-13T14:06:30Z" },
    ],
  },
};
