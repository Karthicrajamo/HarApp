// Notice baordscreen backup - 11-09-2024  - props method

import React, {useEffect, useState, useRef, useCallback} from 'react';
import SockJS from 'sockjs-client';
import {Stomp, Client} from '@stomp/stompjs';
import {TextEncoder} from 'text-encoding';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Vibration,
  BackHandler,
  Linking,
  Platform,
  PermissionsAndroid,
  PlatformConstants,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {CustomThemeColors} from './CustomThemeColors';
import UUID from 'react-native-uuid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {compareAsc, format} from 'date-fns';
import {utcToZonedTime, toZonedTime} from 'date-fns-tz';
import {API_URL} from '../components/ApiUrl';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Image} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import {writeFile, DocumentDirectoryPath} from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import mime from 'react-native-mime-types';
import PDFViewer from './PDFViewer';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  NotifierWrapper,
  Notifier,
  NotifierComponents,
} from 'react-native-notifier';
import RenderFileContent from './common-utils/renderFileContent';
import {requestStoragePermission} from './common-utils/requestStoragePermission';
import TopDisplayComponent from './common-utils/smallcomponents/TopDisplayComponent';
import pdfPreviewImage from './assets/previewimages/pdf.png';
import wordPreviewImage from './assets/previewimages/word.png';
import excelPreviewImage from './assets/previewimages/excel.png';
import textPreviewImage from './assets/previewimages/txt.png';
import videoPreviewImage from './assets/previewimages/video.png';
import AudioPreviewImage from './assets/previewimages/audio.png';
import generalUpload from './assets/previewimages/upload.png';
import NoticeBoardDetailsModal from './NoticeBoard/NoticeBoardDetailsModal';
// import Toast from 'react-native-toast-message';

global.TextEncoder = TextEncoder;

const audioRecorderPlayer = new AudioRecorderPlayer();

