import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import commonStyles from '../Approval/ApprovalCommonStyles';
import { CustomThemeColors } from '../CustomThemeColors';

const {width, height} = Dimensions.get('window');

const CustomModal = ({
  isVisible,
  onClose,
  children,
  title,
  subBtn = '',
  subBtnAction,
  isVisibleClose = true,
  isVisibleCloseIcon=false
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Modal Title */}
          <View style={styles.titleContainer}>
            {title && <Text style={styles.modalTitle}>{title}</Text>}
          </View>

          {/* Children Content */}
          <View style={styles.childrenContainer}>{children}</View>

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
        
        {/* Absolute Close Icon */}
        {isVisibleCloseIcon && (
              <TouchableOpacity onPress={onClose} style={styles.absoluteCloseButton}>
                <Icon name="close" size={24} color={CustomThemeColors.primary} />
              </TouchableOpacity>
            )}
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  absoluteCloseButton: {
    position: 'absolute',
    bottom: height / 4.5,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
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
