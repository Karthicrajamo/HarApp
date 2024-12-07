import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {CustomThemeColors} from '../../CustomThemeColors';
import CustomModal from '../../common-utils/modal';
import {Text} from 'react-native';
import {TextInput} from 'react-native';
import CustomButton from '../../common-utils/CustomButton';
import commonStyles from '../ApprovalCommonStyles';
import {isTablet} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

const ApproveRejectComponent = ({approveUrl, rejectUrl, params, rejParams}) => {
  const navigation = useNavigation();
  const [isRejectPop, setRejectPop] = useState(false);
  const [value, setValue] = useState('');
  const [rejectParams, setRejectParams] = useState([]);

  useEffect(() => {
    console.log('reject update', Array.isArray(rejectParams));
    if(Array.isArray(rejectParams) == false){
      handleAction('reject');

    }
  }, [rejectParams]);
  // console.log('rejUrl::', action == 'approve' ? params : rejectParams);
  
  const toggleModal = () => {
    setRejectPop(!isRejectPop);
  };

  const updateMessage = newMessage => {
    const bdData = JSON.parse(rejParams);
    bdData.message = newMessage;
    setRejectParams(bdData);
    // console.log('Updated JSON:', params);
    // console.log('Updated JSON:', bdData.message);
    console.log('Updated JSON:', bdData);
  };

  useEffect(() => {
    console.log('textvalue::', value), [value];
  });

  const confirmApproval = action => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to approve this?',
      [
        {
          text: 'cancel',
          onPress: () => console.log('approval cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleAction(action),
        },
      ],
      {cancelable: false},
    );
  };

  const handleAction = async action => {
    console.log('params ApRejComp::', params);
    const url = action === 'approve' ? approveUrl : rejectUrl;
    const successMessage =
      action === 'approve' ? 'Approve Successfully' : 'Reject Successfully';
    const errorMessage =
      action === 'approve' ? 'Approval Failed' : 'Rejection Failed';
    console.log(
      'rejUrl::',
      JSON.stringify(rejectParams),
    );
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: action == 'approve' ? params : JSON.stringify(rejectParams), // Convert the body to a JSON string
      });
      console.log('response ApRejCom::', response);

      if (response.ok) {
        const data = await response.json();
        ToastAndroid.show(successMessage, ToastAndroid.SHORT);
        console.log('Response:', data);
      } else {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
      navigation.navigate('ApprovalMainScreen');
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.approveButton]}
        onPress={() => confirmApproval('approve')}>
        <Text style={[styles.buttonText, {color: 'white'}]}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.rejectButton]}
        onPress={() => {setRejectPop(true);console.log('pressed;;;')}}>
        <Text style={[styles.buttonText, {color: 'white'}]}>Reject</Text>
      </TouchableOpacity>
      {/* <Button
        title="Approve"
        onPress={() => handleAction('approve')}
        color={CustomThemeColors.primary}
      /> */}
      {/* <Button
        title="Reject"
        onPress={() => setRejectPop(true)}
        // onPress={() => handleAction('reject')}
        color={CustomThemeColors.primary}
      /> */}
      <CustomModal
        isVisible={isRejectPop}
        onClose={toggleModal}
        title="Reject"
        subBtn={'Submit'}
        // subBtnAction={() => console.log('Response:')}>
        subBtnAction={() => {
          updateMessage(value);
          // handleAction('reject');
          toggleModal();
        }}>
        {/* {/ Children Content /} */}
        <Text style={styles.modalBody}>Please Enter the reason to Reject</Text>
        <TextInput
          placeholder="Reason" // Placeholder text
          editable={true} // Enables input
          value={value} // The value of the input is controlled by state
          onChangeText={text => setValue(text)} // Update state on text change
          style={styles.input} // Add any styling as needed
        />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  modalBody: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    // marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#3788E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 80,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
    width: 100,
  },
  approveButton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: CustomThemeColors.primary,
    backgroundColor: CustomThemeColors.primary,
  },
  rejectButton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: CustomThemeColors.primary,
    backgroundColor: CustomThemeColors.primary,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApproveRejectComponent;
