import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  body: {
    position: 'absolute',
    top: 0,
    height: width < 600 ? hp('70') : hp('75'),
    width: '100%',
    zIndex: 10,
  },
  footer: {
    // position: 'absolute',
    bottom: 0,
    zIndex: 1,
    height: width < 600 ? 40 : 40,
    width: '100%',
  },
  foot: {
    marginTop: width > 600 ? '65%' : '50%',
  },
  resetcontainer: {
    // position: 'absolute',
    // left:0,
    // right:0,
    // top:250,
    top: 160,
    bottom: 0,
  },
  subcontainer2: {
    alignItems: 'center',
  },
  input: {
    width: wp('80%'),
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginVertical: hp('2%'),
    opacity: 1,
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
  },
  resetbutton: {
    borderRadius: 10,
    backgroundColor: '#3788E5',
    bottom: hp('2%'),
    width: wp('80%'),
    paddingVertical: 10,
    height: verticalScale(49),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '9%',
  },
  resetbuttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
    fontFamily: 'Montserrat_700Bold',
  },
  resetpassword: {
    color: '#3788E5',
    bottom: hp('1.2%'), // 2% of screen height
    alignSelf: 'center',
    marginBottom: 35,
  },
  headText: {
    textAlign: 'center',
    top: 60,
    fontSize: 20,
    color: 'white',
  },
  // maincontainer: {
  //   flex: 1,
  // },
  // background: {
  //   flex: 1,
  //   resizeMode: 'cover',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // resetpasswordheading: {
  //   color: 'white',
  //   fontSize: wp('5%'),
  //   bottom: hp('25%'), // 15% of screen height
  // },
  // userdetailscontainer :{
  //   position: 'absolute',
  // },
  // subcontainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // button: {
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   backgroundColor:'#3788E5',
  //   bottom: hp('2%'),
  //   width: wp('80%'),
  //   paddingVertical:10 ,
  //   height: verticalScale(49),
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // input: {
  //   width: wp('80%'), // 80% of screen width
  //   borderBottomWidth: 1,
  //   borderColor: '#ccc',
  //   marginVertical: hp('2%'), // 2% of screen height
  //   paddingHorizontal: wp('5%'), // 5% of screen width
  //   opacity:1,
  // },
  // resetbutton: {
  //   backgroundColor: 'white',
  //   borderRadius: wp('7%'), // 7% of screen width
  //   top: hp('7%'), // 5% of screen height
  //   width: wp('40%'), // 40% of screen width
  //   height: hp('3%'),
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // resetbuttontext: {
  //   color: 'skyblue',
  //   fontWeight: 'bold',
  //   fontSize: wp('3%'),
  // },
  // backtologin: {
  //   color: 'white',
  //   top: hp('8%'), // 2% of screen height
  //   alignSelf: 'center',
  // },
});

export default styles;
