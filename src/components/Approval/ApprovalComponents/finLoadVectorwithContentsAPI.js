import {useEffect} from 'react';
import {API_URL} from '../../ApiUrl';

export const useFinLoadVectorwithContentsAPI = async (query, setResult) => {
  try {
    console.log('FinloadContent111 result:',query);
    const response = await fetch(
      `${API_URL}/api/common/finLoadVectorwithContentsjson`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query), // Send the query in the request body
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('FinloadContent result:', result);
    setResult(result);
  } catch (err) {
    console.error('Fetch error:', err);
    setResult(null); // Handle errors by resetting the result
  }
};

console.log('FinloadContent--- result:');
// if (query) {
// }
