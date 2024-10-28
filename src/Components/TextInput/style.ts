import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 10,
        paddingHorizontal: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.black,
        height: 40
    },
    error: {
        color: COLORS.error,
        fontSize: RFPercentage(2.2)
    },
    eyeIconBox: {
        width: 25,
        height: 25,
    },
    eyeIcon: {
        width: '100%',
        height: '100%'
    }
});

export default styles;
