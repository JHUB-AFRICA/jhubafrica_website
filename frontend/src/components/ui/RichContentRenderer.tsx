import React from 'react'

interface RichContentRendererProps {
  content?: string
  contentJson?: any
  className?: string
  style?: React.CSSProperties
}

function renderTipTapNode(node: any, index: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'doc':
      return (
        <React.Fragment key={index}>
          {(node.content || []).map((child: any, i: number) => renderTipTapNode(child, i))}
        </React.Fragment>
      )

    case 'paragraph': {
      const hasContent = node.content && node.content.length > 0
      return (
        <p key={index} style={{ marginBottom: '1.25rem', lineHeight: '1.8' }}>
          {hasContent ? (
            node.content.map((child: any, i: number) => renderTipTapNode(child, i))
          ) : (
            <br />
          )}
        </p>
      )
    }

    case 'heading': {
      const level = node.attrs?.level || 2
      const headingContent = (node.content || []).map((child: any, i: number) =>
        renderTipTapNode(child, i)
      )
      const headingStyle = {
        color: 'var(--jhub-blue, #0f2d59)',
        marginTop: '1.75rem',
        marginBottom: '0.75rem',
        fontWeight: 700,
        lineHeight: 1.3,
      }

      if (level === 2) return <h2 key={index} style={{ ...headingStyle, fontSize: '1.75rem' }}>{headingContent}</h2>
      if (level === 3) return <h3 key={index} style={{ ...headingStyle, fontSize: '1.4rem' }}>{headingContent}</h3>
      return <h4 key={index} style={{ ...headingStyle, fontSize: '1.2rem' }}>{headingContent}</h4>
    }

    case 'bulletList':
      return (
        <ul key={index} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: '1.8' }}>
          {(node.content || []).map((child: any, i: number) => renderTipTapNode(child, i))}
        </ul>
      )

    case 'orderedList':
      return (
        <ol key={index} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: '1.8' }}>
          {(node.content || []).map((child: any, i: number) => renderTipTapNode(child, i))}
        </ol>
      )

    case 'listItem':
      return (
        <li key={index} style={{ marginBottom: '0.4rem' }}>
          {(node.content || []).map((child: any, i: number) => renderTipTapNode(child, i))}
        </li>
      )

    case 'blockquote':
      return (
        <blockquote
          key={index}
          style={{
            borderLeft: '4px solid var(--jhub-green, #10b981)',
            paddingLeft: '1rem',
            margin: '1.5rem 0',
            fontStyle: 'italic',
            color: '#475569',
          }}
        >
          {(node.content || []).map((child: any, i: number) => renderTipTapNode(child, i))}
        </blockquote>
      )

    case 'image': {
      const caption = node.attrs?.title || node.attrs?.alt || ''
      return (
        <figure
          key={index}
          style={{
            margin: '2rem auto',
            maxWidth: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src={node.attrs?.src}
            alt={caption}
            title={caption}
            style={{
              maxWidth: '100%',
              maxHeight: '440px',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.07)',
            }}
          />
          {caption && caption.trim().length > 0 && (
            <figcaption
              style={{
                marginTop: '0.65rem',
                fontSize: '0.88rem',
                color: '#64748b',
                fontStyle: 'italic',
                lineHeight: '1.45',
                padding: '0 0.5rem',
              }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'horizontalRule':
      return <hr key={index} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />

    case 'text': {
      let textElement: React.ReactNode = node.text

      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') {
            textElement = <strong key="b">{textElement}</strong>
          }
          if (mark.type === 'italic') {
            textElement = <em key="i">{textElement}</em>
          }
          if (mark.type === 'strike') {
            textElement = <s key="s">{textElement}</s>
          }
          if (mark.type === 'link') {
            textElement = (
              <a
                key="a"
                href={mark.attrs?.href}
                target={mark.attrs?.target || '_blank'}
                rel="noopener noreferrer"
                style={{ color: 'var(--jhub-green, #10b981)', textDecoration: 'underline' }}
              >
                {textElement}
              </a>
            )
          }
        })
      }
      return <React.Fragment key={index}>{textElement}</React.Fragment>
    }

    default:
      if (node.content) {
        return (
          <React.Fragment key={index}>
            {node.content.map((child: any, i: number) => renderTipTapNode(child, i))}
          </React.Fragment>
        )
      }
      return null
  }
}

export function RichContentRenderer({
  content,
  contentJson,
  className,
  style,
}: RichContentRendererProps) {
  // If TipTap JSON is present, render structured AST
  if (contentJson && typeof contentJson === 'object' && contentJson.type === 'doc') {
    return (
      <div className={className} style={{ fontSize: '1.1rem', color: '#334155', ...style }}>
        {renderTipTapNode(contentJson, 0)}
      </div>
    )
  }

  // If HTML string is detected
  if (content && (content.includes('<p>') || content.includes('<h2>') || content.includes('<div>'))) {
    return (
      <div
        className={className}
        style={{ fontSize: '1.1rem', color: '#334155', ...style }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Fallback: Plain text split by paragraphs
  if (!content) {
    return <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>No content available.</p>
  }

  return (
    <div className={className} style={{ fontSize: '1.1rem', color: '#334155', ...style }}>
      {content.split('\n\n').map((paragraph: string, index: number) => (
        <p key={index} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}
