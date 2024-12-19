const KeyValueJoiner = async (headers, values, excludedIndexes, setData) => {
  // Check if values is an empty or invalid array
  if (!values || values.length < 1) {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = ''; // Set empty values for each header
    });

    console.log('Empty values::', emptyResult);
    setData(emptyResult);
    return;
  }

  // If values is a valid array with data
  if (values && Array.isArray(values) && values.length > 0) {
    const result = values.map(innerArray => {
      // Filter out the excluded indexes
      const filteredRow = innerArray.filter(
        (_, index) => !excludedIndexes.includes(index),
      );

      // Map the filtered row to the headers
      return headers.reduce((acc, header, index) => {
        // Ensure the filtered row does not exceed the number of headers
        acc[header] =
          filteredRow[index] !== undefined ? filteredRow[index] : 0.0;
        return acc;
      }, {});
    });

    console.log('Processed Table Data:', result);
    setData(result);
  } else {
    // If the data is invalid, return empty values for all headers
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = ''; // Set empty for each header
    });

    console.log('Returning empty data due to invalid response:', emptyResult);
    setData(emptyResult);
  }
};

export default KeyValueJoiner;
