import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    contentBox: {
        width: '90%',
        maxWidth: 400
    },
    title: {
        color: COLORS.black,
        fontSize: RFPercentage(4.5),
        textAlign: 'center'
    },
    greetingText: {
        fontSize: RFPercentage(2.2),
        textAlign: 'center',
        marginTop: 5,
        color: COLORS.textGrey
    },
    inputContainer: {
        marginTop: 30
    },
    inputTitle: {
        color: COLORS.black,
        fontSize: RFPercentage(2.5),
        marginBottom: 10,
        fontWeight: 'bold'
    },
    btnBox: {
        width: '100%',
        marginTop: 40
    },
    linksBox: {
        alignItems: 'flex-end',
        marginTop: 8
    },
    forgotText: {
        color: COLORS.primePurple,
        fontWeight: 'bold',
        fontSize: RFPercentage(2.2)
    },
    signupText: {
        color: COLORS.primePurple,
        fontWeight: 'bold',
        fontSize: RFPercentage(2.2)
    }
});

export default styles;
