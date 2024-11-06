import {useState, useCallback, useRef} from 'react';
import {Text, View, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {BASE_URL} from '../../Constants';
import {
  requestLocationPermission,
  getPositionAsync,
  cleanString,
} from '../../Utils';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {useAppSelector} from '../../Hooks/useAppSelector';
import {Contact, ContactWithAccount} from '../../Types/dataType';
import TextInput from '../../Components/TextInput';
import searchIcon from '../../Assets/icons/search.png';
import TabView from '../../Components/TabView';
import AllGroups from './AllGroups';
import PublicGroups from './PublicGroups';
import FloatingButton from '../../Components/FloatingButton';
import createGroupIcon from '../../Assets/icons/createGroup.png';
import ContactList from './ContactList';
import CreateGroupSheet from './CreateGroupSheet';
import styles from './style';

export type Group = {
  groupId: string;
  groupName: string;
  createdBy: string;
  members: ContactWithAccount[];
};

type GroupDetails = {
  groupName: string;
  description?: string;
};

const INITIAL_STATE = {
  groupName: '',
  description: '',
};

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, ScreenNameConstants.HOME>) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<SelectedContacts>(
    {},
  );
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(INITIAL_STATE)

  const user = useAppSelector(state => state.user.data.user);
  const contatcs = useAppSelector(state => state.contacts.data);
  const contactSheetModalRef = useRef<BottomSheetModal>(null);
  const createGroupSheetModalRef = useRef<BottomSheetModal>(null);

  const checkForLocationPermission = () => requestLocationPermission();

  const ringAlarm = async (grpData: Group) => {
    try {
      if (!(await checkForLocationPermission())) return;
      const userLocation = await getPositionAsync();
      const tokens: string[] = [];
      grpData.members.forEach(item => {
        if (item.user?.uid !== user?.uid && item.user?.deviceToken) {
          tokens.push(item.user?.deviceToken);
        }
      });

      const payload = {
        coords: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
      };
      if (tokens.length) {
        const res = await axios.post(`${BASE_URL}/send-notifications`, {
          tokens,
          payload,
        });
      }
      Alert.alert('Success', 'Alarm Rang');
    } catch (e) {
      Alert.alert('Error', e?.message);
    }
  };

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const userUid = user?.uid;
      const contactWithAccount = contatcs.contactsWithAccount;
      // 1. Fetch groups where the user is a member
      const groupSnapshots = await firestore()
        .collection('groups')
        .where('members', 'array-contains', userUid)
        .orderBy('createdAt', 'desc')
        .get();

      if (!groupSnapshots.empty) {
        let groupsWithMembersData: Group[] = [];

        // 2. Loop through each group
        for (const groupDoc of groupSnapshots.docs) {
          const groupData = groupDoc.data();
          let membersData: ContactWithAccount[] = [];

          // 3. Check for member UIDs in Redux state first
          for (const uid of groupData.members) {
            if (uid === userUid) {
              membersData.push({user});
            }
            if (uid !== userUid) {
              // Exclude current user
              let memberData = contactWithAccount.find(
                contact => contact.user?.uid === uid,
              );

              if (memberData) {
                // 4. If member data found in Redux, push it to membersData
                membersData.push(memberData);
              } else {
                // 5. If member data not found in Redux, fetch from Firestore
                const userSnapshot = await firestore()
                  .collection('users')
                  .doc(uid)
                  .get();
                if (userSnapshot.exists) {
                  const fetchedUserData = userSnapshot.data();
                  membersData.push({user: {...fetchedUserData, uid}});
                }
              }
            }
          }

          // 7. Build the group object with member data
          groupsWithMembersData.push({
            groupId: groupDoc.id,
            groupName: groupData.groupName,
            createdBy: groupData.createdBy,
            members: membersData,
          });
        }
        setGroups(groupsWithMembersData);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const openContactList = () => {
    contactSheetModalRef.current?.present();
  };

  const onCloseContactListModal = () => {
    contactSheetModalRef.current?.dismiss();
    setSelectedContacts({});
    onCloseGroupDetailsModal()
  };

  const onCloseGroupDetailsModal = () => {
    createGroupSheetModalRef.current?.dismiss();
    setGroupDetails({...INITIAL_STATE});
  };

  const onContactListBackDropPress = () => {
    onCloseContactListModal();
    onCloseGroupDetailsModal()
  };

  const onGroupListBackDropPress = () => {
    onCloseContactListModal();
    onCloseGroupDetailsModal()
  };

  const onSelectedContacts = (selectedContacts: SelectedContacts) => {
    setSelectedContacts(selectedContacts);
    contactSheetModalRef.current?.dismiss();
    createGroupSheetModalRef.current?.present();
  };

  const separateActiveAndNonActiveContacts = () => {
    const selectedContactsData: string[] = [];
    const contactsWithoutUID: Contact[] = [];
    const data = [
      ...contatcs.contactsWithAccount,
      ...contatcs.contactsWithoutAccount,
    ];
    data.forEach((contact: ContactWithAccount) => {
      if (contact.phoneNumber && selectedContacts[contact.phoneNumber]) {
        if (contact.user?.uid) {
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
    const batchSize = 30; // Firestore 'in' query can handle up to 30 numbers
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
      setCreateGroupLoading(true);
      const uids = await createSelectedUsersUIDArr();
      const payload = {
        groupName: groupDetails.groupName,
        createdBy: user?.uid,
        members: [user?.uid, ...uids],
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('groups').add(payload);
      createGroupSheetModalRef.current?.dismiss();
    } catch (e) {
      console.log('onCreateGroup ERR', e.message);
    } finally {
      setCreateGroupLoading(false);
    }
  };

  const onGroupDetailsBackPress = () => {
    createGroupSheetModalRef.current?.dismiss();
    contactSheetModalRef.current?.present()
  };

  const handleSelectContact = (phoneNumber: string) => {
    const selected: SelectedContacts = {...selectedContacts};
    if (selected[phoneNumber]) {
      delete selected[phoneNumber];
    } else {
      selected[phoneNumber] = true;
    }
    setSelectedContacts(selected);
  };

  useFocusEffect(
    useCallback(() => {
      loadUserGroups();
    }, []),
  );

  const routes = [
    {
      key: 'allGroups',
      title: 'All',
      component: AllGroups,
      props: {ringAlarm, groups, loadUserGroups, loading},
    },
    {
      key: 'publicGroups',
      title: 'Public',
      component: PublicGroups,
      props: {ringAlarm},
    },
  ];

  return (
    <>
      <ContactList
        ref={contactSheetModalRef}
        onCloseModal={onCloseContactListModal}
        onSelectContacts={onSelectedContacts}
        selectedContacts={selectedContacts}
        handleSelectContact={handleSelectContact}
        onBackDropPress={onContactListBackDropPress}
      />
      <CreateGroupSheet
        ref={createGroupSheetModalRef}
        onCreateGroup={onCreateGroup}
        loading={createGroupLoading}
        onBackPress={onGroupDetailsBackPress}
        onBackDropPress={onGroupListBackDropPress}
        handleOnChange={setGroupDetails}
        data={groupDetails}
      />
      <View style={styles.container}>
        {/* <BottomSheet isVisible>
          <Text style={{ color: 'black' }}>Hello</Text>
        </BottomSheet> */}
        <FloatingButton icon={createGroupIcon} onPress={openContactList} />
        <View style={styles.contentBox}>
          <Text style={styles.title}>Groups</Text>
          <TextInput
            placeholder="Search"
            // inputBoxStyle={styles.input}
            containerStyle={styles.mt15}
            leftIcon={searchIcon}
          />
          <View style={styles.tabContainer}>
            <TabView routes={routes} />
          </View>
        </View>
      </View>
    </>
  );
};

export default Home;
