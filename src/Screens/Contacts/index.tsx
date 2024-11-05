import {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import RNContacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import Button from '../../Components/Button';
import TextInput from '../../Components/TextInput';
import ContactList from './ContactList';
import {
  cleanString,
  hasContactPermission,
  fetchContacts,
  checkContactsWithFirestore,
  askContactsPermission,
} from '../../Utils';
import {
  setContacts,
  setContactLoading,
} from '../../Redux/contacts/contactSlice';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {useAppSelector} from '../../Hooks/useAppSelector';
import {useAppDispatch} from '../../Hooks/useAppDispatch';
import {Contact, ContactWithAccount} from '../../Types/dataType';
import styles from './style';

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}

interface Header {
  type: 'header';
  title: string;
}

export type CombinedContact =
  | (ContactWithAccount & {type: 'withAccount'})
  | (Contact & {type: 'withoutAccount'})
  | Header;

const Contacts = ({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  ScreenNameConstants.CONTACTS
>) => {
  const [data, setData] = useState<CombinedContact[]>([]);
  //   const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedContacts, setSelectedContacts] = useState<SelectedContacts>(
    {},
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [grpName, setGrpName] = useState('');
  const [filteredData, setFilteredData] = useState<CombinedContact[]>([]);
  const [createGrpLoading, setCreateGrpLoading] = useState(false);
  const [errors, setErrors] = useState({
    grpName: '',
    contacts: '',
  });

  const contatcs = useAppSelector(state => state.contacts.data);
  const contactsLoading = useAppSelector(state => state.contacts.loading);
  const user = useAppSelector(state => state.user.data.user);
  const dispatch = useAppDispatch();

  const handleSelectContact = (phoneNumber: string) => {
    setErrors({...errors, contacts: ''});
    const selected: SelectedContacts = {...selectedContacts};
    if (selected[phoneNumber]) {
      delete selected[phoneNumber];
    } else {
      selected[phoneNumber] = true;
    }
    setSelectedContacts(selected);
  };

  const renderList = ({item}: {item: CombinedContact}) => {
    return (
      <ContactList
        item={item}
        selectedContacts={selectedContacts}
        // handleSelectContact={() =>
        //   handleSelectContact((item as ContactWithAccount)?.user.number || (item as Contact).phoneNumber)
        // }
        handleSelectContact={() =>
          handleSelectContact((item as Contact).phoneNumber)
        }
      />
    );
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const lowerCaseSearchTerm = text.toLowerCase();
    // Filter the 'withAccount' section
    const withAccountContacts = data.filter(contact => {
      // console.log("withAccountContacts ===>", contact.displayName)
      return (
        contact.type === 'withAccount' &&
        (contact.displayName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.phoneNumber?.includes(lowerCaseSearchTerm))
      );
    });

    // Filter the 'withoutAccount' section
    const withoutAccountContacts = data.filter(
      contact => {
      // console.log("withoutAccountContacts ===>", contact.displayName)
        return (
          contact.type === 'withoutAccount' &&
        (contact.displayName.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.phoneNumber.includes(lowerCaseSearchTerm))
        )
      }
    );

    // console.log("withAccountContacts", withAccountContacts)
    // console.log("withoutAccountContacts", withoutAccountContacts)

    // Prepare the filtered data
    let filteredData: CombinedContact[] = [];

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

  const checkdata = filteredData.filter(
    item => item.displayName === 'D Rameez New',
  );
  console.log('checkdata ============> filteredData ======>', checkdata);

  // console.log("DATA ===>", data)
  const mergeData = () => {
    const combinedContacts: CombinedContact[] = [];

    if (contatcs.contactsWithAccount.length) {
      combinedContacts.push({type: 'header', title: 'Contacts on AlarmApp'});
      combinedContacts.push(
        ...contatcs.contactsWithAccount.map(contact => ({
          ...contact,
          type: 'withAccount' as const, // Ensure the type is added
        })),
      );
    }

    if (contatcs.contactsWithoutAccount.length) {
      combinedContacts.push({
        type: 'header',
        title: 'Contacts Not on AlarmApp',
      });
      combinedContacts.push(
        ...contatcs.contactsWithoutAccount.map(contact => {
          return {
            ...(contact as Contact),
            type: 'withoutAccount' as const, // Ensure the type is added
          };
        }),
      );
    }
    //   const combinedContacts: CombinedContact[] = [
    //     { type: 'header', title: 'Contacts on AlarmApp' },
    //     ...contatcs.contactsWithAccount.map((contact: ContactWithAccount) => ({
    //         ...contact,
    //         type: 'withAccount' as const, // Use 'as const' to assert the string literal
    //     })),
    //     { type: 'header', title: 'Contacts Not on AlarmApp' },
    //     ...contatcs.contactsWithoutAccount.map((contact: Contact) => ({
    //         ...contact,
    //         type: 'withoutAccount' as const, // Use 'as const' to assert the string literal
    //     })),
    // ];
    setData(combinedContacts);
    setFilteredData(combinedContacts);
  };

  const onChangeGrpName = (text: string) => {
    setGrpName(text);
    setErrors({...errors, grpName: ''});
  };

  const separateActiveAndNonActiveContacts = () => {
    const selectedContactsData: string[] = [];
    const contactsWithoutUID: Contact[] = [];

    data.forEach(contact => {
      // Skip headers
      if (contact.type === 'header') return;

      if (contact.phoneNumber && selectedContacts[contact.phoneNumber]) {
        if ((contact as ContactWithAccount)?.user?.uid) {
          // Add contacts with UID directly
          selectedContactsData.push(
            (contact as ContactWithAccount).user?.uid as string,
          );
        } else {
          // Collect contacts without UID for later processing
          contactsWithoutUID.push(contact as Contact);
        }
      }
    });

    return {
      selectedContactsData,
      contactsWithoutUID,
    };
  };

  const processFirestoreData = async (contactsWithoutUID: Contact[]) => {
    const foundUserUIDs: string[] = [];
    const newUserUIDs: string[] = [];
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
          const newUserRef = await firestore()
            .collection('users')
            .add({
              name: contact.displayName,
              number: cleanString(contact.phoneNumber),
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
    console.log('createSelectedUsersUIDArr');

    // If no contacts need further processing, return early
    if (contactsWithoutUID.length === 0) return selectedContactsData;

    // Process Firestore data (both find and create users in one pass)
    const {foundUserUIDs, newUserUIDs} = await processFirestoreData(
      contactsWithoutUID,
    );

    return [...selectedContactsData, ...foundUserUIDs, ...newUserUIDs];
  };

  const validate = () => {
    let isValid = true;
    const errorText = {...errors};

    if (!grpName) {
      errorText.grpName = 'Required';
      isValid = false;
    }

    if (!Object.keys(selectedContacts).length) {
      errorText.contacts = 'Please Select atleast on contact';
      isValid = false;
    }

    setErrors(errorText);
    return isValid;
  };

  const onCreateGroup = async () => {
    try {
      if (!validate()) return;
      setCreateGrpLoading(true);
      const uids = await createSelectedUsersUIDArr();
      const payload = {
        groupName: grpName,
        createdBy: user?.uid,
        members: [user?.uid, ...uids],
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('groups').add(payload);
      navigation.navigate(ScreenNameConstants.HOME);
    } catch (e) {
      console.log('onCreateGroup ERR', e.message);
    } finally {
      setCreateGrpLoading(false);
    }
  };

  const getContacts = async () => {
    try {
      dispatch(setContactLoading(true));
      // await new Promise(resolve => setTimeout(resolve, 500));

      const contacts = await fetchContacts();
      const firestoreRes = await checkContactsWithFirestore(contacts, user);
      dispatch(
        setContacts({
          contactsWithAccount: firestoreRes?.contactsWithAccount,
          contactsWithoutAccount: firestoreRes?.contactsWithoutAccount,
        }),
      );
    } catch (e) {
      Alert.alert(
        'Error in read contacts',
        e?.message || 'Something went wrong',
      );
    } finally {
      dispatch(setContactLoading(false));
    }
  };

  const checkForContactPermission = async () => {
    try {
      const hasPermission = await hasContactPermission();
      if (!hasPermission) {
        await askContactsPermission();
        getContacts();
      }
    } catch (e) {
      Alert.alert('Permission Error', e?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (
      contatcs.contactsWithAccount.length ||
      contatcs.contactsWithoutAccount.length
    ) {
      // const checkdata = data.filter(
      //   item => item.displayName === 'D Rameez New',
      // );
      // console.log('checkdata ======>', checkdata);
      mergeData();
    }
  }, [contatcs.contactsWithAccount, contatcs.contactsWithoutAccount]);

  useEffect(() => {
    checkForContactPermission();
  }, []);
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
          error={errors.grpName}
        />
        <View style={styles.createBtnBox}>
          <Button
            text="Create Group"
            onPress={onCreateGroup}
            loading={createGrpLoading}
            disabled={createGrpLoading}
          />
        </View>
        {errors.contacts && <Text style={styles.error}>{errors.contacts}</Text>}
        {/* {contactsLoading && (
          <View style={{marginTop: 20}}>
            <ActivityIndicator size="large" />
          </View>
        )} */}
        <FlatList
          data={filteredData}
          renderItem={renderList}
          // extraData={filteredData}
          // keyExtractor={(item, index) => (item as Contact).phoneNumber}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={contactsLoading}
              onRefresh={getContacts}
            />
          }
        />
      </View>
    </View>
  );
};

export default Contacts;
