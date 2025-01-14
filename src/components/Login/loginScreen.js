import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Keyboard,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {AsyncStorage} from 'react-native-async-storage/async-storage';
import {CheckBox} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import styles from './loginScreenStyles';
import * as Keychain from 'react-native-keychain';
import LoadingIndicator from '../commonUtils/LoadingIndicator';
// import { API_URL } from '@env';
import {CompanyName, API_URL, logo, pass} from '../ApiUrl';
// import {useDynamicEnvironment} from '../ApiUrl';
import CustomAlert from '../common-utils/CustomAlert';
import {currentFontScale, sharedData, sysBasedFontSize} from './UserId';
import TabupsidedownEllipse from '../../images/Ellipse.png';
import topLogoImage from '../../images/logo.png';
import jjmills from '../../images/jj_logo.png';
import av from '../../images/AV_logo.png';
import harness from '../../images/logo.png';
import TabEllipse from '../../images/Ellipsef.png';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Ellipse,
  Rect,
  Polygon,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import {CustomThemeColors} from '../CustomThemeColors';
import CustomModal from '../common-utils/modal';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {customAnimatedText} from 'react-native-paper/lib/typescript/components/Typography/AnimatedText';

const LoginScreen = () => {
  // const { API_URL, CompanyName, logo, pass } = useDynamicEnvironment();

  const isTablet = DeviceInfo.isTablet();
  useEffect(() => {
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

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Cleanup the event listener when the component unmounts
    return () => backHandler.remove();
  }, []);

  const [loggedInUserPassword, setLoggedInUserPassword] = useState(null);
  const [username, setUsername] = useState(''); // Default to 'fff' initially

  // AUTO FILL THE PREVIOUS USER NAME WHILE LOGIN
  useEffect(() => {
    const fetchLoggedUserId = async () => {
      const PrefilledUsername = await Keychain.getGenericPassword({
        service: 'loggedInUserId',
      });

      if (PrefilledUsername) {
        setLoggedInUserPassword(PrefilledUsername.password);
        setUsername(PrefilledUsername.password); // Update username once password is fetched
      }
    };

    fetchLoggedUserId();
  }, []);

  const [Password, setPassword] = useState(pass);
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertValidVisible, setIsAlertValidVisible] = useState(false);
  const [isactive, setActive] = useState(false); // Keyboard state
  const [showPassword, setShowPassword] = useState(false);
  const [isPop, setPop] = useState(false);

  // useEffect(()=>handleLogin(),[Password])
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isDivisionOpen, setIsDivisionOpen] = useState(false);

  const [company, setCompany] = useState(null);
  const [division, setDivision] = useState(null);

  const [companyItems, setCompanyItems] = useState([
    {label: 'Adistham Ventures', value: 'Adistham Ventures'},
    // { label: 'JJ Mills', value: 'JJ Mills' },
  ]);

  const [divisionItems, setDivisionItems] = useState([
    {label: 'Fabric', value: 'Fabric'},
    {label: 'Cut-fabric', value: 'Cut-fabric'},
  ]);

  const toggleModal = () => {
    setPop(!isPop);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setActive(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setActive(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleAlert = () => {
    // console.log('Showing Alert');
    setIsAlertVisible(!isAlertVisible);
  };
  const handleValid = () => {
    // console.log('Showing Alert');
    setIsAlertValidVisible(!isAlertValidVisible);
  };

  const handleLogin = async () => {
    try {
      // Check if username and password are entered
      console.log('Api_url::', API_URL);
      if (!username || !Password) {
        handleAlert();
        // Alert.alert('Alert', 'Please enter username and password to proceed.');
        return;
      }

      setIsLoading(true); // Show loading indicator
      const loggedInUserPassword = await Keychain.getGenericPassword({
        service: 'loggedInUserPassword',
      });
      const requestBody = {
        userId: username,
        password: Password,
      };

      console.log('login requestBody : 534656564354352342 : ', requestBody);
      sharedData.userName = requestBody.userId;

      // Sending the POST request to fetch user credentials
      // console.log('api url full: ', `${API_URL}/api/v1/login`);
      // console.log('requestBody : ', requestBody);
      const response = await fetch(`${API_URL}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ',
        },
        body: JSON.stringify(requestBody),
      });
      // console.log(JSON.stringify(requestBody))

      if (!response.ok) {
        setIsLoading(false); //stop loading, if response status not ok.
        if (response.status === 401) {
          throw new Error('Failed to authenticate');
        } else {
          throw new Error('Failed to fetch data' + response.status);
        }
      }

      const authToken = response.headers.get('Authorization');
      // console.log('authToken' + authToken);
      saveToken(authToken);

      async function saveToken(token) {
        // try {
        // Save the token
        await Keychain.setGenericPassword('jwt', token, {service: 'jwt'});

        // console.log('Token saved successfully');

        // const credentials = await Keychain.getGenericPassword({service: 'jwt'});
        // console.log('saved token : ', credentials.password);
        // }

        const responseBody = await response.json();
        console.log('login response body 98488942: ', responseBody);
        const privileges = responseBody.privileges.privileges;
        const loggedInUserId = responseBody.userId;
        const loggedInUserName = responseBody.userName
          ? responseBody.userName
          : null;

        // console.log('Extracted Privileges from keychain', privileges);
        await saveUserId(loggedInUserId);
        async function saveUserId(userId) {
          // try {
          // Save the token
          await Keychain.setGenericPassword('loggedInUserId', loggedInUserId, {
            service: 'loggedInUserId',
          });
          if (checked) {
            await Keychain.setGenericPassword(
              'loggedInUserPassword',
              Password,
              {
                service: 'loggedInUserPassword',
              },
            );
          }
          await Keychain.setGenericPassword(
            'loggedInUserName',
            loggedInUserName,
            {
              service: 'loggedInUserName',
            },
          );
          // console.log('Token saved successfully');

          const credentials = await Keychain.getGenericPassword({
            service: 'jwt',
          });
          // console.log('saved token : ', credentials.password);
        }
        await savePrevileges(privileges);

        async function savePrevileges(privileges) {
          try {
            await Keychain.setGenericPassword(
              'privileges',
              JSON.stringify(privileges),
              {service: 'privileges'},
            );
            // console.log('Privileges Saved Succefully!!!');

            const savedPrivileges = await Keychain.getGenericPassword({
              service: 'privileges',
            });
            // console.log(
            //   'saved privilages are: ',
            //   JSON.parse(savedPrivileges.password),
            // );
          } catch (error) {
            throw new Error('Failed to log in', error);
          } finally {
            setIsLoading(false); // Always hide loading indicator after login attempt (success or failure)
            setUsername(''); // Clear input field after login
            setPassword(''); // Clear password field after login
            // setChecked(false);
          }
        }

        // Alert.alert('Success', 'Login successful');
        navigation.navigate('HomeScreen', {username});
        // navigation.navigate('IssueGroups', {username});
      }
    } catch (error) {
      setIsLoading(false); //stopping loading, if  network error happens,
      console.error('Error:', error);
      handleValid();
      // Alert.alert('Error', 'Invalid Username or Password');
    }
  };

  const handleResetpassword = async () => {
    navigation.navigate('ResetPassword');
  };

  // Loading indicator component
  // const LoadingIndicator = () => (
  //   <View style={styles.loadingContainer}>
  //     <ActivityIndicator size="large" color="#fff" />
  //     <Text style={styles.loadingText}>Loading...</Text>
  //   </View>
  // );

  useEffect(() => {
    console.log('keep me signed in set to 88490dtd55085993: ', checked);
    Keychain.setGenericPassword('keepMeSignedIn', JSON.stringify(checked), {
      service: 'keepMeSignedIn',
    });
  }, [checked]);

  const handleKeepMeSignedIn = async () => {
    console.log('keep me signed in set before 88490589085993: ', checked);
    setChecked(!checked);
  };
  return (
    <>
      <StatusBar
        backgroundColor={CustomThemeColors.primary}
        barStyle="light-content"
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {!isactive ? (
            // HEADER SECTION
            <View style={[styles.topContainer, {flex: 1}]}>
              <Svg
                height={isTablet? sysBasedFontSize.Large ? 210 : 210 :500}
                width="100%"
                style={{
                  paddingVertical: 30,
                  position: 'absolute',
                  top:isTablet? sysBasedFontSize.Large ? -70 : -1:-10,
                }}>
                <Ellipse
                  cx="50%"
                  cy="0%"
                  rx="100%"
                  ry="210"
                  fill={CustomThemeColors.primary}
                />
                <View style={styles.circleContainer}>
                  {/* Semi-circle background at the bottom */}
                  <View style={styles.circleBackground}>
                    <Text style={styles.headingText}>
                      Harness Digitech Private Limited
                    </Text>
                    <Text style={styles.secondheadingText}>
                      "The Potential of Technology"
                    </Text>
                    <View style={styles.logoContainer}>
                      <Image
                        source={topLogoImage}
                        style={[
                          styles.topLogo,
                          {
                            width: isTablet
                              ? sysBasedFontSize.Large
                                ? 40
                                : 24
                              : 80,
                            height: isTablet
                              ? sysBasedFontSize.Large
                                ? 40
                                : 24
                              : 80,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </Svg>
            </View>
          ) : null}

          {/* SECONDARY HEADER */}
          <View style={[styles.middleContainer, {marginTop: 150, flex: 1}]}>
            <Text style={styles.thirdHeading}>{CompanyName}</Text>
            <Image
              source={logo == 'jjmills' ? jjmills : av}
              style={[
                styles.bottomLogo,
                {
                  width: isTablet
                    ? currentFontScale >= sysBasedFontSize.Large
                      ? 50
                      : 40
                    : 80,
                  height: isTablet
                    ? currentFontScale >= sysBasedFontSize.Large
                      ? 50
                      : 40
                    : 80,
                },
              ]}
            />
            {/* <Text style={styles.thirdHeading}>
      Jay Jay Mills (Bangladesh) Private Limited
    </Text>
    <Image
      source={jjmils}
      style={[
        styles.bottomLogo,
        {width: isTablet ? 50 : 60, height: isTablet ? 50 : 60},
      ]}
    /> */}

            {/* <Text style={styles.thirdHeading}>ADISHTAM VENTURES</Text>
    <Image
      source={av}
      style={[
        styles.bottomLogo,
        {width: isTablet ? 50 : 60, height: isTablet ? 50 : 60},
      ]}
    /> */}

            {/* <Text style={styles.thirdHeading}>
      Harness Textile Private Limited
    </Text>
    <Image
      source={harness}
      style={[
        styles.bottomLogo,
        {width: isTablet ? 50 : 60, height: isTablet ? 50 : 60},
      ]}
    /> */}

            <TextInput
              style={styles.emailInput}
              value={username}
              placeholder="Username"
              placeholderTextColor="#3788E5"
              onChangeText={text => setUsername(text)}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#3788E5"
                onChangeText={text => setPassword(text)}
                value={Password}
                secureTextEntry={!showPassword} // Toggle based on showPassword state
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#3788E5"
                />
              </TouchableOpacity>
            </View>

            <View style={{}}>
              <CheckBox
                checked={checked}
                onPress={() => handleKeepMeSignedIn()}
                containerStyle={styles.checkboxContainer}
                checkedColor="#212529" // A subtle black color for the checked state
                uncheckedColor="#6c757d" // A soft gray for the unchecked state
                title="Keep me signed in" // Text next to the checkbox
                textStyle={styles.checkboxtext}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
      style={styles.loginButton}
      onPress={() => setPop(true)}>
      <Text style={styles.loginButtonText}>LOGIN</Text>
    </TouchableOpacity> */}

            {/* <TouchableOpacity
    style={styles.ForgotpasswordButton}
    onPress={() => console.log('login')}>
    <Text style={styles.ForgotpasswordonText}>Forgot Password?</Text>
  </TouchableOpacity> */}
          </View>
          <CustomAlert
            visible={isAlertVisible}
            title={'Alert'}
            message={'Please enter username and password to proceed.'}
            onClose={handleAlert}
          />
          <CustomAlert
            visible={isAlertValidVisible}
            title={'Alert'}
            message={'Invalid Username or Password'}
            onClose={handleValid}
          />
        </View>

        {/* bottom Section */}
        {!isactive ? (
          <SafeAreaView style={{flex: isTablet ? 0 : 0}}>
            <View style={styles.bottomContainer}>
              <Svg
                height="60"
                width="100%"
                style={{paddingVertical: 10, position: 'absolute', bottom: -1}}>
                {/* The semi-circle ellipse */}
                <Ellipse
                  cx="50%"
                  cy="90%"
                  rx="60%"
                  ry="80%"
                  fill={CustomThemeColors.primary} // Custom theme color
                />

                {/* Text inside the ellipse */}
                <SvgText
                  x="50%" // Position text at horizontal center
                  y="50%" // Position text at vertical center
                  textAnchor="middle" // Center the text horizontally
                  alignmentBaseline="middle" // Center the text vertically
                  fontSize="14"
                  fill="white" // White text color
                  fontWeight="500">
                  App version 1.4.1
                </SvgText>
              </Svg>
            </View>
          </SafeAreaView>
        ) : null}

        <CustomModal isVisible={isPop} onClose={toggleModal}>
          <View style={style.container}>
            <Text style={style.heading}>Company</Text>
            <DropDownPicker
              open={isCompanyOpen}
              value={company}
              items={companyItems}
              setOpen={setIsCompanyOpen}
              setValue={setCompany}
              setItems={setCompanyItems}
              placeholder="Select Company"
              containerStyle={style.dropdownContainer}
            />

            <Text style={style.heading}>Division</Text>
            <DropDownPicker
              open={isDivisionOpen}
              value={division}
              items={divisionItems}
              setOpen={setIsDivisionOpen}
              setValue={setDivision}
              setItems={setDivisionItems}
              placeholder="Select Division"
              containerStyle={style.dropdownContainer}
            />
          </View>
        </CustomModal>
      </ScrollView>
    </>
  );
};

export default LoginScreen;

const style = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 20,
    backgroundColor: 'transparent', // Fully transparent
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginVertical: 10,
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 20,
    zIndex: 1000, // Adjust for layering
  },
});