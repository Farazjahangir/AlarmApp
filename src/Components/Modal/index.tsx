import {ReactNode} from 'react';
import {TouchableOpacityProps} from 'react-native';
import RNModal from 'react-native-modal';

import ModalContent from './ModelContent';
interface ModalProps {
  children: ReactNode; // Type for children
  isVisible: boolean; // Control modal visibility
  title?: string; // Optional title
  onClose: TouchableOpacityProps['onPress']; // Function to handle close
}

const Modal = ({children, isVisible, title, onClose}: ModalProps) => {
  return (
    <RNModal isVisible={isVisible} backdropOpacity={0.4}>
      {isVisible && (
        <ModalContent title={title} onClose={onClose}>
          {children}
        </ModalContent>
      )}
    </RNModal>
  );
};

export default Modal;
