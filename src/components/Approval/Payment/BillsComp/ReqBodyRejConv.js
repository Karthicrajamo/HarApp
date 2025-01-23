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
  const inpArray = [...inputArray];
  inpArray.push(null);

  console.log('inputArray:', JSON.stringify(inpArray));
  const BnkAcNo = inpArray[1]?.ACCOUNT_NO || 'N/A'; // Use optional chaining to prevent errors
  let paymentId = 0; // Initialize paymentId with a default value

  if (inpArray[2] && inpArray[2][0]) {
    console.log('Payment ID:', inpArray[2][0].PAYMENT_ID);
    paymentId = inpArray[2][0].PAYMENT_ID; // Assign the value if it exists
  } else {
    console.log('Payment ID not found');
  }

  const tranObjectData = inpArray;
  const paymentDetails = inpArray[2] || {};
  const additionalInfo = inpArray[3] || {};
  const miscDetails = inpArray[7] || {};
  const taxInfo = inpArray[9] || [];

  console.log('Bank Account Number:', BnkAcNo);

  // Construct the request body
  return {
    app_id: 3,
    trans_id: transId,
    bankAccNo: BnkAcNo,
    tranObject: inpArray,
    chqStatus: 'Re-Use',
    payment_id: paymentId,
    user_id: 'admin',
    message: 'test',
    handler: 'MakePayment',
    trans_type: transName,
    gui_current_level: currentLevel,
  };
};
