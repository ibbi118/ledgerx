import { forwardRef } from 'react';

/**
 * Input — reusable form input with label, helper text, error, and icon.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helper,
      icon: Icon,
      iconPosition = 'left',
      type = 'text',
      className = '',
      containerClassName = '',
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-primary">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon size={16} />
            </span>
          )}

          <input
            ref={ref}
            type={type}
            className={`
              w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary
              placeholder:text-text-muted
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
              disabled:bg-surface disabled:text-text-muted disabled:cursor-not-allowed
              ${error ? 'border-red-400 focus:ring-red-300' : 'border-border'}
              ${Icon && iconPosition === 'left' ? 'pl-9' : ''}
              ${Icon && iconPosition === 'right' ? 'pr-9' : ''}
              ${className}
            `}
            {...props}
          />

          {Icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon size={16} />
            </span>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {helper && !error && <p className="text-xs text-text-muted">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
