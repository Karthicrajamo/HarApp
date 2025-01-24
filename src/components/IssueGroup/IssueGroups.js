import React, {useEffect, useRef, useState} from 'react';
import TableComponent from './TableComponent';
import TitleBar from '../common-utils/TitleBar';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  PixelRatio,
} from 'react-native';
import CustomButton from '../common-utils/CustomButton';
import {Text} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../ApiUrl';
import LoadingIndicator from '../commonUtils/LoadingIndicator';
import DateFilter from '../common-utils/DateFilter';
import {sharedData} from '../Login/UserId';
import SubTableComponent from './SubTableComponent';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import PdfComponent from './PdfComponent';
import {CustomThemeColors} from '../CustomThemeColors';
import ModalTableComponent from './ModalTableComponent';
import DeviceInfo from 'react-native-device-info';
import {Alert} from 'react-native';
import {ToastAndroid} from 'react-native';
import CustomModal from '../common-utils/modal';
import CustomAlert from '../common-utils/CustomAlert';
import {ActivityIndicator} from 'react-native-paper';
import {setActive} from 'react-native-sound';

const IssueGroups = () => {
  const fontScale = PixelRatio.getFontScale();

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    console.log('rmiData1>>>' + grpId);
    console.log('rmiData>>>' + rmiData);
  }, [grpId, rmiData, selectedDataPaymentType]);

  const [grpId, setSelectedextRmiData1] = useState([]);

  const [rmiData, setSelectedextRmiData] = useState([]);
  const [activeDataPdf, setActiveDataPdf] = useState([]);
  const [partyName, setpartyNames] = useState('');
  const [currency, setCurrency] = useState('');
  const [subTabPaymentId, setSubTabPaymentId] = useState('');

  const [tableData, setTableData] = useState([]);
  const [tableDataForFilter, setTableDataForFilter] = useState([]);
  const navigation = useNavigation(); //For Nagivation
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(isLoading);

  //Refresh Component
  const [refreshing, setRefreshing] = useState(false);

  const currentDate = new Date();

  // Calculate current date minus 30 days
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 31);

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

  const [selectedDataGroupId, setSelectedDataGroupId] = useState([]);
  const [selectedDataPaymentType, setSelectedDataDataPaymentType] = useState(
    [],
  );

  const [model, isModel] = useState(false);
  const [isModelButton, setModelButton] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [mainTableSelectedIndex, setMainTableSelectedIndex] = useState([]);
  const [mainTableSelectAll, setMainTableSelectAll] = useState(true);

  const [selectedSubRow, setSelectedSubRow] = useState(null);
  const [selectedSubData, setSelectedSubData] = useState([]);
  const [subData, setSelectedModelSubData] = useState([]);
  const [taxData, setTaxData] = useState([]);

  const [selectedModelData, setSelectedModelData] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState([]);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [filteredMainData, setFilteredMainData] = useState([]);
  const [filteredTempData, setFilteredTempData] = useState([]);
  const [onPressCheckBoxHandle, setOnPressCheckBoxHandle] = useState(false);
  const [isPaymentGroupModal, setIsPaymentGroupModal] = useState(false);
  const [paymentGroupPdf, setPaymentGroupPdf] = useState(false);
  const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState({});
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [MainType, setMainType] = useState('');
  const [tempPayments, setTempPayments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedArray, setSelectedArray] = useState([]);
  const [activeGroupId, SetActiveGroupId] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const isAnyFilterSelected = selectedFilters.length > 0;
  const [subTableLoading, setSubTableLoading] = useState(false);
  const [hideSubTab, setHideSubTab] = useState(false);

  const tempLoad = useRef(0);

  useEffect(() => {
    console.log('dastasaaa::'+Object.keys(selectedSubData).length )
    console.log('dastasaaas::'+JSON.stringify(selectedData))
    // if (!mainTableSelectAll && Object.keys(selectedSubData).length !== 0)
    //   setSelectedSubData([]);
  }, [selectedSubData,selectedRow]);
  useEffect(() => {
    console.log('selectedModelData::', selectedModelData);
    if (selectedModelData.length > 0) {
      setModelButton(true);
      setIsLoading(false);
    }
  }, [selectedModelData]);

  useEffect(() => {
    console.log('tempPayments::', tempPayments);
    const filterPayments = payments => {
      return Object.fromEntries(
        Object.entries(payments).filter(([key]) => !key.startsWith('groupId')),
      );
    };

    // Get the filtered result
    const filteredPayments = filterPayments(tempPayments);

    console.log('#$%##%#$%#%' + JSON.stringify(filteredPayments));
    console.log('#$%##%#$%#%.length' + Object.keys(filteredPayments).length);
    console.log(
      '#$%##%#$%#%selectedPayments' + JSON.stringify(selectedPayments),
    );
    console.log(
      '#$%##%#$%#%selectedPayments.length' +
        Object.keys(selectedPayments).length,
    );
    if (Object.keys(selectedPayments).length != mainTableSelectedIndex.length)
      setSelectedPayments(filteredPayments);
  }, [tempPayments]);

  useEffect(() => {
    console.log('selectedPayments::', selectedPayments);
    // console.log(
    //   'selectedPayments.length::',
    //   Object.keys(selectedRow).length,
    // );
    const filterSelectedPayments = (
      selectedPayments,
      mainTableselectedIndex,
    ) => {
      return Object.fromEntries(
        Object.entries(selectedPayments).filter(([key]) =>
          mainTableselectedIndex.includes(parseInt(key.split(':')[1])),
        ),
      );
    };

    // Get the filtered result
    const filteredPayments = filterSelectedPayments(
      selectedPayments,
      mainTableSelectedIndex,
    );

    console.log('------------sdfd' + JSON.stringify(filteredPayments));
    if (JSON.stringify(selectedPayments) != JSON.stringify(filteredPayments)) {
      setSelectedPayments(filteredPayments);
    }
  }, [selectedPayments]);
  useEffect(() => {
    console.log('mainTableSelectAll::', mainTableSelectAll);
  }, [mainTableSelectAll]);
  useEffect(() => {
    console.log('Updated onPressCheckBoxHandle----:', onPressCheckBoxHandle);
    // SetActiveGroupId('')
  }, [onPressCheckBoxHandle]);
  useEffect(() => {
    console.log('Updated selectedArray----:', selectedArray);
  }, [selectedArray]);
  useEffect(() => {
    console.log('Updated selectedGroupData:', selectedGroupData);
  }, selectedGroupData);

  useEffect(() => {
    console.log('isLoadingRef::' + loadingRef);
  }, [loadingRef]);

  useEffect(() => {
    console.log('sfsggmainType', MainType);
  }, [MainType]);

  useEffect(() => {
    console.log('isModelButton:::', isModelButton);
  }, [isModelButton]);

  useEffect(() => {
    // console.log('isPaymentGroupModal::::', isPaymentGroupModal);
    if (!isPaymentGroupModal) setIsLoading(false);
  }, [isPaymentGroupModal]);
  useEffect(() => {
    console.log('selectedPaymentType::::', selectedPaymentType);
    // if (selectedPaymentType.length > 0) {
    //   PrintGroupPdf();
    //   // } else {
    //   //   setIsLoading(false);
    //   //   Alert.alert('Note', 'Please select atleast one payment to print PDF');
    // }
  }, [selectedPaymentType]);
  useEffect(() => {
    // fetchModelTableData()
    if (taxData.length > 0) {
      console.log('Tax data has been updated:', MainType);
      if (MainType == 'Advance Payment') {
        fetchModelAdvPay();
      } else if (MainType == 'Tax Payment') {
        fetchSubTableTax();
      } else if (MainType == 'Paysheet Payment') {
        console.log('taxdata______', MainType);
        fetchModelTableData();
      } else if (MainType == 'Bills Payment') {
        fetchBillsPaymentDetailsData();
      }

      // You can perform any other actions here
    }
  }, [taxData]);

  useEffect(() => {
    console.log('selectedCheckBoxData:::', selectedCheckBoxData);

    // setSelectedPayments(prev=>
    // {}
    // )

    // setSelectedCheckBoxData(selectedCheckBoxData.filter(dataa=>dataa.length !=0))
  }, [selectedCheckBoxData]);

  // const columns = Object.keys(selectedModelData);
  function makeReadable(word) {
    // Split camelCase or PascalCase string into words
    const words = word.replace(/([a-z])([A-Z])/g, '$1 $2').split(/(?=[A-Z])/);

    // Capitalize each word
    const readableWords = words.map(
      w => w.charAt(0).toUpperCase() + w.slice(1),
    );

    // Join words with a space and return the transformed string
    return readableWords.join(' ');
  }

  useEffect(() => {
    console.log(
      'useEffect log for formatted date',

      tempFormattedEndDate,

      'start:::',

      tempFormattedStartDate,
    );

    // fetchTableData(); // Fetch data initially and whenever dates change
  }, [tempFormattedStartDate, tempFormattedEndDate]);

  useEffect(() => {
    // console.log('tableData Loggg' + tableData);
  }, [tableData, filteredTempData]);
  // useEffect(() => {
  //   console.log('useEffect log for formatted date');
  //   fetchTableData(); // Fetch data initially and whenever dates change
  // }, [formattedStartDate, formattedEndDate]);

  useEffect(() => {
    console.log(
      'selectedSubData pridn__________________' + selectedSubRow,
      selectedData,
    );
    // selectedSubRow = -1;
    if (selectedSubRow != null) {
      if (selectedData[0].type == 'Tax Payment') {
        // fetchModelTableSubData();
        console.log('khfjhfjkf::tax');
        fetchModelTableSubData();
        // fetchModelTableData();
      } else if (selectedData[0].type != 'Fund Transfer') {
        console.log('khfjhfjkf::non-tax');
        console.log('type', selectedData[0].type);
        fetchModelTableSubData();
        // fetchModelTableData();
        // fetchModelTableTaxData();
      } // fetchModelTableSubData();
    }
  }, [selectedSubRow]);

  useEffect(() => {
    console.log('selectedModelSubData pridn__________________' + subData);
  }, [subData]);

  const showIssuedMessage = () => {
    console.log('Showing issued successful message!!! ');
    // Showing toast when button is pressed while disabled
    ToastAndroid.showWithGravity(
      `Payment Issued Successfully.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const showNotIssuedMessage = () => {
    console.log('Showing issued unsuccessful message!!! ');
    // Showing toast when button is pressed while disabled
    ToastAndroid.showWithGravity(
      `Payment Issued Failed.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setTimeout(() => {
      navigation.replace('IssueGroups');
    }, 1000);
    // setIsLoading(false)
  };

  const handleHomeScreen = async () => {
    try {
      // Perform any asynchronous operations here if needed
      navigation.reset({
        index: 0, // Index to set the first screen
        routes: [{name: 'HomeScreen'}], // Define the new stack
      });
    } catch (error) {
      console.error('Error navigating to HomeScreen:', error);
    }
  };

  //-------------------------Working and also has only 3 payments -------------------------------------------------------------------
  // PrintPaymentDetailedPDF
  const PrintDetailedPdf = async () => {
    let apiurl = ``;
    let requestbody = '';

    if (selectedDataPaymentType == 'Bills Payment') {
      apiurl = `${API_URL}/api/issueGroup/billsprintDetailedPdf_group`;
      requestbody = JSON.stringify({
        payment_id: subTabPaymentId,
        message: partyName,
        company_id: '1',
      });
    } else if (selectedDataPaymentType == 'Tax Payment') {
      apiurl = `${API_URL}/api/issueGroup/tax_printDetailedPdf_Group`;
      requestbody = JSON.stringify({
        payment_id: subTabPaymentId,
        company_id: '1',
      });
    } else if (selectedDataPaymentType == 'Paysheet Payment') {
      apiurl = `${API_URL}/api/issueGroup/paysheetprintdetailedpdf_Group`;
      requestbody = JSON.stringify({
        payment_id: subTabPaymentId,
      });
    }
    console.log('url>>>', apiurl, '---', 'requestbody>>>', requestbody);
    const fileName = await PrintDetailedPaymentPDF(apiurl, requestbody);
    console.log('filename detailed>>>>>>>', fileName);
    // downloadPdfFile(fileName);
    if (fileName) {
      downloadAndViewPdf(fileName);
    }
  };
  //----------------------------------- Need to Work has 5 Payment ---------------------------------------------------------------------------
  // PrintPaymentdGroupPDF
  const PrintGroupPdf = async () => {
    let apiurl = ``;
    let requestbody = '';

    if (selectedDataPaymentType == 'Advance Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
      requestbody = JSON.stringify({
        group_id: [grpId],
        jcmb_OrderBy: selectedPaymentType,
        numberFm: '.90',
        sst_groupTable: selectedGroupData,
        user: sharedData.userName,
        payDetailData: [],
        HMGroupDetails: {},
      });
    } else if (selectedDataPaymentType == 'Bills Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
      requestbody = JSON.stringify({
        group_id: [grpId],
        jcmb_OrderBy: selectedPaymentType,
        numberFm: '.90',
        sst_groupTable: selectedGroupData,
        user: sharedData.userName,
        payDetailData: [],
        HMGroupDetails: {},
      });
    } else if (selectedDataPaymentType == 'Tax Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
      requestbody = JSON.stringify({
        group_id: [grpId],
        jcmb_OrderBy: selectedPaymentType,
        numberFm: '.90',
        sst_groupTable: selectedGroupData,
        user: sharedData.userName,
        payDetailData: [],
        HMGroupDetails: {},
      });
    } else if (selectedDataPaymentType == 'Paysheet Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
      requestbody = JSON.stringify({
        group_id: [grpId],
        jcmb_OrderBy: selectedPaymentType,
        numberFm: '.90',
        sst_groupTable: selectedGroupData,
        user: sharedData.userName,
        payDetailData: [],
        HMGroupDetails: {},
      });
    } else if (selectedDataPaymentType == 'Fund Transfer') {
      apiurl = `${API_URL}/api/issueGroup/PaymentIssueGroupDetailedPDF`;
      requestbody = JSON.stringify({
        group_id: [grpId],
        jcmb_OrderBy: selectedPaymentType,
        numberFm: '.90',
        sst_groupTable: selectedGroupData,
        user: sharedData.userName,
        payDetailData: [],
        HMGroupDetails: {},
      });
    }
    console.log('url>>>', apiurl, '---', 'requestbody>>>', requestbody);
    const fileName = await PrintDetailedPaymentPDF(apiurl, requestbody);
    console.log('filename group>>>>>>>', fileName);
    // downloadPdfFile(fileName);
    if (fileName) {
      downloadAndViewPdf(fileName);
    }
  };

  // ------------------------------------------------------------------------------------------------------------------------------------

  //-------------- Need to Work for 4 Payment (PrintPaymentPdf)----(Expect Fund Transfer)-----------------------------------------------------------------------

  // PrintPrintPaymentPdf

  const executeQuery = async query => {
    try {
      console.log('supplierName 8978989890', query);

      const response = await fetch(
        `${API_URL}/api/common/finloadContentsjson`,

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({query: query}),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      console.log('4583495j90549 :: ', result);

      // return result[0];
      return result[0] || '';
    } catch (err) {}
  };

  // PrintPrintPaymentPdf
  const headers = [
    'Group Id',
    'Created Date',
    'Reference No',
    'Type',
    'No Of Payments',
    'Issued',
    'Total Value',
    'Group Issue Status',
  ];

  const PrintPaymentPdf = async () => {
    if (activeDataPdf.length < 1) {
      Alert.alert('Note', 'Please select atleast one payment to print PDF');
      return;
    }

    console.log('Payment Pdf button');

    let apiurl = ``;

    let requestbody = '';

    let query = ``;

    if (MainType == 'Advance Payment') {
      console.log('Payment Pdf sdfgsdg');

      apiurl = `${API_URL}/api/issueGroup/PaymentPdf`;

      requestbody = JSON.stringify({
        param_names: [
          'payment_id',

          'company_name',

          'payment_details',

          'payment_mode_details',

          'advance_payments',

          'advance_tds_details',

          'source_tax_details',

          'advance_payments_charges',

          'advance_adjustment_details',

          'advance_tds_details_charges',

          'currency',

          'initiator',

          'first_approver',

          'second_approver',

          'third_approver',
        ],

        param_values: [
          subTabPaymentId, // Will Change

          "'Jay Jay Mills (Bangladesh) Private Limited'",

          'payment_details',

          'payment_mode_details',

          'advance_payments',

          'advance_tds_details',

          'source_tax_details',

          'advance_payments_charges',

          'advance_adjustment_details',

          'advance_tds_details_charges',

          currency, // Will Change

          sharedData.userName, // Will Change

          '-',

          '-',

          '-',
        ],

        type: `AdvancePayment${activeDataPdf?.orderType?.toString()}`,
      });
    } else if (MainType == 'Bills Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentPdf`;

      query = `
      SELECT
      a.street
      || ','
      || a.city
      || ','
      || a.state
      || ','
      || a.country
      || ','
      || a.postal_code AS address
  FROM
      supplier           s,
      supplier_address   sa,
      address            a
  WHERE
      s.name = '${partyName}'
      AND sa.address_no = a.address_no
      AND sa.supplier_name = s.name`;

      const partyAddress = await executeQuery(query);
      console.log('success-------------', partyAddress);
      requestbody = JSON.stringify({
        param_names: [
          'payment_id',

          'party_name',

          'company_name',

          'payment_details',

          'payment_mode_details',

          'payment_info',

          'bill_tds_details',

          'source_tax_details',

          'payment_adjustment_details',

          'currency',

          'party_address',

          'initiator',

          'first_approver',

          'second_approver',

          'third_approver',
        ],

        param_values: [
          subTabPaymentId,

          activeDataPdf.partyName,

          "'Jay Jay Mills (Bangladesh) Private Limited'",

          'payment_details',

          'payment_mode_details',

          'payment_info',

          'bill_tds_details',

          'source_tax_details',

          'payment_adjustment_details',

          currency,

          partyAddress,

          sharedData.userName,

          '-',

          sharedData.userName,

          '-',
        ],

        type: 'BillsPayment',
      });
    } else if (MainType == 'Tax Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentPdf`;

      console.log('3458345893895 : ', activeDataPdf.departmentName);

      query = `select address ||','|| ward_circle from tax_department where tax_dept_name='${activeDataPdf.departmentName}'`;

      const partyAddress = await executeQuery(query);

      requestbody = JSON.stringify({
        param_names: [
          'payment_id',

          'party_name',

          'company_name',

          'payment_details',

          'payment_mode_details',

          'payment_info',

          'bill_tds_details',

          'currency',

          'party_address',

          'initiator',

          'first_approver',

          'second_approver',

          'third_approver',
        ],

        param_values: [
          subTabPaymentId, // Will Change

          activeDataPdf.departmentName, // Will Change

          "'Jay Jay Mills (Bangladesh) Private Limited'",

          'payment_details',

          'payment_mode_details',

          'payment_info',

          'bill_tds_details',

          currency, // Will Change

          partyAddress,

          sharedData.userName,

          '-',

          '-',

          '-',
        ],

        type: 'TaxPayments',
      });
    } else if (MainType == 'Paysheet Payment') {
      apiurl = `${API_URL}/api/issueGroup/PaymentPdf`;

      query = `SELECT payment_mode,reference_number FROM paysheet_payment_mode WHERE payment_id=${subTabPaymentId} UNION SELECT payment_mode,reference_number FROM a_paysheet_payment_mode WHERE payment_id=${subTabPaymentId}`;

      const chequeNo = await executeQuery(query);

      requestbody = JSON.stringify({
        param_names: [
          'payment_id',

          'company_name',

          'PAYSHEET_PAYMENT',

          'PAYSHEET_PAYMENT_DETAILS',

          'PAYSHEET_PAYMENT_MODE',

          'ChequeNo',

          'Payment_Currency',

          'initiator',

          'first_approver',

          'second_approver',

          'third_approver',
        ],

        param_values: [
          subTabPaymentId, // Will Change

          "'Jay Jay Mills (Bangladesh) Private Limited'",

          'PAYSHEET_PAYMENT',

          'PAYSHEET_PAYMENT_DETAILS',

          'PAYSHEET_PAYMENT_MODE',

          chequeNo,

          currency, // Will Change

          sharedData.userName, // Will Change

          '-',

          '-',

          '-',
        ],

        type: 'PaysheetPayment',
      });
    }

    console.log(
      'sdgfurl>>>',

      apiurl,

      '---',

      'requestbody>>>636346',

      requestbody,
    );

    const fileName = await PrintDetailedPaymentPDF(apiurl, requestbody);

    console.log('filename print>>>>>>>', fileName);

    // downloadPdfFile(fileName);

    if (fileName) {
      downloadAndViewPdf(fileName);
    }
  };

  //-----------------------------------------------------------------------------------------------------------

  const onRowIndexSelect = 0;

  useEffect(() => {
    console.log(
      'formattedStartDate: ' +
        formattedStartDate +
        ' (Type: ' +
        typeof formattedStartDate +
        ')',
      'formattedEndDate: ' +
        formattedEndDate +
        ' (Type: ' +
        typeof formattedEndDate +
        ')',
    );

    // Convert formatted dates back to Date objects
    const startDate = formattedStartDate;
    const endDate = formattedEndDate;
    console.log('date greatererrrere:', startDate > endDate);

    // Check if both dates are valid and start date is less than end date
    // if (startDate < endDate) {
    // fetchTableData();
    // }

    // Fetch table data whenever the dates change
  }, [formattedEndDate, formattedStartDate]);
  // useEffect(() => {
  //   console.log(
  //     'formattedStartDate: ' +
  //       formattedStartDate +
  //       ' (Type: ' +
  //       typeof formattedStartDate +
  //       ')',
  //     'formattedEndDate: ' +
  //       formattedEndDate +
  //       ' (Type: ' +
  //       typeof formattedEndDate +
  //       ')',
  //   );

  //   // Convert formatted dates back to Date objects
  //   const startDate = formattedStartDate;
  //   const endDate = formattedEndDate;
  //   console.log('date greatererrrere:', startDate > endDate);

  //   // Check if both dates are valid and start date is less than end date
  //   // if (startDate < endDate) {
  //   fetchTableData();
  //   // }

  //   // Fetch table data whenever the dates change
  // }, [formattedStartDate]);

  const parseFormattedDate = formattedDate => {
    const [day, month, year] = formattedDate.split(' ');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthIndex = monthNames.indexOf(month); // Get the index of the month
    const fullYear = `20${year}`; // Convert 2-digit year to 4-digit year

    // Create and return the Date object
    const parsedDate = new Date(fullYear, monthIndex, day);

    // Debugging log to check if the date is being parsed correctly
    console.log(`Parsing date: ${formattedDate} -> ${parsedDate}`);

    return parsedDate;
  };

  // const [firstTableLoading, setFirstTableLoading] = useState(false);
  const firstTableLoadingRef = useRef(false);
  // First Main Table API
  const fetchTableData = async () => {
    try {
      firstTableLoadingRef.current = true;
      setIsLoading(true);

      // Fetch the JWT token from Keychain
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      // Ensure the formatted dates are not empty
      if (!formattedStartDate || !formattedEndDate) {
        console.log('Start date or end date is not provided.');
        return;
      }

      // Parse and format the dates
      let updatedStartDate, updatedEndDate;

      // Handle Start Date
      if (tempFormattedStartDate.includes(' ')) {
        let startdateParts = tempFormattedStartDate.split(' ');
        const day = startdateParts[0].padStart(2, '0'); // Format day with leading zero if needed
        const month = startdateParts[1];
        const year = startdateParts[2];

        updatedStartDate = `${day} ${month} ${year}`;
      } else if (tempFormattedStartDate.includes('-')) {
        let startdateParts = tempFormattedStartDate.split('-');
        const day = startdateParts[0].padStart(2, '0'); // Format day with leading zero if needed
        const month = startdateParts[1];
        const year = startdateParts[2];

        updatedStartDate = `${day}-${month}-${year}`;
      }

      // Handle End Date
      if (tempFormattedEndDate.includes(' ')) {
        let dateParts = tempFormattedEndDate.split(' ');
        let day = parseInt(dateParts[0], 10).toString().padStart(2, '0'); // Increment and format day
        const month = dateParts[1];
        const year = dateParts[2];

        updatedEndDate = `${day} ${month} ${year}`;
      } else if (tempFormattedEndDate.includes('-')) {
        let dateParts = tempFormattedEndDate.split('-');
        let day = parseInt(dateParts[0], 10).toString().padStart(2, '0'); // Increment and format day
        const month = dateParts[1];
        const year = dateParts[2];

        updatedEndDate = `${day}-${month}-${year}`;
      }

      // Construct the URL with the updated start and end dates
      const url = `${API_URL}/api/issueGroup/getAllpaymentGroups?fromDate=${updatedStartDate}&toDate=${updatedEndDate}`;
      console.log('Fetching data from URL:', url);

      // Fetch the data from the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        firstTableLoadingRef.current = false;
      }

      if (!response.ok) {
        firstTableLoadingRef.current = false;

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response has any content
      const responseText = await response.text();
      console.log('dataaaa::', responseText);

      // If the response body is empty or invalid, handle that gracefully
      if (!responseText) {
        setTableData([]);
        setTableDataForFilter([]);
        setFilteredMainData([]);
        console.log('Received empty response body');
        return;
      }

      let responseData;
      try {
        // Try to parse the JSON data
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        firstTableLoadingRef.current = false;
        console.error('Error parsing JSON:', jsonError);
        return;
      } finally {
        firstTableLoadingRef.current = false;
      }

      // Check if data is available
      if (!responseData || Object.keys(responseData).length === 0) {
        console.log('No data found in the response.');
        return;
      }

      // If data exists, process and store it
      console.log('Response main data:', responseData);
      console.log('selectedFilter.length main data:', selectedFilters.length);
      let sortedData = [];
      if (selectedFilters.length > 0) {
        sortedData = responseData.filter(item =>
          selectedFilters.includes(item.type),
        );
        // console.log('Sorted Data with len:', sortedData);
      } else {
        sortedData = responseData; // You can process the sorted data as needed
        // console.log('Sorted Data:', sortedData);
      }

      setTableData(sortedData);
      setTableDataForFilter(sortedData);
      setFilteredMainData(sortedData); // Initialize filtered data
    } catch (error) {
      // Handle errors by clearing the data and logging the error
      setTableData([]);
      setTableDataForFilter([]);
      setFilteredMainData([]);

      if (error.message !== 'Response is not JSON') {
        console.error('Error fetching table data date:', error);
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  // useEffect(() => {
  //   // filterMainData(selectedFilters);
  //   console.log('filter cate typehshfs:', selectedFilter);
  // }, [selectedFilter]);
  // filterMainData(selectedFilter);
  // }, [selectedFilter, tableData]);

  const filterMainData = filterType => {
    if (!filterType) {
      // If no filter is selected, return the full dataset
      setFilteredMainData(tableData);
      return;
    }

    let filteredResults = [];

    for (let i = 0; i < filterType.length; i++) {
      const filtered = tableDataForFilter.filter(
        item => item.type === filterType[i],
      );
      filteredResults = [...filteredResults, ...filtered]; // Combine filtered data
    }
    console.log('filteredResults:::', filteredResults);
    setFilteredTempData(filteredResults);
    // Update state with the accumulated filtered results
    // setTableData(filteredResults);
    // setFilteredMainData(filteredResults);
  };

  const handleFilterSelect = filter => {
    setSelectedFilters(prevSelectedFilters => {
      if (prevSelectedFilters.includes(filter)) {
        return prevSelectedFilters.filter(item => item !== filter); // Deselect filter
      } else {
        return [...prevSelectedFilters, filter]; // Select filter
      }
    });
  };

  // Second Sub Table Api
  const fetchSubTableData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue sub data : ', `${token}`);
      console.log(
        ' selectedDataGroupId sdggf',
        `${tableData[selectedRow].groupId}`,
      );
      console.log(
        ' selectedDataGroupId sdggf',
        `${tableData[selectedRow].length}`,
      );
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/api/issueGroup/getSelectedPaymentGroups?groupId=${tableData[selectedRow].groupId}&paymentType=${tableData[selectedRow].type}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        // setIsLoading(true);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('response sub table adv : ===============>>>>>>>>>> ', data);

      // Sort the keys of each object in paymentIssueGroupSubTableData in ascending order
      const sortedData = data;
      // const sortedData = data;

      // .map(item => {
      //   return Object.keys(item)
      //     .sort() // Sort keys alphabetically
      //     .reduce((acc, key) => {
      //       acc[key] = item[key]; // Rebuild object with sorted keys
      //       return acc;
      //     }, {});
      // });
      // const partyNames = data.paymentIssueGroupSubTableData.map(
      //   item => item.partyName,
      // );
      // setpartyNames(partyNames);
      setSelectedSubData([]); // Clear previous data
      setSelectedSubData(sortedData); // Set sorted data
    } catch (error) {
      console.error('Error fetching table sub data:', error);
    } finally {
      setIsLoading(false);
      // Always hide loading indicator after login attempt (success or failure)
    }
  };

  //  Sub Data Api
  const fetchModelTableSubData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue Model data : ', `${token}`);
      console.log(
        ' selectedSubData.payId sdff',
        `${selectedSubData[0].paymentId}`,
      );

      const response = await fetch(
        `${API_URL}/api/common/issuegroupdetails?paymentId=${selectedSubData[selectedSubRow].paymentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        setIsLoading(true);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log(
        'response model table tax sub data1 : ===============>>>>>>>>>> ',
        data,
      );

      setTaxData(data);
      // setSelectedSubData(data.paymentIssueGroupSubTableData);

      setIsLoading(true);
      // isModel(true);
    } catch (error) {
      console.error('Error fetching table subdata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToSnakeCase = obj => {
    const newObj = {};
    for (const key in obj) {
      const newKey = key.replace(/_/g, ' ').toLowerCase();
      newObj[newKey] = obj[key];
    }
    console.log('snack case::', newObj);
    return newObj;
  };

  // Third Sub Table Api --- Paysheet Payment
  const fetchModelTableData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue Model data : ', `${token}`);
      console.log(
        ' selectedSubData.paymentId sdff',
        `${selectedSubData[selectedSubRow]}`,
      );
      // console.log(' tax sdff', `${JSON.stringify(taxData)}`);
      // console.log(
      //   'print it>>>>',
      //   `${API_URL}/api/issueGroup/getSelectedSubPaymentGroups?paymentId=${selectedSubData[selectedSubRow].paymentId}&paymentType=${tableData[selectedRow].type}&taxId=${taxData[0].BILL_PO_SO_JO_NO}&amountPaid=${taxData[0].AMOUNT_PAID}`,
      // );

      const response = await fetch(
        `${API_URL}/api/issueGroup/getSelectedSubPaymentGroups?paymentId=${selectedSubData[selectedSubRow].paymentId}&paymentType=${tableData[selectedRow].type}&taxId=${taxData[0].BILL_PO_SO_JO_NO}&amountPaid=${taxData[0].AMOUNT_PAID}`,
        // 'http://192.168.0.107:8087/api/issueGroup/getSelectedSubPaymentGroups?paymentId=2557&paymentType=Bills Payment&taxId=SUP-1041&amountPaid=20',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        setIsLoading(true);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('response>>>>>>>>> paysheet', response);
      const data = await response.json();
      console.log(
        'response model table adv tax : ===============>>>>>>>>>> ',
        data,
        'response____',
        response,
      );
      // const formattedData = data.map(convertToReadableFormat);

      // Sort the keys of each object in paymentIssueGroupDetailsTableData in ascending order
      // const sortedModelData = formattedData.map(item => {
      //   return Object.keys(item)
      //     .sort() // Sort keys alphabetically
      //     .reduce((acc, key) => {
      //       acc[key] = item[key]; // Rebuild object with sorted keys
      //       return acc;
      //     }, {});
      // });

      setSelectedModelData([]); // Clear previous data
      setSelectedModelData(data); // Set sorted data

      // console.log('SelectedModelData-=-=-=-=-=-=---=-', sortedModelData);
      console.log(
        'SelectedModelData check >>>-=-=-=-=-=-=---=-',
        selectedModelData,
      );

      // if (sortedModelData.length > 0) isModel(true);
      setSelectedSubRow(null); // Clear the sub row selection
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
      // Always hide loading indicator after login attempt (success or failure)
    }
  };

  // Thrid Table Bills Payment
  const fetchBillsPaymentDetailsData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue Model data : ', `${token}`);
      console.log(
        ' selectedSubData.paymentId sdff',
        `${selectedSubData[selectedSubRow]}`,
      );
      console.log(' tax sdff', `${JSON.stringify(taxData)}`);
      console.log(
        'print it>>>>',
        `${API_URL}/api/issueGroup/getPayDetails?payment_id=${2592}&dataFor=${'BillPayMainSubTable'}`,
      );

      const response = await fetch(
        `${API_URL}/api/issueGroup/getPayDetails?payment_id=${
          selectedSubData[selectedSubRow].paymentId
        }&dataFor=${'BillPayMainSubTable'}`,
        // 'http://192.168.0.107:8087/api/issueGroup/getSelectedSubPaymentGroups?paymentId=2557&paymentType=Bills Payment&taxId=SUP-1041&amountPaid=20',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        setIsLoading(true);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('response>>>>>>>>>', response);
      const data = await response.json();
      console.log(
        'response bills payment details : ===============>>>>>>>>>> ',
        data,
        'response____',
        response,
      );

      const billsDetailsKeys = [
        'Payment Id',
        'Bill No', //column 1
        'Bill Date', //column 2
        'Bill Type', //column 3
        'Party Bill', //column 4
        'Party Name', //column 5
        'Bill Value', //column 6
        'Discount', //column 7
        'Charges Amt', //column 8
        'Adjustment', //column 9
        'Bill Amt', //column 10
        'Debit Amt', //column 11
        'Passed Amt', //column 12
        'Payable Amt', //column 13
        'Paid Amt', //column 14
        'TDS Amt', //column 15
        'Currency', //column 16
        'Due Date', //column 17
        'Bill Status', //column 18
      ];

      const mappedData = data.map(row => {
        return billsDetailsKeys.reduce((obj, key, index) => {
          // Safely convert value to string and handle null/undefined
          obj[key] = row[index] != null ? String(row[index]) : '';
          return obj;
        }, {});
      });

      if (mappedData.length > 0) {
        setSelectedModelData([]); // Clear previous data
        setSelectedModelData(mappedData); // Set new data
        // isModel(true);
        // setSelectedSubRow(null);
      }

      // console.log('SelectedModelData-=-=-=-=-=-=---=-', sortedModelData);
      console.log(
        'SelectedModelData check >>>-=-=-=-=-=-=---=-',
        selectedModelData,
      );

      // if (sortedModelData.length > 0) isModel(true);
      setSelectedSubRow(null); // Clear the sub row selection
    } catch (error) {
      console.error('Error fetching bills payment details table data:', error);
    } finally {
      setIsLoading(false);
      // Always hide loading indicator after login attempt (success or failure)
    }
  };
  // useEffect(() => {
  //   console.log('selectedModelData:::', selectedModelData);

  //   // setSelectedCheckBoxData(selectedCheckBoxData.filter(dataa=>dataa.length !=0))
  // }, [selectedModelData]);
  // //-------------------------------

  //----------------------------------------------------------------- From Harish Nov 6
  // ADVANCE PAYMENT ----- Third Sub Table Api
  const fetchModelAdvPay = async () => {
    try {
      setIsLoading(true);

      // Get JWT token
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      if (!credentials || !credentials.password) {
        throw new Error('Authentication token not found');
      }
      const token = credentials.password;

      // Validate required data
      if (!activeDataPdf?.orderType) {
        throw new Error('Order type is required');
      }
      if (!subTabPaymentId) {
        throw new Error('Payment ID is required');
      }

      // API request configuration
      const requestBody = {
        datafor: 'AdvPayMain',
        orders: [],
        payment_id: subTabPaymentId,
        type: activeDataPdf.orderType,
      };

      const response = await fetch(
        `${API_URL}/api/issueGroup/getSelectedSubAdvPay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Added 'Bearer' prefix
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Validate response data
      if (!data?.result) {
        throw new Error('Invalid response data format');
      }

      // Parse the result array
      const originalArray = JSON.parse(data.result);
      if (!Array.isArray(originalArray) || originalArray.length === 0) {
        throw new Error('No data available');
      }
      console.log('third table data:::', originalArray);

      // Define mapping keys based on order type
      const poKeys = [
        'PO No',
        'P Order NO',
        'partyName',
        'Mat No',
        'Color',
        'Size',
        'Ref No',
        'Type',
        'Material Spec',
        'Qty',
        'UOM',
        'Rate',
        'Discount %',
        'Discount(PO)',
        'Discount',
        'Total Amount(PO)',
        'Total Amount',
        'Payable Amount',
        'Advance Amount',
        'TDS Amount',
        'Currency',
      ];

      const soKeys = [
        'SO No',
        'b',
        'Service Id',
        'Service Type',
        'SO Description',
        'Additional Details',
        'Qty',
        'Rate',
        'Discount %',
        'Discount(SO)',
        'Discount',
        'Total Amount(SO)',
        'Total Amount',
        'Payable Amount',
        'Advance Amount',
        'TDS Amount',
        'Currency',
      ];
      const joKeys = [
        'JO NO',
        'serviceName',
        'Job Id',
        'Work Center',
        'Process',
        'Item No',
        'Mat No',
        'Material Spec',
        'Qty',
        'UOM',
        'Rate',
        'Discount %',
        'Discount(JO)',
        'Discount',
        'Total Amount(JO)',
        'Total Amount',
        'Payable Amount',
        'Advance Amount',
        'TDS Amount',
        'Currency',
      ];

      // Select appropriate keys based on order type
      const mappingKeys =
        activeDataPdf.orderType === 'SO'
          ? soKeys
          : activeDataPdf.orderType === 'PO'
          ? poKeys
          : joKeys;

      // Map the values to keys, skipping index 1 if orderType is 'SO'
      let mapObject = originalArray.map(data => {
        return data.reduce((obj, value, index) => {
          if (activeDataPdf.orderType === 'SO' && index === 1) {
            // Skip index 1 when orderType is 'SO'
            return obj; // Skip this index and return the accumulator object
          }

          if (index < mappingKeys.length) {
            // Safely convert value to string and handle null/undefined
            obj[mappingKeys[index]] = value != null ? String(value) : '';
          }

          return obj; // Return the accumulated object for the next iteration
        }, {}); // Initial accumulator is an empty object
      });

      // console.log(mapObject); // To check the final mapped result

      const mappedData = mapObject;
      console.log('mapped data:::', mapObject);

      // Update state only if we have valid data
      if (mappedData.length > 0) {
        setSelectedModelData([]); // Clear previous data
        setSelectedModelData(mapObject); // Set new data
        // isModel(true);
        setSelectedSubRow(null);
      } else {
        throw new Error('No valid data to display');
      }
    } catch (error) {
      console.error('Error in fetchModelAdvPay:', error.message);
      // You might want to add error handling UI feedback here
      setSelectedModelData([]);
      isModel(false);
      // } finally {
      //   setIsLoading(false);
    }
  };

  //------------------------------ TAX Thrid Table Data -----------------fetchSubTableTax-------------------------
  const fetchSubTableTax = async () => {
    try {
      setIsLoading(true);
      const queryBody = {
        query:
          'select distinct BILL_PO_SO_JO_NO from payment_info where payment_id=' +
          subTabPaymentId +
          ' union select distinct BILL_PO_SO_JO_NO from a_payment_info where payment_id=' +
          subTabPaymentId +
          '',
      };

      console.log('Request body:', queryBody); // Debug log

      const response = await fetch(
        `${API_URL}/api/issueGroup/finLoadVectorwithContentsjson`,

        // 'http://192.168.0.169:8080/harness/approval/finLoadVectorwithContentsjson',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: `${token}`,
          },
          body: JSON.stringify(queryBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Response response>>>>:', response); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      // settaxparam(data);
      const flattenedData = data.flat();
      console.log('54545656>>>', flattenedData);
      const formattedBILL_PO_SO_JO_NOList = flattenedData
        .map(item => `'${item}'`)
        .join(',\n');

      const queryBodyFinal = {
        query: `SELECT
  tad.tax_advice_id,
  tad.tax_payment_advice_no,
  'Tax Payment' AS type,
  to_char(tad.tax_advice_date, 'DD-MON-YY') AS tax_advice_date,
  tad.tax_dept_name,
  to_char(tad.tax_amount, 'fm99999999999990.9990') AS tax_amount,
  coalesce(pf.actual_paid, 0) AS paid_amount,
  tad.currency,
  to_char(tad.due_date, 'DD-MON-YY') AS due_date,
  CASE
      WHEN tad.payment_status = 'Paid'           THEN
          'Paid'
      WHEN tad.payment_status = 'Partially Paid' THEN
          'Partially Paid'
      WHEN tad.payment_status = 'Pending'        THEN
          'Pending'
      ELSE
          'Passed'
  END AS status
FROM
  tax_advice_details tad
  LEFT JOIN (
      SELECT
          pf.bill_po_so_jo_no,
          coalesce(pf.actual_amount_paid, 0) AS actual_paid
      FROM
          payment_info pf
      WHERE
          pf.payment_id NOT IN (
              SELECT
                  pf.payment_id
              FROM
                  a_payment_details pf
          )
          AND pf.bill_po_so_jo_no IN (${formattedBILL_PO_SO_JO_NOList})
          AND payment_id = ${subTabPaymentId}
      UNION
      SELECT
          pf.bill_po_so_jo_no,
          coalesce(pf.actual_amount_paid, 0) AS already_paid
      FROM
          a_payment_info pf
      WHERE
          pf.bill_po_so_jo_no IN (${formattedBILL_PO_SO_JO_NOList})
          AND payment_id = ${subTabPaymentId}
  ) pf ON tad.tax_payment_advice_no = pf.bill_po_so_jo_no
WHERE
  tad.tax_payment_advice_no IN (${formattedBILL_PO_SO_JO_NOList})
ORDER BY
  tad.tax_advice_id`,
      };
      console.log('978>>>', queryBodyFinal);
      const responseFinal = await fetch(
        // `${API_URL}/api/issueGroup/finLoadVectorwithContentsjson?`,
        `${API_URL}/api/issueGroup/finLoadVectorwithContentsjson`,

        // 'http://192.168.0.169:8084/api/issueGroup/finLoadVectorwithContentsjson',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: `${token}`,
          },
          body: JSON.stringify(queryBodyFinal),
        },
      );
      if (!responseFinal.ok) {
        throw new Error(`HTTP error! status: ${responseFinal.status}`);
      }
      console.log('Response responseFinal>>>>:', responseFinal); // Debug log

      const dataFinall = await responseFinal.json();
      // settaxparam(data);
      // return data;
      // console.log('Response data>>>>>:', dataFinal); // Debug log
      console.log('Response data>>>>>:', JSON.stringify(dataFinall));

      // console.log("typwrrrr",typeof(dataFinal),"---typeee:::",typeof(dataFinall))

      // const originalArray = JSON.parse(dataFinal);
      // console.log('Parsed array:', originalArray);

      // Define unique keys for each column
      const taxKeys = [
        'ID', // Column 1
        'TaxAdviceNo', // Column 2
        'Type', // Column 3
        'TaxAdviceDate', // Column 4
        'DepartmentName', // Column 5
        'TaxAmt', // Column 6
        'PaidAmt', // Column 7
        'Currency', // Column 8
        'DueDate', // Column 9
        'TaxAdviceStatus', // Column 10
        'ExtraField', // Column 11
      ];

      const mappedData = dataFinall.map(row => {
        return taxKeys.reduce((obj, key, index) => {
          // Safely convert value to string and handle null/undefined
          obj[key] = row[index] != null ? String(row[index]) : '';
          return obj;
        }, {});
      });

      console.log('Mapped Data:', mappedData);
      // const mappedData = [mappedObject];
      console.log('mapped data', mappedData);
      // Update state only if we have valid data
      if (mappedData.length > 0) {
        setSelectedModelData([]); // Clear previous data
        setSelectedModelData(mappedData); // Set new data
        // isModel(true);
        setSelectedSubRow(null);
      }
    } catch (error) {
      console.error('Fetch error details:', error);
      throw error;
    }
  };
  //-------------------------------------------------------------

  // Issue Paysheet Data
  const issueData = async preparedItemsForIssue => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer issue  data : ', `${token}`);
      console.log(
        'data params >>>>>' + JSON.stringify({items: selectedPayments}),
      );
      // const params = {
      //   status: 'Issued',
      //   payment_id: selectedPayments,
      //   reason: '',
      //   slabTaxData: [],
      //   payDetails: ['', 'Advance Payment', 'AddPayment', sharedData.userName],
      //   oldChqStatus: ['Issued', 'admin'],
      // };
      // console.log('data params params >>>>>' + JSON.stringify(params));
      const response = await fetch(
        // `${API_URL}/api/issueGroup/issueButton?grpId=${grpId}&paymentType=${selectedDataPaymentType}`,
        // 'http://192.168.0.169:8084/api/issueGroup/issueButton',
        `${API_URL}/api/issueGroup/issueButton?`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({items: selectedPayments}),
        },
      );

      console.log(
        'response for response data : ===============>>>>>>>>>> ',
        response,
      );
      console.log(
        'response for response data : ===============>>>>>>>>>> ',
        JSON.stringify(response.json),
      );
      if (!response.ok) {
        // setIsLoading(true);
        // showErrorModal('DRMI004', true);
        Alert.alert(
          'Server unreachable',
          `Error code : DRMI004\nPlease contact admin.`,
        );
        showNotIssuedMessage();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.ok) {
        // setIsLoading(true);
        // showNotIssuedMessage();
        // setIsAlertVisible(true);
        showIssuedMessage();

        // throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(
          'response for issue data : ===============>>>>>>>>>> ',
          data,
        );
        setTimeout(() => handleRefresh(), 1000);
      }
    } catch (error) {
      // showErrorModal('GENCOO1', true);
      // console.error('Error fetching table data:', error);
      throw new Error(`HTTP error! Status: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  //----------------------------------------------------------------------------------------------
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

  //----------------------------------------------------------------------------------------------------------------------------

  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0); // To store the progress percentage

  const downloadAndViewPdf = async fileName => {
    const fileNamePrefix = 'ig_bills_';
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
  //----------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    console.log('ruyuewr747 Selected Row:', selectedRow);

    if (
      selectedRow !== null &&
      selectedRow >= 0 &&
      selectedRow < tableData.length
    ) {
      setSelectedDataGroupId(tableData[selectedRow]?.groupId);
      setSelectedDataDataPaymentType(tableData[selectedRow]?.type);
      setSelectedData([tableData[selectedRow]]);
      // console.log(
      //   'selectdsfsfsfedData __________' + tableData[selectedRow].groupId,
      // );
      setSelectedextRmiData1(tableData[selectedRow].groupId.toString());
      console.log('kasjdfhasfhioashfioh:::', Object.keys(selectedRow).length);

      fetchSubTableData();
    }
  }, [selectedRow, tableData]);

  // useEffect(()=>{if(selectedRow.length!=0)fetchSubTableData();},[selectedRow])

  const [currentModalPage, setCurrentModalPage] = useState(0);

  //--------------------- Modal ------------------------
  // Calculate the total number of pages
  const totalPages = selectedModelData.length;
  const itemsPerPage = 1;
  const columns =
    selectedModelData.length > 0 ? Object.keys(selectedModelData[0]) : [];

  // Get the current page's data
  // const currentPageData = selectedModelData.slice(
  //   currentModalPage * itemsPerPage,
  //   (currentModalPage + 1) * itemsPerPage,
  // )[0];

  // Function to go to the next page
  const goToNextPage = () => {
    if (currentModalPage < totalPages - 1) {
      setCurrentModalPage(currentModalPage + 1);
    }
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (currentModalPage > 0) {
      setCurrentModalPage(currentModalPage - 1);
    }
  };

  // const [selectedFilters, setSelectedFilters] = useState([
  //   'Advance Payment',
  //   'Bills Payment',
  //   'Tax Payment',
  //   'Fund Transfer',
  //   'Paysheet Payment',
  // ]);
  useEffect(() => {
    console.log('selected filter', selectedFilters);
    filterMainData(selectedFilters);
  }, [selectedFilters]);

  const applySelectedFilters = () => {
    // Here you can process the selected filters and perform necessary actions
    console.log('Selected filteredResults:', filteredTempData);
    // setTableData(filteredTempData);
    // setFilteredMainData(filteredTempData);
    fetchTableData();
    // Optionally, trigger data fetch or any actions needed when filters are applied
    // fetchTableData(); // Assuming this fetches data based on selected filters
  };

  const isFilterSelected = filter => selectedFilters.includes(filter);

  //-------Surya Written by group issue-----------start------------

  const [selectedItemsForIssue, setSelectedItemsForIssue] = useState({});

  const updateSelectedItemsForIssue = (groupId, subTableDataId = null) => {
    console.log('payment id selected earlyly nnkjthtmtjtmf: ', subTableDataId);
    setSelectedItemsForIssue(prevSelectedItems => {
      // If no paymentId is passed, handle group selection/deselection
      if (!subTableDataId) {
        if (prevSelectedItems[groupId]) {
          // Group is already selected, remove it (deselect)
          const {[groupId]: _, ...rest} = prevSelectedItems; // Remove groupId from state
          return rest;
        } else {
          // Group is not selected, add it with an empty payment list
          return {
            ...prevSelectedItems,
            [groupId]: [], // Initialize with empty payment array
          };
        }
      }

      // Handle payment selection/deselection within the group
      if (prevSelectedItems[groupId]) {
        let updatedPayments = prevSelectedItems[groupId];
        console.log('payment id selected nnkjthtmtjtmf: ', subTableDataId);
        // Check if the payment is already selected
        if (updatedPayments.includes(subTableDataId)) {
          // Payment is selected, so deselect it
          updatedPayments = updatedPayments.filter(id => id !== subTableDataId);
        } else {
          // Payment is not selected, so select it
          updatedPayments = [...updatedPayments, subTableDataId];
        }

        // If no payments remain, remove the group entirely
        if (updatedPayments.length === 0) {
          const {[groupId]: _, ...rest} = prevSelectedItems; // Remove groupId from state
          return Object.keys(rest).length === 0 ? {} : rest; // Ensure state becomes empty if no groups left
        } else {
          // Otherwise, update the group's payment list
          return {
            ...prevSelectedItems,
            [groupId]: updatedPayments,
          };
        }
      } else {
        // If the group wasn't selected before, initialize with the selected payment
        return {
          ...prevSelectedItems,
          [groupId]: [subTableDataId],
        };
      }
    });
  };
  const handleGroupSelect = groupData => {
    const {groupId} = groupData;
    updateSelectedItemsForIssue(groupId);
  };

  const handlePaymentSelect = (groupId, paymentId) => {
    updateSelectedItemsForIssue(groupId, paymentId);
    console.log(
      'selectedItemsForIssue  989485903m5384753 : ',
      selectedItemsForIssue,
    );
  };

  useEffect(() => {
    Object.entries(selectedItemsForIssue).forEach(([groupId, paymentIds]) => {
      console.log(
        `656854959j5858 Group: ${groupId}, Selected Payments: ${paymentIds},`,
      );
    });
  }, [selectedItemsForIssue]);

  const prepareSelectedItemsForIssue = (selectedItemsForIssue, tableData) => {
    // Initialize an empty object to hold the final transformed data
    const transformedData = {};

    // Iterate over each groupId in selectedItemsForIssue
    Object.keys(selectedItemsForIssue).forEach(groupId => {
      // Find the corresponding entry in tableData by matching groupId
      const groupData = tableData.find(
        data => data.groupId === parseInt(groupId),
      );

      if (groupData) {
        const paymentType = groupData.type; // Extract payment type
        const selectedPayments = selectedItemsForIssue[groupId]; // Get selected payments for this group
        // Build the key as "<paymentType>:<groupId>"
        const key = `${paymentType}:${groupId}`;

        // Add the selected payments to the transformed data under the new key
        transformedData[key] = selectedPayments;
      }
    });

    return transformedData;
  };

  const handleIssue = () => {
    if (mainTableSelectedIndex.length < 1) {
      Alert.alert('Note', 'Select Atleast One Group And Payment To Issue');
      return;
    }
    const preparedItemsForIssue = prepareSelectedItemsForIssue(
      selectedItemsForIssue,
      tableData,
    );
    //WRITE ISSUE API LOGIC HERE
    console.log('Prepared Selected items for issue : ', preparedItemsForIssue);
    const totalLength = Object.values(selectedPayments).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0,
    );

    console.log(
      'selectedArray.length ==',
      selectedArray.length,
      '-=-=-= Total length of all arrays:',
      totalLength,
    );

    if (selectedArray.length !== totalLength) {
      issueData(preparedItemsForIssue);

      setTimeout(() => handleRefresh(), 1500);
    } else {
      // console.log('itsd not issued');
      Alert.alert('Note', 'Already Issued');
    }
    setTimeout(() => handleRefresh(), 1500);
    // issueData();
  };
  useEffect(() => {
    console.log('Updated mainTableSelectedIndex:', mainTableSelectedIndex);
    console.log('Updated MainType:', MainType);

    const filteredSelectedPayments = Object.keys(selectedPayments).reduce(
      (acc, key) => {
        // Extract groupId from the key
        const [, groupId] = key.split(':'); // Splitting "Bills Payment:257" to get groupId
        const numericGroupId = parseInt(groupId, 10); // Convert groupId to a number

        // Check if the groupId is in mainTableSelectedIndex
        if (mainTableSelectedIndex.includes(numericGroupId)) {
          // Retain the entry if the groupId is in mainTableSelectedIndex
          acc[key] = selectedPayments[key];
        }
        return acc;
      },
      {},
    );

    // Log the filtered results
    console.log('Filtered SelectedPayments:', filteredSelectedPayments);

    // Find missing IDs in the filtered results
    // const includedGroupIds = Object.keys(filteredSelectedPayments).map(key => {
    //   const [, groupId] = key.split(':');
    //   return parseInt(groupId, 10);
    // });

    // const missingGroupIds = mainTableSelectedIndex.filter(
    //   id => !includedGroupIds.includes(id),
    // );

    // // Log missing IDs for debugging
    // if (missingGroupIds.length > 0) {
    //   console.log(
    //     'Missing group IDs in filteredSelectedPayments:',
    //     missingGroupIds,
    //   );
    // }

    // // Optionally handle missing IDs (if needed)
    // // Example: Add placeholders for missing IDs
    // missingGroupIds.forEach(id => {
    //   filteredSelectedPayments[`${MainType}:${id}`] = []; // Or set a default value
    // });

    // Update state with filtered results
    setSelectedPayments(filteredSelectedPayments);

    // Final output log
    console.log(
      'Final SelectedPayments (with placeholders if applicable):',
      filteredSelectedPayments,
    );

    // if (mainTableSelectedIndex.length == 0) {
    //   console.log('Updated mainTableSelectedIndex:00000000000000000');
    //   setSelectedPayments({});
    //   setSelectedCheckBoxData([])
    // }
    console.log(
      'Updated mainTableSelectedIndex.length:',
      mainTableSelectedIndex.length,
    );
  }, [mainTableSelectedIndex]);

  const handleSelectAllToggle = () => {
    if (allSelected) {
      // Deselect all
      setSelectedFilters([]);
    } else {
      // Select all
      setSelectedFilters(filterOptions);
    }
    setAllSelected(!allSelected);
  };

  // Update `allSelected` when all filters are manually selected
  useEffect(() => {
    setAllSelected(selectedFilters.length === filterOptions.length);
  }, [selectedFilters]);
  const filterOptions = [
    'Advance Payment',
    'Bills Payment',
    'Tax Payment',
    'Fund Transfer',
    'Paysheet Payment',
  ];

  const GroupTransformObject = data => {
    // Add the `Select` property to the data object
    const dataObject = {...data, Select: true};
    console.log('Updated dataObject:', dataObject);

    // Mapping for keys to new key names
    const keyMapping = {
      groupId: 'Group ID',
      createdDate: 'Created Date',
      referenceNo: 'Reference No',
      type: 'Type',
      noOfPayments: 'No Of Payments',
      issued: 'Issued',
      totalValue: 'Total Value',
      groupIssueStatus: 'Group Issue Status',
      Select: 'Select',
    };

    // Transform the data object
    const transformedObject = Object.entries(dataObject).reduce(
      (acc, [key, value]) => {
        // Map the key to the new key name or keep original
        const newKey = keyMapping[key] || key;
        // Convert number values to strings, otherwise keep the value as is
        acc[newKey] = typeof value === 'number' ? String(value) : value;
        return acc;
      },
      {},
    );

    // Log and set the transformed object
    console.log('Transformed Object:', transformedObject);
    setSelectedGroupData(prev => {
      // Check if transformedObject already exists in the selectedGroupData
      if (
        prev.some(
          item => JSON.stringify(item) === JSON.stringify(transformedObject),
        )
      ) {
        // Remove transformedObject if it exists
        return prev.filter(
          item => JSON.stringify(item) !== JSON.stringify(transformedObject),
        );
      } else {
        // Add transformedObject if it doesn't exist
        return [...prev, transformedObject];
      }
    });
  };

  //-------Surya Written by group issue-----------stop------------

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <TitleBar
          text="Payment Issue Group"
          showMenuBar={true}
          onMenuPress={() => navigation.openDrawer()}
          showRefreshIcon={true}
          onRefreshPress={handleRefresh}
          showCloseIcon={true}
          onClose={handleHomeScreen}
          showFileIcon={true}
          onFilePress={() => setPDFModalVisible(true)}
          showFilterIcon={true}
          onFilterPress={() => setFilterModalVisible(true)}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 0,
          }}>
          {/* {mainTableSelectedIndex.length ===
          Object.keys(selectedPayments).length && ( */}
          <TouchableOpacity
            onPress={() => {
              // setTimeout(() => {
              //   setIsLoading(true);
              // }, 10000);
              // setIsLoading(false);
              mainTableSelectedIndex.length ===
                Object.keys(selectedPayments).length &&
              mainTableSelectedIndex.length !== 0
                ? handleIssue()
                : null;
            }}>
            <Text
              style={{
                backgroundColor:
                  mainTableSelectedIndex.length ===
                    Object.keys(selectedPayments).length &&
                  mainTableSelectedIndex.length !== 0
                    ? CustomThemeColors.primary
                    : CustomThemeColors.fadedPrimary,
                color: 'white',
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 10,
              }}>
              Issue
            </Text>
          </TouchableOpacity>
          {/* )} */}
        </View>

        {/* </View> */}
        <View style={{flex: 1}}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <View style={{flexGrow: 1, paddingVertical: 0, marginTop: -10}}>
              {/* First TableComponent */}
              <View style={{flexShrink: 1, marginTop: 0}}>
                {filteredMainData.length > 0 ? (
                  <TableComponent
                    tempLoad={tempLoad}
                    key={filteredMainData.length}
                    initialData={filteredMainData}
                    onRowIndexSelectDataLoad={value => {
                      setSelectedRow(value);
                      console.log('selectedRow_____', tableData[value]);
                      console.log('selectedRow_____array', value);
                      // GroupTransformObject(tableData[value])
                      setMainType(tableData[value].type);
                      SetActiveGroupId(tableData[value].groupId);
                      setModelButton(false);
                      setHideSubTab(false)

                      setActiveDataPdf([]);
                    }}
                    onRowIndexSelect={value => {
                      if (value.length < 1) {
                        console.log('empty data::::');
                        fetchTableData();
                        setMainTableSelectedIndex([]);
                        setSelectedCheckBoxData([]);
                        setSelectedPayments({});
                        setOnPressCheckBoxHandle(false);
                        setActiveDataPdf([]);
                        setSelectedSubData([]);
                        SetActiveGroupId('');

                        setHideSubTab(true)
                      } else {
                        setHideSubTab(false)
                        setActiveDataPdf([]);
                        setSelectedRow(value);
                        setMainType(tableData[value]?.type);
                        const groupId = tableData[value]?.groupId;
                        GroupTransformObject(tableData[value]);
                        SetActiveGroupId(tableData[value].groupId);
                        console.log('rowdataaa::', value);
                        setMainTableSelectedIndex(prev => {
                          if (prev.includes(groupId)) {
                            const groupKey = `groupId:${groupId}`;
                            console.log(
                              'selectedCheckBoxData before filtering:',
                              selectedCheckBoxData,
                            );
                            console.log('groupKey:', groupKey);
                            console.log('groupId:', groupId);

                            // const filteredData = Object?.keys(
                            //   selectedCheckBoxData,
                            // ).reduce((acc, key) => {
                            //   // Check if the groupId in the key matches the groupId we want to remove
                            //   if (!key.includes(`groupId:${groupId}`)) {
                            //     // Add the entry to the accumulator if the condition is met
                            //     acc[key] = selectedCheckBoxData[key];
                            //   }
                            //   return acc;
                            // }, {});

                            const filteredData = Object.keys(
                              selectedCheckBoxData || {},
                            ).reduce((acc, key) => {
                              // Check if the groupId in the key matches the groupId we want to remove
                              if (!key.includes(`bills:${groupId}`)) {
                                // Add the entry to the accumulator if the condition is met
                                acc[key] = selectedCheckBoxData[key];
                              }
                              return acc;
                            }, {});

                            console.log('filteredData::', filteredData);
                            setSelectedCheckBoxData(filterMainData);
                            // Log the entire object after filtering

                            console.log(
                              'selectedCheckBoxData after filtering:',
                              filteredData,
                            );
                            setTimeout(
                              () => setOnPressCheckBoxHandle(false),
                              0,
                            );
                            return prev.filter(id => id !== groupId);
                          } else {
                            setTimeout(() => setOnPressCheckBoxHandle(true), 0);
                            return [...prev, groupId];
                          }
                        });
                        // const dataObject = {...tableData[value], Select: true};
                        // setSelectedGroupData(dataObject);
                      }
                      setModelButton(false);
                    }}
                    onPressCheckBoxHandle={setOnPressCheckBoxHandle}
                    mainTableSelectedIndex={mainTableSelectedIndex}
                    setMainTableSelectedIndex={setMainTableSelectedIndex}
                    noModel={false}
                    showCheckBox={true}
                    onlyFetchData={true}
                    setMainTableSelectAll={setMainTableSelectAll}
                    style={{marginTop: 20}}
                  />
                ) : (
                  <View style={styles.container}>
                    {/* Table Header */}
                    <View style={styles.headerRow}>
                      {headers.map((header, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.headerText,
                            {
                              fontSize: DeviceInfo.isTablet()
                                ? fontScale >= 1.2999999523162842
                                  ? 10
                                  : fontScale == 0.8500000238418579
                                  ? 14
                                  : 12
                                : 14,
                            },
                          ]}>
                          {header}
                        </Text>
                      ))}
                    </View>
                    {firstTableLoadingRef.current === true && (
                      <View style={styles.dataRow}>
                        <Text style={styles.dataText}>Please wait...</Text>
                      </View>
                    )}
                    {firstTableLoadingRef.current === false &&
                      filteredMainData.length === 0 && (
                        <View style={styles.dataRow}>
                          <Text style={styles.dataText}>
                            No data to display.
                          </Text>
                        </View>
                      )}
                  </View>
                )}
              </View>

              <View
                style={{
                  flexShrink: 1,
                  // marginTop: -20,
                }}>
                {/* Second SubTableComponent */}
                {!hideSubTab&&selectedSubData.length > 0 && (
                  <SubTableComponent
                    setSubTableLoading={setSubTableLoading}
                    initialData={selectedSubData}
                    showCheckBox={true}
                    noModel={false}
                    selectAllIsChecked={onPressCheckBoxHandle}
                    setSelectAllIsChecked={setOnPressCheckBoxHandle}
                    MainType={MainType}
                    setTempPayments={setTempPayments}
                    onRowIndexSelect={data => {
                      setIsLoading(true);

                      if (data.length == 0) {
                        const ids = selectedSubData
                          .map(item => item.paymentId || item.transferId)
                          .filter(Boolean);
                        console.log('IDs:', ids);
                        // setSelectedPayments([]);
                        setSelectedPayments(prev => {
                          // Create a new object to avoid mutating the previous state directly
                          const updatedPayments = {...prev};

                          // Construct the key to filter out
                          const keyToRemove = `${MainType}:${activeGroupId}`;

                          // Delete the key from the updated object
                          delete updatedPayments[keyToRemove];

                          // Return the updated state
                          return updatedPayments;
                        });
                        // Remove the activeGroupId from the mainTableSelectedIndex
                        // setMainTableSelectedIndex(prev => {
                        //   console.log(
                        //     'Active group ID being removed:',
                        //     activeGroupId,
                        //   );
                        //   const filtered = prev.filter(
                        //     item => item !== activeGroupId,
                        //   );
                        //   console.log('New filtered indexes:', filtered);
                        //   return filtered;
                        // });
                        setMainTableSelectedIndex(prev => {
                          if (prev.includes(activeGroupId)) {
                            const groupKey = `activeGroupId:${activeGroupId}`;
                            console.log(
                              'selectedCheckBoxData before filtering:',
                              selectedCheckBoxData,
                            );
                            console.log('groupKey:', groupKey);
                            console.log('activeGroupId:', activeGroupId);

                            // const filteredData = Object?.keys(
                            //   selectedCheckBoxData,
                            // ).reduce((acc, key) => {
                            //   // Check if the groupId in the key matches the groupId we want to remove
                            //   if (!key.includes(`groupId:${groupId}`)) {
                            //     // Add the entry to the accumulator if the condition is met
                            //     acc[key] = selectedCheckBoxData[key];
                            //   }
                            //   return acc;
                            // }, {});

                            const filteredData = Object.keys(
                              selectedCheckBoxData || {},
                            ).reduce((acc, key) => {
                              // Check if the groupId in the key matches the groupId we want to remove
                              if (
                                !key.includes(`activeGroupId:${activeGroupId}`)
                              ) {
                                // Add the entry to the accumulator if the condition is met
                                acc[key] = selectedCheckBoxData[key];
                              }
                              return acc;
                            }, {});

                            console.log('filteredData::', filteredData);
                            setSelectedCheckBoxData(filterMainData);
                            // Log the entire object after filtering

                            console.log(
                              'selectedCheckBoxData after filtering:',
                              filteredData,
                            );
                            setTimeout(
                              () => setOnPressCheckBoxHandle(false),
                              0,
                            );
                            return prev.filter(id => id !== activeGroupId);
                          } else {
                            setTimeout(() => setOnPressCheckBoxHandle(true), 0);
                            return [...prev, activeGroupId];
                          }
                        });

                        // Prepare the updated selectedArray
                        setSelectedArray(prevArray => {
                          // Start with the current selectedArray state
                          let updatedArray = [...prevArray];

                          ids.forEach(id => {
                            const exists = updatedArray.includes(id);

                            // If id exists, remove it; if it doesn’t, add it
                            if (exists) {
                              updatedArray = updatedArray.filter(
                                item => item !== id,
                              );
                            }
                          });

                          return updatedArray;
                        });
                        setIsLoading(false);

                        // }
                      } else {
                        setIsLoading(true);

                        const {transferId, paymentId} = data;
                        // const type = tableData[selectedRow].type;
                        const groupId = data.groupId;
                        const type =
                          tableData.find(item => item.groupId === groupId)
                            ?.type || 'No data to display';

                        console.log('matchingType--', type);
                        const selectedId = transferId || paymentId; // Use either transferId or paymentId
                        // const issuedStus =
                        //   data.paymentStatus === 'Issued' ? data : null;

                        console.log('dataaaaaa:', data);

                        console.log('Updated selectedArray:', selectedArray);

                        setpartyNames(data.partyName);
                        setSelectedGroupId(prev => ({
                          ...prev,
                          groupId: groupId,
                        }));

                        setSelectedPayments(prevPayments => {
                          console.log('selectedPayments---::::', selectedId);
                          const key = `${type}:${groupId}`;
                          console.log('key---::::', key);
                          const currentIds = prevPayments[key] || [];
                          const updatedIds = currentIds.includes(selectedId)
                            ? currentIds.filter(id => id == selectedId) // Corrected condition to remove selectedId
                            : [...currentIds, selectedId];

                          const updatedState = {...prevPayments};
                          console.log('updatedState::', updatedState);
                          console.log('updatedIds::', updatedIds);
                          console.log('key::', key);
                          if (updatedIds.length > 0) {
                            updatedState[key] = updatedIds;
                            console.log('updatedState4::', updatedState);
                          } else {
                            delete updatedState[key];
                          }
                          // setSelectedPayments(updatedState);
                          return updatedState;
                        });
                        setIsLoading(false);

                        // if (MainType !== 'Fund Transfer') {
                        //   setModelButton(true);
                        // }
                      }
                    }}
                    setSelectedCheckBoxData={setSelectedCheckBoxData}
                    selectedCheckBoxData={selectedCheckBoxData}
                    mainTableSelectedIndex={mainTableSelectedIndex}
                    setMainTableSelectedIndex={setMainTableSelectedIndex}
                    activeIndex={index => {
                      const data = selectedSubData[index];
                      const {transferId, paymentId} = data;

                      setSubTabPaymentId(paymentId?.toString());
                      setpartyNames(data.partyName);
                      setCurrency(data.currency);
                      setActiveDataPdf(data);
                    }}
                    selectedPaymentType={MainType}
                    excludeColumns={['groupId']}
                    toggleData={index => {
                      setIsLoading(true);

                      const dataa = selectedSubData[index];
                      setSelectedSubRow(index);
                      console.log('toggledata::', index);
                      setActiveDataPdf(dataa);
                      // if (MainType !== 'Fund Transfer') {
                      //   setModelButton(true);
                      // }
                      setIsLoading(false);
                    }}
                    RowDataForIssue={data => {
                      setIsLoading(true);
                      const {transferId, paymentId} = data;
                      // const type = data.type;
                      // const groupId = data.groupId;
                      const selectedId = transferId || paymentId;
                      console.log('issued status', data);
                      if (data.paymentStatus === 'Issued') {
                        setSelectedArray(prevArray => {
                          const exists = prevArray.includes(selectedId);

                          console.log('Selection Toggle:', {
                            currentArray: prevArray,
                            selectedId: selectedId,
                            exists: exists,
                            result: exists
                              ? prevArray.filter(item => item !== selectedId)
                              : [...prevArray, selectedId],
                          });

                          // Or for more detailed debugging:
                          console.log('Previous Array:', prevArray);
                          console.log('Selected ID:', selectedId);
                          console.log('ID exists in array?:', exists);
                          console.log(
                            'New Array:',
                            exists
                              ? prevArray.filter(item => item !== selectedId)
                              : [...prevArray, selectedId],
                          );

                          return exists
                            ? prevArray.filter(item => item !== selectedId)
                            : [...prevArray, selectedId];
                        });
                      }
                      setIsLoading(false);
                    }}
                    mainTableSelectAll={mainTableSelectAll}
                    setIsLoading={setIsLoading}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        <Modal
          visible={isFilterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <DateFilter
                  formattedStartDate={formattedStartDate}
                  formattedEndDate={formattedEndDate}
                  setFormattedStartDate={setTempFormattedStartDate}
                  setFormattedEndDate={setTempFormattedEndDate}
                />
              </View>
              <Text>Select Payment Filter</Text>

              {/* Select All / Deselect All Button */}
              <TouchableOpacity
                onPress={handleSelectAllToggle}
                style={[
                  styles.selectAllButton,
                  {
                    borderColor: allSelected
                      ? CustomThemeColors.primary
                      : 'black',
                    borderWidth: allSelected ? 1 : 0,
                  },
                ]}>
                <Text
                  style={{
                    color: allSelected ? CustomThemeColors.primary : 'black',
                  }}>
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>

              {/* List of Filter Options */}
              {filterOptions.map(filter => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => handleFilterSelect(filter)}
                  style={
                    isFilterSelected(filter)
                      ? styles.selectedOption
                      : styles.option
                  }>
                  <Text style={{color: 'black'}}>{filter}</Text>
                </TouchableOpacity>
              ))}

              {/* Conditionally render the Filter button if any filters are selected */}
              {isAnyFilterSelected ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2196F3',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      // Close Modal and Apply Filters
                      // if (tempFormattedEndDate < tempFormattedStartDate) {
                      //   // setFormattedStartDate(tempFormattedStartDate);
                      //   // setFormattedEndDate(tempFormattedEndDate);
                      //   Alert.alert(
                      //     'Note',
                      //     'Start Date cannot be greater than End Date',
                      //   );
                      // }
                      //  else
                      if (
                        formattedStartDate !== tempFormattedStartDate ||
                        formattedEndDate !== tempFormattedEndDate
                      ) {
                        setFormattedStartDate(tempFormattedStartDate);
                        setFormattedEndDate(tempFormattedEndDate);
                      }
                      setFilterModalVisible(false);
                      setMainTableSelectedIndex([]);
                      setSelectedCheckBoxData([]);
                      SetActiveGroupId('');
                      setSelectedSubData([]);
                      setTempPayments([]);
                      setModelButton(false);
                      applySelectedFilters();
                      setSelectedRow(null);
                    }}>
                    <Text style={{color: 'white', fontSize: 16}}>Filter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2196F3',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                      marginLeft: 10,
                    }}
                    onPress={() => setFilterModalVisible(false)}>
                    <Text style={{color: 'white', fontSize: 16}}>Close</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'grey',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: 16}}>Filter</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2196F3',
                      paddingHorizontal: 30,
                      paddingVertical: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                      marginLeft: 10,
                    }}
                    onPress={() => setFilterModalVisible(false)}>
                    <Text style={{color: 'white', fontSize: 16}}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={PDFModalVisible}
          onRequestClose={() => setPDFModalVisible(false)}
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* <Text>Select Filter</Text> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 5,
                  borderRadius: 15,
                  marginBottom: 10,
                  // backgroundColor: '#9BC3F2',
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
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      // setIsPaymentGroupModal(true);
                      if (mainTableSelectedIndex.length < 1) {
                        setPDFModalVisible(false);
                        Alert.alert(
                          'Note',
                          'Please select atleast one payment to print PDF',
                        );
                      } else {
                        setIsLoading(true);
                        setPDFModalVisible(false);

                        // setSelectedPaymentType('');
                        setSelectedPaymentType('Payment Id');
                        // setSelectedPaymentType('');
                        PrintGroupPdf();
                      }
                    }}
                    // onPress={() => PrintGroupPdf()}
                    style={styles.pdfSubOption}>
                    <Text style={styles.subOptionText}>Payment Id</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // setIsPaymentGroupModal(true);
                      if (mainTableSelectedIndex.length < 1) {
                        setPDFModalVisible(false);
                        Alert.alert(
                          'Note',
                          'Please select atleast one payment to print PDF',
                        );
                      } else {
                        setIsLoading(true);

                        setPDFModalVisible(false);

                        setSelectedPaymentType('Payment Mode');
                        PrintGroupPdf();
                      }
                    }}
                    // onPress={() => PrintGroupPdf()}
                    style={styles.pdfSubOption}>
                    <Text style={styles.subOptionText}>Payment Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {(MainType == 'Advance Payment' ||
                MainType === 'Bills Payment' ||
                MainType === 'Tax Payment' ||
                MainType === 'Paysheet Payment') && (
                <TouchableOpacity
                  onPress={() => {
                    if (activeDataPdf.length < 1) {
                      setPDFModalVisible(false);
                      Alert.alert(
                        'Note',
                        'Please select atleast one payment to print PDF',
                      );
                    } else {
                      PrintPaymentPdf();
                      setPDFModalVisible(false);
                    }
                  }}
                  style={styles.option}>
                  <Text style={styles.optionText}>Print Payment PDF</Text>
                </TouchableOpacity>
              )}
              {(MainType === 'Bills Payment' ||
                MainType === 'Tax Payment' ||
                MainType === 'Paysheet Payment') && (
                <TouchableOpacity
                  onPress={() => {
                    if (activeDataPdf.length < 1) {
                      setPDFModalVisible(false);
                      Alert.alert(
                        'Note',
                        'Please select atleast one payment to print PDF',
                      );
                    } else {
                      PrintDetailedPdf();
                      setPDFModalVisible(false);
                    }
                  }}
                  style={styles.option}>
                  <Text style={styles.optionText}>
                    Print Detailed Payment PDF
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  setPDFModalVisible(false);
                  setIsLoading(false);
                }}>
                <View style={{alignContent: 'center', alignItems: 'center'}}>
                  <CustomButton>Close</CustomButton>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <CustomModal isVisible={model} onClose={() => isModel(false)} title="">
          {/* <View style={styles.modalTableContainer}>
        <View style={styles.modalTableContent}> */}
          <Text style={[styles.modalTableTitle, {color: 'black'}]}>
            {MainType === 'Paysheet Payment'
              ? 'Employee Paysheet Details'
              : MainType === 'Bills Payment'
              ? 'Paid Bill Details'
              : MainType === 'Tax Payment'
              ? 'Paid Tax Details'
              : activeDataPdf.orderType === 'PO'
              ? 'PO Material-Wise Details'
              : activeDataPdf.orderType === 'JO'
              ? 'JO Job-Wise Details'
              : activeDataPdf.orderType === 'SO' && 'SO Service-Wise Details'}
          </Text>

          {selectedModelData && (
            <ModalTableComponent
              key={selectedModelData}
              initialData={selectedModelData}
              onRowIndexSelect={index => {
                console.log('Row selected:', index);
              }}
              noModel={false}
              showCheckBox={false}
              excludeColumns={[
                'Payment Id',
                'partyName',
                'serviceName',
                'ID',
                'ExtraField',
                'PO No',
              ]}
            />
          )}
        </CustomModal>

        <CustomAlert
          visible={isAlertVisible}
          title={'Alert'}
          message={'Server Unreachable Relogin again'}
          onClose={() => setIsAlertVisible(false)}
        />
        {/* {model && (
        // <IssueGroupTableThree selectedModelData={selectedModelData} MainType={MainType} activeDataPdf={activeDataPdf.orderType}/>

        <View style={styles.modalTableContainer}>
          <View style={styles.modalTableContent}>
            <Text style={[styles.modalTableTitle, {color: 'black'}]}>
              {MainType === 'Paysheet Payment'
                ? 'Employee Paysheet Details'
                : MainType === 'Bills Payment'
                ? 'Paid Bill Details'
                : MainType === 'Tax Payment'
                ? 'Paid Tax Details'
                : activeDataPdf.orderType === 'PO'
                ? 'PO Material-Wise Details'
                : activeDataPdf.orderType === 'JO'
                ? 'JO Job-Wise Details'
                : activeDataPdf.orderType === 'SO' && 'SO Service-Wise Details'}
            </Text>

            {selectedModelData && (
              <ModalTableComponent
                key={selectedModelData}
                initialData={selectedModelData}
                onRowIndexSelect={index => {
                  console.log('Row selected:', index);
                }}
                noModel={false}
                showCheckBox={false}
                excludeColumns={[
                  'Payment Id',
                  'partyName',
                  'serviceName',
                  'ID',
                  'ExtraField',
                ]}
              />
            )}

            <TouchableOpacity onPress={() => isModel(false)}>
              <View
                style={{
                  backgroundColor: CustomThemeColors.primary,
                  width: 100,
                  height: 50, // Set height to create space for centering
                  justifyContent: 'center', // Centers content vertically
                  alignItems: 'center', // Centers content horizontally
                  alignSelf: 'center', // Center the button within the parent view
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold', // Optional: add bold text for emphasis
                  }}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
        {/* {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>} */}

        {mainTableSelectedIndex.length !==
        Object.keys(selectedPayments).length ? (
          <LoadingIndicator message="Please wait..." />
        ) : (
          <></>
        )}
      </View>
      {isLoading &&
        mainTableSelectedIndex.length ===
          Object.keys(selectedPayments).length && (
          // <View
          //   style={{
          //     flex: 1,
          //     // height: 100,
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //     backgroundColor: '#f9f9f9', // Light background color
          //     borderRadius: 10, // Rounded corners
          //     padding: 10,
          //     margin: 10,
          //   }}>
          //   <ActivityIndicator size="small" color="#e63946" />
          //   {/* Modern loading indicator */}
          //   <Text
          //     style={{
          //       marginTop: 10,
          //       fontSize: 16,
          //       fontWeight: '500',
          //       color: '#e63946',
          //     }}>
          //     Loading, please wait..
          //   </Text>
          // </View>
          <View style={{flex: 0.5}}>
            <View
              style={{
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff', // White background for contrast
                borderRadius: 12, // Rounded corners for a modern look
                padding: 20, // Increased padding for better spacing
                margin: 10,
                // position: 'absolute',
                // top: '30%',
                // left: '40%',
                shadowColor: '#000', // Shadow color for iOS
                shadowOffset: {width: 0, height: 4}, // Shadow offset for iOS
                shadowOpacity: 0.25, // Shadow opacity for iOS
                shadowRadius: 4, // Shadow blur for iOS
                elevation: 8, // Elevation for Android shadow
              }}>
              <ActivityIndicator size="small" color="#e63946" />
              {/* Modern loading indicator */}
              <Text
                style={{
                  marginTop: 12, // Space between the indicator and text
                  fontSize: 10,
                  fontWeight: '600',
                  color: '#e63946',
                }}>
                Loading, please wait...
              </Text>
            </View>
          </View>
        )}
      {isModelButton && (
        <TouchableOpacity onPress={() => isModel(true)}>
          <View
            style={{
              marginTop: 0,
              top: 0,
              marginBottom: DeviceInfo.isTablet() ? 20 : 5,
              marginLeft: 10,
              alignSelf: 'center', // Center the button
            }}>
            <CustomButton>
              {MainType === 'Paysheet Payment'
                ? 'Employee Paysheet Details'
                : MainType === 'Bills Payment'
                ? 'Paid Bill Details'
                : MainType === 'Tax Payment'
                ? 'Paid Tax Details'
                : activeDataPdf.orderType === 'PO'
                ? 'PO Material-Wise Details'
                : activeDataPdf.orderType === 'JO'
                ? 'JO Job-Wise Details'
                : activeDataPdf.orderType === 'SO' && 'SO Service-Wise Details'}
            </CustomButton>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    height: '95%',
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

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  modalValue: {
    color: 'black',
    // marginLeft: 70,
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  // modalContent: {
  //   width: '80%',
  //   padding: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   alignItems: 'center',
  // },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  tableHeader: {
    backgroundColor: CustomThemeColors.primary,
    borderRadius: 10,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'left',
  },
  // headerText: {
  //   fontWeight: 'bold',
  //   color: 'white',
  // },
  selectAllButton: {
    padding: 10,
    backgroundColor: '#e0e0e0', // Example color for visibility
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  modalTableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // maxHeight: 600,
    // marginTop:20,
    paddingVertical: 20,
    paddingBottom: 130,
    paddingTop: 100,
    paddingHorizontal: 5,
  },
  modalTableContent: {
    flex: 1, // This ensures the content takes full screen
    width: '100%', // Full width
    padding: 5,
    backgroundColor: 'white', // Background color for modal content
    justifyContent: 'flex-start', // Align content from top
    borderRadius: 10,
    maxHeight: '100%', // Ensures no overflow
  },
  modalTableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  container: {
    marginTop: 20,
    padding: 10,
    height: 600,
  },
  headerRow: {
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: CustomThemeColors.primary,
    flexDirection: 'row',
    borderBottomWidth: 1,
    // borderColor: 'red',
    padding: 5,
    // paddingBottom:0,
    // marginBottom: 5,
  },
  headerText: {
    color: 'white',
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  dataText: {
    flex: 1,
    textAlign: 'center',
    color: 'gray',
  },
});

export default IssueGroups;
