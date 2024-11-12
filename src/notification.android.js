import PushNotification from 'react-native-push-notification';

// Function to show a notification
const showNotification = (title, message) => {
  try {
    console.log(
      `[INFO] Attempting to show notification - Title: ${title}, Message: ${message}, Channel ID: 9986598895`,
    );

    PushNotification.localNotification({
      channelId: '9986598895',
      title: title,
      message: message,
      smallIcon: 'ic_notification',
      bigText: message,
      vibrate: true,
      vibration: 300,
      playSound: true,
      priority: 'high',
      soundName: 'default',
      onSuccess: response =>
        console.log('[SUCCESS] Notification shown successfully', response),
      onError: error =>
        console.error('[ERROR] Error showing notification', error),
    });

    console.log('[INFO] Notification request sent to PushNotification.');
  } catch (error) {
    console.error(
      `[ERROR] Exception while showing notification: ${error.message}`,
    );
  }
};

// Function to schedule a notification
const handleScheduleNotification = (title, message) => {
  try {
    const scheduledTime = new Date(Date.now() + 5 * 1000);
    console.log(
      `[INFO] Scheduling notification - Title: ${title}, Message: ${message}, Channel ID: 99, Scheduled Time: ${scheduledTime}`,
    );

    PushNotification.localNotificationSchedule({
      channelId: '99', // Ensure this matches the channel ID created in MainApplication.java
      title: title,
      message: message,
      date: scheduledTime,
      smallIcon: 'ic_notification', // Icon for debugging
      bigText: message, // Helps to debug if the message is too long
      vibrate: true,
      vibration: 300, // Vibration pattern in milliseconds
      playSound: true,
      soundName: 'default', // Sound for debugging
      onSuccess: response =>
        console.log('[SUCCESS] Scheduled notification successfully', response),
      onError: error =>
        console.error('[ERROR] Error scheduling notification', error),
    });

    console.log(
      '[INFO] Notification schedule request sent to PushNotification.',
    );
  } catch (error) {
    console.error(
      `[ERROR] Exception while scheduling notification: ${error.message}`,
    );
  }
};

// Function to cancel all local notifications
const handleCancel = () => {
  try {
    console.log('[INFO] Cancelling all local notifications');

    PushNotification.cancelAllLocalNotifications();

    console.log('[SUCCESS] All local notifications cancelled.');
  } catch (error) {
    console.error(
      `[ERROR] Exception while cancelling notifications: ${error.message}`,
    );
  }
};

export {showNotification, handleScheduleNotification, handleCancel};
