import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000'; // Port from package.json

export const getLatLngFromAddress = async (address: string) => {
  try {
    const Location  = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!Location.ok) {
      throw new Error(`Google API Error: ${Location.statusText}`);
    }

    const data = await Location.json();
    if (data.results.length > 0) {
      return data.results[0].geometry.location;
    }

    return null;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const coords = await getLatLngFromAddress(address);
    if (coords) {
      // Generate JWT token
      const token = jwt.sign({ address, uuid: uuidv4() }, JWT_SECRET, { expiresIn: '1h' });

      // Create JWT-secured link
      const jwtSecureLink = `http://${HOST}:${PORT}/verify?token=${token}`;

      return res.status(200).json({ coords, jwtSecureLink });
    } else {
      return res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
