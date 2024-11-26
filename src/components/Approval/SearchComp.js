import React, { useState } from 'react';
import { View, TextInput, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing the close icon


const SearchComponent = ({ data, visible, onClose, setFilteredDataApproval }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = data.filter(item => {
      return (
        item.IDENTIFICATION.toLowerCase().includes(text.toLowerCase()) ||
        item.INITIATOR.toLowerCase().includes(text.toLowerCase()) ||
        item.STATUS.toLowerCase().includes(text.toLowerCase()) ||
        item.TRANS_NAME.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFilteredData(filtered);
    setFilteredDataApproval(filtered); // Update the parent component with filtered data
  };

  return (
    <View style={styles.container}>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
      />
      
      {/* {searchText.length > 0 && ( */}
        <TouchableOpacity style={styles.clearButton} onPress={()=>onClose(false)}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      {/* )} */}
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
  backgroundColor: 'white',
  marginBottom:10
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
},
searchInput: {
  flex: 1,
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  paddingLeft: 10,
  borderRadius: 5,
},
clearButton: {
  position: 'absolute',
  right: 10,
  padding: 5,
},
});

export default SearchComponent;
