import { Bot } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { apiBaseUrl } from "../api/client";
import { isSafeRedirectPath } from "../lib/authRedirect";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const loginHref = useMemo(() => {
    const redirect = searchParams.get("redirect");
    if (!isSafeRedirectPath(redirect)) return `${apiBaseUrl}/auth/v1/discord`;

    const params = new URLSearchParams({ redirect });
    return `${apiBaseUrl}/auth/v1/discord?${params.toString()}`;
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#303049] bg-[#12121C] p-8 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#3B82F6]/90 via-[#A78BFA]/90 to-[#F9A8D4]/90 text-white shadow-[0_0_24px_rgba(167,139,250,0.24)]">
            <Bot size={24} />
          </div>
          <h1 className="text-xl font-semibold tracking-[0.08em] text-[#F8FAFC]">FLODI</h1>
          <p className="text-center text-sm leading-6 text-[#CBD5E1]">
            Discord 계정으로 로그인하면 봇이 참여한 서버의 프로젝트와 회의를 확인할 수 있습니다.
          </p>
        </div>
        <a href={loginHref}>
          <Button className="w-full border-0 bg-linear-to-r from-[#3B82F6] via-[#A78BFA] to-[#F9A8D4] text-white shadow-[0_0_24px_rgba(167,139,250,0.32)] outline-none hover:border-0 hover:from-[#60A5FA] hover:via-[#C4B5FD] hover:to-[#F9A8D4] focus:outline-none focus-visible:outline-none focus-visible:ring-0">
            Discord로 로그인
          </Button>
        </a>
      </div>
    </div>
  );
}
