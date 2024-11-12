import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../themes/Metrics';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomThemeColors } from '../CustomThemeColors';


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  
//Sector 1
sector1text: {
    fontSize: width < 600 ?  wp('5%') :  wp('3%'),
    // right: width < 600 ?  wp('0%') :  wp('0%'),
    color: 'white', 
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
  scanicon: {
    fontSize: 30, 
    marginTop: width < 600 ?  wp('-15%') :  wp('-11%'),
    textAlign:'right', 
    right:width < 600 ?  wp('13%') :  wp('9%'), 
    color :"#fff",  borderColor:'black',
  },
  closebutton: {
    // backgroundColor: 'skyblue',
    borderRadius: wp('1%'), 
    top: width < 600 ?  wp('-2%') :  wp('-1.5%'),
    width: width < 600 ?  wp('8%') :  wp('5%'), 
    height: hp('2%'),
    textAlign:'right',
    // alignSelf: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    left:width < 600 ?  wp('87%') :  wp('90%'),
  },
  closeicon: {
    fontSize: 35, marginTop: -32, textAlign:'right', color :"#fff",  borderColor:'black',
  },

//Sector 2
  assetdetailstab: {
    height:30,
    justifyContent: 'center',
    alignSelf: 'center',
    // bottom: width < 600 ? hp('-0.5%') : hp('9%'),
    top:moderateScale(3),
    // width: width < 600 ?  wp('96%') :  wp('98%'), 
    width:horizontalScale(357),
  },
  assetdetailstext: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  }, 

 //Sector 3 
  sector3: {
    backgroundColor:'red',
    // height: height < 600 ? height * 0.2 : height * 0.2350,
    height: height < 900 ?  wp('60.6%') :  wp('32%'),
    left:horizontalScale(5),
    // marginTop:4, 
    top:moderateScale(3),
    width:horizontalScale(355),
    borderRadius: wp('0%'),
    borderWidth:1,
    borderColor:'lightgrey',
    backgroundColor:'#fdfdfd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:0.5,
    borderColor:'lightgrey',
  },
  type: {
    padding:10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightgrey',
    // width: width < 600 ?  wp('3%') :  wp('0.0%'),
    // marginTop: height * 0.01,
    // marginLeft: 10,
    // textAlign: 'left'
  },
  class: {
    padding:10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightgrey',
    // marginTop:  width < 600 ?  wp('-2%') :  wp('2.0%'),
    // marginLeft: 10,
    // textAlign: 'left'
  },
  assetno: {
    padding:10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightgrey',
    // marginTop:  width < 600 ?  wp('-2%') :  wp('1.0%'),
    // marginLeft: 10,
    // textAlign: 'left'
  },
  value: {
    fontSize: 16,
    color: 'black',
    width: 200,
  },
  specvalue: {
    fontSize: 16,
    // color: 'black',
    width: width < 600 ?  wp('79%') :  wp('85%'), 
  },
//--------------------------------------------------------------------------------------------------- 
  imagecontainer: {
    padding:5,
    backgroundColor:'#f2f8f8',
    shadowColor: '#4dc8d1',
    // shadowOpacity: 0.25,
    // shadowRadius: 1.84,
    elevation: 5,
    borderColor:'lightgrey',
    borderWidth:1,
    borderRadius: width < 600 ?  wp('3%') :  wp('1%'),
    height: height < 900 ?  wp('25%') :  wp('13%'), //test
    width:horizontalScale(100),
    alignSelf:'flex-end',
    bottom:112,
    right:5,
    resizeMode:'contain',
  },
  image: {
    width: '100%', // Adjust as needed
    height: 90, // Adjust as needed
    resizeMode:'contain', // or 'contain' based on your preference
    marginBottom:width < 600 ?  wp('-1%') :  wp('1%'),
  },
 //--------------------------------------------------------------------------------------------------- 
  sectionrow: {
    padding:5,
    justifyContent: 'space-between', // Aligns children along the main axis (horizontally)
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:0.5,
    borderColor:'lightgrey',
    // marginTop:-100
    // marginTop:width < 600 ?  wp('-32%') :  wp('-22%'), // styles for image in detailScreen
    marginTop:width < 600 ?  wp('-25%') :  wp('-11.5%'), // styles for image in imageScreen

  },
  locationicon: {
    fontSize: 17, 
    textAlign:'left', 
    color :"#c23535",  
    borderColor:'black',
  },
  sector: {
    fontSize: 16,
    color: 'black',
    right: width < 600 ?  wp('13%') :  wp('22%'),

  },
  status: {
    // fontSize: 16,
    fontSize: width < 600 ? RFValue(9) : RFValue(9),
    fontWeight:'bold',
    color: 'black',
    left:horizontalScale(40),
  },
  ownership: {
    // fontSize: 16,
    fontSize: width < 600 ? RFValue(9) : RFValue(9),
    fontWeight:'500',
    color: 'black',
  },
 //--------------------------------------------------------------------------------------------------- 
  locationrow: {
    padding:5,
    justifyContent: 'space-between', // Aligns children along the main axis (horizontally)
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:0.5,
    borderColor:'lightgrey',
    // marginTop:10
    marginTop:width < 600 ?  wp('-1%') :  wp('2%'),
  },

//Sector 4
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingBottom:40,
    bottom:width < 600 ?  wp('0%') :  wp('-5%'),
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    // borderBottomWidth: 2,
    borderColor: 'transparent',
    borderWidth: 1, // Add border width for all tabs
    borderColor: '#98a3d4', // Add border color for all tabs
  },
  activeTab: {
    borderColor: 'blue',
    backgroundColor:'#aee1f5'
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#331bbd',
  },
  tabContent: {
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:'lightgrey',
    // height: height < 600 ? height * 0.2 : height * 0.615,
    height: height < 600 ? height * 0.2 : height * 0.50,
    bottom:19,
    paddingHorizontal:1,
    // flex: 1,
  },
  column: {
    flex:width < 600 ?  wp('0%') :  wp('1%'),
    // paddingBottom:moderateScale(20),
    paddingBottom:width < 600 ?  wp('3%') :  wp('23%'),
  },
  label: {
    padding:28,
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: -5, // To align the asset details in the tab - Hari
    color: 'grey',
  },
  values: {
    paddingHorizontal: 30,
    marginTop: -18,
    fontSize: 16,
    // fontWeight:'500',
    color: 'black',
  },
  noDataText:{
    // paddingHorizontal: 30,
    // marginTop: -18,
    fontSize: 15,
    // fontWeight:'500',
    color: CustomThemeColors.primary,
    opacity:0.1
  },
  borderbottom: {
    borderBottomWidth:2,
     borderColor: 'lightgrey',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    // left:horizontalScale(5),
    // top:moderateScale(10),
    paddingVertical: 8, // Reduce padding to make button smaller    
  },
  backButton: {
    backgroundColor: '#3b81b1',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    left: width < 600 ?  wp('10%') :  wp('15%'),
  },
  scanNextButton: {
    backgroundColor: '#3b81b1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    right: width < 600 ?  wp('10%') :  wp('15%'),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
//Image
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
modalBackground: {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
},
modalImage: {
  width: '90%',
  height: '80%',
  resizeMode: 'contain',
},


  
  

});

export default styles;