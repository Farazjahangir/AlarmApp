import {StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    title: {
        fontSize: RFPercentage(3.7),
        color: COLORS.black
    },
    container: {
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 5,
        maxHeight: '85%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    closeIconBox: {
        width: 22,
        height: 22
    },
    closeIcon: {
        width: '100%',
        height: '100%'
    }
});

export default styles;
