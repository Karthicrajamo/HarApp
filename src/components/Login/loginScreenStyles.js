import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import DeviceInfo from 'react-native-device-info';
import {CustomThemeColors} from '../CustomThemeColors';

const {width, height} = Dimensions.get('window');
const isTablet = DeviceInfo.isTablet();
const isPortrait = height > width; // Check if in portrait mode
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // topContainer: {
  //   backgroundColor: 'red',
  //   flex: 1,
  //   width: '100%',
  //   alignItems: 'center',
  //   overflow: 'hidden',
  //   alignSelf: 'center',
  // },

  topContainer: {
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
    fontSize: isTablet ? 28 : 24, // Adjust font size for tablet/phone
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  secondheadingText: {
    fontSize: isTablet ? 18 : 16, // Adjust font size for tablet/phone
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLogo: {
    // marginTop: 10,

    borderRadius: 50, // Round the logo
  },

  thirdHeading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: 'black',
  },

  bottomLogo: {
    width: width * 0.2,
    height: width * 0.2,
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: height * 0.02,
  },

  middleContainer: {
    flex: 0.5,
    justifyContent: 'center',
    paddingHorizontal: '10%',
    marginBottom: 80,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  input: {
    width: '100%',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginVertical: hp('2%'),
    opacity: 1,
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
  },

  emailInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: height * 0.02,
    color: 'black',
    borderColor: 'lightgrey',
  },

  passwordInput: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    color: 'black',
    borderColor: 'lightgrey',
  },
  checkboxContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    // paddingHorizontal: 12, // Horizontal padding for comfortable space
    backgroundColor: '#ffffff',
    borderRadius: 15, // Rounded corners for a contemporary look
    borderWidth: 0,
    // borderColor: '#1e1f20',
    marginVertical: 5, // Vertical margin to separate containers
  },
  checkboxtext: {
    fontSize: 14, // Adjusted for better readability across devices
    color: '#212529', // Darker text color for better contrast
    fontWeight: '400', // Balanced weight for better legibility
    lineHeight: 20, // Ensures consistent line height with text size
  },

  loginButton: {
    marginTop: 10,
    backgroundColor: 'rgb(55, 136, 229)',
    borderRadius: 15,
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },

  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  ForgotpasswordButton: {
    marginTop: height * 0.02,
    alignItems: 'center',
  },

  ForgotpasswordonText: {
    fontSize: 14,
    color: 'darkgrey',
    textDecorationLine: 'underline',
  },

  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },

  bottomImage: {
    width: '100%',
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  versionText: {
    fontSize: 14,
    color: 'black',
  },
});

export default styles;
