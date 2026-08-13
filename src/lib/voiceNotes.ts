/**
 * Tiny IndexedDB-backed store for the user's voice memos.
 *
 * Recordings are stored as Blobs in the browser's IndexedDB — audio never
 * leaves the device and nothing is uploaded. Falls back to an in-memory
 * (session-only) list when IndexedDB is unavailable by rejecting; callers
 * surface that gracefully.
 */

export interface VoiceNoteRecord {
  id: string;
  name: string;
  durationSec: number;
  createdAt: number;
  blob: Blob;
}

const DB_NAME = "glassmed-voice-notes";
const STORE_NAME = "notes";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Storage unavailable in this browser"));
      return;
    }
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, 1);
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Could not open storage"));
      return;
    }
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open storage"));
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction(STORE_NAME, mode);
        } catch (err) {
          db.close();
          reject(err instanceof Error ? err : new Error("Storage unavailable"));
          return;
        }
        const request = run(tx.objectStore(STORE_NAME));
        request.onsuccess = () => {
          db.close();
          resolve(request.result);
        };
        request.onerror = () => {
          db.close();
          reject(request.error ?? new Error("Storage operation failed"));
        };
      }),
  );
}

/** All saved notes (newest last — sort at the call site). */
export function listVoiceNotes(): Promise<VoiceNoteRecord[]> {
  return withStore("readonly", (store) => store.getAll() as IDBRequest<VoiceNoteRecord[]>);
}

export function saveVoiceNote(note: VoiceNoteRecord): Promise<void> {
  return withStore(
    "readwrite",
    (store) => store.put(note) as unknown as IDBRequest<undefined>,
  );
}

export function deleteVoiceNote(id: string): Promise<void> {
  return withStore(
    "readwrite",
    (store) => store.delete(id) as unknown as IDBRequest<undefined>,
  );
}
