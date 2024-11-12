import React from 'react';
import {View, Image, ActivityIndicator, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
// const loadingGIF = require('../../../images/loading.gif');
const CustomLoadingUI = () => {
  return (
    <View style={styles.loadingContainer}>
      <FastImage
        source={require('../../../images/loading.gif')} // Use your GIF here
        style={styles.logo}
        resizeMode={FastImage.resizeMode.contain} // Ensure proper scaling
      />
      {/* <ActivityIndicator size="large" color="#4CAF50" /> */}
      <Text style={styles.loadingText}>Logging in...</Text>
    </View>
  );
};

// Styles for the loading UI component
const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffffff', // White background to match the GIF
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
});

export default CustomLoadingUI;
