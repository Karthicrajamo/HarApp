// FullScreenView.js
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QrScanner from '../common-utils/QrScanner';// Assuming QrScanner.js is in the same directory
const ComponentWithCropFreeIcon = () => {
    const [qrScannerOpen, setQrScannerOpen] = useState(false);
  
    const openQrScanner = () => {
      setQrScannerOpen(true);
    };
  
    if (qrScannerOpen) {
      return <QrScanner />;
    }
  
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={openQrScanner}>
          <MaterialIcons name="crop-free" size={50} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };
  
  export default ComponentWithCropFreeIcon;
