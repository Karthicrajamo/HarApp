import axios from 'axios';
import {sharedData} from '../../../Login/UserId';
import * as Keychain from 'react-native-keychain';
import {ToastAndroid} from 'react-native';
import {API_URL} from '../../../ApiUrl';
import {Alert} from 'react-native';

// const updateAddRejectPayStatus = async () => {
//     console.log('Rejection Succfull, tryig to updateRejectPayStatus...');
//     try {
//       const currentUserIdObject = await Keychain.getGenericPassword({
//         service: 'loggedInUserId',
//       });

//       const currentUserId = currentUserIdObject.password;
//       const requestUpdateRejectPayStatus = {
//         trans_id: transId,
//         tranObject: await prepareTransObjectForAddUpdateRejectPayStatus(
//           approvalDetails?.transobj,
//         ),
//         user_id: currentUserId,
//         trans_type: transName,
//       };
//       const parameters =
//         chequeStatus.length === 0
//           ? 'noData'
//           : `${chequeStatus.current[0]?.[0] || 'null'},${
//               userChequeOpinion.current
//             },${chequeStatus.current[0]?.[1] || 'null'},`;
//       console.log(
//         '8783274828dsdd74782 : ',
//         parameters,
//         'chequeStatus : 8597578329afssfs0 : ',
//         chequeStatus,
//         'userChequeOpinion 786582h5974589 : ',
//         userChequeOpinion,
//       );

//       setIsLoading(true);
//       const credentials = await Keychain.getGenericPassword({service: 'jwt'});
//       const token = credentials.password;
//       console.log(
//         '90859dqq893gdgl',
//         `http://192.168.0.107:8100/rest/approval/updateRejectPayStatus/${parameters}`,
//       );
//       const response = await fetch(
//         `http://192.168.0.107:8100/rest/approval/updateRejectPayStatus/${parameters}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `${token}`,
//           },
//           body: JSON.stringify(requestUpdateRejectPayStatus),
//         },
//       );

//       if (!response.ok) {
//         setIsLoading(false);
//         Alert.alert('Something went wrong', 'Please try again later.');
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(
//         '896363kmkmllsdgsskjlkj92393 : ===============>>>>>>>>>> ',
//         data,
//       );
//       console.log('UpdateAddRejectPayStatus success.');

//     } catch (error) {
//       console.error('FAILED: UpdateRejectPayStatus Failed.', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

export const getUpdateCheckStatus = async (
  transName,
  paymentId,
  bankAccountNo,
  refNo,
  paymentMode,
  currentLevel,
) => {
  // Log the API request URL for debugging purposes
  // console.log(
  //   'API URL:',
  //   `http://192.168.0.107:8100/rest/approval/getupdateChequeStatus?isFinalLevel=${
  //     currentLevel == 0 ? false : true
  //   }&isReject=${true}&transType=${transName}&payment_id=${paymentId}&bankAccNo=${bankAccountNo}&chqStatusdef=${''}&chqNo1=${refNo}&payment_mode=${paymentMode}`,
  // );

  try {
    // Perform the GET request using axios
    const response = await axios.get(
      `${API_URL}/api/approval/payment/getupdateChequeStatus?isFinalLevel=${
        currentLevel == 0 ? false : true
      }&isReject=${true}&transType=${transName}&payment_id=${paymentId}&bankAccNo=${bankAccountNo}&chqStatusdef=${''}&chqNo1=${refNo}&payment_mode=${paymentMode}`,
    );

    // Handle the successful response
    console.log('API succeeded with data: ReUse', response.data);
    // You can process or use `response.data` here
    // Example: setting state or handling the result as per your requirements
    // chequeStatus.current = response.data;
    return response.data[0];
  } catch (error) {
    // Handle errors (e.g., network issues, non-2xx status codes)
    console.error('API failed with error:', error);
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
) => {
  console.log('Rejection Successful, tryig to updateRejectPayStatus...');
  try {
    // const currentUserIdObject = await Keychain.getGenericPassword({
    //   service: 'loggedInUserId',
    // });
    // const checkStatus = await getUpdateCheckStatus(
    //   transName,
    //   paymentId,
    //   bankAccountNo,
    //   refNo,
    //   paymentMode,currentLevel
    // );

    // requestUpdateRejectPayStatus(transValue)

    // const currentUserId = currentUserIdObject.password;
    const requestUpdateRejectPayStatus = {
      trans_id: transId,
      tranObject: transValue,

      user_id: sharedData.userName,
      trans_type: transName,
    };
    // const userChequeOpinionLoc = userChequeOpinion;
    console.log('checkStatus:::' + JSON.stringify(checkStatus._j[0], null, 2));
    const parameters =
      checkStatus._j.length === 0
        ? 'noData'
        : `${checkStatus._j[0] || 'null'},${action},${
            checkStatus._j[1] || 'null'
          },${checkStatus._j[2] || 'null'},`;

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
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestUpdateRejectPayStatus),
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
    console.log('urldd::', url);
    // const sanitizedParams = appRejParams.replace(/\\"/g, '"'); // Replace escaped quotes with regular quotes

    // // Parse the sanitized JSON string
    // const parsedParams = JSON.parse(sanitizedParams);
    console.log('appRejParams::', appRejParams);
    console.log('appRejParams::', JSON.stringify(appRejParams));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(appRejParams), // Convert the body to a JSON string
    });
    console.log('response ApRejCom::', response);

    if (response.ok) {
      const data = await response.json();
      ToastAndroid.show('Reject Successfully', ToastAndroid.SHORT);
      console.log('Response:', data);
    } else {
      ToastAndroid.show('Rejection Failed', ToastAndroid.SHORT);
    }
    navigation.navigate('ApprovalMainScreen');
  } catch (error) {
    console.error('Error:', error);
    ToastAndroid.show('Rejection reuse Failed', ToastAndroid.SHORT);
  }
};

// const prepareTransObjectForModUpdateRejectPayStatus = async transobj => {
//   if (!transobj) return [];

//   // Extract existing sections from the input object (second structure).
//   const paymentId = transobj[0];
//   const metadata = transobj[1];
//   const relatedDocs = transobj[2];
//   const paymentDetails = transobj[3];
//   const summary = transobj[8];

//   // Define repeated sections.
//   const repeatedSections = [
//     metadata,
//     relatedDocs,
//     paymentDetails,
//     null,
//     {},
//     'admin',
//     [],
//     summary,
//   ];

//   const desiredStructure = [paymentId, ...repeatedSections, [], []];

//   return desiredStructure;
// };
