import axios from 'axios';
import { API_URL } from '../../ApiUrl';

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
  if (!apiUrl || apiUrl.trim() === '') {
    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = ''; 
    });
    console.log('Empty API response, returning empty data:', emptyResult);
    setData(emptyResult);
    return;
  }

  try {
    console.log('Advance adjust::', params);
    console.log('Advance adjust method::', method);

    const response =
      method.toUpperCase() === 'POST'
        ? await axios.post(apiUrl, params)
        : await axios.get(apiUrl, { params });

    console.log('Adv response.data:', response.data);

    if (
      response.data &&
      Array.isArray(response.data[0]) &&
      response.data[0].length > 0
    ) {
      // Process all arrays within response.data[0]
      const processedData = response.data[0].map(apiResponse => {
        apiResponse.push(...inc); 

        console.log('Processing each row:', apiResponse);

        // Step 1: Filter based on excludedIndexes
        const filteredRow = apiResponse.filter(
          (_, index) => !excludedIndexes.includes(index)
        );

        // Step 2: Map filtered row to headers
        const result = headers.reduce((acc, header, index) => {
          acc[header] = filteredRow[index] !== undefined ? filteredRow[index] : 0.0;
          return acc;
        }, {});

        return result;
      });

      console.log('Final Processed Data:', processedData);
      setData(processedData);
    } else {
      const emptyResult = [{}];
      headers.forEach(header => {
        emptyResult[0][header] = '';
      });

      console.log('Returning empty data due to invalid response:', emptyResult);
      setData(emptyResult);
    }
  } catch (error) {
    console.error('API Fetch Error:', error);

    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = '';
    });

    setData(emptyResult);
  }
};

export default AdvanceAdjApi;
