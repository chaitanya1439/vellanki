import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBaYvW9Ki74N1YMgRmlEz6Mc1UoTyCuH8o';

export const getLatLngFromAddress = async (address: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    return data.results[0].geometry.location;
  }
  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address === 'string') {
    try {
      const coords = await getLatLngFromAddress(address);
      if (coords) {
        res.status(200).json(coords);
      } else {
        res.status(404).json({ error: 'Address not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid address' });
  }
}
export interface Location {
  lat: number;
  lng: number;
}
