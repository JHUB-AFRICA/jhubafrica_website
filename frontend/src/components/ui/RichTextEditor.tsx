import React, { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { useSignedUpload, StorageBucket } from '../../hooks/useSignedUpload'

interface RichTextEditorProps {
  content?: string
  jsonContent?: any
  onChange: (html: string, json: any) => void
  placeholder?: string
  minHeight?: string
  bucket?: StorageBucket
  folder?: string
}

export function RichTextEditor({
  content = '',
  jsonContent,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '240px',
  bucket = 'post-images',
  folder = 'news',
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, uploading, error: uploadError } = useSignedUpload()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: jsonContent || content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON())
    },
  })

  if (!editor) {
    return <div style={{ padding: '1rem', color: '#94a3b8' }}>Loading editor...</div>
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const caption = window.prompt('Enter Image Caption (optional, displayed below the image):') || ''

    try {
      const result = await uploadFile(file, bucket, folder)
      editor.chain().focus().setImage({
        src: result.url,
        alt: caption || file.name,
        title: caption,
      }).run()
    } catch (err) {
      console.error('Failed to upload image into editor:', err)
      // Fallback: FileReader Base64 if storage is unreachable
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.chain().focus().setImage({
            src: reader.result,
            alt: caption || file.name,
            title: caption,
          }).run()
        }
      }
      reader.readAsDataURL(file)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const addImageByUrl = () => {
    const url = window.prompt('Enter Image URL:')
    if (url && url.trim()) {
      const caption = window.prompt('Enter Image Caption (optional, displayed below the image):') || ''
      editor.chain().focus().setImage({
        src: url.trim(),
        alt: caption,
        title: caption,
      }).run()
    }
  }

  return (
    <div
      style={{
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hidden File Input for Direct Computer Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Toolbar */}
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
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            fontWeight: editor.isActive('bold') ? 700 : 500,
            backgroundColor: editor.isActive('bold') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            backgroundColor: editor.isActive('italic') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            textDecoration: 'line-through',
            backgroundColor: editor.isActive('strike') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Strikethrough"
        >
          S
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: editor.isActive('heading', { level: 2 }) ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: editor.isActive('heading', { level: 3 }) ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Heading 3"
        >
          H3
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            backgroundColor: editor.isActive('bulletList') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            backgroundColor: editor.isActive('orderedList') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Numbered List"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={{
            padding: '4px 8px',
            fontSize: '0.85rem',
            backgroundColor: editor.isActive('blockquote') ? '#e2e8f0' : 'transparent',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Blockquote"
        >
          “ Quote
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

        {/* Upload Image From Computer Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
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
          onClick={addImageByUrl}
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
          🔗 Image URL
        </button>

        {uploadError && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '4px' }}>
            {uploadError}
          </span>
        )}

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

      {/* Editor Content Area */}
      <div style={{ padding: '1rem', minHeight }}>
        <EditorContent
          editor={editor}
          style={{
            outline: 'none',
            minHeight: '180px',
          }}
        />
      </div>
    </div>
  )
}
