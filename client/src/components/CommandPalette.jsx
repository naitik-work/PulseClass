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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-scale-in">
        {/* Header & Search */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a question or press 1-9 to launch directly..."
            className="w-full text-sm font-medium bg-transparent outline-none text-slate-900 placeholder-slate-400 py-1"
            autoComplete="off"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-[10px] font-mono text-slate-500 uppercase">
            ESC
          </kbd>
        </div>

        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/60 border-b border-slate-100 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-medium cursor-pointer ${
                !activeCategory ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              All Checkpoints
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-medium cursor-pointer ${
                  activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Results list */}
        <div ref={listRef} className="max-h-72 overflow-y-auto divide-y divide-slate-50 p-1" role="listbox">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-slate-400">
              No matching pulse templates found
            </div>
          ) : (
            filtered.map((template, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={template.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectTemplate(template)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-950 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center text-xs font-mono rounded shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index < 9 ? index + 1 : '·'}
                  </span>
                  <span className="flex-1 tracking-tight truncate">{template.question}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {template.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 uppercase border border-slate-200/60">
                      {template.responseType}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onCreateCustom}
            className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600 font-semibold">
              C
            </kbd>
            <span>Create custom pulse</span>
          </button>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-500">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-500">↵</kbd> launch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
