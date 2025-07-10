// src/components/ui/input.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search, Eye, EyeOff } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        search: 'pl-10',
        password: 'pr-10',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement>;
type InputVariantProps = VariantProps<typeof inputVariants>;

interface InputExtendedProps {
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

type InputProps = InputBaseProps & InputVariantProps & InputExtendedProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      icon,
      showPasswordToggle,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full">
        {variant === 'search' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            {icon || <Search className="h-4 w-4" />}
          </div>
        )}
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          className={inputVariants({ variant, size, className })}
          ref={ref}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };