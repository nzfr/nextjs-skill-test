import customAxios from './cAxios';
import { CharactersResponseDTO, CharactersResult } from './models/CharactersResponseDTO';
import { LocationResult, LocationsResponseDTO } from './models/LocationsResponseDTO';

const axios = customAxios();

export const fetchCharactersList = async () => {
  const data = await axios.get<CharactersResponseDTO>('character');
  return data.data;
};

export const fetchCharacterDetails = async (id: string) => {
  const data = await axios.get<CharactersResult>(`character/${id}`);
  return data.data;
};

export const fetchLocationsList = async () => {
  const data = await axios.get<LocationsResponseDTO>('location');
  return data.data;
};

export const fetchLocationDetails = async (id: string) => {
  const data = await axios.get<LocationResult>(`location/${id}`);
  return data.data;
};

export type GetFavoritesResponse = {
  success: boolean;
  favorite: CharactersResult;
};

export const fetchFavoriteCharacter = async () => {
  const data = await axios.get<GetFavoritesResponse>('http://localhost:3000/api/favorite');
  return data.data;
};

export const setFavoritesCharacter = async (character: CharactersResult) => {
  const data = await axios.post<GetFavoritesResponse>('http://localhost:3000/api/favorite', {
    favorite: character,
  });
  return data.data;
};

export const resetFavoritesCharacter = async () => {
  const data = await axios.delete<GetFavoritesResponse>('http://localhost:3000/api/favorite');
  return data.data;
};

export type FilterInputs = {
  name?: string;
  gender?: string;
};

export const filterCharacters = async (params: FilterInputs) => {
  const data = await axios.get<CharactersResponseDTO>('character', { params });
  return data.data;
};

export const filterLocations = async (params: FilterInputs) => {
  const data = await axios.get<LocationsResponseDTO>('location', { params });
  return data.data;
};
