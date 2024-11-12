import React, {useState} from 'react';
import {View, StyleSheet, Platform, Modal, Text} from 'react-native';
import {Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {CustomThemeColors} from '../CustomThemeColors';

const DateFilter = ({
  setFormattedStartDate,
  setFormattedEndDate,
  formattedStartDate,
  formattedEndDate,
  flexDirection = 'row', // Default to row layout
  showStartDate = true, // Control visibility of start date button
  showEndDate = true, // Control visibility of end date button
}) => {
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false); // New state for error popup

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const showStartDatePicker = () => setStartDateVisible(true);
  const hideStartDatePicker = () => setStartDateVisible(false);
  const showEndDatePicker = () => setEndDateVisible(true);
  const hideEndDatePicker = () => setEndDateVisible(false);

  const formatDate = date => {
    const options = {day: '2-digit', month: 'short', year: '2-digit'};
    return new Intl.DateTimeFormat('en-GB', options)
      .format(new Date(date))
      .replace(/ /g, '-') // Replace spaces with hyphens
      .toString(); // Ensure it's a string
  };

  const handleStartDateConfirm = (event, selectedDate) => {
    hideStartDatePicker();
    if (selectedDate) {
      setSelectedStartDate(selectedDate); // Store selected start date
      const formattedDate = formatDate(selectedDate);

      // Check if the start date is greater than the end date
      // if (selectedEndDate && selectedDate > selectedEndDate) {
        // setErrorVisible(true); // Show error popup
        // return;
      // }

      setFormattedStartDate(formattedDate.toString());
    }
  };

  const handleEndDateConfirm = (event, selectedDate) => {
    hideEndDatePicker();
    if (selectedDate) {
      setSelectedEndDate(selectedDate); // Store selected end date
      const formattedDate = formatDate(selectedDate);

      // Check if the end date is less than the start date
      // if (selectedStartDate && selectedDate < selectedStartDate) {
      //   setErrorVisible(true); // Show error popup
      //   return;
      // }

      setFormattedEndDate(formattedDate.toString());
    }
  };

  return (
    <View style={[styles.container, {flexDirection}]}>
      {showStartDate && (
        <View style={styles.buttonWrapper}>
          <Text style={styles.labelText}>Group From</Text>
          <Button
            mode="outlined"
            onPress={showStartDatePicker}
            style={[styles.button, {borderColor: CustomThemeColors.primary}]}
            labelStyle={{color: CustomThemeColors.primary}}
            contentStyle={styles.buttonContent} // Center button text
          >
            {formattedStartDate || 'Select Start Date'}
          </Button>
        </View>
      )}

      {showEndDate && (
        <View style={styles.buttonWrapper}>
          <Text style={styles.labelTextEndDate}>Group To</Text>
          <Button
            mode="contained"
            onPress={showEndDatePicker}
            style={[
              styles.button,
              styles.buttonRight,
              {backgroundColor: CustomThemeColors.primary},
            ]}
            contentStyle={styles.buttonContent} // Center the text
          >
            {formattedEndDate || 'Select End Date'}
          </Button>
        </View>
      )}

      {startDateVisible && (
        <DateTimePicker
          value={selectedStartDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleStartDateConfirm}
        />
      )}

      {endDateVisible && (
        <DateTimePicker
          value={selectedEndDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleEndDateConfirm}
        />
      )}

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
    alignItems: 'center', // Align items centrally in the column layout
    width: 200,
  },
  button: {
    marginVertical: 5,
  },
  buttonRight: {
    marginLeft: 20, // Add space between buttons in a row layout
  },
  buttonContent: {
    justifyContent: 'center', // Center content inside button
    alignItems: 'center',
    height: 50, // Adjust height if needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
    position: 'relative', // Enables absolute positioning for the label
    // width: '100%', // Adjust width as needed for layout
    marginVertical: 10, // Spacing between different rows
  },
  labelText: {
    position: 'absolute',
    top: -22, // Position the label slightly above the button
    left: 16, // Adjust as needed for spacing from the button
    backgroundColor: 'white', // To prevent overlap with button border
    paddingHorizontal: 4, // Adds padding around text
    color: CustomThemeColors.primary,
    fontWeight:'600',
    fontSize: 14, // Adjust size for a label appearance
  },
  labelTextEndDate: {
    position: 'absolute',
    top: -22, // Position the label slightly above the button
    left: 45, // Adjust as needed for spacing from the button
    fontWeight:'600',
    backgroundColor: 'white', // To prevent overlap with button border
    paddingHorizontal: 4, // Adds padding around text
    color: CustomThemeColors.primary,
    fontSize: 14, // Adjust size for a label appearance
  },
  button: {
    // width: '100%', // Button takes full width of its container
    justifyContent: 'center', // Centers the button content
  },
  buttonContent: {
    justifyContent: 'center', // Centers the button text within the button
  },
});

export default DateFilter;

{
  /* <DateFilter
  formattedStartDate={formattedStartDate}
  formattedEndDate={formattedEndDate}
  setFormattedStartDate={setFormattedStartDate}
  setFormattedEndDate={setFormattedEndDate}
/>; */
}
