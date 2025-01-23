import {StyleSheet} from 'react-native';
import {CustomThemeColors} from '../CustomThemeColors';

const ScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    justifyContent: 'space-between', // Ensures button is at the bottom
  },
  scrollContainer: {
    flex: 1,
  },
  lessMorebuttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default ScreenStyle;
