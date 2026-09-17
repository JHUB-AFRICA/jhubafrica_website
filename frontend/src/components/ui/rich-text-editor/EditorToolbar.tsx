import React from 'react';

interface EditorToolbarProps {
  editor: any;
  onUploadClick: () => void;
  onAddImageUrl: () => void;
  onSetLink: () => void;
  uploading: boolean;
  uploadError?: string | null;
}

const INLINE_FORMATS = [
  { id: 'bold', label: 'B', title: 'Bold (Ctrl+B)', style: { fontWeight: 700 }, action: (e: any) => e.chain().focus().toggleBold().run() },
  { id: 'italic', label: 'I', title: 'Italic (Ctrl+I)', style: { fontStyle: 'italic' }, action: (e: any) => e.chain().focus().toggleItalic().run() },
  { id: 'underline', label: 'U', title: 'Underline (Ctrl+U)', style: { textDecoration: 'underline' }, action: (e: any) => e.chain().focus().toggleUnderline().run() },
  { id: 'strike', label: 'S', title: 'Strikethrough', style: { textDecoration: 'line-through' }, action: (e: any) => e.chain().focus().toggleStrike().run() },
];

const HEADINGS = [
  { level: 1, label: 'H1', title: 'Heading 1' },
  { level: 2, label: 'H2', title: 'Heading 2' },
  { level: 3, label: 'H3', title: 'Heading 3' },
  { level: 4, label: 'H4', title: 'Heading 4' },
];

const LIST_FORMATS = [
  { id: 'bulletList', label: '• List', title: 'Bullet List', action: (e: any) => e.chain().focus().toggleBulletList().run() },
  { id: 'orderedList', label: '1. List', title: 'Numbered List', action: (e: any) => e.chain().focus().toggleOrderedList().run() },
  { id: 'blockquote', label: '“ Quote', title: 'Blockquote', action: (e: any) => e.chain().focus().toggleBlockquote().run() },
];

export function EditorToolbar({
  editor,
  onUploadClick,
  onAddImageUrl,
  onSetLink,
  uploading,
  uploadError,
}: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        padding: '8px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        alignItems: 'center',
      }}
    >
      {/* Inline text formatting */}
      {INLINE_FORMATS.map((item) => {
        const isActive = editor.isActive(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => item.action(editor)}
            style={{
              padding: '4px 8px',
              fontSize: '0.85rem',
              backgroundColor: isActive ? '#e2e8f0' : 'transparent',
              border: '1px solid transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              ...item.style,
            }}
            title={item.title}
          >
            {item.label}
          </button>
        );
      })}

      <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

      {/* Headings */}
      {HEADINGS.map((h) => {
        const isActive = editor.isActive('heading', { level: h.level });
        return (
          <button
            key={h.label}
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: h.level }).run()}
            style={{
              padding: '4px 8px',
              fontSize: '0.85rem',
              fontWeight: 700 - h.level * 30,
              backgroundColor: isActive ? '#e2e8f0' : 'transparent',
              border: '1px solid transparent',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title={h.title}
          >
            {h.label}
          </button>
        );
      })}

      <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

      {/* Lists and Blockquote */}
      {LIST_FORMATS.map((item) => {
        const isActive = editor.isActive(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => item.action(editor)}
            style={{
              padding: '4px 8px',
              fontSize: '0.85rem',
              backgroundColor: isActive ? '#e2e8f0' : 'transparent',
              border: '1px solid transparent',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title={item.title}
          >
            {item.label}
          </button>
        );
      })}

      {/* Link button */}
      <button
        type="button"
        onClick={onSetLink}
        style={{
          padding: '4px 8px',
          fontSize: '0.85rem',
          backgroundColor: editor.isActive('link') ? '#e2e8f0' : 'transparent',
          border: '1px solid transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          color: editor.isActive('link') ? 'var(--jhub-green, #10b981)' : 'inherit',
          fontWeight: editor.isActive('link') ? 700 : 500,
        }}
        title="Add / Edit Link"
      >
        🔗 Link
      </button>

      <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

      {/* Upload Image From Computer Button */}
      <button
        type="button"
        disabled={uploading}
        onClick={onUploadClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 9px',
          fontSize: '0.83rem',
          fontWeight: 600,
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          cursor: uploading ? 'wait' : 'pointer',
          color: 'var(--jhub-blue, #0f2d59)',
        }}
        title="Upload image from computer and insert at cursor"
      >
        {uploading ? '⏳ Uploading...' : '📷 Upload Image'}
      </button>

      {/* Insert Image URL Button */}
      <button
        type="button"
        onClick={onAddImageUrl}
        style={{
          padding: '4px 8px',
          fontSize: '0.83rem',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'var(--text-muted, #64748b)',
        }}
        title="Insert image by URL"
      >
        🖼️ Image URL
      </button>

      {uploadError && (
        <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '4px' }}>
          {uploadError}
        </span>
      )}

      {/* History buttons */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
        <button
          type="button"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: editor.can().undo() ? 'pointer' : 'default',
            opacity: editor.can().undo() ? 1 : 0.4,
          }}
          title="Undo"
        >
          ↩
        </button>
        <button
          type="button"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: editor.can().redo() ? 'pointer' : 'default',
            opacity: editor.can().redo() ? 1 : 0.4,
          }}
          title="Redo"
        >
          ↪
        </button>
      </div>
    </div>
  );
}
