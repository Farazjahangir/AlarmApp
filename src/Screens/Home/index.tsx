import {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

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
        .get();

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
              console.log('FIRESTOER= ====>');
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
      setGroups(groupsWithMembersData);
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
        if (item.uid !== user.uid) {
          tokens.push(item.deviceToken);
        }
      });

      const res = await axios.post(
        'https://8c34-144-48-129-18.ngrok-free.app/send-notifications',
        {
          tokens,
        },
      );
      console.log('rES ==>', res.data);
    } catch (e) {
      console.log('ringAlarm ERR', e.message);
    }
  };

  const renderList = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      }}>
      <View style={{flex: 1}}>
        <Text style={{color: 'black', fontSize: 18}}>{item.groupName}</Text>
        <Text style={{color: 'black', fontSize: 12}}>
          Member Count: {item.members.length}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff4d4d',
          height: 35,
          justifyContent: 'center',
          width: 35,
          alignItems: 'center',
          borderRadius: 5,
        }}
        onPress={() => ringAlarm(item)}>
        <Text style={{color: 'black', fontSize: 14, color: '#ffffff'}}>
          Ring
        </Text>
      </TouchableOpacity>
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
      loadUserGroups()
    }, [])
  );

  return (
    <View style={{paddingHorizontal: 15}}>
      <Text style={{fontSize: 25, color: 'black', marginTop: 10}}>Groups</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff4d4d',
          width: 100,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={navigateToContacts}>
        <Text style={{color: '#ffffff'}}>Create Group</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={{marginTop: 20}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderList}
          keyExtractor={(item, index) => item.groupId}
        />
      )}
    </View>
  );
};

export default Home;
