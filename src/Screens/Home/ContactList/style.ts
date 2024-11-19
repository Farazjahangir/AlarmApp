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
    },
    askPermBox: {
        marginTop: 100,
        alignItems: 'center'
    },
    permText: {
        color: COLORS.black,
        fontSize: RFPercentage(2.5)
    },
    loader: {
        marginTop: 100
    }
});

export default styles;
