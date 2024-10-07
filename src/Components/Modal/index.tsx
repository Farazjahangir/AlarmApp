import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import RNModal from 'react-native-modal';

import closeIcon from '../../Assets/icons/close.png';
import styles from './style';

const Modal = ({ children, isVisible, title, onClose }) => {
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
