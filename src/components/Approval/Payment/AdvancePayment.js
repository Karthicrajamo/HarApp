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
import {DateFormatComma} from '../../common-utils/DateFormatComma';
import FetchValueAssignKeysAPI from '../ApprovalComponents/FetchValueAssignKeysAPI';
import FetchValueAssignKeysAPIDoubleArray from '../ApprovalComponents/FetchValueAssignKeysAPIDoubleArray';
import {ReqBodyConv} from './ReqBodyConv';
import FetchValueAssignKeysAPIString from '../ApprovalComponents/FetchValueAssignKeysAPIString';
import ApproveRejectComponent from '../ApprovalComponents/ApproveRejectComponent';

const {width} = Dimensions.get('window');
const isMobile = width < 768;

// Karthic Nov 25
export const AdvancePayment = ({route}) => {
  const {transName, transId, status, currentLevel} = route.params || {};
  const navigation = useNavigation();
  const [pairsData, setPairsData] = useState([]);
  const [accountNo, setAccountNo] = useState('');
  const [refNO, setRefNO] = useState('');
  const [mainData, setMainData] = useState([]);
  const [transDetails, setTransDetails] = useState([]);
  const [transValue, setTransValue] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [materialAdPayment, setMaterialAdPayment] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [excludeTaxes, setExcludeTaxes] = useState('');
  const [slabTaxes, setSlabTaxes] = useState('');
  const [adjWithoutTax, setAdjWithoutTax] = useState('');
  const [approvalRejParams, setApprovalRejParams] = useState([]);

  useEffect(() => {
    console.log('approvalRejParams::', approvalRejParams);
  }, [approvalRejParams]);
  // Using async functions inside useEffect
  useEffect(() => {
    const logMainData = async () => {
      console.log('transValue::', transValue);
      const body = ReqBodyConv({ transobj: transValue }, transId, currentLevel,transName);
      const bodyStringified = JSON.stringify(body._j);
      setApprovalRejParams(bodyStringified);
      console.log('body req::', bodyStringified); // Log immediately before updating the state
    };

    logMainData();
  }, [transValue]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAdvancePaymentDetails();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleTransValueChange = async () => {
      console.log('transValue::', transValue);
      if (transValue.length !== 0) {
        // Fetch Order Details
        await FetchValueAssignKeysAPIString(
          `http://192.168.0.107:8100/rest/approval/getAdvPayOrderMain`,
          [
            'PO No',
            'Supplier Name',
            'PO Qty',
            'Discount %',
            'Discount(PO)',
            'Discount(INR)',
            'Total Amount(PO)',
            'Total Amount(INR)',
            'Payable Amt',
            'Advance Amount',
            'Advance Paid',
            'TDS Amount',
            'Remaining Balance',
            'PO Currency',
          ],
          [6, 10, 11, 15],
          setOrderDetails,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );

        // Materials for Advance Payment
        await FetchValueAssignKeysAPIString(
          `http://192.168.0.107:8100/rest/approval/getAdvPayOrderDetails`,
          [
            'PO No',
            'Supplier Name',
            'Mat No',
            'Color',
            'Size',
            'Ref No',
            'Type',
            'Material Specification',
            'Qty',
            'UOM',
            'Price/UOM',
            'Discount %',
            'Discount(PO)',
            'Discount(INR)',
            'Total Amount (PO)',
            'Total Amount (INR)',
            'Payable Amt',
            'Advance Amt',
            'Advance Paid',
            'TDS Amount',
            'Remaining Balance',
            'Currency',
          ],
          [16, 17, 20, 24, 25],
          setMaterialAdPayment,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );

        // Additional Charges (Taxable)
        await FetchValueAssignKeysAPIString(
          `http://192.168.0.107:8100/rest/approval/getAdvPayChargesDetails`,
          [
            'PO No',
            'Mat No',
            'SID',
            'Service/Material Category',
            'Service/Material Type',
            'Uom',
            'Expense Type',
            'Description',
            'Qty',
            'Rate',
            'Amount',
            'Total Amount(INR)',
            'Payable Amount',
            'Advance Amount',
            'Advance Paid',
            'TDS Amount',
            'Remaining Balance',
            'Currency',
            'Select',
          ],
          [12, 13, 16, 19, 20],
          setAdditionalCharges,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );

        // Selected Taxes to Exclude
        await FetchValueAssignKeysAPIDoubleArray(
          `http://192.168.0.107:8100/rest/approval/getOrderTaxProfileAdvPay`,
          [
            'PO No',
            'Tax Name',
            'Rate',
            'Tax Amount',
            'TDS Amount',
            'Previous Deduction Amt',
            'Remaining Tax Amt',
            'Inclusive Tax',
            'Apply TDS',
          ],
          [2, 8, 9, 11],
          setExcludeTaxes,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );

        // Slab Tax
        await FetchValueAssignKeysAPIString(
          ``,
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
          setSlabTaxes,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );

        // Other changes & Adjustments (Without Tax)
        await FetchValueAssignKeysAPIString(
          `http://192.168.0.107:8100/rest/approval/getAdvPayAdjustmentsDetails`,
          [
            'PO No',
            'Adjustment ID',
            'Adjustment Name',
            'Adjustment Type',
            'Description',
            'Amount',
            'Remarks',
          ],
          [2, 3],
          setAdjWithoutTax,
          {
            payment_id: paymentId,
            type: transValue[4][0].ORDER_TYPE,
            orders: [transValue[4][0].PO_SO_JO_NO],
            datafor: 'Approval',
          },
          'POST',
        );
      }
    };
    handleTransValueChange();
  }, [paymentId]);

  useEffect(() => {
    const logPairsData = async () => {
      console.log('pairsData::', pairsData);
    };
    logPairsData();
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
  const [showInfoPairs, setShowInfoPairs] = useState(true);

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

          const Main = processData(parsedTransObj[1]);
          const transactionDetails = processData(parsedTransObj[3]);
          const poDetails = processData(parsedTransObj[2][0]);

          console.log('Final Main::', Main);
          console.log('Final transactionDetails:', transactionDetails);
          console.log('Final poDetails:', parsedTransObj);
          setMainData(Main);
          setTransDetails(transactionDetails);
          setTransValue(parsedTransObj);

          setPaymentId(Main[0]);
          setAccountNo(Main[8]);

          const formattedData = {
            'Payment date': DateFormatComma(Main[1]),
            'Payment Amount (INR)': poDetails[3],
            'TDS Amount (TK)': 0,
            'Actual Amount-Slab Tax Amount (INR)': poDetails[2],
            'Actual Paid After Adjustment': Main[6],
            'TT Ref No': transactionDetails[3],
            'Party Name': Main[3],
            'TT Date': DateFormatComma(Main[1]),
            'TT Amt (INR)': Main[6],
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

  return (
    <View style={styles.container}>
      <TitleBar
        text={`Add Advance Payment - ${paymentId}`}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
      />
      {/* Show InfoPairs or TableComponent based on the state */}
      {showInfoPairs ? (
        <>
          {console.log('dsfsfsf::', pairsData)}
          <InfoPairs data={pairsData} />
        </>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Date</Text>
              <Text style={commonStyles.oneLineValue}>20 Nov 2024</Text>
            </View>

            <ApprovalTableComponent
              tableData={orderDetails}
              highlightVal={['Payable Amt']}
              heading={'Other Details'}
            />
            <ApprovalTableComponent
              tableData={materialAdPayment}
              highlightVal={['Payable Amt']}
              heading={'Materials for Advance Payment'}
            />
            <ApprovalTableComponent
              tableData={additionalCharges}
              highlightVal={['']}
              heading={'Additional Charges (Taxable)'}
            />
            <ApprovalTableComponent
              tableData={excludeTaxes.filter((_, index) => index > 1)}
              highlightVal={['']}
              heading={'Selected Taxes to Exclude'}
            />
            <ApprovalTableComponent
              tableData={slabTaxes}
              highlightVal={['']}
              heading={'Applicable Slab Taxes (TK Currency)'}
            />

            <ApprovalTableComponent
              tableData={adjWithoutTax}
              highlightVal={['Amount', 'Remarks']}
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
});
