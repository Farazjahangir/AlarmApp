import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 15,
        width: wp('100%'),
        alignItems: 'center',
    },
    contentBox: {
        width: wp('90%'),
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        backgroundColor: COLORS.white,
        minHeight: 55,
        borderRadius: 13,
        padding: 10,
        justifyContent:'space-between',
        flexDirection: 'row'
    }
});

export default styles;
