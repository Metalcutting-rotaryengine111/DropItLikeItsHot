/**
 * 🔥 DropItLikeItsHot - Pattern 7: Folder Select
 *
 * Select an entire folder and bulk-add all the files inside.
 * Uses the webkitdirectory attribute.
 *
 * ⚠️ Warning: an input with webkitdirectory can ONLY select folders.
 *    If you also need to pick individual files, split into 2 inputs!
 *    → See combo-upload.jsx
 */

const FolderSelect = ({ onFiles, accept = '.mp3,.wav,.flac,.m4a,.aiff' }) => {
  const folderInputRef = React.useRef(null);

  const handleChange = (e) => {
    const allFiles = Array.from(e.target.files || []);

    // Filter to only the desired extensions from all files in the folder
    const exts = accept.split(',').map(ext => ext.trim().toLowerCase());
    const filtered = allFiles.filter(f =>
      exts.some(ext => f.name.toLowerCase().endsWith(ext))
    );

    if (filtered.length > 0) {
      onFiles(filtered);
    } else {
      alert('No supported files found.');
    }

    // ⚠️ Reset value so the same folder can be selected again
    e.target.value = '';
  };

  return (
    <div>
      <button
        onClick={() => folderInputRef.current?.click()}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'transparent',
          color: '#e5e7eb',
          border: '1px solid #4b5563',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        📂 Select Folder
      </button>

      {/* ═══════════════════════════════════════════════ */}
      {/* webkitdirectory: opens a folder picker dialog  */}
      {/* Once set, individual file selection is disabled! */}
      {/* ═══════════════════════════════════════════════ */}
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        multiple
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};

// Usage example:
// <FolderSelect
//   accept=".mp3,.wav,.flac"
//   onFiles={(files) => {
//     console.log(`${files.length} file(s) selected`);
//     files.forEach(f => console.log(f.name, f.size));
//   }}
// />
