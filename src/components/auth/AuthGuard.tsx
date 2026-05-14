import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { getMe } from "../../api/flodi";

export function AuthGuard() {
  const isDev = import.meta.env.DEV;
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled: !isDev,
  });

  if (isDev) return <Outlet />;
  if (meQuery.isPending) return null;
  if (meQuery.isError) return <Navigate to="/login" replace />;
  return <Outlet />;
}
