/**
 * DentiSpark Offline Cache
 * Lightweight IndexedDB wrapper for offline-first data caching.
 */

const DB_NAME = "dentispark-offline";
const DB_VERSION = 1;

const STORES = {
  RESOURCES: "resources",
  PROGRESS: "progress",
  MILESTONES: "milestones",
  AI_SESSIONS: "ai-sessions",
};

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function cacheWrite<T extends { id: string }>(
  store: keyof typeof STORES,
  data: T
): Promise<void> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORES[store], "readwrite");
    tx.objectStore(STORES[store]).put({ ...data, cachedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function cacheRead<T>(
  store: keyof typeof STORES,
  id: string
): Promise<T | null> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORES[store], "readonly");
    const req = tx.objectStore(STORES[store]).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheReadAll<T>(
  store: keyof typeof STORES
): Promise<T[]> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORES[store], "readonly");
    const req = tx.objectStore(STORES[store]).getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheClear(store: keyof typeof STORES): Promise<void> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORES[store], "readwrite");
    tx.objectStore(STORES[store]).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export { STORES };
