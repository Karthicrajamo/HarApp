import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Modal, Text} from 'react-native';
import {Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {CustomThemeColors} from '../CustomThemeColors';

// Helper function to parse a formatted date string into a Date object
const parseDate = dateStr => {
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  let day, month, year;
  console.log('dateStr::', dateStr);
  if (dateStr.includes(' ')) {
    // Format: 'dd MMM yy'
    [day, month, year] = dateStr.split(' ');
    month = monthMap[month]; // Map month abbreviation to month index
  } else if (dateStr.includes('-')) {
    // Format: 'dd-MM-yy'
    [day, month, year] = dateStr.split('-');
    month = monthMap[month];
  }

  // Create a valid Date string in the format 'YYYY-MM-DD'
  const dateString = `20${year}-${month + 1}-${day}`;

  // Create and return the Date object
  const parsedDate = new Date(dateString);
  console.log('parseDate:', parsedDate);
  return parsedDate;
};

// Helper function to format a Date object into 'dd MMM yy' format
const formatDate = date => {
  const options = {day: '2-digit', month: 'short', year: '2-digit'};
  return new Intl.DateTimeFormat('en-GB', options)
    .format(date)
    .replace(/ /g, '-');
};

// Convert formatted date to Date object for DateTimePicker
const convertToDate = dateStr => (dateStr ? parseDate(dateStr) : new Date());

const DateFilter = ({
  setFormattedStartDate,
  setFormattedEndDate,
  formattedStartDate,
  formattedEndDate,
  flexDirection = 'row',
  showStartDate = true,
  showEndDate = true,
}) => {
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const [   tempStartDate, setTempStartDate] = useState(
    parseDate(formattedStartDate),
  );
  const [tempEndDate, setTempEndDate] = useState(parseDate(formattedEndDate));

  const handleStartDateConfirm = (event, selectedDate) => {
    setStartDateVisible(false);
    if (selectedDate) {
      setTempStartDate(selectedDate);
      setFormattedStartDate(formatDate(selectedDate));
    }
  };

  const handleEndDateConfirm = (event, selectedDate) => {
    setEndDateVisible(false);
    if (selectedDate) {
      setTempEndDate(selectedDate);
      setFormattedEndDate(formatDate(selectedDate));
    }
  };
  useEffect(() => {
    console.log('dateUpdatess::', tempEndDate);
  }, [tempEndDate, tempStartDate]);

  // const applyFilter = () => {
  //   if (tempStartDate > tempEndDate) {
  //     setErrorVisible(true);
  //     return;
  //   }

  //   setFormattedStartDate(formatDate(tempStartDate));
  //   setFormattedEndDate(formatDate(tempEndDate));
  // };

  return (
    <View style={[styles.container, {flexDirection}]}>
      {showStartDate && (
        <View style={styles.buttonWrapper}>
          <Text style={styles.labelText}>Group From</Text>
          <Button
            mode="outlined"
            onPress={() => setStartDateVisible(true)}
            style={[styles.button, {borderColor: CustomThemeColors.primary}]}
            labelStyle={{color: CustomThemeColors.primary}}
            contentStyle={styles.buttonContent}>
            {!tempStartDate || tempStartDate.getTime() === new Date().getTime()
              ? formattedStartDate || 'Select Start Date'
              : new Intl.DateTimeFormat('en-GB').format(tempStartDate) ||
                'Select Start Date'}
          </Button>
        </View>
      )}

      {showEndDate && (
        <View style={styles.buttonWrapper}>
          <Text style={styles.labelText}>Group To</Text>
          <Button
            mode="contained"
            onPress={() => setEndDateVisible(true)}
            style={[
              styles.button,
              {backgroundColor: CustomThemeColors.primary},
            ]}
            contentStyle={styles.buttonContent}>
            {!tempEndDate || tempEndDate.getTime() === new Date().getTime()
              ? formattedEndDate || 'Select Start Date'
              : new Intl.DateTimeFormat('en-GB').format(tempEndDate) ||
                'Select Start Date'}{' '}
          </Button>
        </View>
      )}

      {startDateVisible && (
        <DateTimePicker
          value={tempStartDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleStartDateConfirm}
        />
      )}

      {endDateVisible && (
        <DateTimePicker
          value={tempEndDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleEndDateConfirm}
        />
      )}

      {/* <Button mode="contained" onPress={applyFilter} style={styles.filterButton}>
        Apply Filter
      </Button> */}

      <Modal
        transparent={true}
        animationType="slide"
        visible={errorVisible}
        onRequestClose={() => setErrorVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>
              Start date cannot be greater than end date.
            </Text>
            <Button
              mode="contained"
              onPress={() => setErrorVisible(false)}
              style={styles.closeButton}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
  button: {
    marginVertical: 5,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  filterButton: {
    marginVertical: 10,
    backgroundColor: CustomThemeColors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
  },
  buttonWrapper: {
    position: 'relative',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  labelText: {
    position: 'absolute',
    top: -22,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    color: CustomThemeColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DateFilter;
