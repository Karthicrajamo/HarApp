import {useEffect} from 'react';
import {Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

const useOrientation = () => {
  useEffect(() => {
    const setOrientation = async () => {
      const isTablet = await DeviceInfo.isTablet();
      const {width, height} = Dimensions.get('window');

      // Determine the initial orientation
      if (isTablet) {
        Orientation.lockToLandscape(); // Set landscape for tablets
      } else {
        Orientation.lockToPortrait(); // Set portrait for phones
      }
    };

    setOrientation();

    const subscription = Dimensions.addEventListener('change', () => {
      const {width, height} = Dimensions.get('window');
      const isTablet = DeviceInfo.isTablet(); // Check if it is a tablet

      // Check current orientation and lock accordingly
      if (isTablet) {
        if (width < height) {
          Orientation.lockToLandscape(); // Force landscape on tablet
        }
      } else {
        if (width > height) {
          Orientation.lockToLandscape(); // Force landscape on tablet
          // Orientation.lockToPortrait(); // Force portrait on phone
        }
      }
    });

    // Cleanup
    return () => {
      Orientation.unlockAllOrientations(); // Unlock orientation when the component is unmounted
      subscription?.remove(); // Remove the listener
    };
  }, []);
};

export default useOrientation;
