import React, {useState} from 'react';
import {View, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import {CustomThemeColors} from '../../CustomThemeColors';

const CustomProgressBar = ({progress, label}) => {
  return (
    <View
      style={{
        // width: '100%',
        marginTop: 10,
        // paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#9c9a9a',
        minWidth: '60%',
      }}>
      {/* <Text style={{marginBottom: 10}}>
        Downloading: {Math.round(progress * 100)}%
      </Text> */}

      <Progress.Circle
        progress={progress / 100}
        // width={100}
        // height={200}
        color={CustomThemeColors.whiteBackgroundColor}
      />
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: CustomThemeColors.whiteBackgroundColor,
            fontSize: 15,
            fontWeight: '600',
            paddingVertical: 3,
          }}>
          {label || null}
        </Text>
        <Text
          style={{
            color: CustomThemeColors.whiteBackgroundColor,
            fontSize: 15,
            fontWeight: '600',
            paddingVertical: 3,
          }}>
          {' '}
          {progress}%
        </Text>
      </View>
    </View>
  );
};

export default CustomProgressBar;
