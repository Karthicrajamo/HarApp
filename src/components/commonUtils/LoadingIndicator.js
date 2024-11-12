import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const horseLoadingGif = require('./../../images/horse.mp4');
const { width } = Dimensions.get('window');

const LoadingIndicator = ({ message }) => (
  <View style={styles.modalContainer}>
    <View style={styles.videoContainer}>
      <View style={styles.videoWrapper}>
        <Video
          source={horseLoadingGif}
          style={styles.video}
          resizeMode="contain"
          repeat={true}
        />
      </View>
    </View>
  </View>
);

export default LoadingIndicator;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',  // Ensure it stays on top
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it's above all other elements
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 100, // Adjust border radius as needed
    overflow: 'hidden', // Ensure video respects border radius
    backgroundColor: 'transparent',  // Ensure transparent background
  },
  videoWrapper: {
    borderWidth: 4,
    backgroundColor: '#3788E5',
    borderColor: '#fff',
    borderRadius: 100, // Match parent borderRadius for a perfect circle
    overflow: 'hidden', // Ensure border stays within the circle
  },
  video: {
    backgroundColor: '#3788E5',
    width: width < 600 ? 100 : 150,  // Adjust the width and height as needed
    height: width < 600 ? 100 : 150,
    borderRadius: 100,  // Make sure it matches the wrapper and container
  },
});
