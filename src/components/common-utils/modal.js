import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import commonStyles from '../Approval/ApprovalCommonStyles';

const {width} = Dimensions.get('window');

const CustomModal = ({
  isVisible,
  onClose,
  children,
  title,
  subBtn = '',
  subBtnAction,
  isVisibleClose = true,
}) => {
  // const [isVisible, setIsVisible] = useState(true);

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
          {subBtn ? (
            <View style={[commonStyles.flexRow]}>
              <TouchableOpacity
                style={[styles.closeButton, {marginHorizontal: 20}]}
                onPress={subBtnAction}>
                <Text style={styles.closeButtonText}>{subBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton, {marginHorizontal: 20}]}
                onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            isVisibleClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )
          )}
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
    width: 'auto',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    margin: 10,
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

{
  /* <CustomModal
  isVisible={isModalVisible}
  onClose={toggleModal}
  title="Advance Adjustments">
  <Text style={styles.modalBody}>Party Name: accessories</Text>
  <Text style={styles.modalBody}>Payment Amount: 1500 INR</Text>
  <View style={{height: 200}}>
    <ApprovalTableComponent tableData={tableData} heading={'Advance Details'} />
  </View>
</CustomModal>; */
}
