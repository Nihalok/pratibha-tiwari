/**
 * storage-helper.ts
 * Safe wrapper for localStorage to handle sandbox/iframe restrictions gracefully.
 */

const memoryStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (_e) {
      return memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (_e) {
      memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (_e) {
      delete memoryStorage[key];
    }
  }
};
