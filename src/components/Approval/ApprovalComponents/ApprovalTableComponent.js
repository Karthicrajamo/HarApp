import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {Checkbox} from 'react-native-paper';
import commonStyles from './../ApprovalCommonStyles';

const {width} = Dimensions.get('window');
const isMobile = width < 768;

const ApprovalTableComponent = ({
  tableData,
  highlightVal = [],
  heading = '',
  exclude = [], // Add an exclude prop to omit specific columns
}) => {
  const [data, setData] = useState(tableData);

  // Filter headers based on the exclude array
  const headers =
    tableData && tableData.length > 0
      ? Object.keys(tableData[0]).filter(header => !exclude.includes(header))
      : [];

  // Calculate column widths based on header text length for alignment
  const columnWidths = headers.map(header => Math.max(header.length * 10, 120)); // Minimum width of 120px

  // Function to apply styles based on highlight condition
  const getCellStyle = header => {
    return highlightVal.includes(header)
      ? [styles.dataCell, styles.highlightCell] // Apply highlight style
      : styles.dataCell;
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.heading}>{heading}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true} // Always show horizontal scroll indicator
        persistentScrollbar={true} // Make sure it always persists
      >
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {headers.map((header, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: columnWidths[index],
                }}>
                <Text style={[styles.headerCell, {width: columnWidths[index]}]}>
                  {header}
                </Text>
                {/* {header} */}
              </View>
            ))}
          </View>

          {/* Data Rows */}
          <ScrollView
            showsVerticalScrollIndicator={true} // Always show vertical scroll indicator
            persistentScrollbar={true} // Make sure it always persists
          >
            {tableData.map((row, rowIndex) => {
              // Get the last column dynamically
              const lastColumnHeader = Object.keys(row).slice(-1)[0];

              return (
                <View key={rowIndex} style={styles.dataRow}>
                  {headers.map((header, colIndex) => (
                    <View
                      key={colIndex}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center', // Center the checkbox
                        width: columnWidths[colIndex], // Set the width dynamically
                      }}>
                      {/* Check if this is the last column */}
                      {header === lastColumnHeader ? (
                        row[header] === true ||
                        row[header] === false ||
                        row[header] === 'Y' ||
                        row[header] === 'N' ||
                        row[header] === 'false' ||
                        row[header] === 0 ? (
                          <Checkbox
                            status={
                              row[header] === true ||
                              row[header] === 'true' ||
                              row[header] === 'Y'
                                ? // row[header] === false ||
                                  // row[header] === 'false' ||
                                  // row[header] === 'N'
                                  'checked'
                                : 'unchecked'
                            }
                            disabled={true}
                            style={{alignItems: 'center'}} // Adjust styling as needed
                          />
                        ) : (
                          <Text
                            style={[
                              getCellStyle(header),
                              {width: columnWidths[colIndex]},
                            ]}>
                            {row[header]}
                          </Text>
                        )
                      ) : (
                        // Render normal text for non-checkbox columns
                        <Text
                          style={[
                            getCellStyle(header),
                            {width: columnWidths[colIndex]},
                          ]}>
                          {row[header]}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow table to take full space
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  tableContainer: {
    width: '100%', // Make table take full width
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
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
    color: 'black',
    padding: 10,
    fontSize: isMobile ? 12 : 14,
    color: '#333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  highlightCell: {
    color: 'blue', // Highlight color
    fontWeight: 'bold', // Optionally make it bold
  },
});

export default ApprovalTableComponent;
