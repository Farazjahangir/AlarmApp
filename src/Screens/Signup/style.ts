import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentBox: {
        width: 300
    },
    title: {
        color: COLORS.black,
        fontSize: RFPercentage(4),
        textAlign: 'center'
    },
    inputBox: {
        marginTop: 20
    },
    btnBox: {
        width: '100%',
        alignItems: 'flex-end'
    },
    linkText: {
        color: COLORS.link, 
        fontSize: RFPercentage(2.6), 
        marginTop: 10
    }
});

export default styles;
