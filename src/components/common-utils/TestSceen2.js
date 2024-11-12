import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Button, Text} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {API_URL} from '../ApiUrl';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#888"
      />
    </View>
  );
};

const App = () => {
  const [placeholder, setPlaceholder] = useState('Enter text here');
  const [borderColor, setBorderColor] = useState('#ccc');
  const [bgColor, setBgColor] = useState('#fff');
  const [fontSize, setFontSize] = useState(16);

  // Array of predefined colors
  const colors = ['#fff', '#ff0', '#f00', '#0f0', '#00f', '#0ff'];
  const [colorIndex, setColorIndex] = useState(0);
  const customMasterId = 364;
  // const customNodeName = 'Finished Yarn Master';

  const changeBackgroundColor = () => {
    setColorIndex(prevIndex => (prevIndex + 1) % colors.length); // Cycle through colors
    setBgColor(colors[colorIndex]); // Update background color
  };
  const oncheck = () => {
    // console.log('rmiData');
    // rmimethod();
    testing();
  };

  const onpresscustomdata = () => {
    customizationData();
  };
  const onpresscustomnodeid = () => {
    customizationCustomNodeId();
  };

  const [text, setText] = useState('');
  // console.log('text>>>' + text);
  useEffect(() => {
    submitText();
  });
  const [textData, setSelectedextData] = useState([]);

  useEffect(() => {
    // rmimethod();
  });

  const [RmiData, setSelectedextRmiData] = useState([]);
  // console.log('rmiData' + RmiData);

  const [customdata, setSelectedcustomdata] = useState([]);
  console.log('customdata>>>' + customdata);
  const [customNodeId, setSelectedcustomNodeId] = useState([]);
  console.log('customNodeId>>>' + customNodeId);

  //test try start
  const submitText = async () => {
    try {
      // const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      // const token = credentials.password;
      // console.log('token with berarer issue Model data : ', `${token}`);

      const response = await fetch(`${API_URL}/api/common/insertText}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `${token}`,
        },
        body: JSON.stringify({text}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('response of text : ===============>>>>>>>>>> ', data);
      Alert.alert('Success', 'Text submitted successfully!');
      setSelectedextData(data);
      console.log('SelectedTextData-=-=-=-=-=-=---=-', data);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit text.');
      console.error('Error fetching table data:', error);
    }
  };
  //test try end
  const testing = () => {
    console.log('testing');
  };

  // RMI Method API
  // const rmimethod = async () => {
  //   try {
  //     const credentials = await Keychain.getGenericPassword({service: 'jwt'});
  //     const token = credentials.password;
  //     console.log('token with berarer issue Model data : ', `${token}`);

  //     const response = await fetch(`${API_URL}/api/test/rmiMethodInvokeTest}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('response of rmidata : ===============>>>>>>>>>> ', data);
  //     // Alert.alert('Success', 'Text submitted successfully!');
  //     setSelectedextRmiData(data);
  //     console.log('SelectedRmiData-=-=-=-=-=-=---=-', data);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to submit text.');
  //     console.error('Error fetching table data:', error);
  //   }
  // };
  //END
  const rmimethod = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log(' token with berarer for department: ', `${token}`);

      const response = await fetch(`${API_URL}/api/test/rmiMethod`, {
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
      console.log('response of rmidata:', data);
      setSelectedextRmiData(data);
      console.log('SelectedRmiData:', data);
    } catch (error) {
      // Alert.alert('Error', 'Failed to submit text.');
      console.error('Error fetching  data:', error);
    }
  };

  //Customization Label and Field Data
  const customizationData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log(' token for customization: ', `${token}`);

      const response = await fetch(
        `${API_URL}/api/customization/getLabelAndFieldDetails?customMasterId=${customMasterId}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Http Error Status: ${response.status}`);
      }

      const customData = await response.json();
      console.log(
        'customdata api>>>' +
          JSON.stringify(customData.fieldDetailsForAllComponentSaving),
      );

      console.log(
        'customdata api 0 0>>>' +
          JSON.stringify(customData.fieldDetailsForAllComponentSaving[0][3]),
      );
      setSelectedcustomdata(
        JSON.stringify(customData.fieldDetailsForAllComponentSaving[0][3]),
      );
    } catch (error) {
      console.error('Error fetching  data:', error);
    }
  };
  // ---------------------------------------------------------------------------------------------------------
  //Customization Custom Node Id Data
  const customizationCustomNodeId = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'jwt'});
      const token = credentials.password;
      console.log(' token for customizationCustomNodeId: ', `${token}`);

      const response = await fetch(
        `${API_URL}/api/customization/getCustomNodeId`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Http Error Status: ${response.status}`);
      }

      const customNodeId = await response.json();
      console.log('customNodeNmae api>>>' + JSON.stringify(customNodeId));
      setSelectedcustomNodeId(JSON.stringify(customNodeId));
    } catch (error) {
      console.error('Error fetching customNodeNmae data:', error);
    }
  };
  // ---------------------------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customize your Text Field:</Text>
      <View style={styles.customizationPanel}>
        <Button
          title="Click to get Customization Data"
          onPress={onpresscustomdata}
        />
        <Button
          title="Click to get Customization Node Id"
          onPress={onpresscustomnodeid}
        />
        <Button
          title="Change Background Color"
          onPress={changeBackgroundColor}
          // omPress={oncheck}
        />
        <Button
          title="Increase Font Size"
          onPress={() => setFontSize(fontSize + 2)}
        />

        <Button title="Check Rmi Method" onPress={oncheck} />
      </View>
      {customdata === '"UTextField"' && (
        <CustomTextInput
          placeholder={placeholder}
          borderColor={borderColor}
          bgColor={bgColor}
          fontSize={fontSize}
          value={text}
          onChangeText={setText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  customizationPanel: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default App;
