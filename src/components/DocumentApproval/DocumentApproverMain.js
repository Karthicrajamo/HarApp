import React, {useEffect, useState} from 'react';
import TitleBar from '../common-utils/TitleBar';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../ApiUrl';
import DocumentApprovalTableComponent from './DocumentApprovalTableComponent';
import CustomButton from '../common-utils/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import useFetchApiData from '../common-utils/useFetchApiData';
import {CustomThemeColors} from '../CustomThemeColors';
import pdfPreviewImage from '../assets/previewimages/download-pdf.png';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';
import {GetFileExtension} from '../common-utils/smallcomponents/GetFileExtension';
import {requestStoragePermission} from '../common-utils/requestStoragePermission';
import DeviceInfo from 'react-native-device-info';
const DocumentApproverMain = () => {
  const isTablet = DeviceInfo.isTablet();
  console.log('89372873773 ', isTablet);
  const navigation = useNavigation(); //For Nagivation
  const handleSessionExpired = () => {
    Alert.alert(
      'Your session has expired',
      'Please login again.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'), // Optional, handle cancel if needed
          style: 'cancel', // iOS only
        },
        {
          text: 'Login',
          onPress: () => navigation.navigate('LoginScreen'), // Navigate to LoginScreen
        },
      ],
      {cancelable: false},
    );
  };

  const query = `
  select COLUMN_NAME from MASTER_MAIN_TABLE_COLUMN_INFO 
  where COLUMN_TITLE='Uploaded Documents' 
  and MASTER_MAIN_TABLE_ID = (
    select MASTER_MAIN_TABLE_ID 
    from MASTER_MAIN_TABLE_DETAILS 
    where CUSTOM_MASTER_ID = (
      select CUSTOM_MASTER_ID 
      from MASTER_DETAILS 
      where CUSTOM_NODE_ID = 286
    ) 
    and table_type = 'Sub-Table'
  )`;
  const {
    data: fetchedFileChooserColName,
    loading: isFetchApiLoading,
    error: fetchError,
  } = useFetchApiData('/api/common/getLoadContents', query);

  const [filteredMainData, setFilteredMainData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedSubData, setSelectedSubData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isDownloadButton, setIsDownloadButton] = useState(false);

  const [selectedMainTableRowIndex, setSelectedMainTableRowIndex] =
    useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedSubRow, setSelectedSubRow] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0); // To store the progress percentage

  const [subTableData, setSubTableData] = useState([]);
  const [selectedSubRowIndex, setSelectedSubRowIndex] = useState(null);

  const [showUploadedDocuments, setShowUploadedDocuments] = useState(false);
  useEffect(() => {
    fetchMainTableData();
  }, []);
  useEffect(() => {
    // console.log('tableData Loggg' + tableData);
  }, [tableData]);

  useEffect(() => {
    if (selectedMainTableRowIndex !== null) {
      fetchSubTableData(tableData[selectedMainTableRowIndex]?.documentId);
    }
  }, [selectedMainTableRowIndex]); // Fetch sub table data when a new row is selected

  // useEffect(() => {}, [subTableData]);
  // useEffect(() => {}, [selectedSubRowIndex]);
  // useEffect(() => {}, [filteredMainData]);
  // useEffect(() => {}, [selectedSubData]);

  //   useEffect(() => console.log('selecterrow data::', selectedRow));
  // useEffect(() => {
  //   console.log('ruyuewr747 Selected Row:', selectedRow);

  //   if (
  //     selectedRow !== null &&
  //     selectedRow >= 0 &&
  //     selectedRow < tableData.length
  //   ) {
  //     // //   setSelectedDataGroupId(tableData[selectedRow].groupId);
  //     // //   setSelectedDataDataPaymentType(tableData[selectedRow].type);
  //     //   setSelectedData([tableData[selectedRow]]);
  //     //   console.log(
  //     //     'selectdsfsfsfedData __________' + tableData[selectedRow].groupId,
  //     //   );
  //     fetchSubTableData();
  //   }
  // }, [selectedRow]);

  const handleRefresh = () => {
    setTimeout(() => {
      navigation.replace('DocumentApproverMain');
    }, 1000);
  };

  const fetchMainTableData = async () => {
    try {
      //   setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      // Construct the URL
      const url = `${API_URL}/api/documentApproval/all`;
      console.log('Fetching data from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        handleSessionExpired();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data main:::', data);
      setTableData(data);
      // setFilteredMainData(data); // Initialize filtered data
    } catch (error) {
      console.error('Error fetching table data date:', error);
    } finally {
      //   setIsLoading(false);
    }
  };
  // Second table
  // const fetchSubTableData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const credentials = await Keychain.getGenericPassword({service: 'jwt'});
  //     const token = credentials.password;
  //     console.log('token with berarer issue sub data : ', `${token}`);
  //     console.log(
  //       ' selectedDataDocumentId sdggf',
  //       JSON.stringify(tableData[selectedRow].documentId),
  //     );

  //     const response = await fetch(
  //       `${API_URL}/api/documentApproval/documentData?docId=${tableData[selectedRow].documentId}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `${token}`,
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       setIsLoading(true);

  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log(
  //       'response documentAp sub table adv : ===============>>>>>>>>>> ',
  //       data,
  //     );

  //     //   Sort the keys of each object in paymentIssueGroupSubTableData in ascending order
  //     const sortedData = data.map(item => {
  //       return Object.keys(item)
  //         .sort() // Sort keys alphabetically
  //         .reduce((acc, key) => {
  //           acc[key] = item[key]; // Rebuild object with sorted keys
  //           return acc;
  //         }, {});
  //     });

  //     //   setSelectedSubData([]); // Clear previous data
  //     setSelectedSubData(sortedData); // Set sorted data
  //   } catch (error) {
  //     console.error('Error fetching table sub data:', error);
  //   } finally {
  //     setIsLoading(false);
  //     // Always hide loading indicator after login attempt (success or failure)
  //   }
  // };

  // const fetchBlobData = async index => {
  //   try {
  //     setIsDownloadLoading(true);
  //     setDownloadProgress(0); // Reset progress before starting

  //     // Fetch token (ensure that token exists and is valid)
  //     const credentials = await Keychain.getGenericPassword({service: 'jwt'});
  //     if (!credentials) {
  //       throw new Error('No credentials found');
  //     }

  //     const token = credentials.password;
  //     const url = `http://localhost:8100/rest/approval/viewpdffilemain/`; // API URL

  //     const requestBody = {
  //       trans_id: 173,
  //       table_refname: '',
  //       file_name: '4945_Detailed.pdf',
  //       file_chooser_col_name: 'FOR_SIGN_DOC',
  //       custom_master_id: 257,
  //     };

  //     // Use RNFetchBlob to download the file
  //     const {config, fs} = RNFetchBlob;
  //     const downloadDir = fs.dirs.DownloadDir; // Save to download directory

  //     console.log('Starting download from:', url);

  //     const response = await RNFetchBlob.config({
  //       fileCache: false, // Disable caching to force re-download every time
  //       appendExt: 'pdf', // Use pdf extension
  //       path: `${downloadDir}/HarnessERP/document_${selectedSubData[index].docSubId}.pdf`, // Save with proper file name
  //     })
  //       .fetch('POST', url, {
  //         Authorization: `${token}`,
  //         'Content-Type': 'application/octet-stream', // Ensure binary stream
  //       })
  //       .progress((received, total) => {
  //         // Log received bytes and total bytes
  //         console.log(`Received: ${received}, Total: ${total}`);

  //         if (total > 0) {
  //           // Calculate and update download progress
  //           let progressPercent = Math.floor((received / total) * 100);
  //           setDownloadProgress(progressPercent);
  //           console.log('Download progress:', progressPercent, '%');
  //         }
  //       });

  //     const statusCode = response.info().status;

  //     if (statusCode === 200) {
  //       const filePath = response.path(); // Get file path after download
  //       console.log('File downloaded successfully to:', filePath);

  //       // Optionally open the file after download (Android only)
  //       RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
  //     } else {
  //       console.error('Error: File download failed with status', statusCode);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching and downloading the file:', error);
  //   } finally {
  //     setIsDownloadLoading(false);
  //     setDownloadProgress(0); // Reset progress when done
  //   }
  // };

  const fetchBlobData = async (index, selectedFileName) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Permission denied for writing the file on your device.',
        );
        return;
      }

      if (hasPermission) {
        setIsDownloadLoading(true);
        setDownloadProgress(0); // Reset progress before starting

        // Fetch token (ensure that token exists and is valid)
        const credentials = await Keychain.getGenericPassword({service: 'jwt'});
        if (!credentials) {
          throw new Error('No credentials found');
        }

        console.log('fkjoa888a8sh  : ', fetchedFileChooserColName);
        const requestBody = {
          trans_id: selectedSubData.documentId,
          table_refname: '',
          // file_name: `${selectedSubData.fileMetaData[0]?.fileName}.pdf`,
          file_name: selectedFileName,
          file_chooser_col_name: fetchedFileChooserColName[1],
          custom_master_id: 257,
        };
        console.log(
          'blob api request body : ',
          '0=>>',
          selectedSubData,
          '1 =>>>> ',
          selectedSubData.documentId,
          '2=>>',
          `${selectedSubData.fileMetaData[0]?.fileName}.pdf`,
          '3==> ',
          fetchedFileChooserColName[1],
        );
        // const requestBody = {
        //   trans_id: 173,
        //   table_refname: '',
        //   file_name: '4945_Detailed.pdf',
        //   file_chooser_col_name: 'FOR_SIGN_DOC',
        //   custom_master_id: 257,
        // };
        console.log('request body 39048923840 : ', requestBody);
        const token = credentials.password;
        const url = `${API_URL}/api/documentApproval/viewpdffilemain`; // API URL

        //getting file

        // Fetch the required data using the hook at the top level

        // Use RNFetchBlob to download the file
        const {config, fs} = RNFetchBlob;
        const downloadDir = fs.dirs.DownloadDir; // Save to download directory

        console.log('Starting download from:', url);

        const response = await RNFetchBlob.config({
          fileCache: false, // Disable caching to force re-download every time
          appendExt: 'pdf', // Use pdf extension
          path: `${downloadDir}/HarnessERP/document_${selectedSubData[index]?.documentId}_${selectedSubData[index]?.fileMetaData?.fileName}.pdf`, // Save with proper file name
        })
          .fetch(
            'POST',
            url,
            {
              Authorization: `${token}`, // Add token here with Bearer prefix if needed
              'Content-Type': 'application/json', // Set JSON content type
            },
            JSON.stringify(requestBody),
          ) // Pass the request body here as JSON
          .progress((received, total) => {
            // Log received bytes and total bytes
            console.log(`Received: ${received}, Total: ${total}`);

            if (total > 0) {
              // Calculate and update download progress
              let progressPercent = Math.floor((received / total) * 100);
              setDownloadProgress(progressPercent);
              console.log('Download progress:', progressPercent, '%');
            }
          });

        const statusCode = response.info().status;

        if (statusCode === 200) {
          // const filePath = response.path(); // Get file path after download
          // console.log('File downloaded successfully to:', filePath);

          // Optionally open the file after download (Android only)
          // RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');

          const responseData = await response.json(); // Assuming response is JSON array
          const fileName = responseData[0];
          const fileType = responseData[1];
          const base64Data = responseData[2]; // Base64 encoded file content

          const {fs} = RNFetchBlob;
          const downloadDir = `${fs.dirs.DownloadDir}/HarnessERP`;
          console.log('download dir : et4wt42wt542w5', downloadDir);
          const filePath = `${downloadDir}/${fileName}`;

          // Decode Base64 and write to file
          await fs.writeFile(filePath, base64Data, 'base64');
          console.log('File downloaded and saved to:', filePath);

          // Optionally open the file after download (Android only)
          // RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
          openFile(filePath);
        }
      } else {
        console.error('Error: File download failed with status', statusCode);
      }
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try again.');
      console.error('Error fetching and downloading the file:', error);
    } finally {
      setIsDownloadLoading(false);
      setDownloadProgress(0); // Reset progress when done
    }
  };

  const fetchSubTableData = async docId => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue sub data : ', `${token}`);
      // console.log(
      //   ' selectedDataDocumentId sdggf',
      //   JSON.stringify(filteredMainData[selectedRow].documentId),
      // );

      const requestBody = {
        qu: `
      select doc_id, ref_no, doc_type, doc_desc, doc_remarks, uploaded_by, 
      to_char(uploaded_date, 'DD-MON-YYYY'), 'For-Sign' as signed_doc, for_sign_doc 
      from docs_sub_forsign 
      where doc_id = ${docId} 
      union all 
      select a.doc_id, b.ref_no, coalesce(a.a_doc_type, '-') as doc_type, 
      a.a_doc_desc, a.a_doc_remarks, a.a_uploaded_by, 
      to_char(a.a_uploaded_date, 'DD-MON-YYYY'), 'Approved' as signed_doc, 
      approved_doc 
      from docs_approved_sign a 
      left join docs_sub_forsign b on a.doc_id = b.doc_id and a.a_id = b.id 
      where a.doc_id = ${docId}
    `,
        jfilechooser_col_index: [['8', 'Uploaded Documents']],
        approval: -1,
        fs_file_path: ['/opt/tomcat/Approved_Documents'],
      };

      const response = await fetch(
        `${API_URL}/api/documentApproval/viewfiletopdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        setIsLoading(true);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        'response documentAp sub table adv : ===============>>>>>>>>>> ',
        data,
      );
      setSubTableData(data);

      //   Sort the keys of each object in paymentIssueGroupSubTableData in ascending order
      // const sortedData = data.map(item => {
      //   return Object.keys(item)
      //     .sort() // Sort keys alphabetically
      //     .reduce((acc, key) => {
      //       acc[key] = item[key]; // Rebuild object with sorted keys
      //       return acc;
      //     }, {});
      // });

      //   setSelectedSubData([]); // Clear previous data
      // setSelectedSubData(sortedData); // Set sorted data
    } catch (error) {
      console.error('Error fetching table sub data:', error);
    } finally {
      setIsLoading(false);
      // Always hide loading indicator after login attempt (success or failure)
    }
  };

  const handleMainTableDataSelect = selectedIndex => {
    setSelectedMainTableRowIndex(selectedIndex);
  };

  const handleHomeScreen = () => {
    navigation.navigate('HomeScreen');
  };

  const showDownloadToast = fileName => {
    // Showing toast when button is pressed while disabled
    console.log('SHowing toast...for download...Pdf');
    ToastAndroid.showWithGravity(
      `Downloading... ${fileName}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const openFile = async filePath => {
    try {
      await FileViewer.open(filePath, {
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

  return (
    <SafeAreaView style={{flex: 1, padding: 10}}>
      <TitleBar
        text="Document Approval"
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showRefreshIcon={true}
        onRefreshPress={handleRefresh}
        showCloseIcon={true}
        onClose={handleHomeScreen}
        //   showFileIcon={true}
        // onFilePress={handleFile}
        //   showFilterIcon={true}
        //   onFilterPress={()=>setFilterModalVisible(true)}
        contentContainerStyle={{flexGrow: 1}}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        {/* MAIN TABLE */}
        <View style={{flex: 1, marginBottom: 10}}>
          <View style={{height: '80%'}}>
            <Text style={styles.tableTitle}>Document List</Text>
            {tableData.length > 0 && (
              <View
                style={{
                  flex: 1,
                  // marginTop: 10,
                  maxHeight: 350,
                }}>
                <DocumentApprovalTableComponent
                  key={tableData.length} // Using tableData length to trigger re-render
                  initialData={tableData}
                  onRowIndexSelect={value => {
                    console.log(
                      'slected item doc id: ',
                      tableData[value].documentId,
                    );
                    if (tableData[value].documentId) {
                      handleMainTableDataSelect(value);
                    }
                    setShowUploadedDocuments(false);
                    setIsLoading(true);
                    setSubTableData([]);
                    console.log('selectedRow_____', value);
                  }}
                  noModel={false}
                  // style={{marginTop: 20}}
                />
              </View>
            )}
          </View>
        </View>
        {/* ---Second Main Table---*/}

        {/* Loading Indicator */}
        {isLoading && (
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator
                size="small"
                color={CustomThemeColors.primary}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: CustomThemeColors.primary,
                  fontWeight: '400',
                }}>
                Loading...
              </Text>
            </View>
          </View>
        )}

        {/* Documents Details Table */}
        {subTableData.length > 0 && (
          <View style={{flex: 1, marginBottom: 10}}>
            <View style={{height: '60%'}}>
              <View
                style={{
                  flex: 1,
                  // marginTop: 10,
                  maxHeight: 350,
                }}>
                <Text style={styles.tableTitle}>Document Details</Text>
                <DocumentApprovalTableComponent
                  // key={selectedSubRow} // Adding a unique key to force re-render when selectedData changes
                  key={JSON.stringify(subTableData)}
                  initialData={subTableData}
                  onRowIndexSelect={index => {
                    console.log('Row selected:', index);
                    console.log(
                      'Data for selected row:',
                      selectedSubData[index],
                    );
                    setSelectedSubRow(selectedSubData[index]);
                    setSelectedSubRowIndex(index);
                    setIsDownloadButton(true);
                    setSelectedSubData(subTableData[index]);
                    setShowUploadedDocuments(true);
                    //   setCurrentModalPage(0);
                  }}
                  excludeColumns={['fileMetaData', 'documentId']}
                  noModel={false}
                  showCheckBox={false}
                />
              </View>
            </View>
          </View>
        )}
        {/* Uploaded Documents */}
        <View style={{flex: 1}}>
          {showUploadedDocuments && (
            <View style={{marginTop: '0%'}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text style={styles.tableTitle}>Uploaded Documents </Text>
                  </View>
                  <View style={styles.uploadedDocsCountBadge}>
                    <Text style={styles.uploadedDocsCountUnseenText}>
                      {`${selectedSubData.fileMetaData.length}`}
                    </Text>
                  </View>
                </View>
                <SafeAreaView
                  style={{
                    alignItems: 'center',
                    marginTop: 10,
                    marginLeft: 5,
                    flexDirection: 'row',
                  }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true} // Hide horizontal scroll indicator (optional)
                    contentContainerStyle={{flexDirection: 'row'}}>
                    {selectedSubData.fileMetaData?.map((file, index) => (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            fetchBlobData(
                              selectedSubRowIndex,
                              `${file.fileName}.pdf`,
                            );
                            showDownloadToast(`${file.fileName}.pdf`);
                          }}
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            backgroundColor: CustomThemeColors.primary,
                            borderRadius: 20,
                            paddingHorizontal: 5,
                            marginLeft: 5,
                          }}>
                          <View
                            key={index}
                            style={{margin: 5, flexDirection: 'row'}}>
                            <Image
                              source={pdfPreviewImage}
                              style={{width: 20, height: 20, borderRadius: 10}} // Set borderRadius for the image
                              resizeMode="contain"
                              onError={error => {
                                console.log(
                                  'image error: 89757285892 : ',
                                  error,
                                );
                                setImageError(true);
                              }}
                            />
                            <Text
                              style={{
                                marginLeft: 5,
                                color: 'white',
                                maxWidth: 150,
                              }}
                              numberOfLines={1} // Limits text to one line
                              ellipsizeMode="tail" // Adds "..." at the end if text is too long
                            >
                              {file.fileName}.pdf
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {isDownloadLoading && (
                          // <View style={{alignItems: 'center'}}>
                          //   <Text>Downloading... {downloadProgress}%</Text>
                          //   {/* You can also use a progress bar here */}
                          // </View>
                          <></>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </SafeAreaView>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tableTitle: {
    fontSize: 18, // Larger font size for emphasis
    fontWeight: '500', // Bold text to make it stand out
    color: '#333', // Dark color for better readability
    paddingVertical: 5, // Padding above and below the text for spacing
    textAlign: 'left', // Center-align the title
    marginTop: 5, // Additional margin on top if needed
    // borderBottomWidth: 1, // Optional: border to visually separate title from table
    // borderBottomColor: '#ccc', // Light border color for a subtle effect
  },
  uploadedDocsCountBadge: {
    marginTop: 3,
    minWidth: 25,
    backgroundColor: '#009E60',
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 40,
  },
  uploadedDocsCountUnseenText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DocumentApproverMain;
