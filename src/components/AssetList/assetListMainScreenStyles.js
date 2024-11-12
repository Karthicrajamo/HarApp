import {StyleSheet} from 'react-native';
import {CustomThemeColors} from '../CustomThemeColors';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
const styles = StyleSheet.create({
  // HEADER
  headerContainer: {
    // width: '100%',
    // height: '6%',
    flex: 0.1,
    backgroundColor: CustomThemeColors.header,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  headerRightSideUtils: {
    // width: "40%",
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    padding: 3,
    marginRight: '2%',
  },
  headerRightSideUtilsIcons: {
    color: CustomThemeColors.headerTextColor,
    fontSize: 26,
    paddingHorizontal: 3,
  },

  // Main Filter (DEPARTMENT, LOCATION, STATUS)
  mainFIlterContainer: {
    width: '100%',
    height: '15%',
    backgroundColor: 'white',
    paddingBottom: 5,
    paddingHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 100,
  },
  mainFIlterElementContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    backgroundColor: CustomThemeColors.sectionBackgroundColor,
    marginTop: 5,
    justifyContent: 'center',
    borderRadius: 15,
    minHeight: 20,
    // borderWidth:1,
    // borderColor:CustomThemeColors.primary,
  },
  mainFIlterElementTitleContainer: {
    backgroundColor: CustomThemeColors.primary,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    width: '50%',
    justifyContent: 'center',
    paddingLeft: horizontalScale(10),
    minHeight: 20,
  },
  mainFIlterElementTitle: {
    color: 'white',

    fontWeight: 'bold',
  },
  mainFIlterElementPickerContainer: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flex: 1,
    justifyContent: 'center',
    // borderWidth:1,
    // borderColor:CustomThemeColors.primary,
  },

  // SORT AND FILTER SECTION
  sortAndFilterContainer: {
    width: '100%',
    height: '6%',
    flexDirection: 'row',
    backgroundColor: 'maroon',
    minHeight: 45,
  },
  sortElementContainer: {
    backgroundColor: CustomThemeColors.sectionBackgroundColor,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  filterElementContainer: {
    backgroundColor: CustomThemeColors.sectionBackgroundColor,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5,
  },

  // List Of Details
  flatListContainer: {
    // backgroundColor: CustomThemeColors.extraFadedPrimary,
    // borderWidth:1,
    // borderColor:CustomThemeColors.primary,
    borderRadius: 10,
    marginLeft: 5,
    marginVertical: 3,

    // flex:1,
  },

  flatListItemContainer: {
    // backgroundColor: CustomThemeColors.primary,
    borderRadius: 10,
  },
  flatListItemSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    // borderWidth:1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  // --------------------
  scrollView: {},
  flatListContainer: {
    borderRadius: 10,
    marginLeft: 5,
    marginVertical: 3,
    // Your styles here
  },
  flatListItemContainer: {
    borderRadius: 10,
    // Your styles here
  },
  flatListItemSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center' ,
    // padding:5,
    paddingRight: 10, // borderWidth:1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
    // Additional styles here
  },
  innerContainer: {
    flexDirection: 'column',
    width: '90%',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    // paddingHorizontal: 5,
  },
  tag: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 2,
    marginBottom: 5,

    height: 20,
  },
  tagText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'white',
    // maxWidth: '150%',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  categoryText: {
    fontSize: 14,
    marginRight: 5,
    color: 'black',
  },
  separator: {
    color: 'blue',
    fontWeight: 'semibold',
  },
  classificationText: {
    fontSize: 12,
    flexShrink: 1,
    color: 'black',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
    color: 'black',
  },
  departmentText: {
    fontSize: 13,
    flexShrink: 1,
    color: 'black',
  },
  subDepartmentText: {
    // maxWidth: '35%',
    overflow: 'hidden',
    color: 'black',
    fontSize: 13,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // maxWidth: '25%',
    // overflow: 'hidden',
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 13,
    color: 'black',
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginRight: 5,
    width: '10%',
  },
  skeletonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    color: CustomThemeColors.primary,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    color: 'black',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white', // Ensure background color is set
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black', // Ensure text color is set
  },
  closeIconContainer: {
    alignSelf: 'flex-end', // Position it at the top-right corner
    padding: 10,
  },
});

