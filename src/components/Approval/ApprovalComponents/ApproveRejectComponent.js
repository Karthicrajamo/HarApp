import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {CustomThemeColors} from '../../CustomThemeColors';
import CustomModal from '../../common-utils/modal';
import {Text} from 'react-native';
import {TextInput} from 'react-native';
import CustomButton from '../../common-utils/CustomButton';
import commonStyles from '../ApprovalCommonStyles';

const ApproveRejectComponent = ({approveUrl, rejectUrl, params}) => {
  const [isRejectPop, SetRejectPop] = useState(false);
  const [value, setValue] = useState('');
  const [rejParams, setRejParams] = useState([]);

  const toggleModal = () => {
    SetRejectPop(!isRejectPop);
  };

  const updateMessage = newMessage => {
    const bdData = JSON.parse(params);
    bdData.message = newMessage;
    setRejParams(bdData);
    // console.log('Updated JSON:', params);
    // console.log('Updated JSON:', bdData.message);
    console.log('Updated JSON:', bdData);
  };

  useEffect(() => {
    console.log('textvalue::', value), [value];
  });

  const handleAction = async action => {
    console.log('params ApRejComp::', params);
    const url = action === 'approve' ? approveUrl : rejectUrl;
    const successMessage =
      action === 'approve' ? 'Approve Successfully' : 'Reject Successfully';
    const errorMessage =
      action === 'approve' ? 'Approval Failed' : 'Rejection Failed';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: action == 'approve' ? params : rejParams, // Convert the body to a JSON string
      });
      console.log('response ApRejCom::', response);

      if (response.ok) {
        const data = await response.json();
        ToastAndroid.show(successMessage, ToastAndroid.SHORT);
        console.log('Response:', data);
      } else {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Approve"
        onPress={() => handleAction('approve')}
        color={CustomThemeColors.primary}
      />
      <Button
        title="Reject"
        onPress={() => SetRejectPop(true)}
        // onPress={() => handleAction('reject')}
        color={CustomThemeColors.primary}
      />
      <CustomModal
        isVisible={isRejectPop}
        onClose={toggleModal}
        title="Reject"
        subBtn={'Submit'}
        // subBtnAction={() => console.log('Response:')}>
        subBtnAction={() => {
          updateMessage(value);
          handleAction('reject');
          toggleModal();
        }}>
        {/* Children Content */}
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
    margin: 20,
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
});

export default ApproveRejectComponent;
