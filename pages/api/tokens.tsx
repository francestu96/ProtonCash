import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getTokens(req: NextApiRequest, res: NextApiResponse) {
    try {
      res.status(200);
    } catch (error) {
      res.status(400).json({ error });
      console.error(error);
    }
  }
  