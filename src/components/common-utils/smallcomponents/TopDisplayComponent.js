import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  Platform,
  ProgressViewIOS,
} from 'react-native';

const TopDisplayComponent = ({title, description, updatableValue}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {/* Display a progress bar based on the platform */}
      {Platform.OS === 'android' ? (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={updatableValue / 100}
          style={styles.progressBar}
        />
      ) : (
        <ProgressViewIOS
          progress={updatableValue / 100}
          style={styles.progressBar}
        />
      )}
      <Text style={styles.percentage}>{updatableValue}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    width: '100%',
    elevation: 2, // for shadow in Android
    shadowColor: '#000', // for shadow in iOS
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  progressBar: {
    height: 10,
    marginBottom: 5,
  },
  percentage: {
    fontSize: 16,
    textAlign: 'right',
    color: '#555',
  },
});

export default TopDisplayComponent;
