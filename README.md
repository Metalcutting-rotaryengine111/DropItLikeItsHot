<p align="center">
  <img src="assets/drop-it-logo.svg" width="200" alt="DropItLikeItsHot Logo"/>
</p>

<h1 align="center">🔥 DropItLikeItsHot 🔥</h1>

<p align="center">
  <strong>"I've told my AI 10 times and drag & drop STILL doesn't work" — the cure.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/vibe--coding-first--aid-ff6b6b?style=for-the-badge" alt="Vibe Coding First Aid"/></a>
  <a href="#"><img src="https://img.shields.io/badge/drag%20%26%20drop-SOLVED-00d2ff?style=for-the-badge" alt="Drag & Drop Solved"/></a>
  <a href="#"><img src="https://img.shields.io/badge/copy%20%26%20paste-ready-7c3aed?style=for-the-badge" alt="Copy & Paste Ready"/></a>
  <a href="#"><img src="https://img.shields.io/badge/AI%20tested-battle--proven-f59e0b?style=for-the-badge" alt="AI Battle Proven"/></a>
</p>

<p align="center">
  <code>VSCode</code> · <code>Cursor</code> · <code>Windsurf</code> · <code>Terminal</code> · <code>Claude Code</code> · <code>Copilot</code>
</p>

---

## 😤 Sound familiar?

```
You: "Build me a drag and drop file upload"
AI:  "Done! Here you go ✨"
You: *drags file over*
You: ...
You: Nothing happens.
You: "It doesn't work."
AI:  "Oh sorry! I forgot preventDefault!"
You: *tries again*
You: Still broken.
AI:  "Added stopPropagation too!"
You: *10th message*
You: "WHY. WON'T. THIS. WORK."
```

**DropItLikeItsHot** was built for exactly that moment.

Instead of arguing with your AI for the 10th time,
just **copy-paste from here** and move on with your life. 🎤⬇️

---

## 🎯 What is this?

A **copy-paste reference** for vibe coders who keep getting stuck on drag & drop.

Every pattern here was extracted from **production code that actually works**.
Not theory. Not tutorials. **Battle-tested patterns.**

### What's Inside

| Pattern | Description | File |
|---------|-------------|------|
| 🎵 **File Drop** | Basic drag & drop for audio, images, any files | `patterns/file-drop.jsx` |
| 📂 **Folder Select** | Select an entire folder to batch-add files | `patterns/folder-select.jsx` |
| 🎯 **Combo Upload** | Drag & drop + file picker + folder picker (the holy trinity) | `patterns/combo-upload.jsx` |
| 💾 **IndexedDB Storage** | Store large files in the browser (bye bye 5MB localStorage limit) | `patterns/indexeddb-storage.jsx` |
| 🛡️ **Modal Drag Fix** | Fix the infuriating "modal closes when I select text" bug | `patterns/modal-drag-fix.jsx` |
| 📦 **Backup & Restore** | Export IndexedDB data to JSON and import it back | `patterns/backup-restore.jsx` |
| ⬇️ **Smart Download** | Download files with auto-formatted filenames | `patterns/smart-download.jsx` |

---

## 🚀 30-Second Quickstart

### 1. The Most Basic Drop Zone

```jsx
// Just copy-paste this. Seriously. This is it.
const DropZone = ({ onFilesDropped }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  return (
    <div
      style={{
        border: `2px dashed ${isDragOver ? '#f59e0b' : '#4b5563'}`,
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        background: isDragOver ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
        transition: 'all 0.2s ease',
      }}
      // 🔥 These 4 handlers are EVERYTHING. Miss one and it breaks.
      onDragOver={(e) => {
        e.preventDefault();      // ← Without this, drop is BLOCKED by browser
        e.stopPropagation();     // ← Without this, parent elements steal the event
        setIsDragOver(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        // ← Without this check, the zone flickers when hovering over children
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();      // ← Without this, the browser OPENS the file
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        onFilesDropped(files);
      }}
    >
      <p>{isDragOver ? '🔥 Drop it!' : '📁 Drag files here'}</p>
    </div>
  );
};
```

