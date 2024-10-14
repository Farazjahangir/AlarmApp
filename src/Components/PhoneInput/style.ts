import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        width: '100%',
    },
    textContainer: {
        borderRadius: 10,
        backgroundColor: COLORS.white,
        paddingVertical: 0,
    },
    textInput: {
        height: 45,
        fontSize: 16,
        padding: 0,
        margin: 0,
        color: COLORS.black,
    },
    codeText: {
        fontSize: 16,
        color: COLORS.black,
    }
});

export default styles;
