import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    lignItems: 'left',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '85%',
    height:'100%',
    alignSelf: 'left',
  },
  mainOptionsContainer: {
    flex: 4, // Cover 40% of the width
    // backgroundColor: 'green', // Green background for main options
    borderRadius: 5,
    marginRight: '5%', // Margin between main options and sub-options
    padding: 10, // Padding for main options
  },
  subOptionsContainer: {
    flex: 6, // Cover 60% of the width
    // backgroundColor: 'white', // Red background for sub-options
    borderRadius: 5,
    marginLeft: '5%', // Margin between sub-options and main options
    padding: 10, // Padding for sub-options
  },
  titles: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filtertitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closetitle: {
    flex:1,
    fontSize: 18,
    fontWeight: 'bold',
    // left:190,
    left:width < 600 ?  wp('0%') :  wp('67%'),
  },
  option: {
    padding:10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    // borderWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeOption: {
    backgroundColor: '#d8ebee',
    borderBottomWidth: 1,
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 15,
  },
  checkbox: {
    flex:0,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    right:10,
  },
  checkmark: {
    flex:0,
    width: 10,
    height: 10,
    backgroundColor: '#79d9e6',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Adjust margin top
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#9ed0ec',
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default styles;
