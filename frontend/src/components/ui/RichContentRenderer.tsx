import React from 'react'

interface RichContentRendererProps {
  content?: string
  contentJson?: any
  className?: string
  style?: React.CSSProperties
}

function renderTipTapNode(node: any, path: string = 'doc'): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'doc':
      return (
        <React.Fragment key={path}>
          {(node.content || []).map((child: any, i: number) =>
            renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
          )}
        </React.Fragment>
      )

    case 'paragraph': {
      const hasContent = node.content && node.content.length > 0
      return (
        <p key={path} style={{ marginBottom: '1.5rem', lineHeight: '1.85', minHeight: '1.25rem' }}>
          {hasContent ? (
            node.content.map((child: any, i: number) =>
              renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
            )
          ) : (
            <>&nbsp;</>
          )}
        </p>
      )
    }

    case 'heading': {
      const level = node.attrs?.level || 2
      const headingContent = (node.content || []).map((child: any, i: number) =>
        renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
      )
      const headingStyle = {
        color: 'var(--jhub-blue, #0f2d59)',
        marginTop: '1.75rem',
        marginBottom: '0.75rem',
        fontWeight: 700,
        lineHeight: 1.3,
      }

      if (level === 1) return <h1 key={path} style={{ ...headingStyle, fontSize: '2rem' }}>{headingContent}</h1>
      if (level === 2) return <h2 key={path} style={{ ...headingStyle, fontSize: '1.65rem' }}>{headingContent}</h2>
      if (level === 3) return <h3 key={path} style={{ ...headingStyle, fontSize: '1.35rem' }}>{headingContent}</h3>
      if (level === 4) return <h4 key={path} style={{ ...headingStyle, fontSize: '1.15rem' }}>{headingContent}</h4>
      return <h5 key={path} style={{ ...headingStyle, fontSize: '1.05rem' }}>{headingContent}</h5>
    }

    case 'bulletList':
      return (
        <ul key={path} style={{ paddingLeft: '1.75rem', marginBottom: '1.25rem', lineHeight: '1.8', listStyleType: 'disc' }}>
          {(node.content || []).map((child: any, i: number) =>
            renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
          )}
        </ul>
      )

    case 'orderedList':
      return (
        <ol key={path} style={{ paddingLeft: '1.75rem', marginBottom: '1.25rem', lineHeight: '1.8', listStyleType: 'decimal' }}>
          {(node.content || []).map((child: any, i: number) =>
            renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
          )}
        </ol>
      )

    case 'listItem':
      return (
        <li key={path} style={{ marginBottom: '0.4rem' }}>
          {(node.content || []).map((child: any, i: number) =>
            renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
          )}
        </li>
      )

    case 'blockquote':
      return (
        <blockquote
          key={path}
          style={{
            borderLeft: '4px solid var(--jhub-green, #10b981)',
            paddingLeft: '1.25rem',
            margin: '1.5rem 0',
            fontStyle: 'italic',
            color: '#475569',
            backgroundColor: '#f8fafc',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            borderRadius: '0 6px 6px 0',
          }}
        >
          {(node.content || []).map((child: any, i: number) =>
            renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
          )}
        </blockquote>
      )

    case 'codeBlock':
      return (
        <pre
          key={path}
          style={{
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            margin: '1.5rem 0',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.9rem',
          }}
        >
          <code>
            {(node.content || []).map((child: any, i: number) =>
              renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
            )}
          </code>
        </pre>
      )

    case 'image': {
      const caption = node.attrs?.title || node.attrs?.alt || ''
      return (
        <figure
          key={path}
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
              maxHeight: '420px',
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
      return <hr key={path} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />

    case 'text': {
      let textElement: React.ReactNode = node.text

      if (node.marks) {
        node.marks.forEach((mark: any, mIdx: number) => {
          const markKey = `${path}.mark.${mark.type || 'm'}.${mIdx}`
          if (mark.type === 'bold') {
            textElement = <strong key={markKey}>{textElement}</strong>
          }
          if (mark.type === 'italic') {
            textElement = <em key={markKey}>{textElement}</em>
          }
          if (mark.type === 'strike') {
            textElement = <s key={markKey}>{textElement}</s>
          }
          if (mark.type === 'underline') {
            textElement = <u key={markKey}>{textElement}</u>
          }
          if (mark.type === 'code') {
            textElement = (
              <code
                key={markKey}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.9em',
                }}
              >
                {textElement}
              </code>
            )
          }
          if (mark.type === 'link') {
            textElement = (
              <a
                key={markKey}
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
      return <React.Fragment key={path}>{textElement}</React.Fragment>
    }

    default:
      if (node.content) {
        return (
          <React.Fragment key={path}>
            {node.content.map((child: any, i: number) =>
              renderTipTapNode(child, `${path}.${child.type || 'n'}.${i}`)
            )}
          </React.Fragment>
        )
      }
      return null
  }
}

function domNodeToReact(node: Node, path: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || null;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as HTMLElement;
  const tagName = el.tagName.toLowerCase();

  // Disallow dangerous executable or structural elements
  if (['script', 'iframe', 'object', 'embed', 'form', 'input', 'style'].includes(tagName)) {
    return null;
  }

  const children: React.ReactNode[] = [];
  Array.from(el.childNodes).forEach((child, i) => {
    const renderedChild = domNodeToReact(child, `${path}.${i}`);
    if (renderedChild !== null && renderedChild !== undefined) {
      children.push(renderedChild);
    }
  });

  const props: Record<string, any> = { key: path };

  // Allow safe attributes only
  if (tagName === 'a') {
    const href = el.getAttribute('href');
    if (href && !href.trim().toLowerCase().startsWith('javascript:')) {
      props.href = href;
      props.target = el.getAttribute('target') || '_blank';
      props.rel = 'noopener noreferrer';
      props.style = { color: 'var(--jhub-green, #10b981)', textDecoration: 'underline' };
    }
  } else if (tagName === 'img') {
    const src = el.getAttribute('src');
    if (src && !src.trim().toLowerCase().startsWith('javascript:')) {
      props.src = src;
      props.alt = el.getAttribute('alt') || '';
      props.style = { maxWidth: '100%', borderRadius: '8px' };
    }
  }

  const validTags = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'strong', 'b', 'em', 'i', 'u', 's', 'a', 'img',
    'span', 'div', 'hr', 'br'
  ];

  if (validTags.includes(tagName)) {
    return React.createElement(tagName, props, children.length > 0 ? children : undefined);
  }

  return children.length > 0 ? <React.Fragment key={path}>{children}</React.Fragment> : null;
}

function renderHtmlSafely(htmlString: string): React.ReactNode {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return <p>{htmlString.replace(/<[^>]*>/g, ' ')}</p>;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const nodes = Array.from(doc.body.childNodes);
    return nodes.map((n, i) => domNodeToReact(n, `html-node.${i}`));
  } catch (err) {
    console.warn('Failed to parse HTML content safely:', err);
    return <p>{htmlString.replace(/<[^>]*>/g, ' ')}</p>;
  }
}

export function RichContentRenderer({
  content,
  contentJson,
  className = '',
  style,
}: RichContentRendererProps) {
  const combinedClass = `rich-story-content ${className}`.trim()

  // If TipTap JSON is present, render structured AST
  if (contentJson && typeof contentJson === 'object' && contentJson.type === 'doc') {
    return (
      <div className={combinedClass} style={{ fontSize: '1.1rem', color: '#334155', ...style }}>
        {renderTipTapNode(contentJson, 'doc')}
      </div>
    )
  }

  // If HTML string is detected, render via safe DOM parser
  if (content && (content.includes('<p>') || content.includes('<h2>') || content.includes('<div>'))) {
    return (
      <div className={combinedClass} style={{ fontSize: '1.1rem', color: '#334155', ...style }}>
        {renderHtmlSafely(content)}
      </div>
    )
  }

  // Fallback: Plain text split by paragraphs
  if (!content) {
    return <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>No content available.</p>
  }

  const paragraphBlocks = content.split(/\n\s*\n/).map((p: string, i: number) => ({
    id: `para-${i}-${p.trim().slice(0, 16)}`,
    text: p.trim(),
  }))

  return (
    <div className={combinedClass} style={{ fontSize: '1.1rem', color: '#334155', ...style }}>
      {paragraphBlocks.map((block) => {
        if (!block.text) {
          return <p key={block.id} style={{ marginBottom: '1.5rem', minHeight: '1.25rem' }}>&nbsp;</p>
        }
        return (
          <p key={block.id} style={{ marginBottom: '1.5rem', lineHeight: '1.85' }}>
            {block.text}
          </p>
        )
      })}
    </div>
  )
}
