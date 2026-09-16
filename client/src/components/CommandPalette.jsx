import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Command palette for Quick Pulse — the keyboard-first pulse launcher.
 * Opens with Q, searchable, arrow-key navigable, number shortcuts.
 */
export default function CommandPalette({
  isOpen,
  onClose,
  templates,
  categories,
  onSelectTemplate,
  onCreateCustom,
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter templates by search and category
  const filtered = useMemo(() => {
    let result = templates || [];

    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.question.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [templates, search, activeCategory]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search, activeCategory]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setActiveCategory(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            onSelectTemplate(filtered[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          // Number shortcuts 1-9
          if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
            const index = parseInt(e.key) - 1;
            if (index < filtered.length && document.activeElement !== inputRef.current) {
              e.preventDefault();
              onSelectTemplate(filtered[index]);
            }
          }
          // C for custom
          if (
            (e.key === 'c' || e.key === 'C') &&
            document.activeElement !== inputRef.current &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            e.preventDefault();
            onCreateCustom();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectTemplate, onClose, onCreateCustom]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[selectedIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span className="font-medium text-indigo-500">Quick Pulse</span>
            <span>·</span>
            <span>Type to search, ↑↓ to navigate, Enter to launch</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
            autoComplete="off"
          />
        </div>

        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex gap-1 px-4 py-2 border-b border-gray-50 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors
                ${!activeCategory ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:bg-gray-100'}
              `}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors
                  ${activeCategory === cat.id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div ref={listRef} className="max-h-64 overflow-y-auto" role="listbox">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No matching questions found
            </div>
          ) : (
            filtered.map((template, index) => (
              <button
                key={template.id}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => onSelectTemplate(template)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                  ${index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="w-5 h-5 flex items-center justify-center text-xs text-gray-400 font-mono bg-gray-100 rounded">
                  {index < 9 ? index + 1 : '·'}
                </span>
                <span className="flex-1">{template.question}</span>
                <span className="text-xs text-gray-400 capitalize">{template.category}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onCreateCustom}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500 transition-colors"
          >
            <span className="w-5 h-5 flex items-center justify-center text-xs font-mono bg-gray-100 rounded">
              C
            </span>
            <span>Create custom pulse</span>
          </button>
          <span className="text-xs text-gray-300">Esc to close</span>
        </div>
      </div>
    </div>
  );
}
