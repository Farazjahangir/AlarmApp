import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.input,
        color: COLORS.black,
        borderRadius: 10,
        fontSize: RFPercentage(2.2),
        paddingHorizontal: 18,
    },
    placeholder: {
        color: COLORS.inputPlaceholder
    },
    error: {
        color: COLORS.error,
        fontSize: RFPercentage(2.2)
    },
});

export default styles;
