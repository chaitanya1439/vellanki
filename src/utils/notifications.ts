// utils/notifications.ts

interface NotificationPayload {
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
      driver?: {
        id: string;
        vehicle_type: string;
        rate: string;
      };
    };
  };
}

export const sendPushNotification = async (pushToken: string, data: NotificationPayload['data']) => {
  try {
    const message: NotificationPayload = {
      to: pushToken,
      sound: 'default',
      title: 'New Ride Request',
      body: 'You have a new ride request.',
      data,
    };

    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};
