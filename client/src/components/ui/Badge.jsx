/**
 * Badge component for status indicators.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-semibold',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold',
    live: 'bg-rose-600 text-white font-bold tracking-wide shadow-sm shadow-rose-600/30 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
