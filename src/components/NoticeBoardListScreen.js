//NOTICE BAORD LIST SCREEN BACKUP - 12-09-2024 - last message and unread count succes - initial
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import NoticeBoardScreen from './NoticeBoardScreen';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../components/ApiUrl';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import for icons
import {CustomThemeColors} from './CustomThemeColors';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {Client} from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from './AppProvider'; // Import the AppContext
import {compareAsc, format} from 'date-fns';

const NoticeBoardListScreen = () => {
  const toTitleCase = str => {
    if (!str) return ''; // Check if str is undefined or null
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const GROUP_STORAGE_KEY = 'NoticeBoardData';

  const {noticeBoardData} = useContext(AppContext); // Use context
  // useEffect(() => {
  //   console.log(
  //     'Global Notice Board in NoticeBoardListScreen:',
  //     noticeBoardData,
  //   );
  //   loadLatestMessageByNoticeBoardGlobalData(noticeBoardData);
  // }, [noticeBoardData]);

  useEffect(() => {
    const loadNoticeBoardData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // setNoticeBoardData(parsedData); // Set the retrieved data in state
          // console.log(
          //   'stored noticeBoard data in async :84985983593845 :',
          //   parsedData.noticeBoardWiseNewMessageDetails,
          // );
          loadLatestMessageByNoticeBoardGlobalData(parsedData); // Pass to your function
        }
      } catch (error) {
        console.error('Error loading noticeBoardData:', error);
      }
    };

    loadNoticeBoardData(); // Call the function to load data on component mount
  }, [noticeBoardData]);

  const loadNoticeBoardData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // setNoticeBoardData(parsedData); // Set the retrieved data in state
        // console.log(
        //   'stored noticeBoard data in async :84985983593845 :',
        //   parsedData.noticeBoardWiseNewMessageDetails,
        // );
        loadLatestMessageByNoticeBoardGlobalData(parsedData); // Pass to your function
      }
    } catch (error) {
      console.error('Error loading noticeBoardData:', error);
    }
  };

  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  // const [totalUnseenMesagesCount, setTotalUnseenMesagesCount] = useState(0);
  const [prevConversationRecords, setPrevConversationRecords] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState('Anonymous');
  const [currentUserName, setCurrentUserName] = useState('Anonymous');
  const [messageHistory, setMessageHistory] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Offline');
  const [subscriptions, setSubscriptions] = useState({}); // Track active subscriptions

  const selectGroup = group => {
    setSelectedGroup(group);
  };

  //previously named updateLatestMessageByNoticeBoardGlobalData

  const loadLatestMessageByNoticeBoardGlobalData = noticeBoardData => {
    if (noticeBoardData && noticeBoardData.noticeBoardWiseNewMessageDetails) {
      const newMessageDetails =
        noticeBoardData.noticeBoardWiseNewMessageDetails;

      setGroups(prevGroups =>
        prevGroups.map(group => {
          const boardId = group.noticeBoardId.toString(); // Convert ID to string for matching
          const boardData = newMessageDetails[boardId]; // Get data for the notice board

          if (boardData) {
            // Check if the last message is the same to avoid duplicate updates
            if (group.lastMessage === boardData.lastMessage) {
              return group;
            }

            // Create an updated group object
            const updatedGroup = {
              ...group,
              lastMessage: boardData.lastMessage,
              lastMessageSentBy: boardData.lastMessageSentBy,
              userName: boardData.userName,
              unseenCount: boardData.newMessagesCount || 0,
            };

            // Save updated group data to AsyncStorage (optional)
            // saveGroupData(updatedGroup);

            return updatedGroup;
          }

          return group; // If no update, return the group as is
        }),
      );
    }
  };

  const updateNoticeBoardActivity = async noticeBoardId => {
    // Get current date and time in "YYYY-MM-DD HH:mm:ss" format
    const now = new Date();
    const formattedTimestamp = format(now, 'yyyy-MM-dd HH:mm:ss.SSS');

    // API endpoint
    const apiUrl = `${API_URL}/api/noticeBoard/updateNoticeBoardActivity?usrid=${currentUser}&nbid=${noticeBoardId}`;

    // Request body
    const requestBody = {
      lastOpenedOn: formattedTimestamp,
    };

    try {
      // Perform the fetch request
      const response = await fetch(apiUrl, {
        method: 'POST', // or 'PUT' if it's an update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      // Parse the response
      const data = response;
      console.log('Success: 8968648564586456454', data);
    } catch (error) {
      // Handle errors
      console.error('Error updating NoticeBoard activity:', error);
    }
  };

  //fetch latest message using WEBSOCKET - START
  // useEffect(() => {
  //   const socket = new SockJS(`${API_URL}/websocket`);
  //   const client = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //     onConnect: frame => {
  //       console.log('Connected: ' + frame);
  //       setStompClient(client);
  //       setConnectionStatus('Online');
  //       subscribeToGroups(client, groups); // Subscribe to groups when connected
  //     },
  //     onStompError: frame => {
  //       console.error('Broker reported error: ' + frame.headers['message']);
  //       console.error('Additional details: ' + frame.body);
  //     },
  //     onWebSocketClose: () => {
  //       console.log('WebSocket connection closed');
  //       setConnectionStatus('Offline');
  //     },
  //     onDisconnect: () => {
  //       console.log('Disconnected');
  //       setConnectionStatus('Offline');
  //     },
  //   });

  //   client.activate();

  //   // Cleanup on unmount
  //   return () => {
  //     if (client) {
  //       // Unsubscribe from all group topics
  //       Object.values(subscriptions).forEach(sub => sub.unsubscribe());
  //       client.deactivate();
  //     }
  //   };
  // }, []); // Only run once when component mounts

  // // Handle subscription only when groups change
  // useEffect(() => {
  //   if (stompClient && stompClient.connected) {
  //     loadGroupData();
  //     subscribeToGroups(stompClient, groups);
  //   }
  // }, [groups, stompClient]);

  // // Subscribe to each group once and only once
  // const subscribeToGroups = (client, groups) => {
  //   const newSubscriptions = {...subscriptions}; // Copy previous subscriptions

  //   groups.forEach(group => {
  //     // Check if this group is already subscribed to
  //     if (!newSubscriptions[group.noticeBoardId]) {
  //       const subscription = client.subscribe(
  //         `/topic/listen/group/${group.noticeBoardId}`,
  //         message => {
  //           try {
  //             const newMessage = JSON.parse(message.body);
  //             console.log('New message received: ', newMessage);

  //             // Update the latest message for the respective group

  //             updateLatestMessage(newMessage, group.noticeBoardId);
  //           } catch (error) {
  //             console.error('Error parsing message: ', error);
  //           }
  //         },
  //       );
  //       newSubscriptions[group.noticeBoardId] = subscription; // Store the subscription
  //     }
  //   });

  //   // Update state with new subscriptions
  //   setSubscriptions(newSubscriptions);
  // };

  // Function to prevent duplicate unseen message increments
  // const updateLatestMessage = (newMessage, noticeBoardId) => {
  //   // if (!newMessage || !newMessage.message) {
  //   //   console.warn('Received an empty or invalid message:', newMessage);
  //   //   return;
  //   // }

  //   // console.log('New message:', newMessage.message);

  //   if (newMessage || newMessage.message) {
  //     setGroups(prevGroups =>
  //       prevGroups.map(group => {
  //         if (group.noticeBoardId === noticeBoardId) {
  //           if (group.lastMessage === newMessage.message) {
  //             return group; // Avoid duplicate unseen increments
  //           }

  //           const updatedGroup = {
  //             ...group,
  //             lastMessage: newMessage.message,
  //             lastMessageSentBy: newMessage.sender,
  //             unseenCount:
  //               newMessage.sender !== currentUser
  //                 ? (group.unseenCount || 0) + 1
  //                 : group.unseenCount || 0,
  //           };

  //           // Save updated group data to AsyncStorage
  //           saveGroupData(updatedGroup);

  //           return updatedGroup;
  //         }
  //         return group;
  //       }),
  //     );
  //   }
  // };

  // const GROUP_STORAGE_KEY = 'NoticeBoardData';

  // const loadGroupData = async () => {
  //   try {
  //     const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);

  //     if (storedData) {
  //       const parsedData = JSON.parse(storedData);
  //       setGroups(prevGroups =>
  //         prevGroups.map(group => ({
  //           ...group,
  //           lastMessage:
  //             parsedData[group.noticeBoardId]?.lastMessage || group.lastMessage,
  //           unseenCount:
  //             parsedData[group.noticeBoardId]?.unseenCount || group.unseenCount,
  //           lastMessageSentBy:
  //             parsedData[group.noticeBoardId]?.lastMessageSentBy ||
  //             group.lastMessageSentBy,
  //         })),
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Failed to load group data:', error);
  //   }
  // };

  // const saveGroupData = async updatedGroup => {
  //   try {
  //     const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);
  //     const parsedData = storedData ? JSON.parse(storedData) : {};

  //     // Update the specific group's data
  //     parsedData[updatedGroup.noticeBoardId] = {
  //       lastMessage: updatedGroup.lastMessage,
  //       lastMessageSentBy: updatedGroup.lastMessageSentBy,
  //       unseenCount: updatedGroup.unseenCount,
  //     };

  //     await AsyncStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(parsedData));
  //   } catch (error) {
  //     console.error('Failed to save group data:', error);
  //   }
  // };

  //fetch latest message using WEBSOCKET - END

  // //$$
  // const TOTAL_UNSEEN_MESSAGES_COUNT_STORAGE__KEY =
  //   'Total_Unseen_Messages_Count';
  // const saveTotalUnseenCount = async toReduce => {
  //   const storedTotalUnseenMessagesCount = await AsyncStorage.getItem(
  //     TOTAL_UNSEEN_MESSAGES_COUNT_STORAGE__KEY,
  //   );
  //   const parsedTotalUnseenMessagesCount = storedTotalUnseenMessagesCount
  //     ? JSON.parse(storedTotalUnseenMessagesCount)
  //     : {};
  //   // parsedTotalUnseenMessagesCount['totalUnseenMessagesCount'] = {
  //   //   totalUnseenMessagesCount:
  //   //     parsedTotalUnseenMessagesCount['totalUnseenMessagesCount']
  //   //       ?.totalUnseenMessagesCount || 0 + updatedGroup.unseenCount,
  //   // };
  //   parsedTotalUnseenMessagesCount['totalUnseenMessagesCount'] = {
  //     totalUnseenMessagesCount: updatedCount - toReduce,
  //   };
  // };

  const resetUnseenCount = async noticeBoardId => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.noticeBoardId === noticeBoardId) {
          const updatedGroup = {...group, unseenCount: 0};

          saveGroupData(updatedGroup); // Save reset unseen count in AsyncStorage
          // saveTotalUnseenCount(group.unseenCount);
          //reduce count in totoal unseencount

          return updatedGroup;
        } else {
          return group;
        }
      }),
    );
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('HomeScreen');
      return true; // Prevent default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        const loggedInUserIdCred = await Keychain.getGenericPassword({
          service: 'loggedInUserId',
        });
        const loggedInUserNameCred = await Keychain.getGenericPassword({
          service: 'loggedInUserName',
        });

        if (loggedInUserIdCred) {
          const savedCurrentLoggedInUserIdNew = loggedInUserIdCred.password;
          setCurrentUser(savedCurrentLoggedInUserIdNew);

          const savedCurrentLoggedInUserNameNew = loggedInUserNameCred.password;
          setCurrentUserName(savedCurrentLoggedInUserNameNew);
          // console.log(
          //   'Loaded savedCurrentLoggedInUserIdNew',
          //   savedCurrentLoggedInUserNameNew,
          //   '\nLoaded savedCurrentLoggedInUserNameNew ',
          //   savedCurrentLoggedInUserNameNew,
          // );
        } else {
          console.log(
            'No Stored savedCurrentLoggedInUserIdNew or  savedCurrentLoggedInUserNameNew!!!',
          );
        }
      } catch (error) {
        console.log('Could not load savedCurrentLoggedInUserNew !!', error);
      }
    };
    loadPrivileges();
  }, []);

  useEffect(() => {
    const fetchNoticeBoards = async () => {
      if (currentUser !== 'Anonymous') {
        try {
          const credentials = await Keychain.getGenericPassword({
            service: 'jwt',
          });
          const token = credentials.password;
          console.log(
            'token extracted from keychain @NoticeBoardListScreen => @fetchNoticeBoards',
            `${token}`,
          );
          const response = await fetch(
            `${API_URL}/api/noticeBoard/foruser?usrid=${currentUser}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
              },
            },
          );

          const data = await response.json();
          setGroups(data);
          loadNoticeBoardData();
        } catch (error) {
          console.error('Failed to fetch notice boards:', error);
        }
      }
    };

    fetchNoticeBoards();
  }, [currentUser]);

  useEffect(() => {
    const fetchAllNoticeBoardConversationsById = async () => {
      if (currentUser !== 'Anonymous') {
        try {
          console.log('selectedGroup: 32756765gff', selectedGroup);
          console.log('currentUser: fsjjrt8904884', currentUser);
          const credentials = await Keychain.getGenericPassword({
            service: 'jwt',
          });
          const token = credentials.password;
          // console.log(
          //   'token extracted from keychain @NoticeBoardListScreen => @fetchNoticeBoards',
          //   `${token}`,
          // );
          const response = await fetch(
            `${API_URL}/api/noticeBoard/getAllConversation?nbid=${selectedGroup.noticeBoardId}&usrid=${currentUser}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
              },
            },
          );
          if (!response.ok) {
            // If the response is not successful, log the status and statusText
            console.error('HTTP error:', response.status, response.statusText);
            const errorText = await response.text(); // Attempt to read the response text for debugging
            console.error('Response text:', errorText);
            return;
          }
          const data = await response.json();
          // console.log(
          //   'Fetched Previous Conversations : hjkhhjjhjr898884hn : ',
          //   data,
          // );
          setPrevConversationRecords(data);
        } catch (error) {
          console.error(
            'Failed to fetch Notice Board Conversations @NoticeBoardListScreen.js => @fetchAllNoticeBoardConversationsById :',
            error,
          );
        }
      }
    };

    fetchAllNoticeBoardConversationsById();
  }, [selectedGroup]);

  useEffect(() => {
    if (prevConversationRecords && prevConversationRecords.length > 0) {
      const newMessages = prevConversationRecords.map(msg => ({
        sender: msg.sender,
        userName: msg.userName ? msg.userName : 'unknown',
        text: msg.message,
        timeStamp: msg.sentTime,
        type: 'received',
        referenceId: msg.referenceId,
        messageType: msg.type,
        messageId: msg.messageId,
        metaData: msg.metaData || {},
      }));
      console.log('new Messages 59903859035j390459835908903: ', newMessages);
      setMessageHistory(prevMsgs => [...prevMsgs, ...newMessages]);
    }
  }, [prevConversationRecords]);

  return (
    <View style={styles.container}>
      {selectedGroup && currentUser !== 'Anonymous' ? (
        <NoticeBoardScreen
          group={selectedGroup}
          userId={currentUser}
          userName={currentUserName}
          prevMessageHistory={messageHistory}
          navigation={navigation}
        />
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: '',
            }}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.reset({
                  index: 0, // Reset to the first screen
                  routes: [{name: 'HomeScreen'}], // The screen you want to navigate to
                });
              }}>
              <Icon name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.heading}>Notice Boards</Text>
          </View>

          <View>
            <Text style={styles.OverallMessageInfo}>
              <Text style={styles.totalMessages}>
                {noticeBoardData?.totalNewMessages}
              </Text>{' '}
              Messages from{' '}
              <Text style={styles.noticeBoardCount}>
                {
                  Object.keys(
                    noticeBoardData?.noticeBoardWiseNewMessageDetails || {},
                  ).length
                }
              </Text>{' '}
              Notice Boards.
            </Text>
          </View>
          <SafeAreaView>
            <FlatList
              data={groups}
              keyExtractor={item => item.noticeBoardId}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.groupItem}
                  onPress={() => {
                    selectGroup(item);
                    // resetUnseenCount(item.noticeBoardId);
                    updateNoticeBoardActivity(item.noticeBoardId);
                  }}>
                  <View style={styles.groupDetails}>
                    {/* <Image
                  source={{
                    uri:
                      item.avatarUrl ||
                      // 'https://i.ibb.co/5Bq6Y81/eclipse-Icon.png',
                      'https://i.ibb.co/MsX2vd0/8780740.jpg',
                  }}
                  style={styles.avatar}
                /> */}
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: CustomThemeColors.primary,
                        marginRight: 10,
                        borderRadius: 25,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '400',
                          fontSize: 25,
                        }}>
                        {item.noticeBoardName.charAt(0)}
                      </Text>
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.groupName}>
                        {item.noticeBoardName}
                      </Text>
                      <Text style={styles.lastMessage}>
                        {toTitleCase(item.userName)} :{' '}
                        {item.lastMessage || 'No latest messages'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.messageInfo}>
                    {item.unseenCount > 0 && (
                      <View style={styles.unseenBadge}>
                        <Text style={styles.unseenText}>
                          {item.unseenCount}
                        </Text>
                      </View>
                    )}

                    <Icon name="chevron-right" size={24} color="#999" />
                  </View>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginVertical: 10,
    marginHorizontal: 20,
    // letterSpacing: 1,
  },
  groupItem: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 150,
  },
  groupDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    minWidth: '70%',
    maxWidth: '70%',
    // backgroundColor: 'blue',
    justifyContent: 'center',
  },
  messageInfo: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unseenBadge: {
    minWidth: 25,
    backgroundColor: '#009E60',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 30,
  },
  unseenText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    top: 5,
    // backgroundColor: 'yellow',
    minWidth: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    fontSize: 14,
    maxHeight: 50,
    color: '#999',
  },
  OverallMessageInfo: {
    fontSize: 16, // Base font size
    color: '#333', // Modern, dark text color
    textAlign: 'center', // Center the text
    paddingVertical: 10, // Padding for top and bottom
  },
  totalMessages: {
    fontWeight: 'bold', // Bold for numbers
    color: 'red', // Attractive blue color for numbers
    fontSize: 18, // Slightly larger font for numbers
  },
  noticeBoardCount: {
    fontWeight: 'bold', // Bold for notice board count
    color: '#009E60', // Green for notice board count
    fontSize: 18, // Slightly larger font for numbers
  },
});

export default NoticeBoardListScreen;
