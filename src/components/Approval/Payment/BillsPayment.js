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
import KeyValueJoiner from '../ApprovalComponents/KeyValueJoiner';
import AdjustMinSlabFXRate from '../ApprovalComponents/AdjustMinSlabFXRate';
import AdvanceAdjApi from './BillsComp/AdvanceAdjApi';
import {
  getUpdateCheckStatus,
  updateModRejectPayStatus,
} from './BillsComp/ReUseCancelComp';
import finLoadVectorwithContentsAPI, {
  useFinLoadVectorwithContentsAPI,
} from '../ApprovalComponents/finLoadVectorwithContentsAPI';
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
  const [orderTyp, setOrderTyp] = useState('');
  const [currency, setCurrency] = useState('');
  const [actual, setActual] = useState('');
  const [mainData, setMainData] = useState([]);
  const [transDetails, setTransDetails] = useState([]);
  const [transValue, setTransValue] = useState([]);

  const [showInfoPairs, setShowInfoPairs] = useState(true);
  const [billsPay, setBillsPay] = useState([]);
  const [excluseTblTwo, setExcluseTblTwo] = useState([]);
  // const [slabTax, setSlabTax] = useState([]);
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
  const [slabFXRate, setSlabFXRate] = useState('');
  const [reUseCancel, setReUseCancel] = useState('');
  const [checkStatus, setCheckStatus] = useState([]);

  const [query, setQuery] = useState('');
  const [finloadData, setFinloadData] = useState(null);
  const [advAdjSub, setAdvAdjSub] = useState(null);

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
    console.log('advAdjSub::', advAdjSub);
    if (advAdjSub != null) {
      const generatePOData = data => {
        const selectedMat = `(${data[0][2]},'${data[0][3]}')`; // 31924, 79453
        const orderNull = `(${data[0][2]},' ')`; // 31924, ''

        // Aggregate values for hmtotalOrderMap
        const hmtotalOrderMap = {
          MAIN: {
            [data[0][2]]: parseInt(data[0][11], 10), // 14850
          },
          CHARGES: {
            [data[1][2]]: parseInt(data[1][11], 10), // 75000
          },
          ADJUSTMENT: {
            [data[2][2]]: parseInt(data[2][11], 10) + parseInt(data[3][11], 10), // 20 + 5 = 25
          },
          TAX: {},
        };

        return {
          type: 'PO',
          adjustmentMethod: 'Payment Adjustment',
          orderSelectedMat: selectedMat,
          orderMat: mainData[3], // Assuming this is a fixed value
          orderNull: orderNull,
          hmtotalOrderMap: hmtotalOrderMap,
          defaultLoad: false,
          billNo: mainData[0], // Example bill number, adjust as needed
        };
      };
      const generatedData = generatePOData(advAdjSub);
      console.log('AdvAdjusted::', generatedData);
      console.log('AdvAdjusted transValue[4]?.[0]?.ORDER_TYPE::', orderTyp);
      const adjKeys =
        orderTyp === 'JO'
          ? [
              'JO No',
              'JO Status',
              'JO Value',
              'JO Currency',
              'Advance Paid(INR)',
              'Tax Paid',
              'Advance %',
              'Advance Adjusted(INR)',
              'Remaining Advance(INR)',
              'XRate',
              'Remaining Adv(INR)',
              'Adjust Advance(INR)',
            ]
          : orderTyp === 'PO'
          ? [
              'P Order No',
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
            ]
          : [
              'SO No',
              'SO Status',
              'SO Value',
              'SO Currency',
              'Advance Paid(INR)',
              'Tax Paid',
              'Advance %',
              'Advance Adjusted(INR)',
              'Remaining Advance(INR)',
              'XRate',
              'Remaining Adv(INR)',
              'Adjust Advance(INR)',
            ];
      // Advance adjustment Modal
      AdvanceAdjApi(
        `http://192.168.0.169:8100/rest/approval/getBillAdjustment/`,
        adjKeys,
        [0, 3, 4, 5, 6,7, 14, 18, 19],
        // [],
        setAdvanceAdjustmentModal,
        generatedData,
        'POST',
        // ['22'],
        [mainData[17]]
      );
    }
  }, [advAdjSub]);

  useEffect(() => {
    console.log('finloadData::', finloadData);
    if (finloadData != null) {
      const generateQuery = data => {
        // Generate the dynamic part of the query based on finloadDataa
        const adjustments = data
          .map(row => {
            return `UNION ALL SELECT ${row[0]} AS bill_id, ${row[1]} AS order_no, 0 AS ref, 0 AS item, 0 AS mat_no, ${row[2]} AS adjustment_id, ' ' AS adjustment_name, ' ' AS adjustment_type, ' ' AS uom, 'ADJUSTMENT', ${row[3]} AS calculation_amt FROM dual`;
          })
          .join(' ');

        // Construct the full query
        const query = {
          query: `
          SELECT SB.INTERNAL_BILL_NO, SI.* FROM
          (SELECT SI.BILL_ID, SI.SO_ID, SI.SERVICE_ID AS REFERENCE_NO, 0 AS ITEM_NO, 0 AS MAT_NO, 0 AS SERVICE_ID, SM.SERVICE_CATEGORY, SM.SERVICE_TYPE, SM.UOM, 'MAT' AS MAT_CHARGE,
          SI.BILL_AMOUNT - COALESCE(SI.DISCOUNT, 0) - COALESCE(SI.DEBIT_QTY * SI.DEBIT_RATE, 0) AS AMOUNT
          FROM SO_BILL_INFO SI
          INNER JOIN service_master SM ON SI.service_id = SM.service_id
          UNION ALL
          SELECT SI.BILL_ID, SI.SO_ID, SI.REF_SERVICE_ID, 0 AS ITEM_NO, 0 AS MAT_NO, SI.SERVICE_ID, SI.MAT_SERV_CATEGORY, SI.MAT_SERV_TYPE, SI.UOM, 'CHARGE', SI.amount
          FROM SO_BILL_ADD_CHARGES SI
          ${adjustments}
          ) SI
          INNER JOIN SO_BILL SB ON SI.BILL_ID = SB.BILL_ID
          WHERE (SB.INTERNAL_BILL_NO, 0) IN (('${transValue[7][0][1]}', 0))
      
          UNION ALL
          SELECT SB.INTERNAL_BILL_REF_NO, SI.* FROM
          (SELECT SI.BILL_ID, SI.PO_NO, SI.MAT_NO AS REFERENCE_NO, 0 AS ITEM_NO, 0 AS MAT_NO, 0 AS SERVICE_ID, M.CATEGORY, M.TYPE, M.UOM1, 'MAT',
          SI.bill_qty * SI.bill_rate - COALESCE(discount_amt, 0) - COALESCE(debit_qty * debit_rate, 0)
          FROM SUPPLIER_BILL_INFO SI
          INNER JOIN MATERIAL M ON M.MAT_NO = SI.MAT_NO
          UNION ALL
          SELECT SI.BILL_ID, SI.PO_NO, SI.MAT_NO, 0 AS ITEM_NO, 0 AS MAT_NO, SI.SERVICE_ID, SI.MAT_SERV_CATEGORY, SI.MAT_SERV_TYPE, SI.UOM, 'CHARGE', SI.amount
          FROM SUPPLIER_BILL_ADD_CHARGES SI
          ${adjustments}
          ) SI
          INNER JOIN SUPPLIER_BILL SB ON SI.BILL_ID = SB.BILL_ID
          WHERE (SB.INTERNAL_BILL_REF_NO, 0) IN (('${transValue[7][0][1]}', 0))
      
          UNION ALL
          SELECT JB.INTERNAL_BILL_REF_NO, JI.* FROM
          (SELECT JI.BILL_ID, JI.JO_ID, JI.JOB_ID AS REFERENCE_NO, ITEM_NO, JI.MAT_NO, 0 AS SERVICE_ID, M.CATEGORY, M.TYPE, M.UOM1, 'MAT',
          JI.bill_qty * JI.bill_rate - COALESCE(discount_amt, 0) - COALESCE(debit_qty * debit_rate, 0)
          FROM JOB_WORK_BILL_INFO JI
          INNER JOIN MATERIAL M ON M.MAT_NO = JI.MAT_NO
          UNION ALL
          SELECT JI.BILL_ID, JI.JO_ID, JI.JOB_ID, JI.ITEM_NO, JI.MAT_NO, JI.SERVICE_ID, JI.MAT_SERV_CATEGORY, JI.MAT_SERV_TYPE, JI.UOM, 'CHARGE', JI.amount
          FROM JOB_WORK_BILL_ADD_CHARGES JI
          ${adjustments}
          ) JI
          INNER JOIN JOB_WORK_BILL JB ON JI.BILL_ID = JB.BILL_ID
          WHERE (JB.INTERNAL_BILL_REF_NO, 0) IN (('${transValue[7][0][1]}', 0))
        `,
        };

        return query;
      };

      const dynamicQuery = generateQuery(finloadData);
      console.log('dynamicQuery::', dynamicQuery);
      useFinLoadVectorwithContentsAPI(dynamicQuery, setAdvAdjSub);
    }
  }, [finloadData]);

  useEffect(() => console.log('advAdjSub::', advAdjSub), [advAdjSub]);

  useEffect(
    () => console.log('advanceAdjustmentModal::', advanceAdjustmentModal),
    [advanceAdjustmentModal],
  );

  useEffect(() => {
    console.log('paidAdjustment::', paidAdjustment);
    let totalTaxAmount = 0;
    // console.log('slabTaxes:', slabTaxes[0]['ST Paid']);
    if (slabTaxes) {
      if (slabTaxes[0]['ST Paid']) {
        const totalAmount = slabTaxes
          .map(item => parseFloat(item['ST Paid'])) // Convert Tax Amount to a number
          .reduce((sum, amount) => sum + amount, 0); // Sum all Tax Amounts
        totalTaxAmount = actualMinSlab - totalAmount * slabFXRate;
        console.log('Total Tax Amount:', totalAmount);
      } else {
        totalTaxAmount = actualMinSlab;
      }
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
      setActualSlabMain(totalTaxAmount);

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

  // useEffect(() => {
  //   if (transValue.length > 9 && transValue[9].length > 0) {
  //     console.log("transObj 9::"+transValue[9])
  //     const slabKeys = [
  //       'Party Name',
  //       'Party Type',
  //       'Dept Name',
  //       'Tax Name',
  //       'Rate',
  //       'Tax Amount',
  //       'Already Paid',
  //       'Slab',
  //       'Bill Amount',
  //       'ST Paid',
  //       'Applied ST',
  //     ];

  //     const slabValues = transValue[9][0]; // Assuming transValue[9][0] is the array of values
  //     const slabTaxObject = {};

  //     // Dynamically map keys to values
  //     slabKeys.forEach((key, index) => {
  //       slabTaxObject[key] = slabValues[index];
  //     });

  //     console.log('Mapped Slab Tax:', slabTaxObject);
  //     setSlabTaxes([slabTaxObject]); // Pass the mapped object to setSlabTax
  //   }
  // }, [transValue]); // Re-run when transValue changes

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
    setRejParams(bodyRejStringified);
    setApprovalParams(bodyApprovalStringified);
    console.log('body req::', bodyRejStringified); // Log immediately before updating the state

    if (transValue.length > 0) {
      console.log('transValue[8]::', JSON.stringify(transValue[7]));
      if (transValue?.[7]?.[0]?.[0]) {
        // const dynamicQuery = {
        //   query: `SELECT t1.*, t2.adj_amt FROM (SELECT BA.BILL_ID, ba.po_so_jo_no AS jo_id, ba.adjustment_id, SUM(BA.CALCULATION_AMT) AS total_add FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE = 'Add' GROUP BY BA.BILL_ID, BA.PO_SO_JO_NO, ba.adjustment_id, BA.ADJUSTMENT_TYPE) t1 INNER JOIN (SELECT bill_id, jo_id, SUM(total_less) AS adj_amt FROM (SELECT BA.BILL_ID, ba.po_so_jo_no AS jo_id, SUM(BA.CALCULATION_AMT) AS total_less FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE = 'Less' GROUP BY BA.BILL_ID, ba.po_so_jo_no, BA.ADJUSTMENT_TYPEUNION ALLSELECT ba.bill_id, ba.po_so_jo_no AS jo_id, SUM(BA.CALCULATION_AMT) AS total_add FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE = 'Add' GROUP BY BA.BILL_ID, BA.PO_SO_JO_NO, BA.ADJUSTMENT_TYPE) GROUP BY BILL_ID, JO_ID) T2 ON T1.BILL_ID = T2.BILL_ID AND COALESCE(T2.JO_ID, 0) = COALESCE(T1.JO_ID, 0) WHERE (t1.bill_id, 0) IN (('${transValue[7][0][0]}', 0))`,
        // };
        const dynamicQuery = {
          query: `SELECT t1.*,t2.adj_amt FROM (SELECT BA.BILL_ID, ba.po_so_jo_no AS jo_id, ba.adjustment_id, SUM(BA.CALCULATION_AMT) as total_add FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE='Add' GROUP BY BA.BILL_ID, BA.PO_SO_JO_NO, ba.adjustment_id, BA.ADJUSTMENT_TYPE) t1 INNER JOIN (SELECT bill_id, jo_id, SUM(total_less) as adj_amt FROM (SELECT BA.BILL_ID, ba.po_so_jo_no AS jo_id, SUM(BA.CALCULATION_AMT) as total_less FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE='Less' GROUP BY BA.BILL_ID, ba.po_so_jo_no, BA.ADJUSTMENT_TYPE UNION ALL SELECT ba.bill_id, ba.po_so_jo_no AS jo_id, SUM(BA.CALCULATION_AMT) as total_add FROM BILL_ADJUSTMENTS BA WHERE ADJUSTMENT_TYPE='Add' GROUP BY BA.BILL_ID, BA.PO_SO_JO_NO, BA.ADJUSTMENT_TYPE) GROUP BY BILL_ID, JO_ID) t2 ON T1.BILL_ID=T2.BILL_ID AND COALESCE(T2.JO_ID,0)=COALESCE(T1.JO_ID,0) WHERE (t1.bill_id,0) IN (('${transValue[7][0][0]}',0))`,
        };
        setQuery(dynamicQuery);
        console.log('dynamicQuery[8]::', dynamicQuery);
        useFinLoadVectorwithContentsAPI(dynamicQuery, setFinloadData);
      }

      // useFinLoadVectorwithContentsAPI(query, setFinloadData);
      // where (t1.bill_id,0) in ((${transValue[7][0][0]},0))`,finloadData)

      // console.log('finloadData::', finloadData);
      // const finloadDataa = [
      //   ['2612', '31924', '11', '20', '25'],
      //   ['2612', '31924', '10', '5', '25'],
      // ];

      if (transValue[13]) {
        const advPayParams = {
          type: transValue[13][0]?.['ORDER_TYPE'], // Access ORDER_TYPE
          adjustmentMethod: 'Payment Adjustment',
          orderSelectedMat: `(${transValue[13][0]?.['FROM_ORDER']},'${transValue[13][0]?.['FROM_SID']}')`, // Template literal for dynamic value
          orderMat: `${mainData[3]}`, // Use template literal to insert mainData[3]
          orderNull: `(${transValue[13][0]?.['FROM_ORDER']},' ')`, // Template literal for dynamic value
          hmtotalOrderMap: {
            MAIN: {
              [transValue[13][0]?.['FROM_ORDER']]:
                transValue[8]['SUP-1070']?.[0], // Use dynamic key here
            },
            CHARGES: {},
            ADJUSTMENT: {},
            TAX: {},
          },
          defaultLoad: false,
          billNo: `${transValue[0]}`, // Use template literal for dynamic value
        };

        // console.log('advance Adj:', advPayParams);
      }
    }
    // getUpdateCheckStatus(
    //   transName,
    //   paymentId,
    //   mainData[8],
    //   transDetails[3],
    //   mainData[7],
    // );
    // updateModRejectPayStatus(
    //   transName,
    //   paymentId,
    //   mainData[8],
    //   transDetails[3],
    //   mainData[7],
    //   transValue,
    //   transId,
    // );
  }, [transValue]);
  useEffect(() => {
    console.log('query::', query);

    // useFinLoadVectorwithContentsAPI(query, setFinloadData);
  }, [query]);
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
    // if (slabTaxes.length < 1) {
    //   FetchValueAssignKeysAPI(
    //     '',
    //     [
    //       'Party Name',
    //       'Party Type',
    //       'Dept Name',
    //       'Tax Name',
    //       'Rate',
    //       'Tax Amount',
    //       'Already Paid',
    //       'Slab',
    //       'Bill Amount',
    //       'ST Paid',
    //       'Applied ST',
    //     ],
    //     [],
    //     setSlabTaxes,
    //   );
    // }

    const keys = [
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

    // Call the KeyValueJoiner function
    KeyValueJoiner(keys, transValue[9], [9], setSlabTaxes);
    // console.log('filteredPairs', transValue[9]);
    // console.log('filteredPairs', filteredPairs);
    // setSlabTaxes(filteredPairs);

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
    const chkSts = getUpdateCheckStatus(
      transName,
      paymentId,
      mainData[8],
      transDetails[3],
      mainData[7],
      currentLevel,
    );
    setCheckStatus(chkSts);
    setIsLoading(false);
    // console.log('adadvPayParams', advPayParams);
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
  const toggleModalReUse = () => {
    setReUseCancel(!reUseCancel);
  };

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
          console.log('orderType', parsedTransObj[13][0]['ORDER_TYPE']);
          setOrderTyp(parsedTransObj[13][0]['ORDER_TYPE']);

          console.log('Final Main::', Main);
          console.log('Final transactionDetails:', transactionDetails);
          console.log('Final poDetails:', parsedTransObj);
          console.log(
            'Final PARTY_CURRENCY:',
            parsedTransObj[1].PARTY_CURRENCY,
          );
          setCurrency(parsedTransObj[1].PARTY_CURRENCY);
          setActual(poDetails[2].toFixed(4));

          const formattedData = {
            'Payment date': DateFormatComma(Main[1]),
            [`Actual Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
              poDetails[2].toFixed(4),
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
              poDetails[2].toFixed(4),
            [`${
              Main[7].toLowerCase() === 'RTGS/NEFT'.toLowerCase()
                ? 'RTGS/NEFT Ref '
                : Main[7].toLowerCase() === 'Bank Transfer'.toLowerCase()
                ? 'TT '
                : Main[7].toLowerCase() === 'Demand'.toLowerCase()
                ? 'DD '
                : Main[7].toLowerCase() === 'MOBILE BANKING'.toLowerCase()
                ? 'MB Ref '
                : Main[7].toLowerCase() === 'Debit Card'.toLowerCase()
                ? 'DC '
                : Main[7].toLowerCase() === 'Credit Card'.toLowerCase()
                ? 'CC '
                : Main[7].toLowerCase() === 'Cheque'.toLowerCase()
                ? 'Cheque '
                : 'Ref '
            }No`]: transactionDetails[3],
            ...(['Demand', 'Debit Card', 'Cheque'].includes(Main[7]) && {
              'Favour of': transactionDetails[5],
            }),
            [`${
              Main[7] === 'RTGS/NEFT'
                ? 'RTGS/NEFT '
                : Main[7] === 'Bank Transfer'
                ? 'TT '
                : Main[7] === 'Demand'
                ? 'DD '
                : Main[7] === 'MOBILE BANKING'
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
              Main[7].toLowerCase() === 'RTGS/NEFT'.toLowerCase()
                ? 'RTGS/NEFT '
                : Main[7].toLowerCase() === 'Bank Transfer'.toLowerCase()
                ? 'TT '
                : Main[7].toLowerCase() === 'Demand'.toLowerCase()
                ? 'DD '
                : Main[7].toLowerCase() === 'MOBILE BANKING'.toLowerCase()
                ? 'MB '
                : Main[7].toLowerCase() === 'Debit Card'.toLowerCase()
                ? 'DC '
                : Main[7].toLowerCase() === 'Credit Card'.toLowerCase()
                ? 'CC '
                : Main[7].toLowerCase() === 'Cheque'.toLowerCase()
                ? 'Cheque '
                : 'Cash '
            } Amt (${Main[9]})`]: Main[6],
            // }),
          };
          setActualMinSlab(poDetails[2].toFixed(4));
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
      <AdjustMinSlabFXRate
        FromCurrency={tDSCurrency}
        ToCurrency={currency}
        setFxRate={setSlabFXRate}
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
                [`Actual Paid After Adjustment`]:
                  parseFloat(actualPaidAftAdj).toFixed(4),
                [`Actual Amount-Slab Tax Amount (${transValue[1]?.PARTY_CURRENCY})`]:
                  parseFloat(actualSlabMain).toFixed(4),
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
              tableData={slabTaxes}
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
                value={parseFloat(calculatedTDS).toFixed(4)}
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
                value={(transValue[13][0]?.['FROM_AMOUNT']
                  ? transValue[13][0]?.['FROM_AMOUNT']
                  : 0
                ).toString()}
                // value={mainData[17].toString()}
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
                value={(advanceAdjustmentModal['XRate']
                  ? actual - mainData[17]
                  : actual
                ).toString()}
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
                value={mainData[6] ? mainData[6].toString() : ''}
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
                  {mainData[7].toLowerCase() === 'rtgs/neft'.toLowerCase()
                    ? 'RTGS/NEFT Ref '
                    : mainData[7].toLowerCase() ===
                      'Bank Transfer'.toLowerCase()
                    ? 'TT '
                    : mainData[7].toLowerCase() === 'Demand'.toLowerCase()
                    ? 'DD '
                    : mainData[7].toLowerCase() ===
                      'MOBILE BANKING'.toLowerCase()
                    ? 'MB Ref '
                    : mainData[7].toLowerCase() === 'Debit Card'.toLowerCase()
                    ? 'DC '
                    : mainData[7].toLowerCase() === 'Credit Card'.toLowerCase()
                    ? 'CC '
                    : mainData[7].toLowerCase() === 'Cheque'.toLowerCase()
                    ? 'Cheque '
                    : 'Ref '}
                  No <Text style={commonStyles.redAsterisk}>*</Text>
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
                  {mainData[7] === 'RTGS/NEFT'.toLowerCase()
                    ? 'RTGS/NEFT '
                    : mainData[7].toLowerCase() ===
                      'Bank Transfer'.toLowerCase()
                    ? 'TT '
                    : mainData[7].toLowerCase() === 'Demand'.toLowerCase()
                    ? 'DD '
                    : mainData[7].toLowerCase() ===
                      'MOBILE BANKING'.toLowerCase()
                    ? 'MB '
                    : mainData[7].toLowerCase() === 'Debit Card'.toLowerCase()
                    ? 'DC '
                    : mainData[7].toLowerCase() === 'Credit Card'.toLowerCase()
                    ? 'CC '
                    : mainData[7].toLowerCase() === 'Cheque'.toLowerCase()
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
                  {mainData[7] === 'RTGS/NEFT'.toLowerCase()
                    ? 'RTGS/NEFT '
                    : mainData[7].toLowerCase() ===
                      'Bank Transfer'.toLowerCase()
                    ? 'TT '
                    : mainData[7].toLowerCase() === 'Demand'.toLowerCase()
                    ? 'DD '
                    : mainData[7].toLowerCase() ===
                      'MOBILE BANKING'.toLowerCase()
                    ? 'MB '
                    : mainData[7].toLowerCase() === 'Debit Card'.toLowerCase()
                    ? 'DC '
                    : mainData[7].toLowerCase() === 'Credit Card'.toLowerCase()
                    ? 'CC '
                    : mainData[7].toLowerCase() === 'Cheque'.toLowerCase()
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
          Payment Amount: {parseFloat(mainData[19]).toFixed(4)} ({currency})
          {/* Payment Amount: {parseFloat(transValue[2]["PAYABLE_AMOUNT"]).toFixed(4)} ({currency}) */}

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

      <CustomModal
        isVisible={reUseCancel}
        onClose={toggleModalReUse}
        title=""
        isVisibleClose={false}>
        {/* Children Content */}
        <TouchableOpacity
          onPress={() => {
            updateModRejectPayStatus(
              transName,
              paymentId,
              mainData[8],
              transDetails[3],
              mainData[7],
              transValue,
              transId,
              'Re-Use',
              currentLevel,
              checkStatus,
            );
            toggleModalReUse();
            navigation.navigate('ApprovalMainScreen');
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Re-Use</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            updateModRejectPayStatus(
              transName,
              paymentId,
              mainData[8],
              transDetails[3],
              mainData[7],
              transValue,
              transId,
              'Cancelled',
              currentLevel,
              checkStatus,
            );
            toggleModalReUse();
            navigation.navigate('ApprovalMainScreen');
          }}
          style={styles.pdfSubOption}>
          <Text style={styles.subOptionText}>Cancelled</Text>
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
              setReUseCancel={setReUseCancel}
              paymentMode={mainData[7]}
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
