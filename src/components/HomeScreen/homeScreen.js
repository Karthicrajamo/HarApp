import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
  AppRegistry,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Grid from 'react-native-grid-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import styles from './homeScreenStyles';
import {useNavigation} from '@react-navigation/native';
import {CustomThemeColors} from '../CustomThemeColors';
import * as Keychain from 'react-native-keychain';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Circle} from 'react-native-svg';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
import {AppContext} from '../AppProvider'; // Import the AppContext
import TitleBar from '../common-utils/TitleBar';
import {useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
const Drawer = createDrawerNavigator();
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 600;

const HomeScreen = ({route}) => {
  const isTablet = DeviceInfo.isTablet();
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Exit Canceled'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
        return true; // Prevents the default back button behavior
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      // Cleanup the event listener when the screen loses focus
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  const [privileges, setPrivileges] = useState([]);

  // const handleBackPress = () => {
  //   // Custom action here
  //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //     {text: 'Cancel', onPress: () => null, style: 'cancel'},
  //     {text: 'YES', onPress: () => BackHandler.exitApp()},
  //   ]);
  //   return true; // Prevent default back action
  // };
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress,
  //   );

  //   return () => backHandler.remove(); // Cleanup the event listener
  // }, []);

  // const { userName } = route.params;

  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: 'privileges',
        });
        if (credentials) {
          const savedPrivileges = JSON.parse(credentials.password);
          setPrivileges(savedPrivileges);
          console.log('Loaded Privileges', savedPrivileges);
        } else {
          console.log('No Stored Privileges !!!');
        }
      } catch (error) {
        console.log('Could not load privileges !!', error);
      }
    };
    loadPrivileges();
  }, []);

  const items = [
    // { name: 'Menu Bar', height: '7',component: <MenuBar /> },
    // { name: 'User Details', height: '15', component: <UserDetails /> },

    {
      name: 'User Details',
      height: isTablet ? '20%' : '20%',
      component: <DashBoardAnalytics />,
    },
    {
      name: 'Icons',
      height: isTablet ? '55%' : '60%',
      component: <GridIcons privileges={privileges} />,
    },
    {name: 'Text Fields', height: '15%', component: <Announcement />},
    // { name: 'User Details', height: verticalScale(120), component: <DashBoardAnalytics /> },
    // { name: 'Icons', height: verticalScale(455), component: <GridIcons privileges={privileges}/> },
    // { name: 'Text Fields', height: verticalScale(120), component: <Announcement /> },
  ];

  const renderItem = (item, index) => {
    // Calculate item height based on screen dimensions
    let itemHeight;
    if (isTablet) {
      // For tablets, ensure all items fit on the screen without scrolling
      itemHeight = (parseFloat(item.height) / 100) * (screenHeight - 65);
    } else {
      // For mobile phones, calculate item height with a fixed margin or padding
      itemHeight = (parseFloat(item.height) / 100) * (screenHeight - 55); //55
    }

    return (
      <View key={index} style={[styles.itemContainer, {height: itemHeight}]}>
        {/* <View key={index} style={[styles.itemContainer, { height: item.height }]}> */}
        {item.component}
      </View>
    );
  };
  const navigation = useNavigation();
  return (
    <>
      <StatusBar
        backgroundColor={CustomThemeColors.StatusBarColor}
        barStyle="dark-content"
      />
      <TitleBar
        text="DashBoard"
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        // showSearchIcon={true}
        // onSearchPress={openSearchModal}
        // showQrScannerIcon={true}
        // onQrScannerPress={openQrScanner}
        // showRefreshIcon={true}
        // onRefreshPress={handleRefresh}
        // showCloseIcon={true}
        // onClose={handleHomeScreen}
      />
      <Grid
        style={styles.gridContainer}
        data={items}
        renderItem={renderItem}
        itemsPerRow={1} // Display one item per row
      />
    </>
  );
};

