import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    leftContainer: {
        flex: 1
    },
    groupName: {
        color: COLORS.black,
        fontSize: RFPercentage(3)
    },
    count: {
        color: COLORS.grey, 
        fontSize: RFPercentage(1.9)
    },
    picture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    }
});

export default styles;
