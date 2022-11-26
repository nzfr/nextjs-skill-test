import React from 'react';
import { useFavoriteCharacter, useResetFavoritesMutation } from '../../network/apiHooks';
import { MdOutlineHome } from 'react-icons/md';
import Link from 'next/link';
import { characterUrlNormalizer } from '../../utility/urlNormalizers';
import { IoMdTrash } from 'react-icons/io';

const Appbar = () => {
  const favoriteCharacter = useFavoriteCharacter();
  const resetFavorites = useResetFavoritesMutation();
  const userName =
    favoriteCharacter.data && favoriteCharacter.data.success
      ? favoriteCharacter.data.favorite.name
      : 'Guest';

  const alreadyAddedToFavs = favoriteCharacter.data && favoriteCharacter.data.success;

  return (
    <div className='app-bar py-px px-4 '>
      <div className='start-justified-row cursor-pointer'>
        <Link href='/'>
          <MdOutlineHome className='mx-2' size={25} />
        </Link>
        <Link
          href={
            alreadyAddedToFavs ? characterUrlNormalizer(favoriteCharacter.data.favorite.id) : '/'
          }
        >
          <div className='font-extrabold text-sm sm:text-2xl'>Hello, {userName}</div>
        </Link>
      </div>
      {alreadyAddedToFavs && (
        <IoMdTrash
          onClick={() => resetFavorites.mutate()}
          size={30}
          className='text-red-500 cursor-pointer hover:text-red-600 hover:shadow-2xl'
        />
      )}
    </div>
  );
};

export default Appbar;
