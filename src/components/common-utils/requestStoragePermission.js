// /*The requestStoragePermission function is designed to handle scenarios where The app needs
// access to the user's storage on Android devices, particularly for reading media files or accessing external storage*/

// import {PermissionsAndroid, Platform} from 'react-native';

// export const requestStoragePermission = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       let permission;

//       // Use appropriate permission based on Android version
//       if (Platform.Version >= 33) {
//         // Android 13+
//         permission = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to your images',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//       } else {
//         // For Android 6.0 to 12.x
//         permission = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to your storage',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//       }

//       // Check if permission was granted
//       if (permission === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the storage');
//         return true;
//       } else {
//         console.log('Storage permission denied');
//         return false;
//       }
//     }
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

import {PermissionsAndroid, Platform} from 'react-native';

export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      let permission;

      // Use appropriate permission based on Android version
      if (Platform.Version >= 33) {
        // Android 13+
        permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission',
            message: 'App needs access to your images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else {
        // For Android 6.0 to 12.x
        permission = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ],
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        // Check if both permissions were granted
        if (
          permission[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          permission[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the storage');
          return true;
        } else {
          console.log('Storage permissions denied');
          return false;
        }
      }

      // Check if permission was granted for Android 13+
      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
