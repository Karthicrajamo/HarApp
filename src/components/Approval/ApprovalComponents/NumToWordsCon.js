import axios from 'axios';
import { API_URL } from '../../ApiUrl';

export const NumToWordsCon = async (amt, cur) => {
  try {
    console.log(
      'rupees::',
      amt,
    );console.log(
      'rupees::',
      cur,
    );
    const response = await axios.get(
      `${API_URL}/api/common/getAmountInWords?amount=${amt}&currency=${cur}`,
      // `http://192.168.0.107:8100/rest/approval/getAmountInWords?amount=${amt}&currency=${cur}`,
    );

    if (response.status !== 200) {
      console.error('Error: Failed with status numToWord', response.status);
      return 'Error fetching data';
    }

    console.log('Num to word:', response.data.strWords);
    return response.data.strWords; // Return the word string from the response
  } catch (error) {
    console.error('Error fetching numToWord:', error);
    return 'Error fetching data';
  }
};
