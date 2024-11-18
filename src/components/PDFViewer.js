import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PDFView from 'react-native-pdf';

const PDFViewer = ({filePath}) => {
  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <PDFView
          source={{uri: filePath, cache: true}}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    height: 300, // Define the height of the container
    width: 420, // Define the width of the container
    backgroundColor: 'white',
    justifyContent: 'center', // Center contents vertically
    alignItems: 'center', // Center contents horizontally
  },
  pdf: {
    // backgroundColor: 'blue',

    height: '100%', // Make the PDF viewer take the full height of the container
    width: '100%', // Make the PDF viewer take the full width of the container
  },
});

export default PDFViewer;
