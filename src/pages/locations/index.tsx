import { LocationResult, LocationsResponseDTO } from '../../network/models/LocationsResponseDTO';
import Link from 'next/link';
import { fetchLocationsList, filterLocations } from '../../network/apiService';
import Container from '../../components/Container';
import Data from '../../components/data/Data';
import { locationUrlNormalizer } from '../../utility/urlNormalizers';
import { useState } from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, SearchInputs } from '../characters';
import { toast } from 'react-toastify';
import Head from 'next/head';

type Props = {
  locations: LocationsResponseDTO;
};

const Locations = (props: Props) => {
  const [locations, setLocations] = useState<LocationResult[]>(props.locations.results);
  const [nextPageToLoad, setNextPageToLoad] = useState<string>(props.locations.info.next);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

  const getNextLocations = () => {
    setIsLoadingContent(true);
    axios
      .get<LocationsResponseDTO>(nextPageToLoad)
      .then((response) => {
        setLocations((prevState) => {
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
    if (!data.name || data.name.length === 0) {
      toast('Please select at least one filter!', { type: 'error' });
    } else {
      setIsLoadingContent(true);
      filterLocations(data)
        .then((response) => {
          setNextPageToLoad(response.info.next);
          setLocations(response.results);
        })
        .catch(() => {
          setLocations([]);
        })
        .finally(() => {
          setIsLoadingContent(false);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Locations List!</title>
      </Head>
      <Container>
        <h1 className='text-lg font-bold text-neutral-900'>Locations list</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='start-justified-row gap-2 my-2'>
          <input
            {...register('name')}
            placeholder='Search location name'
            className='w-full rounded-md p-2 shadow-md border border-gray-500 placeholder:text-neutral-900 text-neutral-900'
          />
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
              setLocations(props.locations.results);
              setNextPageToLoad(props.locations.info.next);
            }}
            className='rounded-full border p-2 text-white
             text-sm bg-red-400 border-gray-500'
            type='button'
          >
            Clear
          </button>
        </form>
        {getValues('name') && <h2>Showing search results for {getValues('name')}</h2>}
        <div className='grid grid-cols-3 mt-2 gap-2'>
          {locations.map((location) => {
            return (
              <Link key={location.id} href={locationUrlNormalizer(location.id)}>
                <div className='location-details-card'>
                  <h3 className='card-title'>{location.name}</h3>
                  <Data title='Type' value={location.type} />
                  <Data title='Residents' value={location.residents.length} />
                </div>
              </Link>
            );
          })}
        </div>
        {locations.length > 0 && nextPageToLoad !== null && (
          <div className='w-full flex flex-row justify-center items-center my-2'>
            <button
              disabled={isLoadingContent}
              onClick={getNextLocations}
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

export default Locations;

export const getStaticProps = async () => {
  const locations = await fetchLocationsList();
  return {
    props: {
      locations: locations,
    },
  };
};
