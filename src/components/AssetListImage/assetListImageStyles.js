import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../themes/Metrics';


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  //Sector 1
  sector1text: {
    fontSize: width < 600 ?  wp('5%') :  wp('3%'),
    // right: width < 600 ?  wp('0%') :  wp('0%'),
    color: 'red', 
    marginTop: 15, 
    textAlign:'center',
    // alignItems: 'center',
  },
  menubutton: {
    // backgroundColor: 'skyblue',
    borderRadius: wp('1%'), 
    top: width < 600 ?  wp('-4%') :  wp('-4.5%'),
    width: width < 600 ?  wp('10%') :  wp('6%'), 
    height: hp('4%'),
    alignSelf: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    left:7,
  },
  menuicon: {
    fontSize: 30, 
    marginTop: width < 600 ?  wp('-5%') :  wp('-1.0%'),
    textAlign:'left',  left:5,   color :"#fff",  borderColor:'black',
  },
  closebutton: {
    // backgroundColor: 'skyblue',
    borderRadius: wp('1%'), 
    top: width < 600 ?  wp('-10%') :  wp('-8%'),
    width: width < 600 ?  wp('8%') :  wp('5%'), 
    height: hp('2%'),
    textAlign:'right',
    // alignSelf: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    left:width < 600 ?  wp('87%') :  wp('92%'),
  },
  closeicon: {
    fontSize: 35, marginTop: -32, textAlign:'right', color :"#fff",  borderColor:'black',
  },

  //Sector 2
  container: {
    // flex:1,
    alignItems: 'center',
    top:moderateScale(250),
    // justifyContent: 'center',
  },
  imageContainer: {
    // Your existing styles for the container
  },
  image: {
    // Your existing styles for the image
  },
  fullScreenContainer: {
    // position: 'absolute',
    bottom:moderateScale(300),
    left: 0,
    width: width,
    height: height,
    // backgroundColor: 'white', // Background color for full screen view
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    width: width, // Adjust as needed
    height: height, // Adjust as needed
    resizeMode: 'contain', // or 'cover' based on your preference
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
},
title: {
    fontSize: 16,
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
},
menuButton: {
    position: 'absolute',
    left: 10,
    top: 15,
},
menuIcon: {
    fontSize: 30,
    color: 'white',
},
closeButton: {
    position: 'absolute',
    right: 10,
    top: 15,
},
closeIcon: {
    fontSize: 30,
    color: 'white',
},
imageContainer: {
    flex: 1,
},
imageViewer: {
    flex: 1,
},

});

export default styles;