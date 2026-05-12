import { ShieldX } from "lucide-react";
import { apiBaseUrl } from "../api/client";
import { Button } from "../components/ui/Button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <ShieldX size={24} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">접근 불가</h1>
          <p className="text-center text-sm text-slate-500">
            Flodi 봇이 참여한 Discord 서버의 멤버만 사용할 수 있습니다. 서버에 봇을 초대한 후 다시 시도해주세요.
          </p>
        </div>
        <a href={`${apiBaseUrl}/auth/v1/discord`}>
          <Button className="w-full">다시 로그인</Button>
        </a>
      </div>
    </div>
  );
}
