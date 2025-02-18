import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import { currentFontScale, sysBasedFontSize } from '../Login/UserId';

const {width} = Dimensions.get('window');
const isTablet = DeviceInfo.isTablet();

const styles = StyleSheet.create({
  body: {
    position: 'absolute',
    width: '100%',
    height: '40%',
    // resizeMode: 'cover',
    top: 50,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headText: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  resetContainer: {
    width: wp('85%'),
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginVertical:50
  },
  input: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginBottom: hp('2%'),
    backgroundColor: 'white',
    padding: 15,
    fontSize: isTablet ? 18 : 14,
  },
  resetButton: {
    borderRadius: 10,
    backgroundColor: '#3788E5',
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: isTablet ? 18 : 14,
  },
  resetPasswordText: {
    color: '#3788E5',
    textAlign: 'center',
    marginTop: hp('2%'),
    fontSize: isTablet ? 16 : 12,
  }, topContainer: {
    flex: 0.5,
    backgroundColor: 'white',
  },
  circleContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: CustomThemeColors.primary, // Light background color
    padding: 10,
    borderRadius: 0,
    // flex: 1,
    // justifyContent: 'flex-end',
    // width: '100%',
  },circleContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: CustomThemeColors.primary, // Light background color
    padding: 10,
    borderRadius: 0,
    // flex: 1,
    // justifyContent: 'flex-end',
    // width: '100%',
  },
  circleBackground: {
    // width: '100%',
    // height: isTablet ? (isPortrait ? 350 : 250) : 300, // Height adjusted for tablets and portrait/landscape mode
    // backgroundColor: '#3498db',
    // borderTopLeftRadius: isTablet ? (isPortrait ? 175 : 125) : 150, // Half of the height for curve
    // borderTopRightRadius: isTablet ? (isPortrait ? 175 : 125) : 150,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // overflow: 'hidden',
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingBottom: 30,
  },
  headingText: {
    fontSize: isTablet
      ? currentFontScale >= sysBasedFontSize.Large
        ? 16
        : 24
      : 24, // Adjust font size for tablet/phone
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: isTablet
      ? currentFontScale >= sysBasedFontSize.Large
        ? 55
        : 65
      : 0,
  },
  secondheadingText: {
    fontSize: isTablet
      ? currentFontScale >= sysBasedFontSize.Large
        ? 16
        : 16
      : 16, // Adjust font size for tablet/phone
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default styles;
