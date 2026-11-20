/**
 * Module-level signal that the initial auth check has completed.
 *
 * Lives outside the SplashScreen component module so that file only exports
 * React components (required by React Fast Refresh). `useAuth` calls
 * `signalAuthReady()` once the session resolves; the splash screen subscribes
 * to dismiss early on fast connections.
 */

let authReady = false;
const listeners = new Set<() => void>();

/** True once the initial session check has resolved. */
export function isAuthReady(): boolean {
  return authReady;
}

/** Called by useAuth once the initial session check resolves. */
export function signalAuthReady(): void {
  if (authReady) return;
  authReady = true;
  for (const fn of [...listeners]) fn();
  listeners.clear();
}

/**
 * Run `callback` when auth becomes ready (immediately if it already is).
 * Returns an unsubscribe function.
 */
export function onAuthReady(callback: () => void): () => void {
  if (authReady) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
