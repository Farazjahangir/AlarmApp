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
import backIcon from '../../../Assets/icons/back.png';
import {createGroupSchema, validate} from '../../../Utils/yup';
import styles from './style';

interface CreateGroupSheetProps {
  onCreateGroup: () => void;
  loading?: boolean;
  onBackPress?: () => void;
  onBackDropPress?: () => void;
  data: GroupDetails;
  handleOnChange: (data: GroupDetails) => void;
}

type GroupDetails = {
  groupName: string;
  description?: string;
};
const INITIAL_STATE = {
  groupName: '',
  description: '',
};

const CreateGroupSheet = forwardRef<BottomSheetModal, CreateGroupSheetProps>(
  (
    {
      onCreateGroup,
      loading,
      onBackPress,
      onBackDropPress,
      data = INITIAL_STATE,
      handleOnChange,
    },
    ref: Ref<BottomSheetModal>,
  ) => {
    const [errors, setErrors] = useState<GroupDetails>(INITIAL_STATE);

    const handleTextChange = (text: string, key: keyof GroupDetails) => {
      const newData = {...data};
      const err = {...errors};
      newData[key] = text;
      err[key] = '';
      handleOnChange(newData);
      setErrors(err);
    };

    const onCreatePress = async () => {
      try {
        const errors = await validate(createGroupSchema, data);
        if (Object.keys(errors).length) {
          setErrors(errors as GroupDetails);
          return;
        }
        onCreateGroup();
      } catch (e) {
        console.log('onCreatePress ERR ===>', e.message);
      }
    };

    const onSheetSnapIndexChange = (index: number) => {
      if (index === -1) {
        setErrors(INITIAL_STATE);
      }
    };

    const renderHeader = () => (
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeIconBox} onPress={onBackPress}>
          <Image source={backIcon} style={styles.closeIcon} />
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
        enablePanDownToClose={false}
        onBackDropPress={onBackDropPress}
        onChange={onSheetSnapIndexChange}>
        <View style={styles.contentBox}>
          <TextInput
            placeholder="Group Name"
            onChangeText={text => handleTextChange(text, 'groupName')}
            value={data.groupName}
            error={errors.groupName}
          />
          <TextInput
            placeholder="Description"
            inputBoxStyle={styles.mt15}
            onChangeText={text => handleTextChange(text, 'description')}
            value={data.description}
          />
        </View>
      </BottomSheet>
    );
  },
);

export default CreateGroupSheet;
