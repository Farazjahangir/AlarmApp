import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 15,
    },
    contentBox: {
        marginTop: hp('2%'),
        flex: 1,
    },
    title: {
        fontSize: RFPercentage(3.5), 
        color: 'black', 
        marginTop: 10
    },
    imageBox: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    inputContainer: {
        marginTop: 18
    }
});

export default styles;