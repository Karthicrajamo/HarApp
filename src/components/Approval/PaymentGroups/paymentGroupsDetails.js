import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import TitleBar from '../../common-utils/TitleBar';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '../../ApiUrl';
import * as Keychain from 'react-native-keychain';
import {sharedData} from '../../Login/UserId';

const PaymentGroupsDetails = ({route}) => {
  const navigation = useNavigation(); //For Nagivation
  const {transName} = route.params;
  const {paymentType} = route.params;
  const {groupId} = route.params;
  // const isMobile = width < 768;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paysheetId, setPaysheetId] = useState([]);
  const [paymentSubScrMainData, setPaymentSubScrMainData] = useState([]);
  const [empData, setPaymentSubSrcEmpData] = useState([]);

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    fetchPaymentSubScrData();
  }, []);

  useEffect(() => {
    fetchPaymentSubScrEmpData();
  }, [paysheetId]);

  // Fetch Data For Sub Screen - Main Data
  const fetchPaymentSubScrData = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials?.password;

      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/approval/paymentGroup/getpaygrpInfoforOthers?pay_id=${groupId}&&type=${paymentType}`,
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
      console.log('data of Sub Screen main data>>>', data);
      const finalTransData = data[0];
      const SelPaysheetId = data[0].PAYSHEET_ID;
      setPaysheetId(SelPaysheetId);
      setPaymentSubScrMainData(finalTransData);
      console.log(
        'data of payment Sub Screen data>>>',
        finalTransData,
        '---',
        paysheetId,
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // For get Emp Details
  const fetchPaymentSubScrEmpData = async () => {
    try {
      setIsLoading(true);
      const queryBody = {
        query: `
          SELECT ppd.paysheet_id, ev.emp_no, ev.emp_name, COALESCE(ev.category_name, '-') AS category,
                 ev.designation_name, ev.department_name, ppd.passed_amount, ppd.paysheet_currency, ppd.paid_amount
          FROM paysheet_payment_details ppd
          LEFT JOIN employee_version_view ev ON ppd.emp_id = ev.emp_id AND ppd.emp_version_no = ev.order_no
          WHERE ppd.paysheet_id = ${paysheetId} AND ppd.payment_id = ${groupId}
        `,
      };
      console.log('gfgf>>>>>', queryBody);

      const response = await fetch(
        `${API_URL}/api/common/finLoadVectorwithContentsjson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(queryBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment data:', data);
      setPaymentSubSrcEmpData(data); // Assuming you have a setPaymentSubData function
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TitleBar
        text={transName}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        // showRefreshIcon={true}
        // onRefreshPress={handleRefresh}
        showCloseIcon={true}
        onClose={() =>
          navigation.navigate('PaymentGroupsMain', {
            transName: transName,
          })
        }
        showFileIcon={true}
        // onFilePress={() => setPDFModalVisible(true)}
        // showFilterIcon={true}
        // onFilterPress={() => setFilterModalVisible(true)}
      />

      <View style={styles.box1}>
        <View style={styles.row1}>
          <Text style={styles.headText}>Payment Type</Text>
          {/* <Text style={styles.headText}>Party Name</Text> */}
        </View>
        <View style={styles.row}>
          <Text style={styles.bodyText}>{paymentType}</Text>
        </View>
      </View>

      {/* Second Container */}
      <View style={styles.box1}>
        <View style={styles.row}>
          <Text style={styles.headText}>No of payment</Text>
          <Text style={styles.headText}>Total Value</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bodyText}>{paymentSubScrMainData.EMP_COUNT}</Text>
          <Text style={styles.bodyText}>
            {paymentSubScrMainData.PAID_AMOUNT}{' '}
            {paymentSubScrMainData.PAYSHEET_CURRENCY}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Employee Wise Paysheet Details</Text>

      {/* Third Container */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.highlightText}>
            Paysheet ID: {paymentSubScrMainData.PAYSHEET_ID} |{' '}
            {paymentSubScrMainData.EARNING_NAME} |{' '}
            {paymentSubScrMainData.PAYSHEET_STATUS}| No.of Emp:{' '}
            {paymentSubScrMainData.EMP_COUNT} |{' '}
            {paymentSubScrMainData.INTERVAL_TYPE} |{' '}
            {paymentSubScrMainData.INTERVAL_TO_DATE}
          </Text>
          <Text style={styles.amountText}>
            {paymentSubScrMainData.PAID_AMOUNT}{' '}
            {paymentSubScrMainData.PAYSHEET_CURRENCY}
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownToggle}>
          <Text style={styles.dropdownText}>
            {isExpanded ? 'Show Less ↑' : 'Show More ↓'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.empdetail}>
            {empData.map((employeeData, index) => (
              <View key={index} style={styles.employeeRow}>
                <Text style={styles.highlightText1}>
                  Emp No: {employeeData[1]} | {employeeData[2]} | Passed Amt:{' '}
                  {employeeData[6]} {employeeData[7]} | {employeeData[3]} |{' '}
                  {employeeData[5]} | {employeeData[4]}
                </Text>
                <Text style={styles.amountText}>
                  {employeeData[8]}.00 {employeeData[7]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a', // Blue color for highlight
    width: 230,
  },
  highlightText1: {
    fontSize: 12,
    color: '#0e0e0f', // Blue color for highlight
    width: 230,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // Gray color for subtitle
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dropdownToggle: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 12,
    color: '#030303', // Blue color for the toggle text
    fontWeight: '500',
  },
  employeeDetails: {
    marginTop: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  box1: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headText: {
    // fontSize: isMobile ? 12 : 14,
    fontWeight: '400',
    color: '#2d2d2d',
    textAlign: 'center',
    flex: 1,
  },
  bodyText: {
    // fontSize: isMobile ? 12 : 14,
    color: '#3788E5',
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  empdetail: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  employeeRow: {
    flexDirection: 'row',
  },
});

export default PaymentGroupsDetails;
