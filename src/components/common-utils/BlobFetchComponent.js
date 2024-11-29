import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {API_URL} from '../ApiUrl';


export const BlobFetchComponent = async (apiurl, requestbody) => {
  try {
    // Retrieve token for authorization
    const credentials = await Keychain.getGenericPassword({ service: 'jwt' });
    if (!credentials) {
      throw new Error('Authorization credentials not found.');
    }
    const token = credentials.password;
    console.log('Token with Bearer printPdf:', token);
  

    // Make the POST request using Axios
    const response = await axios.post(apiurl, requestbody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    console.log('Response for tax payment PDF:', response);

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as blob data
    const blobData = response.data;
    console.log('Blob data:', blobData);

    const fileNameWithExtension = blobData[1];
    console.log('Extracted filename:', fileNameWithExtension);

    const fileName = fileNameWithExtension.trim().replace(/\.pdf$/, ''); // Removes the .pdf extension
    console.log('Filename without extension:', fileName);

    // Ensure the directory exists before downloading
    const { fs } = RNFetchBlob;
    const downloadDir = fs.dirs.DownloadDir; // Save to download directory
    const folderPath = `${downloadDir}/HarnessERP/`;

    if (!await RNFS.exists(folderPath)) {
      await RNFS.mkdir(folderPath);
      console.log('Folder created:', folderPath);
    }

    downloadAndViewPdf(fileName);
  } catch (error) {
    console.error('Error fetching and downloading the file:', error);
  }
};

const downloadAndViewPdf = async fileName => {
    const fileNamePrefix = 'bills_';
    try {

      // Fetch token (ensure that token exists and is valid)
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      if (!credentials) {
        throw new Error('No credentials found');
      }

      const token = credentials.password;
      const url = `${API_URL}/api/common/downloadFile/${fileName}`; // API URL

      // Use RNFetchBlob to download the file
      const {config, fs} = RNFetchBlob;
      const downloadDir = fs.dirs.DownloadDir; // Save to download directory

      console.log('Starting download from:', url);

      const folderPath = `${downloadDir}/HarnessERP`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath); // Create the directory if it doesn't exist
        console.log('Folder created: ', folderPath);
      }

      const filePath = `${downloadDir}/HarnessERP/${fileNamePrefix}${fileName}.pdf`;
      const response = await RNFetchBlob.config({
        fileCache: false, // Disable caching to force re-download every time
        appendExt: 'pdf', // Use pdf extension
        path: filePath, // Save with proper file name
      })
        .fetch('GET', url, {
        //   Authorization: `${token}`,
          'Content-Type': 'application/octet-stream', // Ensure binary stream
        })
        .progress((received, total) => {
          // Log received bytes and total bytes
          console.log(`Received: ${received}, Total: ${total}`);

          if (total > 0) {
            // Calculate and update download progress
            let progressPercent = Math.floor((received / total) * 100);
            console.log('Download progress:', progressPercent, '%');
          }
        });

      const statusCode = response.info().status;

      if (statusCode === 200) {
        // const filePath = response.path(); // Get file path after download
        // console.log('File downloaded successfully to:', filePath);

        // Optionally open the file after download (Android only)
        RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
      } else {
        console.error('Error: File download failed with status', statusCode);
      }
    } catch (error) {
      console.error('Error fetching and downloading the file:', error);
    } 
  };

// const downloadAndViewPdf = async (fileName) => {
//   const fileNamePrefix = 'ig_bills_';
//   try {
//     // Retrieve token for authorization
//     const credentials = await Keychain.getGenericPassword({ service: 'jwt' });
//     if (!credentials) {
//       throw new Error('No credentials found');
//     }

//     const token = credentials.password;
//     const url = `${API_URL}/api/common/downloadFile/${fileName}`; // API URL

//     console.log('Starting download from:', url);

//     const { fs } = RNFetchBlob;
//     const downloadDir = fs.dirs.DownloadDir; // Save to download directory
//     const folderPath = `${downloadDir}/HarnessERP`;

//     if (!await RNFS.exists(folderPath)) {
//       await RNFS.mkdir(folderPath); // Create the directory if it doesn't exist
//       console.log('Folder created:', folderPath);
//     }

//     const filePath = `${downloadDir}/HarnessERP/${fileNamePrefix}${fileName}.pdf`;

//     // Use Axios to fetch the PDF
//     const response = await axios.get(url, {
//       headers: {
//         // Authorization: token,
//         'Content-Type': 'application/octet-stream',
//       },
//       responseType: 'blob', // Important to handle binary data
//     });

//     const writeStream = await RNFS.writeFile(filePath, response.data, 'base64');
//     console.log('File written successfully:', filePath);

//     // Optionally open the file after download (Android only)
//     RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
//   } catch (error) {
//     console.error('Error downloading the file:', error);
//   }
// };
