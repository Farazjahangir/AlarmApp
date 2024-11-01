import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1, // Lighter border for container
        borderBottomColor: COLORS.TabNavGreyColor,
        paddingBottom: 3
    },
    tabItem: {
        marginRight: 15,
    },
    title: {
        fontSize: RFPercentage(2.4),
        color: COLORS.black,
    },
    underline: {
        position: 'absolute',
        bottom: -4.5, // Shift the underline down to avoid overlap
        height: 2,
        width: '100%',
        backgroundColor: COLORS.primePurple,
    },
    activeTabText: {
        color: COLORS.primePurple
    }
});

export default styles;
