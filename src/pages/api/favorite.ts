// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { CharactersResult } from '../../network/models/CharactersResponseDTO';

type Data = {
  success: boolean;
  favorite?: CharactersResult;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    if (req.headers.cookie) {
      const favorite: CharactersResult | undefined = JSON.parse(
        cookie.parse(req.headers.cookie).favorite,
      );
      res.status(200).json({ success: true, favorite: favorite });
    } else {
      res.status(200).json({ success: false });
    }
  }

  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('favorite', JSON.stringify(req.body.favorite), {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        sameSite: 'strict',
        path: '/',
      }),
    );
    res.status(200).json({ success: true });
  }
  if (req.method === 'DELETE') {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('favorite', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        sameSite: 'strict',
        path: '/',
      }),
    );
    res.status(200).json({ success: true });
  }
}
