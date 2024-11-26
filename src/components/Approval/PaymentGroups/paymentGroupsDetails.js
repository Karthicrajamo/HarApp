
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TitleBar from '../common-utils/TitleBar';
import {useNavigation} from '@react-navigation/native';


const paymentGroupsDetails = () => {
    const navigation = useNavigation(); //For Nagivation

  const [isExpanded, setIsExpanded] = useState(false);

  const data = {
    paysheetId: 973,
    type: "EarnDPM",
    status: "Passed",
    frequency: "Monthly",
    date: "SEP-2021",
    noOfEmployees: 1,
    employeeNumber: "Tool3",
    employeeName: "Meena",
    passedAmount: "12,010.00 TK",
    department: "Production",
    position: "Assistant Manager",
    totalAmount: "2010.00 TK",
    passedEmployeeAmount: "2,010.00 TK",
  };

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
        <TitleBar
        text="Payment Groups Details"
        showMenuBar={true}
        // onMenuPress={() => navigation.openDrawer()}
        // showRefreshIcon={true}
        // onRefreshPress={handleRefresh}
        showCloseIcon={true}
        // onClose={()=>navigation.navigate('paymentGroupsMain')}
        showFileIcon={true}
        // onFilePress={() => setPDFModalVisible(true)}
        // showFilterIcon={true}
        // onFilterPress={() => setFilterModalVisible(true)}
      />
      <Text style={styles.title}>Employee Wise Paysheet Details</Text>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.highlightText}>
            Paysheet ID: {data.paysheetId} | {data.type} | {data.status}
          </Text>
          <Text style={styles.amountText}>{data.totalAmount}</Text>
        </View>
        <Text style={styles.subtitle}>
          {data.frequency} | {data.date}
        </Text>
        <Text style={styles.labelText}>No. of Employees: {data.noOfEmployees}</Text>

        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownToggle}>
          <Text style={styles.dropdownText}>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.employeeDetails}>
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>
                  Emp No: {data.employeeNumber} | {data.employeeName}
                </Text>
                <Text style={styles.labelText}>Passed Amt: {data.passedAmount}</Text>
                <Text style={styles.descriptionText}>
                  - {data.department} | {data.position}
                </Text>
              </View>
              <Text style={styles.amountText}>{data.passedEmployeeAmount}</Text>
            </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a', // Blue color for highlight
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // Gray color for subtitle
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownToggle: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1e3a8a', // Blue color for the toggle text
    fontWeight: 'bold',
  },
  employeeDetails: {
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default paymentGroupsDetails;
