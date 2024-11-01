import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentBox: {
        marginTop: hp('2%'),
        flex: 1
    },
    title: {
        fontSize: RFPercentage(3.5), 
        color: 'black', 
        marginTop: 10
    },
    input: {
        backgroundColor: COLORS.lightGrey
    },
    mt15: {
        marginTop: 15,
    },
    tabContainer: {
        flex: 1,
        marginTop: 20
    }
});

export default styles;
