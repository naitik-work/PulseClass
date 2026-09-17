import Button from './Button';

/**
 * Empty state component for when there's no data to display.
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-200/90 bg-white/50 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl text-slate-600 mb-3 shadow-2xs">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 mb-5 max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
