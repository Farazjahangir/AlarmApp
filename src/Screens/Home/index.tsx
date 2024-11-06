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
import {useCreateGroup} from '../../Hooks/reactQuery/useCreateGroup';
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
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(INITIAL_STATE);

  const user = useAppSelector(state => state.user.data.user);
  const contatcs = useAppSelector(state => state.contacts.data);
  const contactSheetModalRef = useRef<BottomSheetModal>(null);
  const createGroupSheetModalRef = useRef<BottomSheetModal>(null);
  const createGroupMut = useCreateGroup();

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
    onCloseGroupDetailsModal();
  };

  const onCloseGroupDetailsModal = () => {
    createGroupSheetModalRef.current?.dismiss();
    setGroupDetails({...INITIAL_STATE});
  };

  const onContactListBackDropPress = () => {
    onCloseContactListModal();
    onCloseGroupDetailsModal();
  };

  const onGroupListBackDropPress = () => {
    onCloseContactListModal();
    onCloseGroupDetailsModal();
  };

  const onSelectedContacts = (selectedContacts: SelectedContacts) => {
    setSelectedContacts(selectedContacts);
    contactSheetModalRef.current?.dismiss();
    createGroupSheetModalRef.current?.present();
  };

  const onCreateGroup = async () => {
    try {
      const payload = {
        contacts: [
          ...contatcs.contactsWithAccount,
          ...contatcs.contactsWithoutAccount,
        ],
        selectedContacts,
        groupName: groupDetails.groupName,
        currentUserUid: user?.uid as string
      };
      await createGroupMut.mutateAsync(payload);
      createGroupSheetModalRef.current?.dismiss();
    } catch (e) {
      console.log('onCreateGroup ERR', e.message);
    }
  };

  const onGroupDetailsBackPress = () => {
    createGroupSheetModalRef.current?.dismiss();
    contactSheetModalRef.current?.present();
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
        loading={createGroupMut.isPending}
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
