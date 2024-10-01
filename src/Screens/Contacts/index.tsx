import {useEffect, useState} from 'react';
import {Text, FlatList, View, TouchableOpacity, TextInput} from 'react-native';
import RNContacts from 'react-native-contacts';

const Contacts = () => {
  const [data, setData] = useState([]);
  //   const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedContacts, setSelectedContacts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const normalizePhoneNumber = number => {
    if (!number) return ''; // Check if number exists
    return number.replace(/\s+/g, ''); // Remove spaces
  };

  const transformContacts = contacts => {
    const transformedContacts = [];

    contacts.forEach(contact => {
      if (
        contact.phoneNumbers &&
        Array.isArray(contact.phoneNumbers) &&
        contact.phoneNumbers.length
      ) {
        const distinctNumbers = Array.from(
          new Set(
            contact.phoneNumbers
              .map(phone => normalizePhoneNumber(phone.number))
              .filter(Boolean),
          ),
        );
        distinctNumbers.forEach(number => {
          const newContact = {...contact};
          newContact.phoneNumber = number;
          transformedContacts.push(newContact);
        });
      }
    });

    return transformedContacts;
  };

  const fetchContacts = async () => {
    try {
      const contacts = await RNContacts.getAll();
      //   console.log('contacts', contacts[3].phoneNumbers);
      const transformedData = transformContacts(contacts);
      setData(transformedData);
      setFilteredData(transformedData)
    } catch (e) {
      console.log('GET CONTACTS ERR', e?.message);
    }
  };

  const handleSelectContact = phoneNumber => {
    const selected = {...selectedContacts};
    if (selected[phoneNumber]) {
      selected[phoneNumber] = false;
    } else {
      selected[phoneNumber] = true;
    }
    setSelectedContacts(selected);
  };

  const renderList = item => {
    const isSelected = selectedContacts[item.item.phoneNumber];
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          paddingVertical: 7,
          backgroundColor: isSelected ? '#ff4d4d' : '#ffffff',
        }}
        onPress={() => handleSelectContact(item.item.phoneNumber)}>
        <Text style={{color: isSelected ? '#ffffff' : 'black'}}>
          {item.item.displayName}
        </Text>
        <Text style={{color: isSelected ? '#ffffff' : 'grey'}}>
          {item.item.phoneNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSearch = text => {
    setSearchTerm(text);

    // Convert the input and fields to lowercase for case-insensitive matching
    const filtered = data.filter(contact => {
      const nameMatch = contact.displayName
        ?.toLowerCase()
        .includes(text.toLowerCase());
      const phoneMatch = contact.phoneNumber
        ?.toLowerCase()
        .includes(text.toLowerCase());

      return nameMatch || phoneMatch; // If either name or phone matches, return the contact
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchContacts();
  }, []);
  return (
    <View style={{backgroundColor: 'white'}}>
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        <TextInput
          style={{
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 10,
            color: 'black',
          }}
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <FlatList
          data={filteredData}
          renderItem={renderList}
          extraData={filteredData}
          style={{marginTop: 20}}
        />
      </View>
    </View>
  );
};

export default Contacts;
