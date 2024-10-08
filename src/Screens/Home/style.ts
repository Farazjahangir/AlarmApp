import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    title: {
        fontSize: RFPercentage(3), 
        color: 'black', 
        marginTop: 10
    },
    grpListContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        // marginTop: 20,
    },
    createGrpBtncontainer: {
        width: 100,
        height: 30
    },
    grpListBox: {
        marginTop: 15
    }
});

export default styles;
