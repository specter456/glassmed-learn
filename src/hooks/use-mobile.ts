import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function useIsMobile() {
  // useSyncExternalStore replaces the effect+setState pattern: the snapshot
  // is read during render (no flash of the wrong value) and re-read whenever
  // matchMedia fires. Boolean snapshots are compared by value, so this never
  // loops. The third arg is the server snapshot (SSR safe — desktop default).
  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  )
}
