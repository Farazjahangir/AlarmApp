import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 15
    },
    icon: {
        width: 14,
        height: 14
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mt10: {
        marginTop: 10
    }
});

export default styles;
