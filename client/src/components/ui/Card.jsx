/**
 * Card component for consistent surface styling with restrained borders and subtle elevation.
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
    default: 'bg-white border border-slate-200/80 shadow-2xs',
    subtle: 'bg-slate-50/60 border border-slate-200/60',
    elevated: 'bg-white border border-slate-200/60 shadow-xs',
    flat: 'bg-white',
  };

  const interactiveStyles = interactive
    ? 'hover:border-slate-300 hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.995]'
    : '';

  return (
    <div
      className={`rounded-xl ${variantStyles[variant] || variantStyles.default} ${interactiveStyles} ${
        padding ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
