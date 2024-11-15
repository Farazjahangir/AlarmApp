import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
  contentBox: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  name: {
    color:COLORS.black,
    fontSize: RFPercentage(3),
  },
  nameBox: {
    marginLeft: 10
  },
  count: {
    color: COLORS.textGrey,
    fontSize: RFPercentage(2)
  },
  optionsBox: {
    marginTop: 30
  },
  optionItemContainer: {
    marginTop: 15
  }
});

export default styles;
