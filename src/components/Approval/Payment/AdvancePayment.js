import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
import FetchValueAssignKeysAPIString from '../ApprovalComponents/FetchValueAssignKeysAPIString';
import ApproveRejectComponent from '../ApprovalComponents/ApproveRejectComponent';
import {sharedData} from '../../Login/UserId';
import {ReqBodyRejConv} from './BillsComp/ReqBodyRejConv';
import {ReqBodyConv} from './BillsComp/ReqBodyConv';
import CurrencyConversion from '../ApprovalComponents/FXRate';
import {NumToWordsCon} from '../ApprovalComponents/NumToWordsCon';
import {BlobFetchComponent} from '../../common-utils/BlobFetchComponent';
import {isTablet} from 'react-native-device-info';
import {CustomThemeColors} from '../../CustomThemeColors';
import LoadingIndicator from '../../commonUtils/LoadingIndicator';

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
  const [noHeadRemarksblw, setNoHeadRemarksblw] = useState('');
  const [approvalRejParams, setApprovalRejParams] = useState([]);
  const [approvalParams, setApprovalParams] = useState([]);
  const [rejParams, setRejParams] = useState([]);
  const [fxRate, setFxRate] = useState('');
  const [currency, setCurrency] = useState('');
  const [numToWords, setNumToWords] = useState('');
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [calculatedTDS, setCalculatedTDS] = useState('');
  const [tDSCurrency, setTDSCurrency] = useState('');

  useEffect(() => {
    console.log('isLoading:::', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('mainData::', mainData);
  }, [mainData]);

  useEffect(() => {
    console.log('approvalParams::', approvalParams);
  }, [approvalParams]);

  // Using async functions inside useEffect
  useEffect(() => {
    setIsLoading(true);

    console.log('transValue::', transValue);
    const body = ReqBodyConv(
      {transobj: transValue},
      transId,
      currentLevel,
      transName,
    );
    const rejBody = ReqBodyRejConv(
      transValue,
      transId,
      currentLevel,
      transName,
    );
    const bodyStringified = JSON.stringify(body._j);
    const bodyRejStringified = JSON.stringify(rejBody);
    console.log('rejBodyJson::', JSON.stringify(rejBody));
    console.log('rejBody::', rejBody);
    setRejParams(bodyRejStringified);
    setApprovalParams(bodyStringified);
    console.log('body req::', bodyStringified); // Log immediately before updating the state
    setIsLoading(false);
  }, [transValue]);

  useEffect(() => {
    setIsLoading(true);

    if (tDSCurrency.length > 0) {
      console.log('currency tds::', tDSCurrency); // Logs the first element of the array
      fetchAdvancePaymentDetails();
    } else {
      console.log('currency tds:: No currency available');
    }
    setIsLoading(false);
  }, [tDSCurrency]);

  useEffect(() => {
    setIsLoading(true);
    const getTaxCurrency = async () => {
      try {
        // SQL query to get the TAX_CURRENCY
        const taxCurrencyQuery = `select TAX_CURRENCY from financial_cycle where rownum = 1`;

        const response = await fetch(
          `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
            taxCurrencyQuery,
          )}`,
        );
        const taxCurrencyResult = await response.json();
        console.log('Tax Currency Result bills page:', taxCurrencyResult);

        if (taxCurrencyResult.length > 0) {
          if (
            Array.isArray(taxCurrencyResult) &&
            taxCurrencyResult.length > 0
          ) {
            setTDSCurrency(taxCurrencyResult[0]); // Sets only the first element
          } else {
            setTDSCurrency(''); // Fallback in case the array is empty or not valid
          }
        } else {
          console.error('Tax currency not found.');
        }
      } catch (error) {
        console.error('Error fetching tax currency:', error);
      }
    };
    getTaxCurrency();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log('excludeTaxes::', excludeTaxes);
    const totalTdsAmount = (excludeTaxes || []).reduce(
      (sum, item) => sum + Number(item['TDS Amount'] || 0),
      0,
    );

    console.log('totalTdsAmount:', totalTdsAmount * fxRate);
    const tds = totalTdsAmount * fxRate;
    setCalculatedTDS(tds);
    // const totalTdsAmount = 5

    console.log('calculatedTDS:', calculatedTDS);
    setIsLoading(false);
  }, [excludeTaxes]);

  useEffect(() => {
    setIsLoading(true);
    console.log('transValue::', transValue);
    if (transValue.length !== 0) {
      // Fetch Order Details
      FetchValueAssignKeysAPIString(
        `${API_URL}/api/approval/payment/getAdvPayOrderMain`,
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
      const headArr =
        transValue[4][0]?.ORDER_TYPE === 'PO'
          ? [
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
            ]
          : [
              'JO No',
              'Unit Name',
              'Job Id',
              'Work Center',
              'Process',
              'Item No',
              'Mat No',
              'Material Specification',
              'Qty',
              'UOM',
              'Rate',
              'Discount %',
              'Discount(JO)',
              'Discount(INR)',
              'Total Amount (JO)',
              'Total Amount (INR)',
              'Payable Amt',
              'Advance Amt',
              'Advance Paid',
              'TDS Amount',
              'Remaining Balance',
              'Currency',
            ];

      FetchValueAssignKeysAPIString(
        `${API_URL}/api/approval/payment/getAdvPayOrderDetails`,
        headArr,
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

      const chargeArr =
        transValue[4][0]?.ORDER_TYPE === 'JO'
          ? [
              'JO No',
              'Job Id',
              'Item No',
              'Mat No',
              'SID',
              'Service/Material Category',
              'Service/Material Type',
              'UOM',
              'Expense Type',
              'Description',
              'Qty',
              'Rate',
              'Amount',
              'Total Amount (INR)',
              'Payable Amount',
              'Advance Amount',
              'Advance Paid',
              'TDS Amount',
              'Remaining Balance',
              'Currency',
              'Select',
            ]
          : [
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
            ];
      // Additional Charges (Taxable)
      FetchValueAssignKeysAPIString(
        `${API_URL}/api/approval/payment/getAdvPayChargesDetails`,
        chargeArr,
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
      // await
      FetchValueAssignKeysAPIDoubleArray(
        `${API_URL}/api/approval/payment/getOrderTaxProfileAdvPay`,
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
        [2, 8, 9, 10],
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
      FetchValueAssignKeysAPIString(
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
      const otherTaxArr =
        transValue[4][0]?.ORDER_TYPE === 'JO'?[
          "JO No",
          "Adjustment ID",
          "Adjustment Name",
          "Adjustment Type",
          "Description",
          "Amount",
          "Remarks"
        ]:[
          'PO No',
          'Adjustment ID',
          'Adjustment Name',
          'Adjustment Type',
          'Description',
          'Amount',
          'Remarks',
        ]
      FetchValueAssignKeysAPIString(
        `${API_URL}/api/approval/payment/getAdvPayAdjustmentsDetails`,
        otherTaxArr,
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
      FetchValueAssignKeysAPI(
        `${API_URL}/api/approval/payment/getBillsBankDetailsadv`,
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
        setNoHeadRemarksblw,
        {
          accountNo: mainData[8],
        },
      );
    }
    setIsLoading(false);
  }, [paymentId]);

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
  const [showInfoPairs, setShowInfoPairs] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const handleButtonClick = () => {
    setShowInfoPairs(!showInfoPairs); // Toggle visibility
  };

  //   ------------------ API Requests --------------------- //Karthic Nov 26

  const fetchAdvancePaymentDetails = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

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

          setCurrency(parsedTransObj[1].PARTY_CURRENCY);

          setMainData(Main);
          setTransDetails(transactionDetails);
          setTransValue(parsedTransObj);

          setPaymentId(Main[0]);
          setAccountNo(Main[8]);

          const formattedData = {
            'Payment date': DateFormatComma(Main[1]),
            [`Payment Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
              poDetails[3],
            [`TDS Amount (${tDSCurrency})`]: 0,
            [`Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
              poDetails[2],
            'Actual Paid After Adjustment': Main[6],
            [`${transValue[4][0]?.ORDER_TYPE === 'JO' ? 'DD' : 'TT Ref'} No`]:
              transactionDetails[3],
            [`${
              transValue[4][0]?.ORDER_TYPE === 'JO' ? 'Favor of' : 'Party Name'
            }`]: Main[3],
            [`${transValue[4][0]?.ORDER_TYPE === 'JO' ? 'DD' : 'TT'} Date`]:
              DateFormatComma(Main[1]),
            [`${transValue[4][0]?.ORDER_TYPE === 'JO' ? 'DD' : 'TT'} Amt (${
              parsedTransObj[1].PARTY_CURRENCY
            })`]: Main[6],
          };
          const numResult = await NumToWordsCon(Main[6], Main[9]);
          setNumToWords(numResult);

          setPairsData([formattedData]);
        }
      }
    } catch (error) {
      console.error('Error fetching approval details:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const toggleModalPDF = () => {
    setPDFModalVisible(!PDFModalVisible);
  };

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={fetchAdvancePaymentDetails} // Trigger fetchData on pull-down
          colors={[CustomThemeColors.primary]} // Customize spinner color
        />
      }>
      <TitleBar
        text={`Add Advance Payment - ${paymentId}`}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
        showFileIcon={true}
        onFilePress={() => setPDFModalVisible(!PDFModalVisible)}
      />
      <CurrencyConversion
        BillCurrency={currency}
        setFxRate={setFxRate}
        // setTDSCurrency={setTDSCurrency}
      />
      {/* Show InfoPairs or TableComponent based on the state */}
      {showInfoPairs ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={fetchAdvancePaymentDetails} // Trigger fetchData on pull-down
                colors={[CustomThemeColors.primary]} // Customize spinner color
              />
            }>
            <InfoPairs
              data={pairsData}
              imp={['Cheque Ref No', 'LC Ref No', 'Favor of', 'DD No']}
              valueChanger={{[`TDS Amount (${tDSCurrency})`]: calculatedTDS}}
            />
          </ScrollView>
          {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>}
        </>
      ) : (
        <>
          {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>}

          <ScrollView
            style={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={fetchAdvancePaymentDetails} // Trigger fetchData on pull-down
                colors={[CustomThemeColors.primary]} // Customize spinner color
              />
            }>
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
              heading={
                transValue[4][0]?.ORDER_TYPE === 'JO'
                  ? 'Jobs for Advance Payment'
                  : 'Materials for Advance Payment'
              }
            />
            <ApprovalTableComponent
              tableData={additionalCharges}
              highlightVal={['']}
              heading={'Additional Charges (Taxable)'}
            />
            <ApprovalTableComponent
              tableData={excludeTaxes}
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
                value={calculatedTDS.toString()}
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
                value={pairsData[0][
                  'Actual Amount-Slab Tax Amount (INR)'
                ].toString()}
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
                value={pairsData[0][
                  'Actual Amount-Slab Tax Amount (INR)'
                ].toString()}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Mode</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[7]}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Voucher No</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[2]}
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
            {/* <View style={commonStyles.checkBoxContainer}>
              <Checkbox
                status="unchecked" // Set the checkbox to checked
                onPress={() => {}}
                disabled={true} // Disables the checkbox
              />
              <Text style={commonStyles.label}>A/C Payee</Text>
            </View> */}
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Account</Text>
            </View>
            <ApprovalTableComponent
              tableData={noHeadRemarksblw}
              highlightVal={['']}
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
                value={Math.round(fxRate).toString()}
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
                value={mainData[6].toString()}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Calculate</Text>
            </View>
            {transValue[4][0]?.ORDER_TYPE === 'JO' && (
              <View style={commonStyles.padTop}>
                <Text style={commonStyles.oneLineKey}>
                  Demand Draft Details{' '}
                </Text>
              </View>
            )}
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                {transValue[4][0]?.ORDER_TYPE === 'PO' ? 'Ref ' : 'DD '}
                No <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={transDetails[3].toString()}
                editable={false} // Disables input
              />
              
            </View>
            {transValue[4][0]?.ORDER_TYPE === 'JO' && (
              <View style={commonStyles.flexRow}>
                <Text style={commonStyles.oneLineKey}>
                  Favor of <Text style={commonStyles.redAsterisk}>*</Text>
                </Text>
                <Text style={commonStyles.oneLineValue}>{mainData[3]}</Text>
              </View>
            )}
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                {transValue[4][0]?.ORDER_TYPE === 'JO' ? 'DD ' : 'Case '} Date
              </Text>
              <Text style={commonStyles.oneLineValue}>
                {DateFormatComma(mainData[1])}
              </Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                {transValue[4][0]?.ORDER_TYPE === 'JO' ? 'DD Amt ' : 'Amount'} (
                {mainData[9]})
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[6].toString()}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Amount in words</Text>
              <Text style={commonStyles.oneLineValue}>
                {numToWords || 'Loading...'}
              </Text>
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

              const requestUrl = `${API_URL}/api/approval/payment/advancePaymentPdf`;
              // const requestUrl = `${API_URL}/api/approval/payment/billspay_printPdf`;

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
          <Text style={styles.subOptionText}>Print PDF</Text>
        </TouchableOpacity>
      </CustomModal>
      {/* Button to toggle visibility */}
      <View style={styles.buttonContainer}>
        <Button title="Click here for more info" onPress={handleButtonClick} />
      </View>
      <View>
        <ApproveRejectComponent
          // approveUrl="http://192.168.0.107:8100/rest/approval/approveTransaction"
          // rejectUrl="http://192.168.0.107:8100/rest/approval/rejectTransaction"
          params={approvalParams}
          approveUrl={`${API_URL}/api/common/approveTransaction`}
          rejectUrl={`${API_URL}/api/common/rejectTransaction`}
          rejParams={rejParams}
          // params={approvalParams}
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
