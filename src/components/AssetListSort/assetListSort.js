import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import styles from './assetListSortStyles';

const AssetListSort = ({
  onClose,
  setSortBy,
  setPreviouslySelectedSort,
  previousSort,
}) => {
  const [selectedOption, setSelectedOption] = useState(previousSort);

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const handleSort = () => {
    if (selectedOption) {
      console.log('kf94i89 setting slected option : ', selectedOption);
      setSortBy(selectedOption);
      setPreviouslySelectedSort(selectedOption);
    }
    onClose(); // Close the modal after sorting
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.titlesortby}>Sort By</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('assetIdNewestFirst')}>
            <Text style={styles.title}>Newest First</Text>
            <View style={styles.radioButton}>
              {selectedOption === 'assetIdNewestFirst' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('assetCode')}>
            <Text style={styles.title}>Asset Code</Text>
            <View style={styles.radioButton}>
              {selectedOption === 'assetCode' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('bookValueLowToHigh')}>
            <Text style={styles.title}>Book Value: Low to High</Text>
            <View style={styles.radioButton}>
              {selectedOption === 'bookValueLowToHigh' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('bookValueHighToLow')}>
            <Text style={styles.title}>Book Value: High to Low</Text>
            <View style={styles.radioButton}>
              {selectedOption === 'bookValueHighToLow' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity> */}

          <View style={styles.buttons}>
            {selectedOption && (
              <TouchableOpacity style={styles.button} onPress={handleSort}>
                <Text style={styles.buttontext}>Sort</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttontext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssetListSort;
