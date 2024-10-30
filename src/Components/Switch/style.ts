import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '50%',
        height: '50%'
    },
    label: {
        fontSize: RFPercentage(2.2),
        color: COLORS.black,
        marginLeft: 10,
        flex: 1,
    }
});

export default styles;
