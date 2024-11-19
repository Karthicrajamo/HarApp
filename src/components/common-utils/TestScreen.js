import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // For Material Icons

const {width} = Dimensions.get('window');
const isMobile = width < 768;

const PaymentDetails = () => {
  const [remarks, setRemarks] = useState('');
  return (
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
    </ScrollView>
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


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const EmployeePaysheetDetails = () => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const data = {
//     paysheetId: 973,
//     type: "EarnDPM",
//     status: "Passed",
//     frequency: "Monthly",
//     date: "SEP-2021",
//     noOfEmployees: 1,
//     employeeNumber: "Tool3",
//     employeeName: "Meena",
//     passedAmount: "12,010.00 TK",
//     department: "Production",
//     position: "Assistant Manager",
//     totalAmount: "2010.00 TK",
//     passedEmployeeAmount: "2,010.00 TK",
//   };

//   const toggleDropdown = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Employee Wise Paysheet Details</Text>
      
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Text style={styles.highlightText}>
//             Paysheet ID: {data.paysheetId} | {data.type} | {data.status}
//           </Text>
//           <Text style={styles.amountText}>{data.totalAmount}</Text>
//         </View>
//         <Text style={styles.subtitle}>
//           {data.frequency} | {data.date}
//         </Text>
//         <Text style={styles.labelText}>No. of Employees: {data.noOfEmployees}</Text>

//         <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownToggle}>
//           <Text style={styles.dropdownText}>
//             {isExpanded ? 'Hide Details' : 'Show Details'}
//           </Text>
//         </TouchableOpacity>

//         {isExpanded && (
//           <View style={styles.employeeDetails}>
//             <View style={styles.row}>
//               <View>
//                 <Text style={styles.labelText}>
//                   Emp No: {data.employeeNumber} | {data.employeeName}
//                 </Text>
//                 <Text style={styles.labelText}>Passed Amt: {data.passedAmount}</Text>
//                 <Text style={styles.descriptionText}>
//                   - {data.department} | {data.position}
//                 </Text>
//               </View>
//               <Text style={styles.amountText}>{data.passedEmployeeAmount}</Text>
//             </View>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     flex: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   highlightText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1e3a8a', // Blue color for highlight
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#6b7280', // Gray color for subtitle
//     marginBottom: 8,
//   },
//   labelText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 4,
//   },
//   descriptionText: {
//     fontSize: 13,
//     color: '#666',
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   dropdownToggle: {
//     alignItems: 'flex-end',
//     marginTop: 8,
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: '#1e3a8a', // Blue color for the toggle text
//     fontWeight: 'bold',
//   },
//   employeeDetails: {
//     marginTop: 10,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//   },
// });

// export default EmployeePaysheetDetails;
