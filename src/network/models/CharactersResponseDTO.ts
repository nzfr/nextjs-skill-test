export interface CharactersResponseDTO {
  info: CharacterInfo;
  results: CharactersResult[];
}

export interface CharacterInfo {
  count: number;
  pages: number;
  next: string;
  prev: null;
}

export interface CharactersResult {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: Date;
}

export enum CharacterGender {
  Female = 'Female',
  Male = 'Male',
  Unknown = 'unknown',
}

export interface CharacterLocation {
  name: string;
  url: string;
}
