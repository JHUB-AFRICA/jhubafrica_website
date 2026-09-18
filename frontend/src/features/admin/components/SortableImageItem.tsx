import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

export function SortableImageItem({ id, image, index, onRemove, onSetCover }: SortableImageItemProps) {
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
