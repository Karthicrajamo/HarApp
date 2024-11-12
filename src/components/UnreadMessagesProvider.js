// import React, {createContext, useState, useEffect, useContext} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Create context
// const UnreadMessagesContext = createContext();

// // Context Provider Component
// export const UnreadMessagesProvider = ({children}) => {
//   const [unreadMessages, setUnreadMessages] = useState({});

//   // Load unread messages count from AsyncStorage
//   const loadUnreadMessages = async () => {
//     try {
//       const storedData = await AsyncStorage.getItem('NoticeBaordData');
//       const parsedData = storedData ? JSON.parse(storedData) : {};
//       setUnreadMessages(parsedData);
//     } catch (error) {
//       console.error('Error loading unread messages:', error);
//     }
//   };

//   useEffect(() => {
//     loadUnreadMessages();
//   }, []);

//   return (
//     <UnreadMessagesContext.Provider
//       value={{unreadMessages, loadUnreadMessages}}>
//       {children}
//     </UnreadMessagesContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const useUnreadMessages = () => useContext(UnreadMessagesContext);
