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
const AdvanceAdjApi = async (
  apiUrl,
  headers,
  excludedIndexes,
  setData,
  params = {},
  method = 'GET',
  inc = [],
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
    console.log('Advance adjust::', params);
    console.log('Advance adjust method::', method);
    // Choose GET or POST request based on the method
    const response =
      method.toUpperCase() === 'POST'
        ? await axios.post(apiUrl, params) // POST request with body
        : await axios.get(apiUrl, {params}); // GET request with query params

    // Validate the API response
    console.log('Adv response.data:', response.data[0].length);
    if (response.data && response.data !== undefined && response.data[0].length !== 0) {
      const apiResponse = response.data[0][0];
      apiResponse.push(...inc);

      console.log('AdvAdjapiResponse valueApi:', apiResponse);
      // Process the API response
      const row = apiResponse; // Get the first row, as it's a 2D array

      // Step 1: Filter the row based on excludedIndexes
      const filteredRow = row.filter(
        (_, index) => !excludedIndexes.includes(index),
      );

      // Step 2: Map the filtered row to the headers
      const result = headers.reduce((acc, header, index) => {
        if (filteredRow[index] !== undefined) {
          acc[header] = filteredRow[index]; // Map header to value
        } else {
          acc[header] = 0.0; // Default to 0.0 if undefined
        }
        return acc;
      }, {});

      console.log('Processed Table Data: adj1', result);
      setData(result);
    } else {
      // console.error(`Invalid response data:`, apiUrl, response.data);

      const emptyResult = [{}];
      headers.forEach(header => {
        emptyResult[0][header] = '';
      });

      console.log('Returning empty data due to invalid response:', emptyResult);
      setData(emptyResult);
    }
  } catch (error) {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = '';
    });

    // setData(emptyResult);
  }
};

export default AdvanceAdjApi;
