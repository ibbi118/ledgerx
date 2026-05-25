import { motion } from 'framer-motion';

/**
 * Button — reusable button with variants, sizes, and loading state.
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-85 focus:ring-primary',
    accent: 'bg-accent text-primary hover:bg-accent-dark focus:ring-accent',
    secondary: 'bg-surface text-primary border border-border hover:bg-gray-100 focus:ring-gray-300',
    ghost: 'bg-transparent text-primary hover:bg-surface focus:ring-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
