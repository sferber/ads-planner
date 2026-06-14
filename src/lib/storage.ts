import type { StateStorage } from "zustand/middleware";

/**
 * Persistenz-Schicht für die App.
 *
 * Auf iOS ist reines localStorage im installierten PWA-Kontext unzuverlässig
 * (kann beim Schließen verworfen werden). IndexedDB ist dort deutlich
 * langlebiger. Diese Schicht nutzt primär IndexedDB und spiegelt zusätzlich
 * nach localStorage – so überlebt mindestens einer der beiden Speicher.
 *
 * Beim Lesen wird zuerst IndexedDB versucht, dann localStorage (Migration
 * bestehender Daten aus älteren Versionen passiert dabei automatisch).
 */

const DB_NAME = "fokusplan";
const STORE_NAME = "keyval";

let dbPromise: Promise<IDBDatabase> | null = null;

function hasIDB(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDel(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* localStorage evtl. nicht verfügbar – ignorieren */
  }
}

function lsDel(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignorieren */
  }
}

export const durableStorage: StateStorage = {
  getItem: async (name) => {
    if (hasIDB()) {
      try {
        const fromIdb = await idbGet(name);
        if (fromIdb != null) return fromIdb;
        // Migration aus localStorage (ältere Versionen / Backup)
        const legacy = lsGet(name);
        if (legacy != null) {
          await idbSet(name, legacy).catch(() => {});
          return legacy;
        }
        return null;
      } catch {
        // IndexedDB nicht nutzbar – auf localStorage zurückfallen
        return lsGet(name);
      }
    }
    return lsGet(name);
  },

  setItem: async (name, value) => {
    if (hasIDB()) {
      try {
        await idbSet(name, value);
      } catch {
        /* ignorieren, Spiegel unten greift */
      }
    }
    // Immer zusätzlich nach localStorage spiegeln (Backup)
    lsSet(name, value);
  },

  removeItem: async (name) => {
    if (hasIDB()) {
      try {
        await idbDel(name);
      } catch {
        /* ignorieren */
      }
    }
    lsDel(name);
  },
};
