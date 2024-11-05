import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {forwardRef, Ref, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import TextInput from '../../../Components/TextInput';
import BottomSheet from '../../../Components/BottomSheet';
import closeIcon from '../../../Assets/icons/close.png';
import {createGroupSchema, validate} from '../../../Utils/yup';
import styles from './style';

interface CreateGroupSheetProps {
  onCreateGroup: (groupDetails: GroupDetails) => void;
  loading?: boolean;
  onCloseModal?: () => void;
}

type GroupDetails = {
  groupName: string;
  description: string;
};
const INITIAL_STATE = {
  groupName: '',
  description: '',
};

const CreateGroupSheet = forwardRef<BottomSheetModal, CreateGroupSheetProps>(
  ({onCreateGroup, loading, onCloseModal}, ref: Ref<BottomSheetModal>) => {
    const [groupDetails, setGroupDetails] =
      useState<GroupDetails>(INITIAL_STATE);

    const [errors, setErrors] = useState<GroupDetails>(INITIAL_STATE);

    const handleTextChange = (text: string, key: keyof GroupDetails) => {
      const data = {...groupDetails};
      const err = {...errors};
      data[key] = text;
      err[key] = '';
      setGroupDetails(data);
      setErrors(err);
    };

    const onCreatePress = async () => {
      try {
        const errors = await validate(createGroupSchema, groupDetails);
        if (Object.keys(errors).length) {
          setErrors(errors as GroupDetails);
          return;
        }
        onCreateGroup(groupDetails);
      } catch (e) {
        console.log('onCreatePress ERR ===>', e.message);
      }
    };

    const onSheetSnapIndexChange = (index: number) => {
      if (index === -1) {
        setGroupDetails(INITIAL_STATE);
        setErrors(INITIAL_STATE);
      }
    };

    const renderHeader = () => (
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeIconBox} onPress={onCloseModal}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <TouchableOpacity onPress={onCreatePress}>
            <Text style={styles.headerActionText}>Create</Text>
          </TouchableOpacity>
        )}
      </View>
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={['35%']}
        renderHeader={renderHeader}
        onChange={onSheetSnapIndexChange}
        enablePanDownToClose={false}>
        <View style={styles.contentBox}>
          <TextInput
            placeholder="Group Name"
            onChangeText={text => handleTextChange(text, 'groupName')}
            value={groupDetails.groupName}
            error={errors.groupName}
          />
          <TextInput
            placeholder="Description"
            inputBoxStyle={styles.mt15}
            onChangeText={text => handleTextChange(text, 'description')}
            value={groupDetails.description}
          />
        </View>
      </BottomSheet>
    );
  },
);

export default CreateGroupSheet;
