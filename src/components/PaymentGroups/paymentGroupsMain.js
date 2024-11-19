import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import TitleBar from '../common-utils/TitleBar';

const {width} = Dimensions.get('window');
const isMobile = width < 768;

const PaymentDetails = () => {
  const navigation = useNavigation(); //For Nagivation

  const [remarks, setRemarks] = useState('');
  return (
    <>
      <TitleBar
        text="Payment Groups Details"
        showMenuBar={true}
        // onMenuPress={() => navigation.openDrawer()}
        // showRefreshIcon={true}
        // onRefreshPress={handleRefresh}
        showCloseIcon={true}
        // onClose={() => navigation.navigate('HomeScreen')}
        showFileIcon={true}
      />
      <ScrollView style={styles.container}>
        {/* First Container */}
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.headText}>Payment Type</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bodyText}>Paysheet Payment</Text>
          </View>
        </View>

        {/* Second Container */}
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.headText}>No of payment</Text>
            <Text style={styles.headText}>Total Value</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bodyText}>1</Text>
            <Text style={styles.bodyText}>3510.00 INR</Text>
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
            <Text style={styles.bodyText}>15-Nov-24</Text>
            <Text style={styles.bodyText}>admin</Text>
            <Text style={styles.bodyText}>Pending</Text>
          </View>
        </View>

        {/* New Container for Key-Value Pairs */}
        <View style={styles.middleContainer}>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Payment Group ID</Text>
            <Text style={styles.valueText}>312</Text>
          </View>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Grp Ref Label</Text>
            <Text style={styles.valueText}>Testing data</Text>
          </View>
          <View style={styles.keyValueRow}>
            <Text style={styles.keyText}>Remarks</Text>
            <Text style={styles.valueText}>Testing issue group data</Text>
          </View>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('paymentGroupsDetails')}>
          <View style={[styles.content]}>
            <View style={styles.header}>
              <Text style={styles.headerText}>EarnDPM</Text>
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
                  <Text style={styles.lineText}>ID: 427 | Date: 15-Nov-24</Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.lineText}>
                    Approved | Ref no: 151124001 (15-Nov-24)
                  </Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.lineText}>
                    Paid Value: 2,010.00 TK | Fx rate: 1
                  </Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.lineText}>
                    Case | Bank of India | No of Employees: 1
                  </Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.lineText}>Narration: data</Text>
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
                  <Text style={styles.amountText}>2,201.00 INR</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
});

export default PaymentDetails;
