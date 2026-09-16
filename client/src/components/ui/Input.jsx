import { forwardRef } from 'react';

/**
 * Reusable Input component with label and error display.
 */
const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors
          bg-white text-gray-900 placeholder-gray-400
          border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
});

export default Input;
