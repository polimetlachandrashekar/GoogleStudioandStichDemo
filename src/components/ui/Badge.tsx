import React from 'react';

export type BadgeVariant =
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low'
  | 'success'
  | 'warning'
  | 'purple'
  | 'neutral'
  | 'routine'
  | 'habit';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
  onClick,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md leading-normal',
    md: 'text-xs px-2.5 py-1 rounded-md leading-normal',
  }[size];

  const variantStyles = {
    urgent: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold',
    high: 'bg-rose-50 text-rose-600 border border-rose-200/60 font-medium',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-medium',
    low: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-medium',
    purple: 'bg-[#EEECFC] text-[#5C52E5] border border-[#5C52E5]/20 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80 font-medium',
    routine: 'bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-medium',
    habit: 'bg-teal-50 text-teal-700 border border-teal-200/70 font-medium',
  }[variant];

  const dotColors = {
    urgent: 'bg-rose-500',
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    purple: 'bg-[#5C52E5]',
    neutral: 'bg-slate-400',
    routine: 'bg-indigo-500',
    habit: 'bg-teal-500',
  }[variant];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};
