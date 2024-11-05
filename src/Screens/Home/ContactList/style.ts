import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        height:'100%',
    },
    contentBox: {
        paddingHorizontal: 16,
        marginTop: 10,
        flex: 1
    },
    title: {
        fontSize: RFPercentage(3.5),
        color: COLORS.black,
        marginTop: 30,
        marginBottom: 10
    },
    createBtnBox: {
        alignItems: 'flex-end',
    },
    error: {
        color: COLORS.error,
        fontSize: RFPercentage(2.2)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    closeIconBox: {
        width: 18,
        height: 18
    },
    closeIcon: {
        width: '100%',
        height: '100%'
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: RFPercentage(2.5)
    },
    headerActionButtonText: {
        color: COLORS.primePurple,
        fontSize: RFPercentage(2.5)
    },
    searchInput: {
        backgroundColor: COLORS.input
    },
    disabledText: {
        color: COLORS.textGrey
    }
});

export default styles;
