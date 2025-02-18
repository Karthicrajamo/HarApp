import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import commonStyles from '../Approval/ApprovalCommonStyles';
import {CustomThemeColors} from '../CustomThemeColors';
import DeviceInfo from 'react-native-device-info';

const {width, height} = Dimensions.get('window');

const CustomModalWithCloseIcon = ({
  isVisible=false,
  onClose,
  children='',
  title='',
  subBtn = '',
  subBtnAction,
  isVisibleClose = true,
  isVisibleCloseIcon = false,
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
            {title ? (
              <Text style={styles.modalTitle}>{title}</Text>
            ) : (
              <Text style={styles.modalTitle}></Text>
            )}
            {isVisibleCloseIcon && (
              <View style={{justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.topRightCloseButton}>
                  <Icon name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
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
    width: DeviceInfo.isTablet() ? width / 1.5 : width,
    backgroundColor: '#fff',
    borderRadius: 10,
    // padding: width * 0.05,
    paddingHorizontal:DeviceInfo.isTablet() ?10:0,

    alignItems: 'center',
    margin: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  modalTitle: {
    fontSize: DeviceInfo.isTablet() ? 18 : 16,
    fontWeight: 'bold',
    color: '#333',
    // marginBottom: 10,
    margin: 10,
  },
  topRightCloseButton: {
    // position: 'absolute',
    // right: width * -.08,
    // top: height * -0.047,
    // backgroundColor: CustomThemeColors.primary,
    padding: 10,
    // borderRadius: 50,
    color: 'black',
  },
  childrenContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  closeButton: {
    backgroundColor: '#3788E5',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomModalWithCloseIcon;
