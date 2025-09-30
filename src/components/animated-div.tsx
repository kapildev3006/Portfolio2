'use client';

import { motion, type MotionProps } from 'framer-motion';
import type React from 'react';

type AnimatedDivProps = {
  children: React.ReactNode;
  className?: string;
} & MotionProps;

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv;
