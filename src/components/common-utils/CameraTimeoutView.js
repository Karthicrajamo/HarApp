import React from 'react';
import { View, Text } from 'react-native';

const CameraTimeoutView = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , zIndex:999}}>
      <Text>Camera is inactive for too long.</Text>
    </View>
  );
};

export default CameraTimeoutView;
