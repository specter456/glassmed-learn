import '@vly-ai/integrations';
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Flashcards = lazy(() => import("./pages/Flashcards.tsx"));
const Basics = lazy(() => import("./pages/Basics.tsx"));
const Game = lazy(() => import("./pages/Game.tsx"));
const Research = lazy(() => import("./pages/Research.tsx"));
const Assistant = lazy(() => import("./pages/Assistant.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

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
  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
    unsavedChangesWarning: false,
  });

  return (
    <RootErrorBoundary>
      <StrictMode>
        <ConvexAuthProvider client={convex}>
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <RouteSyncer />
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
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/flashcards"
                    element={
                      <RequireAuth>
                        <Flashcards />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/basics"
                    element={
                      <RequireAuth>
                        <Basics />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/game"
                    element={
                      <RequireAuth>
                        <Game />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/research"
                    element={
                      <RequireAuth>
                        <Research />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/assistant"
                    element={
                      <RequireAuth>
                        <Assistant />
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

createRoot(document.getElementById("root")!).render(<App />);
