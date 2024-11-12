import React from 'react';
import {useStompClient} from 'react-stomp-hooks';
import {TouchableOpacity, Text} from 'react-native';

const PublishComponent = () => {
  const stompClient = useStompClient();

  const publishMessage = () => {
    if (stompClient) {
      console.log('Publishing message to /app/broadcast: Hello World');
      stompClient.publish({destination: '/app/broadcast', body: 'Hello World'});
    } else {
      console.log('Stomp client is not available.');
    }
  };

  return (
    <TouchableOpacity onPress={publishMessage}>
      <Text>Send message</Text>
    </TouchableOpacity>
  );
};

export default PublishComponent;
