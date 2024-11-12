import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const CustomApiModal = ({
  visible, // controls modal visibility
  apiUrl, // API endpoint to fetch data from
  httpMethod = 'GET', // default HTTP method
  requiredFields = [], // fields to display from API response
  onClose, // function to close the modal
  otherParams = {}, // other params if needed
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const options = {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          // Add additional headers here if necessary
        },
        ...(httpMethod === 'POST' && {body: JSON.stringify(otherParams)}), // for POST requests
      };

      const response = await fetch(apiUrl, options);
      const result = await response.json();

      // Check for response structure and map required fields
      const filteredData = requiredFields.length
        ? result.map(item => {
            const filteredItem = {};
            requiredFields.forEach(field => {
              if (item[field]) {
                filteredItem[field] = item[field];
              }
            });
            return filteredItem;
          })
        : result;

      setData(filteredData);
    } catch (err) {
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.listItem}>
                  {Object.keys(item).map(key => (
                    <Text key={key} style={styles.text}>
                      {`${key}: ${item[key]}`}
                    </Text>
                  ))}
                </View>
              )}
            />
          )}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default CustomApiModal;
