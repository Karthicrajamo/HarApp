import axios from 'axios';

/**
 * Fetch data from an API, process it to exclude specific indices, and map it to headers.
 * @param {string} apiUrl - The API URL to fetch data from.
 * @param {Array<string>} headers - Array of headers to map the data to.
 * @param {Array<number>} excludedIndexes - Array of indexes to exclude from the data.
 * @param {Function} setData - Callback function to set the processed data.
 * @param {Object} [params={}] - Optional parameters for the API request.
 * @param {string} [method='GET'] - HTTP method for the request ('GET' or 'POST').
 */
const FetchValueAssignKeysAPIDoubleArray = async (
  apiUrl,
  headers,
  excludedIndexes = [],
  setData,
  params = {},
  method = 'GET',
) => {
  // Check if the API URL is empty or undefined
  if (!apiUrl || apiUrl.trim() === '') {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = ''; // Set empty values for headers
    });
    console.warn('Empty API URL, returning empty data:', emptyResult);
    setData(emptyResult);
    return;
  }

  try {
    // Perform GET or POST request based on the method
    console.log('API params:', params);
    const response =
      method.toUpperCase() === 'POST'
        ? await axios.post(apiUrl, params) // POST request
        : await axios.get(apiUrl, {params}); // GET request

    console.log('API Response:', response.data);

    const data = response.data;

    // Check if response contains valid data
    if (data && data.result) {
      console.log('start Result:');

      // Assuming `data.result` is already a valid array
      // const parsedResult = data.result; // No need for JSON.parse
      // console.log('Parsed Result:', parsedResult);
      // console.log('Parsed Result[0]:', parsedResult[0]);
      const parsedResult = JSON.parse(data.result);
      console.log('Parsed Result:', parsedResult);

      // Access the second array
      const targetData = parsedResult[1]; // Extract the second sub-array
      console.log('Target Data:', targetData);

      // Flatten the result if it's a nested array
      // const flattenedResult = parsedResult.flat(Infinity);
      // console.log('Flattened Result:', flattenedResult);

      // Ensure `parsedResult` is an array
      if (Array.isArray(targetData) && targetData.length > 0) {
        const result = targetData.map(innerArray => {
          const filteredRow = innerArray.filter(
            (_, index) => !excludedIndexes.includes(index),
          );

          // Map the filtered row to headers
          return headers.reduce((acc, header, index) => {
            acc[header] =
              filteredRow[index] !== undefined ? filteredRow[index] : '';
            return acc;
          }, {});
        });

        console.log('Processed Data:', result);
        setData(result);
      } else {
        // console.error('Invalid parsed result format:', parsedResult);
        setData(generateEmptyResult(headers));
      }
    } else {
      // console.error('Unexpected API response format:', response.data);
      setData(generateEmptyResult(headers));
    }
  } catch (error) {
    console.error('Error fetching API data:', error.message);
    setData(generateEmptyResult(headers));
  }
};

/**
 * Generate an empty result structure based on headers.
 * @param {Array<string>} headers - Headers for the result structure.
 * @returns {Array<Object>} Empty result array.
 */
const generateEmptyResult = headers => {
  const emptyResult = [{}];
  headers.forEach(header => {
    emptyResult[0][header] = ''; // Default to empty strings for each header
  });
  return emptyResult;
};

export default FetchValueAssignKeysAPIDoubleArray;
