import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  PixelRatio,
} from 'react-native';
import Slider from '@react-native-community/slider'; // Import slider component
import {CustomThemeColors} from '../CustomThemeColors';
import {CheckBox} from 'react-native-elements';
import {Button} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CustomModal from '../common-utils/modal';
import ApprovalTableComponent from '../Approval/ApprovalComponents/ApprovalTableComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';

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
  const effectiveScaleFactor = totalWidth > 0 ? screenWidth / totalWidth : 1;

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
  setMainTableSelectAll,
  // setMainLoading
}) => {
  const navigation = useNavigation();
  const {width: screenWidth} = Dimensions.get('window');
  const [data, setData] = useState(initialData);
  const [columnWidths, setColumnWidths] = useState({});
  const [calculated, setCalculated] = useState(false);
  const [sliderValue, setSliderValue] = useState(0); // Initial value for the slider (scale factor)
  const [tableIndex, setTableIndex] = useState(-1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  // console.log('selectedRow in tc', selectedRow);
  const [isModel, setIsModel] = useState(true);
  const [page, setPage] = useState(0); // Current page
  const rowsPerPage = 5000; // Number of rows per page
  const [totalColumnWidths, setTotalColumnWidths] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [detailViewModalVisible, setDetailViewModalVisible] = useState(false);
  const [longPressData, setLongPressData] = useState([]);

  const fontScale = PixelRatio.getFontScale();

  const toggleModalDetail = () => {
    setDetailViewModalVisible(!detailViewModalVisible);
  };

  useEffect(() => {
    console.log('initialDataz tc;' + JSON.stringify(initialData));
    setData(initialData); // Update state when initialData prop changes
  }, [initialData]);

  useEffect(() => {
    console.log('fontScale::' + fontScale);
  }, []);

  useEffect(() => {
    const calculatedWidths = calculateColumnWidths(data, sliderValue);

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
    setMainTableSelectAll(true);
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

    console.log('isSelected::', isSelected);
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
      console.log('checkkk::');
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
    // setMainLoading(true)
    // if (isLoading) return; // Prevent multiple clicks while loading
    setIsLoading(true);

    // Prevent the checkbox from toggling immediately
    const newIsChecked = !isChecked;

    // Do not update isChecked yet, process selection first
    const updatedSelection = newIsChecked
      ? new Array(data.length).fill(true) // Select all
      : new Array(data.length).fill(false); // Deselect all

    setSelectedRows(updatedSelection);
    console.log('SelectAllCheckBox::', data);

    // Update parent component state
    if (newIsChecked) {
      setMainTableSelectedIndex([]);
      data.forEach((_, index) => {
        setTimeout(() => {
          onRowIndexSelect(index);
        });
      });
    } else {
      onRowIndexSelect([]);
    }

    // Now safely update isChecked **after processing is complete**
    setTimeout(() => {
      setIsChecked(newIsChecked);
      setIsLoading(false);
    }, 300); // Optional delay to ensure smooth UI updates
  };

  const columns = Object.keys(data[0]);
  const columnAlignments = columns.map(column => {
    return data.some(
      row => !isNaN(String(row[column])) || String(row[column]) === '-',
    )
      ? 'right'
      : 'left';
  });

  return (
    <View>
      {isLoading ? <Text>Loading...</Text> : <></>}
      <View style={styles.selectSlide}>
        <Text
          style={{
            // backgroundColor: CustomThemeColors.fadedPrimary,
            // maxWidth: 200,
            maxWidth: DeviceInfo.isTablet() ? 220 : 120,
            padding: 5,
            borderRadius: 10,
            fontSize: DeviceInfo.isTablet() ? 14 : 12,
            fontWeight: '800',
            color: 'black',
          }}>
          Payment Groups
        </Text>
        {/* </View> */}
        {/* <View style={styles.container}> */}
        {/* MaterialIcons Eye Icon */}
        <TouchableOpacity
          disabled={selectedRow.length < 1}
          // onPress={() => {
          //   setLongPressData([selectedRow]);
          //   console.log('selectedRow cell dastaa::', selectedRow);
          //   setDetailViewModalVisible(true);
          // }}
          onPress={() => {
            const transformedRow = Object.entries(selectedRow || {}).reduce(
              (acc, [key, value]) => {
                acc[makeReadable(key)] = value; // Transform the key
                return acc; // Accumulate the result
              },
              {},
            );

            // Set the transformed data
            setLongPressData([transformedRow]);
            // setLongPressData([selectedRow]);
            console.log('cell dastaa::', transformedRow);
            setDetailViewModalVisible(true);
          }}>
          <MaterialIcons
            name="visibility" // Eye icon
            size={24} // Adjust size as needed
            color={selectedRow.length < 1 ? 'darkgrey' : 'green'} // Adjust color as needed
            style={{
              // marginRight: 700,
              marginLeft: DeviceInfo.isTablet() ? 670 : 150,
              padding: 0,
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }} // Spacing between checkbox and icon
          />
        </TouchableOpacity>

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
            //   isChecked&&setTimeout(() => {
            //   navigation.replace('IssueGroups');
            // }, 1000);
            setIsLoading(true);
            setSelectedRow([]);
            handleSelectAllCheckbox();

            setIsLoading(false);
          }}
        />
        {/* </View> */}
      </View>

      {/* <ScrollView horizontal> */}
      <View
        style={[
          styles.table,
          {
            borderWidth: 1,
            borderRadius: 8,
            borderColor: CustomThemeColors.primary,
            marginRight: 4,
          },
        ]}>
        <View style={styles.headerRow}>
          {columns.map((column, index) => {
            return (
              <Text
                key={index}
                style={[
                  styles.headerCell,
                  {
                    // width:
                    //   (columnWidths[column] / totalColumnWidths) * screenWidth -
                    //   (showCheckBox ? 8 : 0),
                    width: DeviceInfo.isTablet()
                      ? (columnWidths[column] / totalColumnWidths) *
                          screenWidth -
                        (showCheckBox ? 8 : 0)
                      : (columnWidths[column] / totalColumnWidths) *
                          screenWidth -
                        (showCheckBox ? 6 : 0),
                    fontSize: DeviceInfo.isTablet()
                      ? fontScale >= 1.2999999523162842
                        ? 10
                        : fontScale == 0.8500000238418579
                        ? 14
                        : 12
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
            );
          })}
          {showCheckBox && (
            <Text
              style={[
                styles.headerCell,
                {
                  borderRightWidth: 0,
                  // alignSelf: 'center',
                  paddingHorizontal: 5,
                  fontSize: DeviceInfo.isTablet()
                    ? fontScale >= 1.2999999523162842
                      ? 10
                      : // : fontScale >= 1.149999976158142
                      // ? 14
                      fontScale == 0.8500000238418579
                      ? 14
                      : 12
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
        <ScrollView
          nestedScrollEnabled
          style={{
            maxHeight:
              fontScale >= 1.2999999523162842
                ? 137
                : fontScale >= 1.149999976158142
                ? 134
                : fontScale >= 0.8500000238418579
                ? 125
                : 134,
            flexGrow: 1,
          }}>
          {data
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((row, rowIndex) => (
              <TouchableOpacity
                key={rowIndex}
                onPress={() => {
                  toggleRowSelection(rowIndex);
                }}
                // onLongPress={() => {
                //   setLongPressData([row]);
                //   console.log('cell dastaa::', row);
                //   setDetailViewModalVisible(true);
                // }}
              >
                <View
                  style={
                    selectedRow.length < 1
                      ? rowIndex % 2 === 0
                        ? styles.oddRow
                        : styles.evenRow // Uncomment if you need even-row styling
                      : tableIndex === page * rowsPerPage + rowIndex
                      ? selectedRows[page * rowsPerPage + rowIndex] === false
                        ? styles.activeSelect
                        : styles.activeSelect
                      : rowIndex % 2 === 0
                      ? styles.oddRow
                      : styles.evenRow
                  }>
                  {columns.map((column, cellIndex) => {
                    const cellText = String(row[column]);
                    const isTruncated = cellText.length > 15;
                    const displayText = isTruncated
                      ? `${cellText.slice(0, 15)}...`
                      : cellText;
                    return (
                      <Text
                        key={cellIndex}
                        style={[
                          cellIndex % 2 === 0 ? styles.oddCell : styles.oddCell,
                          {
                            textAlign: columnAlignments[cellIndex], // Use preprocessed alignment
                            // width:
                            //   sliderValue == 0
                            //     ? (columnWidths[column] / totalColumnWidths) *
                            //         screenWidth -
                            //       (showCheckBox ? 8 : 0)
                            //     : columnWidths[column] - 35,
                            width: DeviceInfo.isTablet()
                              ? (columnWidths[column] / totalColumnWidths) *
                                  screenWidth -
                                (showCheckBox ? 8 : 0)
                              : (columnWidths[column] / totalColumnWidths) *
                                  screenWidth -
                                (showCheckBox ? 6 : 0),

                            fontSize: DeviceInfo.isTablet()
                              ? fontScale >= 1.2999999523162842
                                ? 11
                                : fontScale >= 1.149999976158142
                                ? 12
                                : fontScale >= 0.8500000238418579
                                ? 14
                                : 12
                              : sliderValue <= 1.5625
                              ? 10
                              : sliderValue <= 2.578125
                              ? 10
                              : sliderValue <= 3.578125
                              ? 12
                              : 14,
                          },
                        ]}
                        numberOfLines={1} // Ensures single-line display
                        ellipsizeMode="tail" // Adds ellipsis for overflow
                      >
                        {String(row[column]).length > 20
                          ? String(row[column])
                          : String(row[column])}
                      </Text>
                    );
                  })}
                  {showCheckBox && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center', // Ensures content is centered horizontally
                        borderBottomWidth: 0.5,
                        paddingHorizontal: DeviceInfo.isTablet() ? 8 : 0,
                      }}
                      onPress={() => {
                        const actualIndex = page * rowsPerPage + rowIndex;
                        const updatedSelection = [...selectedRows];
                        updatedSelection[actualIndex] =
                          !updatedSelection[actualIndex];
                        setSelectedRows(updatedSelection);
                        toggleRowSelectionCheckBox(actualIndex);

                        if (selectedRows.length < 1) {
                          setIsChecked(false);
                        }
                        setMainTableSelectAll(true);
                      }}>
                      {/* CheckBox */}
                      <CheckBox
                        onPress={() => {
                          const actualIndex = page * rowsPerPage + rowIndex;
                          const updatedSelection = [...selectedRows];
                          updatedSelection[actualIndex] =
                            !updatedSelection[actualIndex];
                          setSelectedRows(updatedSelection);
                          toggleRowSelectionCheckBox(actualIndex);

                          if (selectedRows.length < 1) {
                            setIsChecked(false);
                          }
                          setMainTableSelectAll(true);
                        }}
                        checked={mainTableSelectedIndex.includes(
                          data[page * rowsPerPage + rowIndex].groupId,
                        )}
                        // onPress={() => {
                        //   const actualIndex = page * rowsPerPage + rowIndex;
                        //   const updatedSelection = [...selectedRows];
                        //   updatedSelection[actualIndex] =
                        //     !updatedSelection[actualIndex];
                        //   setSelectedRows(updatedSelection);
                        //   toggleRowSelectionCheckBox(actualIndex);

                        //   if (selectedRows.length < 1) {
                        //     setIsChecked(false);
                        //   }
                        //   setMainTableSelectAll(true);
                        // }}
                        containerStyle={{
                          backgroundColor: 'transparent',
                          padding: 0,
                          margin: 0,
                        }}
                        size={
                          sliderValue <= 1.5625
                            ? 14
                            : sliderValue <= 2.578125
                            ? 16
                            : sliderValue <= 3.578125
                            ? 16
                            : 18
                        }
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          {/* PAGINATION BUTTONS */}
        </ScrollView>
      </View>

      <CustomModal
        isVisible={detailViewModalVisible}
        onClose={toggleModalDetail}
        title="">
        {/* Children Content */}
        <View style={{height: 200}}>
          <ApprovalTableComponent tableData={longPressData} heading={''} />
        </View>
      </CustomModal>
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
    // paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  oddCell: {
    // paddingBottom: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    color: 'black',
  },
  evenCell: {
    paddingVertical: 0,
    backgroundColor: 'lightgrey',
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
  },
});

export default TableComponent;
