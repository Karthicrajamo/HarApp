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

const {width} = Dimensions.get('window');
const isMobile = width < 768;

// Karthic Nov 25
export const BillsPayment = ({route}) => {
  const {transName, transId, status} = route.params || {};
  const navigation = useNavigation();
  const [pairsData, setPairsData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const [showInfoPairs, setShowInfoPairs] = useState(true);
  const [billsPay, setBillsPay] = useState([]);
  const [excluseTblTwo, setExcluseTblTwo] = useState([]);

  useEffect(() => {
    fetchAdvancePaymentDetails();
    fetchBillsPayTable();
    fetchExcludeTable();

    //   Bills selected to Pay api
    fetchTableData(
      `http://192.168.0.169:8084/api/approval/paymentGroup/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,
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
    fetchTableData(
      'http://192.168.0.107:8100/rest/approval/getPaidTaxDetails1?payment_id=2633',
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
  }, []);

  useEffect(() => {
    console.log('pairsData::', pairsData);
  }, [pairsData]);
  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

          const mainData = processData(parsedTransObj[1]);
          const transactionDetails = processData(parsedTransObj[3]);
          const poDetails = processData(parsedTransObj[2][0]);

          setPaymentId(mainData[0]);

          console.log('Final mainData::', mainData);
          console.log('Final transactionDetails:', transactionDetails);
          console.log('Final poDetails:', poDetails);

          const formattedData = {
            'Payment date': mainData[1],
            'Actual Amount (INR)': mainData[6],
            'Actual Amount-Slab Tax Amount (INR)': poDetails[2],
            'TT Ref No': transactionDetails[3],
            'Favor of': mainData[3],
            'TT Date': mainData[1],
            // 'TT Amt (INR)': poDetails[2],
            'Cheque Amt (USD)': mainData[6],
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

  //   Bills selected to Pay api
  const fetchBillsPayTable = async () => {
    const headers = [
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
    ];

    try {
      const response = await axios.get(
        `http://192.168.0.169:8084/api/approval/paymentGroup/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,
      );

      // Check if the response has the expected data
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const apiResponse = response.data;

        console.log('apiResponse::', apiResponse);

        // Process the API response for all rows
        const result = apiResponse.map(innerArray => {
          // Filter the row to exclude specific indices
          const filteredRow = innerArray.filter(
            (_, index) =>
              index !== 0 && index !== 14 && index !== innerArray.length - 1,
          );

          // Map the filtered row to the headers
          return headers.reduce((acc, header, index) => {
            acc[header] = filteredRow[index] || 0.0; // Assign null if there is no corresponding value
            return acc;
          }, {});
        });

        console.log('Bills table::', result);

        // Update the state with the processed data
        setBillsPay(result);
      } else {
        console.error('Invalid response data', response.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  //   Selected Table to exclude
  const fetchExcludeTable = async () => {
    const headers = [
      'Bill No',
      'Tax Name',
      'Rate',
      'Tax Amount',
      'TDS Amount',
      'Paid Tax Amt',
      'Remaining Tax Amt',
      'Inclusive Tax',
      'Apply TDS',
    ];
    try {
      const response = await axios.get(
        `http://192.168.0.107:8100/rest/approval/getPaidTaxDetails1?payment_id=2633`,
      );

      // Check if the response has the expected data
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const apiResponse = response.data;

        // Remove first and last elements from the array
        console.log('apiResponse exclude::', apiResponse); // You can now use 'result' to display or process the data
        const result = apiResponse.map(innerArray => {
          // Filter the row to exclude specific indices
          const filteredRow = innerArray.filter(
            (_, index) =>
              index !== 0 && index !== 8 && index !== 9 && index !== 10,
          );

          // Map the filtered row to the headers
          return headers.reduce((acc, header, index) => {
            acc[header] = filteredRow[index] || 0.0; // Assign null if there is no corresponding value
            return acc;
          }, {});
        });

        console.log('exclude Bills table one::', result); // You can now use 'result' to display or process the data
        setExcluseTblTwo(result);
      } else {
        console.error('Invalid response data exclude', response.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };
  // Karthic Nov 27 2k24
  const fetchTableData = async (apiUrl, headers, excludedIndexes, setData) => {
    try {
      const response = await axios.get(apiUrl);

      // Validate the API response
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const apiResponse = response.data;

        // Process the API response
        const result = apiResponse.map(innerArray => {
          const filteredRow = innerArray.filter(
            (_, index) => !excludedIndexes.includes(index),
          );

          // Map the filtered row to the headers
          return headers.reduce((acc, header, index) => {
            acc[header] = filteredRow[index] || 0.0;
            return acc;
          }, {});
        });

        console.log('Processed Table Data:', result);
        setData(result);
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TitleBar
        text={`Add Payment - ${paymentId}`}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
      />
      {/* Show InfoPairs or TableComponent based on the state */}
      {showInfoPairs ? (
        <InfoPairs data={pairsData} />
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Date</Text>
              <Text style={commonStyles.oneLineValue}>20 Nov 2024</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Bill Amount%</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="2"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Apply</Text>
            </View>
            <ApprovalTableComponent
              tableData={billsPay}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Bills Selected to Pay'}
            />
            <ApprovalTableComponent
              tableData={excluseTblTwo}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Selected Taxes to Exclude'}
            />
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Application Slab Taxes(TK Currency)'}
            />
            <ApprovalTableComponent
              tableData={tableData}
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
                value="0.0001"
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
                value="0.0001"
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
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Mode</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="Cheque"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Voucher No</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="2465-2564-8794"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Remarks</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value=""
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.checkBoxContainer}>
              <Checkbox
                status="unchecked" // Set the checkbox to checked
                onPress={() => {}}
                disabled={true} // Disables the checkbox
              />
              <Text style={commonStyles.label}>A/C Payee</Text>
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Select Account</Text>
            </View>
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={''}
            />
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Fx Rate</Text>
            </View>
            {/* -------------------------- INR Pending_______________ */}
            <View style={[commonStyles.textCenter, commonStyles.flexRow]}>
              <Text style={commonStyles.heading}>1 INR =</Text>
              <TextInput
                style={[commonStyles.inputNoBox]}
                placeholder="" // Placeholder text
                value="19.5"
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
                value="19.5"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Calculate</Text>
            </View>

            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                Cheque No <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <Text style={commonStyles.oneLineValue}>5604</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                Favor of <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Cheque Date</Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Cheque Amt (USD)</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="19.5"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Amount in words</Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Narration</Text>
            </View>
          </ScrollView>

          <CustomModal
            isVisible={isModalVisible}
            onClose={toggleModal}
            title="Advance Adjustments">
            {/* Children Content */}
            <Text style={styles.modalBody}>Party Name: accessories</Text>
            <Text style={styles.modalBody}>Payment Amount: 1500 INR</Text>
            <View style={{height: 200}}>
              <ApprovalTableComponent
                tableData={tableData}
                heading={'Advance Details'}
              />
            </View>
          </CustomModal>
        </>
      )}

      {/* Button to toggle visibility */}
      <View style={styles.buttonContainer}>
        <Button title="Click here for more info" onPress={handleButtonClick} />
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
});
