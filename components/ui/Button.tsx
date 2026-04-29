import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseClass = `btn-${variant} ${className}`;
  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}
