export const ReqBodyConv = async (inputJson,transId,currentLevel,transName) => {
    return {
        trans_id: transId,
        app_id: 3,
        tranObject: [
            ...inputJson.transobj.slice(0, 6), // First six elements of transobj
            inputJson.transobj[6],           // "admin"
            inputJson.transobj[7],           // Empty array
            inputJson.transobj[8],           // Keyed object
            ...inputJson.transobj.slice(9, 15) // Remaining elements from index 9 to 14
            // ,null
        ],
        message: "Approved",
        data_vec: [
            ...inputJson.transobj.slice(0, 6) // Similar structure as tranObject but stops at index 6
        ],
        company_id: 1,
        handler: transName,
        gui_current_level: currentLevel
    };
  };
  