import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './resetPasswordStyles';
import {getGenericPassword} from 'react-native-keychain';
import CustomAlert from '../common-utils/CustomAlert';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../ApiUrl';
import {sharedData, sysBasedFontSize} from '../Login/UserId';
import {CustomThemeColors} from '../CustomThemeColors';
import topLogoImage from '../../images/logo.png';
import Svg, {
  Circle,
  Ellipse,
  Rect,
  Polygon,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import DeviceInfo from 'react-native-device-info';
import { Keyboard } from 'react-native';

const {width, height} = Dimensions.get('window');

const ResetPassword = () => {
  const isTablet = DeviceInfo.isTablet();

  const [authtoken, setAuthtoken] = useState(null);
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  const [isUserAlertVisible, setIsUserAlertVisible] = useState(false);
  const [isPassAlertVisible, setIsPassAlertVisible] = useState(false);
  const [isNewPassAlertVisible, setIsNewPassAlertVisible] = useState(false);
  const [failPass, setFailPass] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);
  const [active, setActive] = useState(false)


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

  const onCloseUser = () => {
    setIsUserAlertVisible(false);
  };
  const onClosePass = () => {
    setIsPassAlertVisible(false);
  };
  const onCloseNewPass = () => {
    setIsNewPassAlertVisible(false);
  };
  const onCloseFailPass = () => {
    setFailPass(false);
  };
  const onCloseSuccess = () => {
    setFailPass(false);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const credentials = await getGenericPassword();
        if (credentials && credentials.password) {
          setAuthtoken(credentials.password);
          console.log(
            'Token extracted from keychain storage:',
            credentials.password,
          );
        }
      } catch (error) {
        console.error('Error fetching Token', error);
      }
    };
    fetchToken();
  }, []);

  const handleBackToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleResetPassword = async () => {
    try {
      if (!username || username !== sharedData.userName) {
        setIsUserAlertVisible(true);
        return;
      }
      if (!oldPassword) {
        setIsPassAlertVisible(true);
        return;
      }
      if (!newPassword) {
        setIsNewPassAlertVisible(true);
        return;
      }

      const requestBody = {
        userId: username,
        oldPassword,
        newPassword,
      };

      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      const response = await fetch(`${API_URL}/api/user/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setSuccessLogin(true);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error:', error);
      setFailPass(true);
    }
  };

  return (
    <>
      {/* <Image source={require('../../images/Background.png')} style={styles.body} /> */}
      {!active &&
      <View style={[styles.topContainer, {flex: .4, marginBottom:10}]}>
        <Svg
          height={isTablet ? (sysBasedFontSize.Large ? 210 : 210) : 500}
          width="100%"
          style={{
            // paddingVertical: 30,
            position: 'absolute',
            top: isTablet ? (sysBasedFontSize.Large ? -70 : -1) : -10,
            // backgroundColor: 'red',
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
              </Text>
                        <Text style={styles.headText}>Reset Password</Text>

            </View>
          </View>
        </Svg>
      </View>}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {/* <Text style={styles.headText}>Reset Password</Text> */}
          <View style={styles.resetContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#3788E5"
              onChangeText={setUsername}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor="#3788E5"
              onChangeText={setOldPassword}
              value={oldPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#3788E5"
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.resetButton}
              onPress={()=>handleResetPassword()}>
              <Text style={styles.resetButtonText}>RESET</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.resetPasswordText}>Back to Login Page</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
              visible={isUserAlertVisible}
              title={'Alert'}
              message={'Please enter a Proper Username to proceed.'}
              onClose={onCloseUser}
            />
            <CustomAlert
              visible={isPassAlertVisible}
              title={'Alert'}
              message={'Please enter Old Password to proceed.'}
              onClose={onClosePass}
            />
            <CustomAlert
              visible={isNewPassAlertVisible}
              title={'Alert'}
              message={'Please enter New Password to proceed.'}
              onClose={onCloseNewPass}
            />
            {/* <CustomAlert
          visible={failPass}
          title={'Alert'}
          message={'Failed to reset password'}
          onClose={onCloseFailPass}
          /> */}
            <CustomAlert
              visible={successLogin}
              title={'Alert'}
              message={'Password reset successful'}
              onClose={onCloseSuccess}
            />
    </>
  );
};

export default ResetPassword;
