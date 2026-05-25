import { motion } from 'framer-motion';

/**
 * Card — clean container with optional padding and hover effect.
 */
const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  onClick,
}) => {
  const base = 'bg-white border border-border rounded-2xl shadow-card';
  const hoverClass = hover ? 'cursor-pointer hover:shadow-card-hover transition-shadow duration-200' : '';
  const paddingClass = padding ? 'p-5' : '';

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -1 }}
        onClick={onClick}
        className={`${base} ${hoverClass} ${paddingClass} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
