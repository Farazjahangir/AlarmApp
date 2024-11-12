import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {setUser} from '../../Redux/user/userSlice';
import {registerDeviceForFCM} from '../../Utils';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {User} from '../../Types/dataType';
import {useLoginFirebase} from '../../Hooks/reactQuery/useLoginFirebase';
import { loginSchema, validate } from '../../Utils/yup';
import styles from './style';

type UserCreds = {
  email: string;
  password: string;
};
type Keys = keyof UserCreds;

const Login = ({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  typeof ScreenNameConstants.LOGIN
>) => {
  const [userCreds, setUserCreds] = useState<UserCreds>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<UserCreds>({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const loginFirebaseMut = useLoginFirebase();

  const handleTextChange = (text: string, key: Keys) => {
    const data = {...userCreds};
    const error = {...errors};
    data[key] = text;
    error[key] = '';
    setUserCreds(data);
    setErrors(error);
  };

  const handleSignin = async () => {
    try {
      const errors = await validate(loginSchema, userCreds)
      if (Object.keys(errors).length) {
        setErrors(errors as UserCreds)
        return
      }
      const userData = await loginFirebaseMut.mutateAsync({
        email: userCreds.email,
        password: userCreds.password,
      });
      if (userData) {
        dispatch(setUser({user:userData }));
        registerDeviceForFCM(userData.uid);
      }
    } catch (e) {
      Alert.alert('ERROR', e?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.greetingText}>We’re excited to see you again!</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Account Information</Text>
          <View>
            <TextInput
              placeholder={'Enter Email'}
              onChangeText={text => handleTextChange(text, 'email')}
              value={userCreds.email}
              error={errors.email}
            />
          </View>
          <View style={styles.mt20}>
            <TextInput
              placeholder={'Enter Password'}
              onChangeText={text => handleTextChange(text, 'password')}
              value={userCreds.password}
              secureTextEntry
              error={errors.password}
              showEyeIcon
            />
          </View>
          <View style={styles.linksBox}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameConstants.SIGNUP)}>
              <Text style={styles.signupText}>New User? Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.btnBox}>
          <Button
            text="Log In"
            onPress={handleSignin}
            disabled={loginFirebaseMut.isPending}
            loading={loginFirebaseMut.isPending}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;
