import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    input: {
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        borderRadius: 6,
        color: COLORS.black,
        height: 40,
        width: '100%',
        backgroundColor: COLORS.white,
    },
    error: {
        color: COLORS.error,
        fontSize: RFPercentage(2.2)
    }   
});

export default styles;
