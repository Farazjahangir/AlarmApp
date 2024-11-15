import {Text, View} from 'react-native';

import Modal from '../Modal';
import Button from '../Button';
import styles from './styles';

interface ConfirmationModalProps  {
    open: boolean;
    title: string;
    onConfirm: () => void;
    message: string;
    loading?: boolean;
    onClose: () => void
}
const ConfirmationModal = ({title, open, onConfirm, message, onClose}: ConfirmationModalProps) => {

    const onOk = () => {
        onConfirm?.()
    }

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
          <Button text="Yes" onPress={onOk} />
          <Button text="No" theme='white' onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
