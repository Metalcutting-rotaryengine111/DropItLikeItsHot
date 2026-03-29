/**
 * 🔥 DropItLikeItsHot - Pattern 5: Backup & Restore
 *
 * Back up IndexedDB data to JSON and restore it.
 * File data is converted to base64 and embedded in the JSON.
 *
 * ⚠️ If you have lots of files, the JSON can be hundreds of MB.
 *    Show a "please wait" toast before starting the backup.
 */

// 💾 Backup: IndexedDB → base64 → download as JSON file
const handleBackup = async (items, FileDB) => {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    items: [],
  };

  for (const item of items) {
    const entry = { ...item };
    delete entry.fileUrl;  // blob URLs change every session, can't be saved

    try {
      const db = await FileDB.open();
      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction(FileDB.STORE_NAME, 'readonly');
        const req = tx.objectStore(FileDB.STORE_NAME).get(item.id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (record?.data) {
        // ArrayBuffer → Blob → base64 data URL
        const blob = new Blob([record.data], { type: record.type || 'application/octet-stream' });
        const reader = new FileReader();
        entry.fileData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }
    } catch (e) {
      console.warn('Backup error for', item.id, e);
    }

    backup.items.push(entry);
  }

  // JSON → Blob → download
  const json = JSON.stringify(backup);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  return backup.items.length;
};


// 📥 Restore: JSON file → base64 → IndexedDB
const handleRestore = async (existingItems, setItems, FileDB) => {
  // Open file picker dialog
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.items || !Array.isArray(backup.items)) {
        throw new Error('Invalid backup format');
      }

      let count = 0;
      for (const entry of backup.items) {
        // Skip duplicates
        if (existingItems.some(it => it.id === entry.id)) continue;

        if (entry.fileData) {
          // base64 data URL → Blob → IndexedDB
          const resp = await fetch(entry.fileData);
          const blob = await resp.blob();
          await FileDB.saveFile(entry.id, blob);
          entry.fileUrl = URL.createObjectURL(blob);
          delete entry.fileData;
        }

        count++;
        setItems(prev => [...prev, entry]);
      }

      alert(`${count} item(s) restored!`);
    } catch (err) {
      alert('Restore failed: ' + err.message);
    }
  };

  input.click();
};

// Usage examples:
//
// Backup:
// const count = await handleBackup(myItems, FileDB);
// alert(`${count} item(s) backed up!`);
//
// Restore:
// handleRestore(myItems, setMyItems, FileDB);
