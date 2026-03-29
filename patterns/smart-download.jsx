/**
 * 🔥 DropItLikeItsHot - Pattern 6: Smart Download
 *
 * Downloads a blob URL file with a meaningful filename.
 * Converts the original filename to a custom format.
 *
 * e.g. "audio_2024_001.mp3" → "Teeny-Tiny Heart_UFC_Pitched by MC.mp3"
 */

const smartDownload = (fileUrl, { title, artist, label, originalFileName }) => {
  if (!fileUrl) return;

  // Extract original file extension
  const ext = (originalFileName || '').match(/\.[^.]+$/)?.[0] || '.mp3';

  // Strip characters that are illegal in filenames
  const safe = (str) => (str || 'Unknown').replace(/[<>:"/\\|?*]/g, '_').trim();

  // Download
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = `${safe(title)}_${safe(artist)}_${safe(label)}${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Usage example:
//
// smartDownload(item.fileUrl, {
//   title: 'Teeny-Tiny Heart',
//   artist: 'UFC',
//   label: 'Pitched by MC',
//   originalFileName: 'track001.mp3',
// });
//
// → Downloads as: "Teeny-Tiny Heart_UFC_Pitched by MC.mp3"


// ═══════════════════════════════════════════
// Custom format examples
// ═══════════════════════════════════════════

// With date:
// a.download = `${safe(title)}_${new Date().toISOString().slice(0,10)}${ext}`;
// → "My Song_2024-03-15.mp3"

// With track number:
// a.download = `${String(index+1).padStart(2,'0')}_${safe(title)}${ext}`;
// → "01_My Song.mp3"

// With folder hint:
// a.download = `${safe(genre)}__${safe(title)}_${safe(artist)}${ext}`;
// → "Pop__My Song_John.mp3"
