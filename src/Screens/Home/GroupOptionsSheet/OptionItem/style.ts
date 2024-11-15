import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../../Constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10
  },
  icon: {
    width: 22,
    height: 22
  },
  text: {
    color: COLORS.textDarkGrey,
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
    marginLeft: 8
  },
  textRed: {
    color: COLORS.primeRed
  }
});

export default styles;
