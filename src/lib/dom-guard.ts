/**
 * DOM ownership guard.
 *
 * React removes the nodes it owns by calling `parent.removeChild(child)`. If
 * anything else in the page detached or moved that node first — a browser
 * extension, the host preview harness re-serialising `<body>`, or a
 * screenshot/HTML-serialisation tool — the browser throws
 *
 *   NotFoundError: Failed to execute 'removeChild' on 'Node':
 *   The node to be removed is not a child of this node.
 *
 * That error is thrown inside React's commit phase (`removeChildFromContainer`
 * → `commitDeletionEffectsOnFiber`), and an uncaught commit-phase error makes
 * React unmount the entire tree — the whole app disappears over a node that is
 * *already gone*.
 *
 * This installs a minimal guard: if the node is no longer a child, the removal
 * is already effectively done, so we log it and return instead of throwing.
 * Real removals are untouched (they still call the native method).
 */

type GuardedRemoveChild = (<T extends Node>(child: T) => T) & {
  __glassmedGuarded?: true;
};

let installed = false;

export function installRemoveChildGuard(): void {
  if (installed || typeof Node === "undefined") return;
  installed = true;

  const nativeRemoveChild = Node.prototype.removeChild as GuardedRemoveChild;
  if (nativeRemoveChild.__glassmedGuarded) return;

  const guarded = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      // The node was already detached (or never inserted here). Removing it is
      // a no-op; throwing here would abort React's commit and unmount the app.
      if (import.meta.env.DEV) {
        const describe = (node: Node) => {
          const id = (node as Node & { id?: string }).id;
          return id ? `${node.nodeName}#${id}` : node.nodeName;
        };
        console.warn(
          "[GlassMed] Skipped removing a node that is no longer a child of its container.",
          { container: describe(this), child: describe(child) },
        );
      }
      return child;
    }
    return nativeRemoveChild.call(this, child) as T;
  } as GuardedRemoveChild;
  guarded.__glassmedGuarded = true;

  Node.prototype.removeChild = guarded;
}
