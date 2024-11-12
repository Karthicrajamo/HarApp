import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Picker,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import TableComponent from '../DocumentApproval/DocumentApprovalTableComponent';
import {ScrollView} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const DraggableComponent = ({pan, onPanResponderMove, id, style, children}) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        const xPosition = gestureState.moveX;
        const yPosition = gestureState.moveY;

        Animated.event([null, {dx: pan.x, dy: pan.y}], {
          useNativeDriver: false,
        })(e, gestureState);

        onPanResponderMove(id, gestureState.moveX, gestureState.moveY);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset(); // Accumulate the pan offset so that the correct position is maintained
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({x: 0, y: 0}); // Reset the animated value for the next movement
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[{transform: [{translateX: pan.x}, {translateY: pan.y}]}, style]}
      {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};

const App = () => {
  const [draggables, setDraggables] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [checkBoxCount, setCheckBoxCount] = useState(3); // Initial checkbox count

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleComponentSelect = componentType => {
    if (componentType === 'JCheckBox' && checkBoxCount <= 0) {
      console.log('Max checkbox limit reached');
      return;
    }

    setDropdownVisible(false);
    setDraggables(prevState => [
      ...prevState,
      {
        id: prevState.length + 1,
        pan: new Animated.ValueXY(),
        componentType,
      },
    ]);

    if (componentType === 'JCheckBox') {
      setCheckBoxCount(prevCount => prevCount - 1);
    }
  };

  const updateCoordinates = (id, x, y) => {
    setDraggables(prevState =>
      prevState.map(item => (item.id === id ? {...item, x, y} : item)),
    );
  };

  const saveToFile = async () => {
    const componentData = draggables.map(({id, pan, componentType}) => {
      // Get the latest translation values for x and y
      const xValue = pan.x._value;
      const yValue = pan.y._value;

      return {
        id,
        type: componentType,
        x: xValue, // Ensure you are getting the right value
        y: yValue, // Ensure you are getting the right value
      };
    });

    console.log('data:', JSON.stringify(componentData, null, 2));
  };

  const renderComponent = (componentType, label) => {
    let component;
    switch (componentType) {
      case 'UTextField':
        component = <TextInput style={styles.input} placeholder="Enter text" />;
        break;
      case 'JCheckBox':
        component = (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox value={false} />
            <Text>Checkbox</Text>
          </View>
        );
        break;
      case 'UComboBox':
      case 'JComboBox':
        component = (
          <Picker style={styles.picker}>
            <Picker.Item label="Option 1" value="option1" />
            <Picker.Item label="Option 2" value="option2" />
          </Picker>
        );
        break;
      case 'SortSelectTable':
        component = <TableComponent initialData={filteredMainData} />;
        break;
      default:
        component = <Text>Unsupported Component</Text>;
    }

    return (
      <View>
        <Text style={{color: 'black'}}>{label}</Text>
        {component}
      </View>
    );
  };

  const filteredMainData = [
    {
      createdDate: '08-Jan-24',
      noOfPayments: 2,
      groupId: 240,
      type: 'Advance Payment',
      referenceNo: '-',
      totalValue: '1578.570',
      groupIssueStatus: 'Pending',
    },
    {
      referenceNo: '2404/001',
      noOfPayments: 2,
      type: 'Advance Payment',
      createdDate: '24-Apr-23',
      groupId: 236,
      groupIssueStatus: 'Pending',
      totalValue: '21439.090',
    },
  ];

  const componentData = [
    ['2', 'FINISHED_YARN_DESIGN_NO', 'Finished Yarn Design No', 'UTextField'],
    ['3', 'FINISHED_YARN_DESC', 'Finished Yarn Desc', 'UTextField'],
    ['4', 'SHARED_DESIGN', 'Shared Design', 'JCheckBox'],
    ['13', 'COLOR', 'Color', 'UComboBox'],
    ['14', 'COLOR_TBL', 'Color', 'SortSelectTable'],
  ];

  // Count occurrences of components
  const componentCounts = componentData.reduce((acc, item) => {
    const componentType = item[3];
    acc[componentType] = (acc[componentType] || 0) + 1;
    return acc;
  }, {});

  // Create a list of unique components with their counts
  const uniqueComponents = Object.entries(componentCounts)
    .filter(([componentType]) =>
      [
        'UTextField',
        'JCheckBox',
        'UComboBox',
        'SortSelectTable',
        'JComboBox',
      ].includes(componentType),
    )
    .map(([componentType, count]) => {
      let componentLabel = componentData.find(
        item => item[3] === componentType,
      )[2]; // Get the label from the second index
      // Override the count for JCheckBox to reflect the state-based count
      if (componentType === 'JCheckBox') {
        count = checkBoxCount;
      }
      return {
        componentType,
        count,
        label: componentLabel,
      };
    });

  return (
    <View style={styles.container}>
      <ScrollView>
        {draggables.map(({id, pan, componentType}) => (
          <DraggableComponent
            key={id}
            pan={pan}
            id={id}
            onPanResponderMove={updateCoordinates}
            style={styles.componentBox}>
            {renderComponent(componentType)}
          </DraggableComponent>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={handleDropdownToggle}>
        <Text style={styles.dropdownButtonText}>Show Components</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {uniqueComponents.map(({componentType, count, label}) => (
            <TouchableOpacity
              key={componentType}
              onPress={() => handleComponentSelect(componentType)}
              style={styles.dropdownItem}>
              <Text style={{color: 'black'}}>{`${label} (${count})`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveToFile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    top: 50,
    zIndex: 1,
  },
  dropdownItem: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: 200,
    color: 'black',
  },
  picker: {
    height: 50,
    width: 150,
  },
  componentBox: {
    marginBottom: 20,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
