import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
        alignItems: 'center',
    },
    screenName: {
        color: COLORS.black, 
        fontSize: RFPercentage(2.6)
    },
    leftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backIconBox: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    backIcon: {
        width: '100%',
        height: '100%'
    }
});

export default styles;
