import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native'; // To detect if component is focused
import {API_URL} from '../ApiUrl';
import {GetFileExtension} from './smallcomponents/GetFileExtension';
import {requestStoragePermission} from './requestStoragePermission';
import {
  NotifierWrapper,
  Notifier,
  NotifierComponents,
} from 'react-native-notifier';

// import downloadNotificationImage from '../assets/previewimages/word.png';
import imagePreviewImage from '../assets/previewimages/image.png';
import pdfPreviewImage from '../assets/previewimages/download-pdf.png';
import wordPreviewImage from '../assets/previewimages/word.png';
import excelPreviewImage from '../assets/previewimages/excel.png';
import textPreviewImage from '../assets/previewimages/txt.png';
import videoPreviewImage from '../assets/previewimages/download-video.png';
import AudioPreviewImage from '../assets/previewimages/audio.png';
import generalDownloadImage from '../assets/previewimages/general-download.png';
import {CustomThemeColors} from '../CustomThemeColors';
import CustomProgressBar from './smallcomponents/CustomProgressBar';
const renderFileContent = ({message, sender, isUploading, uploadProgress}) => {
  if (uploadProgress > 0) {
    console.log(
      `uploadProgress for ${message.metaData?.fileName} 689086989486984j490: `,
      uploadProgress,
    );
  }

  //   console.log(
  //     'message recieved in renderFileCmponent : 587835387587384',
  //     message,
  //     'sender recieved in renderFileCmponent : 587835387587966732hg387227',
  //     sender,
  //   );
  const [fileExists, setFileExists] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const isOwnMessage = message.sender === sender;
  const isFocused = useIsFocused(); // Helps to trigger updates when screen is focused
  const [imageError, setImageError] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false); // State to track downloading status
  const downloadDirectory =
    Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/HarnessERP` //for android
      : `${RNFS.DownloadDirectoryPath}/HarnessERP`; //for ios, or other

  useEffect(() => {
    // Check if the file exists locally
    const checkFileExists = async () => {
      if (message.metaData && message.metaData.senderFilePath) {
        const fileExistsOnSystem = await RNFS.exists(
          message.metaData.senderFilePath,
        );
        setFileExists(fileExistsOnSystem);
      }
    };

    // Re-run the check when the screen is focused
    if (isFocused) {
      checkFileExists();
    }
  }, [isFocused, message]);

  const showDownloadToast = () => {
    // Showing toast when button is pressed while disabled
    console.log('SHowing toast...for download...9866546459389058390543');
    ToastAndroid.showWithGravity(
      `Downloading... ${message.metaData.fileName}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  function getPreviewImage(fileType) {
    if (fileType.startsWith('image/')) {
      return imagePreviewImage; // Directly use the image URI
    } else if (fileType === 'application/pdf') {
      return pdfPreviewImage;
    } else if (
      fileType === 'application/msword' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return wordPreviewImage;
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return excelPreviewImage;
    } else if (fileType === 'text/plain') {
      return textPreviewImage;
    } else if (fileType.startsWith('video/')) {
      return videoPreviewImage;
    } else if (fileType.startsWith('audio/')) {
      return AudioPreviewImage;
    }

    return generalDownloadImage; // Default case if no type matches
  }

  // Handle file download
  // const downloadFile = async () => {
  //   try {
  //     const hasPermission = await requestStoragePermission();
  //     if (hasPermission) {
  //       const folderExists = await RNFS.exists(downloadDirectory);
  //       if (!folderExists) {
  //         await RNFS.mkdir(downloadDirectory); // Create the directory if it doesn't exist
  //         console.log('Folder created: ', downloadDirectory);
  //       }

  //       const fileUrl = `${API_URL}${message.metaData.fileUrl}`;
  //       showDownloadToast();
  //       setIsDownloading(true);
  //       const response = await axios.get(fileUrl, {responseType: 'json'});
  //       // console.log('85258290890234', response);
  //       const filePath = `${downloadDirectory}/${message.metaData.fileName}`;

  //       const blobData = response.data.data;
  //       // console.log('base64Data : 5390583859035903 : ', blobData);
  //       const fileName = response.data.fileName;
  //       const fileType = response.data.fileType;
  //       console.log('fileType : 8498293842490298428', fileType);
  //       // // Define the path for the text file
  //       // const txtFilePath = `${downloadDirectory}/base64Data.txt`;

  //       // // Write the base64 data to the text file
  //       // await RNFS.writeFile(txtFilePath, blobData, 'utf8');
  //       // Alert.alert('Base64 data saved to base64Data.txt');

  //       // Write file to download directory
  //       await RNFS.writeFile(filePath, blobData, 'base64');
  //       const notifierId = `download-${message.messageId}`;
  //       Notifier.showNotification({
  //         title: `Download Completed`,
  //         description: `${fileName} has been downloaded successfully. File available at : ${filePath}`,
  //         duration: 5000, // Duration in milliseconds
  //         Component: NotifierComponents.Notification,
  //         componentProps: {
  //           imageSource: getPreviewImage(fileType),
  //         },
  //         id: `${notifierId}-downloadComplete`, // Use a unique ID for completion notification
  //       });
  //       setIsDownloading(false);
  //       setFileDownloaded(true);

  //       //   if (isOwnMessage) {
  //       //     // Update the senderFilePath in the DB
  //       //     await axios.post(
  //       //       `${API_URL}/api/noticeBoard/updateSenderFilePath/${message.metaData.fileId}/${sender}`,
  //       //       {
  //       //         senderFilePath: filePath,
  //       //       },
  //       //     );
  //       //   }

  //       // Alert.alert('File downloaded successfully in this file path', filePath);
  //     } else {
  //       console.log('Storage permission denied');
  //       Alert.alert(
  //         'permission denied',
  //         `Permission denied for copying or writing the file on your device`,
  //       );
  //     }
  //   } catch (error) {
  //     Alert.alert('Error downloading file', error.message);
  //     Alert.alert(
  //       'Error downloading file',
  //       'Unexpected error happened while downloading the file.',
  //     );
  //   }
  // };
  const downloadFile = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Permission denied for writing the file on your device.',
        );
        return;
      }

      // Check if directory exists, if not create it
      const folderExists = await RNFS.exists(downloadDirectory);
      if (!folderExists) {
        await RNFS.mkdir(downloadDirectory);
        console.log('Folder created: ', downloadDirectory);
      }

      const fileUrl = `${API_URL}${message.metaData.fileUrl}`;
      // showDownloadToast();
      setIsDownloading(true);

      // Make a GET request to download the file
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        onDownloadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setDownloadProgress(percentCompleted);
          console.log(`Download progress: ${percentCompleted}%`);
        },
      });

      const filePath = `${downloadDirectory}/${message.metaData.fileName}`;
      const fileType = response.headers['filetype'];
      const blobData = response.data;

      console.log('File type detected: ', fileType);

      // Read the Blob and convert it to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1]; // Extract base64 part from the result
        await RNFS.writeFile(filePath, base64Data, 'base64'); // Save the file in base64 format
        console.log('File successfully saved to: ', filePath);

        // Show notification on completion
        const notifierId = `download-${message.messageId}`;
        Notifier.showNotification({
          title: `Download Completed`,
          description: `${message.metaData.fileName} has been downloaded successfully. File available at: ${filePath}`,
          duration: 5000,
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: getPreviewImage(fileType),
          },
          id: `${notifierId}-downloadComplete`,
        });

        setIsDownloading(false);
        setFileDownloaded(true);
      };

      reader.readAsDataURL(blobData); // Convert the Blob to base64
    } catch (error) {
      console.error('Download failed:', error.message);
      setIsDownloading(false);
      Alert.alert(
        'Download Failed',
        'An unexpected error occurred while downloading the file.',
      );
    }
  };
  // Open file with associated apps
  const openFile = async filePath => {
    try {
      await FileViewer.open(`file://${filePath}`, {
        displayName: 'Please choose the associated app',
        showOpenWithDialog: true,
      });
    } catch (error) {
      let errorMessage;

      // Handle specific error cases
      switch (error.code) {
        case 'ENOENT':
          errorMessage =
            'File not found. Please check the file path and try again.';
          break;
        case 'EACCES':
          errorMessage =
            'Permission denied. Please check your app permissions.';
          break;
        default:
          if (error.message.includes('No app associated')) {
            const fileType = GetFileExtension(filePath) || 'unknown';
            errorMessage = `No associated app found to handle this file type (${fileType}) on your device. Please download an appropriate app.`;
          } else if (error.message.includes('Invalid file path')) {
            errorMessage = `Invalid file path provided: ${filePath}`;
          } else {
            errorMessage =
              'An unexpected error occurred while trying to open the file.';
          }
      }

      // Log the detailed error for debugging
      console.error('Error opening file:', error);

      // Display a user-friendly alert
      Alert.alert('Cannot open the file', errorMessage);
    }
  };

  // const openFile = async filePath => {
  //   const fileExtension = GetFileExtension(filePath);

  //   try {
  //     console.log(fileExtension, '09539059034 fileExtension');
  //     if (fileExtension === '.pdf - PDF Document') {
  //       // Check if it's a PDF and try to open using Linking
  //       const fileUrl = `file://${filePath}`;
  //       const supported = await Linking.canOpenURL(fileUrl);

  //       if (supported) {
  //         await Linking.openURL(fileUrl);
  //       } else {
  //         throw new Error('No app available to open PDF');
  //       }
  //     } else {
  //       // Handle other file types with FileViewer
  //       await FileViewer.open(filePath, {showOpenWithDialog: true});
  //     }
  //   } catch (error) {
  //     console.log('Error opening file: 463653454353xfe', error);
  //     Alert.alert(
  //       'Cannot open the file',
  //       `Cannot open the file at path: ${filePath}\n\nPlease ensure an appropriate app is installed on your device to open (${GetFileExtension(
  //         filePath,
  //       )}) files.`,
  //     );
  //   }
  // };

  // Function to extract file extension
  const GetFileExtension1 = filePath => {
    return filePath.split('.').pop();
  };

  // const openFile = async filePath => {
  //   try {
  //     const fileExists = await RNFS.exists(filePath);

  //     if (!fileExists) {
  //       console.error('File does not exist at path:', filePath);
  //       return;
  //     }

  //     // If the platform is iOS, we can directly use FileViewer
  //     if (Platform.OS !== 'ios') {
  //       await FileViewer.open("/storage/emulated/0/Download/Document 10.pdf", {showOpenWithDialog: true});
  //     } else {
  //       // For Android, we can use the Share package to show apps that can open the file
  //       await Share.open({
  //         url: `file://${filePath}`,
  //         type: 'application/*', // Use a generic type to show all apps that can open the file
  //         showAppsToView: true, // Ensures that apps for viewing the file are shown
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error opening file:', error);
  //   }
  // };

  const filePath = `file://${message.metaData.senderFilePath}`;
  const renderFilePreview = () => {
    if (!message.metaData || message.metaData.fileName === null) {
      return (
        <View>
          {isOwnMessage ? (
            <Text>File not available, Please upload it again.</Text>
          ) : (
            <Text>File not available, ask the sender to resend it.</Text>
          )}
        </View>
      );
    }

    if (fileExists || fileDownloaded) {
      const fileType = message.metaData.fileType.split('/')[0];
      if (fileType === 'image') {
        return (
          <View>
            {!imageError ? (
              <TouchableOpacity
                onPress={() => openFile(filePath)}
                style={{margin: 10, borderRadius: 10, overflow: 'hidden'}} // Ensure child elements respect the border radius
              >
                <Image
                  source={{uri: filePath}}
                  style={{width: 200, height: 200, borderRadius: 10}} // Set borderRadius for the image
                  resizeMode="contain"
                  onError={error => {
                    console.log('image error: 89757285892 : ', error);
                    setImageError(true);
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Text>No file available</Text>
            )}
          </View>
        );
      } else if (!fileType === 'image') {
        return (
          <Text
            style={{color: 'blue'}}
            onPress={() =>
              openFile(`${downloadDirectory}/${message.metaData.fileName}`)
            }>
            Open
          </Text>
        );
      } else {
        return (
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: '20%',
              padding: 0,

              alignItems: 'center',
            }}>
            {!imageError && (
              <View style={{padding: 10}}>
                <Image
                  source={getPreviewImage(message.metaData.fileType)}
                  style={{width: 100, height: 100, borderRadius: 10}} // Set borderRadius for the image
                  resizeMode="contain"
                  onError={error => {
                    console.log('image error: 89757285892 : ', error);
                    setImageError(true);
                  }}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() =>
                openFile(`${downloadDirectory}/${message.metaData.fileName}`)
              }
              style={{
                backgroundColor: CustomThemeColors.primary,
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
                Open File
              </Text>
            </TouchableOpacity>
            {isUploading && uploadProgress > 0 && (
              <View style={{width: '100%'}}>
                <CustomProgressBar
                  progress={uploadProgress}
                  label="Uploading..."
                />
              </View>
            )}
          </View>
        );
      }
    }

    // If file doesn't exist or needs to be downloaded
    return (
      <View>
        {/* <Text style={{marginVertical: 10}}>
          {isOwnMessage
            ? 'File not available. Download it below.'
            : 'File not available. Download it below.'}
        </Text> */}
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: '20%',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={downloadFile}
            style={{
              backgroundColor: CustomThemeColors.primary,
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}>
            <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
              {isDownloading ? 'Downloading...' : 'Download'}
            </Text>
          </TouchableOpacity>

          {isDownloading && <CustomProgressBar progress={downloadProgress} />}
          <View style={styles.progressContainer}></View>
          {/* <Button title="Download" onPress={downloadFile} /> */}
        </View>
      </View>
    );
  };

  return <View>{renderFilePreview()}</View>;
};

export default renderFileContent;

const styles = StyleSheet.create({
  // progressContainer: {
  //   height: 20,
  //   width: '20%',
  //   backgroundColor: '#e0e0e0',
  //   borderRadius: 10,
  //   overflow: 'hidden',
  // },
  // progressBar: {
  //   height: '100%',
  //   borderRadius: 10,
  // },
});
