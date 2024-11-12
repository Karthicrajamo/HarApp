import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';

function CustomLabelValueComp({ KeyValuePairs, setModalVisible }) {
  const [key, setKey] = useState([]);
  const [combined, setCombined] = useState([]);

  useEffect(() => {
    if (KeyValuePairs) {
      setKey(KeyValuePairs);
    }
  }, [KeyValuePairs]);

  useEffect(() => {
    if (key.length > 0) {
      setCombined(Object.keys(key[0]));
    }
  }, [key]);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Row Details</Text>
        <ScrollView style={{ marginBottom: 20 }}>
          {combined.map((column, index) => (
            <View key={index} style={styles.modalRow}>
              <Text style={styles.modalLabel}>{column}</Text>
              <Text style={styles.modalValue}>{key.length > 0 ? key[0][column] : ''}</Text>
            </View>
          ))}
        </ScrollView>
        <Button
          style={{ marginTop: 40 }}
          title="Close"
          onPress={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
}

export default CustomLabelValueComp;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  modalValue: {
    marginLeft: 70,
    color: 'grey',
  },
});
