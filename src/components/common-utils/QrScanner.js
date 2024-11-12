import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CustomThemeColors} from '../CustomThemeColors';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';
import CustomMarkerImage from '../assets/scanner-target-frame.png';

const QrScanner = () => {
  const scannerRef = useRef(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannerInstruction, setScannerInstruction] = useState(
    'Place your device over the QR code for scanning',
  );
  const [showScanAgainButton, setScanAgainButton] = useState(false);
  const [instructionIcon, setInstructionIcon] = useState('emoji-objects');
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth >= 600;

  const toggleTorch = () => {
    setTorchOn(prevState => !prevState);
  };

  const reactivateScanner = () => {
    const instruction = 'Place your device over the QR code to scan again';
    setInstructionIcon('qr-code-scanner');
    handleInstruction({instruction});
    if (scannerRef.current) {
      scannerRef.current.reactivate();
    }
  };

  const onSuccess = e => {
    setScanAgainButton(true);
    const instruction = 'Scan successful! Tap "Scan Again" to continue';
    setInstructionIcon('check-circle');
    handleInstruction({instruction});
    console.log('qr details', e.data);
    let edata;

    if (e.data.length > 0) {
      // edata = e.data.substring(1).split(',')[0];
      const values = e.data.substring(1, e.data.length - 1).split(', ');
      edata = values[1];
    } else {
      edata = e.data;
    }
    console.log('qr details edata', edata);
    if (e.data) {
      navigation.navigate('AssetListMainScreen', {data: edata});
    }
  };

  const handleInstruction = ({instruction}) => {
    setScannerInstruction(instruction);
  };

  const navigation = useNavigation();

  const handleBack = () => {
    console.log('going back...');
    navigation.navigate('AssetListMainScreen');
  };

  const customCameraProps = {
    type: RNCamera.Constants.Type.back,
    flashMode: torchOn
      ? RNCamera.Constants.FlashMode.torch
      : RNCamera.Constants.FlashMode.off,
    autoFocus: RNCamera.Constants.AutoFocus.on,
    whiteBalance: RNCamera.Constants.WhiteBalance.auto,
    captureAudio: false,
    zoom: 0.06,
    ratio: '1:1',
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        ref={scannerRef}
        onRead={onSuccess}
        showMarker={true}
        markerStyle={styles.marker}
        customMarker={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.5,
            }}>
            <Image
              source={CustomMarkerImage}
              style={{width: moderateScale(150), height: moderateScale(150)}}
            />
          </View>
        }
        topContent={
          <View
            style={{
              padding: 20,
              marginBottom: verticalScale(50),
              top: 0,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={handleBack}>
                <MaterialIcons
                  name="arrow-back"
                  size={28}
                  color={CustomThemeColors.primary}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: CustomThemeColors.primary,
                }}>
                Scan QR Code
              </Text>
              <TouchableOpacity onPress={toggleTorch}>
                <MaterialIcons
                  name={torchOn ? 'flash-on' : 'flash-off'}
                  size={28}
                  color={CustomThemeColors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: 'auto'}}>
              <View style={styles.instructionContainer}>
                <MaterialIcons
                  name={instructionIcon}
                  size={20}
                  color="yellow"
                  style={{opacity: 0.7, paddingHorizontal: 5}}
                />
                <Text style={styles.instructionText}>{scannerInstruction}</Text>
              </View>
            </View>
          </View>
        }
        topViewStyle={{
          alignItems: 'center',
          paddingHorizontal: horizontalScale(5),
          paddingBottom: verticalScale(50),
          top: 20,
        }}
        bottomContent={
          <View>
            {showScanAgainButton && (
              <View>
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={reactivateScanner}>
                  <Text style={styles.scanAgainButtonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        bottomViewStyle={{
          flexDirection: 'column',
          paddingTop: verticalScale(40),
        }}
        containerStyle={styles.container}
        fadeIn={true}
        cameraProps={customCameraProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    borderColor: 'red',
  },
  instructionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: CustomThemeColors.primary,
    opacity: 0.8,
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 5,
    marginTop: 40,
  },
  instructionText: {
    color: 'white',
    paddingRight: 5,
  },
  scanAgainButton: {
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    backgroundColor: CustomThemeColors.primary,
  },
  scanAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QrScanner;
