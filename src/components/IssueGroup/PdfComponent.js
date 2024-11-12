import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import CustomButton from '../common-utils/CustomButton';

const PdfComponent = ({
  children,
  placeholder = 'Select an option',
  setIsModal,
  isModal,
  setSelectedPaymentType,
}) => {
  const initialOption =
    React.Children.toArray(children)[0]?.props.children.props.Children || null;
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const [isModalVisible, setIsModalVisible] = useState(isModal);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsModal(!isModal);
  };

  const handleOptionSelect = option => {
    if (React.isValidElement(option)) {
      const optionText = option.props.children; // Extract inner text from the <Text> component
      setSelectedOption(optionText); // Set the full element as the selected option
      console.log('selectedOptionText:::', selectedOption);
      setSelectedPaymentType(optionText); // Pass the full element to setSelectedPaymentType
    } else {
      setSelectedPaymentType(option); // If option is plain text, set it directly
      console.log('selectedOptions:::', selectedOption);
    }
  };

  useEffect(() => {
    console.log('Selected Option Updated:', selectedOption);
  }, [selectedOption]);

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            {React.Children.map(children, child => {
              const isSelected =
                child.props.children.props.children === selectedOption;
              console.log('sdfsfsfs::::', child.props.children.props.children);
              return React.cloneElement(child, {
                onPress: () => handleOptionSelect(child.props.children),
                style: [child.props.style, isSelected && styles.selectedOption],
              });
            })}
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <CustomButton>Close</CustomButton>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedText: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  selectedOption: {
    backgroundColor: 'lightgreen',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default PdfComponent;
