const DB_NAME = "ism-gap-analyser";
const STORE = "catalogs";
const DB_VERSION = 1;
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1h

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      const result = fn(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

function req(r) {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export async function cacheGet(key) {
  try {
    const db = await openDB();
    try {
      return await req(db.transaction(STORE, "readonly").objectStore(STORE).get(key));
    } finally {
      db.close();
    }
  } catch {
    return undefined;
  }
}

export async function cachePut(key, entry) {
  try {
    await withStore("readwrite", (store) => store.put(entry, key));
  } catch {
    // quota / unavailable — ignore
  }
}

export async function cacheClear() {
  try {
    await withStore("readwrite", (store) => store.clear());
  } catch {
    // ignore
  }
}

export function isFresh(entry, ttlMs = DEFAULT_TTL_MS) {
  if (!entry || !entry.cachedAt) return false;
  return Date.now() - entry.cachedAt < ttlMs;
}
