import axios from 'axios';
import { useState } from 'react';
import Head from 'next/head';
import {
  CharactersResponseDTO,
  CharactersResult,
} from '../../network/models/CharactersResponseDTO';
import { fetchCharactersList, filterCharacters } from '../../network/apiService';
import Container from '../../components/Container';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import CharactersListItem from '../../components/characters/CharactersListItem';

type Props = {
  characters: CharactersResponseDTO;
};

export type SearchInputs = {
  name: string;
  gender: string;
};

export const schema = yup.object({
  name: yup.string(),
  gender: yup.string(),
});

const Characters = (props: Props) => {
  const [characters, setCharacters] = useState<CharactersResult[]>(props.characters.results);
  const [nextPageToLoad, setNextPageToLoad] = useState<string>(props.characters.info.next);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

  const getNextCharacters = () => {
    setIsLoadingContent(true);
    axios
      .get<CharactersResponseDTO>(nextPageToLoad)
      .then((response) => {
        setCharacters((prevState) => {
          return [...prevState, ...response.data.results];
        });
        setNextPageToLoad(response.data.info.next);
      })
      .finally(() => {
        setIsLoadingContent(false);
      });
  };

  const { register, handleSubmit, resetField, getValues } = useForm<SearchInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<SearchInputs> = (data) => {
    if ((!data.gender || data.gender.length === 0) && (!data.name || data.name.length === 0)) {
      toast('Please select at least one filter!', { type: 'error' });
    } else {
      setIsLoadingContent(true);
      filterCharacters(data)
        .then((response) => {
          setNextPageToLoad(response.info.next);
          setCharacters(response.results);
        })
        .catch(() => {
          setCharacters([]);
        })
        .finally(() => {
          setIsLoadingContent(false);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Rick & Morty characters list</title>
      </Head>
      <Container>
        <h1 className='text-lg font-bold text-neutral-900'>Characters list</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='start-justified-row gap-2 my-2'>
          <input
            {...register('name')}
            placeholder='Search character'
            className='w-full rounded-md p-2 shadow-md border border-gray-500 placeholder:text-neutral-900 text-neutral-900'
          />
          <select
            {...register('gender')}
            className='w-full rounded-md p-2 shadow-md border border-gray-500'
          >
            <option value=''>Select gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='genderless'>Genderless</option>
            <option value='unknown'>Unknown</option>
          </select>
          <button
            className='rounded-full border p-2 text-white
             text-sm bg-green-27 border-gray-500'
            type='submit'
          >
            Search
          </button>
          <button
            onClick={() => {
              resetField('name');
              resetField('gender');
              setCharacters(props.characters.results);
              setNextPageToLoad(props.characters.info.next);
            }}
            className='rounded-full border p-2 text-white
             text-sm bg-red-400 border-gray-500'
            type='button'
          >
            Clear
          </button>
        </form>
        <div className='start-justified-row gap-2 my-2'>
          {getValues('name') && getValues('name').length > 0 && (
            <div className='rounded-full border-neutral-600 bg-blue-400 py-1 text-white px-4'>
              {getValues('name')}
            </div>
          )}
          {getValues('gender') && getValues('gender').length > 0 && (
            <div className='rounded-full border-neutral-600 bg-blue-400 py-1 text-white px-4'>
              {getValues('gender')}
            </div>
          )}
        </div>
        <div className='w-full h-full grid grid-cols-2 gap-2'>
          {!isLoadingContent && characters.length === 0 && (
            <span className='font-bold text-lg'>No characters found!</span>
          )}
          {characters.length > 0 &&
            characters.map((char) => {
              return <CharactersListItem key={char.id} character={char} />;
            })}
        </div>
        {characters.length > 0 && nextPageToLoad !== null && (
          <div className='w-full flex flex-row justify-center items-center my-2'>
            <button
              disabled={isLoadingContent}
              onClick={getNextCharacters}
              className={`rounded-lg shadow-lg z-30 hover:shadow-2xl bg-green-27 text-white p-2 ${
                isLoadingContent && 'animate-pulse'
              }`}
            >
              Load More ...
            </button>
          </div>
        )}
      </Container>
    </>
  );
};

export default Characters;

export const getStaticProps = async () => {
  const data = await fetchCharactersList();
  return {
    props: {
      characters: data,
    },
  };
};
