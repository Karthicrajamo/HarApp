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
const FetchValueAssignKeysAPIDoubleArray = async (
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

    // Validate and process the API response
    if (
      response.data &&
      response.data.result &&
      typeof response.data.result === 'string'
    ) {
      // Deserialize the stringified JSON in the result field
      const parsedResult = JSON.parse(response.data.result);
      console.log('parsedResultdata:', parsedResult);

      if (Array.isArray(parsedResult) && parsedResult.length > 0) {
        // Flatten the parsed result if it's a nested array
        const flattenedResult = parsedResult.flat();

        // Map the flattened data to headers while excluding specific indices
        const result = flattenedResult.map(innerArray => {
          const filteredRow = innerArray.filter(
            (_, index) => !excludedIndexes.includes(index),
          );

          // Map the filtered row to the headers
          return headers.reduce((acc, header, index) => {
            acc[header] =
              filteredRow[index] !== undefined ? filteredRow[index] : 0.0;
            return acc;
          }, {});
        });

        console.log('Processed Table Data:', result);
        setData(result);
      } else {
        console.error(`Invalid parsed result:`, apiUrl, parsedResult);

        const emptyResult = [{}];
        headers.forEach(header => {
          emptyResult[0][header] = '';
        });

        console.log(
          'Returning empty data due to invalid parsed result:',
          emptyResult,
        );
        setData(emptyResult);
      }
    } else {
      console.error(`Invalid response data:`, apiUrl, response.data);

      const emptyResult = [{}];
      headers.forEach(header => {
        emptyResult[0][header] = '';
      });

      console.log('Returning empty data due to invalid response:', emptyResult);
      setData(emptyResult);
    }
  } catch (error) {
    console.error('Error fetching table data:', error);

    const emptyResult = [{}];
    headers.forEach(header => {
      emptyResult[0][header] = '';
    });

    console.log('Returning empty data due to error:', emptyResult);
    setData(emptyResult);
  }
};

export default FetchValueAssignKeysAPIDoubleArray;
