import {useState, useCallback} from 'react';
import {Text, View, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {BASE_URL} from '../../Constants';
import {requestLocationPermission, getPositionAsync} from '../../Utils';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {useAppSelector} from '../../Hooks/useAppSelector';
import {ContactWithAccount} from '../../Types/dataType';
import TextInput from '../../Components/TextInput';
import searchIcon from '../../Assets/icons/search.png';
import TabView from '../../Components/TabView';
import AllGroups from './AllGroups';
import PublicGroups from './PublicGroups';
import styles from './style';

export type Group = {
  groupId: string;
  groupName: string;
  createdBy: string;
  members: ContactWithAccount[];
};

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, ScreenNameConstants.HOME>) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const user = useAppSelector(state => state.user.data.user);
  const contatcs = useAppSelector(state => state.contacts.data);

  const navigateToContacts = () => {
    navigation.navigate(ScreenNameConstants.CONTACTS);
  };

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
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <Text style={styles.title}>Groups</Text>
          <TextInput
            placeholder="Search"
            inputBoxStyle={styles.input}
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
