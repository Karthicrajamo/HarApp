import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {CustomThemeColors} from '../CustomThemeColors';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
  },
  titlesortby: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    opacity: 0.7,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row', // Arrange items in a row
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#ccc',
    backgroundColor: CustomThemeColors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
});

export default styles;
