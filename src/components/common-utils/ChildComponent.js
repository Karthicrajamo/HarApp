import React, {useState} from 'react';
import {useSubscription} from 'react-stomp-hooks';
import {View, Text} from 'react-native';

const ChildComponent = () => {
  const [message, setMessage] = useState('');

  useSubscription('/topic/reply', message => {
    console.log('Received message from /topic/reply:', message.body);
    setMessage(message.body);
  });

  console.log('ChildComponent rendered. Current message:', message);

  return (
    <View>
      <Text>The broadcast message from WebSocket broker is: {message}</Text>
    </View>
  );
};

export default ChildComponent;
