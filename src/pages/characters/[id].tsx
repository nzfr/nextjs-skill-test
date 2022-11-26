import { GetServerSidePropsContext } from 'next';
import { CharactersResult } from '../../network/models/CharactersResponseDTO';
import Image from 'next/image';
import { extractIdFromURL } from '../../utility/extractIdFromURL';
import { fetchCharacterDetails } from '../../network/apiService';
import Data from '../../components/data/Data';
import { locationUrlNormalizer } from '../../utility/urlNormalizers';
import {
  useFavoriteCharacter,
  useNewFavoriteCharacterMutation,
  useResetFavoritesMutation,
} from '../../network/apiHooks';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import Head from 'next/head';

type Props = {
  character: CharactersResult;
};

const Character = ({ character }: Props) => {
  const setFavorite = useNewFavoriteCharacterMutation();
  const favoriteCharacter = useFavoriteCharacter();
  const resetFavorites = useResetFavoritesMutation();

  const alreadyAddedToFavs =
    favoriteCharacter.data &&
    favoriteCharacter.data.success &&
    favoriteCharacter.data.favorite.id === character.id;

  return (
    <>
      <Head>
        <title>{character.name}</title>
      </Head>
      <div className='p-4 flex flex-col justify-start items-start'>
        <h2 className='heading-title'>Character Info: </h2>
        <div className='character-details-card'>
          <div className='start-justified-row gap-2 '>
            <Image
              className='circular-avatar-bordered'
              width='100'
              height={100}
              src={character.image}
              alt={character.name}
            />
            <div className='flex flex-col'>
              <h3 className='text-lg font-semibold'>{character.name}</h3>
              <Data title='Status' value={character.status} />
              <Data title='Species' value={character.species} />
              <Data
                title='Origin'
                value={character.origin.name}
                url={locationUrlNormalizer(extractIdFromURL(character.origin.url))}
              />
              <Data
                title='Location'
                value={character.location.name}
                url={locationUrlNormalizer(extractIdFromURL(character.location.url))}
              />
            </div>
          </div>
          {alreadyAddedToFavs && (
            <MdFavorite
              onClick={() => resetFavorites.mutate()}
              size={30}
              className='text-green-27 cursor-pointer hover:text-red-400 hover:z-30 hover:shadow-2xl'
            />
          )}
          {!alreadyAddedToFavs && (
            <MdFavoriteBorder
              onClick={() => setFavorite.mutate(character)}
              size={30}
              className='text-green-27 cursor-pointer hover:text-red-400 hover:shadow-2xl'
            />
          )}
        </div>
        <h2 className='font-bold text-lg my-2'>Episode(s): </h2>
        <div>{character.episode.map((epi) => extractIdFromURL(epi)).join(', ')}</div>
      </div>
    </>
  );
};
export default Character;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query;
  context.res.setHeader('Cache-control', 'public, s-maxage=600000,stale-while-revalidate=50');
  const character = await fetchCharacterDetails(id as string);

  return {
    props: {
      character: character,
    },
  };
};
