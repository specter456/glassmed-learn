import { useAuth } from "@/hooks/use-auth";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

function AuthSkeleton() {
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pt-24">
        <div className="glass-panel flex w-full flex-col gap-4 rounded-3xl p-6">
          <div className="skeleton mx-auto size-16 rounded-2xl" />
          <div className="skeleton h-5 w-3/4 rounded-md" />
          <div className="skeleton h-4 w-1/2 rounded-md" />
          <div className="mt-2 flex gap-2">
            <div className="skeleton h-9 flex-1 rounded-lg" />
            <div className="skeleton h-9 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthSkeleton />;
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return children;
}
