import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { buildLoginPath } from "./lib/authRedirect";
import "./styles/globals.css";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if ((error as { status?: number }).status === 401) {
        window.location.href = buildLoginPath();
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
