import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: wp('8%'),
    },
    scollViewContentBox: {
        flexGrow: 1, 
        paddingVertical: 10,
        justifyContent: 'center'
    },
    icon: {
        width: 14,
        height: 14
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mt10: {
        marginTop: 10
    },
    title: {
        fontSize: RFPercentage(2.3),
        color: COLORS.black,
        marginTop: 10
    },
    value: {
        fontSize: RFPercentage(2.3),
        color: COLORS.grey,
        marginTop: 5
    },
    screenTitle: {
        fontSize: RFPercentage(4),
        color: COLORS.black
    },
    inputBox: {
        marginTop: 20
    },
    permissionText: {
        color:COLORS.black,
        fontSize: RFPercentage(2.7)
    },
    permissionBox: {
        marginTop: 30
    },
    btnBox: {
        marginTop: 30
    }
});

export default styles;
