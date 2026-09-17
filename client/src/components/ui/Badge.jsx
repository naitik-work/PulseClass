/**
 * Badge component for status indicators and metadata tags in both light and dark themes.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:
      'bg-[#151C27] text-[#94A3B8] border border-[#1E293B] font-medium',
    primary:
      'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/25 font-medium',
    success:
      'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/25 font-medium',
    warning:
      'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/25 font-medium',
    danger:
      'bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/25 font-medium',
    code:
      'bg-[#0B1018] text-[#22D3EE] border border-[#1E293B] font-mono tracking-wider font-semibold rounded-md px-2 py-0.5 text-xs',
    live:
      'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full ${variants[variant] || variants.default} ${className}`}
    >
      {variant === 'live' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22D3EE]" />
        </span>
      )}
      {children}
    </span>
  );
}
