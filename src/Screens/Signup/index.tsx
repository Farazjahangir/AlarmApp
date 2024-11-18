import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useState, useRef} from 'react';
import auth from '@react-native-firebase/auth';
import firestore, {Filter} from '@react-native-firebase/firestore';
import PhoneInput from '../../Components/PhoneInput';
import parsePhoneNumber, {CountryCode} from 'libphonenumber-js';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import RNPhoneInput from 'react-native-phone-number-input';
import axios from 'axios';

import {BASE_URL} from '../../Constants';
import {removeSpaces} from '../../Utils';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import {validateEmail} from '../../Utils';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {useSignupFirebase} from '../../Hooks/reactQuery/useSignupFirebase';
import { signupSchema, validate } from '../../Utils/yup';
import { useMessageBox } from '../../Context/MessageBoxContextProvider';
import { handleError } from '../../Utils/helpers';
import styles from './style';

type User = {
  email: string;
  password: string;
  name: string;
  number: string;
};

type Keys = keyof User;

const Signup = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, ScreenNameConstants.SIGNUP>) => {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    name: '',
    number: '',
  });

  const [errors, setErrors] = useState<User>({
    email: '',
    password: '',
    name: '',
    number: '',
  });

  const phoneInputRef = useRef<RNPhoneInput>(null);
  const signupFirebaseMut = useSignupFirebase();
  const { openMessageBox } = useMessageBox()

  const handleTextChange = (text: string, key: Keys) => {
    const data = {...user};
    const errorsText = {...errors};

    data[key] = text;
    errorsText[key] = '';
    setUser(data);
    setErrors(errorsText);
  };

  const handleSignup = async () => {
    try {
      const errors = await validate(signupSchema, user)
      if (Object.keys(errors).length) {
        setErrors(errors as User);
        return
      }
      const payload = {
        countryCode: phoneInputRef.current?.getCountryCode() as CountryCode,
        user
      };
      await signupFirebaseMut.mutateAsync(payload);
      openMessageBox({
        title: "Success",
        message: 'User created successfully'
      })
      navigation.navigate(ScreenNameConstants.LOGIN);
    } catch (e) {
      console.log("SIGNUP ERRROr ", e)
      const error = handleError(e);
      openMessageBox({
        title: 'Error',
        message: error
      })
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.greetingText}>Create your account now!</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Account Information</Text>
          <View>
            <TextInput
              placeholder={'Enter Name'}
              onChangeText={text => handleTextChange(text, 'name')}
              value={user.name}
              error={errors.name}
            />
          </View>
          <View style={styles.mt20}>
            <TextInput
              placeholder={'Enter Email'}
              onChangeText={text => handleTextChange(text, 'email')}
              value={user.email}
              error={errors.email}
            />
          </View>
          <View style={styles.mt20}>
            <TextInput
              placeholder={'Enter Password'}
              onChangeText={text => handleTextChange(text, 'password')}
              value={user.password}
              secureTextEntry
              error={errors.password}
              showEyeIcon
            />
          </View>
          <View style={styles.mt20}>
            <PhoneInput
              ref={phoneInputRef}
              onChangeText={text => handleTextChange(text, 'number')}
              value={user.number}
              error={errors.number}
            />
          </View>
          <View style={styles.linksBox}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Already have a account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameConstants.LOGIN)}>
              <Text style={styles.signupText}>Log In now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.btnBox}>
          <Button
            text="Signup"
            onPress={handleSignup}
            disabled={signupFirebaseMut.isPending}
            loading={signupFirebaseMut.isPending}
          />
        </View>
      </View>
    </View>
  );
};

export default Signup;
