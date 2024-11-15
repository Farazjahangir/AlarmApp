import {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {v4 as uuidv4} from 'uuid';

import {
  requestLocationPermission,
  getPositionAsync,
  getFileExtension,
} from '../../Utils';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {useAppSelector} from '../../Hooks/useAppSelector';
import {
  ContactWithAccount,
  Group,
  User,
  SelectedImage,
} from '../../Types/dataType';
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
import PrivateGroups from './PrivateGroups';
import {useFetchUserGroups} from '../../Hooks/reactQuery/useFetchUserGroups';
import {useRingAlarm} from '../../Hooks/reactQuery/useRingAlarm';
import ImageUploader from '../../Components/ImageUploader';
import {useUploadFile} from '../../Hooks/reactQuery/useUploadImage';
import GroupOptionsSheet from './GroupOptionsSheet';
import styles from './style';

type GroupDetails = {
  groupName: string;
  description?: string;
  groupType: string;
  image?: string;
};

const INITIAL_STATE = {
  groupName: '',
  description: '',
  groupType: '',
  image: '',
};

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}

const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, ScreenNameConstants.HOME>) => {
  // const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<SelectedContacts>(
    {},
  );
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(INITIAL_STATE);
  const [imageMetadata, setImageMetadata] = useState<SelectedImage | null>(
    null,
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const user = useAppSelector(state => state.user.data.user);
  const contatcs = useAppSelector(state => state.contacts.data);
  const contactSheetModalRef = useRef<BottomSheetModal>(null);
  const createGroupSheetModalRef = useRef<BottomSheetModal>(null);
  const groupOptionsSheetRef = useRef<BottomSheetModal>(null);
  const createGroupMut = useCreateGroup();
  const uploadFileMut = useUploadFile();
  const {
    data: groups = [],
    isFetching: isGroupsLoading,
    refetch,
  } = useFetchUserGroups({
    user: user as User,
    contactWithAccount: contatcs.contactsWithAccount,
  });

  const ringAlarmMut = useRingAlarm();

  const checkForLocationPermission = () => requestLocationPermission();

  const ringAlarm = async (grpData: Group) => {
    try {
      if (!(await checkForLocationPermission())) return;
      const userLocation = await getPositionAsync();
      const tokens: string[] = [];
      (grpData.members as ContactWithAccount[]).forEach(item => {
        if (item.user?.uid !== user?.uid && item.user?.deviceToken) {
          tokens.push(item.user?.deviceToken);
        }
      });

      const payload = {
        name: user?.name as string,
        coords: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
      };
      if (tokens.length) {
        await ringAlarmMut.mutateAsync({tokens, payload});
      }
      Alert.alert('Success', 'Alarm Rang');
    } catch (e) {
      Alert.alert('Error', e?.message);
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

  const handleImageUpload = async () => {
    if (!imageMetadata) return null;
    const imageName = `${uuidv4()}.${getFileExtension(imageMetadata.mime)}`;
    const payload = {
      folder: `AlarmApp/groups`,
      file: {
        uri: imageMetadata.path,
        name: imageName,
        type: imageMetadata.mime,
      },
    };
    const res = await uploadFileMut.mutateAsync(payload);
    return res.secure_url;
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
        currentUserUid: user?.uid as string,
        description: groupDetails.description,
        groupType: groupDetails.groupType,
        image: '',
      };

      if (imageMetadata) {
        console.log('imageMetadata');
        const imageUri = await handleImageUpload();
        if (imageUri) payload.image = imageUri;
      }

      await createGroupMut.mutateAsync(payload);
      createGroupSheetModalRef.current?.dismiss();
      refetch();
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

  const refetchUserGroups = () => {
    refetch();
  };

  const onGroupBoxPress = (group: Group) => {
    setSelectedGroup(group);
    groupOptionsSheetRef.current?.present();
  };

  const onCloseGroupOptionsSheet = () => {
    groupOptionsSheetRef.current?.dismiss();
  };

  const seperatedGroupsWithTypes = useMemo(() => {
    const privateGroups: Group[] = [];
    const publicGroups: Group[] = [];

    if (groups.length) {
      groups.forEach(item => {
        if (item.groupType === 'public') {
          publicGroups.push(item);
        }
        if (item.groupType === 'private') {
          privateGroups.push(item);
        }
      });
    }

    return {
      privateGroups,
      publicGroups,
    };
  }, [groups]);

  const routes = [
    {
      key: 'allGroups',
      title: 'All',
      component: AllGroups,
      props: {
        ringAlarm,
        groups,
        loading: isGroupsLoading,
        refetchUserGroups,
        onBoxPress: onGroupBoxPress,
      },
    },
    {
      key: 'publicGroups',
      title: 'Public',
      component: PublicGroups,
      props: {
        ringAlarm,
        groups: seperatedGroupsWithTypes.publicGroups,
        loading: isGroupsLoading,
        refetchUserGroups,
      },
    },
    {
      key: 'privateGroups',
      title: 'Private',
      component: PrivateGroups,
      props: {
        ringAlarm,
        groups: seperatedGroupsWithTypes.privateGroups,
        loading: isGroupsLoading,
        refetchUserGroups,
      },
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
        loading={createGroupMut.isPending || uploadFileMut.isPending}
        onBackPress={onGroupDetailsBackPress}
        onBackDropPress={onGroupListBackDropPress}
        handleOnChange={setGroupDetails}
        data={groupDetails}
        setImageMetadata={setImageMetadata}
      />
      <GroupOptionsSheet
        ref={groupOptionsSheetRef}
        data={selectedGroup}
        onCloseSheet={onCloseGroupOptionsSheet}
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
