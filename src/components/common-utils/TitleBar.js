import React from 'react';
import {StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can choose any icon set
import {CustomThemeColors} from '../CustomThemeColors';

function TitleBar(props) {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        {props.showMenuBar && (
          <TouchableOpacity onPress={props.onMenuPress} style={styles.menuIcon}>
            <Icon name="menu" size={20} color={CustomThemeColors.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
        <View style={styles.rightIcons}>
          {props.showSearchIcon && (
            <TouchableOpacity onPress={props.onSearchPress} style={styles.icon}>
              <Icon name="search" size={20} color={CustomThemeColors.primary} />
            </TouchableOpacity>
          )}
          {props.showRefreshIcon && (
            <TouchableOpacity
              onPress={props.onRefreshPress}
              style={styles.icon}>
              <Icon
                name="refresh"
                size={20}
                color={CustomThemeColors.primary}
              />
            </TouchableOpacity>
          )}
          {props.showQrScannerIcon && (
            <TouchableOpacity
              onPress={props.onQrScannerPress}
              style={styles.icon}>
              <Icon
                name="qr-code"
                size={20}
                color={CustomThemeColors.primary}
              />
            </TouchableOpacity>
          )}
          {props.showFileIcon && (
            <TouchableOpacity onPress={props.onFilePress} style={styles.icon}>
              <Icon
                name="document"
                size={20}
                color={CustomThemeColors.primary}
              />
            </TouchableOpacity>
          )}
          {props.showFilterIcon && (
            <TouchableOpacity onPress={props.onFilterPress} style={styles.icon}>
              <Icon name="filter" size={20} color={CustomThemeColors.primary} />
            </TouchableOpacity>
          )}
          {props.showCloseIcon && (
            <TouchableOpacity onPress={props.onClose} style={styles.icon}>
              <Icon name="close" size={20} color={CustomThemeColors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  title: {
    width: '98%',
    height: 44,
    paddingTop: 4,
    paddingRight: 16,
    paddingBottom: 5,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(55, 136, 229, 0.26)',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: CustomThemeColors.primary,
    fontWeight: 'bold',
  },
  menuIcon: {
    marginRight: 16,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
    padding: 4,
  },
});

export default TitleBar;
