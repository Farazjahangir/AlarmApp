import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    title: {
        color: COLORS.black,
        marginTop: 20,
        fontSize: RFPercentage(2.5)
    },
    box: {
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    textWhite: {
        color: COLORS.white
    },
    textBlack: {
        color: COLORS.black
    },
    textGrey: {
        color: COLORS.grey
    },
    bgPrimeOrange: {
        backgroundColor: COLORS.primeOrange
    },
    bgWhite: {
        backgroundColor: COLORS.white
    },
});

export default styles;
