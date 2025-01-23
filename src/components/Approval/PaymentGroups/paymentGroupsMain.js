import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import TitleBar from '../../common-utils/TitleBar';
import {API_URL} from '../../ApiUrl';
import * as Keychain from 'react-native-keychain';
import {sharedData} from '../../Login/UserId';
import CustomButton from '../../common-utils/CustomButton';
import {CustomThemeColors} from '../../CustomThemeColors';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import CustomModal from '../../common-utils/modal';

const {width} = Dimensions.get('window');
const isMobile = width < 768;

const PaymentGroupsMain = ({route}) => {
  const {transName, transId, status} = route.params || {};
  console.log('item form appproval screen', transName, transId, status);
  const navigation = useNavigation();
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMainData, setPaymentMainData] = useState([]);
  console.log('paymentMainData>>>', paymentMainData);

  const groupId = paymentMainData.GROUP_ID;
  console.log('grpId>>>', groupId);
  const type = paymentMainData.PAYMENT_TYPE;
  console.log('type>>>', type);

  const [paymentSubData, setPaymentSubData] = useState([]);
  console.log('paymentSubData>>>', paymentSubData);
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  useEffect(() => {
    fetchPaymentMainData();
    fetchPaymentSubData();
  }, [groupId, type]);

  useEffect(() => {
    fetchPaymentSubData();
  }, []);

  // Fetch Data For Main Screen - Main Data
  const fetchPaymentMainData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials?.password;

      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/approval/paymentGroup/getApprovalDetails?trans_id=${transId}&user_id=${sharedData.userName}&status=${status}&trans_name=${transName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data of Maindata>>>', data);
      const approvalDetails = JSON.parse(data.Approval_Details);
      const transData = JSON.parse(approvalDetails.transobj);
      const finalTransData = transData[0][0][0];
      setPaymentMainData(finalTransData);
      console.log('data of payment Main data>>>', finalTransData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Data For Main Screen - Sub Data
  const fetchPaymentSubData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials?.password;

      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/approval/paymentGroup/getpaygrpDetails?group_id=${groupId}&type=${type}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data of Subdata>>>', data);
      // const approvalDetails = JSON.parse(data.Approval_Details);
      // const transData = JSON.parse(approvalDetails.transobj);
      const finalTransData = data;
      setPaymentSubData(finalTransData);
      console.log('data of payment Main data>>>', finalTransData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  //----------------------------------- Need to Work has 5 Payment ---------------------------------------------------------------------------
  // PrintPaymentdGroupPDF
  const PrintGroupPdf = async () => {
    let apiurl = ``;
    let requestbody = '';

    // if (selectedDataPaymentType == 'Advance Payment') {
    apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
    requestbody = JSON.stringify({
      jcmb_OrderBy: selectedPaymentType,
      numberFm: '.90',
      user: sharedData.userName,
      group_id: [groupId],
      sst_groupTable: [],
      payDetailData: [],
      HMGroupDetails: {},
    });

    console.log('url>>>', apiurl, '---', 'requestbody>>>', requestbody);
    const fileName = await PrintDetailedPaymentPDF(apiurl, requestbody);
    console.log('filename group>>>>>>>', fileName);
    // downloadPdfFile(fileName);
    if (fileName) {
      downloadAndViewPdf(fileName);
    }
  };

  // PDF Print Data
  const PrintDetailedPaymentPDF = async (apiurl, requestbody) => {
    try {
      setIsLoading(true);

      // Retrieve token for authorization
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      if (!credentials) {
        throw new Error('Authorization credentials not found.');
      }
      const token = credentials.password;
      console.log('Token with Bearer printPdf:', token);

      // Make the request to get the PDF as blob data
      const response = await fetch(
        // `${API_URL}/api/issueGroup/paysheetprintdetailedpdf_Group`,
        apiurl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: requestbody,
        },
      );

      console.log('response for tax apyment pdf', response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response as blob data
      const blobData = await response.json();
      console.log('blob data', blobData);
      const fileNameWithExtention = blobData[1];
      console.log('Extracted filename:', fileNameWithExtention);
      // Create a URL for the blob object to allow downloading or preview
      const fileName = fileNameWithExtention.trim().replace(/\.pdf$/, ''); // Removes the .pdf extension
      console.log('Filename without extension:', fileName);

      //     // Use RNFetchBlob to download the file
      const {config, fs} = RNFetchBlob;
      const downloadDir = fs.dirs.DownloadDir; // Save to download directory
      console.log('downloadDir', downloadDir);

      console.log('Starting download from:', blobData);
      const folderPath = `${downloadDir}/HarnessERP/`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath); // Create the directory if it doesn't exist
        console.log('Folder created: ', folderPath);
      }

      downloadAndViewPdf(fileName);
    } catch (error) {
      console.error(
        'Error fetching and downloading the file detailed tax:',
        error,
      );
    } finally {
      setIsDownloadLoading(false);
      setDownloadProgress(0); // Reset progress when done
    }
  };

  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0); // To store the progress percentage

  const downloadAndViewPdf = async fileName => {
    const fileNamePrefix = 'app_paygrp';
    try {
      setIsLoading(true);
      setIsDownloadLoading(true);
      setDownloadProgress(0); // Reset progress before starting

      // Fetch token (ensure that token exists and is valid)
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      if (!credentials) {
        throw new Error('No credentials found');
      }

      const token = credentials.password;
      const url = `${API_URL}/api/issueGroup/downloadFile/${fileName}`; // API URL

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
          Authorization: `${token}`,
          'Content-Type': 'application/octet-stream', // Ensure binary stream
        })
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
        RNFetchBlob.android.actionViewIntent(filePath, 'application/pdf');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error('Error: File download failed with status', statusCode);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching and downloading the file:', error);
    } finally {
      setIsLoading(false);
      setIsDownloadLoading(false);
      setDownloadProgress(0); // Reset progress when done
    }
  };

  return (
    <>
      <TitleBar
        text={transName}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        // showRefreshIcon={true}
        // onRefreshPress={handleRefresh}
        showFileIcon={true}
        onFilePress={() => setPDFModalVisible(true)}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
      />
      <Modal
        visible={PDFModalVisible}
        onRequestClose={() => setPDFModalVisible(false)}
        transparent={true}>
        <View style={styles.modalContainer}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 5,
              borderRadius: 15,
              marginBottom: 10,
              backgroundColor: '#eef0f1',
            }}>
            <Text
              style={[
                styles.optionText,
                {marginBottom: 4, fontSize: 16, padding: 5},
              ]}>
              Print Payment Group PDF
            </Text>
            <Text style={[{marginBottom: 4, fontSize: 14, padding: 5}]}>
              Report Order By
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => {
                  setIsLoading(true);
                  setPDFModalVisible(false);
                  setSelectedPaymentType('Payment Id');
                  PrintGroupPdf();
                }}
                style={styles.pdfSubOption}>
                <Text style={styles.subOptionText}>Payment Id</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsLoading(true);
                  setPDFModalVisible(false);
                  setSelectedPaymentType('Payment Mode');
                  PrintGroupPdf();
                }}
                style={styles.pdfSubOption}>
                <Text style={styles.subOptionText}>Payment Mode</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPDFModalVisible(false);
                setIsLoading(false);
              }}>
              <View
                style={{
                  alignContent: 'center',
                  alignItems: 'center',
                  height: 50,
                }}>
                <CustomButton>Close</CustomButton>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container}>
        {/* First Container */}
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.headText}>Payment Type</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bodyText}>{paymentMainData.PAYMENT_TYPE}</Text>
          </View>
        </View>
        {/* Second Container */}
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.headText}>No of payment</Text>
            <Text style={styles.headText}>Total Value</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bodyText}>
              {paymentMainData.NO_OF_PAYMENTS}
            </Text>
            <Text style={styles.bodyText}>
              {paymentMainData.TOTAL_PAYMENT_VALUE} {paymentMainData.CURRENCY}
            </Text>
          </View>
        </View>
        {/* Third Container */}
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.headText}>Created on</Text>
            <Text style={styles.headText}>Created by</Text>
            <Text style={styles.headText}>Group Issue Status</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bodyText}>
              {paymentMainData.GRP_CREATED_ON}
            </Text>
            <Text style={styles.bodyText}>
              {paymentMainData.GRP_CREATED_BY}
            </Text>
            <Text style={styles.bodyText}>{paymentMainData.STATUS}</Text>
          </View>
        </View>
        {/* New Container for Key-Value Pairs */}
        <View style={styles.middleContainer}>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Payment Group ID</Text>
            <Text style={styles.valueText}>{paymentMainData.GROUP_ID}</Text>
          </View>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Grp Ref Label</Text>
            <Text style={styles.valueText}>{paymentMainData.REFERENCE}</Text>
          </View>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Remarks</Text>
            <Text style={styles.valueText}>{paymentMainData.REMARKS}</Text>
          </View>
          {transName !== 'AddPaymentGroup' && (
            <View style={styles.keyValueRow}>
              <Text style={styles.keyText}>Reason For Modify</Text>
              <Text style={styles.valueText}>
                {paymentMainData.REASON_FOR_MOD_DEL}
              </Text>
            </View>
          )}
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Approver Remarks</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter remarks"
              value={remarks}
              onChangeText={setRemarks}
            />
          </View>
        </View>
        {/* Header */}
        {/* Content */}
        <Text style={styles.headerHeadText}>Paysheet Payment Details</Text>
        <View style={{marginBottom: 20}}>
          {paymentSubData.map(paymentData => (
            <TouchableOpacity
            style={{marginBottom:10}}
              onPress={() =>
                navigation.navigate('PaymentGroupsDetails', {
                  transName: route.params.transName,
                  paymentType: paymentMainData.PAYMENT_TYPE,
                  groupId: paymentData[0],
                })
              }>
              <View style={[styles.content]}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>{paymentData[3]}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  {/* Text Information Section */}
                  <View>
                    <View style={styles.line}>
                      <Text style={styles.lineText}>
                        ID: {paymentData[0]} | Date: {paymentData[1]} |
                      </Text>
                    </View>
                    <View style={styles.line}>
                      <Text style={styles.lineText}>
                        {paymentData[4]} | {paymentData[15]}: {paymentData[8]} |
                        Date: {paymentData[17]}
                      </Text>
                    </View>
                    <View style={styles.line}>
                      <Text style={styles.lineText}>
                        Paid Value: {paymentData[12]} {paymentData[13]} | Fx
                        rate: {paymentData[14]}
                      </Text>
                    </View>
                    <View style={styles.line}>
                      <Text style={styles.lineText}>
                        {transName === 'AddPaymentGroup' &&
                          `No of Employees: ${paymentData[2]} | `}
                        {paymentData[6]} | {paymentData[5]}
                      </Text>
                    </View>
                    <View style={styles.line}>
                      <Text style={styles.lineText}>
                        Narration: {paymentData[7]}
                      </Text>
                    </View>
                  </View>

                  {/* Arrow & Amount Section */}
                  <View style={styles.amountRow}>
                    <MaterialIcons
                      name="arrow-forward"
                      size={24}
                      color="#3788E5"
                      style={styles.arrow}
                    />
                    <View style={styles.amountContainer}>
                      <Text style={styles.amountText}>
                        {paymentData[11]} {paymentData[9]}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setIsModalVisible(!isModalVisible)}>
                      <MaterialIcons
                        name="menu"
                        size={24}
                        color="#3788E5"
                        style={styles.DetailsMenu}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <CustomModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(!isModalVisible)}
          title="Select an Option">
          <TouchableOpacity
            onPress={() => {
              console.log('hiii');
            }}
            style={styles.option}>
            <Text style={styles.optionText}>Print Payment PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('hiii');
            }}
            style={styles.option}>
            <Text style={styles.optionText}>Print Detailed Payment PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('hiii');
            }}
            style={styles.option}>
            <Text style={styles.optionText}>Remove Payment</Text>
          </TouchableOpacity>
        </CustomModal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  box: {
    // borderWidth: 1,
    // borderColor: '#3788E5',

    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 5,
  },
  middleContainer: {
    marginHorizontal: 5,
    borderColor: '#3788E5',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  column: {
    // flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  headText: {
    fontSize: isMobile ? 12 : 14,
    fontWeight: 'bold',
    color: '#2d2d2d',
    textAlign: 'center',
    flex: 1,
  },
  bodyText: {
    fontSize: isMobile ? 12 : 14,
    color: '#3788E5',
    textAlign: 'center',
    flex: 1,
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingVertical: 10,
  },
  keyText: {
    fontSize: isMobile ? 12 : 14,
    fontWeight: '500',
    color: '#555',
    flex: 1,
    textAlign: 'left',
  },
  valueText: {
    fontSize: isMobile ? 12 : 14,
    color: '#3788E5',
    flex: 1,
    textAlign: 'right',
  },
  header: {
    backgroundColor: '#3788E5',
    // padding: 10,
    borderRadius: 8,
    // marginBottom: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: isMobile ? 16 : 18,
    color: 'white',
    fontWeight: 'bold',
  },
  headerHeadText: {
    fontSize: isMobile ? 16 : 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#3788E5',
    // flexDirection:'column'
  },
  line: {
    marginVertical: 5,
  },
  lineText: {
    fontSize: 14,
    color: '#555',
  },
  amountRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  arrow: {
    marginRight: 10,
  },
  DetailsMenu: {
    marginRight: 10,
    width: 6,
  },
  amountContainer: {
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3788E5',
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    padding: 0,
    // marginTop: 10,
    // borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    height: '40%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionText: {color: 'black', fontWeight: 'bold'},
  selectedOption: {
    padding: 10,
    backgroundColor: '#d3f3d3', // Change this color as needed
    borderColor: '#4caf50',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  pdfSubOption: {
    width: '45%',
    padding: 10,
    backgroundColor: 'white',
    borderColor: CustomThemeColors.primary,
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 10,

    color: 'black',
  },
  subOptionText: {color: 'black', fontWeight: '400'},
  optionText: {color: 'black', fontWeight: 'bold'},
  selectedOption: {
    padding: 10,
    backgroundColor: '#d3f3d3', // Change this color as needed
    borderColor: '#4caf50',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  option: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    color: 'black',
  },
  optionText: {color: 'black', fontWeight: 'bold'},
});

export default PaymentGroupsMain;