// const UserDetails = () => {
//   return (
//     // <LinearGradient
//     //   colors={[CustomThemeColors.gradientStart, CustomThemeColors.gradientEnd]}
//     //   style={styles.userDetailsContainer}
//     //   start={{ x: 0, y: 0 }}
//     //   end={{ x: 1, y: 2 }}
//     // >
//     <ImageBackground
//             source={CustomThemeColors.BackgroundImage}
//             style={styles.userDetailsContainer}
//         >
//     {/* <ImageBackground source={require('../../images/harness_background.png')} style={styles.UserDetailsBackground}> */}
//       <View style={styles.UserDetailsSubContainer}>
//     <View >
//     <View style={styles.UserDetailsIconContainer}>
//         <MaterialIcons name="account-circle" size={90} color="#fff" borderColor='black'/>
//         </View>
//     </View>
//     <View>
//         <View style={styles.UserDetailsTextSection}>
//           <Text style={styles.UserDetailsText}>6767 - ARUNKUMAR</Text>
//           <Text style={styles.UserDetailsText}>Sr.Manager</Text>
//           <Text style={styles.UserDetailsText}>Finance</Text>
//         </View>
//     </View>
//       </View>
//       {/* </ImageBackground> */}
//      {/* </LinearGradient> */}
//      </ImageBackground>
//   );
// };
// const DashBoardAnalytics = () => {
//   const listOfIcons = [

//   ];
//   return(
//     <View>
//       <AnimatedCircularProgress
//         size={120}
//         backgroundWidth={12}
//         width={13}
//         lineCap="round"
//         fill={70}
//         tintColor="#3bcc53"
//         // arcSweepAngle={180}
//         // rotation={270}
//         onAnimationComplete={() => console.log('onAnimationComplete')}
//         backgroundColor="#3d5875">
//         {
//         (fill) => (
//           <Text style={{color:"black", fontWeight:"bold", fontSize:25}}>
//             80
//           </Text>
//         )
//       }
//         </AnimatedCircularProgress>

//         {/* <AnimatedCircularProgress
//       size={200}
//       width={3}
//       fill={this.state.fill}
//       tintColor="#00e0ff"
//       backgroundColor="#3d5875">
//       {
//         (fill) => (
//           <Text>
//             { this.state.fill }
//           </Text>
//         )
//       }
//     </AnimatedCircularProgress> */}
//     {/* <AnimatedCircularProgress
//   size={120}
//   width={15}
//   fill={100}
//   tintColor="#00e0ff"
//   backgroundColor="#3d5875"
//   padding={10}
//   renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
//   /> */}

// </View>
//   );

