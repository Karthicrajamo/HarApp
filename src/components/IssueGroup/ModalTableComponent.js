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
import {ActivityIndicator} from 'react-native-paper';
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

const ModalTableComponent = ({
  initialData,
  onRowIndexSelect,
  noModel,
  selectAllIsChecked,
  longPressIndex,
  showCheckBox = false,
  excludeColumns = [],
  activeDataPdf,
  MainType,
}) => {
  const isTablet = DeviceInfo.isTablet();

  const excludeFields = (data, excludeFields) => {
    return data.map(item => {
      let filteredItem = {...item};
      excludeFields.forEach(field => delete filteredItem[field]);
      return filteredItem;
    });
  };

  const {width: screenWidth} = Dimensions.get('window');
  const [data, setData] = useState(
    excludeColumns.length > 0
      ? excludeFields(initialData, excludeColumns)
      : initialData,
  );  const [columnWidths, setColumnWidths] = useState({});
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
    if (selectAllIsChecked) {
      const newIsChecked = !isChecked;
      setIsChecked(newIsChecked);

      // Update selectedRows based on the newIsChecked state
      const updatedSelection = newIsChecked
        ? new Array(data.length).fill(true) // Select all if checked
        : new Array(data.length).fill(false); // Deselect all if unchecked

      setSelectedRows(updatedSelection);

      // Pass the selected indices to the parent function if required
      if (newIsChecked) {
        data.forEach((_, index) => onRowIndexSelect(index)); // Pass all indices
      } else {
        onRowIndexSelect([]); // Pass empty array if none are selected
      }
    }
  }, []);

  useEffect(() => {
    const calculatedWidths = calculateColumnWidths(data, sliderValue);

    console.log('slide values:>>>', sliderValue);

 

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
    updatedSelection[actualIndex] = !updatedSelection[actualIndex];
    // setSelectedRows(updatedSelection);
    setTableIndex(actualIndex);
    // console.log("Selected Row model",data[actualIndex])
    setSelectedRow(data[actualIndex]);
    setModalVisible(true);
    if (isModel === false) {
      onRowIndexSelect(actualIndex);
    }
    console.log(selectedRows);
    setIsChecked(false);
  };

  if (!calculated) {
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              color: 'greys',
              fontWeight: '600',
            }}>
            Please wait...
          </Text>
        </View>
      </View>
    );
  }

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
    setSelectedRows((prevIsChecked, index) => {
      const newIsChecked = !prevIsChecked;
      setSelectedRows(new Array(data.length).fill(false));

      return newIsChecked;
    });
    setTableIndex(-1);
  };

  const handleSelectAllCheckbox = () => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    // Update selectedRows based on the newIsChecked state
    const updatedSelection = newIsChecked
      ? new Array(data.length).fill(true) // Select all if checked
      : new Array(data.length).fill(false); // Deselect all if unchecked

    setSelectedRows(updatedSelection);

    // Pass the selected indices to the parent function if required
    if (newIsChecked) {
      data.forEach((_, index) => onRowIndexSelect(index)); // Pass all indices
    } else {
      onRowIndexSelect([]); // Pass empty array if none are selected
    }
  };

  const columns = Object.keys(data[0]); //harish hided and added below line code
  // const columns = Object.keys(data);


  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: CustomThemeColors.primary,
        height:400
      }}>
   

      <View style={styles.selectSlide}></View>
      <View style={styles.headerRow}>
        {columns.map((column, index) => (
          <Text
            key={index}
            style={[
              index % 2 === 0 ? styles.oddCell : styles.oddCell,
              {
                width:
                  sliderValue == 0
                    ? (columnWidths[column] / totalColumnWidths) * screenWidth -
                      (showCheckBox ? 6 : 2)
                    : columnWidths[column] - 35,
                fontSize: isTablet ? 14 : 8,
                color: 'white',
                borderRightWidth: 0.5,
                borderRightWidth: index === columns.length - 1 ? 0 : 0.5,
                // paddingHorizontal: 5,
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
             
                fontSize: isTablet ? 14 : 12,
              },
            ]}>
            Select
          </Text>
        )}
      </View>
      <ScrollView>
          <View style={[styles.table]}>
            {/* TABLE ROWS */}
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
                                  (showCheckBox ? 6 : 2)
                                : columnWidths[column] - 35,

                      
                            fontSize: isTablet ? 14 : 8,
                            fontWeight: '400',
                            color: '#000000',
                            borderRightWidth:
                              cellIndex === columns.length - 1 ? 0 : 0.5,
                          },
                        ]}>
                        {row[column] !== null ? String(row[column]) : ''}
                      </Text>
                    ))}
                    {showCheckBox && (
                      <CheckBox
                        checked={
                          selectedRows[page * rowsPerPage + rowIndex] || false
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
                          toggleRowSelection(actualIndex);

                          // If a row is checked or unchecked, manage the "Select All" checkbox state
                          const allSelected = updatedSelection.every(Boolean);
                          setIsChecked(allSelected);
                        }}
                        containerStyle={{
                          backgroundColor: 'transparent',
                          borderWidth: 0,
                          padding: 0,
                        }}
                        size={
                       
                          isTablet ? 14 : 12
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
          </View>
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 0,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalValue: {
    marginLeft: 70,
  },

  activeSelect: {
    backgroundColor: '#A1EEBD',
    borderRadius: 2,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    // borderColor: 'white',
    paddingHorizontal: 5,
  },
  currentSelect: {
    backgroundColor: '#A1EEBD',
    borderWidth: 1,

    // backgroundColor: CustomThemeColors.primary,
    borderRadius: 2,
    borderColor: '#73BBA3',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  currentWithoutActiveSelect: {
    // backgroundColor: 'transparent',  // Set the background color to transparent
    borderColor: '#73BBA3',
    borderWidth: 1,
    // backgroundColor: CustomThemeColors.primary,
    borderRadius: 2,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    // marginBottom: 20,
    borderRadius: 2,
    // marginLeft: 3,
    borderWidth: 0,
  },
  headerRow: {
    paddingHorizontal: 5,
    // paddingVertical: 3,
    flexDirection: 'row',
    backgroundColor: CustomThemeColors.primary,
    borderRadius: 2,
    borderColor: 'white',
    // borderTopEndRadius: 15,
  },
  oddRow: {
    flexDirection: 'row',
    backgroundColor: CustomThemeColors.whiteBackgroundColor,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    // borderBottomEndRadius:18
    paddingHorizontal: 5,
  },
  evenRow: {
    flexDirection: 'row',
    backgroundColor: CustomThemeColors.fadedPrimary,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    // borderBottomEndRadius:18
    paddingHorizontal: 5,
  },

  headerCell: {
    // paddingVertical: 5,

    // backgroundColor: CustomThemeColors.primary,
    // borderRightWidth: 1,
    // borderColor: '#ddd',

    // borderRadius: 10,

    borderRightWidth: 0.5,
    borderColor: 'black',
  },

  oddCell: {
    // paddingVertical: 5,

    // paddingHorizontal: 2,
    // borderBottomWidth: 0.5,
    borderColor: 'black',
    borderEndStartRadius: 2,
    borderEndEndRadius: 2,
  },
  evenCell: {
    // paddingVertical: 3,
    // borderWidth: 1,
    backgroundColor: 'lightgrey',
    borderEndStartRadius: 2,
    borderEndEndRadius: 2,
    borderColor: '#ddd',
  },
  sliderContainer: {
    // marginHorizontal: 20,
    // width:'100',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginTop: 10,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  selectSlide: {
    flexDirection: 'row',
    // width: 300,
    // backgroundColor: 'grey',
    justifyContent: 'space-between',
    // alignContent: 'space-between',
    // alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalValue: {
    marginLeft: 70,
  },
  // table: {
  //   margin: 10,
  // },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageIndicator: {
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 10,
  },
  pageInfo: {
    fontSize: 16,
  },
});

export default ModalTableComponent