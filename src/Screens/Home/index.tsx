import {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import parsePhoneNumberFromString, {findNumbers} from 'libphonenumber-js';

import Button from '../../Components/Button';
import GroupBox from './GroupBox';
import {BASE_URL} from '../../Utils/constants';
import MembersList from './MemberList';
import styles from './style';

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);

  const user = useSelector(state => state.user.data.user);
  const contatcs = useSelector(state => state.contacts.data);
  const navigation = useNavigation();

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const userUid = user.uid;
      const contactWithAccount = contatcs.contactsWithAccount;
      // 1. Fetch groups where the user is a member
      const groupSnapshots = await firestore()
        .collection('groups')
        .where('members', 'array-contains', userUid)
        .orderBy('createdAt', 'desc')
        .get();

      if (!groupSnapshots.empty) {
        let groupsWithMembersData = [];

        // 2. Loop through each group
        for (const groupDoc of groupSnapshots.docs) {
          const groupData = groupDoc.data();
          let membersData = [];

          // 3. Check for member UIDs in Redux state first
          for (const uid of groupData.members) {
            if (uid === userUid) {
              membersData.push(user);
            }
            if (uid !== userUid) {
              // Exclude current user
              let memberData = contactWithAccount.find(
                contact => contact.uid === uid,
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
                  membersData.push({uid, ...fetchedUserData});
                } else {
                  // 6. If not found in Firestore (optional handling)
                  membersData.push({uid});
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
        console.log("groupsWithMembersData", groupsWithMembersData[0].members)
        setGroups(groupsWithMembersData);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const ringAlarm = async grpData => {
    try {
      const tokens = [];
      grpData.members.forEach(item => {
        if (item.uid !== user.uid && item.deviceToken) {
          tokens.push(item.deviceToken);
        }
      });

      console.log("TOKEN", tokens)
      if (tokens.length) {
        console.log('IFFFFFFFFFFFFF')
        const res = await axios.post(`${BASE_URL}/send-notifications`, {
          tokens,
        });
      }
      Alert.alert('Success', 'Alarm Rang');
    } catch (e) {
      Alert.alert('Error', e?.message);
    }
  };

  const toggleModal = () => {
    setOpenMembersModal(!openMembersModal);
  };

  const onBoxPress = data => {
    setSelectedGroup(data);
    console.log("data", data.members)
    toggleModal();
  };

  const renderList = ({item}) => (
    <View style={styles.grpListBox}>
      <GroupBox
        item={item}
        onBtnPress={() => ringAlarm(item)}
        onBoxPress={() => onBoxPress(item)}
      />
    </View>
  );

  const navigateToContacts = () => {
    navigation.navigate('Contacts');
  };

  // useEffect(() => {
  //   console.log("USE EFFECT")
  //   loadUserGroups();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserGroups();
    }, []),
  );

  // useEffect(() => {
  //   const phoneNumber = parsePhoneNumberFromString('03442779759', 'PK');
  //   console.log('******************');
  //   console.log('ISVALID ====>', phoneNumber?.isValid());
  //   console.log('number', phoneNumber?.number);
  //   console.log('country', phoneNumber?.country);
  // }, []);

  return (
    <>
      <MembersList
        data={selectedGroup}
        onClose={toggleModal}
        isVisible={openMembersModal}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Groups</Text>
        <Button
          text="Create Group"
          onPress={navigateToContacts}
          containerStyle={styles.createGrpBtncontainer}
        />
        {loading && (
          <View style={{marginTop: 20}}>
            <ActivityIndicator size={'large'} />
          </View>
        )}

        {!loading && !groups.length && <Text style={styles.noDataMessage}>No Groups</Text>}
        {!loading && !!groups.length && (
          <FlatList
            data={groups}
            renderItem={renderList}
            keyExtractor={(item, index) => item.groupId}
          />
        )}
      </View>
    </>
  );
};

export default Home;
