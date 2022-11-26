import Head from 'next/head';
import Link from 'next/link';

type Props = {
  routes: PageRouteTypes[];
};

export default function Home({ routes }: Props) {
  return (
    <div>
      <Head>
        <title>Rick & Morty App!</title>
        <meta name='description' content='created by NZFR!!' />
        <link rel='icon' href='/public/favicon.ico' />
      </Head>
      <div className='w-full h-full'>
        <ul className='list-disc mx-8 my-4'>
          {routes.map((route, index) => {
            return (
              <li key={index}>
                <Link href={route.url}>{route.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const pageRoutes: PageRouteTypes[] = [
    {
      name: 'Characters List',
      url: '/characters',
    },
    {
      name: 'Locations List',
      url: '/locations',
    },
  ];
  return {
    props: {
      routes: pageRoutes,
    },
  };
};

type PageRouteTypes = { name: string; url: string };