export default styles;

// import { StyleSheet } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { CustomThemeColors } from '../CustomThemeColors';
// import { Dimensions } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';
// import { horizontalScale, moderateScale, verticalScale } from '../themes/Metrics';

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({

//   //Sector 1
//   sector1text: {
//     fontSize: width < 600 ?  wp('5%') :  wp('3%'),
//     right: width < 600 ?  wp('15%') :  wp('0%'),
//     color: 'white', marginTop: 16, textAlign:'center',
//   },
//   menubutton: {
//     // backgroundColor: 'skyblue',
//     borderRadius: wp('1%'),
//     top: width < 600 ?  wp('-4%') :  wp('-4.5%'),
//     width: width < 600 ?  wp('10%') :  wp('6%'),
//     height: hp('4%'),
//     alignSelf: 'left',
//     justifyContent: 'center',
//     alignItems: 'center',
//     left:7,
//   },
//   menuicon: {
//     fontSize: 30,
//     marginTop: width < 600 ?  wp('-5%') :  wp('-1.0%'),
//     textAlign:'left',  left:0,   color :"#fff",  borderColor:'black',
//   },
//   searchicon: {
//     fontSize: 30,
//     marginTop: width < 600 ?  wp('0%') :  wp('-0.5%'),
//     textAlign:'right', right:0, color :"#fff",  borderColor:'black',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingHorizontal: 20,
//     backgroundColor: "#72bac7",
//     color :"#fff",
//     borderRadius:5,
//     marginTop: width < 600 ?  wp('-50%') :  wp('-29%'),
//   },
//   flatlistContentContainer: {
//     paddingVertical: 10,
//   },
//   refreshicon: {
//     fontSize: 30,
//     marginTop: width < 600 ?  wp('-1%') :  wp('-0.5%'),
//     textAlign:'right', right:0, color :"#fff",  borderColor:'black',
//   },

//   cropfreeicon: {
//     fontSize: 30,
//     marginTop: width < 600 ?  wp('1%') :  wp('-0.5%'),
//     textAlign:'right', right:0, color :"#fff",  borderColor:'black',
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "#72bac7",
//   },
//   scanicon: {
//     fontSize: 30,
//     marginTop: width < 600 ?  wp('1%') :  wp('-0.5%'),
//     textAlign:'right', right:0, color :"#fff",  borderColor:'black',
//   },
//   closeicon: {
//     fontSize: 35,
//     marginTop: width < 600 ?  wp('-2%') :  wp('-0.8%'),
//     textAlign:'right', color :"#fff",  borderColor:'black',
//   },

// //Sector 2
//   sector2: {
//     height: height < 600 ? height * 0.2 : height * 0.14,
//     width: width < 600 ? width * 0.95 : width * 0.975,
//     marginLeft:10, marginTop:10, borderRadius: wp('20%'),
//   },
//   // department: {
//   //   fontSize: 15,
//   //   fontWeight: 'bold',
//   //   color: 'white',
//   //   // marginTop: width < 600 ?  wp('-3%') :  wp('0.0%'),
//   //   // marginTop: height * 0.01,
//   //   // marginLeft: 0,
//   //   justifyContent:'center',
//   //   alignItems:'center',

//   // },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor:'red'
//   },
//   dropdownpicker: {
//     flex: 1,
//     color:'white',
//     // alignItems:'center',
//     // justifyContent:'center'
//     // marginTop:12, //18-06-hari changed for mobile
//     // height: '10%', // Adjust width as needed
//     // borderWidth: 20, // Border width
//     // borderColor: 'red ', // Border color
//   },
//   // pickerItem: {
//   //   fontSize: 16,
//   //   height: 10, // Adjust item height as needed
//   //   backgroundColor:'red',
//   // },
//   location: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: 'white',
//     marginTop:  width < 600 ?  wp('-6%') :  wp('2.0%'),
//     marginLeft: 10,
//     textAlign: 'left'
//   },
//   locationpicker: {
//     flex: 1,
//     color:'white',
//     marginTop:width < 600 ?  wp('-5%') :  wp('-0.0%'),
//     // width: '40%', // Adjust width as needed
//     borderWidth: 10, // Border width
//     // borderColor: 'red ', // Border color
//   },
//   status: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: 'white',
//     marginTop:  width < 600 ?  wp('-5%') :  wp('1.0%'),
//     marginLeft: 10,
//     textAlign: 'left'
//   },
//   statuspicker: {
//     flex: 1,
//     color:'white',
//     marginTop:width < 600 ?  wp('-5%') :  wp('1.0%'),
//     // width: '40%', // Adjust width as needed
//     // borderWidth: 10, // Border width
//     borderColor: 'red ', // Border color
//   },
//   //Dropdown styles
//   dropdownContainer: {
//     flex: 1, // Take up remaining space in the row
//     marginLeft: 10, // Add some margin to separate dropdown from the label
//     width:300,
//     height:10,
//     justifyContent: 'flex-start', // Align dropdowns to the right

//   },
//   dropdown: {
//     backgroundColor: '#fafafa',
//   },
//   dropdownItem: {
//     justifyContent: 'flex-start', // Align items to the left
//   },
//   dropdownList: {
//     backgroundColor: '#fafafa',
//   },
//   card: {
//     borderRadius: 15,
//     width: '100%',
//     height: 190,
//     backgroundColor: '#3b7392',
//     padding: 10,
//   },
//   item: {
//     backgroundColor: 'transparent',
//     marginTop: -13,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   label: {
//     color: '#fff',
//     marginRight: 20,
//     fontWeight: '700',
//     marginTop: 15,
//   },

//   //Sector 3
//   sector3: {
//     height: height < 600 ? height * 0.2 : height * 0.14,
//     width: width < 600 ? width * 0.95 : width * 0.975,
//     marginLeft:10, marginTop:-13, borderRadius: wp('20%'),
//   },
//   sortbutton: {
//     backgroundColor: 'skyblue',
//     borderRadius: wp('1%'),
//     top: width < 600 ?  wp('4.5%') :  wp('2.5%'),
//     width: width < 600 ?  wp('46%') :  wp('48%'),
//     height: hp('3%'),
//     alignSelf: 'left',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sortbuttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     // fontSize: width < 600 ?  wp('5%') :  hp('2%'),
//     fontSize: width < 600 ? RFValue(16) : RFValue(12),
//   },
//   filterbutton: {
//     backgroundColor: 'skyblue',
//     borderRadius: wp('1%'),
//     top: width < 600 ?  wp('-1.5%') :  wp('-2.1%'),
//     width: width < 600 ?  wp('47%') :  wp('48.5%'),
//     height: hp('3%'),
//     alignSelf: 'right',
//     justifyContent: 'center',
//     alignItems: 'center',
//     left:width < 600 ?  wp('48%') :  wp('49%'),
//   },
//   filterbuttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     // fontSize: width < 600 ?  wp('5%') :  wp('2%'),
//     fontSize: width < 600 ? RFValue(16) : RFValue(12),
//   },

//   //Sector 4
//   scrollView: {
//     flexGrow: 1,
//     // position: 'absolute',
//     // borderRadius:10,
//     // top: 550,
//     // left: 0,
//     // right: 0,
//     // bottom: 0,
//     height: hp('55%'),
//   },
//   assetdetailstab: {
//     height:30,
//     justifyContent: 'center',
//     alignSelf: 'center',
//     bottom: width < 600 ? hp('8%') : hp('9%'),
//     width: width < 600 ?  wp('96%') :  wp('98%'),
//   },
//   assetdetailstext: {
//     color: 'white',
//     fontWeight: 'bold',
//     alignSelf: 'center',
//   },

//   arrowforwardiconmain: {
//     color:'black',
//     fontSize:19,
//     // fontWeight: 'condensedBold',
//     // bottom: width < 600 ? hp('0%') : hp('0%'), // Adjust the bottom position based on screen width
//     // textAlign:'right',
//     left:width < 600 ?  wp('90%') :  wp('94%'),
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between lines
//   },
//   assetdetailslist: {
//     // backgroundColor: 'lightgray',
//     borderWidth: 1, // Full border
//     // backgroundColor: '#eef3f7',
//     // color: 'white',
//     height:  width < 600 ?  wp('32%') :  wp('50%'),
//     alignSelf: 'center',
//     bottom: width < 600 ? hp('8%') : hp('9%'),
//     width: width < 600 ?  wp('96%') :  wp('98%'),
//     // marginBottom: hp('0%'), // Space between each item
//     // borderBottomWidth: 1, // Thickness of the bottom border
//     borderBottomColor: 'gray', // Color of the bottom border
//     // flexDirection: 'row', // Arrange items in a row
//     padding: 10, // Add padding for better spacing
//     // flexWrap:'wrap', // Allow text to wrap to the next line
//     // overflow:'hidden',
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between lines
//     // marginBottom:20,
//   },
//   assetdetailslist1: {
//     // padding: 0, // Add padding for better spacing
//     // alignItems: 'left',
//     // textAlign:'left',
//     padding: width < 600 ?  wp('0.5%') :  wp('1.4%'),
//     right:width < 600 ? hp('2.2%') : hp('1.5%'),
//     width: width < 600 ?  wp('40%') :  wp('50%'),
//     // bottom: width < 600 ? hp('0%') : hp('0%'),
//     flexDirection: 'row', // Arrange items in a row
//     marginBottom:90,
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between lines
//   },
//   assetdetailslist2: {
//     // alignItems: 'left',
//     padding: width < 600 ?  wp('0.5%') :  wp('1.4%'),
//     // textAlign:'left',
//     // overflow:'hidden',
//     // right:width < 600 ? hp('30%') : hp('18.5%'),
//     // bottom: width < 600 ? hp('-5%') : hp('-3%'),
//     flexDirection: 'row', // Arrange items in a row
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between line
//     // flexWrap:'wrap',
//     // width:400,
//     width: width < 600 ?  wp('55%') :  wp('50%'),
//   },
//   assetdetailslist3: {
//     padding: width < 600 ?  wp('0.5%') :  wp('1.4%'),
//     // right:width < 600 ? hp('76%') : hp('49%'),
//     // bottom: width < 600 ? hp('-6%') : hp('-6%'),
//     flexDirection: 'row', // Arrange items in a row
//     width: width < 600 ?  wp('35%') :  wp('50%'),
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between lines
//   },
//   assetdetailslist4: {
//     padding: width < 600 ?  wp('0.5%') :  wp('1.4%'),
//     // right:width < 600 ? hp('104%') : hp('67.5%'),
//     // bottom: width < 600 ? hp('-9%') : hp('-9%'),
//     flexDirection: 'row', // Arrange items in a row
//     width: width < 600 ?  wp('20%') :  wp('25%'),
//     paddingBottom: 20, // Adjust the padding as needed
//     // lineHeight: 30, // Adjust the value as needed to control the spacing between lines
//   },
//   arrowbackicon: {
//     color:'black',
//     fontSize:20,
//     bottom: width < 600 ? hp('4%') : hp('7%'), // Adjust the bottom position based on screen width
//     textAlign:'center',
//     right:50,
//   },
//   arrowforwardicon: {
//     color:'black',
//     fontSize:20,
//     bottom: width < 600 ? hp('10%') : hp('11%'), // Adjust the bottom position based on screen width
//     textAlign:'center',
//     left:50,
//   },
//   numbertext: {
//     color:'black',
//     bottom: width < 600 ? hp('7%') : hp('9%'), // Adjust the bottom position based on screen width
//     justifyContent: 'center',
//     alignSelf: 'center',
//     fontSize:20,
//     fontWeight: 'bold',
//   },

//   //Search
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },

// });

// export default styles;
