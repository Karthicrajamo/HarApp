import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Alert,
  Button,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './assetListMainScreenStyles';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import AssetListSort from '../AssetListSort/assetListSort';
import AssetListFilter from '../AssetListFilter/assetListFilter';

import * as Keychain from 'react-native-keychain';
import {API_URL} from '../ApiUrl';
import {CustomThemeColors} from '../CustomThemeColors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {horizontalScale, moderateScale, verticalScale} from '../themes/Metrics';
import {Chip} from 'react-native-paper';
// import AssetListFilter from '../AssetListFilter/assetListFilter';
import RequestCameraPermission from '../common-utils/RequestCameraPermission';
import QrScanner from '../common-utils/QrScanner';
import CustomMarkerImage from '../assets/scanner-target-frame.png';
import {AsyncLocalStorage} from 'async_hooks';
import MarqueeText from '../common-utils/MarqueeText';
import LoadingIndicator from '../commonUtils/LoadingIndicator';
import SearchModal from '../common-utils/SearchModal';
import TitleBar from '../common-utils/TitleBar';

import {Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const AssetListMainScreen = () => {
  const navigation = useNavigation(); //For Nagivation
  const [isLoading, setIsLoading] = useState(false);

  const [iconValue, setIconValue] = useState(0); // 0 for ascending, 1 for descending
  const [sortOption, setSortOption] = useState('');

  const handlePress = () => {
    setIconValue(prevValue => (prevValue === 0 ? 1 : 0)); // Toggle between 0 and 1
    const temp = searchData.length > 0 ? searchData : filteredData;
    console.log('search data len:::' + searchData.length);
    console.log('search data le::' + reverseData);
    console.log('iconValue:::' + iconValue);

    if (searchData.length > 0) {
      setSearchData(reverseData);
    } else setFilteredData(reverseData);
    setReverseData(temp);
  };

  //Close Button Code
  const handleHomeScreen = async () => {
    navigation.navigate('HomeScreen');
  };

  const handleAssetDetailsScreen = item => {
    navigation.navigate('AssetListDetails', {assetItem: item});
  };

  //Sort Button Code
  const [showSortPopup, setShowSortPopup] = useState(false); // State to control visibility of the sort popup

  const handleSortButtonPress = () => {
    setShowSortPopup(true); // Show the sort popup when the "Sort" button is pressed
  };

  // const [sortBy, setSortBy] = useState("assetCode");
  // const [previouslySelectedSort, setPreviouslySelectedSort] = useState([])

  // const handleSortChange = (selectedSortOption) => {
  //   setShowSortPopup(!setShowSortPopup)
  //   setSortBy(selectedSortOption); // Update sortBy state based on user selection
  //   fetchData();
  //   console.log("89475894h selectedSortOption", selectedSortOption);

  const [sortBy, setSortBy] = useState('assetCode');
  const handleSortChange = option => {
    setSortBy(option); // Update sortBy state based on user selection
    // fetchData();
    console.log('iconValue:::' + iconValue);
    setIconValue(0);
  };
  //Filter Button Code
  const [showSortPopup1, setShowSortPopup1] = useState(false); // State to control visibility of the sort popup
  const handleFilterButtonPress = () => {
    setShowSortPopup1(true); // Show the sort popup when the "Sort" button is pressed
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [depModalVisible, setDepModalVisible] = useState(false);
  // const handleCloseModal = () => {
  //   setModalVisible(false);
  //   setDepModalVisible(false);
  // };

  const openQrScanner = () => {
    navigation.navigate('QrScanner');
  };
  //LOADING FILTERS
  useEffect(() => {
    // Fetch departments, locations, and statuses when component mounts
    setCurrentPage(1);
    fetchDepartments();
    fetchLocations();
    fetchStatuses();
    fetchData();
  }, [currentPage]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDepCategories, setSelectedDepCategories] = useState([]);
  const [selectedStatusCategories, setSelectedStatusCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleLocSelectAllChange = () => {
    if (selectAll) {
      // If "Select All" is currently checked, uncheck all locations
      setTempSelectedLocCategories([]);
    } else {
      // If "Select All" is not checked, check all locations
      setTempSelectedLocCategories(locations.map(loc => loc.locationName)); // Ensure `locations` is the full list of location names
    }
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  const handleDepSelectAllChange = () => {
    if (selectAll) {
      // If "Select All" is currently checked, uncheck all departments
      setTempSelectedDepCategories([]);
    } else {
      // If "Select All" is not checked, check all departments
      setTempSelectedDepCategories(departments); // Assuming `departments` is the list of all department categories
    }
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // If "Select All" is currently checked, uncheck everything
      setTempSelectedStatusCategories([]);
    } else {
      // If "Select All" is not checked, check everything
      setTempSelectedStatusCategories(status); // Assuming `status` is the list of all status categories
    }
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  const handleCheckboxChange = category => {
    let updatedCategories;

    if (tempSelectedLocCategories.includes(category)) {
      // Remove category if already selected
      updatedCategories = tempSelectedLocCategories.filter(
        item => item !== category,
      );
    } else {
      // Add category if not already selected
      updatedCategories = [...tempSelectedLocCategories, category];
    }

    setTempSelectedLocCategories(updatedCategories);

    // Update "Select All" state based on whether all items are selected
    if (updatedCategories.length === locations.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleDepCheckboxChange = department => {
    let updatedCategories;

    if (tempSelectedDepCategories.includes(department)) {
      // Remove department if already selected
      updatedCategories = tempSelectedDepCategories.filter(
        item => item !== department,
      );
    } else {
      // Add department if not already selected
      updatedCategories = [...tempSelectedDepCategories, department];
    }

    setTempSelectedDepCategories(updatedCategories);

    // Update "Select All" state based on whether all items are selected
    if (updatedCategories.length === departments.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  // const handleStatusCheckboxChange = category => {
  //   if (selectedStatusCategories.includes(category)) {
  //     // If the category is already selected and the checkbox is unchecked, remove it from selectedStatusCategories
  //     const updatedCategories = selectedStatusCategories.filter(
  //       item => item !== category,
  //     );
  //     setSelectedStatusCategories(updatedCategories);

  //     // Update selectedStatus accordingly
  //     const updatedStatus = selectedStatus.filter(
  //       status => status !== category,
  //     );
  //     // setSelectedStatus(updatedStatus);
  //     setSelectedStatus(updatedCategories);

  //     console.log('Unchecked,status updatedCategories:', updatedCategories);
  //     console.log('Unchecked,status updatedStatus:', updatedStatus);
  //   } else {
  //     // If the checkbox is checked, add the category to selectedStatusCategories
  //     const updatedCategories = [...selectedStatusCategories, category];
  //     setSelectedStatusCategories(updatedCategories);
  //     setSelectedStatus(updatedCategories); // Append the new status to the list

  //     console.log('Checked,status updatedCategories:', updatedCategories);
  //     console.log('Checked,status updatedStatus:', selectedStatus);
  //   }
  // };
  const handleStatusCheckboxChange = category => {
    let updatedCategories;

    if (tempSelectedStatusCategories.includes(category)) {
      // Remove category if already selected
      updatedCategories = tempSelectedStatusCategories.filter(
        item => item !== category,
      );
    } else {
      // Add category if not already selected
      updatedCategories = [...tempSelectedStatusCategories, category];
    }

    setTempSelectedStatusCategories(updatedCategories);

    // Update "Select All" state based on whether all items are selected
    if (updatedCategories.length === status.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  // useEffect(() => {
  //   setSelectedLocation(selectedCategories);
  // }, [selectedLocation]);

  //department, locations, statuses use states:
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [criteriaResponse, setCriteriaResponse] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reverseData, setReverseData] = useState([]);

  const [subFilteredData, setSubFilteredData] = useState([]);
  useEffect(() => {
    // if (subFilteredData >= 0) {
    console.log(
      'asset main : 876689090hjhjjhj87 subFilteredData : ',
      subFilteredData,
    );

    fetchData();
    // setFilteredData([]);
    // setFilteredData(subFilteredData);

    setShowSortPopup1(false);
    setCurrentPage(1);
    // criteriaResponse.totalPages = 1;
    // }
  }, [subFilteredData]);

  //prop 1
  const filterOptionsAPI = '/api/assetList/getSubFilterOptions';

  //prop 2
  const filterCriteriaAPI = '/api/assetList/subFilterCriteria';

  // const [pageableData, setPageableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [sizePerPage, setSizePerPage] = useState(5);
  const [previouslySelectedSort, setPreviouslySelectedSort] = useState([]);
  // const [searchData, setSearchData] = useState([]);
  const [tempSelectedStatusCategories, setTempSelectedStatusCategories] =
    useState([...selectedStatusCategories]);
  const [tempSelectedDepCategories, setTempSelectedDepCategories] = useState([
    ...selectedDepCategories,
  ]);
  const [tempSelectedLocCategories, setTempSelectedLocCategories] = useState([
    ...selectedCategories,
  ]);
  const [isSearchData, setIsSearchData] = useState(0);

  const [displayData, setDisplayData] = useState(filteredData);
  const itemsPerPage = 10;
  const [selectedItemsHistory, setSelectedItemsHistory] = useState({
    assetClassifications: [],
    assetTypes: [],
    subDepartments: [],
  });
  useEffect(() => {
    // Fetch data whenever selectedStatusCategories or currentPage changes
    fetchData();
  }, [
    // selectedStatusCategories,
    // selectedDepCategories,
    // selectedCategories,
    // currentPage,
    sortBy,
    selectedDepCategories,
    selectedStatusCategories,
    selectedCategories,
  ]);
  // useEffect(() => {
  //   fetchData();
  // }, [sortBy]);

  // useEffect(() => {
  //   // console.log('searchData' + searchData);
  //   // if(searchData.length>0){
  //   //   setFilteredData(null)
  //   // }
  //   // console.log("selectedItemsHistory+++++++"+selectedItemsHistory.assetClassifications)
  //   // console.log("selectedItemsHistory+++++++"+selectedItemsHistory.includes(assetClassifications))
  // }, [
  //   filteredData,
  //   searchData,
  //   handleSearchLoad,
  // ]);

  useEffect(() => {
    console.log('display Loggg');
  }, [displayData]);

  useEffect(() => {
    const data = searchData.length > 0 ? searchData : filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    console.log('display Lg crnt page');
    setDisplayData(data.slice(startIndex, endIndex));
  }, [searchData, filteredData]);

  const nextPage = () => {
    const data = searchData.length > 0 ? searchData : filteredData;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
      console.log('display Lg Nxt page');
      setCurrentPage(currentPage + 1);
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayData(data.slice(startIndex, endIndex));
    }
  };

  const prevPage = () => {
    const data = searchData.length > 0 ? searchData : filteredData;
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const startIndex = (currentPage - 2) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayData(data.slice(startIndex, endIndex));
    }
  };

  const jumpToFirstPage = () => {
    const data = searchData.length > 0 ? searchData : filteredData;

    const totalPages = Math.ceil(data.length / itemsPerPage);

    setCurrentPage(1);

    const startIndex = 0;
    const endIndex = startIndex + itemsPerPage;

    setDisplayData(data.slice(startIndex, endIndex));
  };

  const jumpToLastPage = () => {
    const data = searchData.length > 0 ? searchData : filteredData;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    console.log('totalPages___' + totalPages);
    setCurrentPage(totalPages);
    const startIndex = (totalPages - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayData(data.slice(startIndex, endIndex));
  };
  // DEPARTMENT API REQUEST -----------------------------------------------------------------------

  const fetchDepartments = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log(' token with berarer for department: ', `${token}`);
      // Replace with your API endpoint to fetch departments
      const response = await fetch(`${API_URL}/api/department/allDepartments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(
        'response fetch department : ===============>>>>>>>>>> ',
        data,
      );
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // LOCATION API REQUEST -----------------------------------------------------------------------
  const fetchLocations = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      if (!credentials) {
        throw new Error('No credentials found');
      }

      const token = credentials.password;
      console.log('Token with bearer:', `${token}`);

      // Fetching locations from the API
      const response = await fetch(`${API_URL}/api/assetList/allLocations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Use JSON.stringify to log the entire response data
      console.log('Response locations:', JSON.stringify(data));

      // Setting the locations data
      setLocations(data);
    } catch (error) {
      // Improved error logging
      console.error('Error fetching locations:', error);
    }
  };

  // STATUS API REQUEST -----------------------------------------------------------------------
  const fetchStatuses = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token with berarer statussss: ', `${token}`);
      // Replace with your API endpoint to fetch locations
      const response = await fetch(
        `${API_URL}/api/assetList/distinctStatuses`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('status data' + data);
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const [oneTimeRefresh, setOneTimeRefresh] = useState(0);

  // FILTERED DATA
  const fetchData = async () => {
    try {
      console.log('sortBy:', sortBy);
      console.log('sortBy depchat:', selectedDepCategories);
      console.log('sortBy depchat2:', selectedDepartment);
      if (oneTimeRefresh === 0) {
        setIsLoading(true);
      }
      setOneTimeRefresh(1);

      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      // console.log('Token with bearer:', token);

      // Fetch data from the API
      const response = await fetch(`${API_URL}/api/assetList/mainFilters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          deptName: '',
          locationName: '',
          status: '',
          subDeptName: '',
          classificationName: '',
          type: '',
          sortBy: sortBy,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('All data fetched:', data.length);

      // Filter the data based on selected locations, departments, status, and classification names
      const filteredData = data.filter(item => {
        const locationMatch =
          selectedLocation.length === 0 ||
          selectedLocation.includes(item.locationName);
        const departmentMatch =
          selectedDepartment.length === 0 ||
          selectedDepartment.includes(item.deptName);
        const statusMatch =
          selectedStatus.length === 0 || selectedStatus.includes(item.status);
        const classificationMatch =
          selectedItemsHistory.assetClassifications.length === 0 ||
          selectedItemsHistory.assetClassifications.includes(
            item.classificationName,
          );
        const typeMatch =
          selectedItemsHistory.assetTypes.length === 0 ||
          selectedItemsHistory.assetTypes.includes(item.type);
        const subDeptNameMatch =
          selectedItemsHistory.subDepartments.length === 0 ||
          selectedItemsHistory.subDepartments.includes(item.subDeptName);

        return (
          locationMatch &&
          departmentMatch &&
          statusMatch &&
          classificationMatch &&
          typeMatch &&
          subDeptNameMatch
        );
      });

      // Determine if filters are applied
      const filtersApplied =
        selectedLocation.length > 0 ||
        selectedDepartment.length > 0 ||
        selectedStatus.length > 0 ||
        selectedItemsHistory.assetClassifications.length > 0 ||
        selectedItemsHistory.assetTypes.length > 0 ||
        selectedItemsHistory.subDepartments.length > 0;

      // Set isSearchData based on whether any filters are applied
      // setIsSearchData(filtersApplied ? 1 : 0);

      // If no filters are applied, reset the searchData
      if (filtersApplied) {
        console.log('searchData clear::::');
        setSearchData([]);
      }

      console.log('fetchdata for nxt pages::::');
      // setCriteriaResponse(filteredData);
      // setPageableData(filteredData.pageable || {}); // Handle pageable if needed
      // if (iconValue == 0) {
      setFilteredData(filteredData);
      // } // setFilteredData((prevData) => Array(500).fill(prevData).flat());
      const reversedData = [...filteredData].reverse();
      setReverseData(reversedData);

      // console.log('Filtered data:', filteredData.slice(0, 9));
    } catch (error) {
      console.error('Error fetching or filtering data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toTitleCase = str => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  };
  //------------------------------------------------------------------------------------------------------------

  // Search Modal
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const openSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);

  const handleSearchLoad = data => {
    console.log('searchLOad+' + data);
    setCurrentPage(1);
    setSearchData([]);
    setSearchData(data);
    setSelectedDepartment('');
    setSelectedDepCategories('');
    setSelectedCategories('');
    setSelectedLocation('');
    setSelectedStatus('');
    setSelectedStatusCategories('');
    setFilteredData([]);
    const reversedData = [...data].reverse(); // Create a shallow copy and reverse it
    // console.log('Reversed Data:', reversedData); // Log the reversed data for debugging
    setReverseData(reversedData);
    // setFilteredData(data);
  };

  const handleRefresh = () => {
    // Perform refresh actions here
    // setRefreshing(true); // Show the refresh component
    setTimeout(() => {
      // setRefreshing(false); // Hide the refresh component after some delay or when refresh is complete
      navigation.replace('AssetListMainScreen');
      // fetchData();
    }, 1000); // Simulating a delay here, replace with actual refresh logic
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        {/* HEADER */}
        {/* {loading ? ( */}
        {isLoading ? (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 44,
            }}>
            <Skeleton
              LinearGradientComponent={LinearGradient}
              animation="wave"
              width={'92%'}
              height={40}
              style={{borderRadius: 15}}
            />
          </View>
        ) : (
          <TitleBar
            text="Asset Details"
            showMenuBar={true}
            onMenuPress={() => navigation.openDrawer()}
            showSearchIcon={true}
            onSearchPress={openSearchModal}
            showQrScannerIcon={true}
            onQrScannerPress={openQrScanner}
            showRefreshIcon={true}
            onRefreshPress={handleRefresh}
            showCloseIcon={true}
            onClose={handleHomeScreen}
          />
        )}

        {/* Search Modal */}

        <SearchModal
          visible={searchModalVisible}
          onClose={closeSearchModal}
          onSearch={handleSearchLoad}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              borderRadius: 20,
              width: '95%',
              overflow: 'hidden',
              marginTop: 5,
              marginBottom: 5,
              flexDirection: 'row',
              borderWidth: 1,
            }}>
            {/* Left side (blue) */}
            <View
              style={{
                flex: 1,
                backgroundColor: CustomThemeColors.primary,
                padding: 10,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                Department
              </Text>
            </View>

            {/* Right side (white) */}
            <TouchableOpacity
              style={{flex: 1, backgroundColor: 'white', padding: 10}}
              onPress={() => setDepModalVisible(true)}>
              <Text
                style={{textAlign: 'right', color: 'black'}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {' '}
                {selectedDepCategories.length > 0
                  ? selectedDepCategories.join(', ').toUpperCase()
                  : 'ALL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              borderRadius: 20,
              width: '95%',
              overflow: 'hidden',
              marginTop: 5,
              marginBottom: 5,
              flexDirection: 'row',
              borderWidth: 1,
            }}>
            {/* Left side (blue) */}
            <View
              style={{
                flex: 1,
                backgroundColor: CustomThemeColors.primary,
                padding: 10,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                Location
              </Text>
            </View>

            {/* Right side (white) */}
            <TouchableOpacity
              style={{flex: 1, backgroundColor: 'white', padding: 10}}
              onPress={() => setModalVisible(true)}>
              <Text
                style={{textAlign: 'right', color: 'black'}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {' '}
                {selectedCategories.length > 0
                  ? selectedCategories.join(', ').toUpperCase()
                  : 'ALL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              borderRadius: 20,
              width: '95%',
              overflow: 'hidden',
              marginTop: 5,
              marginBottom: 5,
              flexDirection: 'row',
              borderWidth: 1,
            }}>
            {/* Left side (blue) */}
            <View
              style={{
                flex: 1,
                backgroundColor: CustomThemeColors.primary,
                padding: 10,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                Status
              </Text>
            </View>

            {/* Right side (white) */}
            <TouchableOpacity
              style={{flex: 1, backgroundColor: 'white', padding: 10}}
              onPress={() => setStatusModalVisible(true)}>
              <Text
                style={{textAlign: 'right', color: 'black'}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {selectedStatusCategories.length > 0
                  ? selectedStatusCategories.join(', ').toUpperCase()
                  : 'ALL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Department Filter */}
        <Modal
          visible={depModalVisible}
          animationType="slide"
          onRequestClose={() => {
            setTempSelectedDepCategories([...selectedDepCategories]); // Revert changes
            setDepModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setTempSelectedDepCategories([...selectedDepCategories]); // Revert changes
                setDepModalVisible(false);
              }}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* "Select All" Checkbox */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={selectAll}
                onValueChange={handleDepSelectAllChange} // Function to handle "Select All" for departments
              />
              <Text style={styles.checkboxLabel}>SELECT ALL</Text>
            </View>

            {/* Individual Department Checkboxes */}
            {departments.map((department, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <CheckBox
                  value={tempSelectedDepCategories.includes(department)}
                  onValueChange={
                    () => handleDepCheckboxChange(department) // Function to handle individual checkbox change
                  }
                />
                <Text style={styles.checkboxLabel}>
                  {department.toUpperCase()}
                </Text>
              </View>
            ))}

            {/* Apply Filter Button */}
            <Button
              title="Apply Filter"
              onPress={() => {
                setSelectedDepCategories(tempSelectedDepCategories);
                setSelectedDepartment(tempSelectedDepCategories);
                setCurrentPage(1);
                // fetchData();
                setDepModalVisible(false);
              }}
            />
          </View>
        </Modal>

        {/* Location Filter */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => {
            setTempSelectedLocCategories([...selectedCategories]); // Revert changes
            setModalVisible(false); // Close modal on hardware back button
          }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setTempSelectedLocCategories([...selectedCategories]); // Revert changes
                setModalVisible(false);
              }}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* "SELECT ALL" Checkbox */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={selectAll}
                onValueChange={handleLocSelectAllChange} // Function to handle "SELECT ALL" for locations
              />
              <Text style={styles.checkboxLabel}>SELECT ALL</Text>
            </View>

            {/* Individual Location Checkboxes */}
            {locations.map((location, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <CheckBox
                  value={tempSelectedLocCategories.includes(
                    location.locationName,
                  )}
                  onValueChange={
                    () => handleCheckboxChange(location.locationName) // Function to handle individual checkbox change
                  }
                />
                <Text style={styles.checkboxLabel}>
                  {location.locationName.toUpperCase()}
                </Text>
              </View>
            ))}

            {/* Apply Filter Button */}
            <Button
              title="Apply Filter"
              onPress={() => {
                setSelectedCategories(tempSelectedLocCategories);
                setSelectedLocation(tempSelectedLocCategories);
                setCurrentPage(1);
                // fetchData();
                setModalVisible(false);
              }}
            />
          </View>
        </Modal>

        <Modal
          visible={statusModalVisible}
          animationType="slide"
          onRequestClose={() => {
            setTempSelectedStatusCategories([...selectedStatusCategories]); // Revert changes
            setStatusModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setTempSelectedStatusCategories([...selectedStatusCategories]); // Revert changes
                setStatusModalVisible(false);
              }}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* "SELECT ALL" Checkbox */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={selectAll}
                onValueChange={handleSelectAllChange}
              />
              <Text style={styles.checkboxLabel}>SELECT ALL</Text>
            </View>

            {/* Individual Status Checkboxes */}
            {status.map((statusItem, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <CheckBox
                  value={tempSelectedStatusCategories.includes(statusItem)}
                  onValueChange={() => handleStatusCheckboxChange(statusItem)}
                />
                <Text style={styles.checkboxLabel}>
                  {statusItem.toUpperCase()}
                </Text>
              </View>
            ))}

            {/* Apply Filter Button */}
            <Button
              title="Apply Filter"
              onPress={() => {
                setSelectedStatusCategories(tempSelectedStatusCategories);
                setSelectedStatus(tempSelectedStatusCategories);
                setCurrentPage(1);
                // fetchData();
                setStatusModalVisible(false);
              }}
            />
          </View>
        </Modal>

        {/* SORT AND FILTER SECTION */}
        <View style={styles.sortAndFilterContainer}>
          <View style={styles.sortElementContainer}>
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginLeft: 5,
                }}>
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  width={'95%'}
                  height={30}
                  style={{borderRadius: 15}}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleSortButtonPress}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: CustomThemeColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    padding: 5,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: CustomThemeColors.primary,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Sort
                    </Text>
                  </View>
                  <View style={{marginLeft: 10}}>
                    <MaterialIcons
                      name="sort"
                      size={25}
                      style={{color: CustomThemeColors.primary}}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterElementContainer}>
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginRight: 5,
                }}>
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  width={'95%'}
                  height={30}
                  style={{borderRadius: 15}}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleFilterButtonPress}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: CustomThemeColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    padding: 5,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: CustomThemeColors.primary,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Filter
                    </Text>
                  </View>
                  <View style={{marginLeft: 10}}>
                    <MaterialIcons
                      name="filter-alt"
                      size={25}
                      color={CustomThemeColors.primary}
                    />
                  </View>
                </View>
                {searchData.length < 1 && (
                  <View style={{marginLeft: 10}}>
                    <TouchableOpacity onPress={handlePress}>
                      <MaterialIcons
                        name={
                          iconValue === 0 ? 'arrow-upward' : 'arrow-downward'
                        }
                        size={30}
                        style={{color: CustomThemeColors.primary}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* {showSortPopup && <AssetListSort onClose={handleCloseSortPopup} />} */}

          {showSortPopup && (
            // <AssetListSort onClose={() => setShowSortPopup(false)} />
            <AssetListSort
              onClose={() => {
                setShowSortPopup(false);
              }}
              setSortBy={selectedSortOption => {
                handleSortChange(selectedSortOption);
              }}
              setPreviouslySelectedSort={setPreviouslySelectedSort}
              previousSort={previouslySelectedSort}
            />
          )}
          {/* <AssetListFilter visible={modalVisible} onClose={handleCloseModal} /> */}
          {showSortPopup1 && (
            <AssetListFilter
              onClose={() => setShowSortPopup1(false)}
              setSubFilteredData={setSubFilteredData}
              filterOptionsAPI={filterOptionsAPI}
              filterCriteriaAPI={filterCriteriaAPI}
              setSelectedItemsHistory={setSelectedItemsHistory}
              selectedItemsHistory={selectedItemsHistory}
            />
          )}
        </View>

        {/* LIST OF DETAILS */}
        {isLoading ? (
          <>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'95%'}
                height={90}
                style={{borderRadius: 15}}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'95%'}
                height={90}
                style={{borderRadius: 15}}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'95%'}
                height={90}
                style={{borderRadius: 15}}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'95%'}
                height={90}
                style={{borderRadius: 15}}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={'95%'}
                height={90}
                style={{borderRadius: 15}}
              />
            </View>
          </>
        ) : (
          <View
            style={{
              padding: 5,
              backgroundColor: CustomThemeColors.header,
              flex: 1,
            }}>
            <ScrollView style={styles.scrollView}>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <View key={index} style={styles.flatListContainer}>
                    <View style={styles.flatListItemContainer}>
                      <TouchableWithoutFeedback
                        onPress={() => handleAssetDetailsScreen(item)}>
                        <View style={styles.flatListItemSubContainer}>
                          <View style={styles.innerContainer}>
                            <View style={styles.headerContainer}>
                              <View
                                style={[
                                  styles.tag,
                                  {
                                    backgroundColor: CustomThemeColors.primary,
                                    maxWidth: '70%',
                                  },
                                ]}>
                                <Text style={styles.tagText}>
                                  {item.assetCode}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.tag,
                                  {
                                    backgroundColor: CustomThemeColors.primary,
                                    marginLeft: 5,
                                    maxWidth: '26%',
                                  },
                                ]}>
                                <Text
                                  style={styles.tagText}
                                  numberOfLines={1}
                                  ellipsizeMode="tail">
                                  {item.type}
                                </Text>
                              </View>

                              <View style={{flex: 1}} />
                              <View
                                style={[
                                  styles.tag,
                                  {
                                    backgroundColor: 'green',
                                    marginLeft: 5,
                                    maxWidth: '30%',
                                    alignSelf: 'flex-end',
                                  },
                                ]}>
                                <Text style={styles.tagText}>
                                  {item.ownerShip}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.rowContainer}>
                              <Text
                                style={[
                                  styles.categoryText,
                                  {
                                    maxWidth: '40%',
                                  },
                                ]}>
                                {toTitleCase(item.classificationName)}
                              </Text>
                              <Text style={styles.separator}> | </Text>
                              <Text
                                style={[
                                  styles.classificationText,
                                  {
                                    maxWidth: '60%',
                                  },
                                ]}>
                                {toTitleCase(item.custSpec)}
                              </Text>
                            </View>

                            <View style={styles.rowContainer}>
                              <Text style={styles.boldText}>Departments:</Text>
                              <Text
                                style={[
                                  styles.departmentText,
                                  {
                                    maxWidth: '65%',
                                  },
                                ]}>
                                {toTitleCase(item.deptName)}
                              </Text>
                              <Text style={styles.separator}> | </Text>
                              <Text
                                style={[
                                  styles.subDepartmentText,
                                  {
                                    maxWidth: '35%',
                                  },
                                ]}>
                                {toTitleCase(item.subDeptName)}
                              </Text>
                            </View>

                            <View style={styles.locationContainer}>
                              <MaterialIcons
                                name="place"
                                size={14}
                                color={CustomThemeColors.primary}
                                style={styles.locationIcon}
                              />
                              <Text
                                style={[
                                  styles.locationText,
                                  {
                                    maxWidth: '34%',
                                  },
                                ]}>
                                {toTitleCase(item.locationName)}
                              </Text>
                              <Text style={styles.separator}> | </Text>
                              <Text
                                style={[
                                  styles.locationText,
                                  {
                                    maxWidth: '22%',
                                  },
                                ]}>
                                {toTitleCase(item.subLocation3)}
                              </Text>
                              <Text style={styles.separator}> | </Text>
                              <Text
                                style={[
                                  styles.locationText,
                                  {
                                    maxWidth: '22%',
                                  },
                                ]}>
                                {toTitleCase(item.subLocation2)}
                              </Text>
                              <Text style={styles.separator}> | </Text>
                              <Text
                                style={[
                                  styles.locationText,
                                  {
                                    maxWidth: '22%',
                                  },
                                ]}>
                                {toTitleCase(item.subLocation1)}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.iconContainer}>
                            <MaterialIcons
                              name="arrow-forward-ios"
                              size={20}
                              color={CustomThemeColors.primary}
                              onPress={() => handleAssetDetailsScreen(item)}
                            />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text>No Data Available</Text>
                </View>
              )}

              {isLoading && (
                <View style={styles.skeletonContainer}>
                  <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation="wave"
                    width={'95%'}
                    height={10}
                    style={{borderRadius: 15}}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* FOOTER */}
        {!isLoading && (
          <View
            style={{
              backgroundColor: CustomThemeColors.whiteBackgroundColor,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              padding: 5,
              height: 'auto',
              flex: 0.06,
            }}>
            <View style={{flexDirection: 'row', width: '80%'}}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: CustomThemeColors.whiteBackgroundColor,
                }}
                onPress={jumpToFirstPage}>
                <View>
                  <MaterialIcons
                    name="keyboard-double-arrow-left"
                    size={25}
                    color={CustomThemeColors.primary}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: CustomThemeColors.whiteBackgroundColor,
                }}
                onPress={prevPage}>
                <View>
                  <MaterialIcons
                    name="keyboard-arrow-left"
                    size={25}
                    color={CustomThemeColors.primary}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: CustomThemeColors.whiteBackgroundColor,
                }}>
                <View>
                  <Text
                    style={{
                      color: CustomThemeColors.primary,
                      fontWeight: 'bold',
                      fontSize: 18,
                      marginHorizontal: 10,
                    }}>
                    {currentPage} /{' '}
                    {Math.ceil(
                      (searchData.length > 0 ? searchData : filteredData)
                        .length / itemsPerPage,
                    )}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: CustomThemeColors.whiteBackgroundColor,
                }}
                onPress={nextPage}>
                <View>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={25}
                    color={CustomThemeColors.primary}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: CustomThemeColors.whiteBackgroundColor,
                }}
                onPress={jumpToLastPage}>
                <View>
                  <MaterialIcons
                    name="keyboard-double-arrow-right"
                    size={25}
                    color={CustomThemeColors.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isLoading && <LoadingIndicator message="Please wait..." />}
        {/* {refreshing && <LoadingIndicator message="Refreshing..."/>} */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AssetListMainScreen;
