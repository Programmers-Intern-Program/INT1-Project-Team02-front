import { ShieldX } from "lucide-react";
import { apiBaseUrl } from "../api/client";
import { Button } from "../components/ui/Button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#303049] bg-[#12121C] p-8 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-[#F9A8D4]/50 bg-[#F9A8D4]/12 text-[#FBCFE8]">
            <ShieldX size={24} />
          </div>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">접근 불가</h1>
          <p className="text-center text-sm leading-6 text-[#CBD5E1]">
            Flodi 봇이 참여한 Discord 서버의 멤버만 사용할 수 있습니다. 서버에 봇을 초대한 뒤 다시 시도해 주세요.
          </p>
        </div>
        <a href={`${apiBaseUrl}/auth/v1/discord`}>
          <Button className="w-full">다시 로그인</Button>
        </a>
      </div>
    </div>
  );
}
