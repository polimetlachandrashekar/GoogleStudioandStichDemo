import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  active?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  active = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6',
  }[padding];

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-150 ${
        active
          ? 'border-[#5C52E5] ring-2 ring-[#5C52E5]/15 shadow-sm'
          : 'border-slate-200/90 shadow-2xs'
      } ${
        hoverEffect
          ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer'
          : ''
      } ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
