type ButtonVariant = 'pri' | 'sec';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ variant = 'pri', size = 'md', className = '', ...props }: ButtonProps) => {
  const variants = {
    pri: 'btn-primary',
    sec: 'btn-secondary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl',
  };

  return <button className={`btn ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};
