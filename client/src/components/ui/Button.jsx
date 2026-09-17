/**
 * Reusable Button component with theme-aware variants, high-contrast states, and smooth transitions.
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
    'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer rounded-lg';

  const variants = {
    primary:
      'bg-[#22D3EE] hover:bg-[#06B6D4] active:bg-[#0891B2] !text-[#061018] font-semibold shadow-xs hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] active:scale-[0.98]',
    secondary:
      'bg-[#0F141D] text-[#F1F5F9] border border-[#1E293B] hover:bg-[#151C27] hover:border-[#334155] active:bg-[#111823] shadow-2xs active:scale-[0.98]',
    outline:
      'bg-transparent text-[#F1F5F9] border border-[#1E293B] hover:bg-[#0F141D] hover:border-[#334155] active:bg-[#151C27] active:scale-[0.98]',
    danger:
      'bg-[#FB7185] hover:bg-[#F43F5E] active:bg-[#E11D48] !text-[#061018] font-semibold shadow-xs active:scale-[0.98]',
    ghost:
      'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#151C27] active:bg-[#1E293B] active:scale-[0.98]',
    success:
      'bg-[#34D399] hover:bg-[#10B981] active:bg-[#059669] !text-[#061018] font-semibold shadow-xs active:scale-[0.98]',
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
