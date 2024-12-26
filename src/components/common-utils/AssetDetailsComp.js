import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import TitleBar from './TitleBar';
import {CustomThemeColors} from '../CustomThemeColors';
import Icon from 'react-native-vector-icons/Ionicons'; // You can choose any icon set
import {API_URL} from '../ApiUrl';

const {width} = Dimensions.get('window');

function AssetDetailsComp(props) {
  const [isActiveFoot, setIsActiveFoot] = useState(1);

  const handleClose = () => {
    navigation.navigate('AssetListMainScreen');
  };

  const handleMenuPress = () => {
    console.log('Menu');
  };

  const handleQrScannerPress = () => {
    console.log('handleQrScannerPress');
  };

  return (
    <>
      <View style={styles.container}>
        <TitleBar
          text="AssetDetailsComp"
          showMenuBar={true}
          onMenuPress={handleMenuPress}
          showQrScannerIcon={true}
          onQrScannerPress={handleQrScannerPress}
          showCloseIcon={true}
          onClose={handleClose}
        />
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgCont}
            source={require('../../images/Laptop2.jpeg')}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headText}>
            <View
              style={{
                // backgroundColor: 'rgba(55, 136, 229, 0.21)',
                paddingHorizontal: 5,
                paddingVertical: 3,
                borderRadius: 10,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Icon
                name="pricetag"
                size={15}
                color={CustomThemeColors.primary}
              />
              <Text
                style={{color: CustomThemeColors.primary, fontWeight: 'bold'}}>
                JJFT-7460-48751512
              </Text>
            </View>
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Type:</Text> CWP_LG_Machine
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Class: </Text>Wires
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Asset No: </Text>454
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Location: </Text>Tamilnadu
          </Text>
          <Text style={styles.bodyText}>
            Coimbatore | Coimbatore | Coimbatore
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Spec: </Text>spec2
          </Text>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerHead}>
          <TouchableOpacity onPress={() => setIsActiveFoot(1)}>
            <View
              style={[
                styles.footerTab,
                isActiveFoot === 1 && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.headFootText,
                  isActiveFoot === 1 && styles.activeText,
                ]}>
                Asset Details
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsActiveFoot(2)}>
            <View
              style={[
                styles.footerTab,
                isActiveFoot === 2 && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.headFootText,
                  isActiveFoot === 2 && styles.activeText,
                ]}>
                Additional Details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', paddingLeft: 10}}>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
        </View>
        {/* {isActiveFoot === 1 && <View>
          <View style={styles.footDetails}>
            <View style={{marginLeft:10}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View style={{justifyContent:'center',flex:1, alignItems:'baseline',marginLeft:'30%'}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
          <View style={styles.footDetails}>
            <View style={{marginLeft:10}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View style={{justifyContent:'center',flex:1, alignItems:'baseline',marginLeft:'30%'}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
        </View>} 
        {isActiveFoot === 2 && <View>
          <View style={styles.footDetails}>
            <View style={{marginLeft:10}}>
              <Text style={styles.footDetailsHeadText}>Department2</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View style={{justifyContent:'center',flex:1, alignItems:'baseline',marginLeft:'30%'}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
          <View style={styles.footDetails}>
            <View style={{marginLeft:10}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
            <View style={{justifyContent:'center',flex:1, alignItems:'baseline',marginLeft:'30%'}}>
              <Text style={styles.footDetailsHeadText}>Department</Text>
              <Text style={styles.footDetailsBodyText}>Testing</Text>
            </View>
          </View>
        </View>} */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1.2,
    alignItems: 'center',
    marginBottom: 10,
  },
  imgContainer: {
    marginVertical: width < 600 ? 10 : 30,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
    width: '95%',
    alignItems: 'center',
    padding: 10,
  },
  imgCont: {
    borderRadius: 10,
    objectFit: 'contain',
    height: 150,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  headText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    color: 'black',
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
  footerContainer: {
    // flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 15,
    width: '95%',
    height: '47%',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  footerHead: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerTab: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  headFootText: {
    textAlign: 'center',
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
    width: '100%',
  },
  activeText: {
    color: CustomThemeColors.primary,
    fontSize: 16,
    marginBottom: 0,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: CustomThemeColors.primary,
  },
  footDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footDetailsBodyText: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footDetailsHeadText: {
    color: 'grey',
    fontWeight: 'light',
    marginBottom: 2,
  },
});

export default AssetDetailsComp;