### 2. Why It Wasn't Working — At a Glance

```
❌ Broken                          ✅ Working
─────────────────────              ─────────────────────
onDrop={(e) => {                   onDrop={(e) => {
                                     e.preventDefault();  ← REQUIRED!
                                     e.stopPropagation(); ← REQUIRED!
  handleDrop(e);                     handleDrop(e);
}}                                 }}

No onDragOver handler              onDragOver={(e) => {
                                     e.preventDefault();  ← Without this,
                                   }}                       drop is IMPOSSIBLE!
```

---

## 🧩 Pattern Deep Dives

### Pattern 1: File + Folder + Drag — The Holy Trinity

When you ask AI to "build file upload," it usually gives you ONE method.
In reality, you need **all three:**

```jsx
// 🎯 You need 2 refs (one for files, one for folders)
const fileInputRef = React.useRef(null);
const folderInputRef = React.useRef(null);

// Button area
<div style={{ display: 'flex', gap: '12px' }}>
  {/* Drop zone */}
  <DropZone onFilesDropped={handleFiles} />

  {/* 🎵 Individual file picker */}
  <button onClick={() => fileInputRef.current?.click()}>
    🎵 Select Files
  </button>

  {/* 📂 Entire folder picker */}
  <button onClick={() => folderInputRef.current?.click()}>
    📂 Select Folder
  </button>
</div>

{/* ⚠️ You MUST use 2 separate inputs! webkitdirectory makes it folder-only */}
<input
  ref={fileInputRef}
  type="file"
  multiple
  accept=".mp3,.wav,.m4a,.flac"
  style={{ display: 'none' }}
  onChange={(e) => handleFiles(Array.from(e.target.files))}
/>
<input
  ref={folderInputRef}
  type="file"
  webkitdirectory=""
  multiple
  style={{ display: 'none' }}
  onChange={(e) => handleFiles(Array.from(e.target.files))}
/>
```

> 💡 **What AI gets wrong:** It puts `webkitdirectory` on the file input
> → Now you can ONLY select folders. **Always use 2 separate inputs!**

---

### Pattern 2: The "Modal Closes When I Select Text" Bug

This bug will drive you absolutely insane. You try to select text inside a modal, and the whole modal just... closes.

```
❌ Common mistake (onClick to close)
──────────────────────────────────
<div className="backdrop" onClick={() => closeModal()}>
  <div className="modal" onClick={(e) => e.stopPropagation()}>
    <input value={text} />  ← Drag to select text = MODAL CLOSES!
  </div>
</div>

Why: text drag → mouseup fires on backdrop → triggers click → modal closes
```

```jsx
// ✅ The fix: mousedown + mouseup combo
let backdropMouseDown = false;

<div className="backdrop"
  onMouseDown={(e) => {
    // Only track clicks that START on the backdrop
    backdropMouseDown = (e.target === e.currentTarget);
  }}
  onMouseUp={(e) => {
    // Only close if BOTH mousedown AND mouseup happened on backdrop
    if (backdropMouseDown && e.target === e.currentTarget) {
      closeModal();
    }
    backdropMouseDown = false;
  }}
>
  <div className="modal"
    onMouseDown={(e) => e.stopPropagation()}
    onMouseUp={(e) => e.stopPropagation()}
  >
    <input value={text} />  {/* ← Now you can safely drag to select! */}
  </div>
</div>
```

---

### Pattern 3: Storing Large Files in IndexedDB

localStorage caps out at 5MB — useless for audio, images, or video. IndexedDB handles hundreds of MBs.

```jsx
const FileDB = {
  DB_NAME: 'MyFilesDB',
  STORE_NAME: 'files',

  open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async saveFile(id, file) {
    const db = await this.open();
    const buffer = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).put({
        id, data: buffer, type: file.type, name: file.name
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

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
};
```

---

### Pattern 4: Backup & Restore (IndexedDB → JSON → IndexedDB)

