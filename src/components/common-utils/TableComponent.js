import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider'; // Import slider component
import {CustomThemeColors} from '../CustomThemeColors';
import {CheckBox} from 'react-native-elements';
import {Button} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const calculateColumnWidths = (data, scaleFactor) => {
  const widths = {};
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      const length = String(row[key]).length;
      widths[key] = Math.max(widths[key] || 0, length);
    });
  });

  const screenWidth = Dimensions.get('window').width;
  const totalWidth = Object.keys(widths).reduce(
    (sum, key) => sum + widths[key],
    0,
  );
  const effectiveScaleFactor =
    totalWidth > 0 ? (screenWidth / totalWidth) * scaleFactor : 1;

  const scaledWidths = {};
  Object.keys(widths).forEach(key => {
    const scaledWidth = Math.max(80, widths[key] * effectiveScaleFactor); // Minimum width of 80
    scaledWidths[key] = isFinite(scaledWidth) ? scaledWidth : 80; // Ensure width is a finite number
  });

  return scaledWidths;
};

function makeReadable(word) {
  // Split camelCase or PascalCase string into words
  const words = word.replace(/([a-z])([A-Z])/g, '$1 $2').split(/(?=[A-Z])/);

  // Capitalize each word
  const readableWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1));

  // Join words with a space and return the transformed string
  return readableWords.join(' ');
}

