import Link from 'next/link';

type Props = {
  title: string;
  value: string | number;
  url?: string;
};

const Data = ({ title, value, url }: Props) => {
  return (
    <div className='start-justified-row'>
      <span className='text-sm font-bold'>{title}</span>
      <span className='mr-1'>:</span>
      {url && (
        <Link className='text-sm underline' href={url}>
          {value}
        </Link>
      )}
      {!url && <span className='text-sm'>{value}</span>}{' '}
    </div>
  );
};
export default Data;
