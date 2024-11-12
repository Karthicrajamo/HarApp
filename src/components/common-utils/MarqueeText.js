
import React, { useEffect,  useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const MarqueeText = ({ children, duration = 10000 }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const { width: containerWidth } = Dimensions.get('window');

  useEffect(() => {
    const animate = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animate());
    };

    animate();
  }, [scrollX, duration]);

  const translateX = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -textWidth - containerWidth], // Adjust the output range based on the length of your text
  });

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  marqueeContainer: {
    overflow: 'hidden',
    width: '100%',
  },
});

export default MarqueeText;
