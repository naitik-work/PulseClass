import { forwardRef } from 'react';

/**
 * Reusable Input component with label, helper text, error display, and theme support.
 */
const Input = forwardRef(function Input(
  { label, error, helper, id, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150
          bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
          border-slate-300 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/15 dark:focus:ring-indigo-500/30 focus:outline-none
          disabled:bg-slate-50 dark:disabled:bg-slate-800/60 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/15' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-0.5">{error}</p>}
      {!error && helper && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helper}</p>}
    </div>
  );
});

export default Input;
