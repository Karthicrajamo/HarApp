import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {DataTable} from 'react-native-paper';

const CustomTable = () => {
  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title>Dessert</DataTable.Title>
              <DataTable.Title numeric>Calories</DataTable.Title>
              <DataTable.Title numeric>Fat</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell>Frozen yogurt</DataTable.Cell>
              <DataTable.Cell numeric>159</DataTable.Cell>
              <DataTable.Cell numeric>6.0</DataTable.Cell>
            </DataTable.Row>

            {/* Add more rows as needed */}

            <DataTable.Pagination
              page={1}
              numberOfPages={3}
              onPageChange={page => {
                console.log(page);
              }}
              label="1-2 of 6"
            />
          </DataTable>
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    flexDirection: 'row',
    height: 300,
  },
});

export default CustomTable;
