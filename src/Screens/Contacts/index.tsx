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

const Contacts = () => {
  const [data, setData] = useState([]);
  //   const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedContacts, setSelectedContacts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [grpName, setGrpName] = useState('Grp 1');
  const [filteredData, setFilteredData] = useState([]);
  const [createGrpLoading, setCreateGrpLoading] = useState(false);

  const contatcs = useSelector(state => state.contacts.data);
  const user = useSelector(state => state.user.data.user);

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
    } else if (item.type === 'withAccount') {
      const isSelected = selectedContacts[item.number];
      return (
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 7,
            backgroundColor: isSelected ? '#ff4d4d' : '#ffffff',
          }}
          onPress={() => handleSelectContact(item.number)}>
          <Text style={{color: isSelected ? 'white' : 'black'}}>
            {item.name}
          </Text>
          <Text style={{color: isSelected ? 'white' : 'grey'}}>
            {item.number}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 7,
            backgroundColor: '#ffffff',
          }}>
          <Text style={{color: 'black'}}>{item.displayName}</Text>
          <Text style={{color: 'grey'}}>{item.phoneNumber}</Text>
        </View>
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

  const createSelectedUsersUIDArr = () => {
    let selectedContactsData = [];

    data.forEach(contact => {
      // Skip headers
      if (contact.type === 'header') return;

      // If the contact number exists in selectedContacts and is true
      if (selectedContacts[contact.number]) {
        selectedContactsData.push(contact.uid);
      }
    });
    return selectedContactsData;
  };

  const onCreateGroup = async () => {
    try {
      setCreateGrpLoading(true)
      const uids = createSelectedUsersUIDArr();
      const payload = {
        groupName: grpName,
        createdBy: user.uid,
        members: [user.uid, ...uids],
      };

      await firestore().collection('groups').add(payload);
      console.log('GRP Created');
    } catch (e) {
      console.log('onCreateGroup ERR', e.message);
    } finally {
      setCreateGrpLoading(false)
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
              minWidth: 100
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
