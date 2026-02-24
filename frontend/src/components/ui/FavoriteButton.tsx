import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoriteButtonProps {
  code: string;
  name: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ code, name, size = 20 }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(code);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(code);
      }}
      className={`p-2 rounded-full transition-all duration-300 ${favorite
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:text-red-400'
        }`}
      title={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
    >
      {favorite ? <FaHeart size={size} /> : <FaRegHeart size={size} />}
    </button>
  );
};

export default FavoriteButton;
