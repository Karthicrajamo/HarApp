import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Get device width to adjust for tablet and mobile responsiveness
const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Consider devices with width 768px or more as tablets

const MinimalDateFilter = ({ setFormattedStartDate, setFormattedEndDate }) => {
  const currentDate = new Date();

  // Calculate current date minus 30 days
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 183);

  // Format the dates as 'DD-MMM-YY'
  const formatDate = (date) => {
    const options = { year: '2-digit', month: 'short', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

    // Replace any non-alphanumeric character (like commas) with a space
    return formattedDate.replace(/[^a-zA-Z0-9 ]+/g, '-');
  };

  // Store the date objects instead of formatted strings
  const [startDateObject, setStartDateObject] = useState(startDate);
  const [endDateObject, setEndDateObject] = useState(currentDate);

  // For displaying the formatted date in the button
  const [tempFormattedStartDate, setTempFormattedStartDate] = useState(formatDate(startDate));
  const [tempFormattedEndDate, setTempFormattedEndDate] = useState(formatDate(currentDate));

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const openStartDatePicker = () => setStartPickerVisible(true);
  const openEndDatePicker = () => setEndPickerVisible(true);

  const handleStartDateChange = (event, selectedDate) => {
    setStartPickerVisible(false);
    if (selectedDate) {
      setStartDateObject(selectedDate); // Store the Date object
      setTempFormattedStartDate(formatDate(selectedDate)); // Update the formatted date for display
    //   setFormattedStartDate(selectedDate); // Pass the Date object to the parent
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setEndPickerVisible(false);
    if (selectedDate) {
      setEndDateObject(selectedDate); // Store the Date object
      setTempFormattedEndDate(formatDate(selectedDate)); // Update the formatted date for display
    //   setFormattedEndDate(selectedDate); // Pass the Date object to the parent
    }
  };

  useEffect(() => {
    setFormattedStartDate(formatDate(startDateObject));
    
  }, [startDateObject]);

  // useEffect to sync tempFormattedEndDate with parent state
  useEffect(() => {
    setFormattedEndDate(formatDate(endDateObject));
  }, [endDateObject]);

  return (
    <View style={styles.container}>
      <View style={styles.dateWrapper}>
        <Text style={styles.label}>From</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={openStartDatePicker}>
          <Text style={styles.dateText}>{tempFormattedStartDate}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.dateWrapper}>
        <Text style={styles.label}>To</Text>
        <TouchableOpacity style={styles.dateButton} onPress={openEndDatePicker}>
          <Text style={styles.dateText}>{tempFormattedEndDate}</Text>
        </TouchableOpacity>
      </View>
      {isStartPickerVisible && (
        <DateTimePicker
          value={startDateObject} // Pass the Date object here
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleStartDateChange}
          maximumDate={new Date()}
        />
      )}
      {isEndPickerVisible && (
        <DateTimePicker
          value={endDateObject} // Pass the Date object here
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleEndDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    elevation: 4, // Increased shadow for better aesthetics
    marginHorizontal: isTablet ? 20 : 16, // More margin on tablets
    marginBottom: 20,
    paddingHorizontal: isTablet ? 60 : 16, // Adjust horizontal padding based on device
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8, // Add some spacing between the 'From' and 'To' sections
  },
  label: {
    fontSize: isTablet ? 16 : 12, // Larger text on tablets
    color: '#6c757d',
    marginRight: 10, // Increase space between label and button
    fontWeight: '500',
  },
  dateButton: {
    paddingVertical: isTablet ? 8 : 6, // Larger padding on tablets
    paddingHorizontal: isTablet ? 24 : 16, // Larger horizontal padding on tablets
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isTablet ? 200 : 10,
    minWidth: isTablet ? 160 : 10, // Minimum width for buttons to ensure consistency
  },
  dateText: {
    fontSize: isTablet ? 16 : 14, // Larger text on tablets
    color: '#212529',
    fontWeight: '500',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#dee2e6', // Line color
    marginHorizontal: 16,
  },
});

export default MinimalDateFilter;
