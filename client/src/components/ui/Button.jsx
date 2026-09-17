/**
 * Reusable Button component with high-contrast variants, smooth transitions, and sizes.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer rounded-lg';

  const variants = {
    primary:
      'bg-indigo-600 !text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-xs hover:shadow-sm active:scale-[0.98]',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 shadow-2xs active:scale-[0.98]',
    outline:
      'bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]',
    danger:
      'bg-rose-600 !text-white hover:bg-rose-500 active:bg-rose-700 shadow-xs active:scale-[0.98]',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/70 active:scale-[0.98]',
    success:
      'bg-emerald-600 !text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-xs active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4.5 py-2.5 text-sm font-semibold gap-2',
    xl: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
