import "@vly-ai/integrations";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";
import { LoginCelebration } from "@/components/Celebration";
import { RequireAuth } from "@/components/RequireAuth";
import { SplashScreen } from "@/components/SplashScreen";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

/* ------------------------------------------------------------------ */
/* Convex client — module-level singleton. Creating the client inside  */
/* the App render would construct a fresh client (and a fresh         */
/* websocket) on every render, and twice under StrictMode's double    */
/* render. One instance, created once, is the documented pattern.     */
/* ------------------------------------------------------------------ */
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  unsavedChangesWarning: false,
});

/* ------------------------------------------------------------------ */
/* Resilient lazy routes                                              */
/*                                                                     */
/* The preview/dev server restarts and file-syncs invalidate the       */
/* browser's module graph, which makes `import()` reject with          */
/* "Failed to fetch dynamically imported module". That's a *transient* */
/* failure — the module itself is fine. We:                            */
/*   1. retry with exponential backoff (the dev server is usually      */
/*      back within a few seconds),                                    */
/*   2. if every retry fails, do ONE full page reload per session to   */
/*      fetch a fresh module graph — the guard is a URL marker, so it  */
/*      survives the reload even when sessionStorage is sandboxed,     */
/*   3. never loop: a genuinely broken route falls through to the      */
/*      error screen instead of reloading forever.                     */
/* ------------------------------------------------------------------ */

const ROUTE_RELOAD_MARK = "gmreload";
const ROUTE_RETRIES = 4;

// Raw import factories — also used by `preloadRoutes()` to warm the
// module graph in the background so navigation never hits a cold import.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- same looseness as lazy() itself
const routeFactories: Array<() => Promise<{ default: React.ComponentType<any> }>> = [
  () => import("./pages/Landing.tsx"),
  () => import("./pages/Auth.tsx"),
  () => import("./pages/Dashboard.tsx"),
  () => import("./pages/Flashcards.tsx"),
  () => import("./pages/Basics.tsx"),
  () => import("./pages/Game.tsx"),
  () => import("./pages/Research.tsx"),
  () => import("./pages/Assistant.tsx"),
  () => import("./pages/Diagrams.tsx"),
  () => import("./pages/NotFound.tsx"),
];

/** One full reload per session, guarded by a URL marker so it can't loop. */
function reloadOnce(): boolean {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get(ROUTE_RELOAD_MARK) === "1") return false;
    url.searchParams.set(ROUTE_RELOAD_MARK, "1");
    window.history.replaceState(window.history.state, "", url.toString());
    window.location.reload();
    return true;
  } catch {
    // URL manipulation unavailable — fall back to sessionStorage, and if
    // that's sandboxed too, allow the single reload anyway.
    try {
      if (sessionStorage.getItem("glassmed-lazy-reload") === "1") return false;
      sessionStorage.setItem("glassmed-lazy-reload", "1");
    } catch {
      /* storage blocked — proceed with the one reload */
    }
    window.location.reload();
    return true;
  }
}

/** Import a route module, retrying transient failures with backoff. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- React.lazy requires ComponentType<any>
async function importWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): Promise<{ default: T }> {
  let lastError: unknown;
  for (let i = 0; i <= ROUTE_RETRIES; i++) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;
      console.warn(
        `[GlassMed] Lazy route load failed (attempt ${i + 1}/${ROUTE_RETRIES + 1}):`,
        error,
      );
      if (i < ROUTE_RETRIES) {
        // 0.5s → 1s → 2s → 4s — enough to ride out a dev-server restart.
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** i));
      }
    }
  }
  if (reloadOnce()) {
    // The reload navigation tears this document down; keep the promise
    // pending so React's Suspense just keeps showing the loader meanwhile.
    return new Promise<{ default: T }>(() => {});
  }
  throw lastError;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- React.lazy requires ComponentType<any>
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  return lazy(() => importWithRetry(factory));
}

/** Remove the ?gmreload=1 marker once the app has booted cleanly. */
function stripReloadMarker() {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(ROUTE_RELOAD_MARK)) return;
    url.searchParams.delete(ROUTE_RELOAD_MARK);
    window.history.replaceState(window.history.state, "", url.toString());
  } catch {
    /* ignore — cosmetic only */
  }
}

/** Warm every route chunk in the background so navigating never triggers a
 *  cold dynamic import during a flaky window. Failures are swallowed here;
 *  a real navigation retries through lazyWithRetry's own logic. */
