import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getMe } from "../../api/flodi";
import { buildLoginPath } from "../../lib/authRedirect";

export function AuthGuard() {
  const isDev = import.meta.env.DEV;
  const location = useLocation();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled: !isDev,
  });

  if (isDev) return <Outlet />;
  if (meQuery.isPending) return null;
  if (meQuery.isError) return <Navigate to={buildLoginPath(`${location.pathname}${location.search}`)} replace />;
  return <Outlet />;
}
