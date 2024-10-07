import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primeOrange,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
        padding: 5
    },
    text: {
        color: COLORS.white
    }
});

export default styles;