function preloadRoutes() {
  const schedule =
    (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
      .requestIdleCallback?.bind(window) ??
    ((cb: () => void) => setTimeout(cb, 1));
  schedule(() => {
    for (const factory of routeFactories) {
      factory().catch(() => {
        /* retried on real navigation via lazyWithRetry */
      });
    }
  });
}

const Landing = lazyWithRetry(() => import("./pages/Landing.tsx"));
const AuthPage = lazyWithRetry(() => import("./pages/Auth.tsx"));
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard.tsx"));
const Flashcards = lazyWithRetry(() => import("./pages/Flashcards.tsx"));
const Basics = lazyWithRetry(() => import("./pages/Basics.tsx"));
const Game = lazyWithRetry(() => import("./pages/Game.tsx"));
const Research = lazyWithRetry(() => import("./pages/Research.tsx"));
const Assistant = lazyWithRetry(() => import("./pages/Assistant.tsx"));
const Diagrams = lazyWithRetry(() => import("./pages/Diagrams.tsx"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound.tsx"));

/** Shared shell for authenticated pages: page content + the fixed bottom
 *  navigation bar. */
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

// Skeleton fallback for route transitions
function RouteLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="skeleton size-16 rounded-2xl" />
      <div className="skeleton h-4 w-40 rounded-md" />
      <div className="skeleton h-3 w-56 rounded-md" />
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message, stack: error.stack ?? "" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#0e1233",
            color: "#fdf5e6",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <p style={{ fontSize: 40, margin: "0 0 8px" }}>🩺</p>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, opacity: 0.75, margin: "0 0 12px", wordBreak: "break-word" }}>
              {this.state.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "#fdf5e6",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Reload
            </button>
            {this.state.stack && (
              <pre
                style={{
                  marginTop: 16,
                  textAlign: "left",
                  fontSize: 11,
                  opacity: 0.5,
                  maxHeight: 160,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Last-resort guard against the blank white tab: React 19 unmounts the whole
 *  root on an uncaught error inside an effect, which no error boundary can
 *  catch. This plain-DOM guard is installed outside React (so it survives the
 *  unmount) and swaps in a branded screen with the real error message plus a
 *  reload. Listens to script errors only — unhandled promise rejections are
 *  logged, not blocked, so benign failures never cover the app. */
function installCrashGuard() {
  const w = window as unknown as { __glassmedCrashGuardInstalled?: boolean };
  if (w.__glassmedCrashGuardInstalled) return;
  w.__glassmedCrashGuardInstalled = true;

  const show = (message: string) => {
    if (document.getElementById("glassmed-crash-guard")) return;
    const overlay = document.createElement("div");
    overlay.id = "glassmed-crash-guard";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:#0e1233;color:#fdf5e6;font-family:system-ui,sans-serif;";
    const card = document.createElement("div");
    card.style.cssText = "max-width:520px;text-align:center;";

    const emoji = document.createElement("p");
    emoji.textContent = "🩺";
    emoji.style.cssText = "font-size:40px;margin:0 0 8px;";
    const title = document.createElement("h1");
    title.textContent = "Something went wrong";
    title.style.cssText = "font-size:18px;font-weight:700;margin:0 0 8px;";
    const body = document.createElement("p");
    body.textContent = message || "An unexpected error occurred.";
    body.style.cssText =
      "font-size:14px;opacity:0.75;margin:0 0 12px;word-break:break-word;";

    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px;justify-content:center;";
    const reload = document.createElement("button");
    reload.textContent = "Reload";
    reload.style.cssText =
      "padding:8px 18px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:#fdf5e6;cursor:pointer;font-size:14px;";
    reload.onclick = () => window.location.reload();
    const dismiss = document.createElement("button");
    dismiss.textContent = "Dismiss";
    dismiss.style.cssText =
      "padding:8px 18px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fdf5e6;cursor:pointer;font-size:14px;";
    dismiss.onclick = () => overlay.remove();

    row.append(reload, dismiss);
    card.append(emoji, title, body, row);
    overlay.append(card);
    document.body.append(overlay);
  };

  window.addEventListener("error", (e) => show(e.message));
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    console.warn(
      "[GlassMed] Unhandled promise rejection:",
      reason instanceof Error ? reason.message : reason,
    );
  });
}

/** Sends route changes to the parent frame (if any) so the preview toolbar can
 *  track the current screen. */
function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    try {
      window.parent?.postMessage({ type: "vly-route-change", path: location.pathname }, "*");
    } catch {
      /* cross-origin parent — ignore */
    }
  }, [location.pathname]);
  return null;
}

function App() {
  // PWA installability: register the service worker in production builds
  // (dev keeps the module graph untouched so previews stay snappy).
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[GlassMed] Service worker registration failed:", err);
    });
  }, []);

  return (
    <RootErrorBoundary>
      <StrictMode>
        <ConvexAuthProvider client={convex}>
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <RouteSyncer />
              <SplashScreen />
              <LoginCelebration />
              <ToolbarErrorBoundary>
                <VlyToolbar />
              </ToolbarErrorBoundary>
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route
                    path="/auth"
                    element={<AuthPage redirectAfterAuth="/dashboard" />}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Dashboard />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/flashcards"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Flashcards />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/basics"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Basics />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/game"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Game />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/research"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Research />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/assistant"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Assistant />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/diagrams"
                    element={
                      <RequireAuth>
                        <ProtectedLayout>
                          <Diagrams />
                        </ProtectedLayout>
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </MotionConfig>
          <Toaster />
        </ConvexAuthProvider>
      </StrictMode>
    </RootErrorBoundary>
  );
}

stripReloadMarker();
preloadRoutes();
installCrashGuard();
createRoot(document.getElementById("root")!).render(<App />);
