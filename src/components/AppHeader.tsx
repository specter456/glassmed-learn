import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GlassMedLockup } from "@/components/GlassMedLogo";
import { ArrowLeft, LogOut, Store } from "lucide-react";
import { useNavigate } from "react-router";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AppHeader({ title, subtitle, onBack }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? (user?.isAnonymous ? "Guest" : "");

  return (
    <header className="sticky top-0 z-[60] px-4 pt-4 sm:px-6">
      <div className="glass-panel shine mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={handleBack}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-wistaria transition-all hover:bg-white/20"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button onClick={() => navigate("/dashboard")} aria-label="Go home">
            <GlassMedLockup />
          </button>
          {title && (
            <div className="ml-2 hidden min-w-0 flex-col sm:flex">
              <span className="truncate text-sm font-bold leading-tight">{title}</span>
              {subtitle && (
                <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/catalog")}
            className="gap-1.5 font-mono text-xs tracking-wide text-muted-foreground"
          >
            <Store className="size-3.5" />
            Catalog
          </Button>
          {firstName && (
            <span className="hidden text-sm font-semibold text-muted-foreground md:block">
              {firstName}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-1.5 text-muted-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
