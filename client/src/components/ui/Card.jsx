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
    default: 'bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs dark:shadow-none',
    subtle: 'bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80',
    elevated: 'bg-white dark:bg-[#161f30] border border-slate-200/60 dark:border-slate-700/60 shadow-xs dark:shadow-md',
    flat: 'bg-white dark:bg-[#111827]',
  };

  const interactiveStyles = interactive
    ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.995]'
    : '';

  return (
    <div
      className={`rounded-xl text-slate-900 dark:text-slate-100 ${variantStyles[variant] || variantStyles.default} ${interactiveStyles} ${
        padding ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
