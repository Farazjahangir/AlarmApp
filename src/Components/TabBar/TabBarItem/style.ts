import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    screenName: {
        color: COLORS.TabNavGreyColor
    },
    selectedScreenName: {
        color: COLORS.black
    },
    icon: {
        width: 22,
        height: 22,
        marginBottom: 4
    }
});

export default styles;
