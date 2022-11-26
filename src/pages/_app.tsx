import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Appbar from '../components/app-bar/Appbar';
import { useEffect, useState } from 'react';
import { Router } from 'next/router';
import LoadingIndicator from '../components/loading-indicator/LoadingIndicator';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../utility/queryClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      console.log('finished');
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className='w-full flex flex-col min-h-screen bg-mainBg'>
        <Appbar />
        {loading && (
          <div className='h-screen bg-white'>
            <LoadingIndicator />
          </div>
        )}
        {!loading && <Component {...pageProps} />}
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}
