import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
  contentBox: {
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    padding: 10
  },
  description: {
    color: COLORS.textGrey,
    fontSize: RFPercentage(2.4),
    marginTop: 20
  },
  btnBox: {
    marginTop: 10
  },
});

export default styles;
