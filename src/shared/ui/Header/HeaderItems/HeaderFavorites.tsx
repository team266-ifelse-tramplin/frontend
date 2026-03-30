import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

type HeaderFavoritesProps = {
  favoritesCount: number;
};

export const HeaderFavorites = ({ favoritesCount }: HeaderFavoritesProps) => {
  return (
    <Link to="/favorites" className="header-chip header-chip-link relative hover:text-favorite">
      <Heart className="header-chip-icon text-favorite" strokeWidth={2.2} />
      <span className="hidden sm:inline">Избранное</span>
      <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
        {favoritesCount}
      </span>
    </Link>
  );
};
