import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet} from 'react-native';
import InfoPairs from '../ApprovalComponents/InfoPairs';
import ApprovalTableComponent from '../ApprovalComponents/ApprovalTableComponent';
import commonStyles from './../ApprovalCommonStyles';
import {TextInput} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Modal} from 'react-native';
import CustomModal from '../../common-utils/modal';
import TitleBar from '../../common-utils/TitleBar';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../../ApiUrl';
import FetchValueAssignKeysAPI from '../ApprovalComponents/FetchValueAssignKeysAPI';
import {DateFormatComma} from '../../common-utils/DateFormatComma';
import {NumToWordsCon} from '../ApprovalComponents/NumToWordsCon';
import {CustomThemeColors} from '../../CustomThemeColors';
import {BlobFetchComponent} from '../../common-utils/BlobFetchComponent';
import {isTablet} from 'react-native-device-info';
import LoadingIndicator from '../../commonUtils/LoadingIndicator';
import ApproveRejectComponent from '../ApprovalComponents/ApproveRejectComponent';
import { ReqBodyConv } from './ReqBodyConv';

const {width} = Dimensions.get('window');
const isMobile = width < 768;

// Karthic Nov 25
export const BillsPayment = ({route}) => {
  const {transName, transId, status,currentLevel} = route.params || {};
  const navigation = useNavigation();
  const [pairsData, setPairsData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [refNO, setRefNO] = useState('');
  const [mainData, setMainData] = useState([]);
  const [transDetails, setTransDetails] = useState([]);
  const [transValue, setTransValue] = useState([]);

  const [showInfoPairs, setShowInfoPairs] = useState(true);
  const [billsPay, setBillsPay] = useState([]);
  const [excluseTblTwo, setExcluseTblTwo] = useState([]);
  const [slabTax, setSlabTax] = useState([]);
  const [paidAdjustment, setPaidAdjustment] = useState([]);
  const [advanceAdjustmentModal, setAdvanceAdjustmentModal] = useState([]);
  const [supplierBankMain, setSupplierBankMain] = useState([]);
  const [supplierBankAboveTab, setsupplierBankAboveTabAboveTab] = useState([]);
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [approvalRejParams, setApprovalRejParams] = useState([]);

  useEffect(() => {
    console.log('isLoading:::', isLoading);
  }, [isLoading]);
  useEffect(() => {
    console.log('PDFModalVisible:::', PDFModalVisible);
  }, [PDFModalVisible]);

  useEffect(() => {
    console.log('transValue::', transValue);

    const body = ReqBodyConv({transobj: transValue}, transId, currentLevel);
    const bodyStringified = JSON.stringify(body._j);
    setApprovalRejParams(bodyStringified);
    console.log('body req::', bodyStringified); // Log immediately before updating the state

  }, [transValue]);

  useEffect(() => {
    console.log('accountNo:::::', accountNo);
    // Supplier Bank Above Table
    FetchValueAssignKeysAPI(
      `http://192.168.0.107:8100/rest/approval/getBillsBankDetails?accountNo=${accountNo}`,
      [
        'Bank A/c No',
        'Account Holder Name',
        'Account Type',
        'Bank Name',
        'State',
        'Country',
        'Available Balance',
        'Effective Balance',
        'Minimum Balance',
        'Currency',
      ],
      [],
      setsupplierBankAboveTabAboveTab,
    );
  }, [accountNo]);
  useEffect(() => {
    console.log('paymentId::', paymentId);
    //   Bills selected to Pay api
    FetchValueAssignKeysAPI(
      `http://192.168.0.169:8084/api/approval/paymentGroup/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,
      // `http://192.168.0.107:8100/rest/approval/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,

      [
        'Bill No',
        'Bill Date',
        'Party Bill No',
        'Party Name',
        'Bill Value',
        'Discount',
        'Charges Amt',
        'Adjustment Amt',
        'Total Bill Amt',
        'Debit Amt',
        'Passed Amt',
        'Payable Amt',
        'Actual Amt',
        'Already Paid',
        'TDS Amount',
        'Remaining Balance',
        'Currency',
        'Due Date',
        'Bill Status',
      ],
      [0, 14, 21],
      setBillsPay,
    );

    //   Selected Table to exclude
    FetchValueAssignKeysAPI(
      `http://192.168.0.107:8100/rest/approval/getPaidTaxDetails1?payment_id=${paymentId}`,
      [
        'Bill No',
        'Tax Name',
        'Rate',
        'Tax Amount',
        'TDS Amount',
        'Paid Tax Amt',
        'Remaining Tax Amt',
        'Inclusive Tax',
        'Apply TDS',
      ],
      [0, 8, 9, 10],
      setExcluseTblTwo,
    );

    //   Slab Taxes
    FetchValueAssignKeysAPI(
      '',
      [
        'Party Name',
        'Party Type',
        'Dept Name',
        'Tax Name',
        'Rate',
        'Tax Amount',
        'Already Paid',
        'Slab',
        'Bill Amount',
        'ST Paid',
        'Applied ST',
      ],
      [],
      setSlabTax,
    );

    //Other Changes and Adjustments(without tax)
    FetchValueAssignKeysAPI(
      `http://192.168.0.107:8100/rest/approval/getPaidAdjustmentDetails?payment_id=${paymentId}`,
      [
        'Adjustment ID',
        'Adjustment Name',
        'Adjustment Type',
        'Description',
        'Amount',
        'Remarks',
      ],
      [],
      setPaidAdjustment,
    );

    // Advance adjustment Modal
    FetchValueAssignKeysAPI(
      ``,
      [
        'PO No',
        'PO Status',
        'PO Value',
        'PO Currency',
        'Advance Paid(INR)',
        'Tax Paid',
        'Advance %',
        'Advance Adjusted(INR)',
        'Remaining Advance(INR)',
        'XRate',
        'Remaining Adv(INR)',
        'Adjust Advance(INR)',
      ],
      [],
      setAdvanceAdjustmentModal,
    );

    // Select Supplier Bank
    FetchValueAssignKeysAPI(
      `http://192.168.0.107:8100/rest/approval/loadVectorwithContentsjson/`,
      [
        'Bank A/C No',
        'Party Name',
        'Account Holder Name',
        'Bank Name',
        'Branch Name',
        'Country',
        'Currency',
        'Swift No',
      ],
      [],
      setSupplierBankMain,
      {
        Query:
          "select bad.account_no,bad.party_name, bad.account_holder_name,coalesce( bm.bank_name,'-') as bank_name,coalesce( bm.branch_name,'-') as branch_name, coalesce(bm.country,'-') as country, bad.currency, bm.swift_code from bank_account_details bad left join  bank_master bm on bm.bank_id = bad.bank_id where (bad.account_no||':::'||bad.bank_id||':::'||bad.party_name='6528420:::63:::OTP' or bad.account_no='6528420:::63:::OTP' ) and bad.account_category='Party'",
      },
      'POST',
    );
  }, [paymentId]);

  useEffect(() => {
    fetchAdvancePaymentDetails();
  }, []);

  useEffect(() => {
    console.log('pairsData::', pairsData);
  }, [pairsData]);
  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalPDF = () => {
    setPDFModalVisible(!PDFModalVisible);
  };

  const tableData = [
    {
      lastMessage: 'Hello',
      lastMessageSentBy: 'admin',
      newMessagesCount: 0,
      userName: 'admifn',
      lastMegssage: 'Hellgo',
      lastMesfsageSentBy: 'adfmin',
      newMesfsagesCount: 0,
      usefrName: 'admin',
      lastMefssage: 'Hello',
      lastMessagefSentBy: 'admin',
      newMessafgesCount: 0,
      userNgame: 'admin',
    },
  ];

  const handleButtonClick = () => {
    setShowInfoPairs(!showInfoPairs); // Toggle visibility
  };

  //   ------------------ API Requests --------------------- //Karthic Nov 26

  const fetchAdvancePaymentDetails = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      const response = await axios.get(
        `${API_URL}/api/approval/paymentGroup/getApprovalDetails`,
        {
          params: {
            trans_id: transId,
            user_id: 'admin',
            status: 'initiated',
            trans_name: 'AddPayment',
          },
          headers: {
            'Content-Type': 'application/json',
            //   Authorization: `${token}`,
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

          const processData = data => {
            if (Array.isArray(data)) {
              return data.map(item => item);
            } else if (typeof data === 'object') {
              return Object.keys(data).map(key => data[key]);
            }
            return [];
          };

          const Main = processData(parsedTransObj[1]);
          const transactionDetails = processData(parsedTransObj[3]);
          const poDetails = processData(parsedTransObj[2][0]);
          setMainData(Main);
          setTransDetails(transactionDetails);
          setTransValue(parsedTransObj);
          setPaymentId(Main[0]);
          setAccountNo(Main[8]);
          setRefNO(transactionDetails[3].length < 5 ? 'Cheque' : 'TT');

          console.log('Final Main::', Main);
          console.log('Final transactionDetails:', transactionDetails);
          console.log('Final poDetails:', parsedTransObj);

          const formattedData = {
            'Payment date': DateFormatComma(Main[1]),
            [`Actual Amount (${Main[9]})`]: Main[18],
            'TDS Amount (TK)': 0,
            ...(transactionDetails[3].length < 5
              ? {
                  [`Actual Amount-Slab Tax Amount (${Main[9]})`]: poDetails[2],
                  'Cheque Ref No': transactionDetails[3],
                  'Favor of': Main[3],
                  'Cheque Date': DateFormatComma(Main[1]),
                  // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
                  [`Cheque Amt (${Main[9]})`]: Main[6],
                }
              : {
                  [`Actual Amount-Slab Tax Amount (${Main[9]})`]: Main[18],
                  'TT Ref No': transactionDetails[3],
                  'Favor of': Main[3],
                  'TT Date': DateFormatComma(Main[1]),
                  // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
                  [`TT Amt (${Main[9]})`]: Main[6],
                }),
          };

          setPairsData([formattedData]);
        }
      }
    } catch (error) {
      console.error('Error fetching approval details:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Karthic Nov 27 2k24
  //   const fetchTableData = async (apiUrl, headers, excludedIndexes, setData) => {
  //     try {
  //       const response = await axios.get(apiUrl);

  //       // Validate the API response
  //       if (
  //         response.data &&
  //         Array.isArray(response.data) &&
  //         response.data.length > 0
  //       ) {
  //         const apiResponse = response.data;

  //         // Process the API response
  //         const result = apiResponse.map(innerArray => {
  //           const filteredRow = innerArray.filter(
  //             (_, index) => !excludedIndexes.includes(index),
  //           );

  //           // Map the filtered row to the headers
  //           return headers.reduce((acc, header, index) => {
  //             acc[header] = filteredRow[index] || 0.0;
  //             return acc;
  //           }, {});
  //         });

  //         console.log('Processed Table Data:', result);
  //         setData(result);
  //       } else {
  //         console.error('Invalid response data:', response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching table data:', error);
  //     }
  //   };

  return (
    <View style={styles.container}>
      <TitleBar
        text={`${transName} - ${paymentId}`}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
        showFileIcon={true}
        onFilePress={() => setPDFModalVisible(!PDFModalVisible)}
      />
      {/* Show InfoPairs or TableComponent based on the state */}
      {showInfoPairs ? (
        <InfoPairs data={pairsData} />
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Date</Text>
              <Text style={commonStyles.oneLineValue}>
                {DateFormatComma(mainData[1])}
              </Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Bill Amount%</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[5] !== undefined ? mainData[5].toString() : ''}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Apply</Text>
            </View>
            <ApprovalTableComponent
              tableData={billsPay}
              highlightVal={['Payable Amt']}
              heading={'Bills Selected to Pay'}
            />
            <ApprovalTableComponent
              tableData={excluseTblTwo}
              highlightVal={['TDS Amount']}
              heading={'Selected Taxes to Exclude'}
            />
            <ApprovalTableComponent
              tableData={slabTax}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Application Slab Taxes(TK Currency)'}
            />
            <ApprovalTableComponent
              tableData={paidAdjustment}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Other changes & Adjustments(Without Tax)'}
            />
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Slab History</Text>
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>TDS Amount(TK)</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <TouchableOpacity
                style={commonStyles.enableButtonTextContainer}
                onPress={toggleModal}>
                <Text style={commonStyles.disableButtonText}>
                  Advance Adjustments
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Balance to Pay(Actual amt-Advance Adjusted)
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={
                  mainData[18] !== undefined ? mainData[18].toString() : ''
                }
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Actual Amount - Slab Tax Amount (INR)
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={
                  mainData[18] !== undefined ? mainData[18].toString() : ''
                }
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Actual Paid after adjustment
              </Text>

              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={
                  refNO == 'Cheque'
                    ? mainData[18].toString()
                    : mainData[6].toString()
                }
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Mode</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={
                  transDetails[2] !== undefined
                    ? transDetails[2].toString()
                    : ''
                }
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Voucher No</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[2] ? mainData[2].toString() : ''}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Remarks</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={
                  transName !== 'ModPayment' ? mainData[16].toString() : ''
                }
                editable={false} // Disables input
              />
            </View>
            {(transValue[3][0] == 'Y' || 'N') && (
              <View style={commonStyles.checkBoxContainer}>
                <Checkbox
                  status={
                    transValue[3].AC_Payee == 'Y' ? 'checked' : 'unchecked'
                  } // Set the checkbox to checked
                  onPress={() => {}}
                  disabled={false} // Disables the checkbox
                />
                <Text style={commonStyles.label}>A/C Payee</Text>
              </View>
            )}
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Select Account</Text>
            </View>
            <ApprovalTableComponent
              tableData={supplierBankAboveTab}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={''}
            />
            {refNO !== 'Cheque' && (
              <ApprovalTableComponent
                tableData={supplierBankMain}
                highlightVal={['lastMessageSentBy', 'userName']}
                heading={'Select Supplier Bank'}
              />
            )}
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Fx Rate</Text>
            </View>
            {/* -------------------------- INR Pending_______________ */}
            <View style={[commonStyles.textCenter, commonStyles.flexRow]}>
              <Text style={commonStyles.heading}>1 INR =</Text>
              <TextInput
                style={[commonStyles.inputNoBox]}
                placeholder="" // Placeholder text
                value={mainData[11] ? mainData[11].toString() : ''}
                editable={false} // Disables input
              />
              <Text style={commonStyles.heading}>INR</Text>
            </View>
            {/* ---------------------------------------------------- */}
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Actual Paid</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[18] ? mainData[18].toString() : ''}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Calculate</Text>
            </View>

            {/* ---------------------------- Varies for data --------------------- */}
            {refNO !== 'Cheque' ? (
              <View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    TT Ref No <Text style={commonStyles.redAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[commonStyles.oneLineValue, commonStyles.input]}
                    placeholder="" // Placeholder text
                    value={transDetails[3].toString()}
                    editable={true} // Disables input
                  />
                </View>

                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>TT Date</Text>
                  <Text style={commonStyles.oneLineValue}>
                    {DateFormatComma(mainData[1])}
                  </Text>
                </View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    TT Amt ({mainData[9]})
                  </Text>
                  <TextInput
                    style={[commonStyles.oneLineValue, commonStyles.input]}
                    placeholder="" // Placeholder text
                    value={mainData[6].toString()}
                    editable={true} // Disables input
                  />
                </View>
              </View>
            ) : (
              <View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    Cheque No <Text style={commonStyles.redAsterisk}>*</Text>
                  </Text>
                  <Text style={commonStyles.oneLineValue}>
                    {transDetails[3]}
                  </Text>
                </View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    Favor of <Text style={commonStyles.redAsterisk}>*</Text>
                  </Text>
                  <Text style={commonStyles.oneLineValue}>{mainData[3]}</Text>
                </View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>Cheque Date</Text>
                  <Text style={commonStyles.oneLineValue}>
                    {DateFormatComma(mainData[1])}
                  </Text>
                </View>
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    Cheque Amt ({mainData[9]})
                  </Text>
                  <TextInput
                    style={[commonStyles.oneLineValue, commonStyles.input]}
                    placeholder="" // Placeholder text
                    value={mainData[6].toString()}
                    editable={false} // Disables input
                  />
                </View>
              </View>
            )}

            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Amount in words</Text>
              <Text style={commonStyles.oneLineValue}>
                {NumToWordsCon(mainData[6], mainData[9])}
                {/* {mainData[9] == 'INR' ? 'Paisa Only' : 'Cents Only'} */}
              </Text>
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Narration</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={transValue[3].COMMENTS}
                editable={false} // Disables input
              />
            </View>
          </ScrollView>

          <CustomModal
            isVisible={isModalVisible}
            onClose={toggleModal}
            title="Advance Adjustments">
            {/* Children Content */}
            <Text style={styles.modalBody}>Party Name: {mainData[3]}</Text>
            <Text style={styles.modalBody}>
              Payment Amount: {mainData[18]} ({mainData[9]})
            </Text>
            <View style={{height: 200}}>
              <ApprovalTableComponent
                tableData={advanceAdjustmentModal}
                heading={'Advance Details'}
              />
            </View>
          </CustomModal>
          <CustomModal
            isVisible={PDFModalVisible}
            onClose={toggleModalPDF}
            title="Advance Adjustments">
            {/* Children Content */}
            <TouchableOpacity
              onPress={async () => {
                try {
                  setIsLoading(true); // Set loading to true before starting the operation
                  setPDFModalVisible(false); // Close the modal

                  const requestUrl = `${API_URL}/api/approval/paymentGroup/billspay_printPdf`;

                  const requestBody = {
                    tranObject: transValue,
                    trans_id: transId,
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
                  setIsLoading(false);
                }
              }}
              style={styles.pdfSubOption}>
              <Text style={styles.subOptionText}>Payment Id</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  setIsLoading(true); // Set loading state to true
                  setPDFModalVisible(false); // Close the modal

                  const requestUrl = `${API_URL}/api/approval/paymentGroup/billspay_printDetailedPdf`;
                  const requestBody = {
                    tranObject: transValue,
                    trans_id: transId,
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
                  setIsLoading(false);
                }
              }}
              // onPress={() => PrintGroupPdf()}
              style={styles.pdfSubOption}>
              <Text style={styles.subOptionText}>Payment Detailed PDF</Text>
            </TouchableOpacity>
          </CustomModal>
          {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>}
        </>
      )}

      {/* Button to toggle visibility */}
      <View style={styles.buttonContainer}>
        <Button title="Click here for more info" onPress={handleButtonClick} />
      </View>
      <View>
      <ApproveRejectComponent
          approveUrl="http://192.168.0.107:8100/rest/approval/approveTransaction"
          rejectUrl="http://192.168.0.107:8100/rest/approval/rejectTransaction"
          params={approvalRejParams}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    justifyContent: 'space-between', // Ensures button is at the bottom
  },
  scrollContainer: {
    flex: 1,
  },
  tableContainer: {
    width: '100%', // Ensure the container takes up full width
    paddingHorizontal: 10, // Optional: padding for aesthetics
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  helloText: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  openButton: {
    backgroundColor: '#3788E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#3788E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pdfSubOption: {
    width: isTablet ? 300 : 200,
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
});
