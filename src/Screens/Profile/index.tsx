import {useCallback, useEffect, useState} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {v4 as uuidv4} from 'uuid';

import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import ImageUploader from '../../Components/ImageUploader';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import {useAppSelector} from '../../Hooks/useAppSelector';
import {validate, updateProfileSchema} from '../../Utils/yup';
import {SelectedImage} from '../../Types/dataType';
import {useUploadFile} from '../../Hooks/reactQuery/useUploadImage';
import {useUpdateUserProfile} from '../../Hooks/reactQuery/useUpdateUserProfile';
import {getFileExtension} from '../../Utils';
import {useAppDispatch} from '../../Hooks/useAppDispatch';
import {setUser} from '../../Redux/user/userSlice';
import styles from './style';

type UserData = {
  name: string;
  image: string;
  address: string;
};

type UpdatePayload = {
  data: {
    name: string;
    image?: string;
    address?: string;
  };
  uid: string;
};

const INITIAL_STATE: UserData = {
  name: '',
  image: '',
  address: '',
};

const Profile = ({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  ScreenNameConstants.ALARM_SCREEN
>) => {
  const user = useAppSelector(state => state.user.data.user);
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<UserData>(INITIAL_STATE);
  const [errors, setErrors] = useState<UserData>(INITIAL_STATE);
  const [imageMetadata, setImageMetadata] = useState<SelectedImage | null>(
    null,
  );

  const uploadFileMut = useUploadFile();
  const updateProfileMut = useUpdateUserProfile();

  const onChangeText = (text: string, key: keyof UserData) => {
    const newData = {...userData};
    const err = {...errors};
    newData[key] = text;
    err[key] = '';
    setUserData(newData);
    setErrors(err);
  };

  const handleImageUpload = async () => {
    if (!imageMetadata) return null;
    const imageName = `${uuidv4()}.${getFileExtension(imageMetadata.mime)}`;
    const payload = {
      folder: `AlarmApp/user/${user?.uid}`,
      file: {
        uri: imageMetadata.path,
        name: imageName,
        type: imageMetadata.mime,
      },
    };
    const res = await uploadFileMut.mutateAsync(payload);
    return res.secure_url;
  };

  const onSubmit = async () => {
    try {
      const errors = await validate(updateProfileSchema, userData);
      if (Object.keys(errors).length) {
        setErrors(errors as UserData);
        return;
      }

      const payload: UpdatePayload = {
        data: {
          name: userData.name,
          address: userData.address
        },
        uid: user?.uid as string,
      };

      if (imageMetadata) {
        const imageUrl = await handleImageUpload();
        payload.data.image = imageUrl as string;
      }

      const newData = await updateProfileMut.mutateAsync(payload);
      dispatch(setUser({user: newData}));
    } catch (e) {
      console.log('UPDATE PROFILE ERR', e);
    }
  };

  const onImageSelected = async (image: SelectedImage) => {
    try {
      setUserData({...userData, image: image.path});
      setImageMetadata(image);
    } catch (e) {
      console.log('onImageSelected ERR ==>', e?.response.data?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setUserData({
        name: user?.name,
        address: user?.address || '',
        image: user?.image || '',
      } as UserData);
      // No cleanup function needed here
    }, [user]), // Empty dependency array to run every time the screen is focused
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Profile</Text>
        <ScrollView>
          <View style={styles.imageBox}>
            <ImageUploader
              value={userData.image}
              onImageSelected={onImageSelected}
            />
          </View>
          <TextInput
            placeholder="Name"
            containerStyle={styles.inputContainer}
            value={userData.name}
            onChangeText={text => onChangeText(text, 'name')}
            error={errors.name}
          />
          <TextInput
            placeholder="Email"
            containerStyle={styles.inputContainer}
            value={user?.email}
            readOnly
          />
          <TextInput
            placeholder="Number"
            containerStyle={styles.inputContainer}
            value={user?.number}
            readOnly
          />
          <TextInput
            placeholder="Address"
            containerStyle={styles.inputContainer}
            value={userData.address}
            onChangeText={text => onChangeText(text, 'address')}
          />
          <Button
            text="Submit"
            onPress={onSubmit}
            loading={uploadFileMut.isPending || updateProfileMut.isPending}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;
