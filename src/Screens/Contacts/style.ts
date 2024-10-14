import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        height:'100%'
    },
    contentBox: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    title: {
        fontSize: RFPercentage(3.5),
        color: COLORS.black,
        marginTop: 30,
        marginBottom: 10
    },
    createBtnBox: {
        alignItems: 'flex-end',
    },
    error: {
        color: COLORS.error,
        fontSize: RFPercentage(2.2)
    }
});

export default styles;
