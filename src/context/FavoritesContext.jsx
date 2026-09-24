import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/userService";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    userService
      .getFavorites()
      .then((response) => {
        // Laravel response:
        // {
        //   success: true,
        //   message: "...",
        //   data: [...]
        // }

      
    setFavorites(response?.data ?? []);
  })
  .catch((error) => {
    console.error("Failed to load favorites:", error);
    setFavorites([]);
  });


      }, []);

    const isFavorite = (productId) => {
      return favorites.some(
        (favorite) => Number(favorite.product_id) === Number(productId)
      );
    };

    const toggleFavorite = async (productId) => {
      try {
        const favorite = favorites.find(
          (item) => Number(item.product_id) === Number(productId)
        );

        
  // Remove favorite
  if (favorite) {
    await userService.removeFavorite(favorite.id);

    setFavorites((current) =>
      current.filter((item) => item.id !== favorite.id)
    );

    return false;
  }

  // Add favorite
  const response = await userService.addFavorite(productId);

  const newFavorite = response?.data;

  if (newFavorite) {
    setFavorites((current) => [...current, newFavorite]);
  }

  return true;
} catch (error) {
  console.error("Failed to toggle favorite:", error);
  return false;
}


      };

      return (
        <FavoritesContext.Provider
          value={{
            favorites,
            isFavorite,
            toggleFavorite,
          }}
        >
          {children}
        </FavoritesContext.Provider>
      );
    }

    export function useFavorites() {
      const ctx = useContext(FavoritesContext);

      if (!ctx) {
        throw new Error(
          "useFavorites must be used within a FavoritesProvider"
        );
      }

      return ctx;
    }

    export default FavoritesContext; 