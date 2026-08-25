import React, { useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSignedUpload, StorageBucket } from '../../../hooks/useSignedUpload'
import { adminApi } from '../../../../axios/axios'

export interface ManagedImage {
  id?: string
  url: string
  order?: number
}

interface SortableImageItemProps {
  id: string
  image: ManagedImage
  index: number
  onRemove: (index: number) => void
  onSetCover: (index: number) => void
}

function SortableImageItem({ id, image, index, onRemove, onSetCover }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: index === 0 ? '2px solid var(--jhub-green, #10b981)' : '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    aspectRatio: '16/10',
    boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.15)' : 'none',
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={image.url}
        alt={`Item ${index + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />
      {/* Badge / Index */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          backgroundColor: index === 0 ? 'var(--jhub-green, #10b981)' : 'rgba(15, 23, 42, 0.75)',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '4px',
          letterSpacing: '0.5px',
          pointerEvents: 'none',
        }}
      >
        {index === 0 ? '★ Cover' : `#${index + 1}`}
      </div>

      {/* Action buttons overlay */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          display: 'flex',
          gap: '4px',
        }}
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking buttons
      >
        {index !== 0 && (
          <button
            type="button"
            title="Set as Cover Image"
            onClick={() => onSetCover(index)}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '4px',
              padding: '3px 6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            ★
          </button>
        )}
        <button
          type="button"
          title="Remove Image"
          onClick={() => onRemove(index)}
          style={{
            background: 'rgba(220, 38, 38, 0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '3px 6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

interface MultiImageManagerProps {
  images: Array<ManagedImage | string>
  onChange: (images: ManagedImage[]) => void
  bucket?: StorageBucket
  label?: string
  helperText?: string
}

export function MultiImageManager({
  images,
  onChange,
  bucket = 'post-images',
  label = 'Post Images & Gallery',
  helperText = 'Drag to reorder. The first image (#1) is automatically used as the main cover photo.',
}: MultiImageManagerProps) {
  const { uploadMultipleFiles, uploading, progress, error } = useSignedUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>(bucket === 'innovation-images' ? 'innovations' : 'news')
  const [customFolder, setCustomFolder] = useState<string>('')
  const [isCustom, setIsCustom] = useState(false)
  const [availableFolders, setAvailableFolders] = useState<string[]>(['news', 'events', 'innovations', 'gallery', 'general'])

  // Fetch available folders in Supabase on mount
  React.useEffect(() => {
    adminApi
      .get<{ folders: string[] }>(`/api/v1/admin/uploads/folders?bucket=${bucket}`)
      .then((res) => {
        if (res.data?.folders && res.data.folders.length > 0) {
          setAvailableFolders(res.data.folders)
        }
      })
      .catch(() => {})
  }, [bucket])

  // Normalize image items
  const normalizedImages: ManagedImage[] = images.map((img, idx) => {
    if (typeof img === 'string') {
      return { id: `img-temp-${idx}-${encodeURIComponent(img.slice(-20))}`, url: img, order: idx }
    }
    return {
      id: img.id || `img-temp-${idx}`,
      url: img.url,
      order: typeof img.order === 'number' ? img.order : idx,
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = normalizedImages.findIndex((item) => item.id === active.id)
    const newIndex = normalizedImages.findIndex((item) => item.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(normalizedImages, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        order: idx,
      }))
      onChange(reordered)
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    const effectiveFolder = isCustom && customFolder.trim() ? customFolder.trim() : selectedFolder

    try {
      const uploadResults = await uploadMultipleFiles(fileArray, bucket, effectiveFolder)
      const newItems: ManagedImage[] = uploadResults.map((res, i) => ({
        id: `uploaded-${Date.now()}-${i}`,
        url: res.url,
        order: normalizedImages.length + i,
      }))
      onChange([...normalizedImages, ...newItems])
      
      if (isCustom && customFolder.trim() && !availableFolders.includes(customFolder.trim())) {
        setAvailableFolders((prev) => [...prev, customFolder.trim()])
      }
    } catch (err) {
      console.error('Failed to upload selected files:', err)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const updated = normalizedImages
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, order: idx }))
    onChange(updated)
  }

  const handleSetCover = (index: number) => {
    if (index === 0) return
    const item = normalizedImages[index]
    const updated = [item, ...normalizedImages.filter((_, idx) => idx !== index)].map((it, idx) => ({
      ...it,
      order: idx,
    }))
    onChange(updated)
  }

  return (
    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <label style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
          {label} ({normalizedImages.length})
        </label>
        {normalizedImages.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {normalizedImages.length} image{normalizedImages.length === 1 ? '' : 's'} added
          </span>
        )}
      </div>

      {/* Supabase Storage Folder Selector & Creator */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          fontSize: '0.85rem',
        }}
      >
        <span style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
          📁 Storage Folder:
        </span>

        {!isCustom ? (
          <select
            value={selectedFolder}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                setIsCustom(true)
              } else {
                setSelectedFolder(e.target.value)
              }
            }}
            style={{
              padding: '3px 8px',
              fontSize: '0.83rem',
              borderRadius: '5px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: 500,
            }}
          >
            {availableFolders.map((f) => (
              <option key={f} value={f}>
                📂 {f}
              </option>
            ))}
            <option value="__new__">➕ + Create New Folder in Supabase...</option>
          </select>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="text"
              placeholder="e.g. hackathon-2026 or events/summit"
              value={customFolder}
              onChange={(e) => setCustomFolder(e.target.value)}
              style={{
                padding: '3px 8px',
                fontSize: '0.83rem',
                borderRadius: '5px',
                border: '1px solid var(--jhub-green, #10b981)',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                width: '200px',
              }}
            />
            <button
              type="button"
              onClick={() => setIsCustom(false)}
              style={{
                padding: '2px 6px',
                fontSize: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: 'auto' }}>
          Uploaded files will be saved in <code>{bucket}/{isCustom && customFolder ? customFolder : selectedFolder}/</code>
        </span>
      </div>

      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#64748b' }}>{helperText}</p>

      {error && (
        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          {error}
        </div>
      )}

      {/* Existing Uploaded Sortable Grid */}
      {normalizedImages.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={normalizedImages.map((img) => img.id!)} strategy={rectSortingStrategy}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {normalizedImages.map((img, idx) => (
                <SortableImageItem
                  key={img.id}
                  id={img.id!}
                  image={img}
                  index={idx}
                  onRemove={handleRemove}
                  onSetCover={handleSetCover}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          void handleFiles(e.dataTransfer.files)
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragOver ? '2px dashed var(--jhub-green, #10b981)' : '2px dashed #cbd5e1',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: isDragOver ? '#f0fdf4' : '#f8fafc',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          style={{ display: 'none' }}
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {uploading ? (
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--jhub-green, #10b981)' }}>
              Uploading directly to storage...
            </div>
            {progress > 0 && (
              <div style={{ width: '200px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', margin: '0.5rem auto 0 auto', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--jhub-green, #10b981)', transition: 'width 0.3s ease' }} />
              </div>
            )}
          </div>
        ) : (
          <div>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>📷</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
              Click to select or drag & drop images
            </span>
            <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Supports PNG, JPG, WebP, GIF (direct binary upload to Supabase Storage)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
