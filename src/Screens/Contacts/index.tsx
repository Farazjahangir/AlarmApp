import {useEffect, useState} from 'react';
import {Text, FlatList, View, TouchableOpacity} from 'react-native';
import RNContacts from 'react-native-contacts';

const Contacts = () => {
  const [data, setData] = useState([]);
  //   const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedContacts, setSelectedContacts] = useState({});

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
    } catch (e) {
      console.log('GET CONTACTS ERR', e?.message);
    }
  };

  const handleSelectContact = phoneNumber => {
    const selected = { ...selectedContacts }
    if (selected[phoneNumber]) {
        selected[phoneNumber] = false
    } else {
        selected[phoneNumber] = true
    }
    setSelectedContacts(selected) 
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


  useEffect(() => {
    fetchContacts();
  }, []);
  return (
    <FlatList
      data={data}
      renderItem={renderList}
      style={{backgroundColor: 'white', flex: 1, flexGrow: 1}}
      extraData={selectedContacts}
    />
  );
};

export default Contacts;
