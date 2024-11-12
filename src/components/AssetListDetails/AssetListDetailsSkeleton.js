import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

function AssetListDetailsSkeleton(props) {
  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 44,
          width: '95%',
          marginTop: 10,
          marginBottom: 30,
        }}>
        <Skeleton
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={'92%'}
          height={40}
          style={{borderRadius: 15}}
        />
      </View>
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={300}
        height={150}
        style={{borderRadius: 15}}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={100}
        height={10}
        style={{borderRadius: 15, marginVertical: 20}}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={100}
        height={10}
        style={{
          borderRadius: 15,
          marginVertical: 10,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={150}
        height={10}
        style={{
          borderRadius: 15,
          marginBottom: 10,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={130}
        height={10}
        style={{
          borderRadius: 15,
          marginBottom: 10,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={90}
        height={10}
        style={{
          borderRadius: 15,
          marginBottom: 10,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={130}
        height={10}
        style={{
          borderRadius: 15,
          marginBottom: 10,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />
      <Skeleton
        LinearGradientComponent={LinearGradient}
        animation="wave"
        width={170}
        height={10}
        style={{
          borderRadius: 15,
          marginBottom: 20,
          alignSelf: 'baseline',
          marginLeft: 30,
        }}
      />

      <View
        style={{
          backgroundColor: 'rgba(220, 226, 229, 0.51)',
          width: '90%',
          height: '45%',
          borderRadius: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 260,
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 30,
            }}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 70 : 300,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 260,
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 30,
            }}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 70 : 300,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 260,
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 30,
            }}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 70 : 300,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{borderRadius: 15, marginBottom: 10, marginLeft: 30}}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={90}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 260,
            }}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 30 : 30,
            }}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={50}
            height={10}
            style={{
              borderRadius: 15,
              marginBottom: 10,
              marginLeft: width < 600 ? 70 : 300,
            }}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default AssetListDetailsSkeleton;
