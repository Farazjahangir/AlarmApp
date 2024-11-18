import {StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    title: {
        fontSize: RFPercentage(2.7),
        color: COLORS.black,
        fontWeight: 'bold'
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
        marginBottom: 20,
        paddingHorizontal: 10
    },
    closeIconBox: {
        width: 18,
        height: 18
    },
    closeIcon: {
        width: '100%',
        height: '100%'
    }
});

export default styles;
