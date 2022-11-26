import { useMutation, useQuery } from 'react-query';
import {
  fetchFavoriteCharacter,
  resetFavoritesCharacter,
  setFavoritesCharacter,
} from './apiService';
import { CharactersResult } from './models/CharactersResponseDTO';
import { queryClient } from '../utility/queryClient';

export const useFavoriteCharacter = () => {
  return useQuery(['favorite_character'], async () => fetchFavoriteCharacter());
};

export const useNewFavoriteCharacterMutation = () => {
  return useMutation(
    ['set_favorite_character'],
    async (favorite: CharactersResult) => setFavoritesCharacter(favorite),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['favorite_character']);
      },
    },
  );
};

export const useResetFavoritesMutation = () => {
  return useMutation(['reset_favorite_character'], async () => resetFavoritesCharacter(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['favorite_character']);
    },
  });
};
