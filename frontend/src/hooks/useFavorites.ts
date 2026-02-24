import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('livepop_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('livepop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (code: string) => {
    setFavorites(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const isFavorite = (code: string) => favorites.includes(code);

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
