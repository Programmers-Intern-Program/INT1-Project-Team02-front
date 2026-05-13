import { Bot } from "lucide-react";
import { apiBaseUrl } from "../api/client";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#303049] bg-[#12121C] p-8 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-[#A78BFA]/30 bg-linear-to-br from-[#3B82F6]/90 via-[#A78BFA]/90 to-[#F9A8D4]/90 text-white shadow-[0_0_24px_rgba(167,139,250,0.24)]">
            <Bot size={24} />
          </div>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Flodi</h1>
          <p className="text-center text-sm leading-6 text-[#CBD5E1]">
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
