/**
 * 🔥 DropItLikeItsHot - Pattern 2: Combo Upload (triple threat)
 *
 * Drag-and-drop + file picker + folder picker
 * The pattern AI gets wrong most often.
 *
 * ⚠️ Key: Always split into 2 separate inputs!
 *    If webkitdirectory is present, only folders can be selected.
 */

const ComboUpload = ({ onFiles, accept = '.mp3,.wav,.flac,.m4a' }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef(null);    // for individual files
  const folderInputRef = React.useRef(null);  // for folders

  const filterAudio = (files) => {
    const exts = accept.split(',').map(e => e.trim().toLowerCase());
    return Array.from(files).filter(f =>
      exts.some(ext => f.name.toLowerCase().endsWith(ext))
    );
  };

  const handleFiles = (fileList) => {
    const filtered = filterAudio(fileList);
    if (filtered.length > 0) onFiles(filtered);
  };

  return (
    <div>
      {/* Triple-threat layout */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>

        {/* 1️⃣ Drop zone */}
        <div
          style={{
            flex: 1,
            border: `2px dashed ${isDragOver ? '#f59e0b' : '#4b5563'}`,
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            background: isDragOver ? 'rgba(245,158,11,0.1)' : 'transparent',
            transition: 'all 0.2s',
          }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
          onDragLeave={(e) => { e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <p style={{ color: '#9ca3af', pointerEvents: 'none' }}>
            {isDragOver ? '🔥 Drop it!' : 'Drag files here'}
          </p>
        </div>

        {/* 2️⃣ File picker button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '12px 24px',
            borderRadius: '16px',
            background: '#f59e0b',
            color: '#000',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          🎵 Select Files
        </button>

        {/* 3️⃣ Folder picker button */}
        <button
          onClick={() => folderInputRef.current?.click()}
          style={{
            padding: '12px 24px',
            borderRadius: '16px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #4b5563',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          📂 Select Folder
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ⚠️ Two separate inputs — the part AI gets wrong most! */}
      {/* With webkitdirectory, only folders can be selected     */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* For file selection (no webkitdirectory) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {/* For folder selection (with webkitdirectory) */}
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        multiple
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
};
