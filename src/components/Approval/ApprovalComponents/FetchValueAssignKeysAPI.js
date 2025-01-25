import axios from 'axios';

/**
 * Fetch data from an API, process it to exclude specific indices, and map it to headers.
 * @param {string} apiUrl - The API URL to fetch data from.
 * @param {Array<string>} headers - Array of headers to map the data to.
 * @param {Array<number>} excludedIndexes - Array of indexes to exclude from the data.
 * @param {Function} setData - Callback function to set the processed data.
 * @param {Object} [params] - Optional parameters for the API request.
 * @param {string} [method='GET'] - HTTP method for the request ('GET' or 'POST').
 */
const FetchValueAssignKeysAPI = async (
  apiUrl,
  headers,
  excludedIndexes,
  setData,
  params = {},
  method = 'GET',
) => {
  // Check if the API URL is empty or undefined
  if (!apiUrl || apiUrl.trim() === '') {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = ''; // Set value as empty for each header
    });

    console.log('Empty API response, returning empty data:', emptyResult);
    setData(emptyResult);
    return;
  }

  try {
    // Choose GET or POST request based on the method
    const response =
      method.toUpperCase() === 'POST'
        ? await axios.post(apiUrl, params) // POST request with body
        : await axios.get(apiUrl, {params}); // GET request with query params

    // Validate the API response
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      const apiResponse = response.data;

      console.log('apiResponse valueApi:', apiUrl + '-----', apiResponse);
      // Process the API response
      const result = apiResponse.map(innerArray => {
        const filteredRow = innerArray.filter(
          (_, index) => !excludedIndexes.includes(index),
        );

        // Map the filtered row to the headers
        return headers.reduce((acc, header, index) => {
          acc[header] = filteredRow[index] || 0.0; // Use default if undefined
          return acc;
        }, {});
      });

      console.log('Processed Table Data:', apiUrl + '-----', result);
      setData(result);
    } else {
      // console.error(`Invalid response data:`, apiUrl);

      const emptyResult = [{}];
      headers.forEach(header => {
        emptyResult[0][header] = '';
      });

      console.log('Returning empty data due to invalid response:', apiUrl);
      setData(emptyResult);
    }
  } catch (error) {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = '';
    });
    // console.error(`Invalid response data:`, apiUrl);

    setData(emptyResult);
  }
};

export default FetchValueAssignKeysAPI;
