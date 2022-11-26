import { GetServerSidePropsContext } from 'next';
import { fetchLocationDetails } from '../../network/apiService';
import { LocationResult } from '../../network/models/LocationsResponseDTO';
import Container from '../../components/Container';
import Data from '../../components/data/Data';
import { extractIdFromURL } from '../../utility/extractIdFromURL';
import Link from 'next/link';
import { characterUrlNormalizer } from '../../utility/urlNormalizers';
import Head from 'next/head';

type Props = {
  location: LocationResult;
};

const LocationDetail = ({ location }: Props) => {
  return (
    <>
      <Head>
        <title>{location.name}</title>
      </Head>
      <Container>
        <h1 className='heading-title'>{location.name} Details</h1>
        <div className='location-details-card'>
          <Data title='Type' value={location.type} />
          <Data title='Dimension' value={location.dimension} />
          <h3 className='card-title'>Residents: </h3>
          <div className='w-full grid grid-cols-7 gap-2'>
            {location.residents.map((res, index) => {
              const id = extractIdFromURL(res);
              return (
                <Link
                  href={characterUrlNormalizer(id)}
                  key={index}
                  className='character-details-card'
                >
                  <Data title='Resident Number' value={id} />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </>
  );
};

export default LocationDetail;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query;
  context.res.setHeader('Cache-control', 'public, s-maxage=600000,stale-while-revalidate=50');
  const location = await fetchLocationDetails(id as string);

  return {
    props: {
      location: location,
    },
  };
};
