import { Text, View } from "react-native"

import styles from "./styles"

const Chip = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default Chip