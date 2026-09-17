/**
 * Card component for consistent surface styling.
 */
export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:border-slate-300 transition-all ${
        padding ? 'p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
