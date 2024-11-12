import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import NoticeBoardListScreen from './NoticeBoardListScreen';
import NoticeBoardScreen from './NoticeBoardScreen';
import SockJS from 'sockjs-client';
import {StompSessionProvider} from 'react-stomp-hooks';

const NoticeBoardMainScreen = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState('Anonymous');

  const handleGroupSelection = group => {
    setSelectedGroup(group);
  };

  const handleMessageHistoryUpdate = history => {
    setMessageHistory(history);
  };

  return (
    <View style={styles.container}>
      {selectedGroup ? (
        <NoticeBoardScreen
          group={selectedGroup}
          userId={currentUser}
          prevMessageHistory={messageHistory}
          onBack={() => setSelectedGroup(null)} // Optional: handle back navigation if needed
        />
      ) : (
        <NoticeBoardListScreen
          onGroupSelect={handleGroupSelection}
          onMessageHistoryUpdate={handleMessageHistoryUpdate}
          setCurrentUser={setCurrentUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NoticeBoardMainScreen;

// const socketUrl = 'http://192.168.0.109:8054/websocket';
{
  /* <StompSessionProvider
  url={() => new SockJS(socketUrl)}
  debug={str => console.log(str)}
  onConnect={() => console.log('Connected to WebSocket')}
  onDisconnect={() =>
    console.log('Disconnected from WebSocket')
  }></StompSessionProvider>; */
}
