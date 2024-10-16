import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    contentBox: {
        width: '70%',
    },
    text: {
        fontSize: RFPercentage(3),
        textAlign: 'center',
        color: COLORS.black
    }
});

export default styles;
