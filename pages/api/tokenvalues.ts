import User from "model/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "This API call only accepts POST methods" });
  }

  const { symbols } = req.body;

  let response = await fetch(process.env.COINMARKETCAP_API + "symbol=" + symbols.join(','), { headers: new Headers({"X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY || ""})});
  const json = await response.json();

  return res.status(200).json(json)
}