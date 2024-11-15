import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationState,
} from '@react-navigation/native';
import LoginScreen from './src/components/Login/loginScreen';
import {StyleSheet} from 'react-native';

import HomeScreen from './src/components/HomeScreen/homeScreen';
import ResetPassword from './src/components/ResetPassword/resetPassword';
import AssetListMainScreen from './src/components/AssetList/assetListMainScreen';
import AssetListSort from './src/components/AssetListSort/assetListSort';
import AssetListFilter from './src/components/AssetListFilter/assetListFilter';
import AssetListDetails from './src/components/AssetListDetails/assetListDetails';
import AssetListImage from './src/components/AssetListImage/assetListImage';
import AssetSkel from './src/components/AssetListDetails/AssetListDetailsSkeleton';
import NetInfo from '@react-native-community/netinfo';
import {sharedData} from './src/components/Login/UserId';
import {jwtDecode} from 'jwt-decode';
import CustomLoadingUI from './src/components/common-utils/smallcomponents/CustomLoadingUI';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {View} from 'react-native';
import {
  TouchableOpacity,
  BackHandler,
  Vibration,
  AppState,
  Platform,
} from 'react-native';
import {Alert} from 'react-native';
import {Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CustomThemeColors} from './src/components/CustomThemeColors';
import {createStackNavigator} from '@react-navigation/stack';
import {useState, useEffect, useContext, useRef} from 'react';
import {moderateScale} from './src/components/themes/Metrics';
import {BackgroundImage} from 'react-native-elements/dist/config';
import * as Keychain from 'react-native-keychain';
import {useRoute} from '@react-navigation/native';
import QrScanner from './src/components/common-utils/QrScanner';
import ComponentWithCropFreeIcon from './src/components/commonUtils/ComponentWithCropFreeIcon';
import TestScreen from './src/components/common-utils/TestScreen';
import IssueGroupMainScreen from './src/components/IssueGroup/IssueGroups';
import Test from './src/components/common-utils/test';
// import IssueGroups from './src/components/common-utils/IssueGroups';
import IssueGroups from './src/components/IssueGroup/IssueGroups';
import CustomTable from './src/components/common-utils/CustomTable';
import CustomLableValueComp from './src/components/common-utils/CustomLableValueComp';
import TableComponent from './src/components/DocumentApproval/DocumentApprovalTableComponent';

import GroupListScreen from './src/components/NoticeBoardListScreen';
import NoticeBoardScreen from './src/components/NoticeBoardScreen';
import NoticeBoardListScreen from './src/components/NoticeBoardListScreen';
import NoticeBoardMainScreen from './src/components/NoticeBoardMainScreen';
// import AssetAudit from './src/components/AssetAudit/AssetAuditMain';
// import AssetAuditSelection from './src/components/AssetAudit/AssetAuditSelection';
// import AssetAuditDetails from './src/components/AssetAudit/AssetAuditDetails';
// import DocumentApproval from './src/components/DocumentApproval/DocumentApproverMain';
// import {AppProvider} from './src/components/AppProvider'; // Adjust path as needed
import {AppContext, AppProvider} from './src/components/AppProvider';
import {ActivityIndicator, FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  showNotification,
  handleScheduleNotification,
  handleCancel,
} from './src/notification.android';
import {
  NotifierWrapper,
  Notifier,
  NotifierComponents,
} from 'react-native-notifier';
import Sound from 'react-native-sound';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import APIRequestComponent from './src/components/common-utils/APIRequestComponent';
import {API_URL} from './src/components/ApiUrl';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import useOrientation from './src/components/customHooks/useOrientation';
import DocumentApproverMain from './src/components/DocumentApproval/DocumentApproverMain';
import {requestStoragePermission} from './src/components/common-utils/requestStoragePermission';
// Load the sound file
Sound.setCategory('Playback');


// Initialize the Sound object
const notificationSound = new Sound(
  'notification_new.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    console.log('Sound loaded successfully');
  },
);

