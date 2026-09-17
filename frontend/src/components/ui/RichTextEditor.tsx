import React, { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import { useSignedUpload, StorageBucket } from '../../hooks/useSignedUpload'
import { EditorToolbar } from './rich-text-editor/EditorToolbar'

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
          levels: [1, 2, 3, 4, 5, 6],
        },
        link: false,
        underline: false,
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
      transformPastedHTML(html) {
        return html
      },
      transformPastedText(text) {
        return text
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const file = items[i].getAsFile()
              if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    view.dispatch(
                      view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: reader.result })
                      )
                    )
                  }
                }
                reader.readAsDataURL(file)
                return true
              }
            }
          }
        }
        return false
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    content: jsonContent || content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON())
    },
  })

  // Synchronize editor content when incoming props change (e.g., clicking Edit on a post or Reset)
  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return

    const incoming = jsonContent || content || ''

    if (incoming && typeof incoming === 'object' && incoming.type === 'doc') {
      const currentJSON = JSON.stringify(editor.getJSON())
      const incomingJSON = JSON.stringify(incoming)
      if (currentJSON !== incomingJSON) {
        editor.commands.setContent(incoming, { emitUpdate: false })
      }
    } else {
      const incomingStr = typeof incoming === 'string' ? incoming : ''
      const currentHTML = editor.getHTML()
      if (incomingStr !== currentHTML) {
        editor.commands.setContent(incomingStr, { emitUpdate: false })
      }
    }
  }, [content, jsonContent, editor])

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

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter or edit link URL:', previousUrl)
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    const formattedUrl = url.trim().match(/^https?:\/\//i) ? url.trim() : `https://${url.trim()}`
    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run()
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
      <EditorToolbar
        editor={editor}
        onUploadClick={() => fileInputRef.current?.click()}
        onAddImageUrl={addImageByUrl}
        onSetLink={setLink}
        uploading={uploading}
        uploadError={uploadError}
      />

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
