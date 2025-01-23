import React, {useEffect, useRef, useState} from 'react';
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

const ApproveRejectComponent = ({
  approveUrl,
  rejectUrl,
  params,
  rejParams,
  setAppRejParams,
  setReUseCancel,
  paymentMode,
  setAppRejUrl,
  transName,
  currentLevel,
  totalNoOfLevels,
}) => {
  const navigation = useNavigation();
  const [isRejectPop, setRejectPop] = useState(false);
  const [value, setValue] = useState('');
  const [rejectParams, setRejectParams] = useState([]);
  const [warn, setWarn] = useState('');
  const actionAR = useRef('');
  // const [actionAR, setActionAR] = useState('');

  useEffect(() => {
    console.log('setActionAR' + actionAR.current);
  }, [actionAR]);
  useEffect(() => {
    console.log('reject update', Array.isArray(rejectParams));
    if (Array.isArray(rejectParams) == false) {
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
          onPress: () => {
            if (
              (transName == 'ModPayment' && actionAR.current === 'reject'
                ? true
                : currentLevel == totalNoOfLevels - 1) ||
              (transName == 'AddPayment' &&
                actionAR.current === 'reject' &&
                paymentMode == 'cheque') ||
              (transName == 'CancelPayment' &&
              actionAR.current !== 'reject' &&
              paymentMode == 'cheque'
                ? true
                : currentLevel == totalNoOfLevels - 1)
            ) {
              setRejectPop(true);
            }
            handleAction(action);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleAction = async action => {
    // setActionAR(action);
    console.log('params ApRejComp::', params);
    const url = action === 'approve' ? approveUrl : rejectUrl;
    const successMessage =
      action === 'approve' ? 'Approve Successfully' : 'Reject Successfully';
    const errorMessage =
      action === 'approve' ? 'Approval Failed' : 'Rejection Failed';
    console.log('rejUrl::', JSON.stringify(rejectParams));
    // console.log('rejUrl type::', rejectParams['trans_type']);
    console.log('transName type::', transName);

    // _________________________karthic 23 Jan 25 ----------------------
    if (
      (transName == 'ModPayment' && action === 'reject'
        ? true
        : currentLevel == totalNoOfLevels - 1) ||
      (transName == 'AddPayment' && action === 'reject') ||
      (transName == 'CancelPayment' && action === 'reject'
        ? false
        : currentLevel == totalNoOfLevels - 1)
    ) {
      action === 'approve'
        ? setAppRejParams(params)
        : setAppRejParams(rejectParams);
      action === 'approve' ? setAppRejUrl(approveUrl) : setAppRejUrl(rejectUrl);
    } else {
      try {
        // const response = await fetch(url, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json', // Set the content type to JSON
        //   },
        //   body: action == 'approve' ? params : JSON.stringify(rejectParams), // Convert the body to a JSON string
        // });
        console.log('response ApRejCom::', response);

        if (response.ok) {
          const data = await response.json();
          ToastAndroid.show(successMessage, ToastAndroid.SHORT);
          console.log('Response:', data);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
        navigation.navigate('ApprovalMainScreen');
        // action == 'approve' && navigation.navigate('ApprovalMainScreen');
      } catch (error) {
        console.error('Error:', error);
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.approveButton]}
        onPress={() => {
          confirmApproval('approve');
          // setActionAR('approve');
          actionAR.current = 'approve';
        }}>
        <Text style={[styles.buttonText, {color: 'white'}]}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.rejectButton]}
        onPress={() => {
          actionAR.current = 'reject';
          // if (
          //   (transName == 'ModPayment' && actionAR === 'reject'
          //     ? true
          //     : currentLevel == totalNoOfLevels - 1) ||
          //   (transName == 'AddPayment' && actionAR === 'reject') ||
          //   (transName == 'CancelPayment' && actionAR === 'reject'
          //     ? false
          //     : currentLevel == totalNoOfLevels - 1)
          // ) {
          setRejectPop(true);
          // }
          // setRejectPop(true);
          console.log('pressed;;;');
        }}>
        <Text
          style={[styles.buttonText, {color: 'white'}]}
          onPress={() => {
            // setActionAR('reject');
            actionAR.current = 'reject';
          }}>
          Reject
        </Text>
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
          if (value.length < 1) {
            setWarn('Please Enter a Reason');
          } else {
            updateMessage(value);
            // handleAction('reject');
            toggleModal();
            console.log('rejectParams PaymentMode:::' + paymentMode);
            if (
              // JSON.stringify(
              paymentMode === 'Cheque'
            ) {
              console.log(
                'rejectParams PaymentMode:::' +
                  JSON.stringify(
                    rejectParams['tranObject']?.[1]['PAYMENT_MODE'],
                  ),
              );
              setReUseCancel(true);
            }
          }
        }}>
        {/* {/ Children Content /} */}
        <Text style={styles.modalBody}>Please Enter the reason to Reject</Text>
        {warn.length > 1 && <Text style={styles.redAsterisk}>{warn}</Text>}
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
    marginBottom: 5,
    fontSize: 16,
  },
  redAsterisk: {
    color: 'red', // Set the asterisk color to red
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