const TableComponent = ({
  initialData,
  onRowIndexSelect,
  noModel,
  selectAllIsChecked,
  longPressIndex,
  onPressCheckBoxHandle,
  showCheckBox = false,
  onRowIndexSelectDataLoad,
  mainTableSelectedIndex,
  setMainTableSelectedIndex,
  setMainTableSelectAll
}) => {
  const {width: screenWidth} = Dimensions.get('window');
  const [data, setData] = useState(initialData);
  const [columnWidths, setColumnWidths] = useState({});
  const [calculated, setCalculated] = useState(false);
  const [sliderValue, setSliderValue] = useState(0); // Initial value for the slider (scale factor)
  const [tableIndex, setTableIndex] = useState(-1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModel, setIsModel] = useState(true);
  const [page, setPage] = useState(0); // Current page
  const rowsPerPage = 5000; // Number of rows per page
  const [totalColumnWidths, setTotalColumnWidths] = useState(0);

  useEffect(() => {
    // console.log('initialDataz;' + JSON.stringify(initialData));
    setData(initialData); // Update state when initialData prop changes
  }, [initialData]);

  useEffect(() => {
    // if (selectAllIsChecked) {
    //   const newIsChecked = !isChecked;
    //   setIsChecked(newIsChecked);

    //   // Update selectedRows based on the newIsChecked state
    //   const updatedSelection = newIsChecked
    //     ? new Array(data.length).fill(true) // Select all if checked
    //     : new Array(data.length).fill(false); // Deselect all if unchecked

    //   setSelectedRows(updatedSelection);

    //   // Pass the selected indices to the parent function if required
    //   if (newIsChecked) {
    //     data.forEach((_, index) => onRowIndexSelect(index)); // Pass all indices
    //   } else {
    //     onRowIndexSelect([]); // Pass empty array if none are selected
    //   }
    // }
  }, []);

  useEffect(() => {
    const calculatedWidths = calculateColumnWidths(data, sliderValue);

    // console.log('slide values:>>>', sliderValue);

    // if (data.length > 0) {
    //   const columns = Object.keys(data[0]);
    //   columns.forEach(column => {
    //     console.log(`column: ${column}, width: ${columnWidths[column]}`);
    //   });
    // }

    setColumnWidths(calculatedWidths);
    setIsModel(noModel);
    setCalculated(true);
  }, [
    data,
    sliderValue,
    tableIndex,
    selectedRows,
    isChecked,
    onRowIndexSelect,
    toggleRowSelection,
  ]); // Update when data or sliderValue changes

  useEffect(() => {
    const calculatedWidths = calculateColumnWidths(data, sliderValue);

    // Calculate total width of columns
    const totalWidth = Object.values(calculatedWidths).reduce(
      (acc, width) => acc + width,
      0,
    );

    // Set total width in the state
    setTotalColumnWidths(totalWidth);
    console.log('totalwidth:>>', totalWidth);

    setColumnWidths(calculatedWidths);
    setCalculated(true);
  }, [data, sliderValue]);

  const toggleRowSelection = rowIndex => {
    const actualIndex = page * rowsPerPage + rowIndex;
    const updatedSelection = [...selectedRows];
    const isSelected = updatedSelection[actualIndex];

    // Toggle the selection state
    updatedSelection[actualIndex] = !isSelected;
    setMainTableSelectAll(true)
    // Update the selected state
    setTableIndex(actualIndex);
    setSelectedRow(data[actualIndex]);
    setModalVisible(true);

    // Trigger onRowIndexSelect only if isModel is false
    if (isModel === false) {
      onRowIndexSelectDataLoad(actualIndex);
    }

    // If the row is selected, skip onPressCheckBoxHandle(false)
    if (!isSelected) {
      onPressCheckBoxHandle(false);
    } else {
      onPressCheckBoxHandle(true);
    }

    console.log('Updated selection:', updatedSelection);
  };
  const toggleRowSelectionCheckBox = rowIndex => {
    const actualIndex = page * rowsPerPage + rowIndex;
    const updatedSelection = [...selectedRows];
    const isSelected = updatedSelection[actualIndex];

    // Toggle the selection state
    updatedSelection[actualIndex] = !isSelected;

    // Update the selected state
    setTableIndex(actualIndex);
    setSelectedRow(data[actualIndex]);
    setModalVisible(true);

    // Trigger onRowIndexSelect only if isModel is false
    if (isModel === false) {
      onRowIndexSelect(actualIndex);
    }
    if (isSelected) {
      onPressCheckBoxHandle(true);
    }

    // If the row is selected, skip onPressCheckBoxHandle(false)
    // if (!isSelected) {
    //   onPressCheckBoxHandle(false);
    // }

    console.log('Updated selection:', updatedSelection);
  };

  if (!calculated) {
    return <Text>Loading...</Text>;
  }

 

  const handleSelectAllCheckbox = () => {
    setMainTableSelectAll(isChecked)
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    // Update selectedRows based on the newIsChecked state
    const updatedSelection = newIsChecked
      ? new Array(data.length).fill(true) // Select all if checked
      : new Array(data.length).fill(false); // Deselect all if unchecked

    setSelectedRows(updatedSelection);
    console.log('SelectAllCheckBox::', data);

    // Pass the selected indices to the parent function if required
    if (newIsChecked) {
      setMainTableSelectedIndex([])
      data.forEach((_, index) => setTimeout(() => {onRowIndexSelect(index)},100)); // Pass all indices
      // onPressCheckBoxHandle(true)
    } else {
      onRowIndexSelect([]); // Pass empty array if none are selected
    }
  };

  const columns = Object.keys(data[0]);

  

  return (
    <View>
      <View style={styles.selectSlide}>
        {/* <View style={styles.sliderContainer}> */}
        {/* <Slider
            style={{width: '50%', height: 40}}
            minimumValue={0} // Minimum scale factor
            maximumValue={10} // Maximum scale factor
            minimumTrackTintColor={CustomThemeColors.primary}
            maximumTrackTintColor={CustomThemeColors.primary}
            value={sliderValue}
            onValueChange={value => setSliderValue(value)}
          /> */}
        <Text
          style={{
            // backgroundColor: CustomThemeColors.fadedPrimary,
            maxWidth: 200,
            padding: 5,
            borderRadius: 10,
            fontSize: DeviceInfo.isTablet() ? 16 : 12,
            fontWeight: '800',
            color: 'black',
          }}>
          Payment Groups
        </Text>
        {/* </View> */}
        <View style={styles.container}>
          <CheckBox
            title={!isChecked ? 'Select All' : 'Deselect All'}
            checked={isChecked}
            containerStyle={{
              backgroundColor: 'white',
              borderWidth: 0,
              borderRadius: 5,
              padding: 3,
              fontSize: 8,
            }}
            onPress={() => {
              handleSelectAllCheckbox();
            }}
          />
        </View>
      </View>

      {/* <ScrollView horizontal> */}
      <View style={[styles.table, {borderWidth: 1, borderRadius: 8,borderColor:CustomThemeColors.primary,marginRight:4}]}>
        <View style={styles.headerRow}>
          {columns.map((column, index) => (
            <Text
              key={index}
              style={[
                styles.headerCell,
                {
                  width:
                    sliderValue == 0
                      ? (columnWidths[column] / totalColumnWidths) *
                          screenWidth -
                        (showCheckBox ? 10 : 0)
                      : columnWidths[column] - 35,

                  fontSize: DeviceInfo.isTablet()
                    ? 14
                    : sliderValue <= 1.5625
                    ? 10
                    : sliderValue <= 2.578125
                    ? 10
                    : sliderValue <= 3.578125
                    ? 12
                    : 14,
                },
              ]}>
              {makeReadable(column)}
            </Text>
          ))}
          {showCheckBox && (
            <Text
              style={[
                styles.headerCell,
                {
                  borderRightWidth: 0,
                  alignSelf: 'center',
                  paddingHorizontal: 5,
                  fontSize: DeviceInfo.isTablet()
                    ? 14
                    : sliderValue <= 1.5625
                    ? 10
                    : sliderValue <= 2.578125
                    ? 10
                    : sliderValue <= 3.578125
                    ? 12
                    : 14,
                },
              ]}>
              Select
            </Text>
          )}
        </View>

        {/* TABLE ROWS */}
        <ScrollView>
          {data
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((row, rowIndex) => (
              <TouchableOpacity
                key={rowIndex}
                onPress={() => {
                  toggleRowSelection(rowIndex);
                }}
                onLongPress={() => {
                  // longPressIndex(rowIndex);
                }}>
                <View
                  style={
                    selectedRows[page * rowsPerPage + rowIndex] === false &&
                    tableIndex === page * rowsPerPage + rowIndex
                      ? styles.activeSelect
                      : tableIndex === page * rowsPerPage + rowIndex
                      ? styles.activeSelect
                      : rowIndex % 2 === 0
                      ? styles.oddRow
                      : styles.evenRow
                  }>
                  {columns.map((column, cellIndex) => (
                    <Text
                      key={cellIndex}
                      style={[
                        cellIndex % 2 === 0 ? styles.oddCell : styles.oddCell,
                        {
                          width:
                            sliderValue == 0
                              ? (columnWidths[column] / totalColumnWidths) *
                                  screenWidth -
                                (showCheckBox ? 10 : 0)
                              : columnWidths[column] - 35,

                          fontSize: DeviceInfo.isTablet()
                            ? 14
                            : sliderValue <= 1.5625
                            ? 10
                            : sliderValue <= 2.578125
                            ? 10
                            : sliderValue <= 3.578125
                            ? 12
                            : 14,
                        },
                      ]}>
                      {String(row[column])}
                    </Text>
                  ))}
                  {showCheckBox && (
                    <View style={{borderBottomWidth: .5}}>
                      <CheckBox
                        checked={
                          mainTableSelectedIndex.includes(
                            data[page * rowsPerPage + rowIndex].groupId,
                          )
                            ? true
                            : false

                          // selectedRows[page * rowsPerPage + rowIndex] || false
                        }
                        onPress={() => {
                          const actualIndex = page * rowsPerPage + rowIndex;
                          const updatedSelection = [...selectedRows];
                          updatedSelection[actualIndex] =
                            !updatedSelection[actualIndex];

                          console.log(
                            'actualIndex->',
                            actualIndex,
                            'updatedIndex:',
                            updatedSelection,
                          );
                          setSelectedRows(updatedSelection);
                          toggleRowSelectionCheckBox(actualIndex);
                          if(selectedRows.length<1){
                            setIsChecked(false)
                          }
                          setMainTableSelectAll(true)

                          // If a row is checked or unchecked, manage the "Select All" checkbox state
                          // const allSelected = updatedSelection.every(Boolean);
                          // setIsChecked(allSelected);
                        }}
                        containerStyle={{
                          backgroundColor: 'transparent',
                          // borderBottomWidth: 1,
                          padding: 4,
                        }}
                        size={
                          sliderValue <= 1.5625
                            ? 22
                            : sliderValue <= 2.578125
                            ? 16
                            : sliderValue <= 3.578125
                            ? 16
                            : 18
                        }
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          {/* PAGINATION BUTTONS */}
        </ScrollView>
      </View>
      {/* </ScrollView> */}
      {/* <View style={styles.paginationContainer}>
          <Button
            title="Previous"
            onPress={handlePreviousPage}
            disabled={page === 0}
          />
          <Text style={styles.pageInfo}>
            Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
          </Text>
          <Button
            title="Next"
            onPress={handleNextPage}
            disabled={(page + 1) * rowsPerPage >= data.length}
          />
        </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  selectSlide: {
    // flex: 1,
    marginTop: 0,
    flexDirection: 'row',
    // width: 300,
    // backgroundColor: 'grey',
    justifyContent: 'space-between',
    // alignContent: 'space-between',
    alignItems: 'center',
  },
  sliderContainer: {
    marginHorizontal: 20,
    // width:'100',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginTop: 10,
    backgroundColor: 'white',
  },
  activeSelect: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
    borderRadius: 18,
    marginLeft: 3,
    marginRight: 3,
  },
  headerRow: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    flexDirection: 'row',
    backgroundColor: CustomThemeColors.primary,
    borderRadius: 5,
    borderColor: 'white',
  },
  oddRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 5,
  },
  evenRow: {
    flexDirection: 'row',
    backgroundColor: CustomThemeColors.fadedPrimary,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 5,
  },

  headerCell: {
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  oddCell: {
    paddingVertical: 8,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    color: 'black',
  },
  evenCell: {
    paddingVertical: 8,
    backgroundColor: 'lightgrey',
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
  },
});

export default TableComponent;