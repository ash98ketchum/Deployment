// src/components/ui/GlowingText.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  text: string | number;
  variant?: 'green' | 'white';
  className?: string;
  hasCountUp?: boolean;
  decimals?: number;
}

const GlowingText: React.FC<GlowingTextProps> = ({
  text,
  variant = 'green',
  className = '',
  hasCountUp = false,
  decimals = 0,
}) => {
  const colorClass =
    variant === 'white'
      ? 'text-white'
      : 'bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600';

  const countUpVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return hasCountUp ? (
    <motion.span
      className={`${colorClass} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={countUpVariants}
    >
      {typeof text === 'number' ? (
        <Counter from={0} to={text} duration={2} decimals={decimals} />
      ) : (
        text
      )}
    </motion.span>
  ) : (
    <span className={`${colorClass} ${className}`}>
      {typeof text === 'number' ? text.toFixed(decimals) : text}
    </span>
  );
};

const Counter = ({
  from,
  to,
  duration,
  decimals,
}: {
  from: number;
  to: number;
  duration: number;
  decimals: number;
}) => {
  const count = useCountUp(from, to, duration, decimals);
  return <>{count}</>;
};

function useCountUp(
  from: number,
  to: number,
  duration: number = 2,
  decimals: number = 0
) {
  const [count, setCount] = React.useState(from);
  React.useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const value = progress * (to - from) + from;
      setCount(value);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    return () => setCount(from);
  }, [from, to, duration]);
  return count.toFixed(decimals);
}

export default GlowingText;
