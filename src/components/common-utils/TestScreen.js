import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const TableComponent = () => {
  // Sample Data
  const tableData = [
    { lastMessage: "Hello", lastMessageSentBy: "admin", newMessagesCount: 0, userName: "admin" },
    { lastMessage: "Khii", lastMessageSentBy: "admin", newMessagesCount: 0, userName: "admin" },
  ];

  // Extract headers dynamically from the first object
  const headers = Object.keys(tableData[0]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            {headers.map((header, index) => (
              <Text key={index} style={styles.headerCell}>
                {header}
              </Text>
            ))}
          </View>
          <ScrollView>
            {tableData.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.dataRow}>
                {headers.map((header, colIndex) => (
                  <Text key={colIndex} style={styles.dataCell}>
                    {row[header]}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  tableContainer: {
    width: width - 20, // Set width to screen width with padding
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#3788E5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  headerCell: {
    flex: 1, // Make each header cell fill equal space
    padding: 10,
    fontWeight: 'bold',
    fontSize: isMobile ? 12 : 14,
    color: '#fff',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  dataRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataCell: {
    flex: 1, // Make each data cell fill equal space
    padding: 10,
    fontSize: isMobile ? 12 : 14,
    color: '#333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
});

export default TableComponent;
