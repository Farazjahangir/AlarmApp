import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import COLORS from '../../Constants/colors';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    contentBox: {
        width: '80%',
        backgroundColor: COLORS.white, // Optional, if you want a background for the content box
        padding: 20, // Add padding for spacing inside the box
        borderRadius: 10, // Optional, for rounded corners
        shadowColor: "#000", // Optional, for shadow effect
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
    },
    text: {
        fontSize: RFPercentage(3),
        textAlign: 'center',
        color: COLORS.black,
        marginBottom: 10, // Add space between the text elements
    },
});

export default styles;