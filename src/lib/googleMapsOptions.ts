   export const GOOGLE_MAPS_API_OPTIONS = {
     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
     libraries: ['places', 'geometry'] as const,
     region: 'IN',
     language: 'en',
   };