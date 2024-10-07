import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  name: {
    color: COLORS.black,
    fontSize: RFPercentage(2.3)
  }
});

export default styles;
