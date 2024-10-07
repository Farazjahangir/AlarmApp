import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primeOrange,
    padding: 3,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: COLORS.white,
    fontSize: RFPercentage(2)
  }
});

export default styles;
