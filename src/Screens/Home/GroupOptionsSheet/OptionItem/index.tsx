import { Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native"
import styles from "./style"
import { TouchableOpacityProps } from "react-native-gesture-handler";

interface OptionItemProps {
    textRed?: boolean;
    text: string;
    icon: ImageSourcePropType;
    containerStyle?: TouchableOpacityProps['style']
}

const OptionItem = ({ textRed, icon, text, containerStyle }: OptionItemProps) => {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]}>
            <Image source={icon} style={styles.icon} />
            <Text style={[styles.text, textRed && styles.textRed]}>{text}</Text>
        </TouchableOpacity>
    )
}

export default OptionItem