const NoticeBoardScreen = ({group, userId, prevMessageHistory, userName}) => {
  console.log('group jiurh898989rjr8r89r8 : ', group);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to handle network changes
    const handleConnectivityChange = state => {
      if (!state.isConnected) {
        setConnectionStatus('You are offline');
      }
      if (state.isConnected) {
        setConnectionStatus('Connected');
      }
    };

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Cleanup the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    console.log('messageHistory : 5858485385327432742 : ', messageHistory);
  }, [messageHistory]);
  useEffect(() => {
    const backAction = () => {
      // Reset the navigation stack and navigate to NoticeBoardMainScreen
      navigation.reset({
        index: 0, // Set the index to 0 to reset to the first screen
        routes: [{name: 'NoticeBoardMainScreen'}],
      });
      return true; // Prevent default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // const navigation = useNavigation();
  // console.log(
  //   'received props from NOtice board List: \n>>>>>group : ',
  //   group,
  //   '\n',
  //   '>>>>> userId : ',
  //   userId,
  //   // '>>>>>> prevConversation in NoticeBoardScreen CHat screen : ',
  //   // prevMessageHistory,
  // );

  const [message, setMessage] = useState('No Messages yet...');
  const [messageHistory, setMessageHistory] = useState(
    prevMessageHistory || [],
  );
  const [typedMessage, setTypedMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(false);

  const noticeBoardDetailsAPI = `${API_URL}/api/noticeBoard/members?nbid=${group.noticeBoardId}`;
  //NOTICE BOARD DETAILS
  const [noticeBoardDetailsModalVisible, setNoticeBoardDetailsModalVisible] =
    useState(false);

  const openNoticeBoardDetailsModal = () =>
    setNoticeBoardDetailsModalVisible(true);
  const closeNoticeBoardDetailsModal = () =>
    setNoticeBoardDetailsModalVisible(false);

  useEffect(() => {
    let isComponentMounted = true; // Track if component is mounted

    setMessageHistory(prevMessageHistory);
    setLoading(true);

    // Initializing SockJS and STOMP client
    const socketUrl = `${API_URL}/websocket`;
    let socket;
    let client;

    try {
      socket = new SockJS(socketUrl);
      client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // Set reconnect delay
        onConnect: frame => {
          if (!isComponentMounted) return; // Prevent execution after unmount
          console.log('Connected: ' + frame);
          setStompClient(client);
          setConnectionStatus('Connected');

          client.subscribe(
            `/topic/listen/group/${group.noticeBoardId}`,
            response => {
              if (!isComponentMounted) return;

              const receivedData = JSON.parse(response.body);
              const receivedMessage = receivedData.body;

              setMessage(receivedMessage.message);
              updateNoticeBoardActivity(group.noticeBoardId);
              // Check if the message already exists in the history before adding
              setMessageHistory(prevHistory => {
                const alreadyExists = prevHistory.some(
                  msg => msg.referenceId === receivedMessage.referenceId,
                );

                if (!alreadyExists) {
                  return [
                    ...prevHistory,
                    {
                      sender: receivedMessage.sender,
                      userName: receivedMessage.userName,
                      text: receivedMessage.message,
                      timeStamp: receivedMessage.timeStamp,
                      type: 'received',
                      referenceId: receivedMessage.referenceId,
                      messageType: receivedMessage.messageType,
                      messageId: receivedMessage.messageId,
                      metaData: receivedMessage.metaData,
                    },
                  ];
                }
                return prevHistory;
              });

              setMessageHistory(prevHistory =>
                prevHistory.map(msg => {
                  if (msg.referenceId === receivedMessage.referenceId) {
                    // console.log('Before Update: 858395894830535', msg);

                    const updatedMsg = {
                      ...msg, // Update only the fields that are null or need updating
                      sender: receivedMessage.sender || msg.sender,
                      userName: receivedMessage.userName || msg.userName,
                      text: receivedMessage.text || msg.text,
                      timeStamp: receivedMessage.timeStamp || msg.timeStamp,
                      type: receivedMessage.type || msg.type,
                      messageType:
                        receivedMessage.messageType || msg.messageType,
                      messageId: receivedMessage.messageId || msg.messageId,
                      metaData: {
                        ...msg.metaData,
                        fileUrl:
                          receivedMessage.metaData.fileUrl ||
                          msg.metaData.fileUrl,
                        fileId:
                          receivedMessage.metaData.fileId ||
                          msg.metaData.fileId,
                        originalFileName:
                          receivedMessage.metaData.originalFileName ||
                          msg.metaData.originalFileName,
                        fileSize:
                          receivedMessage.metaData.fileSize ||
                          msg.metaData.fileSize ||
                          0,
                        // Any other fields you need to update from metaData
                      },
                    };

                    // console.log('After Update 858395894830535:', updatedMsg);

                    return updatedMsg;
                  }

                  return msg;
                }),
              );
            },
          );

          setLoading(false);
        },
        onStompError: error => {
          console.log('STOMP error:', error);
          setConnectionStatus('Connection error');
          setLoading(false);
        },
      });

      client.activate(); // Activate the STOMP client
    } catch (error) {
      setConnectionStatus('Network Error');
      console.log('WebSocket/SockJS setup error:', error);
    }

    return () => {
      isComponentMounted = false; // Mark component as unmounted

      // Ensure the client and socket are properly closed
      if (client && client.connected) {
        try {
          client.deactivate(); // Deactivate the STOMP client
          console.log('STOMP client deactivated.');
        } catch (error) {
          console.log('Error during STOMP client deactivation:', error);
        }
      }

      // Explicitly closing the SockJS connection if it's open
      if (socket) {
        try {
          socket.close(); // Closing the SockJS connection
          console.log('SockJS connection closed.');
        } catch (error) {
          console.log('Error closing SockJS connection:', error);
        }
      }

      // setConnectionStatus('Disconnected, Connecting Again...');
      setConnectionStatus('Please wait...');
    };
  }, [prevMessageHistory.length > 0]);

  // Function to update notice board activity
  const updateNoticeBoardActivity = async noticeBoardId => {
    // Get current date and time in "YYYY-MM-DD HH:mm:ss" format
    const now = new Date();
    const formattedTimestamp = format(now, 'yyyy-MM-dd HH:mm:ss.SSS');

    // API endpoint
    const apiUrl = `${API_URL}/api/noticeBoard/updateNoticeBoardActivity?usrid=${userId}&nbid=${noticeBoardId}`;

    // Request body
    const requestBody = {
      lastOpenedOn: formattedTimestamp,
    };

    try {
      // Perform the fetch request
      const response = await fetch(apiUrl, {
        method: 'POST', // or 'PUT' if it's an update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      console.log('NoticeBoard activity updated successfully');
    } catch (error) {
      // Handle errors
      console.error('Error updating NoticeBoard activity:', error);
    }
  };
  const [isConnected, setIsConnected] = useState(false);

  const handleSendPress = async () => {
    const state = await NetInfo.fetch(); // Fetching  the current state

    if (!state.isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection');
    } else {
      sendMessage();
    }
  };

  const sendMessage = () => {
    console.log('userId while messaging j5iji5lklkjij5i4i : ', userId);
    const now = new Date();
    const formattedTimestamp = format(now, 'yyyy-MM-dd HH:mm:ss.SSS');
    // console.log(
    //   'formattedTimestamp : 058395890385908385893 : ',
    //   formattedTimestamp,
    // );
    if (stompClient && typedMessage.trim() !== '') {
      const messageId = UUID.v4();
      const newMessage = {
        message: typedMessage,
        referenceId: messageId,
        messageType: 'CHAT',
        sender: userId,
        userName: userName ? userName : 'unknown',
        timeStamp: formattedTimestamp,
        groupId: group.noticeBoardId,
        metaData: {
          fileUrl: null,
          fileName: null,
          fileId: null,
        },
      };
      const JsonNewMessageString = JSON.stringify(newMessage);
      console.log('sent Messages mm98985n', JsonNewMessageString);
      stompClient.publish({
        destination: `/app/group/${group.noticeBoardId}/sendMessage`,
        body: JsonNewMessageString,
      });
    }
    setTypedMessage('');
  };

  //trying to show progress:
  const allowedMimeTypes = [
    // Image MIME types
    'image/jpeg',
    'image/png',
    'image/gif',

    // PDF MIME type
    'application/pdf',

    // Word document MIME types
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

    // Excel MIME types
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

    // Text file MIME type
    'text/plain', // .txt

    // Video MIME types
    'video/mp4', // MP4 video
    'video/x-m4v', // M4V video
    'video/x-msvideo', // AVI video
    'video/quicktime', // MOV video
    'video/x-ms-wmv', // WMV video
    'video/mpeg', // MPEG video
    'video/webm', // WEBM video
    'video/ogg', // OGG video

    // Audio MIME types
    'audio/mpeg', // MP3 audio
    'audio/x-wav', // WAV audio
    'audio/wav', // WAV audio (alternative)
    'audio/ogg', // OGG audio
    'audio/aac', // AAC audio
    'audio/x-aac', // AAC audio (alternative)
    'audio/flac', // FLAC audio
    'audio/midi', // MIDI audio
    'audio/x-midi', // MIDI audio (alternative)
    'audio/x-m4a', // M4A audio
    'audio/mp4', // MP4 audio
    'audio/vnd.wav', // WAV audio (vendor-specific)
    'audio/mp2', // MP2 audio
    'audio/mp3', // MP3 audio (duplicate)
    'audio/vnd.dolby.dd-raw', // Dolby Digital audio
    'audio/opus', // Opus audio
  ];

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // Maximum file size in bytes (e.g., 50 MB)

  const getMaxFileSizeForType = fileType => {
    // File size limits for each category (in bytes)
    const MAX_IMAGE_SIZE = 50 * 1024 * 1024; //recomended - 5 MB for images
    const MAX_PDF_SIZE = 50 * 1024 * 1024; //recomended - 10 MB for PDFs
    const MAX_WORD_SIZE = 50 * 1024 * 1024; //recomended - 5 MB for Word documents
    const MAX_EXCEL_SIZE = 50 * 1024 * 1024; //recomended - 5 MB for Excel files
    const MAX_TEXT_SIZE = 50 * 1024 * 1024; //recomended - 5 MB for text files
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; //recomended - 30 MB for videos
    const MAX_AUDIO_SIZE = 50 * 1024 * 1024; //recomended - 15 MB for audio files

    // Create a mapping of MIME types to max sizes
    const fileTypeSizeMap = {
      // Image MIME types
      'image/jpeg': MAX_IMAGE_SIZE,
      'image/png': MAX_IMAGE_SIZE,
      'image/gif': MAX_IMAGE_SIZE,

      // PDF MIME type
      'application/pdf': MAX_PDF_SIZE,

      // Word document MIME types
      'application/msword': MAX_WORD_SIZE, // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        MAX_WORD_SIZE, // .docx

      // Excel MIME types
      'application/vnd.ms-excel': MAX_EXCEL_SIZE, // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        MAX_EXCEL_SIZE, // .xlsx

      // Text file MIME type
      'text/plain': MAX_TEXT_SIZE, // .txt

      // Video MIME types
      'video/mp4': MAX_VIDEO_SIZE, // MP4 video
      'video/x-m4v': MAX_VIDEO_SIZE, // M4V video
      'video/x-msvideo': MAX_VIDEO_SIZE, // AVI video
      'video/quicktime': MAX_VIDEO_SIZE, // MOV video
      'video/x-ms-wmv': MAX_VIDEO_SIZE, // WMV video
      'video/mpeg': MAX_VIDEO_SIZE, // MPEG video
      'video/webm': MAX_VIDEO_SIZE, // WEBM video
      'video/ogg': MAX_VIDEO_SIZE, // OGG video

      // Audio MIME types
      'audio/mpeg': MAX_AUDIO_SIZE, // MP3 audio
      'audio/x-wav': MAX_AUDIO_SIZE, // WAV audio
      'audio/wav': MAX_AUDIO_SIZE, // WAV audio (alternative)
      'audio/ogg': MAX_AUDIO_SIZE, // OGG audio
      'audio/aac': MAX_AUDIO_SIZE, // AAC audio
      'audio/x-aac': MAX_AUDIO_SIZE, // AAC audio (alternative)
      'audio/flac': MAX_AUDIO_SIZE, // FLAC audio
      'audio/midi': MAX_AUDIO_SIZE, // MIDI audio
      'audio/x-midi': MAX_AUDIO_SIZE, // MIDI audio (alternative)
      'audio/x-m4a': MAX_AUDIO_SIZE, // M4A audio
      'audio/mp4': MAX_AUDIO_SIZE, // MP4 audio
      'audio/vnd.wav': MAX_AUDIO_SIZE, // WAV audio (vendor-specific)
      'audio/mp2': MAX_AUDIO_SIZE, // MP2 audio
      'audio/mp3': MAX_AUDIO_SIZE, // MP3 audio (duplicate)
      'audio/vnd.dolby.dd-raw': MAX_AUDIO_SIZE, // Dolby Digital audio
      'audio/opus': MAX_AUDIO_SIZE, // Opus audio
    };

    // Return the max size for the given file type or a default if not found
    return fileTypeSizeMap[fileType] || MAX_FILE_SIZE; // MAX_FILE_SIZE can be your general default
  };

  const [uploadProgress, setUploadProgress] = useState({}); // Store progress of each file

  useEffect(() => {
    console.log('uploadProgress list ngjdkjg898989fdkjd89: ', uploadProgress);
  }, [uploadProgress]);
  function getPreviewImage(file) {
    if (allowedMimeTypes.includes(file.type)) {
      if (file.type.startsWith('image/')) {
        return {uri: file.uri}; // Directly use the image URI
      } else if (file.type === 'application/pdf') {
        return pdfPreviewImage;
      } else if (
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return wordPreviewImage;
      } else if (
        file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return excelPreviewImage;
      } else if (file.type === 'text/plain') {
        return textPreviewImage;
      } else if (file.type.startsWith('video/')) {
        return videoPreviewImage;
      } else if (file.type.startsWith('audio/')) {
        return AudioPreviewImage;
      }
    }
    return generalUpload; // Default case if no type matches
  }
  const handleDisabledPress = () => {
    // Showing toast when button is pressed while disabled
    console.log(connectionStatus, '908429084902849082904');
    if (connectionStatus !== 'Connected') {
      console.log('SHowing toast...9859389058390543');
      ToastAndroid.showWithGravity(
        'You are offline',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const showUploadToast = fileName => {
    // Showing toast when button is pressed while disabled
    console.log('SHowing toast...for Upload...9866546459389058390543');
    ToastAndroid.showWithGravity(
      `Uploading... ${fileName}`,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };
  const handleUploadComplete = referenceId => {
    setUploadProgress(prevProgresses => {
      const {[referenceId]: _, ...remainingProgress} = prevProgresses;
      return remainingProgress;
    });
  };
  const bytesToMB = sizeInBytes => {
    return (sizeInBytes / (1024 * 1024)).toFixed(2); // Convert bytes to MB and round to 2 decimal places
  };

  const uploadFile = async (
    file,
    index,
    noticeboardId,
    senderFilePath,
    formattedTimestamp,
    referenceId,
  ) => {
    console.log('Details of uploading file:', file, index, senderFilePath);

    //For showing upload progress
    setMessageHistory(prevHistory => [
      ...prevHistory,
      {
        sender: userId,
        userName: userName,
        text: file.name,
        timeStamp: formattedTimestamp,
        type: 'received',
        referenceId: referenceId,
        messageType: 'FILE',
        messageId: referenceId,
        metaData: {
          fileUrl: null,
          fileName: file.name, // temprory
          fileId: null,
          senderFilePath: senderFilePath,
          fileType: file.type,
          originalFileName: file.name,
          fileSize: bytesToMB(file.size),
        },
      },
    ]);

    const notificationImage = getPreviewImage(file); // Preview image for notification
    const formData = new FormData();

    // Append the file to formData
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name || `file_${UUID.v4()}`, // Unique name for the file
    });
    formData.append('senderFilePath', senderFilePath);

    const notifierId = `upload-${index}`; // Unique ID for the notification

    try {
      // Show initial toast or notification for file upload
      // showUploadToast(file.name);

      const response = await axios.post(
        `${API_URL}/api/noticeBoard/upload?usrid=${userId}&nbid=${noticeboardId}&uuid=${UUID.v4()}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            const percentComplete = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );

            // Update upload progress state
            setUploadProgress(prevProgress => ({
              ...prevProgress,
              [referenceId]: percentComplete,
            }));

            // Update notification for progress
            if (percentComplete === 0 || percentComplete < 5) {
              Notifier.showNotification({
                title: `Uploading ${file.name}`,
                description: `Upload started...`,
                duration: 0, // Keep the notification active
                Component: NotifierComponents.Notification,
                componentProps: {
                  imageSource: notificationImage,
                },
                id: notifierId, // Unique ID for each file
              });
            } else if (percentComplete === 100) {
              // Replace the progress notification with a completion message
              // Notifier.hideNotification(notifierId); // Hide the initial notification

              Notifier.showNotification({
                title: `Upload Complete`,
                description: `${file.name} has been uploaded successfully.`,
                duration: 5000, // Display completion notification for 5 seconds
                Component: NotifierComponents.Notification,
                componentProps: {
                  imageSource: notificationImage,
                },
                id: notifierId, // Unique ID for the completion message
              });
              handleUploadComplete(referenceId);
            } else {
              // Update the progress if it's between 5% and 99%
              Notifier.showNotification({
                title: `Uploading ${file.name}`,
                description: `${percentComplete}% uploaded.`,
                duration: 0, // Keep the notification active
                Component: NotifierComponents.Notification,
                componentProps: {
                  imageSource: notificationImage,
                },
                id: notifierId, // Keep updating the same notification ID
              });
            }

            console.log(`File ${file.name} is ${percentComplete}% uploaded.`);
          },
        },
      );

      console.log('Upload successful:', response.data);
      return response.data; // Return response if upload is successful
    } catch (error) {
      console.error('Upload failed:', error);

      // Handle upload error notification
      // Notifier.hideNotification(notifierId); // Hide any previous progress notifications

      Notifier.showNotification({
        title: `Error Uploading ${file.name}`,
        description: `There was a network error.`,
        duration: 5000, // Show the error notification for 5 seconds
        id: notifierId, // Use a unique ID for error notification
      });

      throw new Error('File upload failed');
    }
  };

  const saveFileToExternalStorage = async (
    fileUri,
    fileName,
    senderFilePath,
  ) => {
    try {
      const hasPermission = await requestStoragePermission();
      const folderPath = `${RNFS.DownloadDirectoryPath}/HarnessERP`;
      console.log('externale folderPath : 408939089054355334', folderPath);
      const sourcePath = fileUri;
      const destinationPath = senderFilePath;

      if (hasPermission) {
        // Ensure the folder exists
        const folderExists = await RNFS.exists(folderPath);
        if (!folderExists) {
          await RNFS.mkdir(folderPath); // Create the directory if it doesn't exist
          console.log('Folder created: ', folderPath);
        }

        // Copy the file to the target directory
        const fileExists = await RNFS.exists(destinationPath);

        if (!fileExists) {
          console.log(
            'File not exist , copying file.... 458374738758375873: to',
            destinationPath,
          );
          await RNFS.copyFile(sourcePath, destinationPath);
          console.log('File saved to: ', destinationPath);
        }
        console.log(
          'File already exist , skipping copy of file.... 909090898965 : ',
          fileExists,
        );
        // Alert.alert(
        //   'File Saved',
        //   `The file has been saved to: ${destinationPath}`,
        // );
      } else {
        console.log('Storage permission denied');
        Alert.alert(
          'permission denied',
          `Permission Denied either copying or writing the file`,
        );
      }
    } catch (error) {
      console.error('File saving error: ', error.message);
      Alert.alert('Error', `File could not be saved: ${error.message}`);
    }
  };
  const sanitizeFileName = fileName => {
    // Replace special characters that might cause issues
    // Remove characters like (), *, ?, <, >, |, : etc.
    return fileName.replace(/[()<>:"\/\\|?*]/g, '');
  };
  const chooseFile = async () => {
    // let sanitizedFileName = 'unknown';

    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allows all types of files
        allowMultiSelection: true, // Allows multiple file selection
      });

      // Filter out files that are not images or PDFs
      console.log(
        'selected file type : 785783853839058903805 : ',
        response.type,
      );
      // const validFiles = response.filter(
      //   file =>
      //     allowedMimeTypes.includes(file.type) && file.size <= MAX_FILE_SIZE,
      // );

      const validFiles = response.filter(file => {
        // Sanitize file name to avoid upload issues
        const sanitizedFileName = sanitizeFileName(file.name);

        // Check if the sanitized name differs from the original
        if (sanitizedFileName !== file.name) {
          Alert.alert(
            'Invalid File Name',
            `File "${file.name}" contains special characters that are not allowed. It has been renamed to "${sanitizedFileName}".`,
          );
        }

        // Update file name after sanitization
        file.name = sanitizedFileName;

        // Validate file type and size
        return (
          allowedMimeTypes.includes(file.type) &&
          file.size <= getMaxFileSizeForType(file.type)
        );
      });

      const invalidFiles = response.filter(
        file =>
          !allowedMimeTypes.includes(file.type) ||
          file.size > getMaxFileSizeForType(file.type),
      );

      if (invalidFiles.length > 0) {
        // List the invalid files and the reason (type or size)
        const invalidReasons = invalidFiles.map(file => {
          if (!allowedMimeTypes.includes(file.type)) {
            return `${file.name}: Invalid type (${file.type})`;
          } else if (file.size > getMaxFileSizeForType(file.type)) {
            return `${file.name}: \nFile size too large (${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)\n\nAllowed size ${
              getMaxFileSizeForType(file.type) / 1024 / 1024
            } MB for this file type.`;
          }
        });

        Alert.alert(
          'Invalid File Selection',
          `The following files are invalid:\n\n${invalidReasons.join('\n')}`,
          [{text: 'OK'}],
        );
      }

      if (validFiles.length === 0) {
        console.log('No valid files selected');
        return;
      }

      // Upload each file and handle WebSocket message
      for (const [index, file] of validFiles.entries()) {
        try {
          console.log(
            'validFIles: 84928489082904890284 : ',
            validFiles.entries(),
          );
          console.log('file data 989584359384534 : ', file);
          //processing permenant file path for a selected file
          const fileUri = file.uri;
          const senderFilePath = `${
            RNFS.DownloadDirectoryPath
          }/HarnessERP/${sanitizeFileName(file.name)}`;
          console.log(
            'External DOwnload path : 84789278492882:',
            senderFilePath,
          );
          await saveFileToExternalStorage(fileUri, file.name, senderFilePath);

          const now = new Date();
          const formattedTimestamp = format(now, 'yyyy-MM-dd HH:mm:ss.SSS');
          const referenceId = UUID.v4();

          const data = await uploadFile(
            file,
            index,
            group.noticeBoardId,
            senderFilePath,
            formattedTimestamp,
            referenceId,
          ); // Upload file and track progress
          console.log('Uploaded file:', data);

          // Send metadata via WebSocket after successful upload
          if (stompClient) {
            console.log('selected file data: 858345083905890385903 : ', file);
            const fileMessage = {
              message: `${data.metaData.fileName}`,
              referenceId: referenceId,
              messageType: 'FILE',
              sender: userId,
              userName: userName,
              timeStamp: formattedTimestamp,
              groupId: group.noticeBoardId,
              metaData: {
                fileUrl: data.metaData.fileUrl,
                fileName: data.metaData.fileName,
                fileId: data.metaData.fileId,
                senderFilePath: senderFilePath,
                fileType: file.type,
                originalFileName: data.metaData.fileName, // temprory
              },
            };

            // Publish the message to the WebSocket topic
            stompClient.publish({
              destination: `/app/group/${group.noticeBoardId}/sendMessage`,
              body: JSON.stringify(fileMessage),
            });

            console.log('Message sent via WebSocket:', fileMessage);
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError.message);
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('File upload error:', error.message);
      }
    }
  };
  //FOR FILE(IMAGE, PDF) OPEN
  // Determine if the file is an image
  // Determine if the file is an image
  const isImage = fileUrl =>
    (fileUrl && fileUrl.endsWith('.jpg')) ||
    fileUrl.endsWith('.jpeg') ||
    fileUrl.endsWith('.png') ||
    fileUrl.endsWith('.gif');

  // Determine if the file is a PDF
  const isPDF = fileUrl => fileUrl && fileUrl.endsWith('.pdf');

  // Call this function to check if 'document.pdf' exists
  const getMimeTypeFromFile = fileName => {
    const fileExtension = fileName.split('.').pop();
    return mime.lookup(fileExtension) || 'application/octet-stream'; // Default MIME type
  };

  const [pdfUri, setPdfUri] = useState(null);

  const downloadAndOpenPDF = async (base64Uri, fileName) => {
    try {
      const androidVersion = Platform.Version;
      let filePath;

      if (Platform.OS === 'android') {
        if (androidVersion >= 29) {
          filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        } else {
          filePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message:
                'App needs access to your file storage to save and open the PDF',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Denied',
              'Storage permission is required to save and open the file.',
            );
            return;
          }
        }
      } else {
        filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      }

      // Write the base64 content to a file
      await RNFS.writeFile(filePath, base64Uri, 'base64');
      console.log('File written successfully to:', filePath);

      // Verify file exists and is not empty
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        Alert.alert('Error', 'File does not exist.');
        return;
      }

      const fileStat = await RNFS.stat(filePath);
      if (fileStat.size === 0) {
        Alert.alert('Error', 'File is empty.');
        return;
      }

      // Update state to render the PDF viewer
      setPdfUri(`file://${filePath}`);
    } catch (error) {
      console.error('Error downloading or opening PDF:', error);
      Alert.alert('Error', 'Failed to download or open the file.');
    }
  };

  const startRecording = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    console.log('Recording started:', result);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    console.log('Recording stopped:', result);
  };

  const toTitleCase = str => {
    // console.log('Title CASING 00890890ij0988758:  ', str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatTimestamp = utcTime => {
    // Parse the string to a Date object
    const date = new Date(utcTime);

    // console.log('date njjke890909090ne8 : ', date);
    // console.log(
    //   'Intl.DateTimeFormat().resolvedOptions().timeZone njjke890909090ne8 : ',
    //   Intl.DateTimeFormat().resolvedOptions().timeZone,
    // );
    // Convert UTC time to local time
    const zonedTime = toZonedTime(
      date,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    // Format the time to "hh:mm a" (12-hour clock with AM/PM)
    const formattedTime = format(zonedTime, 'MMM dd, yyyy hh:mm a');
    // const formattedTime = format(zonedTime, 'hh:mm a');
    return formattedTime;
  };
  const handleDeleteMessage = async messageIds => {
    // Call the API to delete the message
    console.log(
      'Selected Message Ids for Slection in handle delete Message : 8788960873j90683',
      messageIds,
    );
    console.log(
      'DELETE MESSAGE API : llhmkkkoophh943n',
      `${API_URL}/deleteMessage?nbid=${group.noticeBoardId}&usrid=${userId}`,
    );

    const credentials = await Keychain.getGenericPassword({service: 'jwt'});
    const token = credentials.password;
    console.log(
      'token with berarer : for deleting notice board messages',
      `${token}`,
    );

    fetch(
      `${API_URL}/api/noticeBoard/deleteMessage/${group.noticeBoardId}/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({messageIds: messageIds}),
      },
    )
      .then(response => {
        if (response.ok) {
          console.log('Message deleted successfully');
          // Update the UI after deletion
          setMessageHistory(prevMessages =>
            prevMessages.filter(msg => !messageIds.includes(msg.messageId)),
          );
          // Clear any long-pressed message state
          setSelectedMessageIds([]);
        } else {
          console.error('Failed to delete the message');
          return response.text().then(text => {
            throw new Error(text || 'Failed to delete the message');
          });
        }
      })
      .catch(error => {
        console.error('Error deleting message:', error.message);
        Alert.alert(
          'Error',
          'Failed to delete the message. Please try again later.',
        );
      });
  };

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  const isSelected = messageId => {
    return selectedMessageIds.includes(messageId);
  };

  const handleDeleteSelectedMessages = () => {
    // selectedMessageIds.forEach(messageId => {
    //   handleDeleteMessage(messageId);
    // });
    console.log(
      'SELECTED MESSAGE ID FOR DELETION : MLKLKLKGS088978GSJ',
      selectedMessageIds,
    );
    handleDeleteMessage(selectedMessageIds);
    //API
    setSelectedMessageIds([]); // Clear selection after deletion
    setSelectionMode(false);
  };

  const handleLongPressMessage = (messageId, timeStamp) => {
    const currentTime = new Date(); // Get the current time
    const messageTime = new Date(timeStamp); // Convert the message timestamp to a Date object
    console.log('Original timeStamp: R745', timeStamp);

    // Calculate the difference in milliseconds and convert to minutes
    const timeDifference = (currentTime - messageTime) / (1000 * 60);
    console.log('timeDifferencce :3478472h4929756 : ', timeDifference);

    if (!group.isAdmin) {
      if (timeDifference > 30) {
        Alert.alert(
          'Please Note',
          'You cannot perform an action on messages older than 30 minutes.',
          [{text: 'OK', onPress: () => console.log('Alert closed')}],
        );
        return; // Prevent selection if it's beyond the time limit
      }
    }
    // Check if the message is within 30 minutes of the current time

    Vibration.vibrate(100);
    console.log('Long press detected, messageId: ', messageId);
    console.log('Current selection mode: ', selectionMode);

    if (!selectionMode) {
      setSelectionMode(true);
    }
    toggleSelection(messageId);
  };

  const handlePressMessage = (messageId, timeStamp) => {
    const currentTime = new Date(); // Get the current time
    const messageTime = new Date(timeStamp); // Convert the message timestamp to a Date object
    console.log('Original timeStamp: R745', timeStamp);

    // Calculate the difference in milliseconds and convert to minutes
    const timeDifference = (currentTime - messageTime) / (1000 * 60);
    console.log('timeDifferencce :3478472h4929756 : ', timeDifference);

    // Check if the message is within 30 minutes of the current time
    if (!group.isAdmin) {
      if (timeDifference > 30) {
        Alert.alert(
          'Please Note',
          'You cannot perform an action on messages older than 30 minutes.',
          [{text: 'OK', onPress: () => console.log('Alert closed')}],
        );
        return; // Prevent selection if it's beyond the time limit
      }
    }

    Vibration.vibrate(100);
    // Vibration.vibrate(100);
    console.log('Single press detected, messageId: 524asre2r2ad ', messageId);
    console.log('Current selection mode: ii789684653242gd', selectionMode);

    if (!group.isAdmin) {
      if (timeDifference < 30 && selectionMode) {
        toggleSelection(messageId);
      }
    } else {
      toggleSelection(messageId);
    }
  };

  const toggleSelection = messageId => {
    if (selectedMessageIds.includes(messageId)) {
      setSelectedMessageIds(selectedMessageIds.filter(id => id !== messageId));
    } else {
      setSelectedMessageIds([...selectedMessageIds, messageId]);
    }

    // If no more messages are selected, exit selection mode
    if (
      selectedMessageIds.length === 1 &&
      selectedMessageIds.includes(messageId)
    ) {
      setSelectionMode(false);
    }
  };
  const confirmDelete = () => {
    Alert.alert(
      'Delete Messages',
      'Are you sure you want to delete the selected messages permanently?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setSelectedMessageIds([]);
            setSelectionMode(false);
          },
        },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: () => handleDeleteSelectedMessages(),
        },
      ],
      {cancelable: true},
    );
  };

  const [downloadedFilesRecords, setDownloadedFilesRecords] = useState([]);

  useEffect(() => {}, [downloadedFilesRecords]);

  const downloadFileDirect = async (fileUrl, messageId) => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer : ', `${token}`);
      // Replace with your API endpoint to fetch Filter

      console.log(`${API_URL}${fileUrl}`);

      //Example data : 08-Jan-20&toDate=09-Jan-24
      const response = await fetch(`${API_URL}${fileUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error while download direct image! Status: ${response.status}, for this url : ${fileUrl}`,
        );
      }

      const data = await response.json();
      console.log(
        'DOWNLOAD FILE DIRECT LOG : ===============>>>>>>>>>> ',
        data,
      );
      setDownloadedFilesRecords(prev => [
        ...prev,
        {
          base64Uri: data.data,
          contentType: data.fileType,
          messageId: messageId,
        },
      ]);
      console.log(
        'File Download Complete !!   >>>>>>>>>> jikjiiij9098999d',
        downloadedFilesRecords,
      );
    } catch (error) {
      console.error('Error Downloading File', error);
    } finally {
      // Always hide loading indicator after login attempt (success or failure)
    }
  };

  const downloadFileByMessageId = async messageId => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer : ', `${token}`);
      // Replace with your API endpoint to fetch Filter

      console.log(
        `${API_URL}/api/noticeBoard/getFileMetaData?nbid=${group.noticeBoardId}&msgid=${messageId}`,
      );

      //Example data : 08-Jan-20&toDate=09-Jan-24
      const response = await fetch(
        `${API_URL}/api/noticeBoard/getFileMetaData?nbid=${group.noticeBoardId}&msgid=${messageId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error while fetching uploaded file metadata! Status: ${response.status}, for this messageId : ${messageId}`,
        );
      }

      const data = await response.json();
      console.log(
        'FETCHED UPLOADED FILE METADATA : ===============>>>>>>>>>> ',
        data,
      );
      console.log('Fetching uploaded file metedata Complete !!   >>>>>>>>>> ');
      downloadFileDirect(data.fileUrl, messageId);
    } catch (error) {
      console.error('Error Fetching uploaded file metedata', error);
    }
  };

  const scrollViewRef = useRef(null);

  //Scroll view Performance const scrollViewRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isNearTop, setIsNearTop] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const quickScrolltimerRef = useRef(null);
  // Scroll to the end when the component mounts initially
  useEffect(() => {
    scrollToEnd(false); // Scroll without animation on initial load
  }, []);
  // Clear the timer when the component unmounts
  useEffect(() => {
    return () => clearTimeout(quickScrolltimerRef.current);
  }, []);

  // Scroll to the end function
  const scrollToEnd = (animated = true) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated});
    }
  };

  // Handle scroll position change
  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    // Check if the user is near the bottom (within 20 pixels of the end)
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    const isTop = contentOffset.y <= 20;

    setIsNearBottom(isBottom);
    setIsNearTop(isTop);
    resetQuickScrollTimer();
  };

  // Handle content size change, but only scroll if the user was at the bottom
  const handleContentSizeChange = () => {
    if (isNearBottom) {
      scrollToEnd(true); // Scroll with animation if the user is at the bottom
    }
  };
  // Handle scrolling
  const handleScrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
    resetQuickScrollTimer();
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
    resetQuickScrollTimer();
  };
  const resetQuickScrollTimer = () => {
    clearTimeout(quickScrolltimerRef.current);
    setShowArrows(true);
    quickScrolltimerRef.current = setTimeout(() => {
      setShowArrows(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', width: '100%'}}>
        {selectedMessageIds.length <= 0 && (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => {
              navigation.reset({
                index: 0, // Reset to the first screen
                routes: [{name: 'NoticeBoardMainScreen'}], // The screen you want to navigate to
              });
            }}>
            <Icon name="arrow-back" size={30} color="#333" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            width: '90%',
            borderRadius: 20,
            fontWeight: '600',
            marginBottom: 5,
            padding: 10,
            backgroundColor: CustomThemeColors.primary,
            alignItems: 'center',
          }}
          onPress={openNoticeBoardDetailsModal}>
          <NoticeBoardDetailsModal
            userId={userId}
            label="Notice Board Details"
            visible={noticeBoardDetailsModalVisible}
            apiUrl={noticeBoardDetailsAPI}
            httpMethod="GET"
            requiredFields={['userName', 'userId', 'role', 'isAdmin']} // Example fields to display
            onClose={closeNoticeBoardDetailsModal}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              textAlign: 'center',
            }}>
            {group.noticeBoardName}
          </Text>
        </TouchableOpacity>
        <View>
          {selectedMessageIds.length > 0 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text
        style={[
          styles.status,
          connectionStatus === 'You are offline' && {color: 'red'},
        ]}>
        {connectionStatus}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}>
            {messageHistory.length > 0 ? (
              messageHistory.map((msg, index) =>
                msg.type === 'received' ? (
                  //If received message type is FILE then treat it as a file and put it in a filemessage bubble
                  msg.messageType === 'FILE' ? (
                    // console.log(
                    //   'FILE Message DEBUG 90859035873 :',
                    //   'messsageId: ',
                    //   msg.messageId,
                    //   'message Type : ',
                    //   msg.messageType,
                    //   'message',
                    //   msg.text,
                    //   'file metaData',
                    //   msg.metaData,
                    // ),
                    <View
                      key={index}
                      // onLongPress={() => setLongPressedMessageId(msg.messageId)}
                      style={[
                        styles.messageContainer,
                        msg.sender === userId
                          ? styles.sentMessageContainer
                          : styles.receivedMessageContainer,
                      ]}>
                      <TouchableOpacity
                        key={index}
                        style={[
                          msg.sender === userId
                            ? styles.sentFileMessageBubble
                            : styles.receivedFileMessageBubble,
                          isSelected(msg.messageId)
                            ? {
                                ...styles.selectedMessageBubble,
                              }
                            : null,
                        ]}
                        // disabled={() => msg.sender === userId}
                        onLongPress={() => {
                          if (msg.sender === userId || group.isAdmin) {
                            handleLongPressMessage(
                              msg.messageId,
                              msg.timeStamp,
                            );
                          }
                        }}
                        onPress={() => {
                          if (selectionMode) {
                            if (msg.sender === userId || group.isAdmin) {
                              handlePressMessage(msg.messageId, msg.timeStamp);
                            }
                          }
                        }}>
                        <View style={styles.fileMessageBubble}>
                          <Text style={styles.userName}>
                            {msg.sender !== null && msg.sender !== ''
                              ? msg.sender === userId
                                ? `${toTitleCase(msg.userName)} (You)`
                                : `${toTitleCase(msg.userName)}`
                              : 'Anonymous'}
                          </Text>
                          <Text style={styles.fileName}>{msg.text}</Text>
                          <View>
                            {/* {Object.keys(uploadProgress).map(key => (
                              <Text key={key}>
                                File {parseInt(key) + 1} is{' '}
                                {uploadProgress[key]}% uploaded.
                              </Text>
                            ))} */}
                            {/* Add your UI for triggering chooseFile */}
                          </View>
                          {prevMessageHistory.length > 0 && (
                            <RenderFileContent
                              message={msg}
                              sender={userId}
                              isUploading={msg.referenceId in uploadProgress}
                              uploadProgress={
                                uploadProgress[msg.referenceId] || 0
                              }
                            />
                          )}
                          {/* <Text style={styles.timestamp}>
                            {msg.metaData.fileSize}MB
                          </Text> */}
                          <Text style={styles.timestamp}>
                            {formatTimestamp(msg.timeStamp)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {/* {selectedMessageIds.length > 0 && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={confirmDelete}>
                          <Icon name="delete" size={24} color="white" />
                        </TouchableOpacity>
                      )} */}
                    </View>
                  ) : (
                    msg.messageType === 'CHAT' && (
                      // console.log(
                      //   'CHAT Message DEBUG 90859035873 :',
                      //   'messsageId: ',
                      //   msg.messageId,
                      //   'message Type : ',
                      //   msg.messageType,
                      //   'message',
                      //   msg.text,
                      // ),
                      <View
                        key={index}
                        style={[
                          styles.messageContainer,
                          msg.sender === userId
                            ? styles.sentMessageContainer
                            : styles.receivedMessageContainer,
                        ]}>
                        <TouchableOpacity
                          style={[
                            msg.sender === userId
                              ? styles.sentMessageBubble
                              : styles.receivedMessageBubble,
                            selectedMessageIds.includes(msg.messageId) &&
                              styles.selectedMessageBubble,
                            isSelected(msg.messageId)
                              ? {
                                  ...styles.selectedMessageBubble,
                                }
                              : null,
                          ]}
                          onLongPress={() => {
                            if (msg.sender === userId || group.isAdmin) {
                              handleLongPressMessage(
                                msg.messageId,
                                msg.timeStamp,
                              );
                            }
                          }}
                          onPress={() => {
                            if (selectionMode) {
                              if (msg.sender === userId || group.isAdmin) {
                                handlePressMessage(
                                  msg.messageId,
                                  msg.timeStamp,
                                );
                              }
                            }
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <MaterialIcons
                              name="account-circle"
                              size={14}
                              style={{
                                color: CustomThemeColors.primary,
                                marginRight: 5,
                                marginBottom: 3,
                              }}
                            />
                            <Text style={styles.userName}>
                              {msg.sender !== null && msg.sender !== ''
                                ? msg.sender === userId
                                  ? `${toTitleCase(msg.userName)} (You)`
                                  : `${toTitleCase(msg.userName)}`
                                : 'Anonymous'}
                            </Text>
                          </View>

                          <Text style={styles.messageText}>{msg.text}</Text>
                          <Text style={styles.timestamp}>
                            {formatTimestamp(msg.timeStamp)}
                          </Text>
                        </TouchableOpacity>
                        {/* {selectedMessageIds.length > 0 && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={confirmDelete}>
                          <Icon name="delete" size={24} color="white" />
                        </TouchableOpacity>
                      )} */}
                      </View>
                    )
                  )
                ) : //If received message type is Not a FILE then treat it as a normal text message and put it in a messagebubble
                null,
              )
            ) : (
              //if messages history desnt exist then show typed message
              <Text style={styles.messageText}>{message}</Text>
            )}
          </ScrollView>
          {/* {showArrows && !isNearBottom && (
            <TouchableOpacity
              style={styles.downArrowButton}
              onPress={handleScrollToBottom}>
              <MaterialIcons name="arrow-downward" size={18} color="white" />
            </TouchableOpacity>
          )}
          {showArrows && !isNearTop && (
            <TouchableOpacity
              style={styles.upArrowButton}
              onPress={handleScrollToTop}>
              <MaterialIcons name="arrow-upward" size={18} color="white" />
            </TouchableOpacity>
          )} */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {opacity: connectionStatus === 'Connected' ? 1 : 0.5},
              ]}
              onPress={
                connectionStatus !== 'Connected'
                  ? handleDisabledPress
                  : chooseFile
              }>
              <Icon name="attach-file" size={24} color="#000" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type your message"
              value={typedMessage}
              onChangeText={setTypedMessage}
            />
            {/* <TouchableOpacity style={styles.sendButton} onPress={sendMessage}> */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                opacity: connectionStatus === 'Connected' ? 1 : 0.5, // Change opacity when disabled
              }}
              onPress={
                connectionStatus !== 'Connected'
                  ? handleDisabledPress
                  : handleSendPress
              }>
              {/* <Text style={styles.sendButtonText}>Send</Text> */}
              <Icon name="send" size={26} color="#125fee" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.iconButton}
              onPress={startRecording}>
              <Icon name="mic" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={stopRecording}>
              <Icon name="stop" size={24} color="#000" />
            </TouchableOpacity> */}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: CustomThemeColors.H,
  },
  status: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 5,
    color: '#40a717',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingBottom: 5,
  },
  scrollView: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sentMessageContainer: {
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
  },
  sentMessageBubble: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    padding: 10,
    maxWidth: '80%',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 10,
  },
  receivedMessageBubble: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    padding: 10,
    maxWidth: '80%',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 10,
  },
  sentFileMessageBubble: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    padding: 20,
    maxWidth: '80%',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 10,
  },
  receivedFileMessageBubble: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    padding: 20,
    maxWidth: '80%',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 10,
  },
  fileMessageBubble: {
    padding: 10,
    borderRadius: 10,
    // backgroundColor: '#dce8f3',
    backgroundColor: '#e0e0e0',
    // backgroundColor: CustomThemeColors.primary,
    minWidth: '100%',
    alignSelf: 'flex-start',
  },
  fileName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  downloadLink: {
    color: '#125fee',
    textDecorationLine: 'underline',
    marginTop: 5,
    fontSize: 14,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  userName: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-start',
  },
  selectedMessageBubble: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red shade
  },
  navigationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // right: 10,
    // marginLeft: 5,
    padding: 5,
    // bottom: 5,
  },
  deleteButton: {
    backgroundColor: CustomThemeColors.fadedPrimary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // right: 10,
    // top: 10,
    marginLeft: 5,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: CustomThemeColors.fadedPrimary,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  upArrowButton: {
    position: 'absolute',
    bottom: 160,
    right: 10,
    backgroundColor: '#383a3b',
    opacity: 0.5,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  downArrowButton: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: '#383a3b',
    padding: 10,
    opacity: 0.5,
    borderRadius: 50,
    elevation: 5,
  },
});

export default NoticeBoardScreen;
