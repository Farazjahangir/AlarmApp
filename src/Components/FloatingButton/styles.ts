import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primePurple,
        width: 55,
        height: 55,
        borderRadius: 27.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 30,
        bottom: 95,
        zIndex: 5
    },
    button: {
        width: '50%',
        height: '50%'
    }
});

export default styles;
