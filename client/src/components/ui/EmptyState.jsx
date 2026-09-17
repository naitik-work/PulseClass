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
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-[#1E293B] bg-[#0C1119]/50 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-[#151C27] border border-[#1E293B] flex items-center justify-center text-xl text-[#94A3B8] mb-3 shadow-2xs">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-[#94A3B8] mb-5 max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
