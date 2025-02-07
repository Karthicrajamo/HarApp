import {StyleSheet} from 'react-native';
import {CustomThemeColors} from '../CustomThemeColors';

const commonStyles = StyleSheet.create({
  heading: {padding: 8, fontWeight: '800', color: 'black', fontSize: 16},
  textCenter: {alignItems: 'center', justifyContent: 'center'},
  padTop:{paddingTop:10},
  centerAlign:{ alignItems: 'center', justifyContent: 'center' },
  flexRow: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  flexRowNoPadd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
    padding: 15,
  },
  oneLineKey: {
    color: 'black',
    fontWeight: '600',
    flex: 1, // Ensure the key takes up available space
  },
  oneLineValue: {
    color: 'black',
    // marginLeft: 10, // Adjust for spacing from the key
    flex: 2, // Ensures the value input takes up more space
  },
  boxForValue: {
    backgroundColor: '#E8E8E8',
    padding: 5,
    paddingRight: 200,
    borderRadius: 5,
  },
  // Button Styles
  disableButtonTextContainer: {
    backgroundColor: '#a5c9f3',
    width: 200,
    padding: 20,
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disableButtonText: {
    color: '#f2f2f2',
  },
  enableButtonTextContainer: {
    backgroundColor: '#3788E5',
    width: 200,
    padding: 20,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40, // Increased height for better visibility
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    color: '#888', // Gray text color for disabled state
    padding: 0,
    borderWidth: 1, // Border for input
    borderColor: '#ddd', // Light border color for clarity
    marginTop: 5,
  },
  inputNoBox: {
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    color: '#888', // Gray text color for disabled state
    padding: 0,
    borderBottomWidth: 1, // Border for input
    borderColor: '#ddd', // Light border color for clarity
    marginTop: 5,
    width: 200,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  redAsterisk: {
    color: 'red', // Set the asterisk color to red
  },
});

export default commonStyles;
