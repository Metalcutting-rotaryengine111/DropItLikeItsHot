/**
 * 🔥 DropItLikeItsHot - Pattern 3: Modal Drag Fix
 *
 * Fixes the bug where dragging text inside a modal closes it.
 * A lot of people have lost 3 hours to this one.
 *
 * Root cause: when closing the backdrop via onClick,
 *   text drag → mouseup fires on backdrop → click event fires → modal closes
 *
 * Fix: only close when BOTH mousedown AND mouseup happen on the backdrop
 */

const SafeModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  let backdropMouseDown = false;

  return (
    <div
      // backdrop
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
      }}
      // ═══════════════════════════════════════════════
      // ✅ Use onMouseDown + onMouseUp instead of onClick
      // ═══════════════════════════════════════════════
      onMouseDown={(e) => {
        // Only record clicks that started on the backdrop itself
        backdropMouseDown = (e.target === e.currentTarget);
      }}
      onMouseUp={(e) => {
        // mousedown on backdrop AND mouseup on backdrop → genuine backdrop click
        if (backdropMouseDown && e.target === e.currentTarget) {
          onClose();
        }
        backdropMouseDown = false;
      }}
      // Block click events (prevent any stray bubbling)
      onClick={(e) => e.stopPropagation()}
    >
      <div
        // modal content
        style={{
          background: '#1e1e2e',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          margin: '16px',
        }}
        // ═══════════════════════════════════════════════
        // ✅ Block mouse events originating inside the modal
        // ═══════════════════════════════════════════════
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Usage example:
// <SafeModal isOpen={showEdit} onClose={() => setShowEdit(false)}>
//   <input value={name} onChange={...} />   ← dragging text won't close the modal!
//   <textarea value={note} onChange={...} />
// </SafeModal>