const hideFABScreens = [
  'LoginScreen',
  // 'SignupScreen',
  'ForgotPasswordScreen',
  'NoticeBoardListScreen',
  'NoticeBoardScreen',
  'NoticeBoardMainScreen',
  'HomeScreen',
];
// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom hook to get the currently active screen inside the Stack Navigator
const useCurrentRouteName = () => {
  return useNavigationState(state => {
    const currentRoute = state?.routes?.[0]?.state; // Access the Stack Navigator state inside Drawer
    if (currentRoute && currentRoute.index !== undefined) {
      // console.log(
      //   'currentRoute.routes[currentRoute.index]?.name : ',
      //   currentRoute.routes[currentRoute.index]?.name,
      // );
      return currentRoute.routes[currentRoute.index]?.name;
    }
    return null;
  });
};
const GROUP_STORAGE_KEY = 'NoticeBoardData';

const App = () => {
  useOrientation();
  // const navigation = useNavigation();
  
  const [responseNewMessageDetails, setResponseNewMessageDetails] =
  useState(null);
  
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // The app has come to the foreground
        console.log('App has come to the foreground!');
        // showNotification('Hey, You Came Back!', 'Welcome back man!');
        // You could check for new notifications or perform other actions here
      }

      if (nextAppState.match(/inactive|background/) && appState === 'active') {
        // The app has gone to the background
        console.log('App has gone to the background!');
        // showNotification('App In Background', 'Are you closed a app?');
        // You could handle notifications or data synchronization here
      }

      setAppState(nextAppState);
    };

    // Add event listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup the event listener when the component unmounts
    return () => subscription.remove();
  }, [appState]);

  //AUTO-LOGIN
  // const [loggedInUserPassword, setLoggedInUserPassword] = useState(null);
  
  useEffect(() => {
    requestStoragePermission();
  }, []);
  // useEffect(() => {
  //   const handleAutoLogin = async (username, password) => {
  //     try {
  //       const requestBody = {
  //         userId: username,
  //         password: password,
  //       };

  //       sharedData.userName = requestBody.userId;
  //       const response = await fetch(`${API_URL}/api/v1/login`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ',
  //         },
  //         body: JSON.stringify(requestBody),
  //       });

  //       if (!response.ok) {
  //         if (response.status === 401) {
  //           throw new Error('Failed to authenticate');
  //         } else {
  //           throw new Error('Failed to fetch data' + response.status);
  //         }
  //       }

  //       const authToken = response.headers.get('Authorization');
  //       saveToken(authToken);

  //       async function saveToken(token) {
  //         await Keychain.setGenericPassword('jwt', token, {service: 'jwt'});
  //         const responseBody = await response.json();
  //         console.log('login response body 98488942: ', responseBody);
  //         const privileges = responseBody.privileges.privileges;
  //         const loggedInUserId = responseBody.userId;
  //         const loggedInUserName = responseBody.userName
  //           ? responseBody.userName
  //           : null;
  //         await savePrevileges(privileges);

  //         async function savePrevileges(privileges) {
  //           try {
  //             await Keychain.setGenericPassword(
  //               'privileges',
  //               JSON.stringify(privileges),
  //               {service: 'privileges'},
  //             );

  //             const savedPrivileges = await Keychain.getGenericPassword({
  //               service: 'privileges',
  //             });
  //           } catch (error) {
  //             throw new Error('Failed to log in', error);
  //           } finally {
  //           }
  //         }
  //         const navigation = useNavigation();
  //         navigation.navigate('HomeScreen', {username});
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  //   const getCredentialFromAsyncStorage = async () => {
  //     const loggedInUserPasswordFromAsync = await Keychain.getGenericPassword({
  //       service: 'loggedInUserPassword',
  //     });
  //     const loggedInUserNameFromAsync = await Keychain.getGenericPassword({
  //       service: 'loggedInUserName',
  //     });

  //     const storedPassword = loggedInUserPasswordFromAsync?.password;
  //     const storedUserName = loggedInUserNameFromAsync?.password;
  //     if (
  //       loggedInUserPasswordFromAsync?.password &&
  //       loggedInUserNameFromAsync?.password
  //     ) {
  //       setLoggedInUserPassword(storedPassword);
  //       console.log(
  //         'Stored Username and password found...85385903489058390485',
  //         'Username : ',
  //         storedUserName,
  //         'password : ',
  //         storedPassword,
  //       );
  //       handleAutoLogin(storedUserName, storedPassword);
  //     }
  //     console.log('No Stored password found...85385903e56369058390485');
  //   };
  //   getCredentialFromAsyncStorage();
  // }, []);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  const GROUP_STORAGE_KEY = 'NoticeBoardData'; // Update this with the correct key if needed

  //for notification sound
  const showNotificationWithSound = () => {
    notificationSound.play(success => {
      if (success) {
        console.log('Sound played successfully');
      } else {
        console.log('Sound playback failed');
        // Log the current playback time for debugging
        notificationSound.getCurrentTime(seconds => {
          console.log('Current playback time (in seconds):', seconds);
        });
        // Add a fallback or retry mechanism if needed
      }
    });

    Notifier.showNotification({
      title: 'Notification with Sound',
      description: 'This notification includes a sound effect.',
      duration: 3000,
    });
  };
  // Function to fetch unread messages from AsyncStorage
  // const fetchUnreadMessages = async () => {
  //   try {
  //     // Fetch stored data from AsyncStorage
  //     const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);
  //     console.log('storedData : ', storedData);
  //     if (storedData) {
  //       // Parse the stored JSON data
  //       const data = JSON.parse(storedData);

  //       // Calculate the total unread count by summing up unseenCount values
  //       const totalUnreadCount = Object.values(data).reduce(
  //         (sum, group) => sum + (group.unseenCount || 0),
  //         0,
  //       );

  //       if (totalUnreadCount > unreadCount) {
  //         // Vibration.vibrate(200);
  //         // showNotificationWithSound(); // Play the sound when unread count increases
  //         // showNotification('hello', 'message');
  //       }

  //       // Update the unreadCount state
  //       setUnreadCount(totalUnreadCount);
  //       setPreviousUnreadCount(totalUnreadCount);
  //     } else {
  //       // Handle case where no data is found
  //       setUnreadCount(0);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch fetchUnreadMessages:', error);
  //   }
  // };

  // // useEffect to run the fetchUnreadMessages function every 5 seconds
  // useEffect(() => {
  //   // Call the function initially
  //   fetchUnreadMessages();

  //   // Set up an interval to fetch unread messages every 5 seconds
  //   const intervalId = setInterval(() => {
  //     fetchUnreadMessages();
  //   }, 10000); // 5000 milliseconds = 5 seconds

  //   // Cleanup the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  const newMessagesDetailsRequestBody = {
    '5': '2024-09-19 16:10:00',
    '6': '2024-09-19 16:10:00',
    '7': '2024-09-19 16:10:00',
  };

  // Log the responseNewMessageDetails every time it changes

  const {noticeBoardData, setNoticeBoardData} = useContext(AppContext);
  // Use setInterval to periodically fetch new message details
  useEffect(() => {
    const fetchNewMessageDetails = async () => {
      const state = await NetInfo.fetch();
      // console.log(state, '85785743');
      if (state.isInternetReachable) {
        try {
          const loggedInUserIdCred = await Keychain.getGenericPassword({
            service: 'loggedInUserId',
          });
          if (loggedInUserIdCred) {
            // console.log('User ID: ', loggedInUserIdCred.password);

            const response = await fetch(
              `${API_URL}/api/noticeBoard/getNewMessageDetails?usrid=${loggedInUserIdCred.password}`,
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newMessagesDetailsRequestBody),
              },
            );

            const data = await response.json();
            // console.log('Success: ', data);
            setResponseNewMessageDetails(data);
          }
        } catch (error) {
          // console.log('754889543545fff32 : ', error);
          if (error.message === 'Network request failed') {
            // showSessionExpiredAlert();
          }
          // console.error('Error: ', error);
        }
      } else {
        console.log('No user credentials found');
      }
    };

    // Trigger the API request every 5 seconds
    const intervalId = setInterval(fetchNewMessageDetails, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  // useEffect(() => {
  //   if (responseNewMessageDetails) {
  //     console.log(
  //       'Updating global noticeBoardData: ',
  //       responseNewMessageDetails,
  //     );
  //     setNoticeBoardData(responseNewMessageDetails); // Update global state

  //     console.log(
  //       ' setNoticeBoardData(responseNewMessageDetails) : rwroiuwiur9w8r98w',
  //       noticeBoardData,
  //     );
  //   }
  // }, [responseNewMessageDetails]);
  useEffect(() => {
    const saveNoticeBoardDataInAsyncStorage = async data => {
      try {
        await AsyncStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(data));
        // console.log('NoticeBoardData saved to AsyncStorage');
      } catch (error) {
        console.error('Error saving noticeBoardData:', error);
      }
    };

    if (responseNewMessageDetails) {
      // console.log(
      //   'Updating global noticeBoardData: ',
      //   responseNewMessageDetails,
      // );
      if (
        noticeBoardData.totalNewMessages <
        responseNewMessageDetails.totalNewMessages
      ) {
        notificationSound.play(success => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
            notificationSound.getCurrentTime(seconds => {
              console.log('Current playback time (in seconds):', seconds);
            });
          }
        });
        Vibration.vibrate(200);
      }
      setNoticeBoardData(responseNewMessageDetails); // Updating global state

      saveNoticeBoardDataInAsyncStorage(responseNewMessageDetails); // Saving to AsyncStorage
    }
  }, [responseNewMessageDetails]);

  const [isConnect, setIsConnected] = useState(0);

  const alertShown = useRef(false); // Ref to track if alert is shown

  useEffect(() => {
    // Function to handle network changes
    const handleConnectivityChange = state => {
      if (!state.isConnected && !alertShown.current) {
        alertShown.current = true; // Set the flag
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection.',
        );
      } else if (state.isConnected) {
        alertShown.current = false; // Reset the flag when connected
      }
    };

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Cleanup the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);
  // const checkInternetConnectivity = async () => {
  //   const state = await NetInfo.fetch();
  //   if (!state.isConnected) {
  //     Alert.alert(
  //       'No Internet Connection',
  //       'Please turn on your internet connection and try again.',
  //       [{text: 'OK'}],
  //       {cancelable: false},
  //     );
  //   }
  // };
  // useEffect(() => {
  //   checkInternetConnectivity();
  // }, []);

  const navigationRef = React.useRef<any>(null);

  const renderRightHeaderIcon = () => (
    <View style={{marginRight: 15}}>
      {/* Logout icon on the right */}
      <TouchableOpacity>
        {/* <MaterialIcons  name="logout" size={25} color="#fff" /> */}
      </TouchableOpacity>
    </View>
  );
  // const handleMenuLogout = () => {
  //   const navigation = useNavigation();
  //   Alert.alert(
  //     'Confirmation',
  //     'Are you sure you want to logout?',
  //     [
  //       {
  //         text: 'No',
  //         onPress: () => console.log('Logout cancelled'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         // onPress: () => CustomDrawerContent,
  //            onPress: () => navigation.navigate('LoginScreen'),
  //         // onPress: () => console.log('Logout Success'),

  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  // Handle back button press to prevent going back to LoginScreen from HomeScreen
  React.useEffect(() => {
    const backAction = () => {
      if (navigationRef.current) {
        const currentRoute = navigationRef.current.getCurrentRoute();
        console.log('currentRoute hgdijgoid90df : ', currentRoute.name);
        if (
          currentRoute.name !== 'HomeScreen1' ||
          currentRoute.name !== 'HomeScreen' ||
          currentRoute.name !== 'LoginScreen1' ||
          currentRoute.name !== 'LoginScreen'
        ) {
          // navigationRef.current.navigate('HomeScreen'); // Go back to Homescreen if not on HomeScreen
          navigationRef.current.goBack(); // Go back to Homescreen if not on HomeScreen

          return true;
        } else if (
          currentRoute.name === 'HomeScreen1' ||
          currentRoute.name === 'HomeScreen' ||
          currentRoute.name === 'LoginScreen' ||
          currentRoute.name === 'LoginScreen1'
        ) {
          // If already on HomeScreen, show exit confirmation
          Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Exit Canceled');
                },
                style: 'cancel',
              },
              {text: 'OK', onPress: () => BackHandler.exitApp()},
            ],
            {cancelable: false},
          );
          return true;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // const navigationRef = React.useRef(null);

  const CustomDrawerContent = ({navigation}) => {
    async function deleteSavedPrivileges() {
      try {
        await Keychain.resetGenericPassword({service: 'privileges'});
        await Keychain.resetGenericPassword({service: 'jwt'});
        console.log('Privileges Deleted Successfully!!!');
      } catch (error) {
        console.error('Error deleting privileges:', error);
      }
    }
    const currentRouteName = useCurrentRouteName();
    // console.log('currentRouteName 689486946626262: ', currentRouteName);
    // const navigation = useNavigation();
    const handleMenuLogout = () => {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to logout?',
        [
          {
            text: 'No',
            onPress: () => console.log('Logout cancelled'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              await deleteSavedPrivileges();
              navigation.navigate('LoginScreen');
            },
            // onPress: () => console.log('Logout Success'),
          },
        ],
        {cancelable: false},
      );
    };

    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={[
            CustomThemeColors.gradientStart,
            CustomThemeColors.gradientEnd,
          ]}
          // colors={['#264e6d', '#598bb3']}
          style={styles.userDetailsContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 2}}>
          {/* <ImageBackground source={require('../../images/harness_background.png')} style={styles.UserDetailsBackground}> */}
          <View style={styles.UserDetailsSubContainer}>
            <View>
              <View style={styles.UserDetailsIconContainer}>
                {/* <MaterialIcons name="account-circle" size={90} color="#fff"/> */}
                <MaterialIcons name="account-circle" size={90} color="white" />
              </View>
            </View>
            <View>
              <View style={styles.UserDetailsTextSection}>
                {currentRouteName !== 'LoginScreen' && (
                  <Text style={styles.UserDetailsText}>
                    {sharedData.userName.charAt(0).toUpperCase() +
                      sharedData.userName.slice(1)}
                  </Text>
                )}
                {/* <Text style={styles.UserDetailsText}>Sr.Manager</Text> */}
                {/* <Text style={styles.UserDetailsText}>Finance</Text> */}
              </View>
            </View>
          </View>
          {/* </ImageBackground> */}
        </LinearGradient>
        <DrawerContentScrollView style={{marginTop: 20}}>
          {currentRouteName !== 'LoginScreen' && (
            <DrawerItem
              // icon={({ color, size }) => <MaterialIcons name="home" color={color} size={size} />}
              icon={({size}) => (
                <MaterialIcons
                  name="home"
                  color={CustomThemeColors.menuIconColor}
                  size={size}
                />
              )}
              label="Home"
              onPress={() => navigation.navigate('HomeScreen')}
            />
          )}

          {/* <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="notifications-on" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="notifications-on"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Alerts"
            onPress={() => navigation.navigate('AlertScreen')}
          />
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="task" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="task"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Tasks"
            onPress={() => navigation.navigate('TaskScreen')}
          />
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="bar-chart" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="bar-chart"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Notes"
            onPress={() => navigation.navigate('NoteScreen')}
          />
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="notes" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="notes"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Charts"
            onPress={() => navigation.navigate('ChartScreen')}
          />
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="approval" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="approval"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Approval"
            onPress={() => navigation.navigate('ApprovalScreen')}
          /> */}
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="logout"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Logout"
            // onPress={() => navigation.navigate('LogoutScreen')}
            onPress={handleMenuLogout}
          />
          <DrawerItem
            // icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
            icon={({size}) => (
              <MaterialIcons
                name="lock-reset"
                color={CustomThemeColors.menuIconColor}
                size={size}
              />
            )}
            label="Reset"
            // onPress={() => navigation.navigate('LogoutScreen')}
            onPress={() => navigation.navigate('ResetPassword')}
          />
          <View>
            <Text></Text>
            <Text style={{left: 20, fontWeight: 'bold'}}>Ver: 1.4.0</Text>
          </View>

          {/* Add more DrawerItem components for other menu items */}
        </DrawerContentScrollView>
      </View>
    );
  };

  // FAB Component to handle visibility and unread count display
  const FABWithUnreadCount = () => {
    const currentRouteName = useCurrentRouteName(); // Get the current screen from the Stack Navigator
    // console.log('currentRouteName 96498469894864: ', currentRouteName);
    // Screens where you don't want to show the FAB
    const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);

    useEffect(() => {
      if (unreadCount > prevUnreadCount) {
        // Show notification
        notificationSound.play(success => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
            notificationSound.getCurrentTime(seconds => {
              console.log('Current playback time (in seconds):', seconds);
            });
          }
        });

        Notifier.showNotification({
          title: 'New Message',
          description: `You have ${unreadCount} unread messages.`,
          duration: 3000,
        });

        // Update previous unread count
        setPrevUnreadCount(unreadCount);
      }
    }, [unreadCount, prevUnreadCount]);
    // Only show FAB if current route is not in the hideFABScreens array
    if (
      currentRouteName === null ||
      hideFABScreens.includes(currentRouteName)
    ) {
      return null; // Don't render the FAB
    }

    return (
      <View style={{position: 'absolute', right: 40, bottom: 50}}>
        <TouchableOpacity
          onPress={() => {
            navigationRef.current?.navigate('NoticeBoardListScreen');
          }}
          style={{
            backgroundColor: '#009E60',
            padding: 16,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: 'white',
          }}>
          {/* <Text style={{color: '#fff', fontSize: 16}}>Message</Text> */}
          <MaterialIcons name="message" size={30} color="white" />
        </TouchableOpacity>

        {/* Unread Messages Badge */}
        {/* {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -7,
              right: -7,
              backgroundColor: 'red',
              borderRadius: 20,
              paddingHorizontal: 6,
              paddingVertical: 2,
              zIndex: 2, // Ensure badge is on top
              borderWidth: 2,
              borderColor: 'white',
            }}>
            <Text style={{color: 'white', fontSize: 12, fontWeight: '700'}}>
              {unreadCount} {unreadCount >= 99 ? '+' : ''}
            </Text>
          </View>
        )} */}

        {responseNewMessageDetails &&
          responseNewMessageDetails.noticeBoardWiseNewMessageDetails &&
          responseNewMessageDetails.totalNewMessages > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -5, // Adjust based on your layout
                right: -3, // Adjust based on your layout
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
                {responseNewMessageDetails?.totalNewMessages >= 999
                  ? '99+'
                  : responseNewMessageDetails?.totalNewMessages}
              </Text>
            </View>
          )}
      </View>
    );
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const credentials = await Keychain.getGenericPassword({
  //         service: 'jwt',
  //       });
  //       if (credentials) {
  //         const token = credentials.password;
  //         // Optionally validate the token here
  //         setIsLoggedIn(true); // User is logged in
  //       } else {
  //         setIsLoggedIn(false); // User is not logged in
  //       }
  //     } catch (error) {
  //       console.error('Failed to load credentials', error);
  //       setIsLoggedIn(false); // Fallback in case of an error
  //     } finally {
  //       setIsLoading(false); // Set loading to false after checking token
  //     }
  //   };

  //   checkToken();
  // }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const credentials =
          (await Keychain.getGenericPassword({
            service: 'jwt',
          })) || 'notoken';

        if (credentials) {
          let token = credentials.password || 'blankToken';

          // Remove 'Bearer ' prefix if present
          if (token.startsWith('Bearer ')) {
            token = token.slice(7);
          }

          console.log('token 574dd57489894 : ', token);
          // const isValid = validateToken(token);
          const sessionExpired = await checkSessionExpiration(token);
          console.log('token 574dd57sdsds489894 : ', sessionExpired);

          if (!sessionExpired) {
            setIsLoggedIn(true); // if session expiration is false then , User will be considered as logged in
          } else {
            setIsLoggedIn(false); // Token is expired or invalid
            // Optionally, remove the invalid token
            // await Keychain.resetGenericPassword({service: 'jwt'});
          }
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error('Failed to load credentials', error);
        setIsLoggedIn(false); // Fallback in case of an error
      } finally {
        setIsLoading(false); // Set loading to false after checking token
      }
    };

    const getKeepMeSignedOption = async () => {
      const credentials = await Keychain.getGenericPassword({
        service: 'keepMeSignedIn',
      });

      const isEnabled = credentials.password; // Ensure credentials exist
      console.log(
        'is keep me signed in enabled: 565664364363253',
        typeof isEnabled,
        isEnabled,
      );
      return isEnabled;
    };

    // Use an async function to handle the logic
    const checkKeepMeSignedIn = async () => {
      const isKeepMeSignedInEnabled = await getKeepMeSignedOption(); // Await the result

      if (isKeepMeSignedInEnabled === 'true') {
        await checkToken(); // Call checkToken if enabled
      } else {
        // Set loading to false since we don't need to check the token
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };

    // Call the async function (make sure to do this in the right place, e.g., inside useEffect or similar)

    checkKeepMeSignedIn();
  }, []);

  // const checkSessionExpiration = async token => {
  //   try {
  //     // Construct the URL
  //     const url = `${API_URL}session/isExpired`;
  //     console.log('Fetching data from URL:', url);

  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       console.log('session/isExpired response code  : ', response.status);
  //       setIsLoggedIn(false);
  //       return true;
  //       // throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setIsLoggedIn(true);
  //     return false;
  //     // setFilteredMainData(data); // Initialize filtered data
  //   } catch (error) {
  //     console.error('Error occured while checking session expiration ', error);
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // };

  // const checkSessionExpiration = async (token = 'fs') => {
  //   console.log('token for session expiration api : ', token);
  //   const url = `${API_URL}/session/isExpired`;
  //   console.log();
  //   const maxRetries = 3; // Define maximum retries for the request
  //   let attempts = 0;

  //   while (attempts < maxRetries) {
  //     try {
  //       console.log(
  //         `Attempt ${attempts + 1}: Checking session expiration from URL:`,
  //         url,
  //       );

  //       // Make the API call
  //       const response = await fetch(url, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `${token}`,
  //         },
  //       });

  //       // Handle non-2xx status codes (e.g., 401 Unauthorized)
  //       if (!response.ok) {
  //         console.warn(
  //           `Session check failed with status code: ${response.status}`,
  //         );
  //         return true;
  //         // if (response.status === 401) {
  //         //   // Unauthorized status - token may be invalid or expired
  //         //   // setIsLoggedIn(false);
  //         //   return true;
  //         // } else if (response.status >= 500) {
  //         //   // Retry for server errors (status 5xx)
  //         //   attempts += 1;
  //         //   continue; // Retry the request
  //         // }
  //       }
  //       // else if (response.ok) {
  //       // For other non-2xx status codes, consider the session expired
  //       return false;
  //       // }
  //     } catch (error) {
  //       console.error(
  //         'Error occurred while checking session expiration:',
  //         error,
  //       );

  //       // Check if error is network-related and attempt retry
  //       if (error.message.includes('Network request failed')) {
  //         attempts += 1;
  //         console.warn(
  //           `Network error, retrying... (${attempts}/${maxRetries})`,
  //         );
  //         await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
  //       } else {
  //         // For other errors, stop retries and treat session as expired
  //         // setIsLoggedIn(false);
  //         return true;
  //       }
  //     }
  //   }

  // If max retries reached without a successful response, consider session expired
  //   console.warn('Max retries reached. Assuming session expired.');
  //   setIsLoggedIn(false);
  //   return true;
  // };

  const showSessionExpiredAlert = () => {
    Alert.alert(
      'Your session has expired',
      'Please login again.',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'), // Optional, handle cancel if needed
          style: 'cancel', // iOS only
        },
        // {
        //   text: 'Login',
        //   onPress: () => navigation.navigate('LoginScreen'), // Navigate to LoginScreen
        // },
      ],
      {cancelable: false},
    );
  };

  const checkSessionExpiration = async (token = 'blankToken') => {
    const url = `${API_URL}/session/isExpired`; // Replace API_URL with your actual base URL
    console.log('token 6665454', token);
    try {
      // Make the API call with the provided token
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response status is 403 (Forbidden)
      if (response.status === 403 || response.status === 401) {
        console.warn(`Session expired: received ${response.status} response.`);
        showSessionExpiredAlert();
        return true; // Indicates session expired
      }

      // Check if response status is not OK
      if (!response.ok) {
        console.warn(
          `Session check failed with status code: ${response.status}`,
        );
        showSessionExpiredAlert();
        return true; // Treat as session expired
      }

      // If response is OK, parse response body if needed
      // const data = await response.json();
      // console.log('Session is active:', data);
      return false; // Indicates session is still active
    } catch (error) {
      if (error.message === 'Network request failed') {
        showSessionExpiredAlert();
      }
      console.error('Error occurred while checking session expiration:', error);
      // return true; // Assume session expired in case of an error
    }
  };

  // Function to validate the token
  const validateToken = token => {
    try {
      // const decoded = jwt_decode(token); // Use jwt_decode
      const decoded = jwtDecode(token);
      console.log('decoded 099469476574 : ', decoded);
      // console.log('decoded token 9586905890486900909903 :', decoded);
      if (!decoded.exp) {
        console.warn('Token does not have an exp field');
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (currentTime > decoded.exp) {
        Alert.alert('Your session has been Expired', 'Please Login again.');
        console.warn('Token has expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to validate token', error);
      return false;
    }
  };
  if (isLoading) {
    // You can return a loading spinner or some other component while checking the token
    // return null; // or <LoadingSpinner />
    return <CustomLoadingUI />;
  }
  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NotifierWrapper>
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
          <Drawer.Navigator
            initialRouteName={isLoggedIn ? 'HomeDrawer' : 'LoginScreen'}
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
              drawerStyle: {
                backgroundColor: 'white', // Change this color to your desired background color
                width: 300, // Optional: Specify the width of the drawer
              },
              headerShown: false,
            }}>
            <Drawer.Screen name="HomeDrawer">
              {() => (
                <>
                  <Stack.Navigator
                    initialRouteName={
                      isLoggedIn ? 'HomeScreen' : 'LoginScreen'
                    }>
                    <Stack.Screen
                      name="HomeScreen"
                      component={HomeScreen}
                      options={{headerShown: false}}
                    />

                    <Stack.Screen
                      name="LoginScreen"
                      component={LoginScreen}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                name="AssetAudit"
                component={AssetAudit}
                options={{headerShown: false}}
              /> */}
                    {/* <Stack.Screen
                name="AssetAuditSelection"
                component={AssetAuditSelection}
                options={{headerShown: false}}
              /> */}
                    <Stack.Screen
                      name="DocumentApproverMain"
                      component={DocumentApproverMain}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                name="AssetAuditDetails"
                component={AssetAuditDetails}
                options={{headerShown: false}}
              />  */}
                    <Stack.Screen
                      name="IssueGroups"
                      component={IssueGroups}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{headerShown: false}}
                  /> */}

                    <Stack.Screen
                      name="TestScreen"
                      component={TestScreen}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                name="CustomLable"
                component={CustomLableValueComp}
                options={{headerShown: false}}
              /> */}
                    <Stack.Screen
                      name="Test"
                      component={Test}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                    name="IssueGroups"
                    component={IssueGroups}
                    options={{headerShown: false}}
                  /> */}
                    {/* <Stack.Screen
                name="TableComponent"
                component={TableComponent}
                options={{headerShown: false}}
              /> */}
                    <Stack.Screen
                      name="NoticeBoardMainScreen"
                      component={NoticeBoardMainScreen}
                      options={{headerShown: false}}
                    />

                    <Stack.Screen
                      name="NoticeBoardListScreen"
                      component={NoticeBoardListScreen}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="NoticeBoardScreen"
                      component={NoticeBoardScreen}
                      options={{headerShown: false}}
                    />

                    {/* <Stack.Screen
                name="GroupListScreen"
                component={GroupListScreen}
              /> */}
                    {/* <Stack.Screen
                name="NoticeBoardListScreen"
                component={NoticeBoardListScreen}
              /> */}

                    <Stack.Screen
                      name="ResetPassword"
                      component={ResetPassword}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen
                name="AssectSkel"
                component={AssetSkel}
              /> */}

                    {/* <Stack.Screen 
                name="ResetPassword" 
                component={ResetPassword} 
                options={{ headerShown: false }} 
              /> */}
                    {/* <Stack.Screen 
                name="AssetListMainScreen" 
                component={AssetListMainScreen} 
                options={{ headerShown: false }} 
              /> */}
                    <Stack.Screen
                      name="AssetListSort"
                      component={AssetListSort}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="AssetListFilter"
                      component={AssetListFilter}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="AssetListDetails"
                      component={AssetListDetails}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="AssetListImage"
                      component={AssetListImage}
                      options={{headerShown: false}}
                    />
                    {/* <Stack.Screen name="ComponentWithCropFreeIcon" component={ComponentWithCropFreeIcon} options={{ headerShown: false }} /> */}
                    <Stack.Screen
                      name="AssetListMainScreen"
                      component={AssetListMainScreen}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="QrScanner"
                      component={QrScanner}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="IssueGroupMainScreen"
                      component={IssueGroupMainScreen}
                      options={{headerShown: false}}
                    />

                    {/* Add other screens here */}
                  </Stack.Navigator>
                </>
              )}
            </Drawer.Screen>
          </Drawer.Navigator>

          <FABWithUnreadCount />
        </NavigationContainer>
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  userDetailsContainer: {
    // borderRadius:10,
    // borderRadius:20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 0,
    width: 270,

    left: 15,
    top: 15,
    marginBottom: 10,
  },
  UserDetailsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    left: 10,
    maxHeight: 50,
    overflow: 'hidden',
  },
  UserDetailsTextSection: {
    alignItems: 'center',
    maxWidth: 150,
  },
  UserDetailsIconContainer: {
    right: 10,
  },
  UserDetailsSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // left:'100%',
  },
});

export default App;
