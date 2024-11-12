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

const SubTableComponent = ({
  initialData,
  onRowIndexSelect,
  noModel,
  selectAllIsChecked,
  longPressIndex,
  onPressCheckBoxHandle,
  showCheckBox = false,
  setSelectedCheckBoxData,
  selectedCheckBoxData,
  mainTableSelectedIndex,
  setMainTableSelectedIndex,
  activeIndex,
  selectedPaymentType,
  toggleData,
  RowDataForIssue
}) => {

  const {width: screenWidth} = Dimensions.get('window');
  const [data, setData] = useState(initialData);
//   const [data, setData] = useState(
//     excludeColumns.length > 0
//     ? excludeFields(initialData, excludeColumns)
//     : initialData,
// );
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
  const rowsPerPage = 100; // Number of rows per page
  const [totalColumnWidths, setTotalColumnWidths] = useState(0);


  useEffect(() => {
    // if (selectedCheckBoxData.length > 0) {
    console.log('present', selectedCheckBoxData);
    console.log('selectedPaymentTypedf', selectedPaymentType);

    // setIsChecked(!mainTableSelectedIndex.includes(data[0].groupId) && false);

    // }
  }, []);
  useEffect(() => {
    console.log('initialDataz;' + JSON.stringify(initialData));
    setData(initialData); // Update state when initialData prop changes
  }, [initialData]);

  useEffect(() => {
    // setIsChecked(!mainTableSelectedIndex.includes(data[0].groupId) && false);
    console.log('mainTableselectedIndex::', mainTableSelectedIndex);
    // setSelectedCheckBoxData(selectedCheckBoxData.filter(dataa=>dataa.length !=0))
  }, [mainTableSelectedIndex]);

  useEffect(() => {
    console.log('onPressCheckBoxHandle787 status::', selectAllIsChecked);
    if (!selectAllIsChecked) {
      console.log('sdfsionnn');
      setIsChecked(false);
    }

    // Update the isChecked state based on selectAllIsChecked
    if (selectAllIsChecked) {
      const newIsChecked = true; // Force to check all if selectAllIsChecked is true
      setIsChecked(newIsChecked);

      // Update selectedRows based on the newIsChecked state
      const updatedSelection = new Array(data.length).fill(true); // Select all if checked
      setSelectedRows(updatedSelection);

      if (
        newIsChecked &&
        !data.some(item => selectedCheckBoxData && Object.keys(selectedCheckBoxData).includes(`groupId:${item.groupId}`))
      ) {
      
        const updatedCheckBoxData = {...selectedCheckBoxData}; // Ensure immutability
        // console.log('dataaa345345', data);

        data.forEach((item, index) => {
          const groupKey = `groupId:${item.groupId}`;
          const absoluteIndex = page * rowsPerPage + index; // Adjust for pagination

          // Initialize the groupKey array if it doesn't exist
          if (!updatedCheckBoxData[groupKey]) {
            updatedCheckBoxData[groupKey] = [];
          }

          // Add the absolute index to the groupKey if it's not already included
          if (!updatedCheckBoxData[groupKey].includes(absoluteIndex)) {
            updatedCheckBoxData[groupKey].push(absoluteIndex);
          }
        });

        Object.keys(updatedCheckBoxData).forEach(groupKey => {
          const groupId = parseInt(groupKey.split(':')[1]); // Extract the numeric groupId

          // Check if the groupId is in mainTableSelectedIndex
          if (!mainTableSelectedIndex.includes(groupId)) {
            // setIsChecked(false);
            delete updatedCheckBoxData[groupKey]; // Remove the groupId if not in mainTableSelectedIndex
          }
        });

        // setIsChecked(!isChecked);
        setSelectedCheckBoxData(updatedCheckBoxData); // Update state
        data.forEach(dataItem => onRowIndexSelect(dataItem)); // Pass all indices
        data.forEach(dataItem => RowDataForIssue(dataItem)); // Pass all indices
      }

      // else {
      //   // const newIsChecked = true; // Force to uncheck all if selectAllIsChecked is false
      //   setIsChecked(!isChecked);
      //   console.log("sdfasaojg")
      //   // const updatedSelection = new Array(data.length).fill(false); // Deselect all if unchecked
      //   // setSelectedRows(updatedSelection);
      // // onRowIndexSelect([]); // Pass empty array if none are selected
      // }
    }
  }, [selectAllIsChecked]);

  useEffect(
    () =>
      console.log(
        'selectedCheckBoxData:::',
        selectedCheckBoxData,
        '___mainta::',
        mainTableSelectedIndex,
      ),
    [selectedCheckBoxData],
  );

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
    activeIndex(actualIndex);
   
    // console.log("Selected Row Data::'::", Object.keys(data[rowIndex]));
    // onRowIndexSelect(selectedDataa);
    toggleData(actualIndex)};

  if (!calculated) {
    return <Text>Loading...</Text>;
  }

  const handleSelectAllCheckbox = () => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    // Update selectedRows based on the newIsChecked state
    const updatedSelection = newIsChecked
      ? new Array(data.length).fill(true) // Select all if checked
      : new Array(data.length).fill(false); // Deselect all if unchecked

    setSelectedRows(updatedSelection);
    const groupId = data[0].groupId;

    if (
      Array.isArray(mainTableSelectedIndex) &&
      !mainTableSelectedIndex.includes(groupId)
    ) {
      setMainTableSelectedIndex(prev => [...prev, groupId]);
      setIsChecked(true);
    }

    // Send either all data or an empty array based on newIsChecked state
    const dataToSend = newIsChecked ? data : [];
    console.log('SelectAllCheckBox::', dataToSend);
    dataToSend.map(dataa => {onRowIndexSelect(dataa);RowDataForIssue(dataa)});

    setSelectedCheckBoxData(prev => {
      const updatedCheckBoxData = {...prev};

      if (newIsChecked) {
        // If selecting all, add all row indexes to each groupId key
        data.forEach((item, index) => {
          const groupKey = `groupId:${item.groupId}`;
          if (!updatedCheckBoxData[groupKey]) {
            updatedCheckBoxData[groupKey] = [];
          }
          if (!updatedCheckBoxData[groupKey].includes(index)) {
            updatedCheckBoxData[groupKey].push(index);
          }
        });
      } else {
        // If deselecting all, clear all entries for each groupId key
        data.forEach(item => {
          const groupKey = `groupId:${item.groupId}`;
          updatedCheckBoxData[groupKey] = [];
          setMainTableSelectedIndex(
            mainTableSelectedIndex.filter(dataa => dataa != item.groupId),
          );
        });
      }

      return updatedCheckBoxData;
    });
  };

  const columns = Object.keys(data[0]);

  const handleRowCheckbox = rowIndex => {
    const updatedSelection = [...selectedRows];
    updatedSelection[rowIndex] = !updatedSelection[rowIndex];
    setSelectedRows(updatedSelection);

    console.log("Selected data[rowIndex]::'::", data[rowIndex]);
    RowDataForIssue(data[rowIndex])
    // Filter data to include only selected rows
    const selectedDataa = data.filter((_, index) => updatedSelection[index]);
    console.log("Selected Row Data::'::", selectedDataa);
    // console.log("Selected Row Data::'::", Object.keys(data[rowIndex]));
    // onRowIndexSelect(selectedDataa);
    selectedDataa.map(dataa => onRowIndexSelect(dataa));


    if(selectedDataa.length <1){
      onRowIndexSelect([])
    }

    setSelectedCheckBoxData(prev => {
      const groupId = data[rowIndex].groupId;
      const groupKey = `groupId:${groupId}`;

      // Initialize the updated state for selectedCheckBoxData
      const updatedCheckBoxData = {...prev};

      // Update mainTableSelectedIndex if groupId is not already included
      if (
        Array.isArray(mainTableSelectedIndex) &&
        !mainTableSelectedIndex.includes(groupId)
      ) {
        setMainTableSelectedIndex(prevIds => [...prevIds, groupId]);
      }

      // Check if the groupId key exists and contains rowIndex
      if (updatedCheckBoxData[groupKey]?.includes(rowIndex)) {
        // Remove rowIndex if it exists
        console.log('Removing rowIndex:', rowIndex);
        updatedCheckBoxData[groupKey] = updatedCheckBoxData[groupKey].filter(
          index => index !== rowIndex,
        );
      } else {
        // Add rowIndex if it doesn't exist
        updatedCheckBoxData[groupKey] = [
          ...(updatedCheckBoxData[groupKey] || []),
          rowIndex,
        ];
      }

      // Remove empty entries from selectedCheckBoxData
      Object.keys(updatedCheckBoxData).forEach(key => {
        if (updatedCheckBoxData[key].length === 0) {
          delete updatedCheckBoxData[key];
          setMainTableSelectedIndex(
            mainTableSelectedIndex.filter(dataa => dataa != groupId),
          );
        }
      });

      // Return the updated selectedCheckBoxData
      return updatedCheckBoxData;
    });

    // Update "Select All" checkbox state based on whether all rows are selected
    const allSelected = updatedSelection.every(Boolean);
    setIsChecked(allSelected);
    // onRowIndexSelect(selectedData)
  };

  return (
    <View>
      
      <View style={styles.selectSlide}>
        
        <Text
          style={{
            maxWidth: 200,
            padding: 5,
            borderRadius: 10,
            fontSize: DeviceInfo.isTablet() ? 16 : 12,
            fontWeight: '800',
            color: 'black',
          }}>
          {
                selectedPaymentType === 'Paysheet Payment'
              ? 'Payment Details'
              : selectedPaymentType === 'Fund Transfer'
              ? 'Transfer From and To Account Details'
              : 'Payment List'
          }
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
            }}
            onPress={() => {
              handleSelectAllCheckbox();
            }}
          />
        </View>
      </View>

        <View
  style={[
    styles.table,
    {borderWidth: 1, borderColor: CustomThemeColors.primary},
  ]}>
  <View style={styles.headerRow}>
    {columns.filter(column => column !== 'groupId').map((column, index) => (
      <Text
        key={index}
        style={[
          styles.headerCell,
          {
            width:
              sliderValue == 0
                ? (columnWidths[column] / (totalColumnWidths-50)) * screenWidth -
                  (showCheckBox ? 3 : 0)
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
            paddingLeft: 5,
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
      <ScrollView>
        {/* <ScrollView horizontal> */}

  {/* TABLE ROWS */}
  {data
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    .map((row, rowIndex) => (
      <TouchableOpacity
        key={rowIndex}
        onPress={() => {
          toggleRowSelection(rowIndex);
        }}
        >
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
          {columns.filter(column => column !== 'groupId').map((column, cellIndex) => (
            <Text
              key={cellIndex}
              style={[
                cellIndex % 2 === 0 ? styles.oddCell : styles.oddCell,
                {
                  width:
                    sliderValue == 0
                      ? (columnWidths[column] / (totalColumnWidths-50)) * screenWidth -
                        (showCheckBox ? 3 : 0)
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
            <View style={{borderBottomWidth: 0.5}}>
              <CheckBox
                checked={
                  !mainTableSelectedIndex.includes(
                    data[page * rowsPerPage + rowIndex].groupId,
                  )
                    ? false
                    : selectedCheckBoxData?.[
                        `groupId:${
                          data[page * rowsPerPage + rowIndex].groupId
                        }`
                      ]?.includes(page * rowsPerPage + rowIndex) || false
                }
                onPress={() =>
                  handleRowCheckbox(page * rowsPerPage + rowIndex)
                }
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  padding: 4,
                  paddingLeft:0
                }}
                size={
                  sliderValue <= 1.5625
                    ? 22
                    : sliderValue <= 2.578125
                    ? 16
                    : sliderValue <= 3.578125 && 18
                }
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ))}
  {/* PAGINATION BUTTONS */}

        {/* </ScrollView> */}
        {/* <View style={styles.paginationContainer}>
          <Button
          title="Previous"
          onPress={handlePreviousPage}
          disabled={page === 0}
          />
          </View>
          <Text style={styles.pageInfo}>
            Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
          </Text>
          <Button
            title="Next"
            onPress={handleNextPage}
            disabled={(page + 1) * rowsPerPage >= data.length}
          />
        </View> */}
      </ScrollView>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  selectSlide: {
    // flex: 1,
    marginTop: 10,
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
    borderRadius: 6,
    marginLeft: 3,
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

export default SubTableComponent;