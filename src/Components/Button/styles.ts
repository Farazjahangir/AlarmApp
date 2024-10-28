import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primePurple,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
        minWidth: 80,
        padding: 5
    },
    text: {
        color: COLORS.white,
    },
    smallBtn: {
        height: 28,
    },
    medumBtn: {
        height: 35
    },
    largeBtn: {
        height: 40
    },
    textLarge: {
        fontSize: RFPercentage(2.8)
    },
    textMedium: {
        fontSize: RFPercentage(2.3)
    },
    textSmall: {
        fontSize: RFPercentage(2)
    }
});

export default styles;
