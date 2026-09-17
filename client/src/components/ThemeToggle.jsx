import { useTheme } from '../context/ThemeContext';

/**
 * Accessible, compact theme toggle button with smooth micro-interactions.
 */
export default function ThemeToggle({ className = '', size = 'md' }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const currentIconSize = iconSizes[size] || 18;

  const tooltipText = isDark
    ? 'Switch to light theme (currently dark)'
    : 'Switch to dark theme (currently light)';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={tooltipText}
      aria-label={tooltipText}
      className={`relative inline-flex items-center justify-center rounded-lg cursor-pointer
        border border-[#1E293B]
        bg-[#0F141D]
        text-[#94A3B8]
        hover:text-[#F1F5F9]
        hover:bg-[#151C27]
        hover:border-[#334155]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]
        active:scale-95 transition-all duration-150 shadow-2xs
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
    >
      {/* Sun Icon (shown in dark mode to switch to light) */}
      <svg
        width={currentIconSize}
        height={currentIconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-200 transform ${
          isDark
            ? 'opacity-100 rotate-0 scale-100 text-amber-400'
            : 'opacity-0 -rotate-90 scale-50 absolute'
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* Moon Icon (shown in light mode to switch to dark) */}
      <svg
        width={currentIconSize}
        height={currentIconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-200 transform ${
          !isDark
            ? 'opacity-100 rotate-0 scale-100 text-slate-700'
            : 'opacity-0 rotate-90 scale-50 absolute'
        }`}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
