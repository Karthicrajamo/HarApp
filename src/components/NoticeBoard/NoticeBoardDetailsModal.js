import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {CustomThemeColors} from '../CustomThemeColors';

const NoticeBoardDetailsModal = ({
  label,
  userId,
  visible, // controls modal visibility
  apiUrl, // API endpoint to fetch data from
  httpMethod = 'GET', // default HTTP method
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
        },
        ...(httpMethod === 'POST' && {body: JSON.stringify(otherParams)}), // for POST requests
      };

      const response = await fetch(apiUrl, options);
      const result = await response.json();
      setData(result);
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
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>Members</Text>
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
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.ownUsername}>
                      {item.userName === userId ? ' (You)' : null}
                    </Text>
                  </View>

                  <Text style={styles.role}>{item.role}</Text>
                  {item.isAdmin === 'Y' && (
                    <Text style={styles.adminText}>Admin</Text>
                  )}
                </View>
              )}
            />
          )}
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginVertical: 20,
              backgroundColor: CustomThemeColors.primary,
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Close
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    fontWeight: '700',
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownUsername: {
    fontSize: 18,
    fontWeight: '400',
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  adminText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default NoticeBoardDetailsModal;
