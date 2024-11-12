declare module 'react-native-push-notification' {
  interface PushNotification {
    localNotificationSchedule: (options: NotificationOptions) => void;
    cancelAllLocalNotifications: () => void;
  }

  interface NotificationOptions {
    channelId: string;
    title: string;
    message: string;
    smallIcon?: string;
    bigText?: string;
    vibrate?: boolean;
    vibration?: number;
    playSound?: boolean;
    soundName?: string;
    date?: Date;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
  }

  const PushNotification: PushNotification;

  export default PushNotification;
}
