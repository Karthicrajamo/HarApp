import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CustomModal = ({isVisible, onClose, children, title}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Modal Title */}
          {title && <Text style={styles.modalTitle}>{title}</Text>}

          {/* Children Content */}
          <View style={styles.childrenContainer}>{children}</View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  childrenContainer: {
    width: '100%',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#3788E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomModal;

{/* <CustomModal
  isVisible={isModalVisible}
  onClose={toggleModal}
  title="Advance Adjustments">
  <Text style={styles.modalBody}>Party Name: accessories</Text>
  <Text style={styles.modalBody}>Payment Amount: 1500 INR</Text>
  <View style={{height: 200}}>
    <ApprovalTableComponent tableData={tableData} heading={'Advance Details'} />
  </View>
</CustomModal>; */}
