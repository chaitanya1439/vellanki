// filepath: /src/config/googleMapsConfig.ts
export const GOOGLE_MAPS_API_OPTIONS = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places', 'geometry'],
  region: 'IN',
  language: 'en',
};