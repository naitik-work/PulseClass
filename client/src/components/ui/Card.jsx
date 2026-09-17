/**
 * Card component for consistent surface styling across light and dark themes.
 */
export default function Card({
  children,
  className = '',
  padding = true,
  variant = 'default',
  interactive = false,
  ...props
}) {
  const variantStyles = {
    default: 'bg-[#0F141D] border border-[#1E293B]',
    subtle: 'bg-[#0C1119] border border-[#1E293B]/70',
    elevated: 'bg-[#151C27] border border-[#1E293B] shadow-sm shadow-black/40',
    flat: 'bg-[#0F141D]',
  };

  const interactiveStyles = interactive
    ? 'hover:border-[#334155] hover:bg-[#111823] transition-all duration-150 cursor-pointer active:scale-[0.995]'
    : '';

  return (
    <div
      className={`rounded-2xl text-[#F1F5F9] ${variantStyles[variant] || variantStyles.default} ${interactiveStyles} ${
        padding ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
