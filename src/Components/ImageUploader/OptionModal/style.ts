import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    bottomSheetBgStyle: {
        backgroundColor: COLORS.white
    },
    iconBox: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.input,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 20,
        alignItems: 'center'
    },
    icon: {
        width: 28,
        height: 28
    },
    contentBox: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        color: COLORS.black,
        fontSize: RFPercentage(2.2),
        marginTop: 5
    }
});

export default styles;
