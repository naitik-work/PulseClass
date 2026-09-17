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
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-150
          bg-[#0B1018] text-[#F1F5F9] placeholder-[#64748B]
          border-[#1E293B] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 focus:outline-none
          disabled:bg-[#080B12] disabled:text-[#64748B] disabled:cursor-not-allowed
          ${error ? 'border-[#FB7185] focus:border-[#FB7185] focus:ring-[#FB7185]/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[#FB7185] font-medium mt-0.5">{error}</p>}
      {!error && helper && <p className="text-xs text-[#94A3B8] mt-0.5">{helper}</p>}
    </div>
  );
});

export default Input;
