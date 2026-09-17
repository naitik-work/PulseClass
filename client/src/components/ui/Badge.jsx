/**
 * Badge component for status indicators and metadata tags.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/70 font-medium',
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/70 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/70 font-medium',
    code: 'bg-slate-100/80 text-slate-800 border border-slate-300/80 font-mono tracking-wider font-semibold rounded-md px-2 py-0.5 text-xs',
    live: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full ${variants[variant] || variants.default} ${className}`}
    >
      {variant === 'live' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
        </span>
      )}
      {children}
    </span>
  );
}