const AssetListDetails = () => {
  const [activeTab, setActiveTab] = useState('Asset'); //For Tab change

  //Getting datas from main screen
  const route = useRoute();
  const {assetItem} = route.params;
  console.log('Selected Asset Item:', assetItem);

  //Getting datas for image
  const [isFullScreen, setIsFullScreen] = useState(false); //Image Full Screen
  const imageRefs = useRef();
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
  const images = [
    // require('../../images/Laptop2.jpeg'),
    // require('../../images/Laptop.jpeg'),
    // require('../../images/Laptop2.jpeg'),
  ];
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)}>
      <Image source={item} style={styles.image} />
    </TouchableOpacity>
  );

  // For Nagivaion
  const navigation = useNavigation(); //For Nagivation

  const handleAssetMainScreen = async () => {
    navigation.navigate('AssetListMainScreen');
  };
  const toggleFullScreen = () => {
    // setIsFullScreen(!isFullScreen);
    navigation.navigate('AssetListImage');
  };

  // Fetch data for sub details
  const [subDetails, setSubDetails] = useState([]);
  const [assetId, setAssetId] = useState(assetItem ? assetItem.assetId : null);
  console.log('subDetails>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', subDetails);

  useEffect(() => {
    fetchSubDetails(assetItem.assetId);
  }, [assetItem.assetId]);
  console.log('assetId>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', assetId);

  const fetchSubDetails = async assetId => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token', token);

      const response = await fetch(
        `${API_URL}/api/assetList/assetSubDetailsValue?assetId=${assetId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      console.log('response', response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        'response of subdetails data : ===============>>>>>>>>>> ',
        data,
      );
      setSubDetails(data);
    } catch (error) {
      console.error('Error fetching subdetails:', error);
    }
  };
  // ----------------------------------------------------------------------------------------------------

  // Fetch data for sub details
  const [subDetailsLabel, setSubDetailsLabel] = useState([]);
  const [type, setType] = useState(assetItem ? assetItem.type : null);
  console.log('subDetailsLabel>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', subDetailsLabel);

  useEffect(() => {
    fetchSubDetailsLabel(assetItem.type);
  }, [assetItem.type]);
  console.log('type>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', type);
  // console.log(
  //   'query>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
  //   `http://192.168.0.169:8084/api/assetList/assetSubDetailsLabel?type=${type}`,
  // );

  const fetchSubDetailsLabel = async type => {
    console.log('hii>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log('token', token);

      const response = await fetch(
        `${API_URL}/api/assetList/assetSubDetailsLabel?type=${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      console.log('response', response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        'response of subdetailslabel data : ===============>>>>>>>>>> ',
        data,
      );
      setSubDetailsLabel(data);
    } catch (error) {
      console.error('Error fetching subdetailslabel:', error);
    }
  };
  // ----------------------------------------------------------------------------------------------------

  return (
    <View style={{width: '98%', height: '99%', borderWidth: 1, left: 5}}>
      {/* <Sector 1> */}
      <View>
        <ImageBackground
          source={require('../../images/harness_background.png')}
          style={{width: '100%', height: 60}}>
          <Text style={styles.sector1text}>Asset Details</Text>

          <View>
            <TouchableOpacity
              style={styles.menubutton}
              onPress={() => navigation.openDrawer()}>
              <MaterialIcons name="menu" style={styles.menuicon} />
            </TouchableOpacity>
          </View>

          <MaterialIcons name="crop-free" style={styles.scanicon} />

          <View>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={handleAssetMainScreen}>
              <MaterialIcons name="close" style={styles.closeicon} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* <Sector 2> */}
      <ImageBackground
        source={require('../../images/harness_background.png')}
        style={styles.assetdetailstab}>
        <Text style={styles.assetdetailstext}>{assetItem.assetCode}</Text>
      </ImageBackground>

      {/* <Sector 3> */}

      <View style={styles.sector3}>
        <View style={styles.row}>
          <Text style={styles.type}>Type :</Text>
          <Text style={styles.value}>{assetItem.type}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.class}>Class :</Text>
          <Text style={styles.value}>{assetItem.classificationName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.assetno}>Asset No :</Text>
          <Text style={styles.value}>{assetItem.assetId}</Text>
        </View>

        <TouchableOpacity
          style={styles.imagecontainer}
          onPress={toggleFullScreen}>
          <Image
            style={styles.image}
            source={require('../../images/Laptop2.jpeg')}
          />
        </TouchableOpacity>

        {/* <View style={styles.imagecontainer }>
      <FlatList
        data={[
          require('../../images/Laptop2.jpeg'),
          require('../../images/Laptop.jpeg'),
          require('../../images/Laptop2.jpeg'),
        ]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
         />
     </View> */}

        {/* <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Example: Display images in multiple columns
        contentContainerStyle={styles.flatlistContentContainer}
      /> */}

        {/* Modal to display large image */}
        {/* <Modal visible={selectedImage !== null} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setSelectedImage(null)}>
            <Image source={selectedImage} style={styles.modalImage} />
          </TouchableOpacity>
        </View>
      </Modal>
     </View>  */}

        <View style={styles.sectionrow}>
          <MaterialIcons name="location-on" style={styles.locationicon} />
          <Text style={styles.sector}>{assetItem.locationName}</Text>
          <Text style={[styles.status, {color: 'green'}]}>
            {assetItem.status}
          </Text>
          <Text style={[styles.ownership, {color: 'blue'}]}>
            {assetItem.ownerShip}
          </Text>
        </View>

        <View style={styles.locationrow}>
          <Text style={styles.loc1}>{assetItem.subLocation}</Text>
          <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
            {' '}
            |{' '}
          </Text>
          <Text style={styles.loc3}>{assetItem.subLocation}</Text>
          <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
            {' '}
            |{' '}
          </Text>
          <Text style={styles.loc5}>{assetItem.subLocation}</Text>
        </View>

        <ScrollView>
          <View style={styles.row}>
            <Text style={styles.type}>Spec :</Text>
            <Text style={[styles.specvalue, {color: 'blue'}]}>
              {assetItem.custSpec}
            </Text>
          </View>
        </ScrollView>
      </View>
      {/* )}
     /> */}
      {/* <Sector 4> */}

      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Asset' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Asset')}>
            <Text style={styles.tabText}>Asset Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Additional' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Additional')}>
            <Text style={styles.tabText}>Additional Details</Text>
          </TouchableOpacity>
        </View>

        {/* Asset details Tab */}

        {activeTab === 'Asset' && (
          <ScrollView style={styles.tabContent}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Department</Text>
                <Text style={styles.values}>{assetItem.deptName}</Text>

                <Text style={styles.label}>Acquisation Date</Text>
                <Text style={styles.values}>{assetItem.acquisitionDate}</Text>

                <Text style={styles.label}>Supplier Name</Text>
                <Text style={styles.values}>{assetItem.supplierName}</Text>

                <Text style={styles.label}>Depreciated %</Text>
                <Text style={styles.values}>{assetItem.purchaseVal} %</Text>

                <Text style={styles.label}>Salvage Value</Text>
                <Text style={styles.values}>{assetItem.salvageVal}</Text>

                <Text style={styles.label}> </Text>
                <Text style={styles.values}> </Text>

                <Text style={styles.label}> </Text>
                <Text style={styles.values}> </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Sub-Department</Text>
                <Text style={styles.values}>{assetItem.subDeptName}</Text>

                <Text style={styles.label}>Life Time</Text>
                <Text style={styles.values}>
                  {assetItem.lifetimeOfAssetValue} - Years
                </Text>

                <Text style={styles.label}>Purchase Value</Text>
                <Text style={styles.values}>{assetItem.purchaseVal}</Text>

                <Text style={styles.label}>Depreciated Value</Text>
                <Text style={styles.values}>{assetItem.purchaseVal}</Text>

                <Text style={styles.label}>Book Value</Text>
                <Text style={styles.values}>{assetItem.bookValue}</Text>

                <Text style={styles.label}> </Text>
                <Text style={styles.values}> </Text>

                <Text style={styles.label}> </Text>
                <Text style={styles.values}> </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleAssetMainScreen}
                style={styles.backButton}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAssetMainScreen}
                style={styles.scanNextButton}>
                <Text style={styles.buttonText}>Scan Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Additional details Tab */}

        {activeTab === 'Additional' && (
          <View>
            <ScrollView style={styles.tabContent}>
              <View style={styles.row}>
                <View style={styles.column}>
                  {/* Asset Fields (1-3) */}
                  <Text style={styles.label}>Clour</Text>
                  <Text style={styles.values}>{subDetails.assetField1}</Text>

                  <Text style={styles.label}>Size</Text>
                  <Text style={styles.values}>{subDetails.assetField2}</Text>

                  <Text style={styles.label}>Height</Text>
                  <Text style={[styles.values, styles.borderbottom]}>
                    {subDetails.assetField3}
                  </Text>
                  {/* Flexi Fields (1-3,4) */}
                  <Text style={styles.label}>Serial No</Text>
                  <Text style={styles.values}>{subDetails.flexiField1}</Text>

                  <Text style={styles.label}>Model No</Text>
                  <Text style={styles.values}>{subDetails.flexiField2}</Text>

                  <Text style={styles.label}>MFD Date</Text>
                  <Text style={styles.values}>{subDetails.flexiField3}</Text>

                  {/* <Text style={styles.label}>Flexi Field 7 Data</Text> */}
                  {/* <Text style={styles.values}>{subDetails.flexiField7}</Text>  */}
                </View>
                <View style={styles.column}>
                  {/* Asset Fields (4-6) */}
                  <Text style={styles.label}>Weight</Text>
                  <Text style={styles.values}>{subDetails.assetField4}</Text>

                  <Text style={styles.label}>Model</Text>
                  <Text style={styles.values}>{subDetails.assetField5}</Text>

                  <Text style={styles.label}>Type</Text>
                  <Text style={[styles.values, styles.borderbottom]}>
                    {subDetails.assetField6}
                  </Text>
                  {/* Flexi Fields (4-6,7) */}
                  <Text style={styles.label}>Company Name</Text>
                  <Text style={styles.values}>{subDetails.flexiField4}</Text>

                  <Text style={styles.label}>Display</Text>
                  <Text style={styles.values}>{subDetails.flexiField5}</Text>

                  <Text style={styles.label}>Operating Type</Text>
                  <Text style={styles.values}>{subDetails.flexiField6}</Text>

                  {/* <Text style={styles.label}>Flexi Field 8 Data</Text> */}
                  {/* <Text style={styles.values}>{subDetails.flexiField}</Text> */}
                </View>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={handleAssetMainScreen}
                  style={styles.backButton}>
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAssetMainScreen}
                  style={styles.scanNextButton}>
                  <Text style={styles.buttonText}>Scan Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* <Over All View> */}
    </View>
  );
};
