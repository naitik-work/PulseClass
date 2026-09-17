import { forwardRef } from 'react';

/**
 * Reusable Input component with label, helper text, and error display.
 */
const Input = forwardRef(function Input(
  { label, error, helper, id, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150
          bg-white text-slate-900 placeholder-slate-400
          border-slate-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>}
      {!error && helper && <p className="text-xs text-slate-500 mt-0.5">{helper}</p>}
    </div>
  );
});

export default Input;
