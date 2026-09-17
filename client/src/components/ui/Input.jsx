import { forwardRef } from 'react';

/**
 * Reusable Input component with label, helper text, and error display.
 */
const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all
          bg-slate-50/60 text-slate-900 placeholder-slate-400
          border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none
          disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
          ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
});

export default Input;
