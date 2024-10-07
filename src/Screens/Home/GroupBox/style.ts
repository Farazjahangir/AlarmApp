import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    leftContainer: {
        flex: 1
    },
    groupName: {
        color: COLORS.black,
        fontSize: RFPercentage(3)
    },
    count: {
        color: COLORS.black, 
        fontSize: RFPercentage(1.9)
    }
});

export default styles;
