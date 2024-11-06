import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    contentBox: {
        paddingHorizontal: 16,
        marginTop: 20,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    headerTitle: {
        fontSize: RFPercentage(2.5),
        color: COLORS.black
    },
    headerActionText: {
        color: COLORS.primePurple,
        fontSize: RFPercentage(2.5)
    },
    closeIconBox: {
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIcon: {
        width: '100%',
        height: '100%'
    },
    mt15: {
        marginTop: 15,
    }
});

export default styles;
