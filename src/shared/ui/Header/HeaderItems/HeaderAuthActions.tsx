import { Link } from 'react-router-dom';

export const HeaderAuthActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth/login" className="btn sec md r-xl">
        Войти
      </Link>
      <Link to="/auth/register" className="btn pri md r-xl">
        Регистрация
      </Link>
    </div>
  );
};
