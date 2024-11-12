import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, Modal,StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const RefreshComponent = ({ visible, onRefresh, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.refreshContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.refreshText}>Refreshing...</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RefreshComponent;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
      refreshContainer: {
        backgroundColor: '#333', // Background color of the refresh component
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      refreshText: {
        color: '#fff',
        marginTop: 10,
      },
      closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
      },
});