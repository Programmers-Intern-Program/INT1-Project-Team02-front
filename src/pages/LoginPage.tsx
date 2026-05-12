import { Bot } from "lucide-react";
import { apiBaseUrl } from "../api/client";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Bot size={24} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Flodi</h1>
          <p className="text-center text-sm text-slate-500">
            Discord 계정으로 로그인하면 봇이 참여한 서버의 프로젝트와 회의를 확인할 수 있습니다.
          </p>
        </div>
        <a href={`${apiBaseUrl}/auth/v1/discord`}>
          <Button className="w-full">Discord로 로그인</Button>
        </a>
      </div>
    </div>
  );
}
