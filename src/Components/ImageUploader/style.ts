import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.input
    },
    placeholder: {
        width: 35,
        height: 35,
        borderRadius: 60,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 60,
    }
});

export default styles;