// };
const DashBoardAnalytics = () => {
  const {noticeBoardData} = useContext(AppContext); // Use context
  useEffect(() => {
    // console.log('Global Notice Board in DashBoardAnalytics:', noticeBoardData);
  }, [noticeBoardData]);

  const pendingApprovals = 0;
  const pendingAudits = 0;
  const latestALerts = 0;

  // const getProgressColor = value => {
  //   if (value <= 30) {
  //     return '#27A468'; // Green
  //   } else if ((value > 30) & (value <= 60)) {
  //     return '#F2A735'; // Yellow
  //   } else if ((value > 60) & (value <= 100)) {
  //     return '#E53761'; // Orange
  //   } else if (value > 100) {
  //     return '#E53761';
  //   }
  // };

  const getProgressColor = value => {
    if (value <= 30) {
      return '#27a468'; // Green
    } else if ((value > 30) & (value <= 60)) {
      return '#F2A735'; // Yellow
    } else if ((value > 60) & (value <= 100)) {
      return '#e53760'; // Orange
    } else if (value > 100) {
      return '#E53761';
    }
  };

  const navigationAnalytics = useNavigation();
  return (
    <SafeAreaView style={styles.analyticsContainer}>
      <View style={styles.singleAnalyticsContainer}>
        <AnimatedCircularProgress
          size={isTablet ? 100 : 90}
          backgroundWidth={6}
          width={moderateScale(4)}
          duration={1500}
          delay={500}
          lineCap="round"
          fill={pendingApprovals}
          tintColor={getProgressColor(pendingApprovals)}
          backgroundColor="#ECECEC"
          // backgroundColor="white"
          // backgroundColor="red"
          // backgroundColor="#eaedea"
          onAnimationComplete={() => console.log('onAnimationComplete')}>
          {fill => (
            <View>
              {/* <Text
                style={{
                  color: 'grey',
                  fontWeight: 'bold',
                  fontSize: isTablet ? moderateScale(20) : moderateScale(15),
                  marginLeft: 5,
                }}> */}
              {/* {pendingApprovals <= 100 ? `${pendingApprovals}/100` : '100+'} */}
              {/* <TouchableOpacity> */}
              {/* </TouchableOpacity> */}
              {/* 55 */}
              {/* </Text> */}
              <MaterialIcons
                name="chat"
                color={CustomThemeColors.primary}
                size={40}
                onPress={() =>
                  navigationAnalytics.navigate('NoticeBoardListScreen')
                }
              />
              <View
                style={{
                  position: 'absolute',
                  top: -7, // Adjust based on your layout
                  right: -7, // Adjust based on your layout
                  backgroundColor: 'red',
                  borderRadius: 20,
                  paddingHorizontal: 4, // Increase padding to ensure text fits
                  paddingVertical: 2,
                  zIndex: 2, // Ensure badge is on top
                  borderWidth: 2,
                  borderColor: 'white',
                  minWidth: 24, // Set minimum width for badge
                  minHeight: 24, // Set minimum height for badge
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  {noticeBoardData?.totalNewMessages >= 999
                    ? '99+'
                    : noticeBoardData?.totalNewMessages}
                </Text>
              </View>
            </View>
          )}
          {/* <MaterialIcons
            name="chat"
            color={CustomThemeColors.fadedPrimary}
            size={moderateScale(45)}
          /> */}
        </AnimatedCircularProgress>

        <Text style={styles.analyticTitle}>Notice Board</Text>
      </View>

      <View>
        <AnimatedCircularProgress
          // rotation={-360}
          size={isTablet ? 100 : 90}
          backgroundWidth={6}
          width={moderateScale(4)}
          duration={1500}
          delay={500}
          lineCap="round"
          fill={pendingAudits}
          tintColor={getProgressColor(pendingAudits)}
          backgroundColor="#ECECEC"
          onAnimationComplete={() => console.log('onAnimationComplete')}>
          {fill => (
            <View>
              {/* <Text
                style={{
                  color: 'grey',
                  fontWeight: 'bold',
                  fontSize: isTablet ? moderateScale(20) : moderateScale(15),
                  marginLeft: 5,
                }}> */}
              {/* {pendingAudits <= 100 ? `${pendingAudits}/100` : '100+'} */}
              {/* 35 */}
              {/* </Text> */}
              <MaterialIcons
                name="approval"
                color={CustomThemeColors.fadedPrimary}
                size={30}
                onPress={() => navigationAnalytics.navigate('HomeScreen')}
                // style={{right: 3}}
              />
              <Text
                style={{
                  marginTop: 5,
                  paddingVertical: 2,
                  backgroundColor: 'rgba(220, 75, 75, 0.3)',
                  paddingHorizontal: 5,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'white',
                  fontWeight: 'bold',
                  position: 'absolute',
                  left: 15,
                  bottom: 20,
                  fontSize: 10,
                  color: 'white',
                }}>
                99+
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        {/* <Text style={styles.analyticTitle}>35</Text> */}
        <Text style={styles.analyticTitle}>Approvals</Text>
      </View>
      <View>
        <AnimatedCircularProgress
          size={isTablet ? 100 : 90}
          backgroundWidth={6}
          width={moderateScale(4)}
          duration={1500}
          delay={500}
          lineCap="round"
          fill={latestALerts}
          tintColor={getProgressColor(latestALerts)}
          backgroundColor="#ECECEC"
          onAnimationComplete={() => console.log('onAnimationComplete')}>
          {fill => (
            <View>
              {/* <Text
                style={{
                  color: 'grey',
                  fontWeight: 'bold',
                  fontSize: isTablet ? moderateScale(20) : moderateScale(15),
                  // position: 'absolute',
                  marginLeft: 5,
                  // bottom: 25,
                }}> */}
              {/* 99+ */}
              {/* {latestALerts <= 100 ? `${latestALerts}/100` : '100+'} */}
              {/* </Text> */}
              <MaterialIcons
                name="notifications-on"
                color={CustomThemeColors.fadedPrimary}
                size={30}
                onPress={() => navigationAnalytics.navigate('HomeScreen')}
                // style={{bottom: -5}}
              />
              <Text
                style={{
                  marginTop: 5,
                  paddingVertical: 2,
                  backgroundColor: 'rgba(220, 75, 75, 0.3)',
                  paddingHorizontal: 5,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'white',
                  fontWeight: 'bold',
                  position: 'absolute',
                  left: 14,
                  bottom: 20,
                  fontSize: 10,
                  color: 'white',
                  paddingLeft: 7,
                }}>
                99+
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        {/* <Text style={styles.analyticTitle}>99+</Text> */}
        <Text style={styles.analyticTitle}>Alerts</Text>
      </View>
    </SafeAreaView>
  );
};

const GridIcons = ({privileges}) => {
  const navigation = useNavigation();
  const actions = {
    // alerts          : () => navigation.navigate('About'),
    // task            : () => navigation.navigate('About'),
    // chart           : () => navigation.navigate('About'),
    // notes           : () => navigation.navigate('About'),
    // approval        : () => navigation.navigate('About'),
    documentApproval: () => navigation.navigate('DocumentApproverMain'),
    issueGroup: () => navigation.navigate('IssueGroups'),
    // tracking        : () => navigation.navigate('About'),
    // attendance      : () => navigation.navigate('About'),
    // request         : () => navigation.navigate('About'),
    // profile         : () => navigation.navigate('About'),
    // assets          : () => navigation.navigate('About'),
    // payslip         : () => navigation.navigate('About'),
    assetList: () => navigation.navigate('AssetListMainScreen'),
    // assetList       : () => navigation.navigate('ComponentWithCropFreeIcon'),
    // assetAudit      : () => navigation.navigate('About'),
    // testScreen: () => navigation.navigate('TestScreen'),
  };

  const listOfIcons = [
    // NOTE: elementId always be as camelCase; it is used to compare with privileges to display icons as enabled or desabled
    {
      name: 'Alerts',
      elementId: 'alerts',
      iconName: 'notifications-on',
      action: actions.alerts,
    },
    {name: 'Task', elementId: 'task', iconName: 'task', action: actions.task},
    {
      name: 'Chart',
      elementId: 'chart',
      iconName: 'bar-chart',
      action: actions.chart,
    },
    {
      name: 'Notes',
      elementId: 'notes',
      iconName: 'edit-note',
      action: actions.notes,
    },
    {
      name: 'Approval',
      elementId: 'approval',
      iconName: 'approval',
      action: actions.approval,
    },
    {
      name: 'Document Approval',
      elementId: 'documentApproval',
      iconName: 'edit-document',
      action: actions.documentApproval,
    },
    {
      name: 'Issue Group',
      elementId: 'issueGroup',
      iconName: 'group-add',
      action: actions.issueGroup,
    },
    {
      name: 'Tracking',
      elementId: 'tracking',
      iconName: 'location-searching',
      action: actions.tracking,
    },
    {
      name: 'Attendance',
      elementId: 'attendance',
      iconName: 'calendar-month',
      action: actions.attendance,
    },
    {
      name: 'Request',
      elementId: 'request',
      iconName: 'rate-review',
      action: actions.request,
    },
    {
      name: 'Profile',
      elementId: 'profile',
      iconName: 'account-circle',
      action: actions.profile,
    },
    {
      name: 'Assets',
      elementId: 'assets',
      iconName: 'web-asset',
      action: actions.assets,
    },
    {
      name: 'Payslip',
      elementId: 'payslip',
      iconName: 'receipt',
      action: actions.payslip,
    },
    {
      name: 'Asset List',
      elementId: 'assetList',
      iconName: 'receipt-long',
      action: actions.assetList,
    },
    // {
    //   name: 'Test Screen',
    //   elementId: 'testScreen',
    //   iconName: 'science',
    //   action: actions.testScreen,
    // },
    // { name: 'Asset Audit'       ,elementId:'assetAudit'       ,iconName: 'crop-free'          ,action: actions.assetAudit       },

    // { name: 'icon14', iconName: 'doorbell', action: actions.icon1 },
    // { name: 'icon15', iconName: 'doorbell', action: actions.icon2 },
  ];
  // Splitting the list into two parts
  const firstGridIcons = listOfIcons.slice(0, 4); // First 4 icons
  const secondGridIcons = listOfIcons.slice(4); // Remaining icons

  // Render each icon
  const renderIcon = ({item}) => {
    let isPrivileged = privileges.includes(item.elementId);

    //FOR TESTING - START
    if (item.elementId === 'testScreen') {
      isPrivileged = true;
    }
    //FOR TESTING - END

    const handleIconPress = () => {
      if (isPrivileged) {
        item.action();
      } else {
        Alert.alert(
          'SORRY',
          'You do not have privilege to access this feature',
        );
      }
    };
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'column',
          margin: 2,
          minWidth: '24%',
          maxWidth: '24%',
          // backgroundColor:'#9dbed2',
          borderRadius: 5,
          alignItems: 'center',
          padding: moderateScale(2),
        }}>
        <TouchableOpacity onPress={handleIconPress} key={item.name}>
          {/* //every icon */}
          <View
            style={{
              backgroundColor: isPrivileged
                ? CustomThemeColors.whiteBackgroundColor
                : CustomThemeColors.whiteBackgroundColor,
              width: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={item.iconName}
                size={moderateScale(25)}
                color={
                  isPrivileged
                    ? CustomThemeColors.iconColor
                    : CustomThemeColors.iconDisabledColor
                }
              />
            </View>
          </View>
          <Text
            style={{
              color: isPrivileged ? 'grey' : 'lightgrey',
              fontWeight: '500',
              maxWidth: 110,
              textAlign: 'center',
              fontSize: moderateScale(13),
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.gridIconscontainer}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        {/* <FlatList
        data={listOfIcons}
        renderItem={renderIcon}
          keyExtractor={(item) => item.name}
          numColumns={4}
          style={{ zIndex: 2 }} 
        //Setting the number of column
      /> */}
        {/* First grid */}
        <View>
          <View
            style={{
              marginTop: 10,
              height: 'auto',
              backgroundColor: CustomThemeColors.primary,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              position: 'relative',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                alignItems: 'center',
                fontSize: moderateScale(16),
                marginTop: isTablet ? 1 : 3,
                fontWeight: 'bold',
                justifyContent: 'center',
              }}>
              Most Used
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: CustomThemeColors.whiteBackgroundColor,
              flexWrap: 'wrap',
              marginBottom: verticalScale(30),
              borderRadius: 10,
              padding: 10,
              borderTopWidth: verticalScale(0),
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderRightWidth: horizontalScale(1),
              borderBottomWidth: horizontalScale(1),
              borderLeftWidth: horizontalScale(1),
              borderColor: CustomThemeColors.primary,
            }}>
            <View>
              <FlatList
                data={firstGridIcons}
                renderItem={renderIcon}
                keyExtractor={item => item.name}
                numColumns={4}
                style={{zIndex: 2}}
              />
            </View>
          </View>
        </View>

        {/* Second grid */}
        <View>
          <View
            style={{
              height: 'auto',
              backgroundColor: CustomThemeColors.primary,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              position: 'relative',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                alignItems: 'center',
                fontSize: moderateScale(16),
                marginVertical: isTablet ? 1 : 3,
                fontWeight: 'bold',
                justifyContent: 'center',
              }}>
              Common Apps
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: CustomThemeColors.whiteBackgroundColor,
              flexWrap: 'wrap',
              marginBottom: verticalScale(30),
              borderRadius: 10,
              padding: 10,
              borderTopWidth: verticalScale(0),
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderRightWidth: horizontalScale(1),
              borderBottomWidth: horizontalScale(1),
              borderLeftWidth: horizontalScale(1),
              borderColor: CustomThemeColors.primary,
            }}>
            <View>
              <FlatList
                data={secondGridIcons}
                renderItem={renderIcon}
                keyExtractor={item => item.name}
                numColumns={4}
                style={{zIndex: 2}}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const Announcement = () => {
  const listOfAnnouncement = [
    {
      key: 'Announcement1',
      heading: 'Scheduled Maintenance',
      date: '12-Sep-24',
      description:
        'Please be advised that the ERP mobile application will undergo scheduled maintenance on September 13, 2024, from 2:00 PM to 3:00 PM.',
    },
    // {key: "Announcement2", heading: "Working Time Announcement   11-Mar-22", description: "Support Department should work upto 7pm till 31st March"},
    // {key: "Announcement3", heading: "Working Time Announcement   11-Mar-22", description: "Support Department should work upto 7pm till 31st March"}
  ];

  const renderAnnouncements = ({item}) => {
    return (
      <View>
        <View style={styles.announcementContainer}>
          <View>
            <View style={styles.announcementDateContainer}>
              <Text style={styles.announcementDate}>{item.date}</Text>
            </View>
            <View style={styles.announcementHeaderContainer}>
              <MaterialIcons name="campaign" size={28} color="grey" />
              <Text style={styles.announcementHeader}>{item.heading}</Text>
            </View>
            <Text style={styles.announcement}>{item.description}</Text>
          </View>
        </View>

        {/* <View style={styles.announcementContainer}>
          <View>
            <View style={styles.announcementDateContainer}><Text style={styles.announcementDate}>{item.date}</Text></View>
              <View style={styles.announcementHeaderContainer}>
                <MaterialIcons name='campaign' size={28} color="white"/>
                <Text style={styles.announcementHeader}>{item.heading}</Text>
            </View>
            <Text style={styles.announcement}>{item.description}</Text>
          </View>
        </View> */}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.announcementScrollView}
      // showsVerticalScrollIndicator={true}
      automaticallyAdjustsScrollIndicatorInsets={true}>
      <FlatList
        data={listOfAnnouncement}
        renderItem={renderAnnouncements}
        keyExtractor={item => item.key}
        numColumns={1}
      />
      <View style={styles.bottomFade} />
    </ScrollView>
  );
};

export default HomeScreen;
