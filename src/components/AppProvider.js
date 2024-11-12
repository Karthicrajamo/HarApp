// import React, {createContext, useState} from 'react';

// export const AppContext = createContext();

// export const AppProvider = ({children}) => {
//   const [noticeBoardData, setNoticeBoardData] = useState(null);

//   return (
//     <AppContext.Provider value={{noticeBoardData, setNoticeBoardData}}>
//       {children}
//     </AppContext.Provider>
//   );
// };

import React, {createContext, useState} from 'react';

export const AppContext = createContext();

const initialData = {
  noticeBoardWiseNewMessageDetails: {
    null: {
      lastMessage: null,
      newMessagesCount: 0,
      lastMessageSentBy: null,
      userName: null,
    },
  },
  totalNewMessages: 0,
};
export const AppProvider = ({children}) => {
  const [noticeBoardData, setNoticeBoardData] = useState(initialData);

  return (
    <AppContext.Provider value={{noticeBoardData, setNoticeBoardData}}>
      {children}
    </AppContext.Provider>
  );
};
