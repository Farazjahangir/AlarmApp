import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {CombinedContact} from '..';
import styles from './style';

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}
interface ContactListProps {
  item: CombinedContact;
  selectedContacts: SelectedContacts;
  handleSelectContact: TouchableOpacityProps['onPress'];
}

const ContactList = ({
  item,
  selectedContacts,
  handleSelectContact,
}: ContactListProps) => {
  if (item.type === 'header') {
    return <Text style={styles.title}>{item.title}</Text>;
  } else {
    const isSelected = selectedContacts[item.phoneNumber];
    return (
      <TouchableOpacity
        style={[styles.box, isSelected ? styles.bgPrimeOrange : styles.bgWhite]}
        onPress={handleSelectContact}>
        <Text style={[isSelected ? styles.textWhite : styles.textBlack]}>
          {/* {item?.name || item.displayName} */}
          {item?.displayName}
        </Text>
        <Text style={[isSelected ? styles.textWhite : styles.textGrey]}>
          {/* {item?.number || item.phoneNumber} */}
          {item?.phoneNumber}
        </Text>
      </TouchableOpacity>
    );
  }
};

export default ContactList;
