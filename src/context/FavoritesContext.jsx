import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/userService";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    userService.getFavorites().then(setFavorites);
  }, []);

  const isFavorite = (productId) => favorites.includes(productId);

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      const next = await userService.removeFavorite(productId);
      setFavorites(next);
      return false;
    }
    const next = await userService.addFavorite(productId);
    setFavorites(next);
    return true;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
