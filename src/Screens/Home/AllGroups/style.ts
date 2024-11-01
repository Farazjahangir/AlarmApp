import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import COLORS from '../../../Constants/colors';

const styles = StyleSheet.create({
    noDataMessage: {
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 20,
        fontSize: RFPercentage(3)
    },
    grpListBox: {
        marginTop: 15
    },
})

export default styles;
