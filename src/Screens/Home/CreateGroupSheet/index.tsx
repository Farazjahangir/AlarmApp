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
import SelectInput from '../../../Components/SelectInput';
import {GROUP_TYPES} from '../../../Constants';
import ImageUploader from '../../../Components/ImageUploader';
import {SelectedImage} from '../../../Types/dataType';
import {useUploadFile} from '../../../Hooks/reactQuery/useUploadImage';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import { handleError } from '../../../Utils/helpers';
import { useMessageBox } from '../../../Context/MessageBoxContextProvider';
import styles from './style';

interface CreateGroupSheetProps {
  onCreateGroup: () => void;
  loading?: boolean;
  onBackPress?: () => void;
  onBackDropPress?: () => void;
  data: GroupDetails;
  handleOnChange: (data: GroupDetails) => void;
  setImageMetadata?: (image: SelectedImage) => void;
  isEditMode?: boolean
}

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

const CreateGroupSheet = forwardRef<BottomSheetModal, CreateGroupSheetProps>(
  (
    {
      onCreateGroup,
      loading,
      onBackPress,
      onBackDropPress,
      data,
      handleOnChange,
      setImageMetadata = () => {},
      isEditMode
    },
    ref: Ref<BottomSheetModal>,
  ) => {
    const [errors, setErrors] = useState<GroupDetails>(INITIAL_STATE);
    const { openMessageBox } = useMessageBox()

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
        const error = handleError(e)
        openMessageBox({
          title: 'Error',
          message: error
        })
      }
    };

    const onSheetSnapIndexChange = (index: number) => {
      if (index === -1) {
        setErrors(INITIAL_STATE);
      }
    };

    const onImageSelected = async (image: SelectedImage) => {
      try {
        const newData = {...data};
        newData.image = image.path;
        setImageMetadata(image);
        handleOnChange(newData);
      } catch (e) {
        const error = handleError(e)
        openMessageBox({
          title: 'Error',
          message: error
        })
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
            <Text style={styles.headerActionText}>{isEditMode ? "Edit" : "Create"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={['55%']}
        renderHeader={renderHeader}
        enablePanDownToClose={false}
        onBackDropPress={onBackDropPress}
        onChange={onSheetSnapIndexChange}>
        <View style={styles.contentBox}>
          <BottomSheetScrollView
            contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.pictureBox}>
              <ImageUploader onImageSelected={onImageSelected} />
            </View>
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
            <SelectInput
              items={GROUP_TYPES}
              inputAndroidContainerStyle={styles.mt15}
              placeholder="Group Type"
              onValueChange={value => handleTextChange(value, 'groupType')}
              value={data.groupType}
              error={errors.groupType}
            />
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  },
);

export default CreateGroupSheet;
