import {Text, Linking} from 'react-native';

import Modal from '../Modal';
import Button from '../Button';
import styles from './style';

interface HelpModalProps {
  isVisible: boolean;
  data: {
    name: string
    coords: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  onClose: () => void;
}

const HelpModal = ({isVisible, data, onClose}: HelpModalProps) => {
  const openGoogleMaps = () => {
    const latitude = data.coords.latitude;
    const longitude = data.coords.longitude;

    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      Linking.openURL(url).catch(err =>
        console.error('Error opening Google Maps', err),
      );
      onClose()
    }
  };
  return (
    <Modal isVisible={isVisible} title={`${data.name} needs help`} onClose={onClose}>
      <Button text="Open Location in Maps" onPress={openGoogleMaps} />
    </Modal>
  );
};

export default HelpModal;
