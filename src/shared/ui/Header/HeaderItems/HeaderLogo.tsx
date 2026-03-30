import { Link } from 'react-router-dom';

export const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center whitespace-nowrap">
      <img src="/images/logo.svg" alt="Logo" className="mr-[-2px] h-9 w-9 text-primary" />
      <span className="text-2xl font-bold tracking-tight text-text">ramplin</span>
    </Link>
  );
};
