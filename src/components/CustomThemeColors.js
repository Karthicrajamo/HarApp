import {StatusBar} from 'react-native';
import {BackgroundImage} from 'react-native-elements/dist/config';

// const header='#264e6d';
// const userDetailsSectionBackgroundImageURL = require('../images/userdetails-BG-image.jpg');
// export const CustomThemeColors = {
//     primary:'#345e7e',
//     secondary:'',
//     Accent:'',
//     backgroundColor:'#bdcbd8',
//     header:header,
//     gradientStart:header,
//     gradientEnd:'#598bb3',
//     fadedWhite:'rgba(255, 255, 255, 0.7)',
//     text:'white',
//     iconColor:'white',
//     menuIconColor:'#7E7F83',
//     BackgroundImage: userDetailsSectionBackgroundImageURL,

// }

// const header='#264e6d';
// const header='#0f325a';
// const header='#67DCF7';
const header = 'white';
const primary = '#3788E5';
const userDetailsSectionBackgroundImageURL = require('../images/userdetails-BG-image.jpg');
export const CustomThemeColors = {
  // primary:'#345e7e',
  primary: primary,
  secondary: '',
  Accent: '',
  backgroundColor: '#bdcbd8',
  // sectionBackgroundColor:'#edf5fd',
  sectionBackgroundColor: '#f7fafc',
  whiteBackgroundColor: 'white',
  fadedPrimary: 'rgba(55, 136, 229, 0.2)',
  extraFadedPrimary: 'rgba(55, 136, 229, 0.2)',
  header: header,
  headerTextColor: primary,
  richGrey: '#AEB7B3',
  gradientStart: primary,
  gradientEnd: '#3f7bc0',
  fadedWhite: 'rgba(255, 255, 255, 0.7)',
  text: 'white',
  iconColor: primary,
  iconDisabledColor: 'rgba(55, 136, 229, 0.3)',
  iconBackgroundColor: '#f7fafc',

  iconBackgroundDisableColor: '#f7fafc',
  // menuIconColor:'#7E7F83',
  menuIconColor: 'grey',
  BackgroundImage: userDetailsSectionBackgroundImageURL,
  StatusBarColor: 'white',
  humBurgerIconColor: '#3788E5',
  HomeScreenBackroundColor: 'white',
};
