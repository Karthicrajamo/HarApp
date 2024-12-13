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
import {ReqBodyConv} from './BillsComp/ReqBodyConv';
import {sharedData} from '../../Login/UserId';
import CustomButton from '../../common-utils/CustomButton';
import CurrencyConversion from '../ApprovalComponents/FXRate';
import {ReqBodyRejConv} from './BillsComp/ReqBodyRejConv';
import {RefreshControl} from 'react-native';
const {width} = Dimensions.get('window');
const isMobile = width < 768;

// Karthic Nov 25
export const BillsPayment = ({route}) => {
  const {transName, transId, status, currentLevel} = route.params || {};
  const navigation = useNavigation();
  const [pairsData, setPairsData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [refNO, setRefNO] = useState('');
  const [currency, setCurrency] = useState('');
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
  const [approvalParams, setApprovalParams] = useState([]);
  const [rejParams, setRejParams] = useState([]);
  const [fxRate, setFxRate] = useState('');
  const [tDSCurrency, setTDSCurrency] = useState('');
  const [calculatedTDS, setCalculatedTDS] = useState('');
  const [numToWords, setNumToWords] = useState('');
  const [actualMinSlab, setActualMinSlab] = useState('');
  const [actualPaidAftAdj, setActualPaidAftAdj] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [actualSlabMain, setActualSlabMain] = useState('');
  const [slabTaxes, setSlabTaxes] = useState('');



  // useEffect(() => {
  //   console.log('paidAdjustment::', paidAdjustment);

  //   if (paidAdjustment.length > 0) {
  //     const totalAmount = paidAdjustment.reduce((total, adjustment) => {
  //       const amount = Number(adjustment.Amount || 0); // Ensure Amount is a number
  //       return adjustment['Adjustment Type'] === 'Less'
  //         ? total - amount
  //         : total + amount;
  //     }, 0);

  //     const actualSlab = actualMinSlab; // Assuming actualMinSlab is defined
  //     console.log('adjustments bills::', actualMinSlab);

  //     setActualPaidAftAdj(actualSlab + totalAmount);
  //   } // Start with an initial total of 0
  // }, [paidAdjustment]);

  useEffect(() => {
    console.log('paidAdjustment::', paidAdjustment);
    let totalTaxAmount = 0;
    if (slabTaxes) {
      const totalAmount = slabTaxes
        .map(item => parseFloat(item['Tax Amount'])) // Convert Tax Amount to a number
        .reduce((sum, amount) => sum + amount, 0); // Sum all Tax Amounts
      totalTaxAmount = actualMinSlab-(totalAmount * slabFXRate);
      console.log('Total Tax Amount:', slabFXRate);
    }
    // setActualMinSlab(totalTaxAmount*slabFXRate)
    if (paidAdjustment.length > 0) {
      const totalAmount = paidAdjustment.reduce((total, adjustment) => {
        const amount = Number(adjustment.Amount || 0); // Ensure Amount is a number
        return adjustment['Adjustment Type'] === 'Less'
          ? total - amount
          : total + amount;
      }, 0);

      // const actualSlab = slabFXRate; // Assuming actualMinSlab is defined

      console.log('adjustments::', totalTaxAmount);
      console.log('actualSlab::', slabFXRate);
      // if(actualMinSlab === totalTaxAmount){
      // setActualMinSlab(totalTaxAmount);}
      setActualSlabMain(totalTaxAmount)

      setActualPaidAftAdj(totalTaxAmount + totalAmount);
    } // Start with an initial total of 0
  }, [paidAdjustment, slabFXRate, slabTaxes, actualMinSlab]);

  useEffect(() => {
    if (tDSCurrency.length > 0) {
      console.log('currency tds::', tDSCurrency); // Logs the first element of the array
      fetchBillPaymentDetails();
    } else {
      console.log('currency tds:: No currency available');
    }
  }, [tDSCurrency]);

  useEffect(() => {
    console.log('excluseTblTwo::', tDSCurrency);
    const totalTdsAmount = (excluseTblTwo || []).reduce((sum, item) => {
      return item['Apply TDS'] === true
        ? sum + Number(item['TDS Amount'] || 0)
        : sum;
    }, 0);

    console.log('totalTdsAmount:', totalTdsAmount * fxRate);
    const tds = totalTdsAmount * fxRate;
    setCalculatedTDS(tds);

    console.log('calculatedTDS:', calculatedTDS);

    // pairsData[0][`TDS Amount (${tDSCurrency[0]})`] = tds;
  }, [excluseTblTwo]);

  useEffect(() => {
    if (transValue.length > 9 && transValue[9].length > 0) {
      const slabKeys = [
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
      ];

      const slabValues = transValue[9][0]; // Assuming transValue[9][0] is the array of values
      const slabTaxObject = {};

      // Dynamically map keys to values
      slabKeys.forEach((key, index) => {
        slabTaxObject[key] = slabValues[index];
      });

      console.log('Mapped Slab Tax:', slabTaxObject);
      setSlabTax([slabTaxObject]); // Pass the mapped object to setSlabTax
    }
  }, [transValue]); // Re-run when transValue changes

  useEffect(() => {
    console.log('tDSCurrency:::', tDSCurrency);
  }, [tDSCurrency]);

  useEffect(() => {
    console.log('isLoading:::', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('fxRate:::', fxRate);
    console.log('tDSCurrency:::', tDSCurrency);
  }, [fxRate]);

  useEffect(() => {
    console.log('PDFModalVisible:::', PDFModalVisible);
  }, [PDFModalVisible]);

  useEffect(() => {
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
    const bodyApprovalStringified = JSON.stringify(body._j);
    const bodyRejStringified = JSON.stringify(rejBody);
    console.log('rejBodyJson::', JSON.stringify(rejBody));
    console.log('rejBody::', rejBody);
    setRejParams(bodyRejStringified);
    setApprovalParams(bodyApprovalStringified);
    console.log('body req::', bodyRejStringified); // Log immediately before updating the state
  }, [transValue]);

  useEffect(() => {
    setIsLoading(true);
    console.log('accountNo:::::', accountNo);
    // Supplier Bank Above Table
    FetchValueAssignKeysAPI(
      `${API_URL}/api/approval/payment/getBillsBankDetails?accountNo=${accountNo}`,
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
    setIsLoading(false);
  }, [accountNo]);
  useEffect(() => {
    setIsLoading(true);
    console.log('paymentId::', paymentId);
    //   Bills selected to Pay api
    FetchValueAssignKeysAPI(
      `${API_URL}/api/approval/payment/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,
      // `${API_URL}/api/approval/paymentGroup/getPayDetails?payment_id=${paymentId}&dataFor=Approval`,
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
      `${API_URL}/api/approval/payment/getPaidTaxDetails1?payment_id=${paymentId}`,
      // `http://192.168.0.107:8100/rest/approval/getPaidTaxDetails1?payment_id=${paymentId}`,
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
    if (slabTax.length < 1) {
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
    }

    //Other Changes and Adjustments(without tax)
    FetchValueAssignKeysAPI(
      `${API_URL}/api/approval/payment/getPaidAdjustmentDetails?payment_id=${paymentId}`,
      // `http://192.168.0.107:8100/rest/approval/getPaidAdjustmentDetails?payment_id=${paymentId}`,
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
      `${API_URL}/api/common/loadVectorwithContentsjson/`,
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
    setIsLoading(false);
  }, [paymentId]);

  useEffect(() => {
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

    // fetchBillPaymentDetails();
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

  const fetchBillPaymentDetails = async () => {
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
          console.log(
            'Final PARTY_CURRENCY:',
            parsedTransObj[1].PARTY_CURRENCY,
          );
          setCurrency(parsedTransObj[1].PARTY_CURRENCY);

          const formattedData = {
            'Payment date': DateFormatComma(Main[1]),
            [`Actual Amount (${parsedTransObj[1].PARTY_CURRENCY})`]: Main[18],
            [`TDS Amount (${tDSCurrency})`]: 0,
            // ...(transactionDetails[3].length < 5
            //   ? {
            //       [`Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
            //         poDetails[2],
            //       'Cheque Ref No': transactionDetails[3],
            //       'Favour of': Main[3],
            //       'Cheque Date': DateFormatComma(Main[1]),
            //       // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
            //       [`Cheque Amt (${Main[9]})`]: Main[6],
            //     }
            //   : {
            [`Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
              Main[18],
            [`${
              Main[7] === 'RTGS/NEFT'
                ? 'RTGS/NEFT Ref '
                : Main[7] === 'Bank Transfer'
                ? 'TT '
                : Main[7] === 'Demand'
                ? 'DD '
                : Main[7] === 'Mobile Banking'
                ? 'MB Ref '
                : Main[7] === 'Debit Card'
                ? 'DC '
                : Main[7] === 'Credit Card'
                ? 'CC '
                : Main[7] === 'Cheque'
                ? 'Cheque '
                : 'Ref '
            }No`]: transactionDetails[3],
            ...(['Demand', 'Debit Card', 'Cheque'].includes(Main[7]) && {
              'Favour of': Main[3],
            }),
            [`${
              Main[7] === 'RTGS/NEFT'
                ? 'RTGS/NEFT '
                : Main[7] === 'Bank Transfer'
                ? 'TT '
                : Main[7] === 'Demand'
                ? 'DD '
                : Main[7] === 'Mobile Banking'
                ? 'MB '
                : Main[7] === 'Debit Card'
                ? 'DC '
                : Main[7] === 'Credit Card'
                ? 'CC '
                : Main[7] === 'Cheque'
                ? 'Cheque '
                : 'Cash '
            } Date`]: DateFormatComma(Main[1]),
            // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
            [`${
              Main[7] === 'RTGS/NEFT'
                ? 'RTGS/NEFT '
                : Main[7] === 'Bank Transfer'
                ? 'TT '
                : Main[7] === 'Demand'
                ? 'DD '
                : Main[7] === 'Mobile Banking'
                ? 'MB '
                : Main[7] === 'Debit Card'
                ? 'DC '
                : Main[7] === 'Credit Card'
                ? 'CC '
                : Main[7] === 'Cheque'
                ? 'Cheque '
                : 'Cash '
            } Amt (${Main[9]})`]: Main[6],
            // }),
          };
          const numResult = await NumToWordsCon(Main[6], Main[9]);
          setNumToWords(numResult);
          setActualMinSlab(
            formattedData[
              `Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`
            ],
          );
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

  // Karthic Nov 27 2k24
  return (
    <View style={styles.container}>
      <TitleBar
        text={`${
          transName === 'ModPayment' ? 'Modify Payment' : transName
        } - ${paymentId}`}
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
                onRefresh={fetchBillPaymentDetails} // Trigger fetchData on pull-down
                colors={[CustomThemeColors.primary]} // Customize spinner color
              />
            }>
            <InfoPairs
              data={pairsData}
              imp={[
                'Cheque No',
                'LC Ref No',
                'Favour of',
                'DD No',
                'RTGS/NEFT Ref No',
                'TT No',
                'MB Ref No',
                'DC No',
                'CC No',
              ]}
              valueChanger={{
                [`TDS Amount (${tDSCurrency})`]:
                  parseFloat(calculatedTDS).toFixed(4),
              }}
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
                onRefresh={fetchBillPaymentDetails} // Trigger fetchData on pull-down
                colors={[CustomThemeColors.primary]} // Customize spinner color
              />
            }>
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
              heading={`Application Slab Taxes(${tDSCurrency} Currency)`}
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
              <Text style={commonStyles.oneLineKey}>
                TDS Amount({tDSCurrency})
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={calculatedTDS.toString()}
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
                Actual Amount - Slab Tax Amount ({transValue[1].PARTY_CURRENCY})
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={parseFloat(actualSlabMain).toFixed(4)}
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
                value={parseFloat(actualPaidAftAdj).toFixed(4)}
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
            {(transValue[3].AC_Payee == 'Y' ||
              transValue[3].AC_Payee == 'N') && (
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
              <Text style={commonStyles.heading}>1 {mainData[10]} =</Text>
              <TextInput
                style={[commonStyles.inputNoBox]}
                placeholder="" // Placeholder text
                // value={mainData[11] ? mainData[11].toString() : ''}
                value={mainData[11].toString()}
                editable={false} // Disables input
              />
              <Text style={commonStyles.heading}>{mainData[9]}</Text>
            </View>
            {/* ---------------------------------------------------- */}
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Actual Paid</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={mainData[18] ? mainData[6].toString() : ''}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Calculate</Text>
            </View>

            {/* ---------------------------- Varies for data --------------------- */}
            <View>
              <View style={commonStyles.flexRow}>
                <Text style={commonStyles.oneLineKey}>
                  {mainData[7] === 'RTGS/NEFT'
                    ? 'RTGS/NEFT '
                    : mainData[7] === 'Bank Transfer'
                    ? 'TT '
                    : mainData[7] === 'Demand'
                    ? 'DD '
                    : mainData[7] === 'Mobile Banking'
                    ? 'MB '
                    : mainData[7] === 'Debit Card'
                    ? 'DC '
                    : mainData[7] === 'Credit Card'
                    ? 'CC '
                    : mainData[7] === 'Cheque'
                    ? 'Cheque '
                    : 'Cash '}
                  Ref No <Text style={commonStyles.redAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={[commonStyles.oneLineValue, commonStyles.input]}
                  placeholder="" // Placeholder text
                  value={transDetails[3].toString()}
                  editable={true} // Disables input
                />
              </View>
              {['Demand', 'Debit Card', 'Cheque'].includes(mainData[7]) && (
                <View style={commonStyles.flexRow}>
                  <Text style={commonStyles.oneLineKey}>
                    Favour of <Text style={commonStyles.redAsterisk}>*</Text>
                  </Text>
                  <Text style={commonStyles.oneLineValue}>
                    {transDetails[5]}
                  </Text>
                </View>
              )}
              <View style={commonStyles.flexRow}>
                <Text style={commonStyles.oneLineKey}>
                  {mainData[7] === 'RTGS/NEFT'
                    ? 'RTGS/NEFT '
                    : mainData[7] === 'Bank Transfer'
                    ? 'TT '
                    : mainData[7] === 'Demand'
                    ? 'DD '
                    : mainData[7] === 'Mobile Banking'
                    ? 'MB '
                    : mainData[7] === 'Debit Card'
                    ? 'DC '
                    : mainData[7] === 'Credit Card'
                    ? 'CC '
                    : mainData[7] === 'Cheque'
                    ? 'Cheque '
                    : 'Cash '}{' '}
                  Date
                </Text>
                <Text style={commonStyles.oneLineValue}>
                  {DateFormatComma(mainData[1])}
                </Text>
              </View>
              <View style={commonStyles.flexRow}>
                <Text style={commonStyles.oneLineKey}>
                  {mainData[7] === 'RTGS/NEFT'
                    ? 'RTGS/NEFT '
                    : mainData[7] === 'Bank Transfer'
                    ? 'TT '
                    : mainData[7] === 'Demand'
                    ? 'DD '
                    : mainData[7] === 'Mobile Banking'
                    ? 'MB '
                    : mainData[7] === 'Debit Card'
                    ? 'DC '
                    : mainData[7] === 'Credit Card'
                    ? 'CC '
                    : mainData[7] === 'Cheque'
                    ? 'Cheque '
                    : 'Cash '}
                  Amt ({mainData[9]})
                </Text>
                <TextInput
                  style={[commonStyles.oneLineValue, commonStyles.input]}
                  placeholder="" // Placeholder text
                  value={mainData[6].toString()}
                  editable={true} // Disables input
                />
              </View>
            </View>
            {/* ) : (
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
                    Favour of <Text style={commonStyles.redAsterisk}>*</Text>
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
            )} */}

            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Amount in words</Text>
              <Text style={commonStyles.oneLineValue}>
                {numToWords || 'Loading...'}{' '}
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
        </>
      )}
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

              const requestUrl = `${API_URL}/api/approval/payment/billspay_printPdf`;

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

              const requestUrl = `${API_URL}/api/approval/payment/billspay_printDetailedPdf`;
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
      {!isRefreshing && (
        <>
          <View style={styles.buttonContainer}>
            <CustomButton
              color={'white'}
              fontColor={'black'}
              onPress={handleButtonClick} // Trigger handleButtonClick on press
            >
              Click here for {showInfoPairs ? 'more' : 'less'} info
            </CustomButton>
          </View>
          <View>
            <ApproveRejectComponent
              approveUrl={`${API_URL}/api/common/approveTransaction`}
              rejectUrl={`${API_URL}/api/common/rejectTransaction`}
              rejParams={rejParams}
              params={approvalParams}
            />
          </View>
        </>
      )}
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
  modalBody: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
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
