import React from 'react';
import {View, Text, Animated} from 'react-native';
import TitleBar from './TitleBar';
import TableComponent from '../DocumentApproval/DocumentApprovalTableComponent';
const filteredMainData = [
  {
    createdDate: '08-Jan-24',
    noOfPayments: 2,
    groupId: 240,
    type: 'Advance Payment',
    referenceNo: '-',
    totalValue: '1578.570',
    groupIssueStatus: 'Pending',
  },
  {
    referenceNo: '2404/001',
    noOfPayments: 2,
    type: 'Advance Payment',
    createdDate: '24-Apr-23',
    groupId: 236,
    groupIssueStatus: 'Pending',
    totalValue: '21439.090',
  },
  {
    createdDate: '08-Jan-24',
    noOfPayments: 2,
    groupId: 240,
    type: 'Advance Payment',
    referenceNo: '-',
    totalValue: '1578.570',
    groupIssueStatus: 'Pending',
  },
  {
    referenceNo: '2404/001',
    noOfPayments: 2,
    type: 'Advance Payment',
    createdDate: '24-Apr-23',
    groupId: 236,
    groupIssueStatus: 'Pending',
    totalValue: '21439.090',
  },
  {
    createdDate: '08-Jan-24',
    noOfPayments: 2,
    groupId: 240,
    type: 'Advance Payment',
    referenceNo: '-',
    totalValue: '1578.570',
    groupIssueStatus: 'Pending',
  },
  {
    referenceNo: '2404/001',
    noOfPayments: 2,
    type: 'Advance Payment',
    createdDate: '24-Apr-23',
    groupId: 236,
    groupIssueStatus: 'Pending',
    totalValue: '21439.090',
  },
  // ...more data here
];

const components = [
  {
    id: 1,
    type: 'table',
    x: 0,
    y: 0,
  },
  {
    id: 2,
    type: 'table',
    x: 0,
    y: 0,
  },
];
const App = ({navigation, openQrScanner, handleAssetMainScreen}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {components.map(({id, type, x, y}) => (
        <Animated.View
          key={id}
          style={{
            transform: [{translateX: x}, {translateY: y}],
            width:
              type === 'button' ? 100 : type === 'titleBar' ? '100%' : '100%',
            height: type === 'table' ? 300 : 50, // Adjust height for the TableComponent
            backgroundColor: type === 'button' ? 'blue' : 'gray',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            margin: 10,
          }}>
          {type === 'button' ? (
            <Text style={{color: 'white', fontWeight: 'bold'}}>Button</Text>
          ) : type === 'titleBar' ? (
            <TitleBar
              text="Asset Details"
              showMenuBar={true}
              onMenuPress={() => navigation.openDrawer()}
              showQrScannerIcon={true}
              onQrScannerPress={openQrScanner}
              showCloseIcon={true}
              onClose={handleAssetMainScreen}
            />
          ) : type === 'table' ? (
            <TableComponent
              initialData={filteredMainData} // Pass the filtered data or relevant data
              noModel={false}
              style={{width: '100%'}} // Make sure it fills the space
            />
          ) : (
            <Text style={{color: 'white', fontWeight: 'bold'}}>Drag Me!</Text>
          )}
        </Animated.View>
      ))}
    </View>
  );
};

export default App;
