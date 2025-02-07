import React from 'react';
import { Provider } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens that need Redux
import ApprovalMainScreen from './Approval/ApprovalMainScreen';
import {AdvancePayment} from './Approval/Payment/AdvancePayment';
import {BillsPayment} from './Approval/Payment/BillsPayment';
import store from './Approval/store';

const Stack = createStackNavigator();

const ReduxNavigator = () => (
  <Provider store={store}>
    <Stack.Navigator>
      <Stack.Screen name="ApprovalMainScreen" component={ApprovalMainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdvancePayment" component={AdvancePayment} options={{ headerShown: false }} />
      <Stack.Screen name="BillsPayment" component={BillsPayment} options={{ headerShown: false }} />
    </Stack.Navigator>
  </Provider>
);

export default ReduxNavigator;
