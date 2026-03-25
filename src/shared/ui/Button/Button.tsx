type ButtonVariant = 'pri' | 'sec';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonRounded = 'lg' | 'xl' | '2xl' | 'full';

const roundedClassByValue: Record<ButtonRounded, string> = {
  lg: 'r-lg',
  xl: 'r-xl',
  '2xl': 'r-2xl',
  full: 'r-full',
};

const defaultRoundedBySize: Record<ButtonSize, ButtonRounded> = {
  sm: 'lg',
  md: 'xl',
  lg: '2xl',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
}

export const Button = ({ variant = 'pri', size = 'md', rounded, className = '', ...props }: ButtonProps) => {
  const roundedClass = roundedClassByValue[rounded ?? defaultRoundedBySize[size]];

  return <button className={`btn ${variant} ${size} ${roundedClass} ${className}`} {...props} />;
};
