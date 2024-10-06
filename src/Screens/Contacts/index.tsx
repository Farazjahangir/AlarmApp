import {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import RNContacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

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

  const renderList = ({item}) => {
    if (item.type === 'header') {
      return (
        <Text style={{color: '#ff4d4d', marginTop: 20, fontSize: 17}}>
          {item.title}
        </Text>
      );
    } else {
      const isSelected = selectedContacts[item?.number || item.phoneNumber];
      return (
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 7,
            backgroundColor: isSelected ? '#ff4d4d' : '#ffffff',
          }}
          onPress={() => handleSelectContact(item?.number || item.phoneNumber)}>
          <Text style={{color: isSelected ? 'white' : 'black'}}>
            {item?.name || item.displayName}
          </Text>
          <Text style={{color: isSelected ? 'white' : 'grey'}}>
            {item?.number || item.phoneNumber}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  // const handleSearch = text => {
  //   setSearchTerm(text);

  //   // Convert the input and fields to lowercase for case-insensitive matching
  //   const filteredContacts = checkContacts.filter(item => {
  //     if (item.type === 'header') return true; // Always include headers
  //     const searchText = text.toLowerCase();
  //     // console.log("searchText", searchText)
  //     // console.log("item?.phoneNumber.includes(searchText)", item?.phoneNumber.includes(searchText))
  //     return (
  //       item?.displayName?.toLowerCase().includes(searchText) ||
  //       item?.name?.toLowerCase().includes(searchText)
  //     );
  //   });

  //   setFilteredData(filteredContacts);
  // };

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
    <View style={{backgroundColor: 'white'}}>
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        {/* <TextInput
          style={{
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 10,
            color: 'black',
          }}
          // onChangeText={handleSearch}
          value={searchTerm}
        /> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={{
              borderColor: 'grey',
              borderWidth: 1,
              borderRadius: 10,
              color: 'black',
              flex: 1,
              height: 40,
              marginRight: 15,
            }}
            onChangeText={onChangeGrpName}
            value={grpName}
            placeholder="Enter Group Name"
            placeholderTextColor={'black'}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#ff4d4d',
              height: 30,
              justifyContent: 'center',
              paddingHorizontal: 10,
              borderRadius: 5,
              minWidth: 100,
            }}
            disabled={
              !Object.keys(selectedContacts).length ||
              !grpName ||
              createGrpLoading
            }
            onPress={onCreateGroup}>
            {createGrpLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: '#ffffff'}}>Create Group</Text>
            )}
          </TouchableOpacity>
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
