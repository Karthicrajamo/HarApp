import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet} from 'react-native';
import InfoPairs from '../ApprovalComponents/InfoPairs';
import ApprovalTableComponent from '../ApprovalComponents/ApprovalTableComponent';
import commonStyles from './../ApprovalCommonStyles';
import {TextInput} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Modal} from 'react-native';
import CustomModal from '../../common-utils/modal';
import TitleBar from '../../common-utils/TitleBar';
import {useNavigation} from '@react-navigation/native';


const {width} = Dimensions.get('window');
const isMobile = width < 768;

// Karthic Nov 25
export const AdvancePayment = () => {
    const navigation = useNavigation();
  const [pairsData, setPairsData] = useState([
    {id: 1, data: 'value', value: 'hi', d: 'djf'},
  ]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const tableData = [
    {
      lastMessage: 'Hello',
      lastMessageSentBy: 'admin',
      newMessagesCount: 0,
      userName: 'admifn',
      lastMegssage: 'Hellgo',
      lastMesfsageSentBy: 'adfmin',
      newMesfsagesCount: 0,
      usefrName: 'admin',
      lastMefssage: 'Hello',
      lastMessagefSentBy: 'admin',
      newMessafgesCount: 0,
      userNgame: 'admin',
    },
  ];
  const [showInfoPairs, setShowInfoPairs] = useState(true);

  const handleButtonClick = () => {
    setShowInfoPairs(!showInfoPairs); // Toggle visibility
  };

  return (
    <View style={styles.container}>
        <TitleBar
        text="Approval"
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        
        showCloseIcon={true}
        onClose={()=>navigation.navigate('HomeScreen')}
      />
      {/* Show InfoPairs or TableComponent based on the state */}
      {showInfoPairs ? (
        <ScrollView style={styles.scrollContainer}>
          <InfoPairs data={pairsData} />
        </ScrollView>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Date</Text>
              <Text style={commonStyles.oneLineValue}>20 Nov 2024</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Bill Amount%</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="2"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Apply</Text>
            </View>
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Bills Selected to Pay'}
            />
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Selected Taxes to Exclude'}
            />
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Application Slab Taxes(TK Currency)'}
            />
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Other changes & Adjustments(Without Tax)'}
            />
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Slab History</Text>
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>TDS Amount(TK)</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <TouchableOpacity
                style={commonStyles.enableButtonTextContainer}
                onPress={toggleModal}>
                <Text style={commonStyles.disableButtonText}>
                  Advance Adjustments
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Balance to Pay(Actual amt-Advance Adjusted)
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Actual Amount - Slab Tax Amount (INR)
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Actual Paid after adjustment
              </Text>

              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="0.0001"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Payment Mode</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="Cheque"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Voucher No</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="2465-2564-8794"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Remarks</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value=""
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.checkBoxContainer}>
              <Checkbox
                status="unchecked" // Set the checkbox to checked
                onPress={() => {}}
                disabled={true} // Disables the checkbox
              />
              <Text style={commonStyles.label}>A/C Payee</Text>
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Select Account</Text>
            </View>
            <ApprovalTableComponent
              tableData={tableData}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={''}
            />
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Fx Rate</Text>
            </View>
            {/* -------------------------- INR Pending_______________ */}
            <View style={[commonStyles.textCenter, commonStyles.flexRow]}>
              <Text style={commonStyles.heading}>1 INR =</Text>
              <TextInput
                style={[commonStyles.inputNoBox]}
                placeholder="" // Placeholder text
                value="19.5"
                editable={false} // Disables input
              />
              <Text style={commonStyles.heading}>INR</Text>
            </View>
            {/* ---------------------------------------------------- */}
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Actual Paid</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="19.5"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.disableButtonTextContainer}>
              <Text style={commonStyles.disableButtonText}>Calculate</Text>
            </View>

            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                Cheque No <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <Text style={commonStyles.oneLineValue}>5604</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>
                Favor of <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Cheque Date</Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.oneLineKey}>Cheque Amt (USD)</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value="19.5"
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Amount in words</Text>
              <Text style={commonStyles.oneLineValue}>sdfsfdf</Text>
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Narration</Text>
            </View>
          </ScrollView>


          <CustomModal
            isVisible={isModalVisible}
            onClose={toggleModal}
            title="Advance Adjustments">
            {/* Children Content */}
            <Text style={styles.modalBody}>Party Name: accessories</Text>
            <Text style={styles.modalBody}>Payment Amount: 1500 INR</Text>
            <View style={{height: 200}}>
              <ApprovalTableComponent
                tableData={tableData}
                heading={'Advance Details'}
              />
            </View>
          </CustomModal>
        </>
      )}

      {/* Button to toggle visibility */}
      <View style={styles.buttonContainer}>
        <Button title="Click here for more info" onPress={handleButtonClick} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    justifyContent: 'space-between', // Ensures button is at the bottom
  },
  scrollContainer: {
    flex: 1,
  },
  tableContainer: {
    width: '100%', // Ensure the container takes up full width
    paddingHorizontal: 10, // Optional: padding for aesthetics
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  helloText: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  openButton: {
    backgroundColor: '#3788E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#3788E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
