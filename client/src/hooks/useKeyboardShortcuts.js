import { useEffect, useCallback } from 'react';

/**
 * Reusable keyboard shortcut hook.
 * Shortcuts are ignored when user is typing in input/textarea/select/contenteditable.
 *
 * @param {Object} shortcuts - Map of key to handler, e.g. { 'q': () => {}, 'Escape': () => {} }
 * @param {boolean} enabled - Whether shortcuts are active (default: true)
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      // Ignore when typing in form fields
      const target = e.target;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      const handler = shortcuts[key] || shortcuts[key.toLowerCase()];

      if (handler) {
        e.preventDefault();
        handler(e);
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
