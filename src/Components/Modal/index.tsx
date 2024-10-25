import { ReactNode } from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import RNModal from 'react-native-modal';

import closeIcon from '../../Assets/icons/close.png';
import styles from './style';

interface ModalProps {
  children: ReactNode; // Type for children
  isVisible: boolean; // Control modal visibility
  title?: string; // Optional title
  onClose: TouchableOpacityProps['onPress']; // Function to handle close
}

const Modal = ({ children, isVisible, title, onClose }: ModalProps) => {
  return (
    <RNModal isVisible={isVisible} backdropOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title || 'Title'}</Text>
          <TouchableOpacity style={styles.closeIconBox} onPress={onClose}>
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {children}
        </ScrollView>
      </View>
    </RNModal>
  );
};

export default Modal;
