import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Load service account credentials from environment variables
const serviceAccount: ServiceAccount = {
   projectId:   process.env.FIREBASE_PROJECT_ID! || 'new-shelteric',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL! || 'firebase-adminsdk-fbsvc@new-shelteric.iam.gserviceaccount.com',
      privateKey:  process.env.FIREBASE_PRIVATE_KEY! || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2xyxgCu+tG08C\nH0bC9h+n1pQW0FVg+jEM3ghcwx4pPHNK64y4lTaUneB3RL+SEfvk4PWkqMoWSdVV\nrCijHvcIqKuw5lVMFPEPtJ4slxFLKXaTn3IrhJ/OMtpTJUvwxeup4xv2B18sS5OX\nSoXTbC9qtCMNn+LN4XRcMHUXWIMKeLVSTzZX7JGYgym+jhCxIeV7R2FH9Ob80PUe\nARU0lBZpmoOKBheFh0MtR/1TLvB6VsZ+2HVExdwjtcnV/ks3fat3a8+olbe1Bhe4\nYnNB3zgpsooEJyZ+1FSi/NBAgl6+gsD1kFcSob+pvZfIoROSxxwJggLoO/NaY/gJ\n+V72XIufAgMBAAECggEAFuFgALXdwwHEJjPcG9PLqqsF5sU1quom8cFpspMKV4cl\nt589Am5LYtdQnh2RDawKqGAw3+fxRFEBz7O5cpIRwpe6xm5PBzMn6htmIZbXp10N\nZvVyyVfU2W8sPXRRyVY9Zgr0GRxbIaRkWXAOyKSmWukp6i61qagrdM7sGXwPC2RS\nC1KS4mSoa8YXjH1pduZd8N/cZ+H5OFvl4P8cc5mPFRBcuI6meHA/ALTphUPv0klv\nknZ+TTgmuzSevsIAd9Rb8qxmys6y62i0FgkdKhytfySrXTeySFO4PclyzKih9B5X\n35I5clcncpkRBJXowm10gCktAXBDLLDLAyxnMBLnYQKBgQD+3Is/AlVSc147PH/c\n5+f4cg3IglaMAfzuvyKm+m86fA9JsWCCVUsoYTRDbjnYeic4TSwqrGnwta5ylqSR\nkyH+B9q5P/XzmBbpofWp1Y/YdCkL2mas8kMIJ/nNjQDuyZcjXGy0Z/9GOgn14Aiy\nibbzdnbz24qcAExBqiwnyfV5UwKBgQC3mDIcX/cEt5noD9Fa+Am4YwmAkL8l3Bab\nf8oqPfNZCaUh2kn/T7qP2I+5k6fsPs4D5lgEFRmEubAoVetJP9q/kIHwXTgdKq0K\n7bJ1seaKJw2YkMFdNwFd6Gx2dzyU4RCvwwMmtJnuVdk244LeV2ESzkdvE8SLPwIg\n2CTDc/t/BQKBgBrSOPFDnJkVvRf80PP9j+MMlbjBRrxrRSQXB12NQ4FjJvS5bw+o\nTEWOnUJvajUG/fOl430GMgv8AsTaZ61OT6h9SR5vxcGCAv9JZSIfcIj2CI/Pxzhy\nMm28T0S7jxqSKo61HleKDkpkt0Gh9yha598NW41kUF0EhwHuF8GENoozAoGAeLB6\nMKD9N4KikCTl0VFAwo+ITZXZsj+uNOaatY4oDJ4Eie5/unBlCe6o/KuONgVLVND1\nhyl/rvqKTNm+ZFavrEKIyMPfAX1uZ8K+EBS0opjtnR97nZVtNph1xKK5ln0lhQVD\nawxKLJ0Ov8Br5VG3pK8p0mFCUO9IrOKpuDrkVykCgYEAjq+CBP20wEuAhhd40mYX\nMAXCnL7VfVjgVtgYeGhStTQNMitrbWwt8FyoBRtbNBjUcCmd2WGgtL0gpXHiz1GR\nKJ7ocDYb7J4dgq9fwEH+LM35f+Gt50J5Eka5qYbUZ7d44seUaxDq6w3kwKzNleh5\najEGtaRkHyLpb1xAkWn5opE=\n-----END PRIVATE KEY-----\n'.replace(/\\n/g, '\n'),
    };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

interface NotificationData {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: {
    orderData: {
      currentLocation: {
        latitude: number;
        longitude: number;
      };
      marker: {
        latitude: number;
        longitude: number;
      };
      distance: string;
      currentLocationName: string;
      destinationLocation: string;
};
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const notificationData: NotificationData = req.body;
    
    const message = {
      notification: {
        title: notificationData.title,
        body: notificationData.body,
      },
      data: {
        orderData: JSON.stringify(notificationData.data.orderData),
      },
      token: notificationData.to,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    
    res.status(200).json({ message: 'Notification sent successfully', messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
}
