import {Text, View} from 'react-native';

import Modal from '../Modal';
import Button from '../Button';
import styles from './styles';

interface ConfirmationModalProps  {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void
}
const MessageBox = ({title, open, message, onClose}: ConfirmationModalProps) => {

    const onCancel = () => {
        onClose?.()
    }
  return (
    <Modal isVisible={open} title={title} onClose={onCancel}>
      <View style={styles.contentBox}>
        <Text style={styles.description}>
          {message}
        </Text>
        <View style={styles.btnBox}>
          <Button text="Close" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
};

export default MessageBox;
