import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import {Image} from 'react-native-elements';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import TitleBar from '../common-utils/TitleBar';
import {CustomThemeColors} from '../CustomThemeColors';
import {API_URL} from '../ApiUrl';
import * as Keychain from 'react-native-keychain';
import pdfPreviewImage from '../../images/pdfimage.jpg';
import ApprovalDateFilter from './ApprovalDateFilter';
import SearchComponent from './SearchComp';
import commonStyles from './ApprovalCommonStyles';
import CustomModal from '../common-utils/modal';
import DeviceInfo from 'react-native-device-info';
import {sharedData} from '../Login/UserId';
import {BlobFetchComponent} from '../common-utils/BlobFetchComponent';
import axios from 'axios';
import LoadingIndicator from '../commonUtils/LoadingIndicator';
import LottieView from 'lottie-react-native';
import generatingPdfAnimationJSON from '../assets/animations/generating-pdf-animation.json';

const {width, height} = Dimensions.get('window');

export let wholedata = {};

const ApprovalScreen = () => {
  const navigation = useNavigation();
  const [approvalListData, setApprovalListData] = useState([]);
  const [filteredApprovalData, setFilteredApprovalData] = useState([]);
  const [tempFilteredApprovalData, setTempFilteredApprovalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHorseLoading, setIsHorseLoading] = useState(false);
  const [BillsPDFModalVisible, setBillsPDFModalVisible] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [AdvPDFModalVisible, setAdvPDFModalVisible] = useState(false);
  const [taxPDFModalVisible, setTaxPDFModalVisible] = useState(false);
  const [paySheetPDFModalVisible, setPaySheetPDFModalVisible] = useState(false);
  const [transValue, setTransValue] = useState([]);
  const [itemValues, setItemValues] = useState([]);

  //paysheeet payment - Kesaven
  const [transName, setTransName] = useState();
  const [isPaysheetData, setPaysheetData] = useState([]);
  const [paymentId, setPaymentId] = useState();
  const [isIndexed, setIndexed] = useState();
  const [isFilteredData, setFilteredData] = useState();
  const [empCount, setEmpCount] = useState(0);

  useEffect(() => {
    console.log('approvalData>>>', wholedata);
  }, [wholedata]);

  useEffect(() => {
    console.log('transValue apMain::');
  }, [transValue]);

  const closeModalPDF = () => {
    setBillsPDFModalVisible(false);
    setAdvPDFModalVisible(false);
    setPDFModalVisible(!PDFModalVisible);
    setTaxPDFModalVisible(false);
  };

  const currentDate = new Date();

  // Calculate current date minus 30 days
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 183);

  // useEffect(() => {
  //   console.log('482984239492 : ');
  //   fetchApprovalList();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('Navigated back to ComponentA');
      fetchApprovalList();
    }, []),
  );

  // Format the dates as 'DD-MMM-YY'
  const formatDate = date => {
    const options = {year: '2-digit', month: 'short', day: '2-digit'};
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
      date,
    );

    // Replace any non-alphanumeric character (like commas) with a space
    return formattedDate.replace(/[^a-zA-Z0-9 ]+/g, '-');
  };

  const [formattedStartDate, setFormattedStartDate] = useState(
    formatDate(startDate),
  );
  const [formattedEndDate, setFormattedEndDate] = useState(
    formatDate(currentDate),
  );
  const [tempFormattedStartDate, setTempFormattedStartDate] = useState(
    formatDate(startDate),
  );
  const [tempFormattedEndDate, setTempFormattedEndDate] = useState(
    formatDate(currentDate),
  );
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useEffect(() => {
    console.log('approval formattedStartDate::', formattedStartDate);
    fetchApprovalList();
  }, [formattedStartDate]);

  useEffect(() => {
    console.log('approval formattedEndDate::', formattedEndDate);
    fetchApprovalList();
  }, [formattedEndDate]);

  // Fetch Approval List Data
  const fetchApprovalList = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials?.password;

      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/approval/common/getApprovallist?user_id=admin&from_date=${formattedStartDate}&to_date=${formattedEndDate}`,
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
      setApprovalListData(data);
      console.log('data:::::', data);

      // paysheet payment - kesaven
      const paymentIds = data
        .filter(item => item.TRANS_NAME.slice(3) === 'PaysheetPayment')
        .map(item => {
          const match = item.IDENTIFICATION.match(
            /(?:Payment Id|payment_id)\s*=\s*(\d+)/i,
          );
          return match ? match[1] : null; // Extracted ID or null
        })
        .filter(id => id !== null); // Remove null values

      console.log('paymentIds:', paymentIds);

      // setPaymentId(paymentIds)

      fetchPaysheetData(paymentIds);

      const filteredData = data.filter(item =>
        [
          'AddPaymentGroup',
          'ModPaymentGroup',
          'DelPaymentGroup',
          'AddPayment',
          'ModPayment',
          'CancelPayment',
          'AddDocumentApproval',
          'ModDocumentApproval',
          'AddPaysheetPayment',
          'ModPaysheetPayment',
          'CanPaysheetPayment',
          // 'AddBankTrans',
          // 'AddThirdPartyBankAcc',
        ].includes(item.TRANS_NAME),
      );
      console.log('Ap filteredData:::', filteredData);
      setFilteredApprovalData(filteredData);
      setTempFilteredApprovalData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPaymentDetails = async (transId, transName) => {
    try {
      // setIsHorseLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      console.log('parsedTransObj ApMain::');
      const response = await axios.get(
        `${API_URL}/api/approval/payment/getApprovalDetails`,
        {
          params: {
            trans_id: transId,
            user_id: sharedData.userName,
            status: 'initiated',
            trans_name: transName,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      const approvalDetailsRaw = response.data?.Approval_Details;
      // console.log("approval Hole data::",response.data)
      if (approvalDetailsRaw) {
        const approvalDetails = JSON.parse(approvalDetailsRaw);
        const {transobj} = approvalDetails;

        if (typeof transobj === 'string') {
          const parsedTransObj = JSON.parse(transobj);
          setTransValue(parsedTransObj);
          console.log('parsedTransObj ApMain::', parsedTransObj);
        }
      }
    } catch (error) {
      console.error('Error fetching approval details:', error.message);
    }
    // finally {
    //   setIsHorseLoading(false);
    // }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchApprovalList();
  };

  const handleHomeScreen = () => {
    navigation.navigate('HomeScreen');
  };

  // paysheet payment - kesaven
  async function fetchPaysheetData(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      console.error('Invalid IDs: Expected a non-empty array.');

      return null;
    }

    const formattedIds = ids.map(id => parseInt(id, 10)).join(', '); // Convert array to comma-separated values

    setFilteredData(formattedIds);

    const url = `${API_URL}/api/common/loadVectorwithContentsjson`;

    const payload = {
      query: `WITH PaymentCounts AS (

            SELECT PAYMENT_ID, COUNT(*) AS payment_count

            FROM PAYSHEET_PAYMENT_DETAILS

            WHERE PAYMENT_ID IN (${formattedIds})

            GROUP BY PAYMENT_ID

        ),

        Earnings AS (

            SELECT ppd.PAYMENT_ID, MAX(e.EARNING_NAME) AS earnings

            FROM PAYSHEET_PAYMENT_DETAILS ppd

            JOIN PAYSHEET_DETAILS pd ON ppd.PAYSHEET_ID = pd.PAYSHEET_ID

            JOIN EARNING e ON pd.EARN_ID = e.EARN_ID

            WHERE ppd.PAYMENT_ID IN (${formattedIds})

            GROUP BY ppd.PAYMENT_ID

        )

        SELECT pc.PAYMENT_ID, pc.payment_count, e.earnings

        FROM PaymentCounts pc

        LEFT JOIN Earnings e ON pc.PAYMENT_ID = e.PAYMENT_ID`,
    };

    // console.log('payload:', payload);

    try {
      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log('DATA FETCHED>>>>>', data);

      setPaysheetData(data);

      return data;
    } catch (error) {
      console.error('Error fetching paysheet data:', error);

      return null;
    }
  }

  const navigateToScreen = (
    transName,
    transId,
    status,
    identification,
    currentLevel,
    totalNoOfLevels,
  ) => {
    return () => {
      wholedata = {
        transName: transName,
        transId: transId,
        status: status,
        currentLevel: currentLevel,
        noOfLevel: totalNoOfLevels,
      };
      // appDetData.appData = wholedata;

      if (
        transName === 'AddPaymentGroup' ||
        transName === 'ModPaymentGroup' ||
        transName === 'DelPaymentGroup'
      ) {
        navigation.navigate('PaymentGroupsMain', {
          transName: transName,
          transId: transId,
          status: status,
          currentLevel: currentLevel,
          noOfLevel: totalNoOfLevels,
        });
      } else if (
        transName === 'AddPayment' ||
        transName === 'ModPayment' ||
        transName === 'CancelPayment'
      ) {
        const firstWord = identification.trim().split(' ')[0];
        if (firstWord === 'Adv') {
          navigation.navigate('AdvancePayment', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel: currentLevel,
            totalNoOfLevels: totalNoOfLevels,
          });
        } else if (firstWord === 'Bill') {
          navigation.navigate('BillsPayment', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel: currentLevel,
            totalNoOfLevels: totalNoOfLevels,
          });
        } else if (firstWord === 'Tax') {
          navigation.navigate('TaxPayment', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel: currentLevel,
            totalNoOfLevels: totalNoOfLevels,
          });
        }
        if (
          transName === 'AddDocumentApproval' ||
          transName === 'ModDocumentApproval'
        ) {
          navigation.navigate('DocumentApprovalTrans', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel: currentLevel,
          });
        }
      }

      if (
        transName === 'AddPaysheetPayment' ||
        transName === 'ModPaysheetPayment' ||
        transName === 'CanPaysheetPayment'
      ) {
        navigation.navigate('PaysheetPaymentMain', {
          transName: transName,
          transId: transId,
          status: status,
          currentLevel: currentLevel,
        });
      }

      if (transName === 'AddBankTrans') {
        navigation.navigate('BankAccountTransactionMain', {
          transName: transName,
          transId: transId,
          status: status,
          currentLevel: currentLevel,
        });
      }
    };
  };

  //paysheet payment - kesaven
  const earningNameFetcher = searchId => {
    const result = isPaysheetData.find(item => item[0] === searchId);

    return result ? result[2] : 'ID not found'; // Incorrect return statement
  };

  const empNumberFetcher = searchId => {
    const result = isPaysheetData.find(item => item[0] === searchId);

    return result ? result[1] : 'ID not found'; // Incorrect return statement
  };
  // function findArrayIndexContainingNumber(nestedArray, number) {
  //   return nestedArray.findIndex(innerArray => {
  //     // Compare as strings

  //     return innerArray.some(item => item === String(number));
  //   });
  // }

  // if (item.TRANS_NAME.slice(3) === 'PaysheetPayment') {
  //   let paymentID = item.IDENTIFICATION.split('=')[1].slice(0, -1);

  //   let index = findArrayIndexContainingNumber(isPaysheetData, paymentID);

  //   console.log('ent:', isPaysheetData[index]);

  //   setIndexed(isPaysheetData[index]);

  //   const searchId = paymentID; // Replace with the ID you want to search for

  //   infoFinder = searchId => {
  //     const result = isPaysheetData.find(item => item[0] === searchId);

  //     if (result) {
  //       console.log('result', result); // This will print the array containing the ID 303
  //     } else {
  //       console.log('ID not found');
  //     }
  //   };

  //   // const earningNameFetcher = (searchId) => {

  //   //   const result = isPaysheetData.find((item) => item[0] === searchId);

  //   //   return result ? result[2] : "ID not found"; // Returning the third column

  //   // };

  //   console.log('Display');

  //   console.log(earningNameFetcher(paymentID));

  //   // setPaysheetData([findArrayIndexContainingNumber(isPaysheetData,item.IDENTIFICATION.split("=")[1].slice(0, -1))])
  // }

  // const paymentIdToDisplay = isFilteredData; // For example, display data for payment ID 290

  const renderItem = ({item}) => {
    let formattedIdentification = item.IDENTIFICATION;

    // Debugging the original data
    console.log('Original IDENTIFICATION:', formattedIdentification);

    // Check if IDENTIFICATION matches the specific format
    if (
      formattedIdentification.startsWith('Payment Group Id=') &&
      formattedIdentification.includes('Payment Type=') &&
      formattedIdentification.includes('No of Payments=')
    ) {
      // Debugging condition match
      console.log('Formatting IDENTIFICATION:', formattedIdentification);

      // Reformat the string
      formattedIdentification = formattedIdentification
        .replace('Payment Group Id=', 'Group Id=') // Replace 'Payment Group Id=' with 'Group Id='
        .replace('Payment Type=', '') // Remove 'Payment Type='
        .replace('No of Payments=', '') // Remove 'No of Payments='
        .replace(/\s*,\s*/g, ', ') // Normalize spaces around commas
        .trim() // Trim any extra spaces
        .replace(/,([^,]*)$/, ' $1 Payments'); // Add 'Payments' to the last number

      // Debugging the transformed data
      console.log('Transformed IDENTIFICATION:', formattedIdentification);
    }

    //paysheet payment  - kesaven
    function findArrayIndexContainingNumber(nestedArray, number) {
      return nestedArray.findIndex(innerArray => {
        // Compare as strings

        return innerArray.some(item => item === String(number));
      });
    }

    if (item.TRANS_NAME.slice(3) === 'PaysheetPayment') {
      let paymentID = item.IDENTIFICATION.split('=')[1].slice(0, -1);

      let index = findArrayIndexContainingNumber(isPaysheetData, paymentID);

      console.log('ent:', isPaysheetData[index]);

      setIndexed(isPaysheetData[index]);

      const searchId = paymentID; // Replace with the ID you want to search for

      infoFinder = searchId => {
        const result = isPaysheetData.find(item => item[0] === searchId);

        if (result) {
          console.log('result', result); // This will print the array containing the ID 303
        } else {
          console.log('ID not found');
        }
      };

      // const earningNameFetcher = (searchId) => {

      //   const result = isPaysheetData.find((item) => item[0] === searchId);

      //   return result ? result[2] : "ID not found"; // Returning the third column

      // };

      console.log('Display');

      console.log(earningNameFetcher(paymentID));

      // setPaysheetData([findArrayIndexContainingNumber(isPaysheetData,item.IDENTIFICATION.split("=")[1].slice(0, -1))])
    }

    const paymentIdToDisplay = isFilteredData; // For example, display data for payment ID 290

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={navigateToScreen(
          item.TRANS_NAME,
          item.TRANS_ID,
          item.STATUS,
          item.IDENTIFICATION,
          item.CURRENT_LEVEL,
          item.NO_OF_LEVELS,
        )}>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <View style={commonStyles.flexRowNoPadd}>
              <Text style={styles.transId}>{item.TRANS_ID} | </Text>
              <Text style={styles.transName}>{item.TRANS_NAME}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.paymentText}>{formattedIdentification}</Text>
            {/* Use formatted string */}
          </View>
          {/*// paysheet payment - kesaven */}
          <View>
            {item.TRANS_NAME.slice(3) === 'PaysheetPayment' ? (
              <View style={styles.row}>
                {/* {fetchDataById(item.TRANS_ID)} */}

                <Text style={[styles.paymentText, {marginRight: 3}]}>
                  No of Emp:{' '}
                  {empNumberFetcher(
                    item.IDENTIFICATION.split('=')[1].slice(0, -1),
                  ) || ''}
                </Text>

                <Text style={styles.paymentText}>
                  Earning Name:{' '}
                  {earningNameFetcher(
                    item.IDENTIFICATION.split('=')[1].slice(0, -1),
                  ) || ''}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.row}>
            <Text style={[styles.paymentText, {marginRight: 3}]}>
              No of levels: {item.NO_OF_LEVELS}
            </Text>
            <Text style={styles.paymentText}>
              Current level: {item.CURRENT_LEVEL}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.date, {marginBottom: 10}]}>{item.ITIME}</Text>
          {(item.TRANS_NAME === 'AddPayment' ||
            item.TRANS_NAME === 'ModPayment' ||
            item.TRANS_NAME === 'CancelPayment') && (
            <TouchableOpacity
              onPress={() => {
                const firstWord = item.IDENTIFICATION.trim().split(' ')[0];
                if (firstWord == 'Bill') {
                  setBillsPDFModalVisible(true);
                } else if (firstWord === 'Adv') {
                  setAdvPDFModalVisible(true);
                } else if (firstWord === 'Tax') {
                  setTaxPDFModalVisible(true);
                } else if (firstWord === 'Payment') {
                  setPaySheetPDFModalVisible(true);
                }
                fetchPaymentDetails(item.TRANS_ID, item.TRANS_NAME);
                setItemValues(item);
              }}>
              <Image
                source={pdfPreviewImage}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      {isHorseLoading && <LoadingIndicator message="Please wait..." />}
      <TitleBar
        text="Approval"
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showRefreshIcon={true}
        onRefreshPress={handleRefresh}
        showSearchIcon={true}
        onSearchPress={() => setSearchModalVisible(true)}
        showCloseIcon={true}
        onClose={handleHomeScreen}
      />
      {searchModalVisible && (
        <SearchComponent
          onClose={setSearchModalVisible}
          data={filteredApprovalData}
          setFilteredDataApproval={setTempFilteredApprovalData}
        />
      )}
      <View style={{alignItems: 'center'}}>
        <ApprovalDateFilter
          setFormattedStartDate={setFormattedStartDate}
          setFormattedEndDate={setFormattedEndDate}
        />
      </View>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={CustomThemeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={tempFilteredApprovalData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 3}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              // refreshing={isRefreshing}
              onRefresh={fetchApprovalList} // Trigger fetchData on pull-down
              colors={[CustomThemeColors.primary]} // Customize spinner color
            />
          }
        />
      )}
      {/* Bills PDF MODAL*/}
      <CustomModal
        isVisible={BillsPDFModalVisible}
        onClose={closeModalPDF}
        title="Select an Option">
        {/* Children Content */}
        <TouchableOpacity
          onPress={async () => {
            try {
              setIsPdfLoading(true); // Set loading to true before starting the operation
              setBillsPDFModalVisible(false); // Close the modal

              const requestUrl = `${API_URL}/api/approval/payment/billspay_printPdf`;
              console.log('transvalue ApMain::', itemValues);
              const requestBody = {
                tranObject: transValue,
                trans_id: itemValues.TRANS_ID,
              };

              // Convert requestBody to a JSON string
              const requestBodyString = JSON.stringify(requestBody);
              console.log('requestBody::', requestBodyString);

              // Await the execution of BlobFetchComponent
              await BlobFetchComponent(requestUrl, requestBodyString);
            } catch (error) {
              console.error('Error executing BlobFetchComponent:', error);
            } finally {
              // Set loading to false after the operation completes, regardless of success or failure
              setIsPdfLoading(false);
            }
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Payment Id</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            try {
              setIsPdfLoading(true);
              setBillsPDFModalVisible(false); // Close the modal

              const requestUrl = `${API_URL}/api/approval/payment/billspay_printDetailedPdf`;
              const requestBody = {
                tranObject: transValue,
                trans_id: itemValues.TRANS_ID,
                company_id: 1,
              };

              // Convert requestBody to a JSON string
              const requestBodyString = JSON.stringify(requestBody);
              console.log('requestBody::', requestBodyString);

              // Await the execution of BlobFetchComponent
              await BlobFetchComponent(requestUrl, requestBodyString);
            } catch (error) {
              console.error('Error executing BlobFetchComponent:', error);
            } finally {
              // Ensure loading state is set to false after the operation
              setIsPdfLoading(false);
            }
          }}
          // onPress={() => PrintGroupPdf()}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Payment Detailed PDF</Text>
        </TouchableOpacity>
      </CustomModal>
      {/* ADVANCE PDF MODAL */}
      <CustomModal
        isVisible={AdvPDFModalVisible}
        onClose={closeModalPDF}
        title="Select an Option">
        {/* Children Content */}
        <TouchableOpacity
          onPress={async () => {
            try {
              setIsPdfLoading(true); // Set loading to true before starting the operation
              setAdvPDFModalVisible(false); // Close the modal

              const requestUrl = `${API_URL}/api/approval/payment/billspay_printPdf`;
              const requestBody = {
                tranObject: transValue,
                trans_id: itemValues.TRANS_ID,
              };

              // Convert requestBody to a JSON string
              const requestBodyString = JSON.stringify(requestBody);
              console.log('requestBody::', requestBodyString);

              // Await the execution of BlobFetchComponent
              await BlobFetchComponent(requestUrl, requestBodyString);
            } catch (error) {
              console.error('Error executing BlobFetchComponent:', error);
            } finally {
              // Set loading to false after the operation completes, regardless of success or failure
              setIsPdfLoading(false);
            }
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Print PDF</Text>
        </TouchableOpacity>
      </CustomModal>

      {/* TAX PDF MODAL*/}
      <CustomModal
        isVisible={taxPDFModalVisible}
        onClose={closeModalPDF}
        title="Select PDF Type">
        {/* Children Content */}
        <TouchableOpacity
          onPress={async () => {
            try {
              setIsPdfLoading(true); // Set loading to true before starting the operation
              setAdvPDFModalVisible(false); // Close the modal

              const requestUrl = `${API_URL}/api/approval/payment/taxpay_printPdf`;
              const requestBody = {
                tranObject: transValue,
                trans_id: itemValues.TRANS_ID,
              };

              // Convert requestBody to a JSON string
              const requestBodyString = JSON.stringify(requestBody);
              console.log('requestBody::', requestBodyString);

              // Await the execution of BlobFetchComponent
              await BlobFetchComponent(requestUrl, requestBodyString);
            } catch (error) {
              console.error('Error executing BlobFetchComponent:', error);
            } finally {
              // Set loading to false after the operation completes, regardless of success or failure
              setIsPdfLoading(false);
            }
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Print PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            try {
              setIsPdfLoading(true); // Set loading to true before starting the operation
              setAdvPDFModalVisible(false); // Close the modal

              const requestUrl = `${API_URL}/api/approval/payment/taxpay_printDetailedPdf`;
              const requestBody = {
                tranObject: transValue,
                trans_id: itemValues.TRANS_ID,
                company_id: 1,
              };

              // Convert requestBody to a JSON string
              const requestBodyString = JSON.stringify(requestBody);
              console.log('requestBody::', requestBodyString);

              // Await the execution of BlobFetchComponent
              await BlobFetchComponent(requestUrl, requestBodyString);
            } catch (error) {
              console.error('Error executing BlobFetchComponent:', error);
            } finally {
              // Set loading to false after the operation completes, regardless of success or failure
              setIsPdfLoading(false);
            }
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Print Detailed PDF</Text>
        </TouchableOpacity>
      </CustomModal>
      {/* Lottie View*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPdfLoading} //isPdfLoading
        onRequestClose={() => setIsPdfLoading(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LottieView
              source={generatingPdfAnimationJSON} // Replace with your Lottie file path
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text
              style={[styles.modalTitle, {color: 'black', fontWeight: '500'}]}>
              Generating PDF, please wait...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    marginTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  transId: {
    fontWeight: 'bold',
    color: 'black',
  },
  transName: {
    fontWeight: 'bold',
    color: CustomThemeColors.primary,
  },
  date: {
    marginLeft: 'end',
    color: 'gray',
  },
  paymentText: {
    color: 'black',
  },
  image: {
    width: 30,
    height: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfSubOption: {
    width: DeviceInfo.isTablet() ? 300 : 200,
    padding: 10,
    backgroundColor: 'white',
    paddingHorizontal: 50,
    borderColor: CustomThemeColors.primary,
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 10,

    color: 'black',
  },
  subOptionText: {color: 'black', fontWeight: '400', textAlign: 'center'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default ApprovalScreen;
