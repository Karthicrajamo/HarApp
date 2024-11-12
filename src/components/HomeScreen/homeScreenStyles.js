import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {CustomThemeColors} from '../CustomThemeColors';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 600;
const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 10,
    margin: 5,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#264e6d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden', // Ensure child content doesn't overflow the parent
  },

  // MENU-BAR - START
  menuBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftIconContainer: {
    flex: 1, // Takes up 1/3 of the space
    alignItems: 'flex-start', // Align icon to the start (left)
  },
  menutext: {
    // flex: 1, // Takes up 1/3 of the space
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    width: '80%',
    fontWeight: 'bold',
  },
  rightIconContainer: {
    flex: 1, // Takes up 1/3 of the space
    alignItems: 'flex-end', // Align icon to the end (right)
  },
  // MENU-BAR - END
  //ANALYTICS
  analyticTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'grey',
    // backgroundColor:'blue',
    fontSize: moderateScale(13),
    textAlign: 'center',
  },
  analyticsContainer: {
    position: 'absolute',
    borderRadius: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // flex:1,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingLeft:100,
    // paddingRight:100,
    paddingHorizontal: horizontalScale(30),
  },
  singleAnalyticsContainer: {
    // backgroundColor: 'green',
    background: 'red',
    alignItems: 'center',
    // backgroundColor: 'brown',
    maxWidth: moderateScale(110),
  },
  //USERDETAILS - START
  userDetailsContainer: {
    // backgroundColor:'#264e6d',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor:'#345d7d',
    borderRadius: 10,
    // borderWidth:3,
    // borderColor:'purple'
  },
  UserDetailsBackground: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // flex: 1,
    // width:'100%',
    // height:'100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    borderRadius: 80,
  },
  UserDetailsSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // left:'100%',
  },
  UserDetailsIconContainer: {
    right: 20,
  },
  UserDetailsTextSection: {
    alignItems: 'center',
    maxWidth: 550,
  },
  UserDetailsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    left: 20,
    maxHeight: 50,
    overflow: 'hidden',
  },
  //USERDETAILS -END

  //GRIDICONS - START
  gridIconscontainer: {
    // flex:1,
    position: 'absolute',
    borderRadius: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CustomThemeColors.whiteBackgroundColor,
    padding: 5,
    // borderWidth:5,
    // borderColor:'#264e6d',
    // zIndex:1,
    //#325c7d'
  },
  iconContainer: {
    padding: 10,
  },
  //GRIDICONS - END

  //Textfiled-Start
  announcementScrollView: {
    position: 'absolute',
    borderRadius: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CustomThemeColors.HomeScreenBackroundColor,
    // padding: 10,
    // paddingBottom: 10,
  },
  bottomFade: {
    height: 50, // Adjust the height of the fade effect as needed
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Apply the linear gradient to create the fade effect
    background: 'linear-gradient(rgba(189, 203, 216, 0), #bdcbd8)',
  },
  announcementContainer: {
    // borderTopWidth:verticalScale(28),
    backgroundColor: CustomThemeColors.sectionBackgroundColor,
    // borderColor: CustomThemeColors.primary,
    // borderWidth:moderateScale(2),
    borderRadius: 15,
    // borderTopLeftRadius: 20,
    //   borderBottomLeftRadius: 20,
    //   borderBottomRightRadius: 20,
    //   borderTopRightRadius: 20,
    // alignItems: 'flex-start', // Align items to the left
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginVertical: 5, // Add some vertical margin between announcements
    // margin: horizontalScale(10)
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  announcementHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the header
    marginBottom: 10, // Add some margin below the header
  },
  announcementHeader: {
    paddingLeft: 10,
    color: 'grey',
    fontSize: moderateScale(16),
    maxWidth: '95%',
    fontWeight: 'bold',
    fontStyle: 'italic',
    // backgroundColor:'blue',
    textAlign: 'left',
  },
  announcementDateContainer: {
    // top:-4,
    // right:-4,
    alignItems: 'flex-end',
  },
  announcementDate: {
    paddingLeft: 10, // Indent the description text
    color: 'grey',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    width: '40%',
    textAlign: 'right',
    // backgroundColor:'blue',
    fontStyle: 'italic',

    // alignItems:'right'
    // textAlign: 'right',
  },
  announcement: {
    paddingLeft: 10, // Indent the description text
    color: CustomThemeColors.primary,
    fontSize: moderateScale(15),
    // color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
    fontStyle: 'italic',
    width: '100%',
    // backgroundColor:'blue',
    // alignItems:'flex-end'
  },
  //Textfiled-End
});

export default styles;