```jsx
// 💾 Backup: IndexedDB → base64 → JSON download
const handleBackup = async (items) => {
  const backup = { version: 1, exportedAt: new Date().toISOString(), items: [] };

  for (const item of items) {
    const entry = { ...item };
    delete entry.fileUrl;  // blob URLs can't be saved

    const db = await FileDB.open();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(FileDB.STORE_NAME, 'readonly');
      const req = tx.objectStore(FileDB.STORE_NAME).get(item.id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (record?.data) {
      const blob = new Blob([record.data], { type: record.type });
      const reader = new FileReader();
      entry.audioData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    backup.items.push(entry);
  }

  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
};

// 📥 Restore: JSON → base64 → IndexedDB
const handleRestore = async (file, existingItems) => {
  const text = await file.text();
  const backup = JSON.parse(text);

  for (const entry of backup.items) {
    if (existingItems.some(it => it.id === entry.id)) continue;  // skip dupes

    if (entry.audioData) {
      const resp = await fetch(entry.audioData);  // base64 → blob
      const blob = await resp.blob();
      await FileDB.saveFile(entry.id, blob);
      entry.fileUrl = URL.createObjectURL(blob);
      delete entry.audioData;
    }
    // → add to your state
  }
};
```

---

### Pattern 5: Smart Filename Downloads

```jsx
// Download with meaningful filenames instead of "blob:http://..."
const handleDownload = (item) => {
  if (!item.fileUrl) return;

  const ext = (item.fileName || '').match(/\.[^.]+$/)?.[0] || '.mp3';
  // Strip characters that aren't allowed in filenames
  const safe = (str) => (str || 'Unknown').replace(/[<>:"/\\|?*]/g, '_');

  const a = document.createElement('a');
  a.href = item.fileUrl;
  a.download = `${safe(item.title)}_${safe(item.artist)}_${safe(item.label)}${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

---

## 🐛 Top 5 Mistakes AI Makes (Every. Single. Time.)

| # | Mistake | Symptom | Fix |
|---|---------|---------|-----|
| 1 | Missing `preventDefault()` on `onDragOver` | Drop literally doesn't work | Add `preventDefault` to all 4 drag events |
| 2 | Using one input for both files & folders | Can only select folders OR files, not both | Use 2 separate `<input>` elements |
| 3 | Using `onClick` to close modals | Modal closes when you try to select text | Use `onMouseDown` + `onMouseUp` combo |
| 4 | Putting ref'd input inside conditional render | Ref is null in other views, button does nothing | Place inputs where they always render |
| 5 | No `contains(relatedTarget)` check in `onDragLeave` | Drop zone flickers like a disco ball | Check if mouse actually left the zone |

---

## 📋 The Checklist

After your AI builds drag & drop, verify these **before** you lose your mind:

- [ ] Does `onDragOver` have `e.preventDefault()`?
- [ ] Does `onDrop` have both `e.preventDefault()` AND `e.stopPropagation()`?
- [ ] Does `onDragLeave` check `contains(relatedTarget)`?
- [ ] Are file input and folder input **separate** elements?
- [ ] Is the input ref placed **outside** any conditional rendering?
- [ ] If there's a modal, does it use `onMouseDown`/`onMouseUp` instead of `onClick`?

All boxes checked? Congratulations, you have a working drag & drop. 🎉

---

## 🎬 Real-World Usage

These patterns are extracted from a **production music demo management system** where they handle:

- Drag & drop audio file uploads (MP3, WAV, FLAC, M4A)
- IndexedDB storage for dozens of audio files (100MB+ total)
- JSON backup & restore for data protection
- Auto-formatted filenames for music industry pitching

---

## 🤝 Contributing

Found another drag & drop trap while vibe coding?
Send a PR! Save someone else from the same pain. 🙏

---

## 📜 License

MIT License — Copy-paste to your heart's content. That's literally why this exists.

---

<p align="center">
  <strong>Made with 😤 frustration and 🔥 determination</strong><br/>
  <em>"One copy-paste from here beats 10 conversations with your AI"</em>
</p>
