import { useEffect, useState } from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const InfoPairs = ({ data, imp = [''], valueChanger = {} }) => {
  const [keys, setKeys] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      console.log('data::', data);

      // Extract keys dynamically when data updates
      const extractedKeys = Object.keys(data[0]);
      setKeys(extractedKeys);

      // Process data to handle valueChanger overrides
      const updatedData = data.map(item => {
        const updatedItem = { ...item };
        Object.keys(valueChanger).forEach(key => {
          if (key in updatedItem) {
            updatedItem[key] = valueChanger[key]; // Update value based on valueChanger
          }
        });
        return updatedItem;
      });

      setProcessedData(updatedData);
    }
  }, [data, JSON.stringify(valueChanger)]); // Avoid reference equality issues

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        {processedData.map((item, index) => (
          <View style={styles.keyValueRow} key={index}>
            {keys.map(key => (
              <View style={styles.keyValueItem} key={key}>
                <Text style={styles.keyText}>
                  {key}
                  {imp.includes(key) && <Text style={styles.asterisk}> *</Text>}
                </Text>
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
    justifyContent: 'flex-start',
    marginBottom: isMobile ? 5 : 14,
  },
  keyText: {
    fontSize: isMobile ? 12 : 16,
    fontWeight: '500',
    color: 'black',
    flex: 1,
    textAlign: 'left',
  },
  asterisk: {
    fontSize: isMobile ? 12 : 16,
    color: 'red',
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: isMobile ? 12 : 16,
    color: '#3788E5',
    flex: 1,
    textAlign: 'left',
  },
});

export default InfoPairs;
