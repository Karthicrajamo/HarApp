import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import TitleBar from '../common-utils/TitleBar';
import {CustomThemeColors} from '../CustomThemeColors';
import {API_URL} from '../ApiUrl';
import * as Keychain from 'react-native-keychain';
import pdfPreviewImage from '../../images/pdfimage.jpg';
import ApprovalDateFilter from './ApprovalDateFilter';
import SearchComponent from './SearchComp';
import commonStyles from './ApprovalCommonStyles';

const {width, height} = Dimensions.get('window');

const ApprovalScreen = () => {
  const navigation = useNavigation();
  const [approvalListData, setApprovalListData] = useState([]);
  const [filteredApprovalData, setFilteredApprovalData] = useState([]);
  const [tempFilteredApprovalData, setTempFilteredApprovalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date();

  // Calculate current date minus 30 days
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 31);

  // Format the dates as 'DD-MMM-YY'
  const formatDate = date => {
    const options = {year: '2-digit', month: 'short', day: '2-digit'};
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
      date,
    );

    // Replace any non-alphanumeric character (like commas) with a space
    return formattedDate.replace(/[^a-zA-Z0-9 ]+/g, '-');
  };

  const [formattedStartDate, setFormattedStartDate] = useState(
    formatDate(startDate),
  );
  const [formattedEndDate, setFormattedEndDate] = useState(
    formatDate(currentDate),
  );
  const [tempFormattedStartDate, setTempFormattedStartDate] = useState(
    formatDate(startDate),
  );
  const [tempFormattedEndDate, setTempFormattedEndDate] = useState(
    formatDate(currentDate),
  );
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useEffect(() => {
    console.log('approval formattedStartDate::', formattedStartDate);
    fetchApprovalList();
  }, [formattedStartDate]);

  useEffect(() => {
    console.log('approval formattedEndDate::', formattedEndDate);
    fetchApprovalList();
  }, [formattedEndDate]);

  // Fetch Approval List Data
  const fetchApprovalList = async () => {
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials?.password;

      if (!token) {
        console.error('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/approval/common/getApprovallist?user_id=admin&from_date=${formattedStartDate}&to_date=${formattedEndDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApprovalListData(data);
      console.log("data:::::",data)

      const filteredData = data.filter(item =>
        [
          // 'AddPaymentGroup',
          // 'ModPaymentGroup',
          // 'DelPaymentGroup',
          'AddPayment',
          'ModPayment',
          // 'AddDocumentApproval',
        ].includes(item.TRANS_NAME),
      );
      console.log('Ap filteredData:::', filteredData);
      setFilteredApprovalData(filteredData);
      setTempFilteredApprovalData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalList();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchApprovalList();
  };

  const handleHomeScreen = () => {
    navigation.navigate('HomeScreen');
  };

  const navigateToScreen = (transName, transId, status, identification,currentLevel) => {
    return () => {
      if (
        transName === 'AddPaymentGroup' ||
        transName === 'ModPaymentGroup' ||
        transName === 'DelPaymentGroup'
      ) {
        navigation.navigate('PaymentGroupsMain', {
          transName: transName,
          transId: transId,
          status: status,
        });
      } else if (transName === 'AddPayment' || 'ModPayment') {
        const firstWord = identification.trim().split(' ')[0];
        if (firstWord === 'Adv') {
          navigation.navigate('AdvancePayment', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel:currentLevel
          });
        } else if(firstWord === 'Bill'){
          navigation.navigate('BillsPayment', {
            transName: transName,
            transId: transId,
            status: status,
            currentLevel:currentLevel
          });
        }
      }
    };
    
  };

  const renderItem = ({item}) => {
    let formattedIdentification = item.IDENTIFICATION;

    // Debugging the original data
    console.log('Original IDENTIFICATION:', formattedIdentification);

    // Check if IDENTIFICATION matches the specific format
    if (
      formattedIdentification.startsWith('Payment Group Id=') &&
      formattedIdentification.includes('Payment Type=') &&
      formattedIdentification.includes('No of Payments=')
    ) {
      // Debugging condition match
      console.log('Formatting IDENTIFICATION:', formattedIdentification);

      // Reformat the string
      formattedIdentification = formattedIdentification
        .replace('Payment Group Id=', 'Group Id=') // Replace 'Payment Group Id=' with 'Group Id='
        .replace('Payment Type=', '') // Remove 'Payment Type='
        .replace('No of Payments=', '') // Remove 'No of Payments='
        .replace(/\s*,\s*/g, ', ') // Normalize spaces around commas
        .trim() // Trim any extra spaces
        .replace(/,([^,]*)$/, ' $1 Payments'); // Add 'Payments' to the last number

      // Debugging the transformed data
      console.log('Transformed IDENTIFICATION:', formattedIdentification);
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={navigateToScreen(
          item.TRANS_NAME,
          item.TRANS_ID,
          item.STATUS,
          item.IDENTIFICATION,
          item.CURRENT_LEVEL
        )}>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <View style={commonStyles.flexRowNoPadd}>
              <Text style={styles.transId}>{item.TRANS_ID} | </Text>
              <Text style={styles.transName}>{item.TRANS_NAME}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.paymentText}>{formattedIdentification}</Text>
            {/* Use formatted string */}
          </View>
          <View style={styles.row}>
            <Text style={[styles.paymentText, {marginRight: 3}]}>
              No of levels: {item.NO_OF_LEVELS}
            </Text>
            <Text style={styles.paymentText}>
              Current level: {item.CURRENT_LEVEL}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.date, {marginBottom: 10}]}>{item.ITIME}</Text>
          {(item.TRANS_NAME === 'AddPayment' || 'ModPayment') && (
            <Image
              source={pdfPreviewImage}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <TitleBar
        text="Approval"
        showMenuBar={true}
        onMenuPress={() => navigation.openDrawer()}
        showRefreshIcon={true}
        onRefreshPress={handleRefresh}
        showSearchIcon={true}
        onSearchPress={() => setSearchModalVisible(true)}
        showCloseIcon={true}
        onClose={handleHomeScreen}
      />
      {searchModalVisible && (
        <SearchComponent
          onClose={setSearchModalVisible}
          data={filteredApprovalData}
          setFilteredDataApproval={setTempFilteredApprovalData}
        />
      )}
      <View style={{alignItems: 'center'}}>
        <ApprovalDateFilter
          setFormattedStartDate={setFormattedStartDate}
          setFormattedEndDate={setFormattedEndDate}
        />
      </View>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={CustomThemeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={tempFilteredApprovalData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 3}}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    marginTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  transId: {
    fontWeight: 'bold',
    color: 'black',
  },
  transName: {
    fontWeight: 'bold',
    color: CustomThemeColors.primary,
  },
  date: {
    marginLeft: 'end',
    color: 'gray',
  },
  paymentText: {
    color: 'black',
  },
  image: {
    width: 30,
    height: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApprovalScreen;
