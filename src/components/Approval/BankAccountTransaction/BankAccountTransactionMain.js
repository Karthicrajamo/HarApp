import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import TitleBar from '../../common-utils/TitleBar';
import ScreenStyle from '../ApprovalComponents/ScreenStyle';
import {useNavigation} from '@react-navigation/native';
import InfoPairs from '../ApprovalComponents/InfoPairs';
import LoadingIndicator from '../../commonUtils/LoadingIndicator';
import {ScrollView} from 'react-native';
import CustomButton from '../../common-utils/CustomButton';
import commonStyles from '../ApprovalCommonStyles';
import {TextInput} from 'react-native';
import ApprovalTableComponent from '../ApprovalComponents/ApprovalTableComponent';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import {sharedData} from '../../Login/UserId';

export const BankAccountTransactionMain = ({route}) => {
  const {transName, transId, status, currentLevel} = route.params || {};
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [showInfoPairs, setShowInfoPairs] = useState(true);
  const [mainData, setMainData] = useState([]);

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

  useEffect(() => {
    fetchBankTransDetails();
  }, []);

  const fetchBankTransDetails = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;

      const response = await axios.get(
        // `${API_URL}/api/approval/payment/getApprovalDetails`,
        `${API_URL}/api/common/getApprovalDetails`,
        {
          params: {
            trans_id: transId,
            user_id: sharedData.userName,
            status: 'initiated',
            trans_name: transName,
          },
          headers: {
            'Content-Type': 'application/json',
            //   Authorization: `${token}`,
          },
        },
      );

      const approvalDetailsRaw = response.data?.Approval_Details;
      // console.log("approval Hole data::",response.data)
      if (approvalDetailsRaw) {
        const approvalDetails = JSON.parse(approvalDetailsRaw);
        const {transobj} = approvalDetails;

        if (typeof transobj === 'string') {
          const parsedTransObj = JSON.parse(transobj);

          const processData = data => {
            if (Array.isArray(data)) {
              return data.map(item => item);
            } else if (typeof data === 'object') {
              return Object.keys(data).map(key => data[key]);
            }
            return [];
          };

          //   const Main = processData(parsedTransObj[1]);
          const transactionDetails = processData(parsedTransObj[3]);
          const poDetails = processData(parsedTransObj[2][0]);
          console.log('Final Main bank trans::', parsedTransObj[1][0]);
          setMainData(parsedTransObj[1]);
          //   console.log('Final MainData bank trans::', Main);
          //   setTransDetails(transactionDetails);
          //   setTransValue(parsedTransObj);
          //   setPaymentId(Main[0]);
          //   setAccountNo(Main[8]);
          //   setRefNO(transactionDetails[3].length < 5 ? 'Cheque' : 'TT');

          //   console.log('Final Main::', Main);
          //   console.log('Final transactionDetails:', transactionDetails);
          //   console.log('Final poDetails:', parsedTransObj);
          //   console.log(
          //     'Final PARTY_CURRENCY:',
          //     parsedTransObj[1].PARTY_CURRENCY,
          //   );
          //   setCurrency(parsedTransObj[1].PARTY_CURRENCY);

          //   const formattedData = {
          //     'Payment date': DateFormatComma(Main[1]),
          //     [`Actual Amount (${parsedTransObj[1].PARTY_CURRENCY})`]: Main[18],
          //     [`TDS Amount (${tDSCurrency})`]: 0,
          //     ...(transactionDetails[3].length < 5
          //       ? {
          //           [`Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
          //             poDetails[2],
          //           'Cheque Ref No': transactionDetails[3],
          //           'Favor of': Main[3],
          //           'Cheque Date': DateFormatComma(Main[1]),
          //           // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
          //           [`Cheque Amt (${Main[9]})`]: Main[6],
          //         }
          //       : {
          //           [`Actual Amount-Slab Tax Amount (${parsedTransObj[1].PARTY_CURRENCY})`]:
          //             Main[18],
          //           'TT Ref No': transactionDetails[3],
          //           'Favor of': Main[3],
          //           'TT Date': DateFormatComma(Main[1]),
          //           // 'TT Amt (INR)': poDetails[2], // Uncomment if needed
          //           [`TT Amt (${Main[9]})`]: Main[6],
          //         }),
          //   };
          //   const numResult = await NumToWordsCon(Main[6], Main[9]);
          //   setNumToWords(numResult);

          //   setPairsData([formattedData]);
        }
      }
    } catch (error) {
      console.error('Error fetching approval details:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    setShowInfoPairs(!showInfoPairs); // Toggle visibility
  };

  return (
    <View style={ScreenStyle.container}>
      <TitleBar
        text={`${
          transName === 'ModPayment' ? 'Modify Payment' : transName
        } - ${3434}`}
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showCloseIcon={true}
        onClose={() => navigation.navigate('ApprovalMainScreen')}
      />
      {showInfoPairs ? (
        <>
          <InfoPairs
            data={tableData}
            imp={['Cheque Ref No', 'LC Ref No', 'Favor of']}
            // valueChanger={{[`TDS Amount (${tDSCurrency})`]: calculatedTDS}}
          />
          {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>}
        </>
      ) : (
        <>
          {isLoading ? <LoadingIndicator message="Please wait..." /> : <></>}
          <ScrollView style={ScreenStyle.scrollContainer}>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Bank Account <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'Andhra'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Opening Balance</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'1000'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>
                Minimum Balance Required
              </Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'1000'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Available Balance</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'14000'}
                editable={false} // Disables input
              />
            </View>
            <ApprovalTableComponent
              tableData={[mainData[0]]}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Debit Transaction'}
            />
            <ApprovalTableComponent
              tableData={[mainData[1]]}
              highlightVal={['lastMessageSentBy', 'userName']}
              heading={'Credit Transaction'}
            />
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Total Credit Amount</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'14000'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Total Debit Amount</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'14000'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>Net Debit/Credit</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'14000'}
                editable={false} // Disables input
              />
            </View>
            <View style={commonStyles.flexColumn}>
              <Text style={commonStyles.oneLineKey}>New Balance</Text>
              <TextInput
                style={[commonStyles.oneLineValue, commonStyles.input]}
                placeholder="" // Placeholder text
                value={'14000'}
                editable={false} // Disables input
              />
            </View>
          </ScrollView>
        </>
      )}
      <View style={ScreenStyle.lessMorebuttonContainer}>
        {/* <TouchableOpacity onPress={console.log("presssss3")} style={{width:'full'}}> */}
        <CustomButton
          color={'white'}
          fontColor={'black'}
          onPress={handleButtonClick} // Trigger handleButtonClick on press
        >
          Click here for {showInfoPairs ? 'more' : 'less'} info
        </CustomButton>
        {/* </TouchableOpacity> */}
        {/* <Button title="Click here for more info" onPress={handleButtonClick} /> */}
      </View>
    </View>
  );
};
