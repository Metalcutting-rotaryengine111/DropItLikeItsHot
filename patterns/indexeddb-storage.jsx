/**
 * 🔥 DropItLikeItsHot - Pattern 4: IndexedDB File Storage
 *
 * localStorage has a 5MB limit, so it can't store files.
 * IndexedDB can handle hundreds of MB with no sweat.
 *
 * Use this pattern when you need to permanently store
 * large files like audio, images, or video in the browser.
 */

const FileDB = {
  DB_NAME: 'MyAppFiles',
  STORE_NAME: 'files',
  DB_VERSION: 1,

  // Open the DB (auto-creates if it doesn't exist)
  open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  // Save a file
  async saveFile(id, file) {
    const db = await this.open();
    const buffer = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).put({
        id,
        data: buffer,
        type: file.type || 'application/octet-stream',
        name: file.name,
        size: file.size,
        savedAt: new Date().toISOString(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // Get a file as a blob URL (for audio playback, image display, etc.)
  async getFileURL(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const req = tx.objectStore(this.STORE_NAME).get(id);
      req.onsuccess = () => {
        if (!req.result) return resolve(null);
        const blob = new Blob([req.result.data], { type: req.result.type });
        resolve(URL.createObjectURL(blob));
      };
      req.onerror = () => reject(req.error);
    });
  },

  // Delete a file
  async deleteFile(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // List all files (metadata only)
  async listFiles() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const req = tx.objectStore(this.STORE_NAME).getAll();
      req.onsuccess = () => {
        resolve(req.result.map(r => ({
          id: r.id, name: r.name, type: r.type,
          size: r.size, savedAt: r.savedAt,
        })));
      };
      req.onerror = () => reject(req.error);
    });
  },
};

// Usage examples:
//
// Save:
// await FileDB.saveFile('song-001', audioFile);
//
// Play:
// const url = await FileDB.getFileURL('song-001');
// audioElement.src = url;
//
// Delete:
// await FileDB.deleteFile('song-001');
