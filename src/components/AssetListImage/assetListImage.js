import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useNavigation} from '@react-navigation/native';
import TitleBar from '../common-utils/TitleBar';

const {width} = Dimensions.get('window');

const AssetListImage = ({assetImages, ImageGelleryOnClose}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const navigation = useNavigation();

  const onClose = () => {
    ImageGelleryOnClose(false);
  };

  const handleMenuPress = () => {
    // Check if navigation is correctly working
    navigation.openDrawer();
    console.log('Menu button pressed');
  };

  const openQrScanner = () => {
    navigation.navigate('QrScanner');
  };

  const renderItem = ({item, index}) => (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
        <Text style={{textAlign: 'center'}}>{item.imageTitle}</Text>
        <Image
          source={{uri: `data:image/jpeg;base64,${item.image}`}}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );

  const formattedImages = assetImages.map(image => ({
    url: `data:image/jpeg;base64,${image.image}`,
    title: image.imageTitle,
  }));

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={() => onClose()}
      style={{zIndex: 0}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{marginTop: 5, alignItems: 'center'}}>
            <TitleBar
              text="Asset Images"
              showMenuBar={true}
              onMenuPress={handleMenuPress}
              showQrScannerIcon={true}
              onQrScannerPress={openQrScanner}
              showCloseIcon={true}
              onClose={onClose}
            />
          </View>
          <FlatList
            data={assetImages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.flatlistContentContainer}
          />
          {selectedImageIndex !== null && (
            <Modal
              visible={true}
              onRequestClose={() => setSelectedImageIndex(null)}
              transparent>
              <ImageViewer
                imageUrls={formattedImages}
                index={selectedImageIndex}
                onCancel={() => setSelectedImageIndex(null)}
                enableSwipeDown={true}
                renderHeader={() => (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedImageIndex(null)}>
                    <Text style={styles.closeText}>X</Text>
                  </TouchableOpacity>
                )}
              />
            </Modal>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  flatlistContentContainer: {
    padding: 5,
  },
  image: {
    flex: 1,
    width: width < 600 ? 100 : 250,
    height: 100,
    resizeMode: 'contain',
    margin: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    right: '45%',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 20,
  },
  closeText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default AssetListImage;
