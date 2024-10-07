import {View, Text, TouchableOpacity} from 'react-native';

import styles from './style';

const ContactList = ({item, selectedContacts, handleSelectContact}) => {
  if (item.type === 'header') {
    return <Text style={styles.title}>{item.title}</Text>;
  } else {
    const isSelected = selectedContacts[item?.number || item.phoneNumber];
    return (
      <TouchableOpacity
        style={[styles.box, isSelected ? styles.bgPrimeOrange : styles.bgWhite]}
        onPress={handleSelectContact}>
        <Text style={[isSelected ? styles.textWhite : styles.textBlack]}>
          {item?.name || item.displayName}
        </Text>
        <Text style={[isSelected ? styles.textWhite : styles.textGrey]}>
          {item?.number || item.phoneNumber}
        </Text>
      </TouchableOpacity>
    );
  }
};

export default ContactList;
