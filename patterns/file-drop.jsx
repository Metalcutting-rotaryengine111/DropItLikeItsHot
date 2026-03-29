/**
 * 🔥 DropItLikeItsHot - Pattern 1: Basic File Drop
 *
 * The most basic file drag-and-drop.
 * These 4 events are everything you need for drag-and-drop.
 *
 * Usage: Just copy-paste.
 */

const FileDropZone = ({ onFiles, accept = '*' }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const filterFiles = (files) => {
    if (accept === '*') return files;
    const exts = accept.split(',').map(e => e.trim().toLowerCase());
    return files.filter(f => exts.some(ext => f.name.toLowerCase().endsWith(ext)));
  };

  return (
    <div
      style={{
        border: `2px dashed ${isDragOver ? '#f59e0b' : '#4b5563'}`,
        borderRadius: '16px',
        padding: '40px 20px',
        textAlign: 'center',
        background: isDragOver ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      // ═══════════════════════════════════════════════
      // 🔥 The 4 core events — don't skip a single one
      // ═══════════════════════════════════════════════
      onDragOver={(e) => {
        e.preventDefault();       // ← Without this, the drop itself gets blocked
        e.stopPropagation();      // ← Without this, parent elements steal the event
        setIsDragOver(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        // ← Without the contains check, it flickers every time you pass over child elements
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();       // ← Without this, the browser opens the file directly
        e.stopPropagation();
        setIsDragOver(false);
        const files = filterFiles(Array.from(e.dataTransfer.files));
        if (files.length > 0) onFiles(files);
      }}
    >
      <p style={{ fontSize: '32px', marginBottom: '8px' }}>
        {isDragOver ? '🔥' : '📁'}
      </p>
      <p style={{ color: isDragOver ? '#f59e0b' : '#9ca3af' }}>
        {isDragOver ? 'Drop it!' : 'Drag files here'}
      </p>
      <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
        {accept === '*' ? 'All file types supported' : accept}
      </p>
    </div>
  );
};

// Usage example:
// <FileDropZone
//   accept=".mp3,.wav,.flac,.m4a"
//   onFiles={(files) => console.log('Dropped:', files)}
// />
