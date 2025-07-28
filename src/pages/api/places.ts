import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { input, type } = req.query;

    if (!input || !type) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    let url = '';
    let params: Record<string, string | undefined> = {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      language: 'en',
    };

    switch (type) {
      case 'autocomplete':
        url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        params = {
          ...params,
          input: Array.isArray(input) ? input[0] : input,
          components: 'country:in',
        };
        break;
      case 'details':
        url = 'https://maps.googleapis.com/maps/api/place/details/json';
        params = {
          ...params,
          place_id: Array.isArray(input) ? input[0] : input,
          fields: 'geometry,formatted_address',
        };
        break;
      case 'geocode':
        url = 'https://maps.googleapis.com/maps/api/geocode/json';
        params = {
          ...params,
          latlng: typeof input === 'string' ? input : Array.isArray(input) ? input[0] : undefined,
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid request type' });
    }

    const response = await axios.get(url, { params });
    return res.status(200).json(response.data);
  } catch (error: unknown) {
    console.error('Places API Error:', error);

    // Try to extract status and message safely
    let status = 500;
    let message = 'Internal server error';

    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.error_message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return res.status(status).json({ message });
  }
} 