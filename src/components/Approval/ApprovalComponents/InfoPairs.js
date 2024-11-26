// import React, { useState, useEffect } from 'react';
import { useEffect, useState } from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const InfoPairs = ({data}) => {
  const [mapData, setMapData] = useState(data);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (mapData.length > 0) {
      // Extract keys from the first object in mapData
      const extractedKeys = Object.keys(mapData[0]);
      setKeys(extractedKeys);
    }
  }, [mapData]);

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        {mapData.map((item, index) => (
          <View style={styles.keyValueRow} key={index}>
            {keys.map((key) => (
              <View style={styles.keyValueItem} key={key}>
                <Text style={styles.keyText}>{key.toUpperCase()}:</Text>
                <Text style={styles.valueText}>{item[key]}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  middleContainer: {
    marginHorizontal: 5,
    borderColor: '#3788E5',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  keyValueRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingVertical: 10,
  },
  keyValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  keyText: {
    fontSize: isMobile ? 12 : 14,
    fontWeight: '500',
    color: '#555',
    flex: 1,
    textAlign: 'left',
    color:'black',

  },
  valueText: {
    fontSize: isMobile ? 12 : 14,
    color: '#3788E5',
    flex: 1,
    textAlign: 'right',
  },
});

export default InfoPairs;
