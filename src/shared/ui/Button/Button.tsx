type ButtonVariant = 'pri' | 'sec';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ variant = 'pri', size = 'md', className = '', ...props }: ButtonProps) => {
  return <button className={`btn ${variant} ${size} ${className}`} {...props} />;
};
