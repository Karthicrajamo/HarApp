import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './resetPasswordStyles';
import {getGenericPassword} from 'react-native-keychain';
import CustomAlert from '../common-utils/CustomAlert';
import API_URL from '../ApiUrl';
// import Alert from '@mui/material/Alert';
import * as Keychain from 'react-native-keychain';

const ResetPassword = () => {
  const [authtoken, setAuthtoken] = useState(null);
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isUserAlertVisible, setIsUserAlertVisible] = useState(false);
  const [isPassAlertVisible, setIsPassAlertVisible] = useState(false);
  const [isNewPassAlertVisible, setIsNewPassAlertVisible] = useState(false);
  const [failPass, setFailPass] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);

  const showAlert = () => {
    console.log('Showing Alert');
    setIsAlertVisible(true);
  };
  const showAlertNow = () => {
    showAlert();
  };
  const hideAlert = () => {
    setIsAlertVisible(false);
  };
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
            'token extracted from keychain storage !! : ' +
              credentials.password,
          );
        } else {
          // throw new Error('No Token found in Keychain.');
        }
      } catch (error) {
        console.error('Error fetching Token', error);
        // Alert.alert('Error ' + 'failed to fetch token');
      }
    };
    fetchToken();
  }, []);
  const handleBackToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleResetPassword = async () => {
    showAlert();
    // setUsername('');
    // setOldPassword('');
    // setNewPassword('');
    console.log(username);
    try {
      if (!username) {
        setIsUserAlertVisible(true);
        // Alert.alert('Alert', 'Please enter username  to proceed.');
      } else if (!oldPassword) {
        // Alert.alert('Alert', 'Please enter oldpassword to proceed.');
      } else if (!newPassword) {
        setIsNewPassAlertVisible(true);
        // Alert.alert('Alert', 'Please enter newpassword to proceed.');
        // <CustomAlert
        //   visible={setIsAlertVisible}
        //   title={'Alert'}
        //   message={'Please enter newpassword to proceed.'}
        //   onClose={hideAlert}
        // />;
        return;
      }

      const requestBody = {
        userId: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      // Sending the POST request to fetch user credentials
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
      // Alert.alert('Success', 'Password reset successful');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error:', error);
      setFailPass(true);
      // Alert.alert('Error', 'Failed to reset password');
    }
  };

  return (
    <>
      <Image
        style={styles.body}
        source={require('../../images/Background.png')}
      />
      <View style={{flex: 1, zIndex: 10}}>
        <Text style={styles.headText}>Reset Password</Text>

        <View style={styles.resetcontainer}>
          <View style={styles.subcontainer2}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#3788E5"
              onChangeText={text => setUsername(text)}
              value={username}
            />
            {/* <TouchableOpacity onPress={showAlertNow}>
              <Button title="Show Alert" />
            </TouchableOpacity> */}
            <CustomAlert
              visible={isUserAlertVisible}
              title={'Alert'}
              message={'Please enter username to proceed.'}
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
            {/* <CustomAlert
              visible={isAlertVisible}
              onClose={hideAlert}
              title="Alert Title"
              message="This is a custom alert message."
            /> */}
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor="#3788E5"
              onChangeText={text => setOldPassword(text)}
              value={oldPassword}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#3788E5"
              onChangeText={text => setNewPassword(text)}
              value={newPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.resetbutton}
              onPress={handleResetPassword}>
              <Text style={styles.resetbuttonText}>RESET</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text onPress={handleBackToLogin} style={styles.resetpassword}>
                Back to Login Page{' '}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.foot}>
            <Image
              style={styles.footer}
              source={require('../../images/Ellipsef.png')}></Image>
          </View>
        </View>
      </View>
    </>
  );

  //   return (
  //   <View  style={styles.maincontainer} >
  //         <ImageBackground source={require('../../images/harness_background.png')} style={styles.background}>

  //     <View >
  //             <Text style={styles.resetpasswordheading}>Reset Password</Text>
  //     </View>

  // <View style={styles.userdetailscontainer}>
  //   <View style={styles.subcontainer}>
  //       <TextInput
  //         style={styles.input}
  //         placeholder="Username"
  //         onChangeText={(text) => setUsername(text)}
  //         value={username}
  //       />
  //       <TextInput
  //         style={styles.input}
  //         placeholder="Old Password"
  //         onChangeText={(text) => setOldPassword(text)}
  //         value={oldPassword}
  //         secureTextEntry={true}
  //       />
  //       <TextInput
  //         style={styles.input}
  //         placeholder="New Password"
  //         onChangeText={(text) => setNewPassword(text)}
  //         value={newPassword}
  //         secureTextEntry={true}
  //       />
  //     {/ <View> /}
  //       <TouchableOpacity style={styles.resetbutton} onPress={handleResetPassword}>
  //             <Text style={styles.resetbuttontext}>Reset</Text>
  //       </TouchableOpacity>
  //       {/ </View> /}
  //     {/ <View>  /}

  //       <TouchableOpacity  >
  //             <Text onPress={handleBackToLogin} style={styles.backtologin}>
  //             Back to Login Page </Text>
  //       </TouchableOpacity>
  //     {/ </View> /}
  //   </View>
  //   </View>

  //          </ImageBackground>
  //   </View>

  //   );
};

export default ResetPassword;
