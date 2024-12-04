export const ReqBodyRejConv = (
  inputArray,
  transId,
  currentLevel,
  transName,
) => {
  // Check the input array structure and log for debugging
  // if (!inputArray || inputArray.length < 2) {
  //   console.error('inputArray is not valid or is too short:', inputArray);
  //   return null; // Return null or handle error appropriately
  // }

  // Log the input array and relevant details
  console.log('inputArray:', JSON.stringify(inputArray));
  const BnkAcNo = inputArray[1]?.ACCOUNT_NO || 'N/A'; // Use optional chaining to prevent errors
  let paymentId = 0; // Initialize paymentId with a default value

  if (inputArray[2] && inputArray[2][0]) {
    console.log('Payment ID:', inputArray[2][0].PAYMENT_ID);
    paymentId = inputArray[2][0].PAYMENT_ID; // Assign the value if it exists
  } else {
    console.log('Payment ID not found');
  }

  const tranObjectData = inputArray;
  const paymentDetails = inputArray[2] || {};
  const additionalInfo = inputArray[3] || {};
  const miscDetails = inputArray[7] || {};
  const taxInfo = inputArray[9] || [];

  console.log('Bank Account Number:', BnkAcNo);

  // Construct the request body
  return {
    app_id: 3,
    trans_id: transId,
    bankAccNo: BnkAcNo,
    tranObject: inputArray,
    chqStatus: '',
    payment_id: paymentId,
    user_id: 'admin',
    message: 'test',
    handler: 'MakePayment',
    trans_type: transName,
    gui_current_level: currentLevel,
  };
};
