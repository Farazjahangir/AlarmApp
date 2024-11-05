import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../../../Constants/colors';

const styles = StyleSheet.create({
    title: {
        color: COLORS.black,
        marginTop: 20,
        fontSize: RFPercentage(2.5)
    },
    box: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: COLORS.white,
        marginTop: 12,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textBlack: {
        color: COLORS.black
    },
    textGrey: {
        color: COLORS.grey
    },
    picture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 13
    },
    textContainer: {
        flex: 1
    }
});

export default styles;
