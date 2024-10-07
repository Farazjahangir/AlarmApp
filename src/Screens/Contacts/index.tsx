import {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RNContacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';
import ContactList from './ContactList';
import styles from './style';

const Contacts = () => {
  const [data, setData] = useState([]);
  //   const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedContacts, setSelectedContacts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [grpName, setGrpName] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [createGrpLoading, setCreateGrpLoading] = useState(false);

  const contatcs = useSelector(state => state.contacts.data);
  const user = useSelector(state => state.user.data.user);
  const navigation = useNavigation();

  const handleSelectContact = phoneNumber => {
    const selected = {...selectedContacts};
    if (selected[phoneNumber]) {
      selected[phoneNumber] = false;
    } else {
      selected[phoneNumber] = true;
    }
    setSelectedContacts(selected);
  };

  const renderList = ({item}) => (
    <ContactList
      item={item}
      selectedContacts={selectedContacts}
      handleSelectContact={() =>
        handleSelectContact(item?.number || item.phoneNumber)
      }
    />
  );

  const handleSearch = text => {
    setSearchTerm(text);
    const lowerCaseSearchTerm = text.toLowerCase();
    // Filter the 'withAccount' section
    const withAccountContacts = data.filter(
      contact =>
        contact.type === 'withAccount' &&
        (contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.number.includes(lowerCaseSearchTerm)),
    );

    // Filter the 'withoutAccount' section
    const withoutAccountContacts = data.filter(
      contact =>
        contact.type === 'withoutAccount' &&
        (contact.displayName.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.phoneNumber.includes(lowerCaseSearchTerm)),
    );

    // Prepare the filtered data
    let filteredData = [];

    // Add 'withAccount' section if it has data
    if (withAccountContacts.length > 0) {
      filteredData.push({type: 'header', title: 'Contacts on AlarmApp'});
      filteredData = filteredData.concat(withAccountContacts);
    }

    // Add 'withoutAccount' section if it has data
    if (withoutAccountContacts.length > 0) {
      filteredData.push({type: 'header', title: 'Contacts Not on AlarmApp'});
      filteredData = filteredData.concat(withoutAccountContacts);
    }
    setFilteredData(filteredData);
  };

  const mergeData = () => {
    const combinedContacts = [
      {type: 'header', title: 'Contacts on AlarmApp'},
      ...contatcs.contactsWithAccount.map(contact => ({
        ...contact,
        type: 'withAccount',
      })),
      {type: 'header', title: 'Contacts Not on AlarmApp'},
      ...contatcs.contactsWithoutAccount.map(contact => ({
        ...contact,
        type: 'withoutAccount',
      })),
    ];
    setData(combinedContacts);
    setFilteredData(combinedContacts);
  };

  const onChangeGrpName = text => {
    setGrpName(text);
  };

  const separateActiveAndNonActiveContacts = () => {
    const selectedContactsData = [];
    const contactsWithoutUID = [];

    data.forEach(contact => {
      // Skip headers
      if (contact.type === 'header') return;

      if (selectedContacts[contact?.number || contact.phoneNumber]) {
        if (contact.uid) {
          // Add contacts with UID directly
          selectedContactsData.push(contact.uid);
        } else {
          // Collect contacts without UID for later processing
          contactsWithoutUID.push(contact);
        }
      }
    });

    return {
      selectedContactsData,
      contactsWithoutUID,
    };
  };

  const processFirestoreData = async contactsWithoutUID => {
    const foundUserUIDs = [];
    const newUserUIDs = [];
    const batchSize = 2; // Firestore 'in' query can handle up to 30 numbers
    const existingUIDs = new Set();

    for (let i = 0; i < contactsWithoutUID.length; i += batchSize) {
      const batch = contactsWithoutUID
        .slice(i, i + batchSize)
        .map(contact => contact.phoneNumber);
      // Query Firestore for the current batch of phone numbers
      const userSnapshot = await firestore()
        .collection('users')
        .where('number', 'in', batch)
        .get();

      if (!userSnapshot.empty) {
        userSnapshot.forEach(doc => {
          const userData = doc.data();
          const uid = doc.id;
          const number = userData.number;

          // Find matching contact in the batch
          const foundContact = contactsWithoutUID.find(
            c => c.phoneNumber === number,
          );
          if (foundContact) {
            foundUserUIDs.push(uid);
            existingUIDs.add(number); // Mark as found
          }
        });
      }

      // Step 3: Handle remaining contacts not found in Firestore (create new users)
      for (const contact of contactsWithoutUID) {
        if (!existingUIDs.has(contact.phoneNumber)) {
          const newUserRef = await firestore().collection('users').add({
            name: contact.displayName,
            number: contact.phoneNumber,
            isActive: false,
            deviceToken: '',
            email: '',
          });

          // Add the new user's UID to the array
          newUserUIDs.push(newUserRef.id);
          existingUIDs.add(contact.phoneNumber);
        }
      }
    }

    return {foundUserUIDs, newUserUIDs};
  };

  const createSelectedUsersUIDArr = async () => {
    const {selectedContactsData, contactsWithoutUID} =
      separateActiveAndNonActiveContacts();

    // If no contacts need further processing, return early
    if (contactsWithoutUID.length === 0) return selectedContactsData;

    // Process Firestore data (both find and create users in one pass)
    const {foundUserUIDs, newUserUIDs} = await processFirestoreData(
      contactsWithoutUID,
    );

    return [...selectedContactsData, ...foundUserUIDs, ...newUserUIDs];
  };

  const onCreateGroup = async () => {
    try {
      setCreateGrpLoading(true);
      const uids = await createSelectedUsersUIDArr();
      const payload = {
        groupName: grpName,
        createdBy: user.uid,
        members: [user.uid, ...uids],
      };

      await firestore().collection('groups').add(payload);
      navigation.navigate('Home');
    } catch (e) {
      console.log('onCreateGroup ERR', e.message);
    } finally {
      setCreateGrpLoading(false);
    }
  };

  useEffect(() => {
    if (
      contatcs.contactsWithAccount.lenght ||
      contatcs.contactsWithoutAccount.length
    ) {
      mergeData();
    }
  }, [contatcs.contactsWithAccount, contatcs.contactsWithoutAccount]);
  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <TextInput
          placeholder="Search Contact"
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <Text style={styles.title}>Create Group</Text>
        <TextInput
          onChangeText={onChangeGrpName}
          value={grpName}
          placeholder="Enter Group Name"
        />
        <View style={styles.createBtnBox}>
          <Button
            text="Create Group"
            onPress={onCreateGroup}
            loading={createGrpLoading}
            disabled={!grpName || !!selectedContacts.length}
          />
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderList}
          extraData={filteredData}
          keyExtractor={(item, index) => item.number}
        />
      </View>
    </View>
  );
};

export default Contacts;
