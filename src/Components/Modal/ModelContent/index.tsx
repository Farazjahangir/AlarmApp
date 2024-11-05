import {ReactNode} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import closeIcon from '../../../Assets/icons/close.png';
import styles from './style';

interface ModalContentProps {
  children: ReactNode; // Type for children
  title?: string; // Optional title
  onClose: TouchableOpacityProps['onPress']; // Function to handle close
}

const ModalContent = ({children, title, onClose}: ModalContentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title || 'Title'}</Text>
        <TouchableOpacity style={styles.closeIconBox} onPress={onClose}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>{children}</ScrollView>
    </View>
  );
};

export default ModalContent;
