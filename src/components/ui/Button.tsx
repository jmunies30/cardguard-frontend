import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
};

export function Button({ children, isLoading = false, disabled, className = '', ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-950/50 transition-all duration-200 hover:bg-sky-500 hover:shadow-sky-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
