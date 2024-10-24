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
import { User } from '../../Types/dataType';
import styles from './style';

type UserCreds = {
  email: string;
  password: string
}
type Keys = keyof UserCreds;

const Login = ({navigation}: NativeStackScreenProps<
  RootStackParamList,
  typeof ScreenNameConstants.LOGIN
>) => {
  const [userCreds, setUserCreds] = useState<UserCreds>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<UserCreds>({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const handleTextChange = (text:string, key:Keys) => {
    const data = {...userCreds};
    const error = {...errors};
    data[key] = text;
    error[key] = '';
    setUserCreds(data);
    setErrors(error);
  };

  const isValidFields = () => {
    let isValid = true;
    const error = {...errors};

    if (!userCreds.email) {
      error.email = 'Required';
      isValid = false;
    }

    if (!userCreds.password) {
      error.password = 'Required';
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const handleSignin = async () => {
    try {
      if (!isValidFields()) return;
      setLoading(true);
      const authUser = await auth().signInWithEmailAndPassword(
        userCreds.email,
        userCreds.password,
      );
      const userDataSnapshot = await firestore()
        .collection('users')
        .doc(authUser.user.uid)
        .get();
        console.log("first", userDataSnapshot.data())
      const payload = {
        user: {...userDataSnapshot.data() as User, uid: userDataSnapshot.id}
      }
      console.log("PAYLOAD", payload.user)
      dispatch(setUser(payload));
      registerDeviceForFCM(authUser.user.uid);
    } catch (e) {
      Alert.alert('ERROR', e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder={'Enter Email'}
            onChangeText={text => handleTextChange(text, 'email')}
            value={userCreds.email}
            error={errors.email}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder={'Enter Password'}
            onChangeText={text => handleTextChange(text, 'password')}
            value={userCreds.password}
            secureTextEntry
            error={errors.password}
          />
        </View>
        <View style={styles.btnBox}>
          <Button
            text="Signin"
            onPress={handleSignin}
            disabled={loading}
            loading={loading}
          />
          <TouchableOpacity onPress={() => navigation.navigate(ScreenNameConstants.SIGNUP)}>
            <Text style={styles.link}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
