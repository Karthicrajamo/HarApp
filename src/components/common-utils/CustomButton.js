import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

function CustomButton({onPress, children}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          padding: 10,
          backgroundColor: '#3788E5',
          width: 'auto',
          alignItems: 'center',
          borderRadius: 15,
        }}>
        <Text style={{color: 'white'}}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default CustomButton;
