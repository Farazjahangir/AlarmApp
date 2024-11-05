import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
} from 'react-native';

import {CombinedContact} from '..';
import dummyProfile from '../../../../Assets/images/profileDummy.png';
import CheckBox from '../../../../Components/CheckBox';
import styles from './style';

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}
interface ListProps {
  item: CombinedContact;
  selectedContacts: SelectedContacts;
  handleSelectContact: TouchableOpacityProps['onPress'];
}

const List = ({item, selectedContacts, handleSelectContact}: ListProps) => {
  if (item.type === 'header') {
    return <Text style={styles.title}>{item.title}</Text>;
  } else {
    const isSelected = selectedContacts[item.phoneNumber];
    return (
      <TouchableOpacity style={styles.box} onPress={handleSelectContact}>
        <Image
          source={dummyProfile}
          style={styles.picture}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.textBlack}>
            {/* {item?.name || item.displayName} */}
            {item?.displayName}
          </Text>
          <Text style={styles.textGrey}>
            {/* {item?.number || item.phoneNumber} */}
            {item?.phoneNumber}
          </Text>
        </View>
        <CheckBox value={isSelected} />
      </TouchableOpacity>
    );
  }
};

export default List;
