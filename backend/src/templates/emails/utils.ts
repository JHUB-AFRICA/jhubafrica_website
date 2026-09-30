/**
 * Email Template Utilities
 * Provides sanitization against HTML injection in email bodies.
 */

/**
 * Escapes characters with special meaning in HTML to prevent HTML injection / XSS in email clients.
 */
export function escapeHtml(unsafe: unknown): string {
  if (unsafe === null || unsafe === undefined) return ''
  const str = String(unsafe)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Escapes text and converts newlines to HTML line breaks.
 */
export function formatMultilineHtml(unsafe: unknown): string {
  return escapeHtml(unsafe).replace(/\r?\n/g, '<br />')
}
