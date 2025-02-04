export const ReqBodyConv = async (
  inputJson,
  transId,
  currentLevel,
  transName,
  payment,totalNoOfLevels
) => {
  if (payment === 'Bills Payment') {
    console.log("CancelPayment::",transName)
    return {
      trans_id: transId,
      app_id: 3,
      tranObject: [
        ...inputJson.transobj.slice(0, 6), // First six elements of transobj
        inputJson.transobj[6], // "admin"
        inputJson.transobj[7], // Empty array
        inputJson.transobj[8], // Keyed object
        ...inputJson.transobj.slice(9, 15), // Remaining elements from index 9 to 14
        // ...(transName !== "CancelPayment" && [null]) 
         ...(transName !== "CancelPayment" ? [null] : []), // Add null conditionally

        // null,
      ],
      message: 'Approved',
      data_vec: [
        ...inputJson.transobj.slice(0, 6), // Similar structure as tranObject but stops at index 6
      ],
      company_id: 1,
      handler: 'MakePayment',
      //   handler: transName,
      gui_current_level: currentLevel,
    };
  } else if (payment === 'Advance Payment') {
    return {
      trans_id: transId,
      app_id: 3,
      tranObject: [
        ...inputJson.transobj.slice(0, 6), // First six elements of transobj
        inputJson.transobj[6], // "admin"
        inputJson.transobj[7], // Empty array
        inputJson.transobj[8], // Keyed object
        ...inputJson.transobj.slice(9, 15), // Remaining elements from index 9 to 14
        // ...(payment === 'Bills Payment' && [null])
        // null,
      ],
      message: 'Approved',
      data_vec: [
        ...inputJson.transobj.slice(0, 6), // Similar structure as tranObject but stops at index 6
        // ...inputJson.transobj[14]
      ],
      company_id: 1,
      handler: transName,
      gui_current_level: currentLevel,
    };
  }
};
