import { CharactersResult } from '../../network/models/CharactersResponseDTO';
import Link from 'next/link';
import Image from 'next/image';
import Data from '../data/Data';

type Props = {
  character: CharactersResult;
};

const CharactersListItem = ({ character }: Props) => {
  return (
    <div className='character-details-card'>
      <div className='flex flex-row gap-2 text-sm  justify-start items-center '>
        <Link href={`/characters/${character.id}`}>
          <Image
            className='shadow-md z-30 rounded-full border-gray-300 hover:border-gray-500 border-2'
            width='100'
            height={100}
            src={character.image}
            alt={character.name}
          />
        </Link>
        <div className='flex flex-col'>
          <Link href={`/characters/${character.id}`}>
            <h3 className='card-title'>{character.name}</h3>
          </Link>
          <Data title='Status' value={character.status} />
        </div>
      </div>
    </div>
  );
};
export default CharactersListItem;
