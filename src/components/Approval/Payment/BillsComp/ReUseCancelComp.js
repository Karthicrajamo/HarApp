import axios from 'axios';
import {sharedData} from '../../../Login/UserId';
import * as Keychain from 'react-native-keychain';
import {ToastAndroid} from 'react-native';
import {API_URL} from '../../../ApiUrl';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const getUpdateCheckStatus = async (
  transName,
  paymentId,
  bankAccountNo,
  refNo,
  paymentMode,
  currentLevel,
  totalNoOfLevels,
  action,
) => {
  try {
    console.log(
      'cheque status api',
      `${API_URL}/api/approval/payment/getupdateChequeStatus?isFinalLevel=${
        currentLevel == totalNoOfLevels - 1 ? true : false
      }&isReject=${
        action == 'reject' ? true : false
      }&transType=${transName}&payment_id=${paymentId}&bankAccNo=${bankAccountNo}&chqStatusdef=${''}&chqNo1=${refNo}&payment_mode=${paymentMode}`,
    );
    // Perform the GET request using axios
    const response = await axios.get(
      `${API_URL}/api/approval/payment/getupdateChequeStatus?isFinalLevel=${
        currentLevel == totalNoOfLevels - 1 ? true : false
      }&isReject=${
        action == 'reject' ? true : false
      }&transType=${transName}&payment_id=${paymentId}&bankAccNo=${bankAccountNo}&chqStatusdef=${''}&chqNo1=${refNo}&payment_mode=${paymentMode}`,
    );

    // Handle the successful response
    console.log('API succeeded with data: ReUse', response.data);
    const data = response.data[0]; // No need to stringify here if you want to process it as an object
    console.log('API succeeded with data: ReUsedata', data);

    return data; // Return the raw object instead of stringified data
  } catch (error) {
    // Handle errors (e.g., network issues, non-2xx status codes)
    console.warn('API failed with error:', error);
    // You can handle errors here (e.g., show a notification or a toast)
  }
};

export const updateModRejectPayStatus = async (
  transName,
  paymentId,
  bankAccountNo,
  refNo,
  paymentMode,
  transValue,
  transId,
  action,
  currentLevel,
  checkStatus,
  appRejParams,
  url,
  actionType,
) => {
  // const navigation = useNavigation();

  console.log('Rejection Successful, tryig to updateRejectPayStatus...');
  try {
    const requestUpdateRejectPayStatus = {
      trans_id: transId,
      tranObject: transValue,

      user_id: sharedData.userName,
      trans_type: transName,
    };
    // const userChequeOpinionLoc = userChequeOpinion;
    console.log('checkStatus:::' + JSON.stringify(checkStatus, null, 2));
    const parameters =
      checkStatus.length === 0
        ? 'noData'
        : // : `${'0220' || 'null'},${action},${
          `${checkStatus[0] || 'null'},${action},${checkStatus[1] || 'null'},${
            checkStatus[2] || 'null'
          },`;

    console.log(
      '8783274828dsdd74782 : ',
      parameters,
      //   'chequeStatus : 8597578329afssfs0 : ',
      //   chequeStatus,
      //   'userChequeOpinion 786582h5974589 : ',
      //   userChequeOpinion,
      'Parameters : ',
      JSON.stringify(requestUpdateRejectPayStatus, null, 2),
    );

    // setIsLoading(true);
    const credentials = await Keychain.getGenericPassword({service: 'jwt'});
    const token = credentials.password;
    // console.log(
    //   '90859893gdgl',
    //   `http://192.168.0.107:8100/rest/approval/updateRejectPayStatus/${parameters}`,
    // );
    const response = await fetch(
      `${API_URL}/api/approval/payment/updateRejectPayStatus/${parameters}`,
      // `http://192.168.0.107:8100/rest/approval/updateRejectPayStatus/${parameters}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `${token}`,
        },
        body:
          typeof requestUpdateRejectPayStatus === 'string'
            ? requestUpdateRejectPayStatus
            : JSON.stringify(requestUpdateRejectPayStatus),
      },
    );

    if (!response.ok) {
      // setIsLoading(false);
      Alert.alert('Something went wrong', 'Please try again later.');
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      '896363kmkmllsdgsskjlkj92393 : ===============>>>>>>>>>> ',
      data,
    );
    console.log('UpdateModRejectPayStatus success.');
  } catch (error) {
    console.error('FAILED: UpdateRejectPayStatus Failed.', error);
  }
  try {
    console.log('urldd::', actionType);
    // const sanitizedParams = appRejParams.replace(/\\"/g, '"'); // Replace escaped quotes with regular quotes

    // // Parse the sanitized JSON string
    // const parsedParams = JSON.parse(sanitizedParams);
    console.log('appRejParams::', appRejParams);
    console.log('appRejParams::', JSON.stringify(appRejParams));
    console.log(
      'appRejParams----::',
      typeof appRejParams === 'string'
        ? appRejParams
        : JSON.stringify(appRejParams),
    );
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body:
        typeof appRejParams === 'string'
          ? appRejParams
          : JSON.stringify(appRejParams), // Convert the body to a JSON string
    });
    console.log('response ApRejCom::', response);

    if (response.ok) {
      const data = await response.json();
      if (actionType == 'approve') {
        ToastAndroid.show('Approved Successfully', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Rejected Successfully', ToastAndroid.SHORT);
      }
      console.log('Response:', data);
    } else {
      if (actionType == 'approve') {
        ToastAndroid.show('Approval Failed', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Rejection Failed', ToastAndroid.SHORT);
      }
    }
    // navigation.navigate('ApprovalMainScreen');
  } catch (error) {}
};
