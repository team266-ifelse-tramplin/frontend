type ButtonVariant = 'pri' | 'sec';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({ variant = 'pri', className = '', ...props }: ButtonProps) => {
  const variants = {
    pri: 'btn-primary',
    sec: 'btn-secondary',
  };

  return <button className={`btn ${variants[variant]} ${className}`} {...props} />;
};
