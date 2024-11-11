import {useState} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';

import GroupBox from '../GroupBox';
import MembersList from '../MemberList';
import {useAppSelector} from '../../../Hooks/useAppSelector';
import { Group } from '../../../Types/dataType';
import styles from './style';

interface PrivateGroupsProps {
    ringAlarm: (grpData: Group) => void;
    groups: Group[] | [];
    refetchUserGroups: () => void;
    loading: boolean
}

const PrivateGroups = ({ringAlarm, groups = [], refetchUserGroups, loading}: PrivateGroupsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);

  const toggleModal = () => {
    setOpenMembersModal(!openMembersModal);
  };

  const onBoxPress = (data: Group) => {
    setSelectedGroup(data);
    toggleModal();
  };

  const renderList = ({item}: {item: Group}) => (
    <View style={styles.grpListBox}>
      <GroupBox
        item={item}
        onBtnPress={() => ringAlarm(item)}
        onBoxPress={() => onBoxPress(item)}
      />
    </View>
  );

  return (
    <>
      {loading && (
        <View style={{marginTop: 20}}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      {!loading && !groups.length && (
        <Text style={styles.noDataMessage}>No Groups</Text>
      )}
      <MembersList
        data={selectedGroup}
        onClose={toggleModal}
        isVisible={openMembersModal}
      />
      {!loading && !!groups.length && (
        <FlatList
          data={groups}
          renderItem={renderList}
          keyExtractor={(item, index) => item.uid}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetchUserGroups} />
          }
        />
      )}
    </>
  );
};

export default PrivateGroups;
