import { cn } from '@/lib/utils';
import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg bg-[#264783] text-white transition-all duration-200',
        'hover:bg-[#1f3d6d]',
        'disabled:bg-[#264783]/70 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
